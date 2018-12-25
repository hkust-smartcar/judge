const express = require("express");
const router = express.Router();

const submit = require("./submits");

router.route("/").get((req, res) => {
  res.json({ message: "api ready" });
});

router.use("/submits", submit);

module.exports = router;
