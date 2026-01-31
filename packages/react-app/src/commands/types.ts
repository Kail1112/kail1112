/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Argv } from 'yargs';

export type GetCommandArguments<Target extends { builder: (yargs: Argv) => any }> = ReturnType<
  ReturnType<Target['builder']>['parseSync']
>;
/* eslint-enable */
