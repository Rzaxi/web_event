const { EventBookmark, Event, User } = require('../models');
const { Op } = require('sequelize');

// Toggle bookmark (add/remove)
const toggleBookmark = async (req, res) => {
  try {
    const { eventId } = req.params;
    const userId = req.user.id;

    // Check if event exists
    const event = await Event.findByPk(eventId);
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event tidak ditemukan'
      });
    }

    // Check if already bookmarked
    const existingBookmark = await EventBookmark.findOne({
      where: {
        user_id: userId,
        event_id: eventId
      }
    });

    if (existingBookmark) {
      // Remove bookmark
      await existingBookmark.destroy();
      return res.json({
        success: true,
        bookmarked: false,
        message: 'Event dihapus dari bookmark'
      });
    } else {
      // Add bookmark
      await EventBookmark.create({
        user_id: userId,
        event_id: eventId
      });
      return res.json({
        success: true,
        bookmarked: true,
        message: 'Event ditambahkan ke bookmark'
      });
    }
  } catch (error) {
    console.error('Toggle bookmark error:', error);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan server'
    });
  }
};

// Get user's bookmarks
const getUserBookmarks = async (req, res) => {
  try {
    const userId = req.user.id;
    const { page = 1, limit = 10 } = req.query;

    const offset = (page - 1) * limit;

    const { count, rows: bookmarks } = await EventBookmark.findAndCountAll({
      where: { user_id: userId },
      include: [
        {
          model: Event,
          as: 'Event',
          attributes: [
            'id',
            'judul',
            'tanggal',
            'waktu_mulai',
            'lokasi',
            'flyer_url',
            'kategori',
            'kapasitas_peserta',
            'biaya',
            'status_event'
          ]
        }
      ],
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    res.json({
      success: true,
      data: bookmarks,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(count / limit)
      }
    });
  } catch (error) {
    console.error('Get bookmarks error:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal mengambil data bookmark'
    });
  }
};

// Check if event is bookmarked
const checkBookmark = async (req, res) => {
  try {
    const { eventId } = req.params;
    const userId = req.user.id;

    const bookmark = await EventBookmark.findOne({
      where: {
        user_id: userId,
        event_id: eventId
      }
    });

    res.json({
      success: true,
      bookmarked: !!bookmark
    });
  } catch (error) {
    console.error('Check bookmark error:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal mengecek status bookmark'
    });
  }
};

// Remove bookmark
const removeBookmark = async (req, res) => {
  try {
    const { eventId } = req.params;
    const userId = req.user.id;

    const bookmark = await EventBookmark.findOne({
      where: {
        user_id: userId,
        event_id: eventId
      }
    });

    if (!bookmark) {
      return res.status(404).json({
        success: false,
        message: 'Bookmark tidak ditemukan'
      });
    }

    await bookmark.destroy();

    res.json({
      success: true,
      message: 'Bookmark berhasil dihapus'
    });
  } catch (error) {
    console.error('Remove bookmark error:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal menghapus bookmark'
    });
  }
};

module.exports = {
  toggleBookmark,
  getUserBookmarks,
  checkBookmark,
  removeBookmark
};
