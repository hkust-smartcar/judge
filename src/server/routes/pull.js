var express = require("express");
var router = express.Router();
const { exec } = require("child_process");

router
  .route("/")

  .post((req, res) => {
    console.log("[pull/]: request for pull, running git pull...");
    exec("git pull", (...params) => {
      console.log("[pull/]: git pull done with result ", params);
      console.log("[pull/]: running npm i");
      res.send(params);
      exec("npm i", (...params) => {
        console.log("[pull/]: npm i done with result ", params);
        console.log("[pull/]: running pm2 restart 1");
        exec("pm2 restart 1", (...params) => {
          console.log("[pull/]: pm2 restart 1 done with result ", params); //but seems this line will never happen
        });
      });
    });
  });

module.exports = router;
