/**
 * @param {Array} ms maxscore api returned array
 * @return {Array} [{uerid,questions,totalScores}]
 */
module.exports = ms => {
  ms = ms.reduce((p, c, k) => {
    if (p[c._id] == undefined) p[c._id] = {};
    p[c._id][c.question_id] = c.score || 0;
    return p;
  }, {});
  ms = Object.keys(ms).map(uid => ({
    user_id: uid,
    questions: ms[uid],
    totalScores: Object.values(ms[uid]).reduce((p, c, k) => p + c, 0)
  }));
  ms.sort((a, b) => b.totalScores - a.totalScores);
  return ms;
};
