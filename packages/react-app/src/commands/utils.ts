import type { Argv } from 'yargs';

interface ICreateCommandParams<Options> {
  command: string;
  options: Options;
}

/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-function-return-type */
export const createCommand = <Options extends Record<string, any>>({
  command,
  options,
}: ICreateCommandParams<Options>) => {
  return { builder: (yargs: Argv) => yargs.options(options), command, handler: (): void => {} };
};
/* eslint-enable */
