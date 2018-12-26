const express = require("express");
const router = express.Router();

router.route("/").get((req, res) => {
  res.json({ message: "api ready" });
});

router.use("/submits", require("./submits"));
router.use("/questions", require("./questions"));

module.exports = router;
