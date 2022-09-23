const esbuild = require('esbuild');
const path = require('path');
// const fs = require('fs');
const plugins = require('../esbuild.plugins');

esbuild
  .build({
    entryPoints: ['./tools/db-migration/migrations-bundle.ts'],
    bundle: true,
    minify: true,
    // metafile: true,
    tsconfig: path.resolve(__dirname, '../tsconfig.json'),
    platform: 'node',
    target: 'node16.15',
    // external: ['./node_modules/*'],
    plugins: [...plugins],
    outfile: './dist/db-migration/migrations-bundle.js',
  })
  .catch((e) => {
    console.log(e);
    process.exit(1);
  });
// .then((result) => {
//   fs.writeFileSync('meta.json', JSON.stringify(result.metafile));
// });
