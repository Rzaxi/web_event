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
<<<<<<< HEAD
      // Optional association - only if TicketCategory model exists
      if (models.TicketCategory) {
        EventRegistration.belongsTo(models.TicketCategory, { 
          foreignKey: 'ticket_category_id',
          as: 'TicketCategory'
        });
      }
=======
>>>>>>> 2abfda7ee534c6e755ec7078e95159ca67f32216
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
<<<<<<< HEAD
    ticket_category_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'ticket_categories',
        key: 'id'
      },
      comment: 'ID kategori tiket yang dipilih saat registrasi'
    },
=======
>>>>>>> 2abfda7ee534c6e755ec7078e95159ca67f32216
    sertifikat_url: {
      type: DataTypes.STRING,
      allowNull: true
    },
    status: {
<<<<<<< HEAD
      type: DataTypes.ENUM('pending', 'confirmed', 'cancelled', 'attended'),
=======
      type: DataTypes.ENUM('pending', 'confirmed', 'cancelled'),
>>>>>>> 2abfda7ee534c6e755ec7078e95159ca67f32216
      defaultValue: 'confirmed',
      allowNull: false
    },
    attendance_token: {
      type: DataTypes.STRING(10),
      allowNull: true,
      comment: '10-digit attendance token sent via email during registration'
<<<<<<< HEAD
    },
    attended_at: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: 'Timestamp when participant attended the event'
=======
>>>>>>> 2abfda7ee534c6e755ec7078e95159ca67f32216
    }
  }, {
    sequelize,
    modelName: 'EventRegistration',
  });
  return EventRegistration;
};