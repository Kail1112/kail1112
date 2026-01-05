import type { ModuleConfig } from '@swc/core';

export enum OPTIONS {
  CLEAR = 'clear',
  TYPES = 'types',
  WATCH = 'watch',
}

export enum TYPES {
  CJS = 'cjs',
  ESM = 'esm',
}

export const TYPES_MAP: Record<TYPES, ModuleConfig['type']> = {
  [TYPES.CJS]: 'commonjs',
  [TYPES.ESM]: 'es6',
};
