const bodyParser = require("body-parser");
var passport = require("passport");
var LocalStrategy = require("passport-local");
var crypto = require("crypto");
var db = require("./db");

passport.use(
  new LocalStrategy(
    {
      usernameField: "username", // define the parameter in req.body that passport can use as username and password
      passwordField: "password",
      passReqToCallback: true,
    },
    function (req, username, password, cb) {
      db.get(
        "SELECT * FROM users WHERE username = ?",
        [username],
        function (err, row) {
          if (err) {
            return cb(err);
          }
          if (!row) {
            return cb(null, false, {
              message: "Incorrect username or password.",
            });
          }

          crypto.pbkdf2(
            password,
            row.salt,
            310000,
            32,
            "sha256",
            function (err, hashedPassword) {
              console.log("User:" + username);
              if (err) {
                console.log("error");
                return cb(err);
              }
              if (
                !crypto.timingSafeEqual(row.hashed_password, hashedPassword)
              ) {
                console.log("Incorrect username or password");
                return cb(null, false, {
                  message: "Incorrect username or password.",
                });
              }
              console.log("allowed");
              return cb(null, row);
            }
          );
        }
      );
    }
  )
);
passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (user, done) {
  done(null, user);
});

module.exports = passport;
