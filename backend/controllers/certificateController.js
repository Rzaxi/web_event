const { Event, EventRegistration, DailyAttendance, User } = require('../models');
const { Op } = require('sequelize');

// Check if user is eligible for certificate
const checkCertificateEligibility = async (req, res) => {
  try {
    const { eventId, userId } = req.params;

    // Get event details
    const event = await Event.findByPk(eventId);
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event tidak ditemukan'
      });
    }

    // Check if event provides certificate
    if (!event.memberikan_sertifikat) {
      return res.status(400).json({
        success: false,
        message: 'Event ini tidak memberikan sertifikat'
      });
    }

    // Get user registration
    const registration = await EventRegistration.findOne({
      where: {
        user_id: userId,
        event_id: eventId,
        status: 'confirmed'
      }
    });

    if (!registration) {
      return res.status(404).json({
        success: false,
        message: 'Pendaftaran tidak ditemukan atau belum dikonfirmasi'
      });
    }

    // Count present days
    const presentDays = await DailyAttendance.count({
      where: {
        user_id: userId,
        event_id: eventId,
        status: ['present', 'late'] // late still counts as present
      }
    });

    const isEligible = presentDays >= event.minimum_kehadiran;

    // Get attendance details
    const attendanceDetails = await DailyAttendance.findAll({
      where: {
        user_id: userId,
        event_id: eventId
      },
      order: [['hari_ke', 'ASC']]
    });

    res.json({
      success: true,
      data: {
        isEligible,
        presentDays,
        requiredDays: event.minimum_kehadiran,
        totalEventDays: event.durasi_hari,
        attendanceDetails,
        certificateUrl: isEligible ? registration.sertifikat_url : null
      }
    });

  } catch (error) {
    console.error('Check certificate eligibility error:', error);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan server'
    });
  }
};

// Mark daily attendance
const markDailyAttendance = async (req, res) => {
  try {
    const { eventId } = req.params;
    const { userId, tanggalKehadiran, hariKe, status, notes } = req.body;

    // Validate input
    if (!userId || !tanggalKehadiran || !hariKe) {
      return res.status(400).json({
        success: false,
        message: 'User ID, tanggal kehadiran, dan hari ke harus diisi'
      });
    }

    // Check if event exists
    const event = await Event.findByPk(eventId);
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event tidak ditemukan'
      });
    }

    // Check if user is registered
    const registration = await EventRegistration.findOne({
      where: {
        user_id: userId,
        event_id: eventId,
        status: 'confirmed'
      }
    });

    if (!registration) {
      return res.status(404).json({
        success: false,
        message: 'User belum terdaftar atau pendaftaran belum dikonfirmasi'
      });
    }

    // Check if attendance already exists for this date
    const existingAttendance = await DailyAttendance.findOne({
      where: {
        user_id: userId,
        event_id: eventId,
        tanggal_kehadiran: tanggalKehadiran
      }
    });

    let attendance;
    const attendanceData = {
      user_id: userId,
      event_id: eventId,
      registration_id: registration.id,
      tanggal_kehadiran: tanggalKehadiran,
      hari_ke: hariKe,
      status: status || 'present',
      check_in_time: status === 'present' || status === 'late' ? new Date() : null,
      notes: notes || null
    };

    if (existingAttendance) {
      // Update existing attendance
      attendance = await existingAttendance.update(attendanceData);
    } else {
      // Create new attendance record
      attendance = await DailyAttendance.create(attendanceData);
    }

    res.json({
      success: true,
      message: 'Kehadiran berhasil dicatat',
      data: attendance
    });

  } catch (error) {
    console.error('Mark daily attendance error:', error);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan server'
    });
  }
};

// Get event attendance summary
const getEventAttendanceSummary = async (req, res) => {
  try {
    const { eventId } = req.params;

    const event = await Event.findByPk(eventId);
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event tidak ditemukan'
      });
    }

    // Get all registrations for this event
    const registrations = await EventRegistration.findAll({
      where: {
        event_id: eventId,
        status: 'confirmed'
      },
      include: [
        {
          model: User,
          attributes: ['id', 'nama_lengkap', 'email']
        }
      ]
    });

    // Get attendance data for each user
    const summaryData = await Promise.all(
      registrations.map(async (registration) => {
        const attendances = await DailyAttendance.findAll({
          where: {
            user_id: registration.user_id,
            event_id: eventId
          },
          order: [['hari_ke', 'ASC']]
        });

        const presentDays = attendances.filter(att => 
          att.status === 'present' || att.status === 'late'
        ).length;

        const isEligibleForCertificate = presentDays >= event.minimum_kehadiran;

        return {
          user: registration.User,
          registration_id: registration.id,
          attendances,
          presentDays,
          isEligibleForCertificate,
          certificateUrl: registration.sertifikat_url
        };
      })
    );

    res.json({
      success: true,
      data: {
        event: {
          id: event.id,
          judul: event.judul,
          durasi_hari: event.durasi_hari,
          minimum_kehadiran: event.minimum_kehadiran,
          memberikan_sertifikat: event.memberikan_sertifikat
        },
        participants: summaryData
      }
    });

  } catch (error) {
    console.error('Get event attendance summary error:', error);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan server'
    });
  }
};

// Issue certificates for eligible participants
const issueCertificatesForEvent = async (req, res) => {
  try {
    const { eventId } = req.params;

    const event = await Event.findByPk(eventId);
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event tidak ditemukan'
      });
    }

    if (!event.memberikan_sertifikat) {
      return res.status(400).json({
        success: false,
        message: 'Event ini tidak memberikan sertifikat'
      });
    }

    if (!event.sertifikat_template) {
      return res.status(400).json({
        success: false,
        message: 'Template sertifikat belum diupload'
      });
    }

    // Get all confirmed registrations
    const registrations = await EventRegistration.findAll({
      where: {
        event_id: eventId,
        status: 'confirmed'
      },
      include: [
        {
          model: User,
          attributes: ['id', 'nama_lengkap', 'email']
        }
      ]
    });

    const certificateUpdates = [];
    let eligibleCount = 0;

    for (const registration of registrations) {
      // Count present days for this user
      const presentDays = await DailyAttendance.count({
        where: {
          user_id: registration.user_id,
          event_id: eventId,
          status: ['present', 'late']
        }
      });

      // Check if eligible for certificate
      if (presentDays >= event.minimum_kehadiran) {
        eligibleCount++;
        
        // Generate certificate URL (placeholder - implement actual certificate generation)
        const certificateUrl = `https://certificates.example.com/${eventId}/${registration.user_id}/${Date.now()}.pdf`;
        
        certificateUpdates.push(
          registration.update({ sertifikat_url: certificateUrl })
        );
      }
    }

    await Promise.all(certificateUpdates);

    res.json({
      success: true,
      message: `Sertifikat berhasil diterbitkan untuk ${eligibleCount} peserta yang memenuhi syarat`,
      data: {
        totalParticipants: registrations.length,
        eligibleParticipants: eligibleCount,
        requiredDays: event.minimum_kehadiran
      }
    });

  } catch (error) {
    console.error('Issue certificates error:', error);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan server'
    });
  }
};

module.exports = {
  checkCertificateEligibility,
  markDailyAttendance,
  getEventAttendanceSummary,
  issueCertificatesForEvent
};
