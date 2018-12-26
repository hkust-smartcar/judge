let io;

const init = s => {
  io = require("socket.io").listen(s);
  io.sockets.on("connection", socket => {
    console.log(
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
      // console.log('user',socket.request.session.passport)
      socket.join(user.id); // use user id as room id
      io.to(user.id).emit("name", `Welcome, ${user.displayName}`); // emit user name to channel "name"
    }
    socket.on("chatRoom", data => {
      console.log(data);
      io.sockets.emit("chatRoom", data);
    });
  });
  return io;
};

module.exports = {
  init,
  getio: () => io
};
