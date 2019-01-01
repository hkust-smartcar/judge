const express = require("express");
const router = express.Router();
const moment = require("moment");
const { Submission, Execution } = require("../schema");
const { getSessionUser, isAdmin } = require("../helper");
const logger = require("../../logger")("api");

/**
 * Query execution details given a particular submission ID.
 *
 * @param {String} submission_id ID of submission of interest
 * @param {Number} page Page number
 * @returns {Promise} Model.find promise
 */
const queryExecutions = async (submission_id, page = 1) => {
  let ret;
  if (submission_id === undefined) {
    ret = await Execution.find({}, null, {
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
  } else {
    ret = await Execution.find({ submission_id }, null, {
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
  }
  return ret;
};

const deleteAdditionalResultIfNotAdmin = (isadmin, ret) => {
  if (!isadmin) {
    //hide additionalResult if user is not admin
    ret = ret.map(r => {
      r.additionalResult = undefined;
      return r;
    });
  }
  return ret;
};

/**
 * query parameters:
 * submission_id: submission id for execution query
 * page: for infinite loading, each page contains 20 execution results. Not specified than page 1
 * all: to display all users' executions, need admin previllage
 *
 * response from newest to oldest
 */
router.route("/").get(async (req, res) => {
  const { submission_id, page = 1, all } = req.query;
  const user = getSessionUser(req);
  if (!!all && isAdmin(user)) {
    res.json({
      executions: await queryExecutions(undefined, page),
      page,
      totalPages: 20
    });
  } else {
    if (!submission_id) {
      return res.json({
        error:
          "GET param submission_id is required if all=false or user not admin"
      });
    } else {
      res.json({
        executions: deleteAdditionalResultIfNotAdmin(
          isAdmin(user),
          await queryExecutions(submission_id, page)
        ),
        page,
        totalPages: 20
      });
    }
  }
});

module.exports = router;
