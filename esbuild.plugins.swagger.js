const { commonjs } = require('@hyrious/esbuild-plugin-commonjs');

const ignorePlugin = require('esbuild-plugin-ignore');
const ImportGlobPlugin = require('esbuild-plugin-import-glob').default;
const { esbuildDecorators } = require('@anatine/esbuild-decorators');
const lodashTransformer = require('esbuild-plugin-lodash');
// const { replace } = require('esbuild-plugin-replace');
// const esbuildPluginTsc = require('esbuild-plugin-tsc');

const ignoreHardPlugin = (ignores) => ({
  name: 'ignoreHard',
  setup(build) {
    build.onResolve({ filter: /.*/, namespace: 'ignore' }, (args) => ({
      path: args.path,
      namespace: 'ignoreHard',
    }));
    // eslint-disable-next-line no-restricted-syntax
    for (const ignorePattern of ignores) {
      build.onResolve({ filter: ignorePattern.resourceRegExp }, (args) => {
        if (args.resolveDir.match(ignorePattern.contextRegExp)) {
          return {
            path: args.path,
            namespace: 'ignoreHard',
          };
        }
        return {
          path: args.path,
        };
      });
    }

    build.onLoad({ filter: /.*/, namespace: 'ignoreHard' }, () => ({
      contents: ' throw Error(`hard ignored`)',
    }));
  },
});
// const addInject = (inject) => ({
//   name: 'auto-node-env',
//   setup(build) {
//     const options = build.initialOptions;
//     options.inject = [...options.inject, ...inject];
//   },
// });

const ignore = [
  'cache-manager',
  // '@nestjs/platform-express',
  '@nestjs/microservices',
  '@nestjs/microservices/microservices-module',
  '@nestjs/websockets/socket-module',
  'swagger-ui-express',
  'fastify-swagger',
  'class-transformer/storage',
  '@mikro-orm/seeder',
  // '@mikro-orm/mongodb',
  '@mikro-orm/mysql',
  '@mikro-orm/mariadb',
  '@mikro-orm/sqlite',
  '@mikro-orm/better-sqlite',
  '@mikro-orm/entity-generator',
  'better-sqlite3',
  'tedious',
  'sqlite3',
  'mysql',
  'mysql2',
  'oracledb',
  'pg-query-stream',
  '@vscode/sqlite3',
  'pg-native',
];

module.exports = [
  // commonjs({

  // }),
  // addInject(['./esbuild-mikroorm-patch.ts']),
  ImportGlobPlugin(),
  ignorePlugin(
    ignore.map((x) => {
      return { resourceRegExp: new RegExp(`${x}$`) };
    }),
  ),
  ignoreHardPlugin([
    { resourceRegExp: /@mikro-orm\/mongodb$/ },
    { resourceRegExp: /\.\.\/\.\.\/package\.json$/ },
  ]),

  // lodashTransformer(),
  esbuildDecorators({
    tsconfig: './tsconfig.build.json',
    cwd: process.cwd(),
  }),
];
