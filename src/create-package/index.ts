#!/usr/bin/env node
import fs from 'fs';
import path from 'path';

import globParent from 'glob-parent';
import { parse } from 'yaml';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

import { ensureEnv } from '../utils.js';

import {
  FILENAMES,
  PACKAGE_JSON_FIELDS,
  ROOT_PATH,
  ROOT_PATHS,
  TSCONFIG_COMPILER_OPTIONS_FIELDS,
  TSCONFIG_FIELDS,
} from './constants.js';
import type { IPackageJSON, ITsconfigJSON } from './types.js';

ensureEnv();

enum OPTIONS {
  NAME = 'name',
}

const { OUTPUT_DIRNAME, SOURCE_DIRNAME } = process.env;

const PACKAGE_JSON = JSON.parse(fs.readFileSync(ROOT_PATHS.PACKAGE_JSON, { encoding: 'utf-8' }));
const {
  packages: [PACKAGES_PATTERN],
} = parse(fs.readFileSync(ROOT_PATHS.PNPM_WORKSPACE_YAML, { encoding: 'utf-8' }));
const TSCONFIG = JSON.parse(fs.readFileSync(ROOT_PATHS.TSCONFIG_JSON, { encoding: 'utf-8' }));

const { [OPTIONS.NAME]: name } = yargs(hideBin(process.argv))
  .parserConfiguration({
    'dot-notation': false,
    'parse-positional-numbers': false,
    'short-option-groups': false,
  })
  .options({
    [OPTIONS.NAME]: {
      type: 'string',
      demandOption: true,
    },
  })
  .help()
  .version(false)
  .parseSync();

const PACKAGE_PATH = globParent(path.join(ROOT_PATH, PACKAGES_PATTERN));
const PACKAGE_PATHS = {
  PACKAGE_JSON: path.resolve(PACKAGE_PATH, name, FILENAMES.PACKAGE_JSON),
  SOURCE_PATH: path.resolve(PACKAGE_PATH, name, SOURCE_DIRNAME),
  TSCONFIG_JSON: path.resolve(PACKAGE_PATH, name, FILENAMES.TSCONFIG_JSON),
};

const packageJSON = Object.values(PACKAGE_JSON_FIELDS).reduce<IPackageJSON>(
  (acc, key) => {
    acc[key] ??= PACKAGE_JSON[key];

    return acc;
  },
  {
    [PACKAGE_JSON_FIELDS.EXPORTS]: {
      '.': {
        import: `./${OUTPUT_DIRNAME}/esm/index.js`,
        require: `./${OUTPUT_DIRNAME}/cjs/index.cjs`,
        types: `./${OUTPUT_DIRNAME}/types/index.d.ts`,
      },
    },
    [PACKAGE_JSON_FIELDS.NAME]: `@${PACKAGE_JSON[PACKAGE_JSON_FIELDS.NAME]}/${name}`,
    [PACKAGE_JSON_FIELDS.SCRIPTS]: {
      build: 'pnpm clean && build-package && tsc',
      clean: 'shx rm -rf build'
    },
  },
);
const tsconfigJSON = Object.values(TSCONFIG_FIELDS).reduce<ITsconfigJSON>(
  (acc, key) => {
    switch (key) {
      case TSCONFIG_FIELDS.COMPILER_OPTIONS:
        acc[key] = {
          ...TSCONFIG[key],
          [TSCONFIG_COMPILER_OPTIONS_FIELDS.DECLARATION]: true,
          [TSCONFIG_COMPILER_OPTIONS_FIELDS.DECLARATION_MAP]: true,
          [TSCONFIG_COMPILER_OPTIONS_FIELDS.EMIT_DECLARATION_ONLY]: true,
          [TSCONFIG_COMPILER_OPTIONS_FIELDS.OUT_DIR]: `./${OUTPUT_DIRNAME}/types`,
        };
        break;

      default:
        acc[key] ??= TSCONFIG[key];
        break;
    }

    return acc;
  },
  {
    [TSCONFIG_FIELDS.EXCLUDE]: ['node_modules', OUTPUT_DIRNAME],
    [TSCONFIG_FIELDS.INCLUDE]: [`${SOURCE_DIRNAME}/**/*.ts`],
  },
);

if (!fs.existsSync(PACKAGE_PATHS.SOURCE_PATH)) {
  fs.mkdirSync(PACKAGE_PATHS.SOURCE_PATH, { recursive: true });
}

fs.writeFileSync(PACKAGE_PATHS.PACKAGE_JSON, JSON.stringify(packageJSON), {});
fs.writeFileSync(PACKAGE_PATHS.TSCONFIG_JSON, JSON.stringify(tsconfigJSON));
