const { User, Event, EventRegistration } = require('../models');
const { Op } = require('sequelize');

// Get user's certificate eligibility
// NOTE: Certificate eligibility logic needs to be updated based on new attendance system
const getCertificateEligibility = async (req, res) => {
  try {
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
          attributes: ['judul', 'memberikan_sertifikat']
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

    // TODO: Add new attendance-based eligibility logic here
    // For now, check if certificate is already issued
    const eligible = registration.sertifikat_url ? true : false;

    res.json({
      success: true,
      eligible,
      certificate_issued: registration.sertifikat_url ? true : false,
      certificate_url: registration.sertifikat_url,
      message: eligible ? 'Sertifikat tersedia' : 'Sertifikat belum tersedia'
    });

  } catch (error) {
    console.error('Get certificate eligibility error:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal mengecek kelayakan sertifikat'
    });
  }
};

// Download certificate
const downloadCertificate = async (req, res) => {
  try {
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
};

// Get user's registered events
const getMyEvents = async (req, res) => {
  try {
    const userId = req.user.id;

    const registrations = await EventRegistration.findAll({
      where: {
        user_id: userId
      },
      include: [
        {
          model: Event,
          attributes: ['id', 'judul', 'tanggal', 'waktu', 'lokasi', 'biaya', 'status'],
          required: false // LEFT JOIN instead of INNER JOIN
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.json({
      success: true,
      data: registrations
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Gagal memuat event Anda'
    });
  }
};

module.exports = {
  getCertificateEligibility,
  downloadCertificate,
  getMyEvents
};