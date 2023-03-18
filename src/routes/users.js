const express = require('express');
const { TimeoutError } = require('sequelize');
const router = express.Router();
const db = require('../models/index');
//const { Op } = require("sequelize");

/* GET users listing. */
router.get('/', (req, res, next) => {
  //const nm = req.query.name
  //const ml = req.query.mail
  //const min = req.query.min * 1
  //const max = req.query.max * 1
  db.User.findAll(
    //{
    // where: {
    //   //age: { [Op.gte]:min, [Op.lte]:max}
    //   [Op.or]: [
    //     {name: {[Op.like]:'%'+nm+'%'}},
    //     {mail: {[Op.like]:'%'+ml+'%'}}
    //   ]    
    // }
  //}
  ).then(usrs => {
    var data = {
      title: 'ユーザー/一覧',
      content: usrs
    }
    res.render('users/index', data);
  });
});

router.get('/add', (req, res, next) => {
  var data = {
    title: 'ユーザー/追加',
    form: new db.User(),
    err: null
  }
  res.render('users/add', data);
});

router.post('/add', (req, res, next) => {
  const form = {
    name: req.body.name,
    pass: req.body.pass,
    mail: req.body.mail,
    age: req.body.age
  }
  db.sequelize.sync()
    .then(() => db.User.create(form)
    .then(usr => {
      res.redirect('/users');
    })
    .catch(err=> {
      var data = {
      title: 'ユーザー/追加',
      form: new db.User(),
      err: err
    }
    res.render('users/add', data);
  })
  )
});

router.get('/edit',(req, res, next)=> {
  db.User.findByPk(req.query.id)
  .then(usr => {
    var data = {
      title: 'ユーザー/編集',
      form: usr
    }
    res.render('users/edit', data);
  });
});

router.post('/edit',(req, res, next)=> {
  db.User.findByPk(req.query.id)
  .then(usr => {
    usr.name = req.body.name;
    usr.pass = req.body.pass;
    usr.mail = req.body.mail;
    usr.age = req.body.age;
    usr.save().then(()=>res.redirect('/users'));
  });
});

router.get('/delete',(req, res, next)=> {
  db.User.findByPk(req.query.id)
  .then(usr => {
    var data = {
      title: 'ユーザー/削除',
      form: usr
    }
    res.render('users/delete', data);
  });
});

router.post('/delete',(req, res, next)=> {
  db.User.findByPk(req.body.id)
  .then(usr => {
    usr.destroy().then(() => res.redirect('/users'));
  });
});

router.get('/login', (req, res, next) => {
  var now = new Date();
  console.log(now);
  var data = {
     title:'ユーザー/ログイン',
     content:'名前とパスワードを入力下さい。'
  }
  res.render('users/login', data);
});

router.post('/login', (req, res, next) => {
  db.User.findOne({
    where:{
      name:req.body.name,
      pass:req.body.pass,
    }
  }).then(usr=>{
    if (usr != null) {
      req.session.login = usr;
      let back = req.session.cookie.path;
      if (back == null){
        back = '/';
      }
      // res.redirect(back);console.log(back);
      res.redirect('/attendance');
    } else {
      var data = {
        title:'ユーザー/ログイン',
        content:'名前かパスワードに問題があります。再度入力下さい。'
      }
      res.render('users/login', data);
    }
  })
});

module.exports = router;
