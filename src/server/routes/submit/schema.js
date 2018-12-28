var mongoose = require("../../mongo").getdb();

/**
 * Schema for submission details.
 *
 * @class Submission
 */
var submissionSchema = new mongoose.Schema({
  submission_id: Number, // ID generated when put into submission queue
  question_id: Number, // Question ID
  status: String, // Could be 'Pending', 'Completed'
  score: Number, // Score
  error: String // Could be 'Compilation Error'
});

var Submission = mongoose.model("Submission", submissionSchema);

/**
 * Upserts an submission object to the Submission collection.
 *
 * @param {Object} obj
 */
var upsertSubmission = obj => {
  const query = {
    submission_id: obj["submission_id"]
  };
  Submission.findOneAndUpdate(query, obj, { upsert: true }, (err, doc) => {
    if (err) console.log("Error when saving mongoose:", err.message);
  });
};

/**
 * Schema for execution details.
 *
 * @class Execution
 */
var executionSchema = new mongoose.Schema({
  submission_id: Number,
  job_id: Number,
  question_id: Number,
  subtask_id: Number,
  status: String,
  score: Number,
  error: String
});

var Execution = mongoose.model("Execution", executionSchema);

/**
 * Save an execution object to Execution colletion
 *
 * @param {Object} obj
 */
var saveExecution = obj => {
  exe = new Execution(obj);
  exe.save((err, doc) => {
    if (err) console.log("Error when saving mongoose:", err.message);
  });
};

module.exports = { upsertSubmission, saveExecution };
