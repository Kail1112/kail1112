import { defineConfig } from 'eslint/config';
import unicornPlugin from 'eslint-plugin-unicorn';
import globals from 'globals';

import { SEVERITIES } from '../../constants';

export const UNICORN_RULES = defineConfig({
  languageOptions: { globals: { ...globals.builtin } },
  plugins: { unicorn: unicornPlugin },
  rules: {
    /**
     * Требует сокращения в регулярках там где это возможно
     * @see https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/better-regex.md
     * */
    'unicorn/better-regex': SEVERITIES.WARNING,
    /**
     * Требует указывать переменную error в "catch"
     * @seehttps://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/catch-error-name.md
     * */
    'unicorn/catch-error-name': [SEVERITIES.WARNING, { name: 'error' }],
    /**
     * Требует при клонировании даты передавать Date в new Date()
     * @see https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/consistent-date-clone.md
     * */
    'unicorn/consistent-date-clone': SEVERITIES.WARNING,
    /** Запрещает деструктурировать если ранее в блоке была деструктуризация */
    'unicorn/consistent-destructuring': SEVERITIES.WARNING,
    /** Запрещает писать в массив через spread то что не является массивом */
    'unicorn/consistent-empty-array-spread': SEVERITIES.WARNING,
    /**
     * Требует сообщение при вызове new Error()
     * @see https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/error-message.md
     * */
    'unicorn/error-message': SEVERITIES.WARNING,
    /** Запрещает создавать файлы не в kebab-case или PascalCase */
    'unicorn/filename-case': [
      SEVERITIES.WARNING,
      { cases: { camelCase: false, kebabCase: true, pascalCase: true, snakeCase: false } },
    ],
    /** Запрещает игнорировать все правила линтера */
    'unicorn/no-abusive-eslint-disable': SEVERITIES.ERROR,
    /**
     * Запрещает в геттерах и сеттерах обращаться к самому себе
     * @see https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/no-accessor-recursion.md
     * */
    'unicorn/no-accessor-recursion': SEVERITIES.ERROR,
    /**
     * Запрещает обращаться к "this" внутри методов Array.prototype.<method>
     * @see https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/no-array-method-this-argument.md
     * */
    'unicorn/no-array-method-this-argument': SEVERITIES.ERROR,
    /**
     * Требует правильной работы с "await"
     * @see https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/no-await-expression-member.md
     * */
    'unicorn/no-await-expression-member': SEVERITIES.ERROR,
    /**
     * Запрещает "await" в Promise методах
     * @see https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/no-await-in-promise-methods.md
     * */
    'unicorn/no-await-in-promise-methods': SEVERITIES.ERROR,
    /** Запрещает оставлять в проекте пустые файлы */
    'unicorn/no-empty-file': SEVERITIES.WARNING,
    /** Требует использовать "for/of" там где это возможно */
    'unicorn/no-for-loop': SEVERITIES.WARNING,
    /**
     * Запрещает мутацию сразу после инициализации
     * @see https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/no-immediate-mutation.md
     * */
    'unicorn/no-immediate-mutation': SEVERITIES.WARNING,
    /**
     * Запрещает "instanceof" для встроенных объектов
     * @see https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/no-instanceof-builtins.md
     * */
    'unicorn/no-instanceof-builtins': SEVERITIES.WARNING,
    /**
     * Запрещает использовать "if" без необходимости
     * @see https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/no-lonely-if.md
     * */
    'unicorn/no-lonely-if': SEVERITIES.WARNING,
    /**
     * Запрещает использовать Promise.all(), Promise.race() без необходимости
     * @see https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/no-single-promise-in-promise-methods.md
     * */
    'unicorn/no-single-promise-in-promise-methods': SEVERITIES.WARNING,
    /** Запрещает писать метод "then()" в своем коде */
    'unicorn/no-thenable': SEVERITIES.ERROR,
    /** Запрещает использовать "await" не в Promise значениях */
    'unicorn/no-unnecessary-await': SEVERITIES.ERROR,
    /**
     * Запрещает использовать Promise.resolve() или Promise.reject() без необходимости
     * @see https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/no-useless-promise-resolve-reject.md
     * */
    'unicorn/no-useless-promise-resolve-reject': SEVERITIES.WARNING,
    /**
     * Требует использовать Blob.arrayBuffer или Blob.text вместо методов FileReader
     * */
    'unicorn/prefer-blob-reading-methods': SEVERITIES.WARNING,
    /** Запрещает без необходимости что-то записывать в "this" в "constructor" */
    'unicorn/prefer-class-fields': SEVERITIES.WARNING,
    /**
     * Запрещает использовать несколько подряд push вместо одного
     * @see https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/prefer-single-call.md
     * */
    'unicorn/prefer-single-call': SEVERITIES.WARNING,
    /** Запрещает использовать регулярки без необходимости вместо String.startsWith() или String.endsWith() */
    'unicorn/prefer-string-starts-ends-with': SEVERITIES.WARNING,
    /** Требует использовать structuredClone вместо lodash или хака с JSON */
    'unicorn/prefer-structured-clone': SEVERITIES.ERROR,
    /**
     * Запрещает использовать большое кол-во "if/else"
     * @see https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/prefer-switch.md
     * */
    'unicorn/prefer-switch': SEVERITIES.WARNING,
  },
});
