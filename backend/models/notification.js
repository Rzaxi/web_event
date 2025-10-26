'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Notification extends Model {
    static associate(models) {
      // Notification belongs to a user
      Notification.belongsTo(models.User, {
        foreignKey: 'user_id',
        as: 'User'
      });

      // Notification can be related to an event (optional)
      Notification.belongsTo(models.Event, {
        foreignKey: 'related_event_id',
        as: 'Event'
      });
    }
  }

  Notification.init({
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    },
    type: {
      type: DataTypes.STRING(50),
      allowNull: false,
      comment: 'Type of notification: event_registered, event_reminder, event_updated, etc.'
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    related_event_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'Events',
        key: 'id'
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    },
    is_read: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false
    },
    read_at: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'Notification',
    tableName: 'Notifications',
    timestamps: true,
    indexes: [
      {
        fields: ['user_id', 'is_read']
      },
      {
        fields: ['user_id', 'createdAt']
      }
    ]
  });

  return Notification;
};
