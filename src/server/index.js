var config = require("../../config")(process.env.NODE_ENV);
process.config = config;
var express = require("express");
var multer  = require('multer')
var upload = multer({ dest: 'uploads/' })
var app = express();
var port = process.config.PORT || 8080;
var s = app.listen(port, () => {
  console.log("server is running on port " + port);
});
var server = require("http").createServer(app);
var io = require("socket.io").listen(s);
var bodyParser = require("body-parser");
const passport = require("passport");
const session = require("express-session");
const path = require("path");
const fs = require("fs");
const { exec } = require("child_process");
const MongoDBStore = require("connect-mongodb-session")(session);

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
app.set("views", path.join(__dirname, "/views"));
app.set("view engine", "ejs");
app.all("*", (req, res, next) => {
  if (!loaded) {
    return res.render("boot");
  } else {
    next();
  }
});

const initExpress = client => {
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(sessionMiddleware);
  app.use(passport.initialize());
  app.use(passport.session());
  // console.log(__dirname)
  app.all("/*:8081", (req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Content-Type: application/json; charset=utf-8");
    next();
  });
  app.get("/", (req, res) => {
    return res.render("index.ejs", {
      user: JSON.stringify(req.session.passport),
      page: ""
    });
  });
  app.use(express.static("./dist"));
  app.get("/profile", (req, res) => {
    if (!req.session.passport) res.redirect("/login");
    return res.render("index.ejs", {
      user: JSON.stringify(req.session.passport),
      page: "profile"
    });
  });
  app.get("/test", (req, res) => {
    return res.render("index.ejs", {
      user: `{"a":123,"b":{"c":"d"}}`,
      page: "hi"
    });
  });
  app.post("/pull", (req, res) => {
    exec("git pull origin master && npm i && pm2 restart judge", (...params) => {
      res.send(params);
    });
  });
  app.get('/submit',(req, res) => {
    return res.render("index.ejs", {
      user: JSON.stringify(req.session.passport),
    });
  });
  app.post('/submit',upload.array('myfile'),(req,res)=>{
    console.log('POST submit',req.body)
    console.log('files',req.files)
    return res.redirect('/submit')
  })
  initAuth(app);
};

const initSocket = client => {
  io.sockets.on("connection", socket => {
    console.log("connected", socket.id);
    if (socket.request.session.passport != null) {
      let user = socket.request.session.passport.user;
      // if logged in
      socket.join(user.id); // use user id as room id
      io.to(user.id).emit("name", `Welcome, ${user.displayName}`); // emit user name to channel "name"
    }
    socket.on("chatRoom", data => {
      console.log(data);
      io.sockets.emit("chatRoom", data);
    });
  });
};

const initMongo = async () => {
  let MongoClient = require("mongodb").MongoClient;
  let uri = "mongodb://localhost:27017";
  const client = new MongoClient(uri, { useNewUrlParser: true });
  await new Promise((resolve, reject) => {
    client.connect(err => {
      console.log(err || "no error connecting mongo");
      resolve(client);
    });
  });
  return client;
};

// # console.log process:env.NODE_ENV
// # console.log process:config

const main = async () => {
  var client = await initMongo();
  initExpress(client);
  initSocket(client);
  if (process.config.MODE === "dev") {
    initHotReload();
  }
  loaded = true;
};

main();
