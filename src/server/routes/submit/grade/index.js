const { pointMatchLoss } = require("./pointwise.js");

/**
 * @param {string} pred Output from user's code
 * @param {string} exp Expected output
 * @param {string} type question type, could be "IO" or "IOPointwise"
 * @param {number} maxScore maximum score
 * @return {number} score
 */
const evaluate = (pred, exp, type, maxScore) => {
  switch (type) {
    case "IOPointwise":
      pred = pred
        .split(" ") // split by space
        .splice(1) // remove the first element since it represents the number of points
        .reduce((resultArray, item, index) => {
          // group by twos
          const chunkIndex = Math.floor(index / 2);
          if (!resultArray[chunkIndex]) resultArray[chunkIndex] = [];
          resultArray[chunkIndex].push(item);
          return resultArray;
        }, []);
      exp = exp
        .split(" ")
        .splice(1)
        .reduce((resultArray, item, index) => {
          const chunkIndex = Math.floor(index / 2);
          if (!resultArray[chunkIndex]) resultArray[chunkIndex] = [];
          resultArray[chunkIndex].push(item);
          return resultArray;
        }, []);
      return pointMatchLoss(pred, exp, maxScore) || 0;
      break;
    default:
      console.log({ pred, exp });
      return (pred == exp) * maxScore;
      // default as normal IO
      break;
  }
};

module.exports = evaluate;
