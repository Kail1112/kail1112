import type {
  PACKAGE_JSON_FIELDS,
  TSCONFIG_FIELDS,
  TSCONFIG_COMPILER_OPTIONS_FIELDS,
} from './constants.js';

type PackageJSON = typeof import('../../package.json');
interface IPackageJSONDefaultExport {
  import: string;
  require: string;
  types: string;
}
interface IPackageJSONExports {
  '.': IPackageJSONDefaultExport;
}
export interface IPackageJSON extends Partial<Omit<PackageJSON, 'exports' | 'name' | 'scripts'>> {
  [PACKAGE_JSON_FIELDS.EXPORTS]: IPackageJSONExports;
  [PACKAGE_JSON_FIELDS.NAME]: string;
  [PACKAGE_JSON_FIELDS.SCRIPTS]: Record<string, string>;
}

type TsconfigJSON = typeof import('../../tsconfig.json');
type TsconfigJSONCompilerOptions = TsconfigJSON['compilerOptions'];
interface ITsconfigJSONCompilerOptions extends TsconfigJSONCompilerOptions {
  [TSCONFIG_COMPILER_OPTIONS_FIELDS.DECLARATION]: boolean;
  [TSCONFIG_COMPILER_OPTIONS_FIELDS.DECLARATION_MAP]: boolean;
  [TSCONFIG_COMPILER_OPTIONS_FIELDS.EMIT_DECLARATION_ONLY]: boolean;
  [TSCONFIG_COMPILER_OPTIONS_FIELDS.OUT_DIR]: string;
}
export interface ITsconfigJSON extends Partial<Omit<TsconfigJSON, 'compilerOptions'>> {
  [TSCONFIG_FIELDS.COMPILER_OPTIONS]?: ITsconfigJSONCompilerOptions;
}
