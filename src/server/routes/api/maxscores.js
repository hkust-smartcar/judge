const express = require("express");
const router = express.Router();
const moment = require("moment");
const { Submission, Execution } = require("../submit/schema");
const { getSessionUser, isAdmin } = require("../helper");
const logger = require("../../logger")("api");

/**
 * Query the maximum scores achieved of each question by user_id.
 *
 * @param {String} user_id
 * @returns {Promise} Model.aggregate promise
 */
const queryMaxScores = user_id => {
  if (user_id === undefined)
    return Submission.aggregate([
      {
        $group: {
          _id: {
            user_id: "$user_id",
            question_id: "$question_id",
            score: "$score"
          }
        }
      },
      {
        $group: {
          _id: { user_id: "$_id.user_id", question_id: "$_id.question_id" },
          score: { $max: "$_id.score" }
        }
      },
      {
        $project: {
          _id: "$_id.user_id",
          question_id: "$_id.question_id",
          score: "$score"
        }
      }
    ])
      .exec()
      .then(doc => {
        return doc;
      })
      .catch(err => {
        logger.error(err);
      });
  else
    return Submission.aggregate([
      { $match: { user_id } },
      { $group: { _id: "$question_id", score: { $max: "$score" } } }
    ])
      .exec()
      .then(doc => {
        return doc;
      })
      .catch(err => {
        logger.error(err);
      });
};

/**
 * query parameters:
 * user_id: return the score of corresponding user
 * all: to display all users' maxscores
 *
 * response from newest to oldest
 */
router.route("/").get(async (req, res) => {
  const { userid, page = 1, all } = req.query;
  const user = getSessionUser(req);
  if (!!all) {
    res.json({
      maxScores: await queryMaxScores(undefined, page),
      page,
      totalPages: 20
    });
  } else {
    let queryUserId = userid;
    if (!queryUserId) {
      queryUserId = user.id;
    }
    res.json({
      maxScores: await queryMaxScores(queryUserId, page),
      page,
      totalPages: 20
    });
  }
});

module.exports = router;
