const { Event, EventRegistration, User, Attendance } = require('../models');
const { Op } = require('sequelize');
const path = require('path');
const fs = require('fs');

// Get All Events for Admin
const getAllEvents = async (req, res) => {
  try {
    const { search, status, page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    let whereClause = {};

    if (search) {
      whereClause = {
        [Op.or]: [
          { judul: { [Op.iLike]: `%${search}%` } },
          { deskripsi: { [Op.iLike]: `%${search}%` } }
        ]
      };
    }

    if (status && status !== 'all') {
      const now = new Date();
      if (status === 'active') {
        whereClause.tanggal = { [Op.gte]: now };
      } else if (status === 'completed') {
        whereClause.tanggal = { [Op.lt]: now };
      }
    }

    const events = await Event.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: EventRegistration,
          attributes: ['id', 'status'],
          where: { status: 'confirmed' },
          required: false
        }
      ],
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    const formattedEvents = events.rows.map(event => ({
      id: event.id,
      title: event.judul,
      description: event.deskripsi,
      date: event.tanggal,
      time: event.waktu_mulai,
      endTime: event.waktu_selesai,
      location: event.lokasi,
      maxParticipants: event.kapasitas_peserta,
      registeredCount: event.EventRegistrations ? event.EventRegistrations.length : 0,
      flyer: event.flyer_url,
      flyer_url: event.flyer_url ? (
        event.flyer_url.startsWith('http')
          ? event.flyer_url
          : `http://localhost:3000${event.flyer_url}`
      ) : null,
      kategori: event.kategori,
      createdAt: event.createdAt,
      updatedAt: event.updatedAt
    }));

    res.json({
      success: true,
      events: formattedEvents,
      pagination: {
        total: events.count,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(events.count / limit)
      }
    });

  } catch (error) {
    console.error('Get all events error:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal mengambil data events'
    });
  }
};

// Create New Event
const createEvent = async (req, res) => {
  try {
    const {
      title,
      description,
      date,
      time,
      location,
      maxParticipants,
      kategori,
      durasi_hari,
      minimum_kehadiran,
      memberikan_sertifikat,
      tanggal_selesai
    } = req.body;

    // Validate H-3 rule
    const eventDate = new Date(date);
    const today = new Date();
    const diffTime = eventDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 3) {
      return res.status(400).json({
        success: false,
        message: 'Event hanya dapat dibuat minimal H-3 dari tanggal pelaksanaan'
      });
    }

    // Handle file upload
    let flyerPath = null;
    if (req.file) {
      flyerPath = `/uploads/flyers/${req.file.filename}`;
    }

    const event = await Event.create({
      judul: title,
      tanggal: date,
      waktu_mulai: time,
      lokasi: location,
      flyer_url: flyerPath,
      sertifikat_template: req.body.sertifikat_template,
      deskripsi: description,
      kategori: kategori || 'lainnya',
      kapasitas_peserta: parseInt(maxParticipants),
      biaya: 0,
      status_event: 'published',
      created_by: req.user.id,
      durasi_hari: parseInt(durasi_hari) || 1,
      minimum_kehadiran: parseInt(minimum_kehadiran) || 1,
      memberikan_sertifikat: memberikan_sertifikat === 'true' || memberikan_sertifikat === true,
      tanggal_selesai: tanggal_selesai || null
    });

    res.status(201).json({
      success: true,
      message: 'Event berhasil dibuat',
      event
    });

  } catch (error) {
    console.error('Create event error:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal membuat event'
    });
  }
};

// Update Event
const updateEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, date, time, location, maxParticipants } = req.body;

    const event = await Event.findByPk(id);
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event tidak ditemukan'
      });
    }

    // Check if event has already started
    const eventDateTime = new Date(`${event.tanggal} ${event.waktu_mulai || '00:00'}`);
    const now = new Date();

    if (now >= eventDateTime) {
      return res.status(400).json({
        success: false,
        message: 'Event yang sudah dimulai tidak dapat diubah'
      });
    }

    // Validate H-3 rule for new date
    if (date) {
      const newEventDate = new Date(date);
      const today = new Date();
      const diffTime = newEventDate - today;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays < 3) {
        return res.status(400).json({
          success: false,
          message: 'Tanggal event harus minimal H-3 dari hari ini'
        });
      }
    }

    // Handle file upload
    let flyerPath = event.flyer_url;
    if (req.file) {
      // Delete old flyer if exists
      if (event.flyer_url) {
        const oldFlyerPath = path.join(__dirname, '..', 'public', event.flyer_url);
        if (fs.existsSync(oldFlyerPath)) {
          fs.unlinkSync(oldFlyerPath);
        }
      }
      flyerPath = `/uploads/flyers/${req.file.filename}`;
    }

    await event.update({
      judul: title || event.judul,
      deskripsi: description || event.deskripsi,
      tanggal: date || event.tanggal,
      waktu_mulai: time || event.waktu_mulai,
      lokasi: location || event.lokasi,
      kapasitas_peserta: maxParticipants ? parseInt(maxParticipants) : event.kapasitas_peserta,
      flyer_url: flyerPath
    });

    res.json({
      success: true,
      message: 'Event berhasil diupdate',
      event
    });

  } catch (error) {
    console.error('Update event error:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal mengupdate event'
    });
  }
};

// Delete Event
const deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;

    const event = await Event.findByPk(id);
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event tidak ditemukan'
      });
    }

    // Check if event has already started
    const eventDateTime = new Date(`${event.tanggal} ${event.waktu_mulai || '00:00'}`);
    const now = new Date();

    if (now >= eventDateTime) {
      return res.status(400).json({
        success: false,
        message: 'Event yang sudah dimulai tidak dapat dihapus'
      });
    }

    // Delete flyer file if exists
    if (event.flyer_url) {
      const flyerPath = path.join(__dirname, '..', 'public', event.flyer_url);
      if (fs.existsSync(flyerPath)) {
        fs.unlinkSync(flyerPath);
      }
    }

    // Delete all registrations first
    await EventRegistration.destroy({
      where: { event_id: id }
    });

    // Delete the event
    await event.destroy();

    res.json({
      success: true,
      message: 'Event berhasil dihapus'
    });

  } catch (error) {
    console.error('Delete event error:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal menghapus event'
    });
  }
};

// Get Event Participants
const getEventParticipants = async (req, res) => {
  try {
    const { id } = req.params;

    const event = await Event.findByPk(id);
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event tidak ditemukan'
      });
    }

    const participants = await EventRegistration.findAll({
      where: {
        event_id: id,
        status: 'confirmed'
      },
      include: [
        {
          model: User,
          attributes: ['id', 'nama_lengkap', 'email', 'no_handphone', 'alamat', 'pendidikan_terakhir']
        }
      ],
      order: [['createdAt', 'ASC']]
    });

    const formattedParticipants = participants.map(registration => ({
      id: registration.id,
      registrationDate: registration.createdAt,
      attendanceStatus: registration.attendanceStatus || 'belum_hadir',
      user: {
        id: registration.User.id,
        name: registration.User.nama_lengkap,
        email: registration.User.email,
        phone: registration.User.no_handphone,
        school: registration.User.alamat,
        class: registration.User.pendidikan_terakhir
      }
    }));

    res.json({
      success: true,
      event: {
        id: event.id,
        title: event.judul,
        date: event.tanggal,
        time: event.waktu_mulai,
        endTime: event.waktu_selesai,
        location: event.lokasi
      },
      participants: formattedParticipants,
      totalParticipants: formattedParticipants.length
    });

  } catch (error) {
    console.error('Get event participants error:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal mengambil data peserta'
    });
  }
};

// Get All Participants for Export
const getAllParticipants = async (req, res) => {
  try {
    const registrations = await EventRegistration.findAll({
      where: { status: 'confirmed' },
      include: [
        {
          model: User,
          attributes: ['nama_lengkap', 'email', 'no_handphone', 'alamat', 'pendidikan_terakhir'],
          required: false
        },
        {
          model: Event,
          attributes: ['judul', 'tanggal', 'waktu_mulai', 'waktu_selesai', 'lokasi'],
          required: false
        },
        {
          model: Attendance,
          attributes: ['status'],
          required: false, // LEFT JOIN
        }
      ],
      order: [['createdAt', 'DESC']],
    });

    const formattedParticipants = registrations.map(registration => ({
      'Nama Peserta': registration.User ? registration.User.nama_lengkap : 'N/A',
      'Email': registration.User ? registration.User.email : 'N/A',
      'No. Telepon': registration.User ? registration.User.no_handphone : 'N/A',
      'Alamat': registration.User ? registration.User.alamat : 'N/A',
      'Pendidikan': registration.User ? registration.User.pendidikan_terakhir : 'N/A',
      'Nama Event': registration.Event ? registration.Event.judul : 'N/A',
      'Tanggal Event': registration.Event ? registration.Event.tanggal : 'N/A',
      'Waktu Mulai': registration.Event ? registration.Event.waktu_mulai : 'N/A',
      'Waktu Selesai': registration.Event ? registration.Event.waktu_selesai : 'N/A',
      'Lokasi Event': registration.Event ? registration.Event.lokasi : 'N/A',
      'Tanggal Daftar': registration.createdAt,
      'Status Registrasi': registration.status || 'confirmed',
    }));

    res.json({
      success: true,
      participants: formattedParticipants,
    });

  } catch (error) {
    console.error('Get all participants error:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal mengambil data semua peserta',
      error: error.message,
    });
  }
};

// Get Event by ID
const getEventById = async (req, res) => {
  try {
    const { id } = req.params;

    const event = await Event.findByPk(id, {
      include: [
        {
          model: EventRegistration,
          attributes: ['id', 'status'],
          where: { status: 'confirmed' },
          required: false
        }
      ]
    });

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event tidak ditemukan'
      });
    }

    const formattedEvent = {
      id: event.id,
      title: event.judul,
      description: event.deskripsi,
      date: event.tanggal,
      time: event.waktu_mulai,
      endTime: event.waktu_selesai,
      location: event.lokasi,
      maxParticipants: event.kapasitas_peserta,
      registeredCount: event.EventRegistrations ? event.EventRegistrations.length : 0,
      flyer: event.flyer_url,
      flyer_url: event.flyer_url ? (
        event.flyer_url.startsWith('http')
          ? event.flyer_url
          : `http://localhost:3000${event.flyer_url}`
      ) : null,
      kategori: event.kategori,
      createdAt: event.createdAt,
      updatedAt: event.updatedAt
    };

    res.json({
      success: true,
      event: formattedEvent
    });

  } catch (error) {
    console.error('Get event by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal mengambil data event'
    });
  }
};

// Get Event Options (kategori)
const getEventOptions = async (req, res) => {
  try {
    const { Event } = require('../models');

    // Get unique categories from database
    const categories = await Event.findAll({
      attributes: ['kategori'],
      group: ['kategori'],
      raw: true
    });


    // Default options if database is empty
    const defaultCategories = [
      { value: 'webinar', label: 'Webinar' },
      { value: 'bootcamp', label: 'Bootcamp' },
      { value: 'pelatihan', label: 'Pelatihan' },
      { value: 'konser', label: 'Konser' },
      { value: 'kompetisi', label: 'Kompetisi' }
    ];

    const defaultDifficulties = [
      { value: 'pemula', label: 'Pemula' },
      { value: 'menengah', label: 'Menengah' },
      { value: 'lanjutan', label: 'Lanjutan' }
    ];

    // Always use default categories to ensure all options are available
    const formattedCategories = defaultCategories;

    // Always use default difficulties to ensure all options are available
    const formattedDifficulties = defaultDifficulties;

    res.json({
      success: true,
      data: {
        categories: formattedCategories,
        difficulties: formattedDifficulties
      }
    });

  } catch (error) {
    console.error('Get event options error:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal mengambil opsi event'
    });
  }
};

module.exports = {
  getAllEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  getEventParticipants,
  getAllParticipants,
  getEventOptions
};
