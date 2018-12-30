const assert = require("assert");
const upsert = require("../src/client/lib/upsert");

describe("upsert", () => {
  it("unique", () => {
    const input = [{ a: 1, b: 2, c: 3 }, { a: 4, b: 5, c: 6 }];
    assert.deepEqual(upsert(input, { a: 7, b: 8, c: 9 }, "a"), [
      { a: 7, b: 8, c: 9 },
      { a: 1, b: 2, c: 3 },
      { a: 4, b: 5, c: 6 }
    ]);
  });
  it("existed", () => {
    const input = [{ a: 1, b: 2, c: 3 }, { a: 4, b: 5, c: 6 }];
    assert.deepEqual(upsert(input, { a: 1, c: 9 }, "a"), [
      { a: 1, b: 2, c: 9 },
      { a: 4, b: 5, c: 6 }
    ]);
  });
});
