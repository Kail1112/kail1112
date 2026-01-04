#!/usr/bin/env node
import { type ModuleConfig, transformFile } from '@swc/core';
import fs from 'fs';
import { globSync } from 'glob';
import path from 'path';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

import { ensureEnv } from '../utils.js';

ensureEnv();

enum OPTIONS {
  TYPES = 'types',
}
enum TYPES {
  CJS = 'cjs',
  ESM = 'esm',
}

interface IGenerateParams {
  filepath: string;
  type: TYPES;
}
interface IGenerateResult {
  code: string;
  filepath: string;
}
type Generate = (params: IGenerateParams) => Promise<IGenerateResult>;

const { OUTPUT_DIRNAME, SOURCE_DIRNAME } = process.env;

const PATHS = {
  BUILD: path.resolve(OUTPUT_DIRNAME),
  SRC: path.resolve(SOURCE_DIRNAME),
};
const TYPES_MAP: Record<TYPES, Pick<ModuleConfig, 'type'>['type']> = {
  [TYPES.CJS]: 'commonjs',
  [TYPES.ESM]: 'es6',
};

const generate: Generate = async ({ filepath: filepathParam, type }) => {
  const { base: _, ...parsed } = path.parse(filepathParam);
  const formated = path.format({ ...parsed, ext: 'js' });
  const relative = path.relative(PATHS.SRC, formated);

  const { code } = await transformFile(filepathParam, {
    filename: filepathParam,
    jsc: { parser: { syntax: 'typescript' }, target: 'es2022' },
    module: { resolveFully: true, type: TYPES_MAP[type] },
    sourceMaps: false,
  });

  return { code, filepath: path.resolve(PATHS.BUILD, type, relative) };
};

const { [OPTIONS.TYPES]: types } = yargs(hideBin(process.argv))
  .parserConfiguration({
    'dot-notation': false,
    'parse-positional-numbers': false,
    'short-option-groups': false,
  })
  .options({
    [OPTIONS.TYPES]: {
      choices: [TYPES.CJS, TYPES.ESM],
      default: [TYPES.CJS, TYPES.ESM],
      demandOption: true,
      type: 'array',
    },
  })
  .help()
  .version(false)
  .parseSync();

void (async (): Promise<void> => {
  const files = globSync(`${SOURCE_DIRNAME}/**/*.ts`, { absolute: true, dot: true, nodir: true });
  const promises: Promise<IGenerateResult>[] = [];

  for (const type of types) {
    for (const filepath of files) {
      promises.push(generate({ filepath, type }));
    }
  }

  if (fs.existsSync(PATHS.BUILD)) {
    fs.rmdirSync(PATHS.BUILD);
  }

  const result = await Promise.all(promises);

  for (const { code, filepath } of result) {
    const directory = path.dirname(filepath);

    if (!fs.existsSync(directory)) {
      fs.mkdirSync(directory, { recursive: true });
    }

    fs.writeFileSync(filepath, code, 'utf8');
  }
})();
