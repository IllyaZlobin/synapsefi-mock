/* eslint-disable @typescript-eslint/no-var-requires */
const { readdirSync } = require("fs");
const { resolve } = require("path");
const baseConfig = require("./webpack.config.base");

const functionsRoot = resolve(__dirname, "functions");
const junkList = [
  // # All
  "^npm-debug\\.log$", // Error log for npm
  "^\\..*\\.swp$", // Swap file for vim state
  // # macOS
  "^\\.DS_Store$", // Stores custom folder attributes
  "^\\.AppleDouble$", // Stores additional file resources
  "^\\.LSOverride$", // Contains the absolute path to the app to be used
  "^Icon\\r$", // Custom Finder icon: http://superuser.com/questions/298785/icon-file-on-os-x-desktop
  "^\\._.*", // Thumbnail
  "^\\.Spotlight-V100(?:$|\\/)", // Directory that might appear on external disk
  "\\.Trashes", // File that might appear on external disk
  "^__MACOSX$", // Resource fork
  // # Linux
  "~$", // Backup file
  // # Windows
  "^Thumbs\\.db$", // Image file cache
  "^ehthumbs\\.db$", // Folder config file
  "^Desktop\\.ini$", // Stores custom folder attributes
  "@eaDir$", // Synology Diskstation "hidden" folder where the server stores thumbnails
];
const junkRegex = new RegExp(junkList.join("|"));
const isNotJunk = (filename) => !junkRegex.test(filename);

module.exports = (options, webpack) => {
  options = baseConfig(options, webpack);
  const functions = readdirSync(functionsRoot)
    .filter(isNotJunk)
    .filter((x) => x === "function1");
  const functionsEntries = {};
  functions.forEach((functionName) => {
    functionsEntries[functionName] = resolve(
      functionsRoot,
      functionName,
      "main.ts"
    );
  });
  return {
    ...options,
    entry: {
      ...options.entry,
      ...functionsEntries,
    },
  };
};
