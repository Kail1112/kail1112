#!/usr/bin/env node
import { transformFile } from '@swc/core';
import { existsSync, watch } from 'fs';
import { mkdir, writeFile } from 'fs/promises';
import { globSync } from 'glob';
import { minimatch } from 'minimatch';
import path from 'path';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

import { ensureEnv } from '../utils.js';

import { OPTIONS, TYPES, TYPES_MAP } from './constants.js';
import type { IOptions, IOutput, IParamsOutput, IStatePath } from './types.js';

class BuildPackage {
  private path: IStatePath = { build: '', src: '' };
  private pattern = '**/*.{js,ts}';

  constructor(private options: IOptions) {
    this.init();
  }

  private async generate(filepath: string): Promise<void> {
    const { types } = this.options;

    const outputs: Promise<IOutput>[] = [];

    for (const type of types) {
      const output = this.output({ filepath, type });
      const promise = transformFile(filepath, {
        filename: filepath,
        jsc: { parser: { syntax: 'typescript' }, target: 'es2022' },
        module: { resolveFully: true, type: TYPES_MAP[type] },
        sourceMaps: false,
      }).then(({ code }) => {
        return { filepath: output, source: code };
      });

      outputs.push(promise);
    }

    const result = await Promise.all(outputs);

    await Promise.all(
      result.map((output) => {
        return this.save(output);
      }),
    );
  }

  private init(): void {
    ensureEnv();

    const { OUTPUT_DIRNAME, SOURCE_DIRNAME } = process.env;

    Object.assign(this.path, {
      build: path.resolve(OUTPUT_DIRNAME),
      src: path.resolve(SOURCE_DIRNAME),
    });
  }

  private output({ filepath, type }: IParamsOutput): string {
    const { build } = this.path;

    const relative = this.relative(filepath);

    return path.resolve(build, type, relative);
  }

  private relative(filepath: string): string {
    const { src } = this.path;

    const { base: _, ...parsed } = path.parse(filepath);
    const formated = path.format({ ...parsed, ext: 'js' });

    return path.relative(src, formated);
  }

  private async save({ filepath, source }: IOutput): Promise<void> {
    const directory = path.dirname(filepath);

    if (!existsSync(directory)) {
      await mkdir(directory, { recursive: true });
    }

    await writeFile(filepath, source, 'utf8');
  }

  async run(): Promise<void> {
    const { [OPTIONS.WATCH]: watchOption } = this.options;
    const { src } = this.path;

    const { SOURCE_DIRNAME } = process.env;

    const files = globSync(`${SOURCE_DIRNAME}/${this.pattern}`, {
      absolute: true,
      dot: true,
      nodir: true,
    });
    const promises = files.map((filepath) => {
      return this.generate(filepath);
    });

    await Promise.all(promises);

    if (!watchOption) {
      return;
    }

    watch(src, { recursive: true }, (event, filename) => {
      if (!filename) {
        return;
      }

      const filepath = path.resolve(src, filename);
      const skip = !minimatch(filepath, this.pattern);

      if (skip) {
        return;
      }

      const isChange = event === 'change';
      const isRename = !isChange && existsSync(filepath);

      if (isChange || isRename) {
        void this.generate(filepath);
      }
    });
  }
}

const options = yargs(hideBin(process.argv))
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
    [OPTIONS.WATCH]: { default: false, demandOption: true, type: 'boolean' },
  })
  .help()
  .version(false)
  .parseSync();
const builder = new BuildPackage(options);

void builder.run();
