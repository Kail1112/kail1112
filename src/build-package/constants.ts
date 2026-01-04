import type { ModuleConfig } from '@swc/core';

export enum OPTIONS {
  TYPES = 'types',
  WATCH = 'watch',
}

export enum TYPES {
  CJS = 'cjs',
  ESM = 'esm',
}

export const TYPES_MAP: Record<TYPES, Pick<ModuleConfig, 'type'>['type']> = {
  [TYPES.CJS]: 'commonjs',
  [TYPES.ESM]: 'es6',
};
