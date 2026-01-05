import type { TYPES } from '../constants.js';

import type { OPTIONS } from './constants.js';

export interface IOptions {
  [OPTIONS.CLEAR]: boolean;
  [OPTIONS.TYPES]: TYPES[];
  [OPTIONS.WATCH]: boolean;
}

export interface IOutput {
  filepath: string;
  source: string;
}

export interface IParamsOutput {
  filepath: string;
  type: TYPES;
}

export interface IStatePath {
  build: string;
  src: string;
  tsconfig: string;
}
