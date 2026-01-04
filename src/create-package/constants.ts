import path from 'path';

export enum FILENAMES {
  PACKAGE_JSON = 'package.json',
  PNPM_WORKSPACE_YAML = 'pnpm-workspace.yaml',
  TSCONFIG_JSON = 'tsconfig.json',
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

export enum TSCONFIG_COMPILER_OPTIONS_FIELDS {
  DECLARATION = 'declaration',
  DECLARATION_MAP = 'declarationMap',
  EMIT_DECLARATION_ONLY = 'emitDeclarationOnly',
  MODULE = 'module',
  MODULE_RESOLUTION = 'moduleResolution',
  OUT_DIR = 'outDir',
}

export enum TSCONFIG_FIELDS {
  COMPILER_OPTIONS = 'compilerOptions',
  EXCLUDE = 'exclude',
  INCLUDE = 'include',
}

export const ROOT_PATH = path.resolve(import.meta.dirname, '../..');
export const ROOT_PATHS = {
  PACKAGE_JSON: path.resolve(ROOT_PATH, FILENAMES.PACKAGE_JSON),
  PNPM_WORKSPACE_YAML: path.resolve(ROOT_PATH, FILENAMES.PNPM_WORKSPACE_YAML),
  TSCONFIG_JSON: path.resolve(ROOT_PATH, FILENAMES.TSCONFIG_JSON),
};
