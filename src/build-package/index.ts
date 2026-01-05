#!/usr/bin/env node
import { transformFile } from '@swc/core';
import { existsSync, readdirSync, rmSync, watch } from 'fs';
import { mkdir, writeFile } from 'fs/promises';
import { minimatch } from 'minimatch';
import path from 'path';
import typescript from 'typescript';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

import { ensureEnv } from '../utils.js';

import { OPTIONS, TYPES, TYPES_MAP } from './constants.js';
import type { IOptions, IOutput, IParamsOutput, IStatePath } from './types.js';

class BuildPackage {
  private path: IStatePath = { build: '', src: '', tsconfig: path.resolve('tsconfig.json') };
  private pattern = '';

  constructor(private options: IOptions) {
    this.init();
  }

  private async generate(filepath: string): Promise<void> {
    const { [OPTIONS.TYPES]: typesOption } = this.options;
    const { tsconfig } = this.path;

    const host = typescript.createSolutionBuilderHost(typescript.sys);
    const builder = typescript.createSolutionBuilder(host, [tsconfig], {});
    const outputs: Promise<IOutput>[] = [];

    for (const type of typesOption) {
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

    builder.build();
  }

  private init(): void {
    ensureEnv();

    const { OUTPUT_DIRNAME, SOURCE_DIRNAME } = process.env;

    Object.assign(this.path, {
      build: path.resolve(OUTPUT_DIRNAME),
      src: path.resolve(SOURCE_DIRNAME),
    });

    this.pattern = `**/${SOURCE_DIRNAME}/**/*.{js,ts}`;
  }

  private match(filepath: string): boolean {
    const normalized = path.normalize(filepath);
    const replaced = normalized.replaceAll(path.sep, '/');

    return minimatch(replaced, this.pattern);
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

  private watch(): void {
    const { [OPTIONS.WATCH]: watchOption } = this.options;
    const { src, tsconfig } = this.path;

    if (!watchOption) {
      return;
    }

    const host = typescript.createWatchCompilerHost(
      tsconfig,
      {},
      typescript.sys,
      typescript.createEmitAndSemanticDiagnosticsBuilderProgram,
    );

    watch(src, { recursive: true }, (event, filename) => {
      if (!filename) {
        return;
      }

      const filepath = path.resolve(src, filename);
      const skip = !this.match(filepath);

      if (skip) {
        return;
      }

      const isChange = event === 'change';
      const isRename = !isChange && existsSync(filepath);

      if (isChange || isRename) {
        void this.generate(filepath);
      }
    });
    typescript.createWatchProgram(host);
  }

  async run(): Promise<void> {
    const { [OPTIONS.CLEAR]: clearOption } = this.options;
    const { build, src } = this.path;

    if (clearOption) {
      rmSync(build, { force: true, recursive: true });
    }

    const objects = readdirSync(src, { recursive: true });
    const promises = objects.reduce<Promise<void>[]>((acc, object) => {
      if (typeof object === 'string') {
        const filepath = path.resolve(src, object);

        if (this.match(filepath)) {
          acc.push(this.generate(filepath));
        }
      }

      return acc;
    }, []);

    await Promise.all(promises);

    this.watch();
  }
}

const options = yargs(hideBin(process.argv))
  .parserConfiguration({
    'dot-notation': false,
    'parse-positional-numbers': false,
    'short-option-groups': false,
  })
  .options({
    [OPTIONS.CLEAR]: { default: false, demandOption: true, type: 'boolean' },
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
