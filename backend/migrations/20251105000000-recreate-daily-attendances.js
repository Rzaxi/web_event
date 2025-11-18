'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Recreate DailyAttendances table for certificate system
    await queryInterface.createTable('DailyAttendances', {
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
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id'
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      },
      attendance_date: {
        type: Sequelize.DATEONLY,
        allowNull: false,
        comment: 'Tanggal kehadiran'
      },
      status: {
        type: Sequelize.ENUM('present', 'absent', 'late', 'excused'),
        allowNull: false,
        defaultValue: 'present',
        comment: 'Status kehadiran'
      },
      check_in_time: {
        type: Sequelize.DATE,
        allowNull: true,
        comment: 'Waktu check-in (datetime lengkap)'
      },
      notes: {
        type: Sequelize.TEXT,
        allowNull: true,
        comment: 'Catatan kehadiran'
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

    // Add unique constraint: one attendance record per user per event per date
    await queryInterface.addConstraint('DailyAttendances', {
      fields: ['event_id', 'user_id', 'attendance_date'],
      type: 'unique',
      name: 'unique_daily_attendance'
    });

    // Add indexes for performance
    await queryInterface.addIndex('DailyAttendances', ['event_id']);
    await queryInterface.addIndex('DailyAttendances', ['user_id']);
    await queryInterface.addIndex('DailyAttendances', ['attendance_date']);
    await queryInterface.addIndex('DailyAttendances', ['status']);

    console.log('✅ Successfully recreated DailyAttendances table for certificate system');
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('DailyAttendances');
    console.log('✅ Successfully dropped DailyAttendances table');
  }
};
