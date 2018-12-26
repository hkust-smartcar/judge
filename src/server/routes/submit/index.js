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

  // POST submission file
  .post(upload.array("myfile"), (req, res) => {
    // Create job
    const job = jobQueue.createJob({ user: req.user.id, files: req.files });

    // On job successful, emit socket
    job

      .on("succeeded", function(result) {
        console.log("completed job " + job.id + " result ", result);
        io.to(req.user.id).emit("alert", {
          type: "result",
          job_id: job.id,
          status: "Pending"
        });
      })

      // On job failure, emit socket
      .on("failed", err => {
        console.log(`job failed with error ${err.message}.`);
        io.to(req.user.id).emit("alert", {
          type: "result",
          job_id: job.id,
          status: "Completed",
          error: err.message
        });
      })

      .save();

    return res.send("submitted");
  });

module.exports = router;
