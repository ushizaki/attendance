'use strict';
module.exports = (sequelize, DataTypes) => {
  const Attendance = sequelize.define('Attendance', {
    userId: {
      type: DataTypes.INTEGER,
    },
    begin_time: {
      type: DataTypes.DATE,
    },
    finish_time: {
      type: DataTypes.DATE,
    }
  }, 
  {
    charset: 'utf8',
    collate: 'utf8_general_ci'
  });
  Attendance.associate = function(models) {
    Attendance.belongsTo(models.User);
  };
  return Attendance;
};