import { defineConfig } from 'eslint/config';
import prettierPluginRecommended from 'eslint-plugin-prettier/recommended';

import { SEVERITIES } from '../../constants';

export const PRETTIER_RULES = defineConfig({
  extends: [prettierPluginRecommended],
  rules: {
    /**
     * Отключено из-за того что есть конфликты с prettier
     * @see https://github.com/prettier/eslint-plugin-prettier#arrow-body-style-and-prefer-arrow-callback-issue
     * */
    'arrow-body-style': SEVERITIES.OFF,
    /** Запрещает писать условия inline требует использовать фигурные скобки везде где возможно */
    curly: [SEVERITIES.WARNING, 'all'],
    /**
     * Отключено из-за того что есть конфликты с prettier
     * @see https://github.com/prettier/eslint-plugin-prettier#arrow-body-style-and-prefer-arrow-callback-issue
     * */
    'prefer-arrow-callback': SEVERITIES.OFF,
    /** Конфигурация prettier */
    'prettier/prettier': [
      SEVERITIES.WARNING,
      { printWidth: 100, singleQuote: true, tabWidth: 2, useTabs: false },
    ],
  },
});
