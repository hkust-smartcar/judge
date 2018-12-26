var express = require("express");
var router = express.Router();
const { getSessionUser, isAdmin } = require("./helper");

router
  .route("/")

  .get((req, res) => {
    const user = getSessionUser(req);
    if (!user) res.redirect("/login");
    if (!isAdmin(user)) res.send("Not Authorized");
    return res.render("index.ejs", {
      user: JSON.stringify(req.session.passport),
      title: "Admin Panel"
    });
  });

module.exports = router;
