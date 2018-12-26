const express = require("express");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
const io = require("../../socket").getio();
const client = require("../../mongo").getdb();
var bodyParser = require("body-parser");

const router = express.Router();

const jobQueue = require("./queue");

// router.use(bodyParser.json());
// router.use(bodyParser.urlencoded({ extended: true }));

router
  .route("/")

  .get((req, res) => {
    return res.render("index.ejs", {
      user: JSON.stringify(req.session.passport)
    });
  })

  // POST submission file
  .post(upload.fields([{ name: "qid" }, { name: "myfile" }]), (req, res) => {
    // .post(upload.fields([{ name: "myfile", maxCount: 1 }]), (req, res) => {
    // Create
    console.log("POST submit", req.body);
    console.log("files", req.files);
    // console.log("body:", req.body);
    const job = jobQueue.createJob({
      user: req.user.id,
      files: req.files.myfile,
      question_id: req.body.qid // question id
    });

    // On job successful, emit socket
    job

      .on("succeeded", function(result) {
        console.log("completed job " + job.id + " result ", result);
        io.to(req.user.id).emit("alert", {
          type: "result",
          submission_id: job.id,
          question_id: parseInt(req.body.qid),
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
