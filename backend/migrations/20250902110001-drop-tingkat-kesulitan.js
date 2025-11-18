'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Events', 'tingkat_kesulitan');
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.addColumn('Events', 'tingkat_kesulitan', {
      type: Sequelize.ENUM('pemula', 'menengah', 'lanjutan'),
      allowNull: false,
      defaultValue: 'pemula'
    });
  }
};
