'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class EventBookmark extends Model {
    static associate(models) {
      // Each bookmark belongs to a user
      EventBookmark.belongsTo(models.User, { 
        foreignKey: 'user_id',
        as: 'User'
      });
      
      // Each bookmark belongs to an event
      EventBookmark.belongsTo(models.Event, { 
        foreignKey: 'event_id',
        as: 'Event'
      });
    }
  }
  
  EventBookmark.init({
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
    event_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Events',
        key: 'id'
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    }
  }, {
    sequelize,
    modelName: 'EventBookmark',
    tableName: 'EventBookmarks',
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ['user_id', 'event_id'],
        name: 'unique_user_event_bookmark'
      }
    ]
  });
  
  return EventBookmark;
};
