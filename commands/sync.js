const fs = require("fs-extra");
const syncDirectories = require("../utils/syncDirectories");
const logger = require("../utils/logger");

async function sync(srcDir, destDir) {
  if (!srcDir || !destDir) {
    logger.error("Please provide both source and destination directories.");
    process.exit(1);
  }

  if (!(await fs.pathExists(srcDir))) {
    logger.error(`Source directory does not exist: ${srcDir}`);
    process.exit(1);
  }

  if (!(await fs.pathExists(destDir))) {
    logger.error(`Destination directory does not exist: ${destDir}`);
    process.exit(1);
  }

  logger.info(`Starting sync from ${srcDir} to ${destDir}`);
  await syncDirectories(srcDir, destDir);
  logger.success(`Sync completed from ${srcDir} to ${destDir}`);
}

module.exports = sync;
