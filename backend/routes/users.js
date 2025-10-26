var express = require('express');
var router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const userController = require('../controllers/userController');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

// Certificate routes
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

    // Get registrations first
    const registrations = await EventRegistration.findAll({
      where: { user_id: userId },
      order: [['createdAt', 'DESC']]
    });

    // Get events separately to avoid association issues
    const events = [];
    for (const registration of registrations) {
      try {
        const event = await Event.findByPk(registration.event_id, {
          attributes: ['id', 'judul', 'tanggal', 'waktu', 'lokasi', 'flyer_url']
        });
        if (event) {
          events.push(event);
        }
      } catch (eventError) {
        // Skip this event if there's an error
        continue;
      }
    }

    res.json({ success: true, events });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Gagal mengambil event saya' });
  }
});

// Route to get user's registered events with registration details
router.get('/my-events', authenticateToken, async (req, res) => {
  try {
    const { EventRegistration, Event } = require('../models');
    const userId = req.user.id;

    // First, try to get registrations without include
    const registrations = await EventRegistration.findAll({
      where: {
        user_id: userId
      },
      order: [['createdAt', 'DESC']]
    });


    // Then get events separately to avoid association issues
    const eventsData = [];
    for (const registration of registrations) {
      try {
        const event = await Event.findByPk(registration.event_id);
        if (event) {
          eventsData.push({
            ...registration.toJSON(),
            Event: event.toJSON()
          });
        } else {
          eventsData.push({
            ...registration.toJSON(),
            Event: null
          });
        }
      } catch (eventError) {
        eventsData.push({
          ...registration.toJSON(),
          Event: null
        });
      }
    }

    res.json({
      success: true,
      data: eventsData
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Gagal memuat event Anda'
    });
  }
});

// Route to get user's certificates
router.get('/certificates', authenticateToken, async (req, res) => {
  try {
    const { EventRegistration, Event } = require('../models');
    const userId = req.user.id;

    const certificates = await EventRegistration.findAll({
      where: { 
        user_id: userId,
        sertifikat_url: {
          [require('sequelize').Op.not]: null
        }
      },
      include: [{
        model: Event,
        attributes: ['id', 'judul', 'tanggal', 'lokasi']
      }],
      order: [['createdAt', 'DESC']]
    });

    res.json({ 
      success: true, 
      certificates: certificates.map(cert => ({
        id: cert.id,
        event: cert.Event,
        certificate_url: cert.sertifikat_url,
        issued_at: cert.updatedAt
      }))
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Gagal mengambil sertifikat' 
    });
  }
});

module.exports = router;
