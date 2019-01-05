const express = require("express");
const logger = require("../../logger")("queue");
const multer = require("multer");
const upload = multer({
  dest: "uploads/",
  limits: { fileSize: (process.config.fileSizeLimit || 100) * 1024 },
  onFileSizeLimit: function(file) {
    fs.unlink("./" + file.path); // delete the partially written file
    file.failed = true;
  }
});
const io = require("../../socket").getio();

const router = express.Router();

const jobQueue = require("./queue");

const { upsertSubmission } = require("../schema");

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
    // Create Job
    const job = jobQueue.createJob({
      user: req.user.id,
      files: req.files.myfile,
      question_id: req.body.qid, // question id
      startTime: Date.now() // Job start time
    });
    // On job successful, emit socket
    job

      .on("succeeded", function(result) {
        logger.info(
          `Handling job ${job.id} of user ${job.data.user}, question ${
            job.data.question_id
          } and filename ${job.data.files[0].path}`
        );
        let payload = {
          user_id: parseInt(req.user.id),
          submission_id: parseInt(job.id),
          question_id: parseInt(req.body.qid),
          status: "Pending",
          startTime: job.data.startTime
        };
        io.to(req.user.id).emit("alert", {
          type: "result",
          ...payload
        });
        io.to("admin").emit("admin", {
          type: "result",
          ...payload
        });
        // Save in DB
        upsertSubmission(payload);
      })

      // On job failure, emit socket
      .on("failed", err => {
        logger.info(`job failed with error ${err.message}.`);
        let payload = {
          user_id: parseInt(req.user.id),
          submission_id: parseInt(job.id),
          question_id: parseInt(req.body.qid),
          status: "Completed",
          error: err.message,
          startTime: job.data.startTime,
          endTime: Date.now()
        };
        io.to(req.user.id).emit("alert", {
          type: "result",
          ...payload
        });
        io.to("admin").emit("admin", {
          type: "result",
          ...payload
        });
        // Save in DB
        upsertSubmission(payload);
      })

      .save()
      .then(job => {
        let payload = {
          user_id: parseInt(req.user.id),
          submission_id: parseInt(job.id),
          question_id: parseInt(req.body.qid),
          status: "Submitted",
          startTime: job.data.startTime
        };
        io.to(req.user.id).emit("alert", {
          type: "result",
          ...payload
        });
        io.to("admin").emit("admin", {
          type: "result",
          ...payload
        });
        // Save in DB
        upsertSubmission(payload);
      });

    return res.send("submitted");
  });

module.exports = router;
