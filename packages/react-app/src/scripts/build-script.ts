import type { BuildCommandArguments } from '../commands/build-command';

import type { IScript } from './types';

export class BuildScript implements IScript {
  constructor(private options: BuildCommandArguments) {}

  run(): void {
    // eslint-disable-next-line no-console
    console.log(this.options);
  }
}
