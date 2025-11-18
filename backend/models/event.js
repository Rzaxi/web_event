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
      Event.hasMany(models.EventRegistration, { foreignKey: 'event_id', as: 'registrations' });
      Event.hasMany(models.CertificateIssued, { foreignKey: 'event_id', as: 'certificates' });
      // Optional association - only if TicketCategory model exists
      if (models.TicketCategory) {
        Event.hasMany(models.TicketCategory, { foreignKey: 'event_id', as: 'ticketCategories' });
      }
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
    waktu_mulai: {
      type: DataTypes.TIME,
      allowNull: true,
      comment: 'Waktu mulai event'
    },
    waktu_selesai: {
      type: DataTypes.TIME,
      allowNull: true,
      comment: 'Waktu selesai event'
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
    sertifikat_elements: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'JSON string of certificate element positions',
      get() {
        const value = this.getDataValue('sertifikat_elements');
        return value ? JSON.parse(value) : null;
      },
      set(value) {
        this.setDataValue('sertifikat_elements', value ? JSON.stringify(value) : null);
      }
    },
    deskripsi: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    kategori: {
      type: DataTypes.ENUM(
        'webinar',
        'bootcamp',
        'pelatihan',
        'konser',
        'kompetisi'
      ),
      allowNull: false,
      defaultValue: 'webinar'
    },
    kapasitas_peserta: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    biaya: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      defaultValue: 0.00
    },
    status_event: {
      type: DataTypes.ENUM('draft', 'published', 'cancelled', 'completed'),
      allowNull: false,
      defaultValue: 'published'
    },
    created_by: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      }
    },
    durasi_hari: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
      comment: 'Durasi event dalam hari'
    },
    minimum_kehadiran: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
      comment: 'Minimum hari kehadiran untuk mendapat sertifikat'
    },
    memberikan_sertifikat: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      comment: 'Apakah event ini memberikan sertifikat'
    },
    tanggal_selesai: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      comment: 'Tanggal selesai event (untuk multi-day events)'
    },
    penyelenggara: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'Nama penyelenggara event'
    }
  }, {
    sequelize,
    modelName: 'Event',
  });
  return Event;
};