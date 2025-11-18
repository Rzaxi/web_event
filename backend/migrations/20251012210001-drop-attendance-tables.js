'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Drop DailyAttendances table first (has foreign key to Attendances)
    await queryInterface.dropTable('DailyAttendances');
    
    // Drop Attendances table
    await queryInterface.dropTable('Attendances');
    
    console.log('✅ Successfully dropped Attendances and DailyAttendances tables');
  },

  async down(queryInterface, Sequelize) {
    // Recreate Attendances table
    await queryInterface.createTable('Attendances', {
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
        }
      },
      event_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Events',
          key: 'id'
        }
      },
      check_in_time: {
        type: Sequelize.DATE,
        allowNull: true
      },
      check_out_time: {
        type: Sequelize.DATE,
        allowNull: true
      },
      status: {
        type: Sequelize.ENUM('present', 'absent', 'late'),
        defaultValue: 'absent'
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

    // Recreate DailyAttendances table
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
        }
      },
      event_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Events',
          key: 'id'
        }
      },
      hari_ke: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      tanggal: {
        type: Sequelize.DATEONLY,
        allowNull: false
      },
      status: {
        type: Sequelize.ENUM('present', 'absent', 'late', 'excused'),
        defaultValue: 'absent'
      },
      check_in_time: {
        type: Sequelize.TIME,
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
  }
};
