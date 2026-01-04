import { defineConfig } from 'eslint/config';
import globals from 'globals';

import { ESLINT_RULES } from './eslint';
import { PRETTIER_RULES } from './prettier';
import { SORT_RULES } from './sort';
import { STYLISTIC_RULES } from './stylistic';
import { UNICORN_RULES } from './unicorn';

export const JAVASCRIPT_RULES = defineConfig({
  extends: [ESLINT_RULES, PRETTIER_RULES, SORT_RULES, STYLISTIC_RULES, UNICORN_RULES],
  languageOptions: { ecmaVersion: 2022, globals: { ...globals.es2021 } },
});
