/**
 * attempt to match the user's answers with model answer
 * then calculate its sum of L1 loss
 * foreach missing matching, it will add a unit penalty
 *
 * @param {Number[][]} submittedAnswers user's answer
 * @param {Number[][]} modelAnswers model answer
 * @param {Number} maxScore maximum score
 * @param {Number} unmatchPenalty penalty for each unmatched points
 * @param {Number} threshold if distance of two points is less than threshold, distance will be 0
 */

const pointMatchLoss = (
  submittedAnswers,
  modelAnswers,
  maxScore,
  unmatchPenalty = Math.sqrt(320 ** 2 + 240 ** 2),
  threshold = 1
) => {
  const pairs = matchPair(submittedAnswers, modelAnswers);
  const numOfUnmatched = Math.abs(
    submittedAnswers.length - modelAnswers.length
  );
  return (
    (1 -
      Math.tanh(
        (pairs.reduce((prev, currv) => prev + dist(currv, threshold), 0) +
          numOfUnmatched * unmatchPenalty) /
          2000
      )) *
    maxScore
  );
};

/**
 * pair two sets of points to maximize grade
 * using stable marriage, which is programmer's view on marriage lol
 *
 * @param {Number[][]} res_ user's answer, array of 2-tuple
 * @param {Number[][]} ans_ model answer, array of 2-tuple
 *
 * @return edges connecting the point to paired point
 * no edges means no matching edge
 */
const matchPair = (res_, ans_) => {
  res = res_.slice();
  ans = ans_.slice();
  res.forEach((r, i) => {
    r.index = i;
  });
  ans.forEach((r, i) => {
    r.index = i;
  });
  res.forEach((A, a_i) => {
    A.mark_list = [];
    ans.forEach((B, b_i) => {
      A.mark_list.push({ point: B, mark: dist([A, B]) });
    });
    A.mark_list.sort((a, b) => {
      return a.mark - b.mark;
    }); //small to large
  });
  ans.forEach((A, a_i) => {
    A.mark_list = [];
    res.forEach((B, b_i) => {
      A.mark_list.push({ point: B, mark: dist([A, B]) });
    });
    A.mark_list.sort((a, b) => {
      return a.mark - b.mark;
    }); //small to large
  });
  A_single = ans.slice();
  B_single = res.slice();
  A_forever_single = [];
  edges = [];
  while (A_single.length != 0) {
    //A perpose to his most desire:
    //if B's current husband is less desire than A, take over the position that B's husband become single
    //else perpose to next most desire
    //if no more desire, A forever single
    A = A_single.shift();
    for (i = 0; i < A.mark_list.length; i++) {
      B = A.mark_list[i].point;
      if (!B.link) {
        //B is available
        edges.push([B, A]);
        B.link = A;
        A.link = B;
        B_single.splice(B_single.indexOf(B));
        break;
      } else if (
        B.mark_list.findIndex(o => o.point == A) <
        B.mark_list.findIndex(o => o.point == B.link)
      ) {
        edges.splice(edges.indexOf([B, B.link]));
        edges.push([B, A]);
        A_single.push(B.link);
        delete B.link.link;
        B.link = A;
        A.link = B;
        B_single.splice(B_single.indexOf(B));
        break;
      }
    }
    if (!A.link) {
      A_forever_single.push(A);
    }
  }
  return edges.map(edge => {
    return edge.map(pt => {
      return [pt[0], pt[1]];
    });
  });
};

/**
 * L2 distance
 *
 * @param {Number[][]} param0 an edge denoted by array of points
 * @param {Number} threshold if distance of two points is less than threshold, distance will be 0
 */
const dist = ([[x0, y0], [x1, y1]], threshold = 0) => {
  let d = Math.sqrt((x0 - x1) ** 2 + (y0 - y1) ** 2);
  if (d <= threshold) {
    return 0;
  } else {
    return d;
  }
};

module.exports = { pointMatchLoss, matchPair };
