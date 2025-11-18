'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('ticket_categories', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      event_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Events',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
        comment: 'Nama kategori tiket (Early Bird, Regular, VIP, dll)'
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true,
        comment: 'Deskripsi kategori tiket'
      },
      price: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.00,
        comment: 'Harga tiket untuk kategori ini'
      },
      original_price: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true,
        comment: 'Harga asli sebelum diskon (untuk Early Bird)'
      },
      quota: {
        type: Sequelize.INTEGER,
        allowNull: true,
        comment: 'Kuota tiket untuk kategori ini'
      },
      sold_count: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: 'Jumlah tiket yang sudah terjual'
      },
      is_active: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
        comment: 'Status aktif kategori tiket'
      },
      sale_start_date: {
        type: Sequelize.DATE,
        allowNull: true,
        comment: 'Tanggal mulai penjualan kategori ini'
      },
      sale_end_date: {
        type: Sequelize.DATE,
        allowNull: true,
        comment: 'Tanggal berakhir penjualan kategori ini'
      },
      badge_text: {
        type: Sequelize.STRING,
        allowNull: true,
        comment: 'Text badge (HEMAT 20%, LIMITED, dll)'
      },
      badge_color: {
        type: Sequelize.ENUM('green', 'blue', 'red', 'yellow', 'purple'),
        allowNull: true,
        defaultValue: 'green',
        comment: 'Warna badge'
      },
      sort_order: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: 'Urutan tampilan kategori'
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP')
      }
    });

    // Add indexes
    await queryInterface.addIndex('ticket_categories', ['event_id']);
    await queryInterface.addIndex('ticket_categories', ['event_id', 'is_active']);
    await queryInterface.addIndex('ticket_categories', ['event_id', 'sort_order']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('ticket_categories');
  }
};
