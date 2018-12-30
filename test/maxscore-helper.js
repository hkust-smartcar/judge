const assert = require("assert");
const ms = require("../src/client/lib/maxscore-helper");

const scores = [
  { _id: 3, question_id: 0, score: null },
  { _id: 3, question_id: 1, score: 66 },
  { _id: 31, question_id: 1, score: 66 },
  { _id: 31, question_id: 0, score: 3 }
];

const ans = [
  {
    _id: 31,
    totalScores: 69,
    questions: {
      0: 3,
      1: 66
    }
  },
  {
    _id: 3,
    totalScores: 66,
    questions: {
      0: 0,
      1: 66
    }
  }
];

describe("maxscore helper", () => {
  it("reformed", () => {
    const input = [{ a: 1, b: 2, c: 3 }, { a: 4, b: 5, c: 6 }];
    assert.deepEqual(ms(scores), ans);
  });
});
