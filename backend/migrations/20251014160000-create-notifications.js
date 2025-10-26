'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Notifications', {
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
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      },
      type: {
        type: Sequelize.STRING(50),
        allowNull: false,
        comment: 'Type of notification'
      },
      title: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      message: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      related_event_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'Events',
          key: 'id'
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      },
      is_read: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        allowNull: false
      },
      read_at: {
        type: Sequelize.DATE,
        allowNull: true
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

    // Add indexes for better query performance
    await queryInterface.addIndex('Notifications', ['user_id', 'is_read'], {
      name: 'idx_user_read_status'
    });

    await queryInterface.addIndex('Notifications', ['user_id', 'createdAt'], {
      name: 'idx_user_created'
    });

    console.log('✅ Notifications table created successfully');
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Notifications');
    console.log('✅ Notifications table dropped');
  }
};
