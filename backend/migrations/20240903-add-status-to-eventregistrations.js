'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('EventRegistrations', 'status', {
      type: Sequelize.ENUM('pending', 'confirmed', 'cancelled'),
      defaultValue: 'confirmed',
      allowNull: false
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('EventRegistrations', 'status');
  }
};
