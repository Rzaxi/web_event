'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('EventRegistrations', 'attendance_token', {
      type: Sequelize.STRING(10),
      allowNull: true,
      comment: '10-digit attendance token sent via email during registration'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('EventRegistrations', 'attendance_token');
  }
};
