// Certificate Controller
<<<<<<< HEAD
const { Event, EventRegistration, User, Certificate, CertificateIssued, DailyAttendance, sequelize } = require('../models');
const { Op } = require('sequelize');
const path = require('path');
const fs = require('fs').promises;
const { createCanvas, loadImage } = require('canvas');
const PDFDocument = require('pdfkit');
const QRCode = require('qrcode');
=======
// TODO: Implement new certificate logic based on new attendance system

const { Event, EventRegistration, User } = require('../models');
const { Op } = require('sequelize');
>>>>>>> 2abfda7ee534c6e755ec7078e95159ca67f32216

// Check if user is eligible for certificate
// TODO: Update with new attendance logic
const checkCertificateEligibility = async (req, res) => {
  try {
    return res.status(501).json({
      success: false,
      message: 'Feature ini sedang dalam pengembangan. Sistem attendance baru akan segera hadir.'
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
// TODO: Update with new attendance logic
const markDailyAttendance = async (req, res) => {
  try {
    return res.status(501).json({
      success: false,
      message: 'Feature ini sedang dalam pengembangan. Sistem attendance baru akan segera hadir.'
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
// TODO: Update with new attendance logic
const getEventAttendanceSummary = async (req, res) => {
  try {
    return res.status(501).json({
      success: false,
      message: 'Feature ini sedang dalam pengembangan. Sistem attendance baru akan segera hadir.'
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
// TODO: Update with new attendance logic
const issueCertificatesForEvent = async (req, res) => {
  try {
    return res.status(501).json({
      success: false,
      message: 'Feature ini sedang dalam pengembangan. Sistem attendance baru akan segera hadir.'
    });
  } catch (error) {
    console.error('Issue certificates error:', error);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan server'
    });
  }
};

<<<<<<< HEAD
// Save certificate template
const saveCertificateTemplate = async (req, res) => {
  try {
    const { eventId, templateName, templateImageUrl, elements, previewData } = req.body;
    const organizerId = req.user.id;

    // Validate required fields
    if (!eventId || !templateName || !templateImageUrl || !elements) {
      return res.status(400).json({
        success: false,
        message: 'Data template tidak lengkap'
      });
    }

    // Check if event belongs to organizer
    const event = await Event.findOne({
      where: {
        id: eventId,
        created_by: organizerId
      }
    });

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event tidak ditemukan atau bukan milik Anda'
      });
    }

    // Check if template already exists for this event
    let certificate = await Certificate.findOne({
      where: {
        event_id: eventId,
        organizer_id: organizerId
      }
    });

    if (certificate) {
      // Update existing template
      await certificate.update({
        template_name: templateName,
        template_image_url: templateImageUrl,
        elements: elements,
        preview_data: previewData,
        updated_at: new Date()
      });
    } else {
      // Create new template
      certificate = await Certificate.create({
        event_id: eventId,
        organizer_id: organizerId,
        template_name: templateName,
        template_image_url: templateImageUrl,
        elements: elements,
        preview_data: previewData
      });
    }

    res.json({
      success: true,
      message: 'Template sertifikat berhasil disimpan',
      data: certificate
    });

  } catch (error) {
    console.error('Save certificate template error:', error);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan server'
    });
  }
};

// Get certificate template for event
const getCertificateTemplate = async (req, res) => {
  try {
    const { eventId } = req.params;
    const organizerId = req.user.id;

    const certificate = await Certificate.findOne({
      where: {
        event_id: eventId,
        organizer_id: organizerId
      },
      // Remove include for now since associations not defined
      // include: [{
      //   model: Event,
      //   as: 'event',
      //   attributes: ['id', 'judul', 'tanggal', 'lokasi']
      // }]
    });

    if (!certificate) {
      return res.status(404).json({
        success: false,
        message: 'Template sertifikat tidak ditemukan'
      });
    }

    res.json({
      success: true,
      data: certificate
    });

  } catch (error) {
    console.error('Get certificate template error:', error);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan server'
    });
  }
};

// Get all certificate templates by organizer
const getCertificateTemplates = async (req, res) => {
  try {
    const organizerId = req.user.id;

    const certificates = await Certificate.findAll({
      where: {
        organizer_id: organizerId
      },
      // Remove include for now since associations not defined
      // include: [{
      //   model: Event,
      //   as: 'event',
      //   attributes: ['id', 'judul', 'tanggal', 'lokasi', 'status']
      // }],
      order: [['created_at', 'DESC']]
    });

    res.json({
      success: true,
      data: certificates
    });

  } catch (error) {
    console.error('Get certificate templates error:', error);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan server'
    });
  }
};

// Get eligible participants for certificate
const getEligibleParticipants = async (req, res) => {
  try {
    const { eventId } = req.params;
    const organizerId = req.user.id;

    // Check if event belongs to organizer
    const event = await Event.findOne({
      where: {
        id: eventId,
        created_by: organizerId
      }
    });

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event tidak ditemukan'
      });
    }

    // Get participants who attended the event
    const participants = await EventRegistration.findAll({
      where: {
        event_id: eventId,
        status: 'confirmed',
        attended_at: {
          [Op.not]: null
        }
      },
      include: [{
        model: User,
        as: 'User',
        attributes: ['id', 'nama_lengkap', 'email', 'no_handphone']
      }],
      order: [['attended_at', 'ASC']]
    });

    res.json({
      success: true,
      data: participants
    });

  } catch (error) {
    console.error('Get eligible participants error:', error);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan server'
    });
  }
};

// Generate certificate number
const generateCertificateNumber = (eventId, participantId) => {
  const timestamp = Date.now().toString().slice(-6);
  return `CERT-${eventId}-${participantId}-${timestamp}`;
};

// Issue certificate to participant
const issueCertificate = async (req, res) => {
  try {
    const { eventId, participantId } = req.params;
    const organizerId = req.user.id;

    // Get certificate template
    const certificate = await Certificate.findOne({
      where: {
        event_id: eventId,
        organizer_id: organizerId
      }
    });

    if (!certificate) {
      return res.status(404).json({
        success: false,
        message: 'Template sertifikat tidak ditemukan'
      });
    }

    // Get participant registration
    const registration = await EventRegistration.findOne({
      where: {
        event_id: eventId,
        user_id: participantId,
        status: 'confirmed',
        attended_at: {
          [Op.not]: null
        }
      },
      include: [{
        model: User,
        as: 'User',
        attributes: ['id', 'nama_lengkap', 'email', 'no_handphone']
      }, {
        model: Event,
        as: 'Event',
        attributes: ['id', 'judul', 'tanggal', 'lokasi']
      }]
    });

    if (!registration) {
      return res.status(404).json({
        success: false,
        message: 'Peserta tidak eligible untuk sertifikat'
      });
    }

    // Check if certificate already issued
    const existingCertificate = await CertificateIssued.findOne({
      where: {
        certificate_id: certificate.id,
        participant_id: participantId,
        event_registration_id: registration.id
      }
    });

    if (existingCertificate) {
      return res.status(400).json({
        success: false,
        message: 'Sertifikat sudah pernah diterbitkan untuk peserta ini'
      });
    }

    // Generate certificate number
    const certificateNumber = generateCertificateNumber(eventId, participantId);

    // Prepare participant data
    const participantData = {
      participantName: registration.User.nama_lengkap,
      eventTitle: registration.Event.judul,
      eventDate: new Date(registration.Event.tanggal).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      }),
      eventLocation: registration.Event.lokasi,
      organizerName: req.user.nama_lengkap || req.user.nama,
      certificateNumber: certificateNumber
    };

    // Issue certificate
    const issuedCertificate = await CertificateIssued.create({
      certificate_id: certificate.id,
      participant_id: participantId,
      event_registration_id: registration.id,
      certificate_number: certificateNumber,
      participant_data: participantData
    });

    res.json({
      success: true,
      message: 'Sertifikat berhasil diterbitkan',
      data: issuedCertificate
    });

  } catch (error) {
    console.error('Issue certificate error:', error);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan server'
    });
  }
};

// Generate PDF certificate with participant name (like Digitalent)
const generateCertificate = async (req, res) => {
  try {
    const { eventId, participantId } = req.params;

    // Get event with certificate settings
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

    // Get participant data
    const registration = await EventRegistration.findOne({
      where: {
        event_id: eventId,
        user_id: participantId
      },
      include: [{
        model: User,
        as: 'User',
        attributes: ['id', 'nama_lengkap', 'email']
      }]
    });

    if (!registration) {
      return res.status(404).json({
        success: false,
        message: 'Peserta tidak ditemukan'
      });
    }

    // Generate certificate number
    const certNumber = `${event.id.toString().padStart(4, '0')}/${registration.user_id.toString().padStart(6, '0')}/CERT/${new Date().getFullYear()}`;
    
    // Generate QR Code for verification
    const verificationUrl = `${process.env.APP_URL || 'http://localhost:3000'}/verify-certificate/${certNumber}`;
    const qrCodeDataUrl = await QRCode.toDataURL(verificationUrl);

    // Create PDF
    const doc = new PDFDocument({
      size: 'A4',
      layout: 'landscape',
      margins: { top: 50, bottom: 50, left: 72, right: 72 }
    });

    // Save to buffer
    const chunks = [];
    doc.on('data', chunk => chunks.push(chunk));
    
    const pdfPromise = new Promise((resolve, reject) => {
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);
    });

    // Add template background if exists
    if (event.sertifikat_template) {
      try {
        const templatePath = path.join(__dirname, '..', event.sertifikat_template);
        doc.image(templatePath, 0, 0, { width: 841.89, height: 595.28 });
      } catch (err) {
        console.log('Template not found, using default design');
      }
    }

    // Certificate Title
    doc.fontSize(24)
       .font('Helvetica-Bold')
       .fillColor('#2c3e50')
       .text('SERTIFIKAT PELATIHAN', 0, 120, { align: 'center' });

    // Certificate Number
    doc.fontSize(10)
       .font('Helvetica')
       .fillColor('#7f8c8d')
       .text(certNumber, 0, 150, { align: 'center' });

    // "Diberikan kepada"
    doc.fontSize(14)
       .fillColor('#34495e')
       .text('Diberikan kepada', 0, 180, { align: 'center' });

    // Participant Name (DYNAMIC FROM DATABASE)
    doc.fontSize(28)
       .font('Helvetica-Bold')
       .fillColor('#2980b9')
       .text(registration.User.nama_lengkap.toUpperCase(), 0, 210, { align: 'center' });

    // Event description
    doc.fontSize(12)
       .font('Helvetica')
       .fillColor('#34495e')
       .text('telah menyelesaikan pelatihan', 0, 260, { align: 'center' });

    // Event Title (DYNAMIC FROM DATABASE)
    doc.fontSize(16)
       .font('Helvetica-Bold')
       .fillColor('#2c3e50')
       .text(event.judul, 0, 285, { align: 'center', width: 700 });

    // Event details
    const eventDate = new Date(event.tanggal).toLocaleDateString('id-ID', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    });
    
    doc.fontSize(11)
       .font('Helvetica')
       .fillColor('#7f8c8d')
       .text(`Diselenggarakan oleh ${event.penyelenggara || 'EventHub'}`, 0, 330, { align: 'center' });
    
    doc.text(`pada tanggal ${eventDate}`, 0, 350, { align: 'center' });

    if (event.durasi_hari > 1) {
      doc.text(`selama ${event.durasi_hari} hari pelatihan`, 0, 370, { align: 'center' });
    }

    // Issue date
    const issueDate = new Date().toLocaleDateString('id-ID', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    });
    
    doc.fontSize(10)
       .text(`Jakarta, ${issueDate}`, 0, 420, { align: 'center' });

    // QR Code
    const qrX = 370;
    const qrY = 450;
    doc.image(qrCodeDataUrl, qrX, qrY, { width: 80, height: 80 });

    // QR Code description
    doc.fontSize(8)
       .fillColor('#7f8c8d')
       .text('Scan QR untuk verifikasi', qrX - 20, qrY + 85, { width: 120, align: 'center' });
    
    doc.text('keaslian sertifikat', qrX - 20, qrY + 95, { width: 120, align: 'center' });

    // Signature
    doc.fontSize(11)
       .font('Helvetica-Bold')
       .fillColor('#2c3e50')
       .text(event.penyelenggara || 'PANITIA PENYELENGGARA', 0, 460, { align: 'center' });

    // Footer
    doc.fontSize(8)
       .font('Helvetica')
       .fillColor('#95a5a6')
       .text('Dokumen ini dibuat secara digital dan sah tanpa tanda tangan basah', 0, 545, { align: 'center' });

    doc.end();

    // Wait for PDF to be generated
    const pdfBuffer = await pdfPromise;

    // Save to file
    const issuedDir = path.join(__dirname, '..', 'uploads', 'certificates', 'issued');
    await fs.mkdir(issuedDir, { recursive: true });
    
    const filename = `cert-${eventId}-${participantId}-${Date.now()}.pdf`;
    const filepath = path.join(issuedDir, filename);
    await fs.writeFile(filepath, pdfBuffer);

    // Save to database
    await CertificateIssued.create({
      event_id: eventId,
      user_id: participantId,
      certificate_number: certNumber,
      certificate_url: `/uploads/certificates/issued/${filename}`,
      issued_date: new Date()
    });

    res.json({
      success: true,
      message: 'Sertifikat berhasil digenerate',
      data: {
        certificate_url: `/uploads/certificates/issued/${filename}`,
        certificate_number: certNumber,
        participant_name: registration.User.nama_lengkap,
        event_name: event.judul,
        issue_date: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Generate certificate error:', error);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat generate sertifikat',
      error: error.message
    });
  }
};

// Get user's certificates (for participant view)
const getUserCertificates = async (req, res) => {
  try {
    const userId = req.user.id; // From auth middleware

    // Get all certificates for this user
    const certificates = await CertificateIssued.findAll({
      where: { user_id: userId },
      include: [
        {
          model: Event,
          as: 'event',
          attributes: ['id', 'judul', 'tanggal', 'penyelenggara', 'durasi_hari']
        }
      ],
      order: [['issued_date', 'DESC']]
    });

    res.json({
      success: true,
      data: certificates
    });

  } catch (error) {
    console.error('Get user certificates error:', error);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat mengambil data sertifikat',
      error: error.message
    });
  }
};

// Download certificate (track download count)
const downloadCertificate = async (req, res) => {
  try {
    const { certificateId } = req.params;
    const userId = req.user.id;

    const certificate = await CertificateIssued.findOne({
      where: { 
        id: certificateId,
        user_id: userId 
      }
    });

    if (!certificate) {
      return res.status(404).json({
        success: false,
        message: 'Sertifikat tidak ditemukan'
      });
    }

    // Update download stats
    await certificate.update({
      downloaded_at: new Date(),
      download_count: certificate.download_count + 1
    });

    // Send file
    const filepath = path.join(__dirname, '..', certificate.certificate_url);
    res.download(filepath, `Certificate-${certificate.certificate_number}.pdf`);

  } catch (error) {
    console.error('Download certificate error:', error);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat download sertifikat',
      error: error.message
    });
  }
};

// Get organizer's events that provide certificates
const getOrganizerEventsWithCertificates = async (req, res) => {
  try {
    const organizerId = req.user.id;
    console.log('Getting events for organizer ID:', organizerId);

    const events = await Event.findAll({
      where: {
        created_by: organizerId,
        memberikan_sertifikat: 1
      },
      attributes: [
        'id',
        'judul',
        'tanggal',
        'tanggal_selesai',
        'durasi_hari',
        'minimum_kehadiran',
        'penyelenggara',
        'status_event',
        // Count approved/confirmed participants
        [
          sequelize.literal(`(
            SELECT COUNT(*)
            FROM EventRegistrations
            WHERE EventRegistrations.event_id = Event.id
            AND (EventRegistrations.status = 'approved' OR EventRegistrations.status = 'confirmed')
          )`),
          'total_participants'
        ],
        // Count issued certificates
        [
          sequelize.literal(`(
            SELECT COUNT(*)
            FROM certificates_issued
            WHERE certificates_issued.event_id = Event.id
          )`),
          'total_issued'
        ]
      ],
      order: [['tanggal', 'DESC']]
    });

    console.log(`Found ${events.length} events with certificates`);
    
    // Debug: Log each event's data (only if there are events)
    if (events.length > 0) {
      console.log('=== EVENTS WITH CERTIFICATE DATA ===');
      events.forEach((event, index) => {
        const eventData = event.toJSON();
        console.log(`Event ${index + 1}: ${eventData.judul}`);
        console.log(`- Total Participants: ${eventData.total_participants}`);
        console.log(`- Total Issued: ${eventData.total_issued}`);
        console.log('---');
      });
    }
    
    // Additional debug: Check certificates_issued table directly
    const totalCertificatesInDB = await sequelize.query(
      'SELECT COUNT(*) as count FROM certificates_issued',
      { type: sequelize.QueryTypes.SELECT }
    );
    console.log('Total certificates in DB:', totalCertificatesInDB[0]?.count || 0);
    
    // Debug: Check specific event certificates
    if (events.length > 0) {
      const firstEventId = events[0].id;
      const eventCertificates = await sequelize.query(
        'SELECT * FROM certificates_issued WHERE event_id = ?',
        { 
          replacements: [firstEventId],
          type: sequelize.QueryTypes.SELECT 
        }
      );
      console.log(`Certificates for event ${firstEventId}:`, eventCertificates.length);
      if (eventCertificates.length > 0) {
        console.log('Sample certificate:', eventCertificates[0]);
      }
    }

    res.json({
      success: true,
      data: events
    });

  } catch (error) {
    console.error('Get organizer events error:', error);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat mengambil data event',
      error: error.message
    });
  }
};

// Get eligible participants for certificate
const getEligibleParticipantsForEvent = async (req, res) => {
  try {
    const { eventId } = req.params;
    const organizerId = req.user.id;
    
    console.log('=== GET ELIGIBLE PARTICIPANTS ===');
    console.log('Event ID:', eventId);
    console.log('Organizer ID:', organizerId);
    console.log('User object:', req.user);

    // Verify event belongs to organizer
    const event = await Event.findOne({
      where: {
        id: eventId,
        created_by: organizerId, // Fixed: use created_by instead of organizer_id
        memberikan_sertifikat: 1
      }
    });

    if (!event) {
      console.log('❌ Event not found or does not provide certificates');
      return res.status(404).json({
        success: false,
        message: 'Event tidak ditemukan atau tidak memberikan sertifikat'
      });
    }

    console.log('✅ Event found:', { id: event.id, judul: event.judul, memberikan_sertifikat: event.memberikan_sertifikat });

    // Get all registered participants with attendance count
    console.log('📋 Fetching participants...');
    
    // Parse eventId to integer for safety
    const eventIdInt = parseInt(eventId);
    
    // Get participants with attendance and certificate counts using efficient subqueries
    const participants = await EventRegistration.findAll({
      where: {
        event_id: eventIdInt,
        status: 'confirmed'
      },
      include: [
        {
          model: User,
          as: 'User',
          attributes: ['id', 'nama_lengkap', 'email'],
          required: false // LEFT JOIN
        }
      ],
      attributes: [
        'id',
        'user_id',
        'createdAt',
        [
          sequelize.literal(`(
            SELECT COUNT(DISTINCT attendance_date)
            FROM DailyAttendances
            WHERE DailyAttendances.event_id = ${eventIdInt}
            AND DailyAttendances.user_id = EventRegistration.user_id
            AND DailyAttendances.status = 'present'
          )`),
          'attendance_count'
        ],
        [
          sequelize.literal(`(
            SELECT COUNT(*)
            FROM certificates_issued
            WHERE certificates_issued.event_id = ${eventIdInt}
            AND certificates_issued.user_id = EventRegistration.user_id
          )`),
          'certificate_issued'
        ]
      ],
      order: [[sequelize.literal('attendance_count'), 'DESC']]
    });

    console.log('✅ Participants fetched:', participants.length);

    // Format response
    const formattedParticipants = participants.map(p => ({
      registration_id: p.id,
      user_id: p.user_id,
      nama: p.User?.nama_lengkap || 'N/A',
      email: p.User?.email || 'N/A',
      attendance_count: parseInt(p.getDataValue('attendance_count')) || 0,
      is_eligible: (parseInt(p.getDataValue('attendance_count')) || 0) >= event.minimum_kehadiran,
      certificate_issued: (parseInt(p.getDataValue('certificate_issued')) || 0) > 0,
      registered_at: p.createdAt
    }));

    res.json({
      success: true,
      data: {
        event: {
          id: event.id,
          judul: event.judul,
          durasi_hari: event.durasi_hari,
          minimum_kehadiran: event.minimum_kehadiran,
          penyelenggara: event.penyelenggara
        },
        participants: formattedParticipants,
        summary: {
          total: formattedParticipants.length,
          eligible: formattedParticipants.filter(p => p.is_eligible).length,
          issued: formattedParticipants.filter(p => p.certificate_issued).length,
          pending: formattedParticipants.filter(p => p.is_eligible && !p.certificate_issued).length
        }
      }
    });

  } catch (error) {
    console.error('❌ Get eligible participants error:', error);
    console.error('Error stack:', error.stack);
    console.error('Error name:', error.name);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat mengambil data peserta',
      error: error.message
    });
  }
};

// Bulk generate certificates for all eligible participants
const bulkGenerateCertificates = async (req, res) => {
  try {
    const { eventId } = req.params;
    const organizerId = req.user.id;
    
    // Parse eventId to integer for safety
    const eventIdInt = parseInt(eventId);

    // Verify event
    const event = await Event.findOne({
      where: {
        id: eventIdInt,
        created_by: organizerId, // Fixed: use created_by instead of organizer_id
        memberikan_sertifikat: 1
      }
    });

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event tidak ditemukan'
      });
    }

    // Get eligible participants (not yet issued)
    const participants = await EventRegistration.findAll({
      where: {
        event_id: eventIdInt,
        status: 'confirmed' // Fixed: use 'confirmed' instead of 'approved'
      },
      include: [{
        model: User,
        as: 'User', // Fixed: use 'User' instead of 'user'
        attributes: ['id', 'nama_lengkap', 'email'] // Fixed: use 'nama_lengkap'
      }],
      attributes: [
        'user_id',
        [
          sequelize.literal(`(
            SELECT COUNT(DISTINCT attendance_date)
            FROM DailyAttendances
            WHERE DailyAttendances.event_id = ${eventIdInt}
            AND DailyAttendances.user_id = EventRegistration.user_id
            AND DailyAttendances.status = 'present'
          )`),
          'attendance_count'
        ],
        [
          sequelize.literal(`(
            SELECT COUNT(*)
            FROM certificates_issued
            WHERE certificates_issued.event_id = ${eventIdInt}
            AND certificates_issued.user_id = EventRegistration.user_id
          )`),
          'certificate_issued'
        ]
      ]
    });

    const eligibleParticipants = participants.filter(p => {
      const attendanceCount = parseInt(p.getDataValue('attendance_count')) || 0;
      const alreadyIssued = parseInt(p.getDataValue('certificate_issued')) > 0;
      return attendanceCount >= event.minimum_kehadiran && !alreadyIssued;
    });

    if (eligibleParticipants.length === 0) {
      return res.json({
        success: true,
        message: 'Tidak ada peserta yang eligible untuk certificate',
        data: {
          generated: 0,
          failed: 0,
          results: []
        }
      });
    }

    // Generate certificates
    const results = [];
    let successCount = 0;
    let failCount = 0;

    for (const participant of eligibleParticipants) {
      try {
        // Generate certificate number
        const certNumber = `${event.id.toString().padStart(4, '0')}/${participant.user_id.toString().padStart(6, '0')}/CERT/${new Date().getFullYear()}`;
        
        // Generate QR Code
        const verificationUrl = `${process.env.APP_URL || 'http://localhost:3000'}/verify-certificate/${certNumber}`;
        const qrCodeDataUrl = await QRCode.toDataURL(verificationUrl);

        // Create PDF (same logic as generateCertificate)
        const doc = new PDFDocument({
          size: 'A4',
          layout: 'landscape',
          margins: { top: 50, bottom: 50, left: 72, right: 72 }
        });

        const chunks = [];
        doc.on('data', chunk => chunks.push(chunk));
        
        const pdfPromise = new Promise((resolve, reject) => {
          doc.on('end', () => resolve(Buffer.concat(chunks)));
          doc.on('error', reject);
        });

        // PDF Content
        doc.fontSize(24).font('Helvetica-Bold').fillColor('#2c3e50')
           .text('SERTIFIKAT PELATIHAN', 0, 120, { align: 'center' });
        
        doc.fontSize(10).font('Helvetica').fillColor('#7f8c8d')
           .text(certNumber, 0, 150, { align: 'center' });
        
        doc.fontSize(14).fillColor('#34495e')
           .text('Diberikan kepada', 0, 180, { align: 'center' });
        
        doc.fontSize(28).font('Helvetica-Bold').fillColor('#2980b9')
           .text(participant.User.nama_lengkap.toUpperCase(), 0, 210, { align: 'center' });
        
        doc.fontSize(12).font('Helvetica').fillColor('#34495e')
           .text('telah menyelesaikan pelatihan', 0, 260, { align: 'center' });
        
        doc.fontSize(16).font('Helvetica-Bold').fillColor('#2c3e50')
           .text(event.judul, 0, 285, { align: 'center', width: 700 });
        
        const eventDate = new Date(event.tanggal).toLocaleDateString('id-ID', { 
          day: 'numeric', month: 'long', year: 'numeric' 
        });
        
        doc.fontSize(11).font('Helvetica').fillColor('#7f8c8d')
           .text(`Diselenggarakan oleh ${event.penyelenggara || 'EventHub'}`, 0, 330, { align: 'center' })
           .text(`pada tanggal ${eventDate}`, 0, 350, { align: 'center' });
        
        if (event.durasi_hari > 1) {
          doc.text(`selama ${event.durasi_hari} hari pelatihan`, 0, 370, { align: 'center' });
        }
        
        const issueDate = new Date().toLocaleDateString('id-ID', { 
          day: 'numeric', month: 'long', year: 'numeric' 
        });
        
        doc.fontSize(10).text(`Jakarta, ${issueDate}`, 0, 420, { align: 'center' });
        
        const qrX = 370, qrY = 450;
        doc.image(qrCodeDataUrl, qrX, qrY, { width: 80, height: 80 });
        
        doc.fontSize(8).fillColor('#7f8c8d')
           .text('Scan QR untuk verifikasi', qrX - 20, qrY + 85, { width: 120, align: 'center' })
           .text('keaslian sertifikat', qrX - 20, qrY + 95, { width: 120, align: 'center' });
        
        doc.fontSize(11).font('Helvetica-Bold').fillColor('#2c3e50')
           .text(event.penyelenggara || 'PANITIA PENYELENGGARA', 0, 460, { align: 'center' });
        
        doc.fontSize(8).font('Helvetica').fillColor('#95a5a6')
           .text('Dokumen ini dibuat secara digital dan sah tanpa tanda tangan basah', 0, 545, { align: 'center' });

        doc.end();

        const pdfBuffer = await pdfPromise;

        // Save to file
        const issuedDir = path.join(__dirname, '..', 'uploads', 'certificates', 'issued');
        await fs.mkdir(issuedDir, { recursive: true });
        
        const filename = `cert-${eventIdInt}-${participant.user_id}-${Date.now()}.pdf`;
        const filepath = path.join(issuedDir, filename);
        await fs.writeFile(filepath, pdfBuffer);

        // Save to database
        await CertificateIssued.create({
          event_id: eventIdInt,
          user_id: participant.user_id,
          certificate_number: certNumber,
          certificate_url: `/uploads/certificates/issued/${filename}`,
          issued_date: new Date()
        });

        successCount++;
        results.push({
          user_id: participant.user_id,
          nama: participant.User.nama_lengkap,
          status: 'success',
          certificate_number: certNumber
        });

      } catch (error) {
        console.error(`Failed to generate certificate for user ${participant.user_id}:`, error);
        failCount++;
        results.push({
          user_id: participant.user_id,
          nama: participant.User.nama_lengkap,
          status: 'failed',
          error: error.message
        });
      }
    }

    res.json({
      success: true,
      message: `Berhasil generate ${successCount} sertifikat`,
      data: {
        generated: successCount,
        failed: failCount,
        total: eligibleParticipants.length,
        results
      }
    });

  } catch (error) {
    console.error('Bulk generate certificates error:', error);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat generate sertifikat',
      error: error.message
    });
  }
};

// Debug endpoint to check certificate data
const debugCertificates = async (req, res) => {
  try {
    console.log('=== CERTIFICATE DEBUG STARTED ===');
    
    // Check certificates_issued table
    const allCertificates = await sequelize.query(
      'SELECT ci.*, e.judul as event_title, u.nama_lengkap as user_name FROM certificates_issued ci LEFT JOIN Events e ON ci.event_id = e.id LEFT JOIN Users u ON ci.user_id = u.id ORDER BY ci.issued_date DESC',
      { type: sequelize.QueryTypes.SELECT }
    );
    console.log('Total certificates in DB:', allCertificates.length);
    
    // Check events with certificates
    const eventsWithCerts = await sequelize.query(
      'SELECT e.id, e.judul, e.memberikan_sertifikat, COUNT(ci.id) as cert_count FROM Events e LEFT JOIN certificates_issued ci ON e.id = ci.event_id WHERE e.memberikan_sertifikat = 1 GROUP BY e.id, e.judul, e.memberikan_sertifikat',
      { type: sequelize.QueryTypes.SELECT }
    );
    console.log('Events with certificates:', eventsWithCerts);
    
    // Check participants per event (both approved and confirmed)
    const participantsPerEvent = await sequelize.query(
      'SELECT e.id, e.judul, COUNT(er.id) as participant_count, er.status FROM Events e LEFT JOIN EventRegistrations er ON e.id = er.event_id WHERE e.memberikan_sertifikat = 1 AND (er.status = "approved" OR er.status = "confirmed") GROUP BY e.id, e.judul, er.status',
      { type: sequelize.QueryTypes.SELECT }
    );
    console.log('Participants per event:', participantsPerEvent);
    
    // Check all registrations for certificate events
    const allRegistrations = await sequelize.query(
      'SELECT e.id, e.judul, er.status, COUNT(er.id) as count FROM Events e LEFT JOIN EventRegistrations er ON e.id = er.event_id WHERE e.memberikan_sertifikat = 1 GROUP BY e.id, e.judul, er.status ORDER BY e.id, er.status',
      { type: sequelize.QueryTypes.SELECT }
    );
    console.log('All registrations by status:', allRegistrations);
    
    // Check table structure
    const tableInfo = await sequelize.query(
      'DESCRIBE certificates_issued',
      { type: sequelize.QueryTypes.SELECT }
    );
    console.log('certificates_issued table structure:', tableInfo);
    
    res.json({
      success: true,
      data: {
        totalCertificates: allCertificates.length,
        certificates: allCertificates,
        eventsWithCertificates: eventsWithCerts,
        participantsPerEvent: participantsPerEvent,
        allRegistrations: allRegistrations,
        tableStructure: tableInfo
      }
    });
    
  } catch (error) {
    console.error('Debug certificates error:', error);
    res.status(500).json({
      success: false,
      message: 'Debug error',
      error: error.message
    });
  }
};

// Fix certificate data - create missing certificate records
const fixCertificateData = async (req, res) => {
  try {
    console.log('=== FIXING CERTIFICATE DATA ===');
    
    const organizerId = req.user.id;
    
    // Find events that should have certificates but might be missing data
    const events = await Event.findAll({
      where: {
        created_by: organizerId,
        memberikan_sertifikat: 1
      }
    });
    
    let fixedCount = 0;
    
    for (const event of events) {
      console.log(`Checking event: ${event.judul} (ID: ${event.id})`);
      
      // Get participants who should have certificates (based on attendance)
      const eligibleParticipants = await sequelize.query(`
        SELECT DISTINCT er.user_id, u.nama_lengkap, u.email,
               COUNT(DISTINCT da.attendance_date) as attendance_count
        FROM EventRegistrations er
        JOIN Users u ON er.user_id = u.id
        LEFT JOIN DailyAttendances da ON da.event_id = er.event_id AND da.user_id = er.user_id AND da.status = 'present'
        WHERE er.event_id = ? 
        AND (er.status = 'approved' OR er.status = 'confirmed')
        GROUP BY er.user_id, u.nama_lengkap, u.email
        HAVING attendance_count >= ?
      `, {
        replacements: [event.id, event.minimum_kehadiran],
        type: sequelize.QueryTypes.SELECT
      });
      
      console.log(`Found ${eligibleParticipants.length} eligible participants for event ${event.id}`);
      
      // Check which participants already have certificates
      for (const participant of eligibleParticipants) {
        const existingCert = await CertificateIssued.findOne({
          where: {
            event_id: event.id,
            user_id: participant.user_id
          }
        });
        
        if (!existingCert) {
          // Create missing certificate record
          const certificateNumber = `CERT-${event.id}-${participant.user_id}-${Date.now()}`;
          
          await CertificateIssued.create({
            event_id: event.id,
            user_id: participant.user_id,
            certificate_number: certificateNumber,
            certificate_url: null, // Will be generated when downloaded
            issued_date: new Date()
          });
          
          fixedCount++;
          console.log(`Created certificate for user ${participant.user_id} in event ${event.id}`);
        }
      }
    }
    
    res.json({
      success: true,
      message: `Fixed ${fixedCount} missing certificate records`,
      data: {
        eventsChecked: events.length,
        certificatesCreated: fixedCount
      }
    });
    
  } catch (error) {
    console.error('Fix certificate data error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fixing certificate data',
      error: error.message
    });
  }
};

=======
>>>>>>> 2abfda7ee534c6e755ec7078e95159ca67f32216
module.exports = {
  checkCertificateEligibility,
  markDailyAttendance,
  getEventAttendanceSummary,
<<<<<<< HEAD
  issueCertificatesForEvent,
  saveCertificateTemplate,
  getCertificateTemplate,
  getCertificateTemplates,
  getEligibleParticipants,
  issueCertificate,
  generateCertificate,
  getUserCertificates,
  downloadCertificate,
  getOrganizerEventsWithCertificates,
  getEligibleParticipantsForEvent,
  bulkGenerateCertificates,
  debugCertificates,
  fixCertificateData
=======
  issueCertificatesForEvent
>>>>>>> 2abfda7ee534c6e755ec7078e95159ca67f32216
};
