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
const isAdmin = user =>
  [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13].indexOf(Number(user.id)) !== -1;

/**
 * Round $num to $dp decimal points
 *
 * @param {Number} num
 * @param {Number} dp
 */
const round = (num, dp = 2) => (dp = 10 ** dp && Math.round(num * dp) / dp);

/**
 * An integer recording 'seconds' maps into hh:mm:ss format.
 *
 * @param {Number} time
 * @returns {Number} time in hh:mm:ss format
 */
const sec2str = time => {
  const pad = (num, size) => ("000" + num).slice(-size);
  hours = Math.floor(time / 60 / 60);
  minutes = Math.floor(time / 60) % 60;
  seconds = Math.floor(time - minutes * 60);
  return pad(hours, 2) + ":" + pad(minutes, 2) + ":" + pad(seconds, 2);
};

module.exports = { getSessionUser, isAdmin, round, sec2str };
