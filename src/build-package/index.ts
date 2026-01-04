#!/usr/bin/env node
import fs from 'fs';
import path from 'path';

import { type ModuleConfig, transformFile } from '@swc/core';
import { globSync } from 'glob';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

enum OPTIONS {
  TYPES = 'types',
}
enum TYPES {
  CJS = 'cjs',
  ESM = 'esm',
}

type ExtractExtension<Target> =
  Target extends Partial<Record<'outFileExtension', infer Extension>> ? Extension : never;
type Extensions = ExtractExtension<ModuleConfig>;

interface IGenerateParams {
  filepath: string;
  type: TYPES;
}
interface IGenerateResult {
  code: string;
  filepath: string;
}
type Generate = (params: IGenerateParams) => Promise<IGenerateResult>;

const EXTENSIONS_MAP: Record<TYPES, Extensions> = {
  [TYPES.CJS]: 'cjs',
  [TYPES.ESM]: 'js',
};
const PATHS = {
  BUILD: path.resolve('build'),
  SRC: path.resolve('src'),
};
const TYPES_MAP: Record<TYPES, Pick<ModuleConfig, 'type'>['type']> = {
  [TYPES.CJS]: 'commonjs',
  [TYPES.ESM]: 'es6',
};

const generate: Generate = async ({ filepath: filepathParam, type }) => {
  const extension = EXTENSIONS_MAP[type];

  const { base: _, ...parsed } = path.parse(filepathParam);
  const formated = path.format({ ...parsed, ext: extension });
  const relative = path.relative(PATHS.SRC, formated);

  const { code } = await transformFile(filepathParam, {
    filename: filepathParam,
    jsc: { parser: { syntax: 'typescript' }, target: 'es2022' },
    module: { outFileExtension: extension, resolveFully: true, type: TYPES_MAP[type] },
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
      type: 'array',
      demandOption: true,
      choices: [TYPES.CJS, TYPES.ESM],
      default: [TYPES.CJS, TYPES.ESM],
    },
  })
  .help()
  .version(false)
  .parseSync();

(async () => {
  const files = globSync('src/**/*.ts', { absolute: true, nodir: true, dot: true });
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

  for (const { filepath, code } of result) {
    const directory = path.dirname(filepath);

    if (!fs.existsSync(directory)) {
      fs.mkdirSync(directory, { recursive: true });
    }

    fs.writeFileSync(filepath, code, 'utf8');
  }
})();
