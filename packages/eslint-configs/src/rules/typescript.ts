import { defineConfig } from 'eslint/config';
import sortPlugin from 'eslint-plugin-sort';
import { configs } from 'typescript-eslint';

import { RULES, SEVERITIES } from '../constants';

const { strictTypeChecked: typescriptStrictTypeChecked } = configs;

export const TYPESCRIPT_RULES = defineConfig({
  extends: [typescriptStrictTypeChecked],
  languageOptions: {
    parserOptions: { projectService: true },
  },
  plugins: { sort: sortPlugin },
  rules: {
    /** Запрещает непоследовательные перегрузки. Требует чтобы перегрузки были последовательными */
    '@typescript-eslint/adjacent-overload-signatures': SEVERITIES.ERROR,
    /** Запрещает использовать generic типы для Array */
    '@typescript-eslint/array-type': SEVERITIES.WARNING,
    /** Запрещает указывать тип если конструктор имеет generic */
    '@typescript-eslint/consistent-generic-constructors': SEVERITIES.WARNING,
    /** Требует использовать Record вместо { [key: string]: any } */
    '@typescript-eslint/consistent-indexed-object-style': SEVERITIES.WARNING,
    /** Требует явно указывать тип, который вернет метод/функция */
    '@typescript-eslint/explicit-function-return-type': SEVERITIES.ERROR,
    /** Требует явные типы возвращаемых данных */
    '@typescript-eslint/explicit-module-boundary-types': SEVERITIES.ERROR,
    /** Запрещает указывать большое кол-во параметров в методах/функциях */
    '@typescript-eslint/max-params': [SEVERITIES.ERROR, RULES.MAX_PARAMS],
    /**
     * Требует общего стиля именования типов и enum'ов
     * @see https://typescript-eslint.io/rules/naming-convention
     * */
    '@typescript-eslint/naming-convention': [
      SEVERITIES.ERROR,
      { custom: { match: true, regex: '^I' }, format: ['PascalCase'], selector: 'interface' },
      { format: ['PascalCase'], leadingUnderscore: 'forbid', selector: ['typeAlias'] },
      { format: ['UPPER_CASE'], leadingUnderscore: 'forbid', selector: ['enum', 'enumMember'] },
    ],
    /** Принудительное использование классификатор типа импорта верхнего уровня */
    '@typescript-eslint/no-import-type-side-effects': SEVERITIES.ERROR,
    /** Запрещает явное объявление типов для переменных или параметров инициализированных числом, строкой или логическим значением */
    '@typescript-eslint/no-inferrable-types': SEVERITIES.WARNING,
    /** Запрещает использование spread оператора если это может привести к непредсказуемому поведению */
    '@typescript-eslint/no-misused-spread': SEVERITIES.ERROR,
    /** Запрещает перечислениям содержать как числовые, так и строковые элементы */
    '@typescript-eslint/no-mixed-enums': SEVERITIES.ERROR,
    /** Запрещает ненулевые утверждения в левом операнде nullish coalescing operator */
    '@typescript-eslint/no-non-null-asserted-nullish-coalescing': SEVERITIES.WARNING,
    /** Запрещает загрузку указанных модулей при импорте */
    '@typescript-eslint/no-restricted-imports': [SEVERITIES.ERROR, RULES.NO_RESTRICTED_IMPORTS],
    /** Запрещает ненужные сравнения на равенство с логическими литералами */
    '@typescript-eslint/no-unnecessary-boolean-literal-compare': SEVERITIES.WARNING,
    /** Запрещает условные выражения, в которых тип всегда является true или false */
    '@typescript-eslint/no-unnecessary-condition': SEVERITIES.WARNING,
    /** Запрещает ненужное присвоение параметра свойства конструктора */
    '@typescript-eslint/no-unnecessary-parameter-property-assignment': SEVERITIES.WARNING,
    /** Запрещает ненужные шаблонные выражения */
    '@typescript-eslint/no-unnecessary-template-expression': SEVERITIES.WARNING,
    /** Запрещает указывать generic который равен значению по умолчанию */
    '@typescript-eslint/no-unnecessary-type-arguments': SEVERITIES.WARNING,
    /** Запрещает использование неиспользуемых приватных свойств классов */
    '@typescript-eslint/no-unused-private-class-members': SEVERITIES.WARNING,
    /** Запрещает использование неиспользуемых переменных */
    '@typescript-eslint/no-unused-vars': [SEVERITIES.ERROR, RULES.NO_UNUSED_VARS],
    /** Запрещает использование переменных до того, как они будут определены */
    '@typescript-eslint/no-use-before-define': SEVERITIES.ERROR,
    /** Запрещает использование ненужных конструкторов в классах */
    '@typescript-eslint/no-useless-constructor': SEVERITIES.WARNING,
    /** Запрещает значения по умолчанию, которые никогда не будут использоваться */
    '@typescript-eslint/no-useless-default-assignment': SEVERITIES.ERROR,
    /** Принудительное использование Array.prototype.find() вместо Array.prototype.filter(), за которым следует [0] при поиске единственного результата */
    '@typescript-eslint/prefer-find': SEVERITIES.WARNING,
    /** Типы для функций, а интерфейсы для объектов/классов */
    '@typescript-eslint/prefer-function-type': SEVERITIES.WARNING,
    /** Запрещает использовать оператор "или" там где можно/нужно использовать nullish coalescing operator */
    '@typescript-eslint/prefer-nullish-coalescing': SEVERITIES.WARNING,
    /** Запрещает использование связанные цепочки "и" в пользу optional chaining */
    '@typescript-eslint/prefer-optional-chain': SEVERITIES.WARNING,
    /** Заставляет использовать generic при вызове Array.prototype.reduce() */
    '@typescript-eslint/prefer-reduce-type-parameter': SEVERITIES.WARNING,
    /** Заставляет использовать "this" */
    '@typescript-eslint/prefer-return-this-type': SEVERITIES.WARNING,
    /** Заставляет использовать String.prototype.startsWith или String.prototype.endsWith вместо обращения к index'у */
    '@typescript-eslint/prefer-string-starts-ends-with': SEVERITIES.WARNING,
    /** Заставляет использовать одинаковые типы для get() и set() */
    '@typescript-eslint/related-getter-setter-pairs': SEVERITIES.ERROR,
    'max-params': SEVERITIES.OFF,
    'no-restricted-imports': SEVERITIES.OFF,
    'no-unused-private-class-members': SEVERITIES.OFF,
    'no-unused-vars': SEVERITIES.OFF,
    'no-use-before-define': SEVERITIES.OFF,
    'no-useless-constructor': SEVERITIES.OFF,
    /** Требует сортировку в enum */
    'sort/string-enums': [SEVERITIES.WARNING, { caseSensitive: false }],
    /** Требует сортировку в union типах */
    'sort/string-unions': [SEVERITIES.WARNING, { caseSensitive: false }],
    /** Требует сортировку в типах */
    'sort/type-properties': [SEVERITIES.WARNING, { caseSensitive: false }],
  },
});
