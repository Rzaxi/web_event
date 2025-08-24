const { body, validationResult } = require('express-validator');
const { Event, User, EventRegistration } = require('../models');
const fs = require('fs');
const path = require('path');
const { Op } = require('sequelize');
const XLSX = require('xlsx');

// Get all events (public)
const getEvents = async (req, res) => {
  try {
    const { page = 1, limit = 10, search, sortBy = 'tanggal', sortOrder = 'ASC' } = req.query;
    const offset = (page - 1) * limit;

    let whereClause = {};
    if (search) {
      whereClause = {
        [Op.or]: [
          { judul: { [Op.like]: `%${search}%` } },
          { lokasi: { [Op.like]: `%${search}%` } },
          { deskripsi: { [Op.like]: `%${search}%` } }
        ]
      };
    }

    const { count, rows: events } = await Event.findAndCountAll({
      where: whereClause,
      include: [{
        model: User,
        as: 'creator',
        attributes: ['nama_lengkap']
      }],
      order: [[sortBy, sortOrder]],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    res.json({
      events,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(count / limit)
      }
    });
  } catch (error) {
    console.error('Get events error:', error);
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
};

// Get event by ID
const getEventById = async (req, res) => {
  try {
    const { id } = req.params;

    const event = await Event.findByPk(id, {
      include: [{
        model: User,
        as: 'creator',
        attributes: ['nama_lengkap']
      }]
    });

    if (!event) {
      return res.status(404).json({ message: 'Event tidak ditemukan' });
    }

    // Get participant count
    const participantCount = await EventRegistration.count({
      where: { event_id: id }
    });

    res.json({
      ...event.toJSON(),
      participantCount
    });
  } catch (error) {
    console.error('Get event by ID error:', error);
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
};

// Create new event (Admin only)
const createEvent = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // Jika ada error validasi dan file terupload, hapus file tersebut
      if (req.file) {
        fs.unlinkSync(req.file.path);
      }
      return res.status(400).json({ errors: errors.array() });
    }

    const { judul, tanggal, waktu, lokasi, sertifikat_template, deskripsi } = req.body;
    const created_by = req.user.id;

    let flyerUrl = null;
    if (req.file) {
      flyerUrl = `/uploads/flyers/${req.file.filename}`;
    }

    const event = await Event.create({
      judul,
      tanggal,
      waktu,
      lokasi,
      flyer_url: flyerUrl,
      sertifikat_template,
      deskripsi,
      created_by
    });

    const eventWithCreator = await Event.findByPk(event.id, {
      include: [{
        model: User,
        as: 'creator',
        attributes: ['nama_lengkap']
      }]
    });

    res.status(201).json({
      message: 'Event berhasil dibuat',
      event: eventWithCreator
    });
  } catch (error) {
    console.error('Create event error:', error);
    // Jika terjadi error saat membuat event, hapus file yang sudah terupload
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
};

// Update event (Admin only)
const updateEvent = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      if (req.file) {
        fs.unlinkSync(req.file.path);
      }
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { judul, tanggal, waktu, lokasi, sertifikat_template, deskripsi } = req.body;

    const event = await Event.findByPk(id);
    if (!event) {
      if (req.file) {
        fs.unlinkSync(req.file.path);
      }
      return res.status(404).json({ message: 'Event tidak ditemukan' });
    }

    let flyerUrl = event.flyer_url;
    // Jika ada file baru yang diupload
    if (req.file) {
      // Hapus flyer lama jika ada
      if (event.flyer_url) {
        const oldFlyerPath = path.join(__dirname, '..', 'public', event.flyer_url);
        if (fs.existsSync(oldFlyerPath)) {
          fs.unlinkSync(oldFlyerPath);
        }
      }
      flyerUrl = `/uploads/flyers/${req.file.filename}`;
    }

    await event.update({
      judul,
      tanggal,
      waktu,
      lokasi,
      flyer_url: flyerUrl,
      sertifikat_template,
      deskripsi
    });

    const updatedEvent = await Event.findByPk(id, {
      include: [{
        model: User,
        as: 'creator',
        attributes: ['nama_lengkap']
      }]
    });

    res.json({
      message: 'Event berhasil diperbarui',
      event: updatedEvent
    });
  } catch (error) {
    console.error('Update event error:', error);
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
};

// Delete event (Admin only)
const deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;

    const event = await Event.findByPk(id);
    if (!event) {
      return res.status(404).json({ message: 'Event tidak ditemukan' });
    }

    // Check if there are registrations
    const registrationCount = await EventRegistration.count({
      where: { event_id: id }
    });

    if (registrationCount > 0) {
      return res.status(400).json({
        message: 'Tidak dapat menghapus event yang sudah memiliki peserta terdaftar'
      });
    }

    // Hapus flyer terkait jika ada
    if (event.flyer_url) {
      const flyerPath = path.join(__dirname, '..', 'public', event.flyer_url);
      if (fs.existsSync(flyerPath)) {
        fs.unlinkSync(flyerPath);
      }
    }

    await event.destroy();

    res.json({ message: 'Event berhasil dihapus' });
  } catch (error) {
    console.error('Delete event error:', error);
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
};

// Export events to Excel (Admin only)
const exportEvents = async (req, res) => {
  try {
    const events = await Event.findAll({
      include: [{
        model: User,
        as: 'creator',
        attributes: ['nama_lengkap']
      }],
      order: [['tanggal', 'DESC']]
    });

    const data = events.map(event => ({
      'ID': event.id,
      'Judul': event.judul,
      'Tanggal': event.tanggal,
      'Waktu': event.waktu,
      'Lokasi': event.lokasi,
      'Deskripsi': event.deskripsi,
      'Dibuat Oleh': event.creator.nama_lengkap,
      'Dibuat Pada': event.createdAt
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Events');

    const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });

    res.setHeader('Content-Disposition', 'attachment; filename=events.xlsx');
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.send(buffer);
  } catch (error) {
    console.error('Export events error:', error);
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
};

// Export event participants (Admin only)
const exportEventParticipants = async (req, res) => {
  try {
    const { id } = req.params;

    const event = await Event.findByPk(id);
    if (!event) {
      return res.status(404).json({ message: 'Event tidak ditemukan' });
    }

    const participants = await EventRegistration.findAll({
      where: { event_id: id },
      include: [{
        model: User,
        attributes: ['nama_lengkap', 'email', 'no_handphone', 'alamat', 'pendidikan_terakhir']
      }],
      order: [['createdAt', 'ASC']]
    });

    const data = participants.map(participant => ({
      'Nama Lengkap': participant.User.nama_lengkap,
      'Email': participant.User.email,
      'No. Handphone': participant.User.no_handphone,
      'Alamat': participant.User.alamat,
      'Pendidikan Terakhir': participant.User.pendidikan_terakhir,
      'Tanggal Daftar': participant.createdAt
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Participants');

    const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });

    res.setHeader('Content-Disposition', `attachment; filename=participants_${event.judul.replace(/[^a-zA-Z0-9]/g, '_')}.xlsx`);
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.send(buffer);
  } catch (error) {
    console.error('Export participants error:', error);
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
};

// Issue certificates for an event (Admin only)
const issueCertificates = async (req, res) => {
  try {
    const { id } = req.params; // event id

    // 1. Find the event
    const event = await Event.findByPk(id);
    if (!event) {
      return res.status(404).json({ message: 'Event tidak ditemukan' });
    }

    // 2. Check if certificate template exists
    if (!event.sertifikat_template) {
      return res.status(400).json({ message: 'Template sertifikat untuk event ini tidak tersedia.' });
    }

    // 3. Find all registrations for the event
    const registrations = await EventRegistration.findAll({ where: { event_id: id } });

    if (registrations.length === 0) {
      return res.status(404).json({ message: 'Tidak ada peserta terdaftar untuk event ini.' });
    }

    // 4. Update certificate URL for each registration
    const certificateUpdates = registrations.map(reg => {
      // Placeholder URL generation logic
      // In a real application, this would involve a more complex service call
      const certificateUrl = `https://example.com/certificates/${event.id}/${reg.user_id}`;
      return reg.update({ sertifikat_url: certificateUrl });
    });

    await Promise.all(certificateUpdates);

    res.json({ message: `Sertifikat berhasil diterbitkan untuk ${registrations.length} peserta.` });

  } catch (error) {
    console.error('Issue certificates error:', error);
    res.status(500).json({ message: 'Terjadi kesalahan server saat menerbitkan sertifikat' });
  }
};

// Validation rules
const eventValidation = [
  body('judul').notEmpty().withMessage('Judul event diperlukan'),
  body('tanggal').isISO8601().withMessage('Format tanggal tidak valid'),
  body('waktu').matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('Format waktu tidak valid (HH:MM)'),
  body('lokasi').notEmpty().withMessage('Lokasi event diperlukan')
];

module.exports = {
  getEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  exportEvents,
  exportEventParticipants,
  issueCertificates,
  eventValidation
};