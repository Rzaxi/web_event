'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('DailyAttendances', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
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
      registration_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'EventRegistrations',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      tanggal_kehadiran: {
        type: Sequelize.DATEONLY,
        allowNull: false,
        comment: 'Tanggal spesifik kehadiran'
      },
      hari_ke: {
        type: Sequelize.INTEGER,
        allowNull: false,
        comment: 'Hari ke berapa dalam event (1, 2, 3, dst)'
      },
      status: {
        type: Sequelize.ENUM('present', 'absent', 'late', 'excused'),
        defaultValue: 'absent',
        allowNull: false
      },
      check_in_time: {
        type: Sequelize.DATE,
        allowNull: true
      },
      check_out_time: {
        type: Sequelize.DATE,
        allowNull: true
      },
      notes: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });

    // Add unique constraint to prevent duplicate attendance per day
    await queryInterface.addIndex('DailyAttendances', {
      unique: true,
      fields: ['user_id', 'event_id', 'tanggal_kehadiran'],
      name: 'unique_daily_attendance'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('DailyAttendances');
  }
};
