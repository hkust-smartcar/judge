var config = require("../../config")(process.env.NODE_ENV);
process.config = config;
var express = require("express");
var app = express();
const engine = require("ejs-locals");
var port = process.config.PORT || 8080;
var s = app.listen(port, () => {
  console.log("server is running on port " + port);
});
var server = require("http").createServer(app);
var io = require("./socket").init(s);
console.log("socket io init");
const assert = require("assert");
var bodyParser = require("body-parser");
const passport = require("passport");
const session = require("express-session");
const path = require("path");
const MongoDBStore = require("connect-mongodb-session")(session);
const initMongo = require("./mongo").init;

const initAuth = require("./auth");
const initHotReload = require("./hot-reload")(io);

let loaded = false;

var store = new MongoDBStore({
  uri: "mongodb://localhost:27017/judge_session",
  collection: "judge_sessions"
});
store.on("error", function(error) {
  assert.ifError(error);
  assert.ok(false);
});

const sessionMiddleware = session({ ...process.config.passportSession, store });

io.use(function(socket, next) {
  sessionMiddleware(socket.request, socket.request.res, next);
});
app.engine("ejs", engine);
app.set("views", path.join(__dirname, "/views"));
app.set("view engine", "ejs");
app.all("*", (req, res, next) => {
  if (!loaded) {
    return res.render("boot");
  } else {
    next();
  }
});

const initExpress = () => {
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(sessionMiddleware);
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(require("./routes"));
  app.post("/test", (req, res) => {
    console.log(req);
    console.log(req.body);
    // res.json(req);
    res.send("test");
  });
  initAuth(app);
};

const main = async () => {
  var client = await initMongo();
  initExpress();
  if (process.config.MODE === "dev") {
    initHotReload();
  }
  loaded = true;
};

main();
