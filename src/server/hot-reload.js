const chokidar = require("chokidar");
const path = require("path");
const logger = require("./logger")("hot-reload");

/**
 * Hot reload for development server
 */
const initHotReload = io => () => {
  chokidar.watch(path.join(__dirname, "../client")).on("all", (event, at) => {
    if (event === "change") {
      logger.info("emit restart");
      io.emit("reload", "restart please");
    }
  });
};

module.exports = initHotReload;
