const logger = require("./logger")("socket");

let io;

const init = s => {
  io = require("socket.io").listen(s);
  io.sockets.on("connection", socket => {
    logger.info(
      "connected",
      socket.id,
      socket.request.session.passport &&
        socket.request.session.passport.user &&
        socket.request.session.passport &&
        socket.request.session.passport.user.displayName
    );
    if (
      socket.request.session.passport &&
      socket.request.session.passport.user
    ) {
      let user = socket.request.session.passport.user;
      // if logged in
      socket.join(user.id); // use user id as room id
      io.to(user.id).emit("name", `Welcome, ${user.displayName}`); // emit user name to channel "name"
    }
  });

  logger.info("socket io init");
  return io;
};

module.exports = {
  init,
  getio: () => io
};
