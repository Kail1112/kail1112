export const UNUSED_IGNORE_PATTERN = '^_';

export const RULES = {
  MAX_PARAMS: { max: 4 },
  NO_RESTRICTED_IMPORTS: { patterns: ['../../../**/*'] },
  NO_UNUSED_VARS: {
    args: 'after-used',
    argsIgnorePattern: UNUSED_IGNORE_PATTERN,
    caughtErrors: 'all',
    caughtErrorsIgnorePattern: UNUSED_IGNORE_PATTERN,
    destructuredArrayIgnorePattern: UNUSED_IGNORE_PATTERN,
    varsIgnorePattern: UNUSED_IGNORE_PATTERN,
  },
};

export enum SEVERITIES {
  OFF,
  WARNING,
  ERROR,
}
