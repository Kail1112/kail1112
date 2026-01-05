import { TYPES } from '../constants.js';

export enum EXPORTS {
  IMPORT = 'import',
  REQUIRE = 'require',
  TYPES = 'types',
}
export const ENTRIES_MAP_BY_EXPORTS = {
  [EXPORTS.IMPORT]: 'index.js',
  [EXPORTS.REQUIRE]: 'index.cjs',
  [EXPORTS.TYPES]: 'index.d.ts',
};
export const EXPORTS_MAP_BY_TYPES = {
  [EXPORTS.IMPORT]: TYPES.ESM,
  [EXPORTS.REQUIRE]: TYPES.CJS,
  [EXPORTS.TYPES]: 'types',
};

export enum FILENAMES {
  PACKAGE_JSON = 'package.json',
  PNPM_WORKSPACE_YAML = 'pnpm-workspace.yaml',
  TSCONFIG_JSON = 'tsconfig.json',
}

export enum OPTIONS {
  NAME = 'name',
}

export enum PACKAGE_JSON_FIELDS {
  AUTHOR = 'author',
  BUGS = 'bugs',
  ENGINES = 'engines',
  EXPORTS = 'exports',
  HOMEPAGE = 'homepage',
  LICENSE = 'license',
  NAME = 'name',
  SCRIPTS = 'scripts',
  VERSION = 'version',
}
