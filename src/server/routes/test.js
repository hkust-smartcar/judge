var express = require("express");
var router = express.Router();

router
  .route("/")

  .get((req, res) => {
    return res.render("index.ejs", {
      user: `{"a":123,"b":{"c":"d"}}`,
      page: "hi"
    });
  });

module.exports = router;
