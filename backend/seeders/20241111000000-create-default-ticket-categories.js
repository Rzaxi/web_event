'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Get all existing events
    const events = await queryInterface.sequelize.query(
      'SELECT id, biaya FROM Events WHERE status_event = "published"',
      { type: Sequelize.QueryTypes.SELECT }
    );

    const ticketCategories = [];
    const now = new Date();

    for (const event of events) {
      // Early Bird category (inactive/sold out)
      ticketCategories.push({
        event_id: event.id,
        name: 'Early Bird',
        description: 'Penawaran pertama dan paling ramah kantong yang ditawarkan oleh Svara team jauh sebelum harga normal diberlakukan.',
        price: event.biaya ? Math.floor(event.biaya * 0.8) : 0,
        original_price: event.biaya || 0,
        quota: null,
        sold_count: 0,
        is_active: false, // Early bird habis
        sale_start_date: null,
        sale_end_date: null,
        badge_text: 'HEMAT 20%',
        badge_color: 'green',
        sort_order: 1,
        createdAt: now,
        updatedAt: now
      });

      // Regular category (active)
      ticketCategories.push({
        event_id: event.id,
        name: 'Regular',
        description: 'Tiket reguler dengan harga standar untuk mengikuti event ini.',
        price: event.biaya || 0,
        original_price: null,
        quota: null,
        sold_count: 0,
        is_active: true,
        sale_start_date: null,
        sale_end_date: null,
        badge_text: null,
        badge_color: null,
        sort_order: 2,
        createdAt: now,
        updatedAt: now
      });
    }

    if (ticketCategories.length > 0) {
      await queryInterface.bulkInsert('ticket_categories', ticketCategories);
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('ticket_categories', null, {});
  }
};
