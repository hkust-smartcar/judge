/**
 * get user object from express session, false if not logged in
 * @param {Request} req
 */
const getSessionUser = req => {
  return (req.session.passport && req.session.passport.user) || false;
};

/**
 * return whether a user is admin
 */
const isAdmin = user => true;

/**
 * Round $num to $dp decimal points
 *
 * @param {Number} num
 * @param {Number} dp
 */
const round = (num, dp = 2) => (dp = 10 ** dp && Math.round(num * dp) / dp);

module.exports = { getSessionUser, isAdmin, round };
