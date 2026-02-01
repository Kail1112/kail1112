export enum EXTENSIONS {
  JS = 'js',
  JSX = 'jsx',
  TS = 'ts',
  TSX = 'tsx',
}

export enum MODES {
  DEVELOPMENT = 'development',
  NONE = 'none',
  PRODUCTION = 'production',
}

const NODE_MODULES = ['', 'node_modules', ''];
const SEPARATOR = '[\\\\/]';

export const EXTENSION_LIST = Object.values(EXTENSIONS);

export const REGEX = {
  MODULE: {
    BITMAP: /\.(avif|bmp|gif|jpe?g|png|webp)$/,
    CSS: /\.css$/,
    JSON: /\.json$/,
    SWC: new RegExp(`\\.(${EXTENSION_LIST.join('|')})$`),
    YAML: /\.ya?ml$/,
  },
  OPTIMIZATION: {
    POLYFILLS: new RegExp(
      [...NODE_MODULES, '(core-js|core-js-pure|regenerator-runtime)', ''].join(SEPARATOR),
    ),
    REACT: new RegExp(
      [...NODE_MODULES, '(react|react-dom|scheduler|react-router-dom)', ''].join(SEPARATOR),
    ),
    VENDORS: new RegExp(NODE_MODULES.join(SEPARATOR)),
  },
};

export const RESOLVE_EXTENSIONS = EXTENSION_LIST.map((extension) => {
  return `.${extension}`;
});

export enum TARGETS {
  BROWSER_LIST = 'browserslist',
  NODE = 'node',
}
