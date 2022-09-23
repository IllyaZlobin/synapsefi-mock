/* eslint-disable @typescript-eslint/no-var-requires */
module.exports = (options, webpack) => {
  try {
    const config = require('./webpack.config.tools');
    return config(options, webpack);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};
