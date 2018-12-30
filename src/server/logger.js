const log4js = require("log4js");
log4js.configure({
  appenders: {
    dateFile: {
      type: "dateFile",
      filename: "./logs/log.log"
    },
    stdout: { type: "stdout" }
  },
  categories: {
    default: { appenders: ["dateFile", "stdout"], level: "debug" }
  }
});

module.exports = log4js.getLogger;
