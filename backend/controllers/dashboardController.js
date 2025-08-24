const { Event, User, EventRegistration } = require('../models');
const { Op } = require('sequelize');

// Get dashboard statistics
const getDashboardStatistics = async (req, res) => {
  try {
    // Total counts
    const totalEvents = await Event.count();
    const totalUsers = await User.count({ where: { role: 'peserta' } });
    const totalRegistrations = await EventRegistration.count();
    const totalAttendance = await EventRegistration.count({ where: { hadir: true } });

    // Events per month (last 12 months)
    const eventsPerMonth = await Event.findAll({
      attributes: [
        [require('sequelize').fn('DATE_FORMAT', require('sequelize').col('tanggal'), '%Y-%m'), 'month'],
        [require('sequelize').fn('COUNT', require('sequelize').col('id')), 'count']
      ],
      where: {
        tanggal: {
          [Op.gte]: new Date(new Date().setFullYear(new Date().getFullYear() - 1))
        }
      },
      group: [require('sequelize').fn('DATE_FORMAT', require('sequelize').col('tanggal'), '%Y-%m')],
      order: [[require('sequelize').fn('DATE_FORMAT', require('sequelize').col('tanggal'), '%Y-%m'), 'ASC']]
    });

    // Participants per month (last 12 months)
    const participantsPerMonth = await EventRegistration.findAll({
      attributes: [
        [require('sequelize').fn('DATE_FORMAT', require('sequelize').col('createdAt'), '%Y-%m'), 'month'],
        [require('sequelize').fn('COUNT', require('sequelize').col('id')), 'count']
      ],
      where: {
        createdAt: {
          [Op.gte]: new Date(new Date().setFullYear(new Date().getFullYear() - 1))
        }
      },
      group: [require('sequelize').fn('DATE_FORMAT', require('sequelize').col('createdAt'), '%Y-%m')],
      order: [[require('sequelize').fn('DATE_FORMAT', require('sequelize').col('createdAt'), '%Y-%m'), 'ASC']]
    });

    // Top 10 events by participant count
    const topEvents = await Event.findAll({
      attributes: [
        'id',
        'judul',
        'tanggal',
        [require('sequelize').fn('COUNT', require('sequelize').col('EventRegistrations.id')), 'participantCount']
      ],
      include: [{
        model: EventRegistration,
        attributes: []
      }],
      group: ['Event.id'],
      order: [[require('sequelize').fn('COUNT', require('sequelize').col('EventRegistrations.id')), 'DESC']],
      limit: 10
    });

    // Recent events
    const recentEvents = await Event.findAll({
      include: [{
        model: User,
        as: 'creator',
        attributes: ['nama_lengkap']
      }],
      order: [['createdAt', 'DESC']],
      limit: 5
    });

    // Attendance rate by event
    const attendanceRates = await Event.findAll({
      attributes: [
        'id',
        'judul',
        [require('sequelize').fn('COUNT', require('sequelize').col('EventRegistrations.id')), 'totalRegistrations'],
        [require('sequelize').fn('SUM', require('sequelize').literal('CASE WHEN EventRegistrations.hadir = 1 THEN 1 ELSE 0 END')), 'totalAttendance']
      ],
      include: [{
        model: EventRegistration,
        attributes: []
      }],
      group: ['Event.id'],
      having: require('sequelize').literal('COUNT(EventRegistrations.id) > 0'),
      order: [['tanggal', 'DESC']],
      limit: 10
    });

    res.json({
      summary: {
        totalEvents,
        totalUsers,
        totalRegistrations,
        totalAttendance,
        attendanceRate: totalRegistrations > 0 ? ((totalAttendance / totalRegistrations) * 100).toFixed(2) : 0
      },
      charts: {
        eventsPerMonth: eventsPerMonth.map(item => ({
          month: item.dataValues.month,
          count: parseInt(item.dataValues.count)
        })),
        participantsPerMonth: participantsPerMonth.map(item => ({
          month: item.dataValues.month,
          count: parseInt(item.dataValues.count)
        }))
      },
      topEvents: topEvents.map(event => ({
        id: event.id,
        judul: event.judul,
        tanggal: event.tanggal,
        participantCount: parseInt(event.dataValues.participantCount)
      })),
      recentEvents,
      attendanceRates: attendanceRates.map(event => ({
        id: event.id,
        judul: event.judul,
        totalRegistrations: parseInt(event.dataValues.totalRegistrations),
        totalAttendance: parseInt(event.dataValues.totalAttendance || 0),
        attendanceRate: event.dataValues.totalRegistrations > 0 
          ? ((parseInt(event.dataValues.totalAttendance || 0) / parseInt(event.dataValues.totalRegistrations)) * 100).toFixed(2)
          : 0
      }))
    });
  } catch (error) {
    console.error('Dashboard statistics error:', error);
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
};

module.exports = {
  getDashboardStatistics
};
