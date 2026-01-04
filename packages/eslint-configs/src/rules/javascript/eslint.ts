import { configs } from '@eslint/js';
import { defineConfig } from 'eslint/config';
import { builtinModules } from 'node:module';

import { RULES, SEVERITIES, UNUSED_IGNORE_PATTERN } from '../../constants';

const { recommended: eslintRecommended } = configs;

const MINIMUM_VARIABLE_SIZE = 3;

export const ESLINT_RULES = defineConfig({
  extends: [eslintRecommended],
  rules: {
    /** Требует "return" в колбэках для методов массивов */
    'array-callback-return': SEVERITIES.ERROR,
    /** Требует фигурные скобки в стрелочных функциях */
    'arrow-body-style': [SEVERITIES.WARNING, 'always'],
    /** Запрещает именование переменных не в camelCase'е */
    camelcase: [
      SEVERITIES.WARNING,
      {
        ignoreDestructuring: false,
        ignoreGlobals: false,
        ignoreImports: false,
        properties: 'always',
      },
    ],
    /** Запрещает указывать "default" не в конце "switch" */
    'default-case-last': SEVERITIES.WARNING,
    /** Требует указывать параметр с дефолтным значение в конце списка аргументов/параметров */
    'default-param-last': SEVERITIES.WARNING,
    /** Требует использовать dot везде, где возможно при обращении к ключам объектов */
    'dot-notation': SEVERITIES.WARNING,
    /** Требует строгое сравнение "===" или "!==" */
    eqeqeq: [SEVERITIES.ERROR, 'always'],
    /** Требует использовать Object.hasOwn() или Object.prototype.hasOwnProperty() в "for in" */
    'guard-for-in': SEVERITIES.ERROR,
    /** Требует минимум 3 символа для переменной */
    'id-length': [
      SEVERITIES.WARNING,
      {
        exceptionPatterns: [UNUSED_IGNORE_PATTERN].concat(
          /** Разрешаем минимальное название переменным из nodejs */
          builtinModules.reduce<string[]>((acc, name) => {
            if (name.length < MINIMUM_VARIABLE_SIZE) {
              acc.push(`^${name}$`);
            }

            return acc;
          }, []),
        ),
        min: MINIMUM_VARIABLE_SIZE,
      },
    ],
    /** Требует использовать logical assignment operator везде где возможно */
    'logical-assignment-operators': SEVERITIES.WARNING,
    /** Запрещает вложенные "if" больше 3 */
    'max-depth': [SEVERITIES.ERROR, { max: 3 }],
    /** Запрещает вложенные колбэки больше 5 */
    'max-nested-callbacks': [SEVERITIES.ERROR, { max: 5 }],
    /** Запрещает указывать больше 4 параметров в методах/функциях */
    'max-params': [SEVERITIES.ERROR, RULES.MAX_PARAMS],
    /** Запрещает использовать "console.<level>" */
    'no-console': SEVERITIES.WARNING,
    /** Запрещает использовать "return" в "constructor" */
    'no-constructor-return': SEVERITIES.ERROR,
    /** Запрещает дубликаты импортов */
    'no-duplicate-imports': SEVERITIES.WARNING,
    /**
     * Запрещает использовать "return" в "else" если ниже нет кода, который мог бы выполниться
     * @see https://eslint.org/docs/latest/rules/no-else-return
     * */
    'no-else-return': SEVERITIES.ERROR,
    /** Запрет на использование "eval" */
    'no-eval': SEVERITIES.ERROR,
    /** Запрещает писать в "prototype" */
    'no-extend-native': SEVERITIES.ERROR,
    /**
     * Запрещает использовать сокращенное преобразование типов
     * @see https://eslint.org/docs/latest/rules/no-implicit-coercion
     * */
    'no-implicit-coercion': SEVERITIES.WARNING,
    /**
     * Запрещает использовать eval подобные методы
     * @see https://eslint.org/docs/latest/rules/no-implied-eval
     * */
    'no-implied-eval': SEVERITIES.ERROR,
    /**
     * Учит писать код чисто
     * @see https://eslint.org/docs/latest/rules/no-lonely-if
     * */
    'no-lonely-if': SEVERITIES.WARNING,
    /** Запрещает вложенные тернарники */
    'no-nested-ternary': SEVERITIES.WARNING,
    /** Запрещает использовать new Function() из-за них сильно падает производительность */
    'no-new-func': SEVERITIES.ERROR,
    /** Запрещает оператор "new" с объектами String, Number и Boolean */
    'no-new-wrappers': SEVERITIES.WARNING,
    /** Запрещает использовать __proto__ */
    'no-proto': SEVERITIES.ERROR,
    /** Запрещает импорт если он дальше 2 вложенности наверх */
    'no-restricted-imports': [SEVERITIES.WARNING, RULES.NO_RESTRICTED_IMPORTS],
    /** Запрещает использовать оператор присвоения в "return" */
    'no-return-assign': [SEVERITIES.ERROR, 'always'],
    /**
     * Запрещает использовать "javascript:"
     * @see https://eslint.org/docs/latest/rules/no-script-url
     * */
    'no-script-url': SEVERITIES.ERROR,
    /** Запрещает сравнения в которых обе стороны абсолютно одинаковые */
    'no-self-compare': SEVERITIES.WARNING,
    /** Запрещает синтаксис "${}" в обычных строках */
    'no-template-curly-in-string': SEVERITIES.ERROR,
    /**
     * Запрещает использование "throw" с null, undefined и т.д.
     * @see https://eslint.org/docs/latest/rules/no-throw-literal
     * */
    'no-throw-literal': SEVERITIES.WARNING,
    /** Запрещает "let" или "var" которые считываются, но никогда не присваиваются */
    'no-unassigned-vars': SEVERITIES.WARNING,
    /**
     * Запрещает неизменяемые условия цикла
     * @see https://eslint.org/docs/latest/rules/no-unmodified-loop-condition
     * */
    'no-unmodified-loop-condition': SEVERITIES.ERROR,
    /** Запрещает использовать тернарники без необходимости */
    'no-unneeded-ternary': SEVERITIES.WARNING,
    /** Запрещает неиспользуемые переменные */
    'no-unused-vars': [SEVERITIES.WARNING, RULES.NO_UNUSED_VARS],
    /** Запрещает использование переменных до их определения */
    'no-use-before-define': SEVERITIES.ERROR,
    /** Запрещает использовать вычисляемые свойства объекта там где можно обойтись без них */
    'no-useless-computed-key': SEVERITIES.WARNING,
    /** Запрещает ненужную конкатенацию литералов или шаблонных литералов */
    'no-useless-concat': SEVERITIES.WARNING,
    /** Запрещает ненужные "constructor" */
    'no-useless-constructor': SEVERITIES.WARNING,
    /** Запрещает ненужные "return" */
    'no-useless-return': SEVERITIES.WARNING,
    /** Запрещает использовать "var" */
    'no-var': SEVERITIES.ERROR,
    /** Требует использовать сокращенный способ объявления методов объектов */
    'object-shorthand': SEVERITIES.WARNING,
    /** Требует сокращенные операторы присвоения там где это возможно */
    'operator-assignment': [SEVERITIES.WARNING, 'always'],
    /** Требует объявления "const" для переменных, которые никогда не перезаписываются */
    'prefer-const': SEVERITIES.WARNING,
    /** Требует деструктуризацию для объектов или массивов */
    'prefer-destructuring': SEVERITIES.WARNING,
    /** Требует rest параметры вместо "arguments" */
    'prefer-rest-params': SEVERITIES.WARNING,
    /**
     * Требует использовать "``" везде где возможно
     * @see https://eslint.org/docs/latest/rules/prefer-template
     * */
    'prefer-template': SEVERITIES.WARNING,
    /** Требует явного указания radix при использовании parseInt() */
    radix: SEVERITIES.WARNING,
    /** Запрещает использовать "async" где нет "await" */
    'require-await': SEVERITIES.ERROR,
    /**
     * Для удобства читаемости кода
     * @see https://eslint.org/docs/latest/rules/yoda
     * */
    yoda: [SEVERITIES.WARNING, 'never'],
  },
});
