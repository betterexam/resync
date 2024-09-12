#!/usr/bin/env node

const { program } = require("commander");
const { sync } = require("./commands");

program
  .command("sync <srcDir> <destDir>")
  .description("Sync source directory to destination directory")
  .action(sync);

program.parse(process.argv);
