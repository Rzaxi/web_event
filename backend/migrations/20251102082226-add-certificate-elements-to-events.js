'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('Events', 'sertifikat_elements', {
      type: Sequelize.TEXT,
      allowNull: true,
      comment: 'JSON string of certificate element positions (name, signature, etc)'
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('Events', 'sertifikat_elements');
  }
};
