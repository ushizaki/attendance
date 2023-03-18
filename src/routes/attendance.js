const express = require('express');
const router = express.Router();
const db = require('../models/index');
const moment = require('moment');


//ログインのチェック
function check(req,res) {
  if (req.session.login == null) {
    req.session.back = '/attendance';
    res.redirect('/users/login');
    return true;
  } else {
    return false;
  }
}

var now_time = moment().format('YYYY-MM-DD HH:mm:ss');

// 出退勤ページ
router.get('/',(req, res, next)=> {
    var data = {
      title: '出退勤画面',
      login: req.session.login,
      now_time: now_time
    }
    res.render('attendance/index' ,data);
  // });
});

// 出勤時間の送信処理
router.post('/begin',(req, res, next)=> {
  if (check(req,res)){ return };
  db.sequelize.sync()
    .then(() => db.Attendance.Insert({
      userId: req.session.login.id,
      begin_time: now_time
    })
    .then(brd=>{
      res.redirect('/attendance');
    })
    .catch((err)=>{
      res.redirect('/attendance');
    })
    )
});

// 退勤時間の送信処理
router.post('/finish',(req, res, next)=> {
  if (check(req,res)){ return };
  db.sequelize.sync()
    .then(() => db.Attendance.create({
      userId: req.session.login.id,
      finish_time: now_time
    })
    .then(brd=>{
      res.redirect('/attendance');
    })
    .catch((err)=>{
      res.redirect('/attendance');
    })
    )
});



module.exports = router;