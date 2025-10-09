var express = require('express');
var router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const userController = require('../controllers/userController');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

// Attendance routes
router.get('/events/:eventId/attendance/check', authenticateToken, userController.checkAttendanceAvailability);
router.post('/events/:eventId/attendance/verify-token', authenticateToken, userController.verifyAttendanceToken);
router.post('/events/:eventId/attendance/request-otp', authenticateToken, userController.requestAttendanceOtp);
router.post('/events/:eventId/attendance/verify-otp', authenticateToken, userController.verifyAttendanceOtp);

// User attendance and certificate routes - inline implementation to avoid import issues
router.get('/events/:eventId/my-attendance', authenticateToken, async (req, res) => {
  try {
    const { User, Event, EventRegistration, DailyAttendance } = require('../models');
    const { eventId } = req.params;
    const userId = req.user.id;

    // Check if user is registered for this event
    const registration = await EventRegistration.findOne({
      where: { 
        user_id: userId, 
        event_id: eventId 
      },
      include: [
        {
          model: Event,
          attributes: ['id', 'judul', 'tanggal', 'durasi_hari', 'minimum_kehadiran', 'memberikan_sertifikat']
        }
      ]
    });

    if (!registration) {
      return res.status(404).json({
        success: false,
        message: 'Anda tidak terdaftar untuk event ini'
      });
    }

    // Get daily attendance records
    const dailyAttendance = await DailyAttendance.findAll({
      where: {
        user_id: userId,
        event_id: eventId
      },
      order: [['hari_ke', 'ASC']]
    });

    res.json({
      success: true,
      registration,
      attendance: dailyAttendance
    });

  } catch (error) {
    console.error('Get my attendance error:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal mengambil data kehadiran'
    });
  }
});

router.get('/events/:eventId/certificate-eligibility', authenticateToken, async (req, res) => {
  try {
    const { User, Event, EventRegistration, DailyAttendance } = require('../models');
    const { eventId } = req.params;
    const userId = req.user.id;

    // Check if user is registered
    const registration = await EventRegistration.findOne({
      where: { 
        user_id: userId, 
        event_id: eventId 
      },
      include: [
        {
          model: Event,
          attributes: ['durasi_hari', 'minimum_kehadiran', 'memberikan_sertifikat']
        }
      ]
    });

    if (!registration) {
      return res.status(404).json({
        success: false,
        message: 'Anda tidak terdaftar untuk event ini'
      });
    }

    if (!registration.Event.memberikan_sertifikat) {
      return res.json({
        success: true,
        eligible: false,
        message: 'Event ini tidak memberikan sertifikat'
      });
    }

    // Count present days from daily attendance
    const presentDays = await DailyAttendance.count({
      where: {
        user_id: userId,
        event_id: eventId,
        status: ['present', 'late']
      }
    });

    const eligible = presentDays >= registration.Event.minimum_kehadiran;

    res.json({
      success: true,
      eligible,
      present_days: presentDays,
      required_days: registration.Event.minimum_kehadiran,
      certificate_issued: registration.sertifikat_url ? true : false,
      certificate_url: registration.sertifikat_url
    });

  } catch (error) {
    console.error('Get certificate eligibility error:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal mengecek kelayakan sertifikat'
    });
  }
});

router.get('/events/:eventId/certificate/download', authenticateToken, async (req, res) => {
  try {
    const { EventRegistration } = require('../models');
    const { eventId } = req.params;
    const userId = req.user.id;

    const registration = await EventRegistration.findOne({
      where: { 
        user_id: userId, 
        event_id: eventId 
      }
    });

    if (!registration || !registration.sertifikat_url) {
      return res.status(404).json({
        success: false,
        message: 'Sertifikat tidak tersedia'
      });
    }

    // In a real implementation, you would serve the actual certificate file
    // For now, we'll return the certificate URL
    res.json({
      success: true,
      certificate_url: registration.sertifikat_url,
      message: 'Sertifikat tersedia untuk diunduh'
    });

  } catch (error) {
    console.error('Download certificate error:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal mengunduh sertifikat'
    });
  }
});

// Route to get all events registered by the user
router.get('/events', authenticateToken, async (req, res) => {
  try {
    const { Event, EventRegistration } = require('../models');
    const userId = req.user.id;

    const registrations = await EventRegistration.findAll({
      where: { user_id: userId },
      include: [{
        model: Event,
        attributes: ['id', 'judul', 'tanggal', 'waktu', 'lokasi', 'flyer_url']
      }],
      order: [[Event, 'tanggal', 'DESC']]
    });

    const events = registrations.map(reg => reg.Event);

    res.json({ success: true, events });
  } catch (error) {
    console.error('Error fetching user events:', error);
    res.status(500).json({ success: false, message: 'Gagal mengambil event saya' });
  }
});

module.exports = router;
