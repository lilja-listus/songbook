const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const expressValidator = require("express-validator");
const flash = require("connect-flash");
const session = require("express-session");
const config = require("./config/database");
const passport = require("passport");

mongoose.connect(config.database);
let db = mongoose.connection;

db.once("open", () => {
  console.log("Connected to MongoDB");
});

db.on("error", () => {
  console.log(err);
});

const app = express();

let Song = require("./models/song");

app.use(express.static(path.join(__dirname, "public")));

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//express-session middleware
app.use(
  session({
    secret: "keyword cat",
    resave: true,
    saveUninitialized: true
  })
);

app.use(require("connect-flash")());
app.use((req, res, next) => {
  res.locals.messages = require("express-messages")(req, res);
  next();
});

app.use(
  expressValidator({
    errorFormatter: function(param, msg, value) {
      var namespace = param.split("."),
        root = namespace.shift(),
        formParam = root;

      while (namespace.length) {
        formParam += "[" + namespace.shift() + "]";
      }
      return {
        param: formParam,
        msg: msg,
        value: value
      };
    }
  })
);

//Passport
require("./config/passport")(passport);
app.use(passport.initialize());
app.use(passport.session());

app.get("*", (req, res, next) => {
  res.locals.user = req.user || null;
  next();
});

app.get("/", (req, res) => {
  Song.find({}, (err, songs) => {
    if (err) {
      console.log(err);
    } else {
      res.render("index", {
        title: "The Vihreä Könyv",
        songs: songs
      });
    }
  });
});

let songs = require("./routes/songs");
let users = require("./routes/users");

app.use("/songs", songs);
app.use("/users", users);

app.listen(3000, () => {
  console.log("Server runs on the port 3000");
});
