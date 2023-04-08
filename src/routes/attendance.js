const express = require('express');
const router = express.Router();
const db = require('../models/index');
const moment = require('moment');
const { Op } = require("sequelize");


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
  var today = moment().format('YYYY-MM-DD 00:00:00');
  db.Attendance.findAll({
    attributes: ['begin_time', 'finish_time'],
    where:{
      userId: req.session.login.id,
      updatedAt: {[Op.gt]: today}
    }
  }).then(db_data=>{
    console.log(db_data);
    var beginTime = db_data[0].dataValues.begin_time;
    var begin = new Date(beginTime)
    var begin_time = begin.getHours() + ':' + begin.getMinutes();
    if (db_data[1]) {
      var finishTime = db_data[1].dataValues.finish_time;
      var finish = new Date(finishTime)
      var finish_time = finish.getHours() + ':' + finish.getMinutes();
    }
    var data = {
      title: '出退勤画面',
      login: req.session.login,
      begin_time: begin_time,
      finish_time: finish_time
    }
    res.render('attendance/index', data);
  });
});

// 出勤時間の送信処理
router.post('/begin',(req, res, next)=> {
  var now_time = moment().format('YYYY-MM-DD HH:mm:ss');
  var data = {
    begin_time: now_time
  }
  if (check(req,res)){ return };
  db.sequelize.sync()
    .then(() => db.Attendance.create({
      userId: req.session.login.id,
      begin_time: now_time
    })
    .then(atd=>{
      res.redirect('/attendance', data);
    })
    .catch(err=>{
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
    .catch(err=>{
      res.redirect('/attendance');
    })
    )
});



module.exports = router;