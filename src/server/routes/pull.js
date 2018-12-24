var express = require("express");
var router = express.Router();
const { exec } = require("child_process");

router
  .route("/")

  .post((req, res) => {
    exec("git pull origin master && npm i && pm2 restart 1", (...params) => {
      res.send(params);
    });
  });

module.exports = router;
