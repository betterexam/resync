const fs = require("fs-extra");
const path = require("path");
const chokidar = require("chokidar");
const ignore = require("ignore");

async function getIgnoredFiles(srcDir) {
  const ignoreFilePath = path.join(srcDir, ".gitignore");
  if (await fs.pathExists(ignoreFilePath)) {
    const ignoreContent = await fs.readFile(ignoreFilePath, "utf8");
    const ig = ignore().add(ignoreContent);
    return ig;
  }
  return null;
}

async function syncDirectories(srcDir, destDir) {
  const ig = await getIgnoredFiles(srcDir);

  const watcher = chokidar.watch(srcDir, {
    ignored: (filePath) => {
      const relativePath = path.relative(srcDir, filePath);
      if (!relativePath || relativePath.trim() === "") {
        return false;
      }
      if (ig) {
        return ig.ignores(relativePath);
      }
      return false;
    },
    persistent: true,
  });

  watcher
    .on("add", (filePath) => copyFileOrDir(filePath, srcDir, destDir))
    .on("change", (filePath) => copyFileOrDir(filePath, srcDir, destDir))
    .on("unlink", (filePath) => deleteFileOrDir(filePath, srcDir, destDir))
    .on("unlinkDir", (filePath) => deleteFileOrDir(filePath, srcDir, destDir));

  console.log(`Watching for changes in ${srcDir}`);
}

async function copyFileOrDir(filePath, srcDir, destDir) {
  const relativePath = path.relative(srcDir, filePath);
  const destPath = path.join(destDir, relativePath);

  try {
    await fs.copy(filePath, destPath);
    console.log(`Copied: ${relativePath}`);
  } catch (err) {
    console.error(`Error copying ${relativePath}:`, err);
  }
}

async function deleteFileOrDir(filePath, srcDir, destDir) {
  const relativePath = path.relative(srcDir, filePath);
  const destPath = path.join(destDir, relativePath);

  try {
    await fs.remove(destPath);
    console.log(`Deleted: ${relativePath}`);
  } catch (err) {
    console.error(`Error deleting ${relativePath}:`, err);
  }
}

module.exports = syncDirectories;
