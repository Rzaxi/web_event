const { Notification, Event, User } = require('../models');
const { Op } = require('sequelize');

// Notification Types Constants
const NOTIFICATION_TYPES = {
  EVENT_REGISTERED: 'event_registered',
  EVENT_CANCELLED: 'event_cancelled',
  EVENT_UPDATED: 'event_updated',
  EVENT_REMINDER: 'event_reminder',
  EVENT_STARTING: 'event_starting',
  WELCOME: 'welcome'
};

// Create notification (internal helper function)
const createNotification = async (userId, type, title, message, relatedEventId = null) => {
  try {
    await Notification.create({
      user_id: userId,
      type,
      title,
      message,
      related_event_id: relatedEventId,
      is_read: false
    });
    return true;
  } catch (error) {
    console.error('Create notification error:', error);
    return false;
  }
};

// Get user notifications
const getNotifications = async (req, res) => {
  try {
    const userId = req.user.id;
    const { page = 1, limit = 20, unread_only = false } = req.query;

    const offset = (page - 1) * limit;

    const whereClause = { user_id: userId };
    if (unread_only === 'true') {
      whereClause.is_read = false;
    }

    const { count, rows: notifications } = await Notification.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: Event,
          as: 'Event',
          attributes: ['id', 'judul', 'tanggal', 'lokasi'],
          required: false
        }
      ],
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    res.json({
      success: true,
      data: notifications,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(count / limit)
      }
    });
  } catch (error) {
    console.error('Get notifications error:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal mengambil notifikasi'
    });
  }
};

// Get unread count
const getUnreadCount = async (req, res) => {
  try {
    const userId = req.user.id;

    const count = await Notification.count({
      where: {
        user_id: userId,
        is_read: false
      }
    });

    res.json({
      success: true,
      count
    });
  } catch (error) {
    console.error('Get unread count error:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal menghitung notifikasi'
    });
  }
};

// Mark notification as read
const markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const notification = await Notification.findOne({
      where: {
        id,
        user_id: userId
      }
    });

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notifikasi tidak ditemukan'
      });
    }

    await notification.update({
      is_read: true,
      read_at: new Date()
    });

    res.json({
      success: true,
      message: 'Notifikasi ditandai sudah dibaca'
    });
  } catch (error) {
    console.error('Mark as read error:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal menandai notifikasi'
    });
  }
};

// Mark all notifications as read
const markAllAsRead = async (req, res) => {
  try {
    const userId = req.user.id;

    await Notification.update(
      {
        is_read: true,
        read_at: new Date()
      },
      {
        where: {
          user_id: userId,
          is_read: false
        }
      }
    );

    res.json({
      success: true,
      message: 'Semua notifikasi ditandai sudah dibaca'
    });
  } catch (error) {
    console.error('Mark all as read error:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal menandai semua notifikasi'
    });
  }
};

// Delete notification
const deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const notification = await Notification.findOne({
      where: {
        id,
        user_id: userId
      }
    });

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notifikasi tidak ditemukan'
      });
    }

    await notification.destroy();

    res.json({
      success: true,
      message: 'Notifikasi berhasil dihapus'
    });
  } catch (error) {
    console.error('Delete notification error:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal menghapus notifikasi'
    });
  }
};

// Clear all notifications
const clearAll = async (req, res) => {
  try {
    const userId = req.user.id;

    await Notification.destroy({
      where: {
        user_id: userId
      }
    });

    res.json({
      success: true,
      message: 'Semua notifikasi berhasil dihapus'
    });
  } catch (error) {
    console.error('Clear all error:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal menghapus semua notifikasi'
    });
  }
};

module.exports = {
  createNotification,
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  clearAll,
  NOTIFICATION_TYPES
};
