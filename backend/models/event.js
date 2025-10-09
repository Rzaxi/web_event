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
      Event.hasMany(models.DailyAttendance, { foreignKey: 'event_id' });
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
    deskripsi: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    kategori: {
      type: DataTypes.ENUM(
        'akademik',
        'olahraga', 
        'seni_budaya',
        'teknologi',
        'kewirausahaan',
        'sosial',
        'kompetisi',
        'workshop',
        'seminar',
        'lainnya'
      ),
      allowNull: false,
      defaultValue: 'lainnya'
    },
    tingkat_kesulitan: {
      type: DataTypes.ENUM('pemula', 'menengah', 'lanjutan'),
      allowNull: false,
      defaultValue: 'pemula'
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