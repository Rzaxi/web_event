const { EventRegistration, Event, User } = require('../models');
const { generateSecureAttendanceToken } = require('../utils/attendanceTokenGenerator');
const { sendAttendanceTokenEmail } = require('../utils/emailService');

// Register for event
const registerForEvent = async (req, res) => {
  try {
    const { id } = req.params; // event id
    const userId = req.user.id;

    // Check if event exists
    const event = await Event.findByPk(id);
    if (!event) {
      return res.status(404).json({ message: 'Event tidak ditemukan' });
    }

    // Check if user already registered
    const existingRegistration = await EventRegistration.findOne({
      where: { user_id: userId, event_id: id }
    });

    if (existingRegistration) {
      return res.status(400).json({ message: 'Anda sudah terdaftar untuk event ini' });
    }

    // Generate attendance token only for events that provide certificates
    let attendanceToken = null;
    if (event.memberikan_sertifikat) {
      attendanceToken = generateSecureAttendanceToken();
    }

    // Create registration
    const registration = await EventRegistration.create({
      user_id: userId,
      event_id: id,
      attendance_token: attendanceToken
    });

    // Send attendance token via email if event provides certificate
    if (event.memberikan_sertifikat && attendanceToken) {
      try {
        const user = await User.findByPk(userId);
        await sendAttendanceTokenEmail(user.email, user.nama_lengkap, event.judul, attendanceToken);
      } catch (emailError) {
        console.error('Failed to send attendance token email:', emailError);
        // Don't fail the registration if email fails
      }
    }

    res.status(201).json({
      message: 'Berhasil mendaftar event!',
      registration: {
        id: registration.id,
        event_id: id,
        registered_at: registration.createdAt,
        has_attendance_token: !!attendanceToken
      }
    });
  } catch (error) {
    console.error('Event registration error:', error);
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
};

// Cancel registration
const cancelRegistration = async (req, res) => {
  try {
    const { id } = req.params; // event id
    const userId = req.user.id;

    const registration = await EventRegistration.findOne({
      where: { user_id: userId, event_id: id }
    });

    if (!registration) {
      return res.status(404).json({ message: 'Registrasi tidak ditemukan' });
    }

    await registration.destroy();

    res.json({ message: 'Registrasi berhasil dibatalkan' });
  } catch (error) {
    console.error('Cancel registration error:', error);
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
};

// Get event registrations (admin only)
const getEventRegistrations = async (req, res) => {
  try {
    const { id } = req.params; // event id

    const registrations = await EventRegistration.findAll({
      where: { event_id: id },
      include: [
        { model: User, attributes: ['id', 'nama_lengkap', 'email'] },
        { model: Event, attributes: ['judul'] }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.json(registrations);
  } catch (error) {
    console.error('Get event registrations error:', error);
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
};

module.exports = {
  registerForEvent,
  cancelRegistration,
  getEventRegistrations
};