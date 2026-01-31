#!/usr/bin/env node
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

import { BUILD_COMMAND, type BuildCommandArguments } from './commands/build-command';
import { BuildScript } from './scripts/build-script';

const commands = yargs(hideBin(process.argv))
  .parserConfiguration({
    'dot-notation': false,
    'parse-positional-numbers': false,
    'short-option-groups': false,
  })
  .command(BUILD_COMMAND)
  .help()
  .version(false);

((): void => {
  const options = commands.parseSync() as BuildCommandArguments;

  const script = new BuildScript(options);

  script.run();
})();
