var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  var data = {
    title: 'ユーザー/ログイン',
    content:'名前とパスワードを入力して下さい。'
  }
  res.render('users/login', data);
});

module.exports = router;
