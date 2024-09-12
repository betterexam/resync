const fs = require("fs-extra");
const path = require("path");
const ignore = require("ignore");

// Utility function to read and parse .gitignore file
module.exports = async function getIgnoredFiles(srcDir) {
  const ignoreFilePath = path.join(srcDir, ".gitignore");
  if (await fs.pathExists(ignoreFilePath)) {
    const ignoreContent = await fs.readFile(ignoreFilePath, "utf8");
    const ig = ignore().add(ignoreContent);
    return ig;
  }
  return null; // Return null if no .gitignore file found
};
