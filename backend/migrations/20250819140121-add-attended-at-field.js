'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Add attended_at column
    await queryInterface.addColumn('EventRegistrations', 'attended_at', {
      type: Sequelize.DATE,
      allowNull: true,
      comment: 'Timestamp when participant attended the event'
    });

    // Update status enum to include 'attended'
    await queryInterface.changeColumn('EventRegistrations', 'status', {
      type: Sequelize.ENUM('pending', 'confirmed', 'cancelled', 'attended'),
      defaultValue: 'confirmed',
      allowNull: false
    });
  },

  async down(queryInterface, Sequelize) {
    // Remove attended_at column
    await queryInterface.removeColumn('EventRegistrations', 'attended_at');

    // Revert status enum to original values
    await queryInterface.changeColumn('EventRegistrations', 'status', {
      type: Sequelize.ENUM('pending', 'confirmed', 'cancelled'),
      defaultValue: 'confirmed',
      allowNull: false
    });
  }
};
