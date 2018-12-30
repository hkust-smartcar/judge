const express = require("express");
const router = express.Router();
const moment = require("moment");
const { Submission, Execution } = require("../submit/schema");
const { getSessionUser, isAdmin } = require("../helper");
const logger = require("../../logger")("api");

/**
 * Query submission details given a particular user ID.
 *
 * @param {String} user_id ID of user of interest
 * @param {Number} page Page number
 * @returns {Promise} Model.find promise
 */
const querySubmissions = (user_id, page, question_id) => {
  const query = {};

  if (user_id !== undefined) {
    query.user_id = user_id;
  }
  if (question_id !== undefined) {
    query.question_id = question_id;
  }
  return Submission.find(query, null, {
    sort: { startTime: -1 },
    skip: 20 * (page - 1),
    limit: 20
  })
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
 * userid: submits of which user to display, if not sepecified it is logged in user, not logged in error
 * page: for infinite loading, each page contains 20 submits. Not specified than page 1
 * all: to display all users' submits, need admin previllage
 *
 * response from newest to oldest
 */
router.route("/").get(async (req, res) => {
  const { userid, page = 1, all, qid_filter } = req.query;
  const user = getSessionUser(req);
  if (!!all && isAdmin(user)) {
    res.json({
      submits: await querySubmissions(undefined, page, qid_filter),
      page,
      totalPages: 20
    });
  } else {
    let queryUserId = userid;
    if (!queryUserId) {
      queryUserId = user.id;
    }
    res.json({
      submits: await querySubmissions(queryUserId, page, qid_filter),
      page,
      totalPages: 20
    });
  }
});

module.exports = router;
