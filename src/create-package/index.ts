#!/usr/bin/env node
import { existsSync, readFileSync } from 'fs';
import { mkdir, writeFile } from 'fs/promises';
import globParent from 'glob-parent';
import path from 'path';
import { parse } from 'yaml';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

import { ensureEnv, normalizePath } from '../utils.js';

import {
  ENTRIES_MAP_BY_EXPORTS,
  EXPORTS,
  EXPORTS_MAP_BY_TYPES,
  FILENAMES,
  OPTIONS,
  PACKAGE_JSON_FIELDS,
} from './constants.js';
import type {
  IOptions,
  IPackageJSON,
  IPnpmWorkspaceYAML,
  IStatePath,
  ITsconfigJSON,
} from './types.js';

ensureEnv();

class CreatePackage {
  private path: IStatePath = { cwd: '', src: '' };
  private root = path.resolve(import.meta.dirname, '../..');

  constructor(private options: IOptions) {
    this.init();
  }

  get packageJSON(): IPackageJSON {
    const { [OPTIONS.NAME]: nameOption } = this.options;

    const { OUTPUT_DIRNAME } = process.env;

    const string = this.reader(FILENAMES.PACKAGE_JSON);
    const json = JSON.parse(string) as IPackageJSON;
    const { [PACKAGE_JSON_FIELDS.NAME]: nameScope } = json;

    const exports = Object.values(EXPORTS).reduce<Record<string, string>>((acc, value) => {
      const result = [
        '.',
        OUTPUT_DIRNAME,
        EXPORTS_MAP_BY_TYPES[value],
        ENTRIES_MAP_BY_EXPORTS[value],
      ].join('/');

      return { ...acc, [value]: result };
    }, {});

    return Object.values(PACKAGE_JSON_FIELDS).reduce<IPackageJSON>(
      (acc, field) => {
        acc[field] ??= json[field];

        return acc;
      },
      {
        [PACKAGE_JSON_FIELDS.EXPORTS]: { '.': exports },
        [PACKAGE_JSON_FIELDS.NAME]: `@${nameScope}/${nameOption}`,
        [PACKAGE_JSON_FIELDS.SCRIPTS]: {
          build: 'build-package --clear',
          dev: 'pnpm build --watch',
        },
      },
    );
  }

  get pnpmWorkspaceYAML(): IPnpmWorkspaceYAML {
    return parse(this.reader(FILENAMES.PNPM_WORKSPACE_YAML)) as IPnpmWorkspaceYAML;
  }

  get tsconfigJSON(): ITsconfigJSON {
    const { cwd } = this.path;

    const { OUTPUT_DIRNAME, SOURCE_DIRNAME } = process.env;

    const tsconfig = path.resolve(this.root, FILENAMES.TSCONFIG_JSON);
    const relative = path.relative(cwd, tsconfig);

    return {
      compilerOptions: {
        declaration: true,
        declarationMap: true,
        emitDeclarationOnly: true,
        module: 'ES2022',
        moduleResolution: 'node',
        outDir: `./${OUTPUT_DIRNAME}/${EXPORTS_MAP_BY_TYPES[EXPORTS.TYPES]}`,
      },
      exclude: ['node_modules', OUTPUT_DIRNAME],
      extends: normalizePath(relative),
      include: [`${SOURCE_DIRNAME}/**/*.ts`],
    };
  }

  private init(): void {
    ensureEnv();

    const { [OPTIONS.NAME]: name } = this.options;

    const { SOURCE_DIRNAME } = process.env;

    const {
      packages: [pattern = ''],
    } = this.pnpmWorkspaceYAML;
    const workspace = globParent(path.resolve(this.root, pattern));
    const cwd = path.resolve(workspace, name);

    Object.assign(this.path, { cwd, src: path.resolve(cwd, SOURCE_DIRNAME) });
  }

  private reader(filename: string): string {
    const filepath = path.resolve(this.root, filename);

    return readFileSync(filepath, 'utf8');
  }

  private stringify(filename: FILENAMES): string {
    let target;

    switch (filename) {
      case FILENAMES.PACKAGE_JSON:
        target = this.packageJSON;
        break;

      default:
        target = this.tsconfigJSON;
        break;
    }

    return JSON.stringify(target, null, '\t');
  }

  private async save(): Promise<void> {
    const { cwd, src } = this.path;

    if (!existsSync(src)) {
      await mkdir(src, { recursive: true });
    }

    const filenames = [FILENAMES.PACKAGE_JSON, FILENAMES.TSCONFIG_JSON];
    const promises = filenames.map((filename) => {
      const filepath = path.resolve(cwd, filename);
      const data = this.stringify(filename);

      return writeFile(filepath, data);
    });

    await Promise.all(promises);
  }

  async run(): Promise<void> {
    await this.save();
  }
}

const options = yargs(hideBin(process.argv))
  .parserConfiguration({
    'dot-notation': false,
    'parse-positional-numbers': false,
    'short-option-groups': false,
  })
  .options({
    [OPTIONS.NAME]: {
      demandOption: true,
      type: 'string',
    },
  })
  .help()
  .version(false)
  .parseSync();
const creator = new CreatePackage(options);

void creator.run();
