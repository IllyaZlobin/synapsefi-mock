const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");

/* const optionalModules = new Set([
  ...Object.keys(require("knex/package.json").browser),
  ...Object.keys(require("@mikro-orm/core/package.json").peerDependencies),
  ...Object.keys(require("@mikro-orm/core/package.json").devDependencies || {}),
]); */


module.exports = (options, webpack) => {
  const externals = ["aws-sdk"];
  const ignore = [
    "@nestjs/microservices/microservices-module",
    "@nestjs/websockets/socket-module",
    "swagger-ui-express",
    "fastify-swagger",
    "class-transformer/storage",
    "@mikro-orm/seeder",
    "@mikro-orm/mongodb",
    "@mikro-orm/mysql",
    "@mikro-orm/mariadb",
    "@mikro-orm/sqlite",
    "@mikro-orm/better-sqlite",
    "@mikro-orm/entity-generator",
    "better-sqlite3",
    "tedious",
    "sqlite3",
    "mysql",
    "mysql2",
    "oracledb",
    "pg-query-stream",
    "@vscode/sqlite3",
    "pg-native",
  ];

  return {
    ...options,
    target: "node16.19",
    entry: {},
    output: {
      ...options.output,
      filename: "[name].js",
      library: {
        type: "commonjs-static",
      },
    },
    watchOptions: {
      ignored: [
        "**/node_modules",
        "**/dist",
        "**/build",
        "**/.sst",
        "**/stacks",
      ],
    },
    externals: externals.reduce(
      (res, name) => ({ ...res, [name]: `commonjs2 ${name}` }),
      {}
    ),
    plugins: [
      ...options.plugins,
      // new BundleAnalyzerPlugin({
      //   analyzerMode: 'disabled',
      //   generateStatsFile: true,
      // }),
      new webpack.IgnorePlugin({
        checkResource(resource) {
          return ignore.includes(resource)
            ? true
            : (() => {
                const baseResource = resource
                  .split("/", resource[0] === "@" ? 2 : 1)
                  .join("/");

                /* if (optionalModules.has(baseResource)) {
                  try {
                    require.resolve(resource);
                    return false;
                  } catch {
                    return true;
                  }
                } */
                return false;
              })();
        },
      }),
    ],
  };
};
