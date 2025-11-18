const { TicketCategory, Event } = require('../models');

// Get ticket categories for an event
const getEventTicketCategories = async (req, res) => {
  try {
    const { eventId } = req.params;
    
    const categories = await TicketCategory.findAll({
      where: {
        event_id: eventId,
        is_active: true
      },
      order: [['sort_order', 'ASC'], ['createdAt', 'ASC']]
    });

    // If no categories exist, create default ones
    if (categories.length === 0) {
      const event = await Event.findByPk(eventId);
      if (!event) {
        return res.status(404).json({
          success: false,
          message: 'Event tidak ditemukan'
        });
      }

      // Create default ticket categories
      const defaultCategories = [
        {
          event_id: eventId,
          name: 'Early Bird',
          description: 'Penawaran pertama dan paling ramah kantong yang ditawarkan oleh Svara team jauh sebelum harga normal diberlakukan.',
          price: event.biaya ? Math.floor(event.biaya * 0.8) : 0,
          original_price: event.biaya || 0,
          quota: null,
          is_active: false, // Early bird habis
          badge_text: 'HEMAT 20%',
          badge_color: 'green',
          sort_order: 1
        },
        {
          event_id: eventId,
          name: 'Regular',
          description: 'Tiket reguler dengan harga standar untuk mengikuti event ini.',
          price: event.biaya || 0,
          original_price: null,
          quota: null,
          is_active: true,
          badge_text: null,
          badge_color: null,
          sort_order: 2
        }
      ];

      const createdCategories = await TicketCategory.bulkCreate(defaultCategories);
      
      return res.json({
        success: true,
        data: createdCategories
      });
    }

    res.json({
      success: true,
      data: categories
    });

  } catch (error) {
    console.error('Get ticket categories error:', error);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat mengambil kategori tiket',
      error: error.message
    });
  }
};

// Create ticket category
const createTicketCategory = async (req, res) => {
  try {
    const { eventId } = req.params;
    const {
      name,
      description,
      price,
      original_price,
      quota,
      is_active,
      sale_start_date,
      sale_end_date,
      badge_text,
      badge_color,
      sort_order
    } = req.body;

    // Verify event exists and belongs to user
    const event = await Event.findOne({
      where: {
        id: eventId,
        created_by: req.user.id
      }
    });

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event tidak ditemukan atau Anda tidak memiliki akses'
      });
    }

    const category = await TicketCategory.create({
      event_id: eventId,
      name,
      description,
      price: price || 0,
      original_price,
      quota,
      is_active: is_active !== undefined ? is_active : true,
      sale_start_date,
      sale_end_date,
      badge_text,
      badge_color,
      sort_order: sort_order || 0
    });

    res.status(201).json({
      success: true,
      data: category,
      message: 'Kategori tiket berhasil dibuat'
    });

  } catch (error) {
    console.error('Create ticket category error:', error);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat membuat kategori tiket',
      error: error.message
    });
  }
};

// Update ticket category
const updateTicketCategory = async (req, res) => {
  try {
    const { eventId, categoryId } = req.params;
    const updateData = req.body;

    // Verify event belongs to user
    const event = await Event.findOne({
      where: {
        id: eventId,
        created_by: req.user.id
      }
    });

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event tidak ditemukan atau Anda tidak memiliki akses'
      });
    }

    const category = await TicketCategory.findOne({
      where: {
        id: categoryId,
        event_id: eventId
      }
    });

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Kategori tiket tidak ditemukan'
      });
    }

    await category.update(updateData);

    res.json({
      success: true,
      data: category,
      message: 'Kategori tiket berhasil diperbarui'
    });

  } catch (error) {
    console.error('Update ticket category error:', error);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat memperbarui kategori tiket',
      error: error.message
    });
  }
};

// Delete ticket category
const deleteTicketCategory = async (req, res) => {
  try {
    const { eventId, categoryId } = req.params;

    // Verify event belongs to user
    const event = await Event.findOne({
      where: {
        id: eventId,
        created_by: req.user.id
      }
    });

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event tidak ditemukan atau Anda tidak memiliki akses'
      });
    }

    const category = await TicketCategory.findOne({
      where: {
        id: categoryId,
        event_id: eventId
      }
    });

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Kategori tiket tidak ditemukan'
      });
    }

    await category.destroy();

    res.json({
      success: true,
      message: 'Kategori tiket berhasil dihapus'
    });

  } catch (error) {
    console.error('Delete ticket category error:', error);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat menghapus kategori tiket',
      error: error.message
    });
  }
};

module.exports = {
  getEventTicketCategories,
  createTicketCategory,
  updateTicketCategory,
  deleteTicketCategory
};
