var express = require("express");
var multer = require("multer");
var upload = multer({ dest: "uploads/" });

var router = express.Router();

router
  .route("/")

  .get((req, res) => {
    return res.render("index.ejs", {
      user: JSON.stringify(req.session.passport)
    });
  })

  .post(upload.array("myfile"), (req, res) => {
    console.log("POST submit", req.body);
    console.log("files", req.files);
    return res.redirect("/submit");
  });

module.exports = router;
