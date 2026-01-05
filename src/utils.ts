import dotenv from 'dotenv';
import dotenvExpand from 'dotenv-expand';
import fs from 'fs';
import path from 'path';

const PATHS = { ENV: path.resolve(import.meta.dirname, '../.env') };

export const ensureEnv = (): void => {
  if (!fs.existsSync(PATHS.ENV)) {
    return;
  }

  const output = dotenv.config({ path: PATHS.ENV, quiet: true });

  dotenvExpand.expand(output);
};

export const normalizePath = (param: string): string => {
  const normalized = path.normalize(param);

  return normalized.replaceAll(path.sep, '/');
};
