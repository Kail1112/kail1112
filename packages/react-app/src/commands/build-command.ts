import { MODES, OPTIONS } from '../constants';

import { COMMANDS } from './constants';
import type { GetCommandArguments } from './types';
import { createCommand } from './utils';

export type BuildCommandArguments = GetCommandArguments<typeof BUILD_COMMAND>;

export const BUILD_COMMAND = createCommand({
  command: COMMANDS.BUILD,
  options: {
    [OPTIONS.COMMAND]: {
      default: COMMANDS.BUILD,
      hidden: true,
      type: 'string',
    },
    [OPTIONS.MODE]: {
      choices: Object.values(MODES),
      default: MODES.DEVELOPMENT,
      demandOption: true,
      type: 'string',
    },
  },
});
