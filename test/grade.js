const {
  pointMatchLoss,
  matchPair
} = require("../src/server/routes/submit/grade/pointwise");
const assert = require("assert");

describe("true", function() {
  it("hello world", function() {
    assert.equal(1, 1);
  });
});

describe("pointMatchLoss", function() {
  it("very good marriage", function() {
    const ans = [[2, 2], [3, 3]];
    const res = [[2, 2], [3, 3]];
    assert.equal(
      JSON.stringify(matchPair(res, ans)),
      JSON.stringify([[[2, 2], [2, 2]], [[3, 3], [3, 3]]])
    );
  });

  it("marriage with miss ans", function() {
    const ans = [[2, 2], [3, 3], [4, 4]];
    const res = [[2, 2], [3, 3]];
    assert.equal(
      JSON.stringify(matchPair(res, ans)),
      JSON.stringify([[[2, 2], [2, 2]], [[3, 3], [3, 3]]])
    );
  });

  it("marriage with extra ans", function() {
    const ans = [[2, 2], [3, 3]];
    const res = [[2, 2], [3, 3], [4, 4]];
    assert.equal(
      JSON.stringify(matchPair(res, ans)),
      JSON.stringify([[[2, 2], [2, 2]], [[3, 3], [3, 3]]])
    );
  });

  it("grade perfect", function() {
    const ans = [[2, 2], [3, 3]];
    const res = [[2, 2], [3, 3]];
    assert.equal(pointMatchLoss(res, ans, 1), 1);
  });

  it("grade miss ans", function() {
    const ans = [[2, 2], [3, 3], [4, 4]];
    const res = [[2, 2], [3, 3]];
    assert.equal(pointMatchLoss(res, ans, 1), 0.802624679775096);
  });

  it("grade extra ans", function() {
    const ans = [[2, 2], [3, 3]];
    const res = [[2, 2], [3, 3], [4, 4]];
    assert.equal(pointMatchLoss(res, ans, 1), 0.802624679775096);
  });
});
