const { Event, EventRegistration, User } = require('../models');
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
      time: event.waktu,
      location: event.lokasi,
      maxParticipants: event.kapasitas_peserta,
      registeredCount: event.EventRegistrations ? event.EventRegistrations.length : 0,
      flyer: event.flyer_url,
      flyer_url: event.flyer_url ? `http://localhost:3000${event.flyer_url}` : null,
      kategori: event.kategori,
      tingkat_kesulitan: event.tingkat_kesulitan,
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
    const { title, description, date, time, location, maxParticipants } = req.body;

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
      deskripsi: description,
      tanggal: date,
      waktu: time,
      lokasi: location,
      kapasitas_peserta: parseInt(maxParticipants),
      flyer_url: flyerPath,
      kategori: req.body.kategori || 'lainnya',
      tingkat_kesulitan: req.body.tingkat_kesulitan || 'pemula',
      created_by: 1 // Admin user ID
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
    const eventDateTime = new Date(`${event.tanggal} ${event.waktu}`);
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
      waktu: time || event.waktu,
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
    const eventDateTime = new Date(`${event.tanggal} ${event.waktu}`);
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
        time: event.waktu,
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
    const participants = await EventRegistration.findAll({
      where: { status: 'confirmed' },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'email', 'phone', 'school', 'class']
        },
        {
          model: Event,
          as: 'event',
          attributes: ['id', 'title', 'date', 'time', 'location']
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    const formattedParticipants = participants.map(registration => ({
      'Nama Peserta': registration.user.name,
      'Email': registration.user.email,
      'No. Telepon': registration.user.phone,
      'Sekolah': registration.user.school,
      'Kelas': registration.user.class,
      'Nama Event': registration.event.title,
      'Tanggal Event': registration.event.date,
      'Waktu Event': registration.event.time,
      'Lokasi Event': registration.event.location,
      'Tanggal Daftar': registration.createdAt,
      'Status Kehadiran': registration.attendanceStatus || 'belum_hadir'
    }));

    res.json({
      success: true,
      participants: formattedParticipants
    });

  } catch (error) {
    console.error('Get all participants error:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal mengambil data semua peserta'
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
      time: event.waktu,
      location: event.lokasi,
      maxParticipants: event.kapasitas_peserta,
      registeredCount: event.EventRegistrations ? event.EventRegistrations.length : 0,
      flyer: event.flyer_url,
      flyer_url: event.flyer_url ? `http://localhost:3000${event.flyer_url}` : null,
      kategori: event.kategori,
      tingkat_kesulitan: event.tingkat_kesulitan,
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

module.exports = {
  getAllEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  getEventParticipants,
  getAllParticipants
};
