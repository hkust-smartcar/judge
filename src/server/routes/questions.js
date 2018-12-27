var express = require("express");
var router = express.Router();

router
  .route("/")

  .get((req, res) => {
    return res.render("index.ejs", {
      user: JSON.stringify(req.session.passport),
      title: "Question"
    });
  });

router.route("/:qid").get((req, res) => {
  return res.render("question.ejs", {
    user: JSON.stringify(req.session.passport),
    qid: req.params.qid,
    title: "Question"
  });
});

module.exports = router;
