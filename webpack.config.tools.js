/* eslint-disable @typescript-eslint/no-var-requires */
const { resolve } = require("path");
const baseConfig = require("./webpack.config.base");

module.exports = (options, webpack) => {
  options = baseConfig(options, webpack);
  return {
    ...options,
    entry: {
      ...options.entry,
      /* "db-migration/migrations-bundle": resolve(
        __dirname,
        "tools",
        "db-migration",
        "migrations-bundle.ts"
      ),
      "db-migration/resource-lambda": resolve(
        __dirname,
        "tools",
        "db-migration",
        "resource-lambda.ts"
      ), */
    },
  };
};
