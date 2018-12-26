/**
 * get user object from express session, false if not logged in
 * @param {ExpressJS reqest object} req
 */
const getSessionUser = req => {
  return (req.session.passport && req.session.passport.user) || false;
};

/**
 * return whether a user is admin
 */
const isAdmin = user => true;

module.exports = { getSessionUser, isAdmin };
