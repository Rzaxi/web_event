'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class EventRegistration extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      EventRegistration.belongsTo(models.User, { 
        foreignKey: 'user_id',
        as: 'User'
      });
      EventRegistration.belongsTo(models.Event, { 
        foreignKey: 'event_id',
        as: 'Event'
      });
    }
  }
  EventRegistration.init({
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
    sertifikat_url: {
      type: DataTypes.STRING,
      allowNull: true
    },
    status: {
      type: DataTypes.ENUM('pending', 'confirmed', 'cancelled'),
      defaultValue: 'confirmed',
      allowNull: false
    },
    attendance_token: {
      type: DataTypes.STRING(10),
      allowNull: true,
      comment: '10-digit attendance token sent via email during registration'
    }
  }, {
    sequelize,
    modelName: 'EventRegistration',
  });
  return EventRegistration;
};