'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Attendance extends Model {
    static associate(models) {
      Attendance.belongsTo(models.User, { foreignKey: 'user_id' });
      Attendance.belongsTo(models.Event, { foreignKey: 'event_id' });
      Attendance.belongsTo(models.EventRegistration, { foreignKey: 'registration_id' });
    }
  }
  Attendance.init({
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      }
    },
    event_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Events',
        key: 'id'
      }
    },
    registration_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'EventRegistrations',
        key: 'id'
      },
      unique: true
    },
    status: {
      type: DataTypes.ENUM('present', 'absent', 'late', 'excused'),
      defaultValue: 'absent',
      allowNull: false
    },
    check_in_time: {
      type: DataTypes.DATE,
      allowNull: true
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'Attendance',
  });
  return Attendance;
};
