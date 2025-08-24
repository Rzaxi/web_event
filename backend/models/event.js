'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Event extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Event.belongsTo(models.User, { foreignKey: 'created_by', as: 'creator' });
      Event.hasMany(models.EventRegistration, { foreignKey: 'event_id' });
    }
  }
  Event.init({
    judul: {
      type: DataTypes.STRING,
      allowNull: false
    },
    tanggal: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    waktu: {
      type: DataTypes.TIME,
      allowNull: false
    },
    lokasi: {
      type: DataTypes.STRING,
      allowNull: false
    },
    flyer_url: {
      type: DataTypes.STRING,
      allowNull: true
    },
    sertifikat_template: {
      type: DataTypes.STRING,
      allowNull: true
    },
    deskripsi: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    created_by: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      }
    }
  }, {
    sequelize,
    modelName: 'Event',
  });
  return Event;
};