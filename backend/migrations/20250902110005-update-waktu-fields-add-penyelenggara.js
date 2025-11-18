'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Add waktu_mulai column
    await queryInterface.addColumn('Events', 'waktu_mulai', {
      type: Sequelize.TIME,
      allowNull: true,
      comment: 'Waktu mulai event'
    });

    // Add waktu_selesai column
    await queryInterface.addColumn('Events', 'waktu_selesai', {
      type: Sequelize.TIME,
      allowNull: true,
      comment: 'Waktu selesai event'
    });

    // Add penyelenggara column
    await queryInterface.addColumn('Events', 'penyelenggara', {
      type: Sequelize.STRING,
      allowNull: true,
      comment: 'Nama penyelenggara event'
    });

    // Copy existing waktu data to waktu_mulai
    await queryInterface.sequelize.query(`
      UPDATE Events SET waktu_mulai = waktu WHERE waktu IS NOT NULL
    `);

    // Remove old waktu column
    await queryInterface.removeColumn('Events', 'waktu');
  },

  async down(queryInterface, Sequelize) {
    // Add back waktu column
    await queryInterface.addColumn('Events', 'waktu', {
      type: Sequelize.TIME,
      allowNull: false
    });

    // Copy waktu_mulai back to waktu
    await queryInterface.sequelize.query(`
      UPDATE Events SET waktu = waktu_mulai WHERE waktu_mulai IS NOT NULL
    `);

    // Remove new columns
    await queryInterface.removeColumn('Events', 'waktu_mulai');
    await queryInterface.removeColumn('Events', 'waktu_selesai');
    await queryInterface.removeColumn('Events', 'penyelenggara');
  }
};
