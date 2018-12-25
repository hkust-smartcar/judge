var express = require("express");
var router = express.Router();

router.all("/*:8081", (req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  res.header("Content-Type: application/json; charset=utf-8");
  next();
});

router.get("/", (req, res) => {
  return res.render("index.ejs", {
    user: JSON.stringify(req.session.passport),
    page: ""
  });
});

router.use(express.static("./dist"));

router.use("/profile", require("./profile"));

router.use("/test", require("./test"));

router.use("/pull", require("./pull"));

router.use("/submit", require("./submit"));

router.use("/api", require("./api"));

module.exports = router;
