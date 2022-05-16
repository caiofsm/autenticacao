var passport;
var { verifyAuth }  = require('../verifyAuth')
var crypto = require("crypto");
var db = require("../db");
function construtor(arg) {
  passport = arg;
  var express = require('express');
  var router = express.Router();

  router.post(
    '/login/password',
    passport.authenticate('local', {
      successReturnToOrRedirect: '/members',
      failureRedirect: '/login',
      failureMessage: 'error',
      failWithError: true,
      successMessage: 'sucess',
      authInfo: true,
      passReqToCallback: true,
    })
  );

  router.post('/signup', function (req, res, next) {
    var salt = crypto.randomBytes(16);
    crypto.pbkdf2(
      req.body.password,
      salt,
      310000,
      32,
      'sha256',
      function (err, hashedPassword) {
        if (err) {
          return next(err);
        }
        db.run(
          'INSERT INTO users (username, hashed_password, salt) VALUES (?, ?, ?)',
          [req.body.username, hashedPassword, salt],
          function (err) {
            if (err) {
              return next(err);
            }
            var user = {
              id: this.lastID,
              username: req.body.username,
            };
            req.login(user, function (err) {
              if (err) {
                return next(err);
              }
              res.redirect('/');
            });
          }
        );
      }
    );
  });

  router.post('/logout', function (req, res, next) {
    console.log('Logout');
    req.logout();
    res.redirect('/');
  });

  router.get('/members', verifyAuth, (req, res) => {
    res.render('members')
  });

  router.get('/signup', function (req, res, next) {
    res.render('signup');
  });

  return router;
}

module.exports = construtor;
