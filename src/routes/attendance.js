const express = require('express');
const router = express.Router();
const db = require('../models/index');
const moment = require('moment');
const { Op } = require("sequelize");

const today = moment().format('YYYY-MM-DD 00:00:00');

//ログインのチェック
function check(req,res) {
  if (req.session.login == null) {
    req.session.back = '/attendance';
    res.redirect('/users/login');
    return true;
  } else {
    return false;
  }
};

// 出退勤ページ
router.get('/',(req, res, next)=> {
  db.Attendance.findAll({
    attributes: ['begin_time', 'finish_time'],
    where:{
      userId: req.session.login.id,
      updatedAt: {[Op.gt]: today}
    }
  }).then(db_data=>{
    if (db_data[0]) {
      var beginTime = db_data[0].dataValues.begin_time;
      var begin = new Date(beginTime);
      var beginMinutes = begin.getMinutes().toString().padStart(2, '0');
      var begin_time = begin.getHours() + ':' + beginMinutes;
      if (db_data[0].dataValues.finish_time) {
        var finishTime = db_data[0].dataValues.finish_time;
        var finish = new Date(finishTime)
        var finishMinutes = finish.getMinutes().toString().padStart(2, '0');
      var finish_time = finish.getHours() + ':' + finishMinutes;
      }
    };
    var message = message ? message : '';
    var data = {
      title: '出退勤画面',
      login: req.session.login,
      begin_time: begin_time,
      finish_time: finish_time,
      message: message
    }
    res.render('attendance/index', data);
  })
});

// 出勤時間の送信処理
router.post('/begin',(req, res, next)=> {
  if (check(req,res)){ return };
  const begin_time = req.body.begin_time;
  const finish_time = req.body.finish_time;
  if (begin_time) {
    const message = '※本日はすでに出勤打刻済みです！'
    var data = {
      title: '出退勤画面',
      login: req.session.login,
      begin_time: begin_time,
      finish_time: finish_time,
      message: message
    }
    res.render('attendance/index', data);
  } else {
    const now_time = moment().format('YYYY-MM-DD HH:mm:ss');
    db.sequelize.sync()
      .then(() => db.Attendance.create({
        userId: req.session.login.id,
        begin_time: now_time
      })
      .then(atd=>{
        res.redirect('/attendance');
      })
      .catch(err=>{
        res.redirect('/attendance');
      })
    )
  }
});
  

// 退勤時間の送信処理
router.post('/finish',(req, res, next)=> {
  if (check(req,res)){ return };
  const begin_time = req.body.begin_time;
  const finish_time = req.body.finish_time;
  if (!begin_time) {
    const message = '※本日はまだ出勤打刻していません！'
    var data = {
      title: '出退勤画面',
      login: req.session.login,
      begin_time: begin_time,
      finish_time: finish_time,
      message: message
    }
    res.render('attendance/index', data);
  } else if (finish_time) {
    const message = '※本日はすでに退勤打刻済みです！'
    var data = {
      title: '出退勤画面',
      login: req.session.login,
      begin_time: begin_time,
      finish_time: finish_time,
      message: message
    }
    res.render('attendance/index', data);
  } else {
    const now_time = moment().format('YYYY-MM-DD HH:mm:ss');
    db.sequelize.sync()
      .then(() => db.Attendance.update({
        finish_time: now_time
      },
      {
        where:{
        userId: req.session.login.id,
        updatedAt: {[Op.gt]: today}
      }
       
      })
      .then(atd=>{
        res.redirect('/attendance');
      })
      .catch(err=>{
        res.redirect('/attendance');
      })
    )
  }
});

//出退勤履歴
router.get('/history',(req, res, next)=> {
  if (check(req,res)){ return };
  db.Attendance.findAll({
    where:{
      userId: req.session.login.id
    },
    // offset: pg * pnum,
    // limit: pnum,
    // order: [
    //   ['createdAt', 'DESC']
    // ],
    include: [{
      model: db.User,
      required: true
    }]
  }).then(attendances => {
    var list = [];
    for (var i = 0; i < attendances.length; i++) {
      list.push(attendances[i].dataValues)
    };
    
    console.log('---------------- list -------------------------');
    console.log(list);
    var data = {
      title: '出退勤履歴',
      login: req.session.login,
      list: list
    }
    res.render('attendance/history', data);
  });
});

module.exports = router;