import { minimatch } from 'minimatch';
import path from 'path';
import {
  Compilation,
  type Compiler,
  type InputFileSystem,
  type Module,
  NormalModule,
  type WebpackPluginInstance,
} from 'webpack';
import PrefetchDependency from 'webpack/lib/dependencies/PrefetchDependency';

import type {
  IConstructorOptions,
  IDeferred,
  IParamsAddModuleTree,
  IParamsFindUnusedFiles,
  IParamsGetPatternList,
  IParamsScan,
  IParamsThisCompilationHandler,
  IParamsWatchFilesHandler,
  IParamsWithCompilation,
  IStatePath,
} from './types';

class FindUnusedModulesPlugin implements WebpackPluginInstance {
  static name = 'FindUnusedModulesPlugin' as const;

  private files = new Set<string>();
  private options: IConstructorOptions = { cwd: '.', exclude: [], outside: [], root: '' };
  private path: IStatePath = { cwd: process.cwd(), root: process.cwd() };

  constructor(options?: Partial<IConstructorOptions>) {
    const {
      cwd = '.',
      exclude = ['**/*.md', '**/*.d.ts', '**/types.{js,ts}', '**/*.types.{js,ts}'],
      outside = [],
      root = process.cwd(),
    } = options ?? {};

    this.options = { ...options, cwd, exclude, outside, root };
  }

  get excludeFiles(): string[] {
    const { exclude } = this.options;

    return this.getPatternList({ patterns: exclude });
  }

  get outsideFiles(): string[] {
    const { outside } = this.options;

    return this.getPatternList({ patterns: outside });
  }

  addModuleTree({ compilation, filepath }: IParamsAddModuleTree): Promise<Module> {
    const { promise, reject, resolve } = this.makeDeferred<Module>();
    const {
      compiler: { context },
    } = compilation;

    const dependency = new PrefetchDependency(filepath);

    compilation.addModuleTree({ context, dependency }, (error, module) => {
      if (error || !module) {
        reject(error ?? new Error('Module not found'));

        return;
      }

      resolve(module);
    });

    return promise;
  }

  analyzeModules({ compilation }: IParamsWithCompilation): Set<string> {
    const { modules } = compilation;

    const unusedFiles = structuredClone(this.files);

    modules.forEach((module) => {
      const resource = module instanceof NormalModule ? module.resource : undefined;

      if (!resource || !unusedFiles.has(resource)) {
        return;
      }

      unusedFiles.delete(resource);
    });

    return unusedFiles;
  }

  apply(compiler: Compiler): void {
    const { name } = FindUnusedModulesPlugin;

    compiler.hooks.initialize.tap(name, this.initializeHandler.bind(this, compiler));

    compiler.hooks.make.tapPromise(name, this.makeHandler.bind(this));

    compiler.hooks.thisCompilation.tap(name, this.thisCompilationHandler.bind(this));

    compiler.hooks.watchRun.tap(name, this.watchRunHandler.bind(this));
  }

  findUnusedFiles({ compilation, files }: IParamsFindUnusedFiles): void {
    let message = '';

    files.forEach((filepath) => {
      const skip = this.excludeFiles.some((pattern) => {
        return minimatch(filepath, pattern);
      });

      if (skip) {
        return;
      }

      const relative = this.relative(filepath);

      message += `\n  - ${relative}`;
    });

    compilation.warnings.push(new Error(`Found unused files: ${message}`));
  }

  getPatternList({ patterns }: IParamsGetPatternList): string[] {
    const { cwd } = this.path;

    return patterns.map((pattern) => {
      return path.resolve(cwd, pattern);
    });
  }

  initializeHandler(compiler: Compiler): void {
    const { cwd: cwdOption, root: rootOption } = this.options;

    this.path.root = rootOption || compiler.context;
    this.path.cwd = path.resolve(this.path.root, cwdOption);
  }

  async makeHandler(compilation: Compilation): Promise<void> {
    const promises: Promise<Module>[] = [];

    this.files.forEach((filepath) => {
      const outside = this.outsideFiles.some((pattern) => {
        return minimatch(filepath, pattern);
      });

      if (!outside) {
        return;
      }

      promises.push(this.addModuleTree({ compilation, filepath }));
    });

    await Promise.all(promises);
  }

  makeDeferred<Result>(): IDeferred<Result> {
    const deferred = {} as IDeferred<Result>;

    deferred.promise = new Promise((resolve, reject) => {
      deferred.resolve = resolve;
      deferred.reject = reject;
    });

    return deferred;
  }

  processAssetsHandler(compilation: Compilation): void {
    const files = this.analyzeModules({ compilation });

    this.findUnusedFiles({ compilation, files });
  }

  relative(filepath: string): string {
    const { root } = this.path;

    return path.relative(root, filepath);
  }

  scan({ fs, target }: IParamsScan): void {
    if (!this.validateFs(fs)) {
      return;
    }

    const stats = fs.statSync(target);

    if (stats.isDirectory()) {
      const children = fs.readdirSync(target);

      for (const child of children) {
        this.scan({ fs, target: path.resolve(target, child) });
      }
    }

    if (stats.isFile()) {
      this.files.add(target);
    }
  }

  thisCompilationHandler(
    compilation: Compilation,
    { normalModuleFactory }: IParamsThisCompilationHandler,
  ): void {
    /* eslint-disable unicorn/consistent-destructuring */
    const { cwd } = this.path;

    const { inputFileSystem: fs } = compilation;

    compilation.contextDependencies.add(cwd);
    compilation.dependencyFactories.set(PrefetchDependency, normalModuleFactory);

    this.scan({ fs, target: cwd });

    compilation.hooks.processAssets.tap(
      { name: FindUnusedModulesPlugin.name, stage: Compilation.PROCESS_ASSETS_STAGE_ANALYSE },
      this.processAssetsHandler.bind(this, compilation),
    );
    /* eslint-enable */
  }

  validateFs(fs: InputFileSystem): fs is Required<InputFileSystem> {
    const methods = [fs.statSync, fs.readdirSync];

    return methods.every((method) => {
      return typeof method === 'function';
    });
  }

  watchFilesHandler({ fs, list, type }: IParamsWatchFilesHandler): void {
    if (!this.validateFs(fs) || typeof list === 'undefined') {
      return;
    }

    list.forEach((item) => {
      if (type === 'remove') {
        this.files.delete(item);

        return;
      }

      const stats = fs.statSync(item);

      if (!stats.isFile()) {
        return;
      }

      this.files.add(item);
    });
  }

  watchRunHandler(compiler: Compiler): void {
    const { inputFileSystem: fs, modifiedFiles, removedFiles } = compiler;

    if (fs === null) {
      return;
    }

    this.watchFilesHandler({ fs, list: modifiedFiles, type: 'modify' });
    this.watchFilesHandler({ fs, list: removedFiles, type: 'remove' });
  }
}

export default FindUnusedModulesPlugin;
