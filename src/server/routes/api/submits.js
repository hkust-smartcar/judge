const express = require("express");
const router = express.Router();
const moment = require("moment");
const { Submission, Execution } = require("../submit/schema");
const { getSessionUser, isAdmin } = require("../helper");

/**
 * Query submission details given a particular user ID.
 *
 * @param {String} user_id ID of user of interest
 * @returns {Promise} Model.find promise
 */
const querySubmissions = user_id => {
  if (user_id === undefined)
    return Submission.find({}, null, { sort: { startTime: -1 } })
      .exec()
      .then(doc => {
        // console.log(doc);
        return doc;
      })
      .catch(err => {
        console.log(err);
      });
  else
    return Submission.find({ user_id }, null, { sort: { startTime: -1 } })
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
