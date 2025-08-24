'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.removeColumn('EventRegistrations', 'token_absen');
        await queryInterface.removeColumn('EventRegistrations', 'token_sent_at');
        await queryInterface.removeColumn('EventRegistrations', 'hadir');
        await queryInterface.removeColumn('EventRegistrations', 'absen_at');
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.addColumn('EventRegistrations', 'token_absen', {
            type: Sequelize.STRING(10),
            allowNull: false,
            unique: true
        });
        await queryInterface.addColumn('EventRegistrations', 'token_sent_at', {
            type: Sequelize.DATE,
            allowNull: true
        });
        await queryInterface.addColumn('EventRegistrations', 'hadir', {
            type: Sequelize.BOOLEAN,
            defaultValue: false
        });
        await queryInterface.addColumn('EventRegistrations', 'absen_at', {
            type: Sequelize.DATE,
            allowNull: true
        });
    }
};
