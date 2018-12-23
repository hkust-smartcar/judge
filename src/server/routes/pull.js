var express = require("express");
var router = express.Router();

router
  .route("/")

  .post((req, res) => {
    exec(
      "git pull origin master && npm i && pm2 restart judge",
      (...params) => {
        res.send(params);
      }
    );
  });

module.exports = router;
