import type { OPTIONS, TYPES } from './constants.js';

export interface IOptions {
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
}
