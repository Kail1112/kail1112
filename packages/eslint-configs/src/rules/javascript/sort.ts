import { defineConfig } from 'eslint/config';
import sortPlugin from 'eslint-plugin-sort';

import { SEVERITIES } from '../../constants';
import { SortRules } from '../../utils';

const {
  configs: { 'flat/recommended': sortPluginRecommended },
} = sortPlugin;

export const SORT_RULES = defineConfig({
  extends: [sortPluginRecommended],
  rules: {
    /** Требует сортировки импортов */
    'sort/imports': [SEVERITIES.WARNING, { groups: new SortRules().rules(1), separator: '\n' }],
  },
});
