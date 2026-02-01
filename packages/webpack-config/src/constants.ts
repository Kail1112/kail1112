export enum EXTENSIONS {
  JS = 'js',
  JSX = 'jsx',
  TS = 'ts',
  TSX = 'tsx',
}

export const EXTENSION_LIST = Object.values(EXTENSIONS);

export enum MODES {
  DEVELOPMENT = 'development',
  NONE = 'none',
  PRODUCTION = 'production',
}

export const REGEX = {
  MODULE: {
    BITMAP: /\.(avif|bmp|gif|jpe?g|png|webp)$/,
    CSS: /\.css$/,
    JSON: /\.json$/,
    SWC: new RegExp(`\\.(${EXTENSION_LIST.join('|')})$`),
    YAML: /\.ya?ml$/,
  },
  OPTIMIZATION: {},
};

export const RESOLVE_EXTENSIONS = EXTENSION_LIST.map((extension) => {
  return `.${extension}`;
});

export enum TARGETS {
  BROWSER_LIST = 'browserslist',
  NODE = 'node',
}
