const express = require("express");
const router = express.Router();

router.route("/").get((req, res) => {
  res.json({ message: "api ready" });
});

router.use("/submits", require("./submits"));
router.use("/questions", require("./questions"));
router.use("/executions", require("./executions"));
router.use("/maxscores", require("./maxscores"));

module.exports = router;
