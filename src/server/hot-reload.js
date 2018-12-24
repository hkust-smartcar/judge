const chokidar = require("chokidar");
const path = require("path");

/**
 * Hot reload for development server
 */
const initHotReload = io => () => {
  chokidar.watch(path.join(__dirname, "../client")).on("all", (event, at) => {
    // if (event === 'add') {
    //   console.log('Watching for', at);
    // }
    if (event === "change") {
      console.log("emit restart");
      io.emit("reload", "restart please");
    }
  });
};

module.exports = initHotReload;
