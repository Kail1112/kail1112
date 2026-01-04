import { JAVASCRIPT_RULES, SEVERITIES, TYPESCRIPT_RULES } from '@kail1112/eslint-configs';
import { defineConfig } from 'eslint/config';
import globals from 'globals';

enum EXTENSIONS {
  JS = 'js',
  TS = 'ts',
}

const BASE = defineConfig({
  extends: [JAVASCRIPT_RULES],
  ignores: ['**/build/**/*'],
  languageOptions: { globals: { ...globals.node }, sourceType: 'commonjs' },
});
const TYPESCRIPT = defineConfig({ extends: [BASE, TYPESCRIPT_RULES] });

export default defineConfig([
  {
    extends: [BASE],
    files: [`**/*.${EXTENSIONS.JS}`],
  },
  {
    extends: [TYPESCRIPT],
    files: [`**/*.${EXTENSIONS.TS}`],
    ignores: [`**/*.d.${EXTENSIONS.TS}`],
  },
  {
    extends: [TYPESCRIPT],
    files: [`**/*.d.${EXTENSIONS.TS}`],
    rules: {
      '@typescript-eslint/naming-convention': SEVERITIES.OFF,
      '@typescript-eslint/no-explicit-any': SEVERITIES.OFF,
    },
  },
]);
