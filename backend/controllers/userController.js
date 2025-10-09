const { User, Event, EventRegistration, DailyAttendance } = require('../models');
const { Op } = require('sequelize');
const { sendAttendanceToken } = require('../utils/emailService');

// Get user's attendance for a specific event
const getMyAttendance = async (req, res) => {
  try {
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
};

// Get user's certificate eligibility
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

// Request attendance OTP
const requestAttendanceOtp = async (req, res) => {
  try {
    const { eventId } = req.params;
    const userId = req.user.id;

    // Check if user is registered for the event
    const registration = await EventRegistration.findOne({
      where: { user_id: userId, event_id: eventId, status: 'confirmed' },
      include: [{ model: Event }]
    });

    if (!registration) {
      return res.status(404).json({ success: false, message: 'Anda belum terdaftar untuk event ini' });
    }

    const event = registration.Event;

    // Check if event provides certificate
    if (!event.memberikan_sertifikat) {
      return res.status(400).json({
        success: false,
        message: 'Event ini tidak menyediakan sertifikat'
      });
    }

    // Check if it's the event day and after event time
    const now = new Date();
    const eventDateTime = new Date(`${event.tanggal}T${event.waktu}`);

    if (now < eventDateTime) {
      return res.status(400).json({
        success: false,
        message: 'Belum waktunya untuk mengisi kehadiran. Silakan tunggu hingga event dimulai.'
      });
    }

    // Calculate day number for multi-day events
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const eventStart = new Date(event.tanggal);
    eventStart.setHours(0, 0, 0, 0);
    const dayDiff = Math.floor((today.getTime() - eventStart.getTime()) / (24 * 60 * 60 * 1000));
    const dayNumber = dayDiff + 1;

    if (dayNumber < 1 || dayNumber > (event.durasi_hari || 1)) {
      return res.status(400).json({ success: false, message: 'Di luar rentang hari event' });
    }

    // Check if already marked attendance for today
    const existingAttendance = await DailyAttendance.findOne({
      where: {
        user_id: userId,
        event_id: eventId,
        hari_ke: dayNumber
      }
    });

    if (existingAttendance) {
      return res.status(400).json({
        success: false,
        message: 'Anda sudah mengisi kehadiran untuk hari ini'
      });
    }

    // Generate 6-digit OTP
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

    // Store OTP in session with expiration
    if (!req.session.attendanceOtps) {
      req.session.attendanceOtps = {};
    }

    const key = `${eventId}:${userId}`;
    req.session.attendanceOtps[key] = {
      code: otpCode,
      expiresAt: Date.now() + 10 * 60 * 1000, // 10 minutes
      dayNumber: dayNumber
    };

    // In a real implementation, send OTP via email
    // For now, we'll just return success
    res.json({
      success: true,
      message: 'OTP telah dikirim ke email Anda',
      // For development only - remove in production
      debug_otp: otpCode
    });

  } catch (error) {
    console.error('Request attendance OTP error:', error);
    res.status(500).json({ success: false, message: 'Terjadi kesalahan server' });
  }
};

module.exports = {
  getMyAttendance,
  getCertificateEligibility,
  downloadCertificate,
  requestAttendanceOtp,
  
  // Check attendance availability
  async checkAttendanceAvailability(req, res) {
    try {
      const { eventId } = req.params;
      const userId = req.user.id;

      console.log('Checking attendance for user:', userId, 'event:', eventId);

      // Check if user is registered for the event
      const registration = await EventRegistration.findOne({
        where: {
          user_id: userId,
          event_id: eventId,
          status: 'confirmed'
        }
      });

      console.log('Registration found:', registration ? 'Yes' : 'No');

      if (!registration) {
        return res.status(200).json({
          message: 'Anda belum terdaftar untuk event ini',
          available: false
        });
      }

      // Get event separately to avoid association issues
      const event = await Event.findByPk(eventId);
      console.log('Event found:', event ? event.judul : 'No event');

      if (!event) {
        console.log('Event not found');
        return res.status(200).json({
          message: 'Event tidak ditemukan',
          available: false
        });
      }

      // Check if event provides certificate
      if (!event.memberikan_sertifikat) {
        console.log('Event does not provide certificate');
        return res.status(200).json({
          message: 'Event ini tidak menyediakan sertifikat',
          available: false
        });
      }

      // Check if user has attendance token
      if (!registration.attendance_token) {
        console.log('No attendance token found for user');
        return res.status(200).json({
          message: 'Token kehadiran tidak ditemukan',
          available: false
        });
      }

      // Check if it's the event time (time-based attendance)
      const now = new Date();
      
      // Validate date and time format
      if (!event.tanggal || !event.waktu_mulai) {
        console.log('Missing event date or start time');
        return res.status(200).json({
          message: 'Data tanggal atau waktu event tidak lengkap',
          available: false
        });
      }

      // Handle different date formats - convert Date object to string if needed
      let eventDate = event.tanggal;
      if (eventDate instanceof Date) {
        eventDate = eventDate.toISOString().split('T')[0]; // Get YYYY-MM-DD part
      } else if (typeof eventDate === 'string' && eventDate.includes('T')) {
        eventDate = eventDate.split('T')[0]; // Get YYYY-MM-DD part
      }

      const eventStartDate = new Date(eventDate + 'T00:00:00');
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

      console.log('Current time:', now.toISOString());
      console.log('Event start date:', eventStartDate.toISOString());

      // Check if event period has started
      if (today < new Date(eventStartDate.getFullYear(), eventStartDate.getMonth(), eventStartDate.getDate())) {
        console.log('Event period has not started yet');
        return res.status(200).json({
          message: 'Event belum dimulai.',
          available: false
        });
      }

      // Check if event has ended (for multi-day events)
      let eventEndDate = eventStartDate;
      if (event.tanggal_selesai) {
        let endDate = event.tanggal_selesai;
        if (endDate instanceof Date) {
          endDate = endDate.toISOString().split('T')[0];
        } else if (typeof endDate === 'string' && endDate.includes('T')) {
          endDate = endDate.split('T')[0];
        }
        eventEndDate = new Date(endDate + 'T00:00:00');
      }

      const eventEndDay = new Date(eventEndDate.getFullYear(), eventEndDate.getMonth(), eventEndDate.getDate());
      if (today > eventEndDay) {
        console.log('Event has ended');
        return res.status(200).json({
          message: 'Event sudah berakhir.',
          available: false
        });
      }

      // Calculate current day of the event
      const daysDiff = Math.floor((today - new Date(eventStartDate.getFullYear(), eventStartDate.getMonth(), eventStartDate.getDate())) / (1000 * 60 * 60 * 24));
      const currentDay = Math.max(1, daysDiff + 1);

      // Check if user has already marked attendance for current day
      const existingAttendance = await DailyAttendance.findOne({
        where: {
          user_id: userId,
          event_id: eventId,
          hari_ke: currentDay
        }
      });

      if (existingAttendance) {
        console.log('User has already marked attendance for day', currentDay);
        return res.status(200).json({
          message: 'Kehadiran sudah tercatat untuk hari ini',
          available: false,
          alreadyMarked: true,
          currentDay: currentDay
        });
      }

      // Check if it's time for attendance (based on waktu_mulai)
      const eventTime = event.waktu_mulai; // Format: "21:49"
      const [eventHour, eventMinute] = eventTime.split(':').map(Number);
      
      const currentHour = now.getHours();
      const currentMinute = now.getMinutes();
      
      // Create today's event time
      const todayEventTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), eventHour, eventMinute);
      
      console.log('Current time:', now.toISOString());
      console.log('Today event time:', todayEventTime.toISOString());
      
      if (now < todayEventTime) {
        const timeUntil = Math.ceil((todayEventTime - now) / (1000 * 60)); // minutes until event
        console.log('Event time has not arrived yet, minutes until:', timeUntil);
        return res.status(200).json({
          message: `Tombol kehadiran akan aktif pada jam ${eventTime}. Tunggu ${timeUntil} menit lagi.`,
          available: false,
          eventTime: todayEventTime.toISOString(),
          minutesUntil: timeUntil
        });
      }

      console.log('Attendance is available at event time');
      res.json({
        message: 'Kehadiran tersedia',
        available: true,
        hasToken: true,
        currentDay: currentDay,
        eventTime: todayEventTime.toISOString()
      });

    } catch (error) {
      console.error('Check attendance availability error:', error);
      console.error('Error stack:', error.stack);
      res.status(500).json({ 
        message: 'Terjadi kesalahan server',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  },

  // Verify attendance using registration token
  async verifyAttendanceToken(req, res) {
    try {
      const { eventId } = req.params;
      const { token } = req.body;
      const userId = req.user.id;

      if (!token) {
        return res.status(400).json({ success: false, message: 'Token kehadiran diperlukan' });
      }

      // Find registration with matching token
      const registration = await EventRegistration.findOne({
        where: {
          user_id: userId,
          event_id: eventId,
          attendance_token: token,
          status: 'confirmed'
        },
        include: [{ model: Event, as: 'Event' }]
      });

      if (!registration) {
        return res.status(400).json({ success: false, message: 'Token kehadiran tidak valid' });
      }

      const event = registration.Event;

      // Check if event provides certificate
      if (!event.memberikan_sertifikat) {
        return res.status(400).json({ success: false, message: 'Event ini tidak menyediakan sertifikat' });
      }

      // Check if it's the event day and after event time
      const now = new Date();
      const eventDateTime = new Date(`${event.tanggal}T${event.waktu}`);

      if (now < eventDateTime) {
        return res.status(400).json({
          success: false,
          message: 'Belum waktunya untuk mengisi kehadiran. Silakan tunggu hingga event dimulai.'
        });
      }

      // Calculate day number for multi-day events
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const eventStart = new Date(event.tanggal);
      eventStart.setHours(0, 0, 0, 0);
      const dayDiff = Math.floor((today.getTime() - eventStart.getTime()) / (24 * 60 * 60 * 1000));
      const dayNumber = dayDiff + 1;

      if (dayNumber < 1 || dayNumber > (event.durasi_hari || 1)) {
        return res.status(400).json({ success: false, message: 'Di luar rentang hari event' });
      }

      // Check if already marked attendance for today
      const existingAttendance = await DailyAttendance.findOne({
        where: {
          user_id: userId,
          event_id: eventId,
          hari_ke: dayNumber
        }
      });

      if (existingAttendance) {
        return res.status(400).json({
          success: false,
          message: 'Anda sudah mengisi kehadiran untuk hari ini',
          attendance: existingAttendance
        });
      }

      // Create daily attendance record
      const attendance = await DailyAttendance.create({
        user_id: userId,
        event_id: eventId,
        registration_id: registration.id,
        tanggal_kehadiran: today,
        hari_ke: dayNumber,
        status: 'present',
        check_in_time: new Date(),
        catatan: 'Kehadiran melalui token registrasi'
      });

      res.json({
        success: true,
        message: 'Kehadiran berhasil dicatat!',
        attendance: {
          id: attendance.id,
          day: dayNumber,
          status: attendance.status,
          check_in_time: attendance.check_in_time
        }
      });

    } catch (error) {
      console.error('Verify attendance token error:', error);
      res.status(500).json({ success: false, message: 'Terjadi kesalahan server' });
    }
  },

  async verifyAttendanceOtp(req, res) {
    try {
      const { eventId } = req.params;
      const { code } = req.body;
      const userId = req.user.id;

      if (!code) {
        return res.status(400).json({ success: false, message: 'Kode OTP diperlukan' });
      }

      const key = `${eventId}:${userId}`;
      const store = req.session.attendanceOtps && req.session.attendanceOtps[key];
      if (!store) {
        return res.status(400).json({ success: false, message: 'OTP tidak ditemukan, minta OTP baru' });
      }
      if (Date.now() > store.expiresAt) {
        delete req.session.attendanceOtps[key];
        return res.status(400).json({ success: false, message: 'OTP kedaluwarsa' });
      }
      if (store.code !== code) {
        return res.status(400).json({ success: false, message: 'OTP salah' });
      }

      // OTP valid → lakukan check-in
      req.params.eventId = eventId;
      // Reuse logic from checkInAttendance
      const event = await Event.findByPk(eventId);
      const registration = await EventRegistration.findOne({ where: { user_id: userId, event_id: eventId, status: 'confirmed' } });
      if (!event || !registration) {
        return res.status(400).json({ success: false, message: 'Data event/pendaftaran tidak valid' });
      }

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const [record] = await DailyAttendance.findOrCreate({
        where: {
          user_id: userId,
          event_id: eventId,
          tanggal_kehadiran: today
        },
        defaults: {
          registration_id: registration.id,
          hari_ke: store.dayNumber,
          status: 'present',
          check_in_time: new Date()
        }
      });
      await record.update({ status: 'present', check_in_time: record.check_in_time || new Date() });

      // Hapus OTP setelah berhasil
      delete req.session.attendanceOtps[key];

      return res.json({ success: true, message: 'Absensi berhasil diverifikasi', attendance: record });
    } catch (error) {
      console.error('Verify OTP error:', error);
      return res.status(500).json({ success: false, message: 'Gagal verifikasi OTP' });
    }
  },
  async checkInAttendance(req, res) {
    try {
      const { eventId } = req.params;
      const userId = req.user.id;

      const event = await Event.findByPk(eventId);
      if (!event) {
        return res.status(404).json({ success: false, message: 'Event tidak ditemukan' });
      }

      // Pastikan user terdaftar
      const registration = await EventRegistration.findOne({
        where: { user_id: userId, event_id: eventId, status: 'confirmed' }
      });
      if (!registration) {
        return res.status(403).json({ success: false, message: 'Anda belum terdaftar pada event ini' });
      }

      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const eventStart = new Date(event.tanggal);
      eventStart.setHours(0, 0, 0, 0);

      const dayDiff = Math.floor((today.getTime() - eventStart.getTime()) / (24 * 60 * 60 * 1000));
      const dayNumber = dayDiff + 1;

      if (dayNumber < 1 || dayNumber > (event.durasi_hari || 1)) {
        return res.status(400).json({ success: false, message: 'Di luar rentang hari event' });
      }

      // Buat atau update kehadiran hari ini
      const [record] = await DailyAttendance.findOrCreate({
        where: {
          user_id: userId,
          event_id: eventId,
          tanggal_kehadiran: today,
        },
        defaults: {
          registration_id: registration.id,
          hari_ke: dayNumber,
          status: 'present',
          check_in_time: new Date(),
        }
      });

      if (record.check_in_time) {
        // Sudah check-in sebelumnya, update status saja jika perlu
        await record.update({ status: 'present' });
      } else {
        await record.update({ check_in_time: new Date(), status: 'present' });
      }

      return res.json({ success: true, message: 'Check-in berhasil', attendance: record });
    } catch (error) {
      console.error('Check-in error:', error);
      return res.status(500).json({ success: false, message: 'Gagal melakukan check-in' });
    }
  },

  async checkOutAttendance(req, res) {
    try {
      const { eventId } = req.params;
      const userId = req.user.id;

      const event = await Event.findByPk(eventId);
      if (!event) {
        return res.status(404).json({ success: false, message: 'Event tidak ditemukan' });
      }

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const record = await DailyAttendance.findOne({
        where: {
          user_id: userId,
          event_id: eventId,
          tanggal_kehadiran: today
        }
      });

      if (!record) {
        return res.status(400).json({ success: false, message: 'Belum check-in hari ini' });
      }

      await record.update({ check_out_time: new Date() });
      return res.json({ success: true, message: 'Check-out berhasil', attendance: record });
    } catch (error) {
      console.error('Check-out error:', error);
      return res.status(500).json({ success: false, message: 'Gagal melakukan check-out' });
    }
  }
};