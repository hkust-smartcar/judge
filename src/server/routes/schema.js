var mongoose = require("../mongo").getdb();
const logger = require("../logger")("mongo");

/**
 * Schema for submission details.
 *
 * @class Submission
 */
var submissionSchema = new mongoose.Schema({
  user_id: Number, // User ID
  submission_id: Number, // ID generated when put into submission queue
  question_id: Number, // Question ID
  status: String, // Could be 'Pending', 'Completed'
  score: Number, // Score
  error: String, // Could be 'Compilation Error'
  startTime: Date,
  endTime: Date,
  additionalResult: Object
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
    if (err) logger.error("Error when saving mongoose:", err.message);
  });
};

/**
 * Schema for execution details.
 *
 * @class Execution
 */
var executionSchema = new mongoose.Schema({
  user_id: Number,
  submission_id: Number,
  job_id: Number,
  question_id: Number,
  subtask_id: Number,
  status: String,
  score: Number,
  error: String,
  startTime: Date,
  endTime: Date,
  additionalResult: Object
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
    if (err) logger.error("Error when saving mongoose:", err.message);
  });
};

/**
 * Schema for storing user.
 *
 * @class User
 */
var userSchema = new mongoose.Schema({
  user_id: Number,
  displayName: String
});

var User = mongoose.model("User", userSchema);

/**
 * Upserts an user object to the User collection.
 *
 * @param {Object} obj
 */
var upsertUser = obj => {
  const query = {
    user_id: obj["user_id"]
  };
  User.findOneAndUpdate(query, obj, { upsert: true }, (err, doc) => {
    if (err) console.log("Error when saving mongoose:", err.message);
  });
};

module.exports = {
  upsertSubmission,
  saveExecution,
  upsertUser,
  Submission,
  Execution,
  User
};
