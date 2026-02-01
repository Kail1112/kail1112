import browserslist from 'browserslist';
import CssMinimizerPlugin from 'css-minimizer-webpack-plugin';
import { browserslistToTargets } from 'lightningcss';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import TerserPlugin from 'terser-webpack-plugin';
import type { Configuration } from 'webpack';
import { parse as yamlParse } from 'yaml';

import { MODES, REGEX, RESOLVE_EXTENSIONS, TARGETS } from './constants';

interface IConfigParams extends Pick<Configuration, 'entry'> {
  mode?: MODES;
  src: string;
  target?: TARGETS;
  version?: string;
}

export const config = ({
  entry,
  mode = MODES.DEVELOPMENT,
  src,
  target = TARGETS.BROWSER_LIST,
  version,
}: IConfigParams): Configuration => {
  const development = mode === MODES.DEVELOPMENT;

  return {
    /**
     * If an error is found in the code, webpack stops working
     * In development mode, there is no need to stop webpack
     * */
    bail: !development,
    cache: {
      buildDependencies: { config: [__filename], webpack: ['webpack/lib/'] },
      store: 'pack',
      type: 'filesystem',
      version,
    },
    /** "Source maps" are only available in the "development" environment */
    devtool: development ? 'cheap-module-source-map' : false,
    entry,
    infrastructureLogging: {
      /** Errors and warnings during the build */
      level: 'warn',
    },
    mode,
    module: {
      rules: [
        {
          oneOf: [
            {
              include: src,
              parser: {
                dataUrlCondition: {
                  /** If the file exceeds a certain size, it will be saved as a separate file, not as a base64 */
                  maxSize: 10 * 1024,
                },
              },
              test: REGEX.MODULE.BITMAP,
              type: 'asset',
            },
            {
              include: src,
              test: REGEX.MODULE.CSS,
              use: [
                /** "style-loader" is needed for development as it supports Hot Module Replacement */
                development ? 'style-loader' : MiniCssExtractPlugin.loader,
                'css-loader',
              ],
            },
            {
              exclude: /node_modules/,
              include: src,
              test: REGEX.MODULE.SWC,
              use: [
                {
                  loader: 'swc-loader',
                  options: {
                    env: {
                      coreJs: '3',
                      /** SWC has a magical ability - it finds a browserlist by itself */
                      mode: 'usage',
                      targets: target === TARGETS.NODE ? { node: 'current' } : undefined,
                    },
                    jsc: {
                      keepClassNames: true,
                      parser: {
                        dynamicImport: true,
                        /** This parser also supports working with JavaScript */
                        syntax: 'typescript',
                        tsx: true,
                      },
                    },
                  },
                },
              ],
            },
            { include: src, test: REGEX.MODULE.JSON, type: 'json' },
            { include: src, parser: { parse: yamlParse }, test: REGEX.MODULE.YAML, type: 'json' },
            { exclude: Object.values(REGEX.MODULE), include: src, type: 'asset/resource' },
          ],
        },
      ],
      /** Without this setting, Webpack treats the import of non-existent exported modules as a "warning"  */
      strictExportPresence: true,
    },
    optimization: {
      chunkIds: development
        ? /** The names of chunks in the compiled code */
          'named'
        : 'deterministic',
      mergeDuplicateChunks: true,
      minimize: !development,
      minimizer: [
        new TerserPlugin({ minify: TerserPlugin.swcMinify, terserOptions: { mangle: true } }),
        new CssMinimizerPlugin({
          minify: CssMinimizerPlugin.lightningCssMinify,
          minimizerOptions: {
            /** Learning use the browserlist plugin */
            targets: browserslistToTargets(browserslist()),
          },
        }),
      ],
      moduleIds: development
        ? 'named'
        : /** Ensures that the module IDs remain unchanged when new imports are added */
          'deterministic',
      /** Creates a single runtime file for all chunks */
      runtimeChunk: 'single',
      splitChunks: {
        cacheGroups: {
          /** Place all the polyfills and core-js in a separate file */
          polyfill: {
            /** It's better to download them right away */
            chunks: 'initial',
            name: 'polyfills',
            /** The highest priority is to keep them away from vendors */
            priority: 99,
            reuseExistingChunk: true,
            test: REGEX.OPTIMIZATION.POLYFILLS,
          },
          /** Transferring React to a separate file */
          react: {
            chunks: 'all',
            name: 'react',
            priority: 11,
            reuseExistingChunk: true,
            test: REGEX.OPTIMIZATION.REACT,
          },
          /** Other dependencies */
          vendors: {
            chunks: 'all',
            name: 'vendors',
            priority: 10,
            reuseExistingChunk: true,
            test: REGEX.OPTIMIZATION.VENDORS,
          },
        },
        chunks: 'all',
      },
    },
    /**
     * By default, Webpack is configured to "protect users"
     * The maximum file size should not exceed 250 kb.
     * */
    performance: {
      /** Enabling warnings for the production */
      hints: development ? false : 'warning',
      maxAssetSize: 750 * 1000,
      maxEntrypointSize: 750 * 1000,
    },
    resolve: {
      /** A list of extensions that can be imported without having to specify their extension */
      extensions: RESOLVE_EXTENSIONS,
      /** This allows importing files from the src directory as if they were in the root directory */
      modules: ['node_modules', src],
    },
    /** Display only errors and warnings */
    stats: 'errors-warnings',
    target,
  };
};
