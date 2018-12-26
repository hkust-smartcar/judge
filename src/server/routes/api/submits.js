const express = require("express");
const router = express.Router();
const moment = require("moment");

const { getSessionUser, isAdmin } = require("../helper");

const generateDummy = userid => {
  return Array(20)
    .fill()
    .map((_, k) => ({
      _id: Buffer.from("" + Math.random() * 1000).toString("base64"),
      question_id: 0,
      user_id: userid || Math.floor(Math.random() * 20),
      score: Math.floor(Math.random() * 1000),
      runtime: Math.floor(Math.random() * 4000),
      state: "some state",
      source_code: "some path",
      submit_time: moment(
        Math.floor(Math.random() * 100000 - 50000) + Date.now()
      )
    }));
};

/**
 * query parameters:
 * userid: submits of which user to display, if not sepecified it is logged in user, not logged in error
 * page: for infinite loading, each page contains 20 submits. Not specified than page 1
 * all: to display all users' submits, need admin previllage
 *
 * response from newest to oldest
 */
router.route("/").get((req, res) => {
  const { userid, page = 1, all } = req.query;
  const user = getSessionUser(req);
  if (!!all && isAdmin(user)) {
    res.json({ submits: generateDummy(), page, totalPages: 20 });
  } else {
    let queryUserId = userid;
    if (!queryUserId) {
      queryUserId = user.id;
    }
    res.json({ submits: generateDummy(queryUserId), page, totalPages: 20 });
  }
});

module.exports = router;
