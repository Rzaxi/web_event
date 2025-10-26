'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('EventBookmarks', {
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

    // Add unique index to prevent duplicate bookmarks
    await queryInterface.addIndex('EventBookmarks', ['user_id', 'event_id'], {
      unique: true,
      name: 'unique_user_event_bookmark'
    });

    console.log('✅ EventBookmarks table created successfully');
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('EventBookmarks');
    console.log('✅ EventBookmarks table dropped');
  }
};
