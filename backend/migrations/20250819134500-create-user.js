'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      nama_lengkap: {
        type: Sequelize.STRING
      },
      email: {
        type: Sequelize.STRING
      },
      no_handphone: {
        type: Sequelize.STRING
      },
      alamat: {
        type: Sequelize.TEXT
      },
      pendidikan_terakhir: {
        type: Sequelize.STRING
      },
      password_hash: {
        type: Sequelize.STRING
      },
      is_verified: {
        type: Sequelize.BOOLEAN
      },
      verification_token: {
        type: Sequelize.STRING
      },
      verification_expiry: {
        type: Sequelize.DATE
      },
      role: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Users');
  }
};