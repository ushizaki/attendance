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

// 出退勤ページ
router.get('/',(req, res, next)=> {
  var begin_time = begin_time ? begin_time : '';
  var finish_time = finish_time ? finish_time : '';
  var data = {
    title: '出退勤画面',
    login: req.session.login,
    begin_time: begin_time,
    finish_time: finish_time
  }
res.render('attendance/index' ,data);
});

// 出勤時間の送信処理
router.post('/begin',(req, res, next)=> {
  var begin_time = moment().format('YYYY-MM-DD HH:mm:ss');
  if (check(req,res)){ return };
  db.sequelize.sync()
    .then(() => db.Attendance.create({
      userId: req.session.login.id,
      begin_time: begin_time
    })
    .then(atd=>{
      res.redirect('/attendance', begin_time);
    })
    .catch((err)=>{
      res.redirect('/attendance');
    })
    )
});

// 退勤時間の送信処理
router.post('/finish',(req, res, next)=> {
  var finish_time = moment().format('YYYY-MM-DD HH:mm:ss');
  if (check(req,res)){ return };
  db.sequelize.sync()
    .then(() => db.Attendance.create({
      userId: req.session.login.id,
      finish_time: finish_time
    })
    .then(atd=>{
      res.redirect('/attendance', finish_time);
    })
    .catch((err)=>{
      res.redirect('/attendance');
    })
    )
});



module.exports = router;