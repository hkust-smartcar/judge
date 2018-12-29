const express = require("express");
const router = express.Router();
const moment = require("moment");
const { Submission, Execution } = require("../submit/schema");
const { getSessionUser, isAdmin } = require("../helper");

/**
 * Query submission details given a particular user ID.
 *
 * @param {String} user_id ID of user of interest
 * @param {Number} page Page number
 * @returns {Promise} Model.find promise
 */
const querySubmissions = (user_id, page = 1) => {
  if (user_id === undefined)
    return Submission.find({}, null, {
      sort: { startTime: -1 },
      skip: 20 * (page - 1),
      limit: 20
    })
      .exec()
      .then(doc => {
        // console.log(doc);
        return doc;
      })
      .catch(err => {
        console.log(err);
      });
  else
    return Submission.find({ user_id }, null, {
      sort: { startTime: -1 },
      skip: 20 * (page - 1),
      limit: 20
    })
      .exec()
      .then(doc => {
        // console.log(doc);
        return doc;
      })
      .catch(err => {
        console.log(err);
      });
};

/**
 * Query execution details given a particular submission ID.
 *
 * @param {String} submission_id ID of submission of interest
 * @param {Number} page Page number
 * @returns {Promise} Model.find promise
 */
const queryExecutions = (submission_id, page = 1) => {
  if (submission_id === undefined)
    return Execution.find({}, null, {
      sort: { startTime: -1 },
      skip: 20 * (page - 1),
      limit: 20
    })
      .exec()
      .then(doc => {
        return doc;
      })
      .catch(err => {
        console.log(err);
      });
  else
    return Execution.find({ submission_id }, null, {
      sort: { startTime: -1 },
      skip: 20 * (page - 1),
      limit: 20
    })
      .exec()
      .then(doc => {
        return doc;
      })
      .catch(err => {
        console.log(err);
      });
};

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
        console.log(err);
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
        console.log(err);
      });
};

/**
 * query parameters:
 * userid: submits of which user to display, if not sepecified it is logged in user, not logged in error
 * page: for infinite loading, each page contains 20 submits. Not specified than page 1
 * all: to display all users' submits, need admin previllage
 *
 * response from newest to oldest
 */
router.route("/").get(async (req, res) => {
  const { userid, page = 1, all } = req.query;
  const user = getSessionUser(req);
  if (!!all && isAdmin(user)) {
    res.json({ submits: await querySubmissions(), page, totalPages: 20 });
  } else {
    let queryUserId = userid;
    if (!queryUserId) {
      queryUserId = user.id;
    }
    res.json({
      submits: await querySubmissions(queryUserId),
      page,
      totalPages: 20
    });
  }
});

module.exports = router;
