/**
 *
 * @param {ExpressJS reqest object} req
 */
const getSessionUser = req => {
  return (req.session.passport && req.session.passport.user) || false;
};

module.exports = { getSessionUser };
