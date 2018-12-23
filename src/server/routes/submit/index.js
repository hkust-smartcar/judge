const express = require("express");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
const io = require("../../index");

const router = express.Router();

const jobQueue = require("./queue");

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
      io.to(req.user.id).emit("alert", `Job id ${job.id} has result ${result}`);
    });

    job.on("failed", err => {
      console.log(`job failed with error ${err}.`);
      io.to(req.user.id).emit("alert", `Job id ${job.id} has error ${err}`);
    });
    job.save();
    return res.redirect("/submit");
  });

module.exports = router;
