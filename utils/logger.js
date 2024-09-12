const { blue, green, red } = require("colorette");

const logger = {
  info: (message) => console.log(blue(message)),
  success: (message) => console.log(green(message)),
  error: (message) => console.log(red(message)),
};

module.exports = logger;
