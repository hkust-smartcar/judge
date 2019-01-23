const express = require("express");
const router = express.Router();
const moment = require("moment");
const { Submission, User } = require("../schema");
const { getSessionUser, isAdmin } = require("../helper");

const getBestAttemptByUidQid = async (user_id, question_id) => {
  return await Submission.find({ question_id, user_id }, null, {})
    .sort({ score: -1 })
    .limit(1)
    .exec()
    .then(d => d[0])
    .catch(err => {
      console.log(err);
    });
};

/**
 * Query execution details given a particular submission ID.
 *
 *
 * @returns {Promise} Model.find promise
 */
const querySubmits = async question_id => {
  const users = await User.find({}, null, {})
    .exec()
    .then(d => d);
  return await Promise.all(
    users.map(
      async ({ user_id }) => await getBestAttemptByUidQid(user_id, question_id)
    )
  ).then(d => d);
};

/**
 * query parameters:
 * user_id
 *
 * response from newest to oldest
 */
router.route("/").get(async (req, res) => {
  const { question_id, user_id } = req.query;
  if (question_id === undefined)
    res.json({ error: "question_id field is required" });
  if (user_id !== undefined) {
    return res.json(await getBestAttemptByUidQid(user_id, question_id));
  } else {
    return res.json(await querySubmits(question_id));
  }
});

module.exports = router;
