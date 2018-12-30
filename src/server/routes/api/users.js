const express = require("express");
const router = express.Router();
const moment = require("moment");
const { User } = require("../schema");
const { getSessionUser, isAdmin } = require("../helper");

/**
 * Query execution details given a particular submission ID.
 *
 *
 * @returns {Promise} Model.find promise
 */
const queryUsers = user_id => {
  const query = {};
  if (user_id !== undefined) {
    query.user_id = user_id;
  }
  return User.find(query, null, {})
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
 * user_id
 *
 * response from newest to oldest
 */
router.route("/").get(async (req, res) => {
  const { user_id } = req.query;
  return res.json(await queryUsers(user_id));
});

module.exports = router;
