'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('certificates_issued', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
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
      certificate_number: {
        type: Sequelize.STRING(100),
        allowNull: false,
        unique: true
      },
      certificate_url: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      issued_date: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      downloaded_at: {
        type: Sequelize.DATE,
        allowNull: true
      },
      download_count: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        allowNull: false
      }
    });

    // Add indexes for better query performance
    await queryInterface.addIndex('certificates_issued', ['event_id']);
    await queryInterface.addIndex('certificates_issued', ['user_id']);
    await queryInterface.addIndex('certificates_issued', ['certificate_number']);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('certificates_issued');
  }
};
