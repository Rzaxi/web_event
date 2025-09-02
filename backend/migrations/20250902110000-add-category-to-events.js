'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Events', 'kategori', {
      type: Sequelize.ENUM(
        'akademik',
        'olahraga', 
        'seni_budaya',
        'teknologi',
        'kewirausahaan',
        'sosial',
        'kompetisi',
        'workshop',
        'seminar',
        'lainnya'
      ),
      allowNull: false,
      defaultValue: 'lainnya',
      after: 'deskripsi'
    });

    await queryInterface.addColumn('Events', 'tingkat_kesulitan', {
      type: Sequelize.ENUM('pemula', 'menengah', 'lanjutan'),
      allowNull: false,
      defaultValue: 'pemula',
      after: 'kategori'
    });

    await queryInterface.addColumn('Events', 'kapasitas_peserta', {
      type: Sequelize.INTEGER,
      allowNull: true,
      after: 'tingkat_kesulitan'
    });

    await queryInterface.addColumn('Events', 'biaya', {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: true,
      defaultValue: 0.00,
      after: 'kapasitas_peserta'
    });

    await queryInterface.addColumn('Events', 'status_event', {
      type: Sequelize.ENUM('draft', 'published', 'cancelled', 'completed'),
      allowNull: false,
      defaultValue: 'published',
      after: 'biaya'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Events', 'kategori');
    await queryInterface.removeColumn('Events', 'tingkat_kesulitan');
    await queryInterface.removeColumn('Events', 'kapasitas_peserta');
    await queryInterface.removeColumn('Events', 'biaya');
    await queryInterface.removeColumn('Events', 'status_event');
  }
};
