var express = require("express");
var multer = require("multer");
var upload = multer({ dest: "uploads/" });

var router = express.Router();

var jobQueue = require("./queue");

router
  .route("/")

  .get((req, res) => {
    return res.render("index.ejs", {
      user: JSON.stringify(req.session.passport)
    });
  })

  .post(upload.array("myfile"), (req, res) => {
    const job = jobQueue.createJob({ files: req.files });
    job.on("succeeded", function(result) {
      console.log("completed job " + job.id + " result " + result);
    });

    job.on("failed", err => {
      console.log(`job failed with error ${err}.`);
    });
    job.save();
    return res.redirect("/submit");
  });

module.exports = router;
