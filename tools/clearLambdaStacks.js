/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');
const shell = require('shelljs');

const lambdasPath = path.resolve(__dirname, '../', 'stacks/lambdas/');
const files = [];
require('fs')
  .readdirSync(lambdasPath)
  .forEach(function (file) {
    files.push(path.parse(file).name);
  });

(async () => {
  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < files.length; i++) {
    console.info('start:', files[i]);
    try {
      const result = shell.exec(`npx sst remove ${files[i]}`);
    } catch (e) {
      console.error(files[i]);
      console.error(e);
      process.exit(1);
    }
    console.info('end:', files[i]);
  }
  process.exit(0);
})();
