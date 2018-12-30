var express = require("express");
var router = express.Router();
const { exec } = require("child_process");
const logger = require("../logger")("pull");

router
  .route("/")

  .post((req, res) => {
    logger.info("request for pull, running git pull...");
    exec("git pull", (...params) => {
      logger.info("git pull done with result ", params);
      logger.info("running npm i");
      res.send(params);
      exec("npm i", (...params) => {
        logger.info("npm i done with result ", params);
        logger.info("running pm2 restart 1");
        exec("pm2 restart 1", (...params) => {
          logger.info("pm2 restart 1 done with result ", params); //but seems this line will never happen
        });
      });
    });
  });

module.exports = router;
