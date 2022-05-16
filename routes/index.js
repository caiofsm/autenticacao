var express = require('express');
var router = express.Router();

router.get('/login', function (req, res, next) {
  if (req?.user?.username) {
    res.redirect('/members');
    return;
  }
  res.render('login');
});

router.get('/', (req, res) => {
  res.render('index');
});

module.exports = router;
