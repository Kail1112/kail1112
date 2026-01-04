import stylisticPlugin from '@stylistic/eslint-plugin';
import { defineConfig } from 'eslint/config';

import { SEVERITIES } from '../../constants';

export const STYLISTIC_RULES = defineConfig({
  plugins: { '@stylistic': stylisticPlugin },
  rules: {
    /** Требует чтобы комментарий был всегда сверху */
    '@stylistic/line-comment-position': [SEVERITIES.WARNING, { position: 'above' }],
    /** Запрещает tab'ы */
    '@stylistic/no-tabs': SEVERITIES.WARNING,
    /**
     * Требует отступы между логическими блоками
     * @see https://eslint.style/rules/padding-line-between-statements
     * */
    '@stylistic/padding-line-between-statements': [
      SEVERITIES.WARNING,
      /** for "import" rules */
      { blankLine: 'always', next: '*', prev: 'import' },
      { blankLine: 'any', next: 'import', prev: 'import' },
      /** for "const" rules */
      { blankLine: 'always', next: '*', prev: 'const' },
      { blankLine: 'any', next: 'const', prev: 'const' },
      { blankLine: 'any', next: 'let', prev: 'const' },
      /** for "let" rules */
      { blankLine: 'always', next: '*', prev: 'let' },
      { blankLine: 'any', next: 'let', prev: 'let' },
      { blankLine: 'any', next: 'const', prev: 'let' },
      /** for "return" rules */
      { blankLine: 'always', next: 'return', prev: '*' },
      /** for switch rules */
      { blankLine: 'always', next: 'case', prev: 'case' },
      { blankLine: 'always', next: 'default', prev: 'case' },
    ],
    /** Требует пробел в начале комментария */
    '@stylistic/spaced-comment': [SEVERITIES.WARNING, 'always'],
  },
});
