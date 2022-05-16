var session = require("express-session");

var SQLiteStore = require("connect-sqlite3")(session);
var ses = session({
  secret: "keyboard cat",
  resave: false,
  saveUninitialized: false,
  store: new SQLiteStore({ db: "sessions.db", dir: "./var/db" }),
});

module.exports = ses;
