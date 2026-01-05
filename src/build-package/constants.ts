import type { ModuleConfig } from '@swc/core';

import { TYPES } from '../constants.js';

export enum OPTIONS {
  CLEAR = 'clear',
  TYPES = 'types',
  WATCH = 'watch',
}

export const TYPES_MAP: Record<TYPES, ModuleConfig['type']> = {
  [TYPES.CJS]: 'commonjs',
  [TYPES.ESM]: 'es6',
};
