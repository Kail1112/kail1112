import type { CompilerOptions, ModuleKind, ModuleResolutionKind } from 'typescript';

import type { EXPORTS, OPTIONS, PACKAGE_JSON_FIELDS } from './constants.js';

export interface IOptions {
  [OPTIONS.NAME]: string;
}

interface IPackageJSONExports {
  '.': Record<EXPORTS, string>;
}
export interface IPackageJSON extends Kail1112.AnyObject {
  [PACKAGE_JSON_FIELDS.EXPORTS]: IPackageJSONExports;
  [PACKAGE_JSON_FIELDS.NAME]: string;
  [PACKAGE_JSON_FIELDS.SCRIPTS]: Record<string, string>;
}

export interface IPnpmWorkspaceYAML {
  packages: string[];
}

export interface IStatePath {
  cwd: string;
  src: string;
}

interface ITsconfigJSONCompilerOptions extends Omit<
  CompilerOptions,
  'module' | 'moduleResolution'
> {
  module?: keyof typeof ModuleKind;
  moduleResolution?: keyof typeof ModuleResolutionKind | 'node';
}
export interface ITsconfigJSON {
  compilerOptions?: ITsconfigJSONCompilerOptions;
  exclude?: string[];
  extends?: string | string[];
  include?: string[];
}
