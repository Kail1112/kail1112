import type {
  PACKAGE_JSON_FIELDS,
  TSCONFIG_COMPILER_OPTIONS_FIELDS,
  TSCONFIG_FIELDS,
} from './constants.js';

interface IPackageJSONDefaultExport {
  import: string;
  require: string;
  types: string;
}
interface IPackageJSONExports {
  '.': IPackageJSONDefaultExport;
}
export interface IPackageJSON extends Kail1112.AnyObject {
  [PACKAGE_JSON_FIELDS.EXPORTS]: IPackageJSONExports;
  [PACKAGE_JSON_FIELDS.NAME]: string;
  [PACKAGE_JSON_FIELDS.SCRIPTS]: Record<string, string>;
}

interface ITsconfigJSONCompilerOptions extends Kail1112.AnyObject {
  [TSCONFIG_COMPILER_OPTIONS_FIELDS.DECLARATION]: boolean;
  [TSCONFIG_COMPILER_OPTIONS_FIELDS.DECLARATION_MAP]: boolean;
  [TSCONFIG_COMPILER_OPTIONS_FIELDS.EMIT_DECLARATION_ONLY]: boolean;
  [TSCONFIG_COMPILER_OPTIONS_FIELDS.OUT_DIR]: string;
}
export interface ITsconfigJSON extends Kail1112.AnyObject {
  [TSCONFIG_FIELDS.COMPILER_OPTIONS]?: ITsconfigJSONCompilerOptions;
}

export interface IPnpmWorkspaceYAML {
  packages: string[];
}
