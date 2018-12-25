var express = require("express");
var router = express.Router();

router
  .route("/")

  .get((req, res) => {
    if (!req.session.passport) res.redirect("/login");
    return res.render("index.ejs", {
      user: JSON.stringify(req.session.passport),
      title: "Profile"
    });
  });

module.exports = router;
