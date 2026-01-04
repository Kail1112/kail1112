declare module 'webpack/lib/dependencies/PrefetchDependency' {
  import type { Dependency } from 'webpack';

  class PrefetchDependency extends Dependency {
    constructor(request: string);
  }

  export default PrefetchDependency;
}
