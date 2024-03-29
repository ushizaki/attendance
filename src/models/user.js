'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User' , {
    name: {
      type:DataTypes.STRING,
      validate: {
        notEmpty: {
          msg: "名前は必ず入力して下さい。"
        }
      }
    },
    pass: {
      type:DataTypes.STRING,
      validate: {
        notEmpty: {
          msg: "パスワードは必ず入力して下さい。"
        }
      }
    },
    mail: {
      type:DataTypes.STRING,
      validate: {
        isEmail: {
          msg: "メールアドレスは必ず入力して下さい。"
        }
      }
    },
    age: {
      type:DataTypes.INTEGER,
      validate: {
        isInt: { msg: "整数を必ず入力して下さい。"},
        min: {
          args: [0],
          msg: "ゼロ以上の値が必要です。"
        }
      }
    }
  },
  {
    charset: 'utf8',
    collate: 'utf8_general_ci'
  });
  User.associate = function(models) {
    User.hasMany(models.Attendance);
  };
  return User;
};