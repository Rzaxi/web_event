'use strict';
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class DailyAttendance extends Model {
    static associate(models) {
      DailyAttendance.belongsTo(models.User, {
        foreignKey: 'user_id',
        as: 'User'
      });
      DailyAttendance.belongsTo(models.Event, {
        foreignKey: 'event_id',
        as: 'Event'
      });
      DailyAttendance.belongsTo(models.EventRegistration, {
        foreignKey: 'registration_id',
        as: 'Registration'
      });
    }
  }

  DailyAttendance.init({
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
      }
    },
    tanggal_kehadiran: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      comment: 'Tanggal spesifik kehadiran'
    },
    hari_ke: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: 'Hari ke berapa dalam event (1, 2, 3, dst)'
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
    check_out_time: {
      type: DataTypes.DATE,
      allowNull: true
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'DailyAttendance',
    tableName: 'DailyAttendances',
    indexes: [
      {
        unique: true,
        fields: ['user_id', 'event_id', 'tanggal_kehadiran']
      }
    ]
  });

  return DailyAttendance;
};
