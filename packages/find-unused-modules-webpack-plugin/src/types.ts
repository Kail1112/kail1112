import type { Compilation, Compiler, InputFileSystem } from 'webpack';

type Hooks = Compiler['hooks'];
export type NormalModuleFactory = Parameters<Parameters<Hooks['normalModuleFactory']['tap']>[1]>[0];

export interface IConstructorOptions {
  cwd: string;
  exclude: string[];
  outside: string[];
  root: string;
}

export interface IDeferred<Result> {
  promise: Promise<Result>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  reject: (reason?: any) => void;
  resolve: (value: Result) => void;
}

export interface IParamsWithCompilation {
  compilation: Compilation;
}

interface IParamsWithFs {
  fs: InputFileSystem;
}

export interface IParamsAddModuleTree extends IParamsWithCompilation {
  filepath: string;
}

export interface IParamsFindUnusedFiles extends IParamsWithCompilation {
  files: Set<string>;
}

export interface IParamsGetPatternList {
  patterns: string[];
}

export interface IParamsScan extends IParamsWithFs {
  target: string;
}

export interface IParamsThisCompilationHandler {
  normalModuleFactory: NormalModuleFactory;
}

export interface IParamsWatchFilesHandler extends IParamsWithFs {
  list?: ReadonlySet<string>;
  type: 'modify' | 'remove';
}

export interface IStatePath {
  cwd: string;
  root: string;
}
