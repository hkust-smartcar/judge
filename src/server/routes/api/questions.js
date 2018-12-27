const express = require("express");
const router = express.Router();
const moment = require("moment");
const { readFileSync, writeFileSync } = require("fs");
const path = require("path");

const { getSessionUser, isAdmin } = require("../helper");

const getQuestions = () => {
  const q = readFileSync(path.join(__dirname, "../../../../questions.json"));
  return JSON.parse(q);
};

router
  .route("/")
  .get((req, res) => {
    res.json(getQuestions());
  })
  .post((req, res) => {});

router
  .route("/:qid")
  .get((req, res) => {
    if (false && isAdmin(getSessionUser(req))) {
      res.json(getQuestions().filter(({ id }) => id === req.params.qid)[0]);
    } else {
      const q = getQuestions().filter(({ id }) => id == req.params.qid);
      if (q.length == 0)
        res.json({ error: `question of id ${req.params.qid} does not found` });
      res.json(hideAdminOnlyField(q[0]));
    }
  })
  .put((req, res) => {});

/**
 * Hide some field that should not be visible for ordinary user
 *
 * 1. hide the input output of subtask dataset
 *
 * @param {Object} question a qestion object
 */
const hideAdminOnlyField = question => {
  const q = { ...question };
  q.subtasks.forEach(subtask => {
    delete subtask.dataset;
  });
  return q;
};

module.exports = router;
