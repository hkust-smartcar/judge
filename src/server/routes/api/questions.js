const express = require("express");
const router = express.Router();
const moment = require("moment");
const { readFileSync, writeFileSync } = require("fs");

const { getSessionUser, isAdmin } = require("../helper");

const getQuestions = () => {
  const q = readFileSync("../questions.json");
  return JSON.parse(q);
};

router
  .route("/")
  .get((req, res) => {
    res.json(getQuestions());
  })
  .post((req, res) => {});

router
  .route("/:id")
  .get((req, res) => {
    res.json(getQuestions().filter(({ id }) => id === id)[0]);
  })
  .put((req, res) => {});

module.exports = router;
