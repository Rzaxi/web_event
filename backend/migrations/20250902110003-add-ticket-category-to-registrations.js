'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('EventRegistrations', 'ticket_category_id', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'ticket_categories',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
      comment: 'ID kategori tiket yang dipilih saat registrasi'
    });

    // Add index
    await queryInterface.addIndex('EventRegistrations', ['ticket_category_id']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('EventRegistrations', 'ticket_category_id');
  }
};
