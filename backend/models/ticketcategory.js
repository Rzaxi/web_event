'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class TicketCategory extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      TicketCategory.belongsTo(models.Event, { foreignKey: 'event_id', as: 'event' });
      TicketCategory.hasMany(models.EventRegistration, { foreignKey: 'ticket_category_id', as: 'registrations' });
    }
  }
  TicketCategory.init({
    event_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Events',
        key: 'id'
      }
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: 'Nama kategori tiket (Early Bird, Regular, VIP, dll)'
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Deskripsi kategori tiket'
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0.00,
      comment: 'Harga tiket untuk kategori ini'
    },
    original_price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      comment: 'Harga asli sebelum diskon (untuk Early Bird)'
    },
    quota: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: 'Kuota tiket untuk kategori ini'
    },
    sold_count: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      comment: 'Jumlah tiket yang sudah terjual'
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
      comment: 'Status aktif kategori tiket'
    },
    sale_start_date: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: 'Tanggal mulai penjualan kategori ini'
    },
    sale_end_date: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: 'Tanggal berakhir penjualan kategori ini'
    },
    badge_text: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'Text badge (HEMAT 20%, LIMITED, dll)'
    },
    badge_color: {
      type: DataTypes.ENUM('green', 'blue', 'red', 'yellow', 'purple'),
      allowNull: true,
      defaultValue: 'green',
      comment: 'Warna badge'
    },
    sort_order: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      comment: 'Urutan tampilan kategori'
    }
  }, {
    sequelize,
    modelName: 'TicketCategory',
    tableName: 'ticket_categories',
    timestamps: true
  });
  return TicketCategory;
};
