'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Events', 'durasi_hari', {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 1,
      comment: 'Durasi event dalam hari'
    });

    await queryInterface.addColumn('Events', 'minimum_kehadiran', {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 1,
      comment: 'Minimum hari kehadiran untuk mendapat sertifikat'
    });

    await queryInterface.addColumn('Events', 'memberikan_sertifikat', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      comment: 'Apakah event ini memberikan sertifikat'
    });

    await queryInterface.addColumn('Events', 'tanggal_selesai', {
      type: Sequelize.DATEONLY,
      allowNull: true,
      comment: 'Tanggal selesai event (untuk multi-day events)'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Events', 'durasi_hari');
    await queryInterface.removeColumn('Events', 'minimum_kehadiran');
    await queryInterface.removeColumn('Events', 'memberikan_sertifikat');
    await queryInterface.removeColumn('Events', 'tanggal_selesai');
  }
};
