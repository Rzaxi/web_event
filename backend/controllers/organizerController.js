<<<<<<< HEAD
const { Event, EventRegistration, User, DailyAttendance, sequelize } = require('../models');
// Temporarily comment out TicketCategory to test
// const { TicketCategory } = require('../models');
=======
const { Event, EventRegistration, User, sequelize, Sequelize } = require('../models');
>>>>>>> 2abfda7ee534c6e755ec7078e95159ca67f32216
const { Op } = require('sequelize');

// Get organizer dashboard data
const getDashboardData = async (req, res) => {
  try {
    const organizerId = req.user.id;

    // Get organizer's events
    const events = await Event.findAll({
      where: { created_by: organizerId },
      include: [{
        model: EventRegistration,
<<<<<<< HEAD
        as: 'registrations',
=======
>>>>>>> 2abfda7ee534c6e755ec7078e95159ca67f32216
        attributes: ['id', 'status']
      }]
    });

<<<<<<< HEAD
    // Helper function to get event status based on date
    const getEventStatus = (event) => {
      if (event.status_event === 'draft') return 'draft';
      
      const today = new Date();
      const eventDate = new Date(event.tanggal);
      
      // Set time to start of day for comparison
      today.setHours(0, 0, 0, 0);
      eventDate.setHours(0, 0, 0, 0);
      
      if (eventDate < today) {
        return 'completed'; // Event sudah lewat
      } else if (eventDate.getTime() === today.getTime()) {
        return 'ongoing'; // Event hari ini (sedang berlangsung)
      } else {
        return 'upcoming'; // Event akan datang
      }
    };

    // Calculate statistics with real-time status
    const totalEvents = events.length;
    let activeEvents = 0;
    let completedEvents = 0;
    let ongoingEvents = 0;
    
    events.forEach(event => {
      const status = getEventStatus(event);
      if (status === 'upcoming' && event.status_event === 'published') {
        activeEvents++;
      } else if (status === 'completed') {
        completedEvents++;
      } else if (status === 'ongoing') {
        ongoingEvents++;
      }
    });
=======
    // Calculate statistics
    const totalEvents = events.length;
    const activeEvents = events.filter(event => event.status_event === 'published').length;
    const completedEvents = events.filter(event => event.status_event === 'completed').length;
>>>>>>> 2abfda7ee534c6e755ec7078e95159ca67f32216
    
    // Calculate total participants
    let totalParticipants = 0;
    events.forEach(event => {
<<<<<<< HEAD
      totalParticipants += event.registrations ? event.registrations.length : 0;
    });

    // Get recent events (last 5) with real-time status
=======
      totalParticipants += event.EventRegistrations ? event.EventRegistrations.length : 0;
    });

    // Get recent events (last 5)
>>>>>>> 2abfda7ee534c6e755ec7078e95159ca67f32216
    const recentEvents = events
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5)
      .map(event => ({
        id: event.id,
        judul: event.judul,
        tanggal: event.tanggal,
        waktu_mulai: event.waktu_mulai,
<<<<<<< HEAD
        waktu_selesai: event.waktu_selesai,
        lokasi: event.lokasi,
        kapasitas_peserta: event.kapasitas_peserta,
        registeredCount: event.registrations ? event.registrations.length : 0,
        status_event: event.status_event,
        realTimeStatus: getEventStatus(event) // Status berdasarkan tanggal
=======
        lokasi: event.lokasi,
        kapasitas_peserta: event.kapasitas_peserta,
        registeredCount: event.EventRegistrations ? event.EventRegistrations.length : 0,
        status_event: event.status_event
>>>>>>> 2abfda7ee534c6e755ec7078e95159ca67f32216
      }));

    res.json({
      success: true,
      data: {
        stats: {
          totalEvents,
          activeEvents,
<<<<<<< HEAD
          ongoingEvents,
=======
>>>>>>> 2abfda7ee534c6e755ec7078e95159ca67f32216
          completedEvents,
          totalParticipants
        },
        recentEvents
      }
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching dashboard data',
      error: error.message
    });
  }
};

// Get organizer's events
const getEvents = async (req, res) => {
  try {
    const organizerId = req.user.id;
<<<<<<< HEAD
    const { search, status, page = 1, limit = 10 } = req.query;
=======
    const { search, status } = req.query;
>>>>>>> 2abfda7ee534c6e755ec7078e95159ca67f32216

    let whereClause = { created_by: organizerId };

    // Add search filter
    if (search) {
<<<<<<< HEAD
      whereClause.judul = {
        [Op.iLike]: `%${search}%`
      };
    }

    // Add status filter
    if (status) {
      whereClause.status_event = status;
    }

    const offset = (page - 1) * limit;

    const { count, rows: events } = await Event.findAndCountAll({
      where: whereClause,
      include: [{
        model: EventRegistration,
        as: 'registrations',
        attributes: ['id', 'status']
      }],
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    // Add registered count to each event
    const eventsWithCount = events.map(event => ({
      ...event.toJSON(),
      registeredCount: event.registrations ? event.registrations.length : 0
=======
      whereClause[Op.or] = [
        { judul: { [Op.like]: `%${search}%` } },
        { lokasi: { [Op.like]: `%${search}%` } }
      ];
    }

    // Add status filter
    if (status && status !== 'all') {
      whereClause.status_event = status;
    }

    const events = await Event.findAll({
      where: whereClause,
      include: [{
        model: EventRegistration,
        attributes: ['id', 'status']
      }],
      order: [['createdAt', 'DESC']]
    });

    const eventsWithStats = events.map(event => ({
      id: event.id,
      judul: event.judul,
      tanggal: event.tanggal,
      waktu_mulai: event.waktu_mulai,
      lokasi: event.lokasi,
      kategori: event.kategori,
      kapasitas_peserta: event.kapasitas_peserta,
      biaya: event.biaya,
      status_event: event.status_event,
      deskripsi: event.deskripsi,
      registeredCount: event.EventRegistrations ? event.EventRegistrations.length : 0,
      confirmedCount: event.EventRegistrations ? 
        event.EventRegistrations.filter(reg => reg.status === 'confirmed').length : 0
>>>>>>> 2abfda7ee534c6e755ec7078e95159ca67f32216
    }));

    res.json({
      success: true,
<<<<<<< HEAD
      data: {
        events: eventsWithCount,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(count / limit),
          totalItems: count,
          itemsPerPage: parseInt(limit)
        }
      }
=======
      data: eventsWithStats
>>>>>>> 2abfda7ee534c6e755ec7078e95159ca67f32216
    });
  } catch (error) {
    console.error('Get events error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching events',
      error: error.message
    });
  }
};

<<<<<<< HEAD
// Get single event detail
const getEventById = async (req, res) => {
  try {
    const organizerId = req.user.id;
    const eventId = req.params.id;

    const event = await Event.findOne({
      where: {
        id: eventId,
        created_by: organizerId
      },
      include: [{
        model: EventRegistration,
        as: 'registrations',
        attributes: ['id', 'status']
      }]
    });

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event tidak ditemukan atau bukan milik Anda'
      });
    }

    // Add registered count
    const eventWithCount = {
      ...event.toJSON(),
      registeredCount: event.registrations ? event.registrations.length : 0
    };

    res.json({
      success: true,
      data: eventWithCount
    });
  } catch (error) {
    console.error('Get event by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching event',
      error: error.message
    });
  }
};

=======
>>>>>>> 2abfda7ee534c6e755ec7078e95159ca67f32216
// Create new event
const createEvent = async (req, res) => {
  try {
    const organizerId = req.user.id;
    const {
      judul,
      deskripsi,
      tanggal,
<<<<<<< HEAD
      tanggal_selesai,
      waktu_mulai,
      waktu_selesai,
=======
      waktu_mulai,
>>>>>>> 2abfda7ee534c6e755ec7078e95159ca67f32216
      lokasi,
      kategori,
      kapasitas_peserta,
      biaya,
<<<<<<< HEAD
      status_event = 'draft',
      durasi_hari,
      minimum_kehadiran,
      memberikan_sertifikat,
      penyelenggara,
      ticketCategories
=======
      status_event = 'draft'
>>>>>>> 2abfda7ee534c6e755ec7078e95159ca67f32216
    } = req.body;

    // Validation
    if (!judul || !tanggal || !waktu_mulai || !lokasi) {
      return res.status(400).json({
        success: false,
        message: 'Field wajib: judul, tanggal, waktu_mulai, lokasi'
      });
    }

<<<<<<< HEAD
    // Get file paths if files were uploaded
    const flyer_url = req.files?.flyer ? `/uploads/flyers/${req.files.flyer[0].filename}` : null;
    const certificate_template = req.files?.certificate_template ? `/uploads/certificates/${req.files.certificate_template[0].filename}` : null;

    // Parse certificate elements if provided
    let certificate_elements = null;
    if (req.body.certificate_elements) {
      try {
        certificate_elements = JSON.parse(req.body.certificate_elements);
      } catch (e) {
        console.error('Error parsing certificate_elements:', e);
      }
    }

=======
>>>>>>> 2abfda7ee534c6e755ec7078e95159ca67f32216
    const event = await Event.create({
      judul,
      deskripsi,
      tanggal,
<<<<<<< HEAD
      tanggal_selesai,
      waktu_mulai,
      waktu_selesai,
=======
      waktu_mulai,
>>>>>>> 2abfda7ee534c6e755ec7078e95159ca67f32216
      lokasi,
      kategori,
      kapasitas_peserta: kapasitas_peserta || 50,
      biaya: biaya || 0,
      status_event,
<<<<<<< HEAD
      flyer_url,
      sertifikat_template: certificate_template,
      sertifikat_elements: certificate_elements,
      durasi_hari: durasi_hari || 1,
      minimum_kehadiran: minimum_kehadiran || 1,
      memberikan_sertifikat: memberikan_sertifikat === 'true' || memberikan_sertifikat === true,
      penyelenggara,
      created_by: organizerId
    });

    // Process and save ticket categories - TEMPORARILY DISABLED
    /*
    if (ticketCategories) {
      try {
        const parsedTicketCategories = typeof ticketCategories === 'string' 
          ? JSON.parse(ticketCategories) 
          : ticketCategories;

        console.log('Processing ticket categories:', parsedTicketCategories);

        if (Array.isArray(parsedTicketCategories) && parsedTicketCategories.length > 0) {
          const ticketCategoryData = parsedTicketCategories.map((ticket, index) => ({
            event_id: event.id,
            name: ticket.name || 'Unnamed Ticket',
            description: ticket.description || '',
            price: ticket.discount > 0 && ticket.originalPrice > 0 
              ? Math.floor(ticket.originalPrice * (100 - ticket.discount) / 100)
              : (ticket.price || 0),
            original_price: ticket.originalPrice > 0 ? ticket.originalPrice : null,
            quota: ticket.quota || null,
            sold_count: 0,
            is_active: ticket.isAvailable !== false,
            sale_start_date: ticket.salesStart || null,
            sale_end_date: ticket.salesEnd || null,
            badge_text: ticket.discount > 0 ? `HEMAT ${ticket.discount}%` : null,
            badge_color: ticket.discount > 0 ? 'green' : null,
            sort_order: index + 1
          }));

          await TicketCategory.bulkCreate(ticketCategoryData);
          console.log(`Created ${ticketCategoryData.length} ticket categories for event ${event.id}`);
        }
      } catch (parseError) {
        console.error('Error processing ticket categories:', parseError);
        // Don't fail the entire event creation if ticket categories fail
      }
    }
    */

=======
      created_by: organizerId
    });

>>>>>>> 2abfda7ee534c6e755ec7078e95159ca67f32216
    res.status(201).json({
      success: true,
      message: 'Event berhasil dibuat',
      data: event
    });
  } catch (error) {
    console.error('Create event error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating event',
      error: error.message
    });
  }
};

// Update event
const updateEvent = async (req, res) => {
  try {
    const organizerId = req.user.id;
    const eventId = req.params.id;
<<<<<<< HEAD
    const updateData = { ...req.body };
=======
    const updateData = req.body;
>>>>>>> 2abfda7ee534c6e755ec7078e95159ca67f32216

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

<<<<<<< HEAD
    // Handle file uploads
    if (req.files?.flyer) {
      updateData.flyer_url = `/uploads/flyers/${req.files.flyer[0].filename}`;
    }
    
    if (req.files?.certificate_template) {
      updateData.sertifikat_template = `/uploads/certificates/${req.files.certificate_template[0].filename}`;
    }

    // Parse certificate elements if provided
    if (req.body.certificate_elements) {
      try {
        updateData.sertifikat_elements = JSON.parse(req.body.certificate_elements);
      } catch (e) {
        console.error('Error parsing certificate_elements:', e);
      }
    }

    // Convert memberikan_sertifikat to boolean
    if (updateData.memberikan_sertifikat !== undefined) {
      updateData.memberikan_sertifikat = updateData.memberikan_sertifikat === '1' || updateData.memberikan_sertifikat === 'true' || updateData.memberikan_sertifikat === true;
    }

    // Ensure numeric fields are properly converted
    if (updateData.kapasitas_peserta) {
      updateData.kapasitas_peserta = parseInt(updateData.kapasitas_peserta);
    }
    if (updateData.biaya) {
      updateData.biaya = parseFloat(updateData.biaya);
    }
    if (updateData.durasi_hari) {
      updateData.durasi_hari = parseInt(updateData.durasi_hari);
    }
    if (updateData.minimum_kehadiran) {
      updateData.minimum_kehadiran = parseInt(updateData.minimum_kehadiran);
    }

    console.log('Updating event with data:', updateData);

=======
>>>>>>> 2abfda7ee534c6e755ec7078e95159ca67f32216
    await event.update(updateData);

    res.json({
      success: true,
      message: 'Event berhasil diupdate',
      data: event
    });
  } catch (error) {
    console.error('Update event error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating event',
      error: error.message
    });
  }
};

// Delete event
const deleteEvent = async (req, res) => {
  try {
    const organizerId = req.user.id;
    const eventId = req.params.id;

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

    // Check if event has registrations
    const registrationCount = await EventRegistration.count({
      where: { event_id: eventId }
    });

    if (registrationCount > 0) {
      return res.status(400).json({
        success: false,
        message: 'Tidak dapat menghapus event yang sudah memiliki peserta'
      });
    }

    await event.destroy();

    res.json({
      success: true,
      message: 'Event berhasil dihapus'
    });
  } catch (error) {
    console.error('Delete event error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting event',
      error: error.message
    });
  }
};

// Get participants for organizer's events
const getParticipants = async (req, res) => {
  try {
    console.log('getParticipants called with:', req.query);
    console.log('User from token:', req.user ? { id: req.user.id, email: req.user.email, role: req.user.role } : 'No user');
    const organizerId = req.user.id;
    const { search, event_id, status } = req.query;

    console.log('Organizer ID:', organizerId);

    // First get organizer's events
    const organizerEvents = await Event.findAll({
      where: { created_by: organizerId },
      attributes: ['id', 'judul']
    });

    console.log('Organizer events found:', organizerEvents.length);
    organizerEvents.forEach(e => console.log('- Event:', e.id, e.judul));
    const eventIds = organizerEvents.map(event => event.id);
    console.log('Event IDs:', eventIds);

    if (eventIds.length === 0) {
      return res.json({
        success: true,
        data: {
          participants: [],
          events: []
        }
      });
    }

    let whereClause = { event_id: { [Op.in]: eventIds } };

    // Add event filter
    if (event_id && event_id !== 'all') {
      whereClause.event_id = event_id;
    }

    // Add status filter
    if (status && status !== 'all') {
      whereClause.status = status;
    }

    console.log('Where clause:', whereClause);

    // Try simple query first
    const registrations = await EventRegistration.findAll({
      where: whereClause,
      order: [['createdAt', 'DESC']]
    });

    console.log('Registrations found:', registrations.length);

    // Manually fetch User and Event data
    const participants = [];
    for (const reg of registrations) {
      try {
        const user = await User.findByPk(reg.user_id, {
          attributes: ['id', 'nama_lengkap', 'email', 'no_handphone']
        });
        const event = await Event.findByPk(reg.event_id, {
          attributes: ['id', 'judul', 'tanggal']
        });

        if (user && event) {
          participants.push({
            id: reg.id,
            participant: {
              id: user.id,
              nama_lengkap: user.nama_lengkap,
              email: user.email,
              no_handphone: user.no_handphone
            },
            event: {
              id: event.id,
              judul: event.judul,
              tanggal: event.tanggal
            },
            status: reg.status || 'pending',
            createdAt: reg.createdAt
          });
        }
      } catch (fetchError) {
        console.error('Error fetching user/event for registration:', reg.id, fetchError);
      }
    }

    // Filter by search if provided
    let filteredParticipants = participants;
    if (search) {
      filteredParticipants = participants.filter(p => {
        const name = p.participant.nama_lengkap || '';
        const email = p.participant.email || '';
        return name.toLowerCase().includes(search.toLowerCase()) ||
               email.toLowerCase().includes(search.toLowerCase());
      });
    }

    console.log('Final participants count:', filteredParticipants.length);

    res.json({
      success: true,
      data: {
        participants: filteredParticipants,
        events: organizerEvents
      }
    });
  } catch (error) {
    console.error('Get participants error:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({
      success: false,
      message: 'Error fetching participants',
      error: error.message
    });
  }
};

// Get analytics data
const getAnalytics = async (req, res) => {
  try {
    const organizerId = req.user.id;
    const { timeRange = '6months' } = req.query;

    // Calculate date range
    const now = new Date();
    let startDate;
    
    switch (timeRange) {
      case '1month':
        startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        break;
      case '3months':
        startDate = new Date(now.getFullYear(), now.getMonth() - 3, 1);
        break;
      case '6months':
        startDate = new Date(now.getFullYear(), now.getMonth() - 6, 1);
        break;
      case '1year':
        startDate = new Date(now.getFullYear() - 1, now.getMonth(), 1);
        break;
      default:
        startDate = new Date(now.getFullYear(), now.getMonth() - 6, 1);
    }

    // Get events in date range
    const events = await Event.findAll({
      where: {
        created_by: organizerId,
        createdAt: {
          [Op.gte]: startDate
        }
      },
      include: [{
        model: EventRegistration,
<<<<<<< HEAD
        as: 'registrations',
=======
>>>>>>> 2abfda7ee534c6e755ec7078e95159ca67f32216
        attributes: ['id', 'status']
      }]
    });

<<<<<<< HEAD
    // Generate comprehensive monthly data for the selected time range
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthlyData = {};
    const monthlyGrowthData = {};
    const monthlyRevenueData = {};
    
    // Initialize all months in the range with zero values
    const currentDate = new Date();
    const monthsToShow = [];
    
    for (let i = 0; i < 12; i++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
      if (date >= startDate) {
        const monthKey = months[date.getMonth()];
        const yearMonth = `${monthKey} ${date.getFullYear()}`;
        monthsToShow.unshift({
          month: monthKey,
          year: date.getFullYear(),
          fullDate: date,
          displayName: yearMonth
        });
        
        monthlyData[yearMonth] = { 
          month: monthKey, 
          year: date.getFullYear(),
          displayName: yearMonth,
          events: 0, 
          participants: 0,
          revenue: 0,
          cumulativeEvents: 0,
          cumulativeParticipants: 0,
          cumulativeRevenue: 0
        };
      }
    }
    
    // Fill with actual data
    events.forEach(event => {
      const eventDate = new Date(event.createdAt);
      const monthKey = months[eventDate.getMonth()];
      const yearMonth = `${monthKey} ${eventDate.getFullYear()}`;
      
      if (monthlyData[yearMonth]) {
        monthlyData[yearMonth].events += 1;
        monthlyData[yearMonth].participants += event.registrations ? event.registrations.length : 0;
        monthlyData[yearMonth].revenue += parseFloat(event.biaya || 0) * (event.registrations ? event.registrations.length : 0);
      }
    });

    // Calculate cumulative data and growth
    let cumulativeEvents = 0;
    let cumulativeParticipants = 0;
    let cumulativeRevenue = 0;
    let previousParticipants = 0;
    
    const monthlyEvents = Object.values(monthlyData)
      .sort((a, b) => a.year - b.year || months.indexOf(a.month) - months.indexOf(b.month))
      .map((monthData, index) => {
        cumulativeEvents += monthData.events;
        cumulativeParticipants += monthData.participants;
        cumulativeRevenue += monthData.revenue;
        
        const growthRate = previousParticipants > 0 
          ? Math.round(((monthData.participants - previousParticipants) / previousParticipants) * 100)
          : monthData.participants > 0 ? 100 : 0;
        
        previousParticipants = monthData.participants;
        
        return {
          ...monthData,
          cumulativeEvents,
          cumulativeParticipants,
          cumulativeRevenue,
          growthRate: index === 0 ? 0 : growthRate
        };
      });
=======
    // Monthly events data
    const monthlyData = {};
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    events.forEach(event => {
      const month = months[new Date(event.createdAt).getMonth()];
      if (!monthlyData[month]) {
        monthlyData[month] = { month, events: 0, participants: 0 };
      }
      monthlyData[month].events += 1;
      monthlyData[month].participants += event.EventRegistrations ? event.EventRegistrations.length : 0;
    });

    const monthlyEvents = Object.values(monthlyData);
>>>>>>> 2abfda7ee534c6e755ec7078e95159ca67f32216

    // Event categories
    const categoryData = {};
    events.forEach(event => {
      if (!categoryData[event.kategori]) {
        categoryData[event.kategori] = 0;
      }
      categoryData[event.kategori] += 1;
    });

    const eventCategories = Object.entries(categoryData).map(([name, value], index) => ({
      name,
      value,
      color: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'][index % 5]
    }));

    // Top events
    const topEvents = events
      .map(event => ({
        name: event.judul,
<<<<<<< HEAD
        participants: event.registrations ? event.registrations.length : 0,
        revenue: parseFloat(event.biaya || 0) * (event.registrations ? event.registrations.length : 0)
=======
        participants: event.EventRegistrations ? event.EventRegistrations.length : 0,
        revenue: parseFloat(event.biaya || 0) * (event.EventRegistrations ? event.EventRegistrations.length : 0)
>>>>>>> 2abfda7ee534c6e755ec7078e95159ca67f32216
      }))
      .sort((a, b) => b.participants - a.participants)
      .slice(0, 4);

<<<<<<< HEAD
    // Calculate advanced stats
    const totalEvents = events.length;
    const totalParticipants = events.reduce((sum, event) => 
      sum + (event.registrations ? event.registrations.length : 0), 0);
    const totalRevenue = events.reduce((sum, event) => 
      sum + (parseFloat(event.biaya || 0) * (event.registrations ? event.registrations.length : 0)), 0);
    const avgParticipants = totalEvents > 0 ? Math.round(totalParticipants / totalEvents) : 0;

    // Calculate completion rate (events that have passed their date)
    const completedEvents = events.filter(event => new Date(event.tanggal) < now).length;
    const completionRate = totalEvents > 0 ? Math.round((completedEvents / totalEvents) * 100) : 0;

    // Calculate attendance rate from attended registrations
    const allRegistrations = events.flatMap(event => event.registrations || []);
    const attendedRegistrations = allRegistrations.filter(reg => reg.attended_at).length;
    const attendanceRate = allRegistrations.length > 0 ? Math.round((attendedRegistrations / allRegistrations.length) * 100) : 0;

    // Calculate growth rate (compare with previous period)
    const previousPeriodStart = new Date(startDate);
    previousPeriodStart.setMonth(previousPeriodStart.getMonth() - (now.getMonth() - startDate.getMonth()));
    
    const previousEvents = await Event.findAll({
      where: {
        created_by: organizerId,
        createdAt: {
          [Op.gte]: previousPeriodStart,
          [Op.lt]: startDate
        }
      },
      include: [{
        model: EventRegistration,
        as: 'registrations',
        attributes: ['id']
      }]
    });

    const previousPeriodParticipants = previousEvents.reduce((sum, event) => 
      sum + (event.registrations ? event.registrations.length : 0), 0);
    
    const growthRate = previousPeriodParticipants > 0 
      ? Math.round(((totalParticipants - previousPeriodParticipants) / previousPeriodParticipants) * 100)
      : totalParticipants > 0 ? 100 : 0;

    // Event status distribution
    const eventStatusData = [
      { name: 'Akan Datang', value: events.filter(e => new Date(e.tanggal) > now && e.status_event === 'published').length, color: '#10B981' },
      { name: 'Berlangsung', value: events.filter(e => {
        const eventDate = new Date(e.tanggal);
        const todayDate = new Date(now);
        eventDate.setHours(0, 0, 0, 0);
        todayDate.setHours(0, 0, 0, 0);
        return eventDate.getTime() === todayDate.getTime() && e.status_event === 'published';
      }).length, color: '#3B82F6' },
      { name: 'Selesai', value: events.filter(e => new Date(e.tanggal) < now).length, color: '#6B7280' },
      { name: 'Draft', value: events.filter(e => e.status_event === 'draft').length, color: '#F59E0B' }
    ].filter(item => item.value > 0);

    // Revenue by month
    const revenueByMonth = {};
    events.forEach(event => {
      const month = months[new Date(event.createdAt).getMonth()];
      if (!revenueByMonth[month]) {
        revenueByMonth[month] = { month, revenue: 0 };
      }
      revenueByMonth[month].revenue += parseFloat(event.biaya || 0) * (event.registrations ? event.registrations.length : 0);
    });

    // Generate growth trend data (cumulative)
    const growthTrend = monthlyEvents.map(month => ({
      month: month.displayName,
      totalEvents: month.cumulativeEvents,
      totalParticipants: month.cumulativeParticipants,
      totalRevenue: month.cumulativeRevenue,
      monthlyGrowth: month.growthRate
    }));

    // Generate performance trend (monthly)
    const performanceTrend = monthlyEvents.map(month => ({
      month: month.displayName,
      events: month.events,
      participants: month.participants,
      revenue: month.revenue,
      attendanceRate: month.participants > 0 ? Math.round((month.participants * 0.8)) : 0 // Mock attendance
    }));

=======
    // Calculate stats
    const totalEvents = events.length;
    const totalParticipants = events.reduce((sum, event) => 
      sum + (event.EventRegistrations ? event.EventRegistrations.length : 0), 0);
    const totalRevenue = events.reduce((sum, event) => 
      sum + (parseFloat(event.biaya || 0) * (event.EventRegistrations ? event.EventRegistrations.length : 0)), 0);
    const avgParticipants = totalEvents > 0 ? Math.round(totalParticipants / totalEvents) : 0;

>>>>>>> 2abfda7ee534c6e755ec7078e95159ca67f32216
    res.json({
      success: true,
      data: {
        monthlyEvents,
        eventCategories,
        topEvents,
<<<<<<< HEAD
        eventStatusData,
        growthTrend,
        performanceTrend,
        revenueByMonth: Object.values(revenueByMonth),
=======
>>>>>>> 2abfda7ee534c6e755ec7078e95159ca67f32216
        stats: {
          totalEvents,
          totalParticipants,
          totalRevenue,
          avgParticipants,
<<<<<<< HEAD
          completionRate,
          attendanceRate,
          growthRate,
          satisfactionRate: 4.2, // This would come from feedback system
          // Additional insights
          bestMonth: monthlyEvents.reduce((best, current) => 
            current.participants > (best?.participants || 0) ? current : best, null),
          totalMonthsActive: monthlyEvents.filter(m => m.events > 0).length,
          averageMonthlyRevenue: monthlyEvents.length > 0 
            ? Math.round(totalRevenue / monthlyEvents.filter(m => m.events > 0).length) 
            : 0
=======
          completionRate: 85, // Mock data
          satisfactionRate: 4.2 // Mock data
>>>>>>> 2abfda7ee534c6e755ec7078e95159ca67f32216
        }
      }
    });
  } catch (error) {
    console.error('Get analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching analytics',
      error: error.message
    });
  }
};

<<<<<<< HEAD
// Export analytics data
const exportAnalytics = async (req, res) => {
  try {
    const organizerId = req.user.id;
    const { timeRange = '6months', format = 'csv' } = req.query;

    // Calculate date range
    const now = new Date();
    let startDate;
    
    switch (timeRange) {
      case '1month':
        startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        break;
      case '3months':
        startDate = new Date(now.getFullYear(), now.getMonth() - 3, 1);
        break;
      case '6months':
        startDate = new Date(now.getFullYear(), now.getMonth() - 6, 1);
        break;
      case '1year':
        startDate = new Date(now.getFullYear() - 1, now.getMonth(), 1);
        break;
      default:
        startDate = new Date(now.getFullYear(), now.getMonth() - 6, 1);
    }

    // Get detailed events data
    const events = await Event.findAll({
      where: {
        created_by: organizerId,
        createdAt: {
          [Op.gte]: startDate
        }
      },
      include: [{
        model: EventRegistration,
        as: 'registrations',
        attributes: ['id', 'status', 'attended_at', 'createdAt']
      }],
      order: [['createdAt', 'DESC']]
    });

    // Prepare export data
    const exportData = events.map(event => {
      const registrations = event.registrations || [];
      const attendedCount = registrations.filter(reg => reg.attended_at).length;
      const revenue = parseFloat(event.biaya || 0) * registrations.length;
      
      return {
        'Nama Event': event.judul,
        'Tanggal': new Date(event.tanggal).toLocaleDateString('id-ID'),
        'Waktu': `${event.waktu_mulai} - ${event.waktu_selesai}`,
        'Lokasi': event.lokasi,
        'Kategori': event.kategori || 'Tidak dikategorikan',
        'Status': event.status_event,
        'Kapasitas': event.kapasitas_peserta,
        'Terdaftar': registrations.length,
        'Hadir': attendedCount,
        'Tingkat Kehadiran (%)': registrations.length > 0 ? Math.round((attendedCount / registrations.length) * 100) : 0,
        'Biaya per Peserta': `Rp ${parseFloat(event.biaya || 0).toLocaleString('id-ID')}`,
        'Total Revenue': `Rp ${revenue.toLocaleString('id-ID')}`,
        'Dibuat': new Date(event.createdAt).toLocaleDateString('id-ID')
      };
    });

    // Summary statistics
    const totalEvents = events.length;
    const totalParticipants = events.reduce((sum, event) => 
      sum + (event.registrations ? event.registrations.length : 0), 0);
    const totalRevenue = events.reduce((sum, event) => 
      sum + (parseFloat(event.biaya || 0) * (event.registrations ? event.registrations.length : 0)), 0);
    const totalAttended = events.reduce((sum, event) => 
      sum + (event.registrations ? event.registrations.filter(reg => reg.attended_at).length : 0), 0);

    const summaryData = {
      'Total Event': totalEvents,
      'Total Peserta Terdaftar': totalParticipants,
      'Total Peserta Hadir': totalAttended,
      'Tingkat Kehadiran Keseluruhan (%)': totalParticipants > 0 ? Math.round((totalAttended / totalParticipants) * 100) : 0,
      'Total Revenue': `Rp ${totalRevenue.toLocaleString('id-ID')}`,
      'Rata-rata Peserta per Event': totalEvents > 0 ? Math.round(totalParticipants / totalEvents) : 0,
      'Periode': `${startDate.toLocaleDateString('id-ID')} - ${now.toLocaleDateString('id-ID')}`
    };

    if (format === 'json') {
      res.json({
        success: true,
        data: {
          summary: summaryData,
          events: exportData,
          exportedAt: new Date().toISOString()
        }
      });
    } else {
      // For CSV format, we'll return the data and let frontend handle CSV generation
      res.json({
        success: true,
        data: {
          summary: summaryData,
          events: exportData,
          exportedAt: new Date().toISOString(),
          format: 'csv'
        }
      });
    }

  } catch (error) {
    console.error('Export analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Error exporting analytics',
      error: error.message
    });
  }
};

// Get participants for specific event
const getEventParticipants = async (req, res) => {
  try {
    const organizerId = req.user.id;
    const eventId = req.params.eventId;

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

    // Get participants for this event using safer approach
    const registrations = await EventRegistration.findAll({
      where: { event_id: eventId },
      order: [['createdAt', 'DESC']]
    });

    // Manually fetch User data to avoid association issues
    const formattedParticipants = [];
    for (const reg of registrations) {
      try {
        const user = await User.findByPk(reg.user_id, {
          attributes: ['id', 'nama_lengkap', 'email', 'no_handphone']
        });

        if (user) {
          formattedParticipants.push({
            id: reg.id,
            status: reg.status,
            attendance_token: reg.attendance_token,
            attended_at: reg.attended_at,
            createdAt: reg.createdAt,
            User: {
              id: user.id,
              nama: user.nama_lengkap,
              email: user.email,
              no_handphone: user.no_handphone
            }
          });
        }
      } catch (fetchError) {
        console.error('Error fetching user for registration:', reg.id, fetchError);
      }
    }

    res.json({
      success: true,
      data: formattedParticipants
    });
  } catch (error) {
    console.error('Get event participants error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching event participants',
      error: error.message
    });
  }
};

// Scan attendance token
const scanAttendance = async (req, res) => {
  try {
    const { attendance_token, event_id } = req.body;
    const organizerId = req.user.id;

    if (!attendance_token || !event_id) {
      return res.status(400).json({
        success: false,
        message: 'Token kehadiran dan ID event diperlukan'
      });
    }

    // Check if event belongs to organizer
    const event = await Event.findOne({
      where: { 
        id: event_id,
        created_by: organizerId 
      }
    });

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event tidak ditemukan atau bukan milik Anda'
      });
    }

    // Find participant by attendance token and event
    const participant = await EventRegistration.findOne({
      where: { 
        attendance_token: attendance_token,
        event_id: event_id
      }
    });

    if (!participant) {
      return res.status(404).json({
        success: false,
        message: 'Token kehadiran tidak valid atau peserta tidak terdaftar'
      });
    }

    // Get user data separately
    const user = await User.findByPk(participant.user_id, {
      attributes: ['id', 'nama_lengkap', 'email']
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Data peserta tidak ditemukan'
      });
    }

    // Check if already attended
    if (participant.status === 'attended') {
      return res.status(400).json({
        success: false,
        message: `${user.nama_lengkap} sudah tercatat hadir sebelumnya`
      });
    }

    // Update attendance status
    await participant.update({
      status: 'attended',
      attended_at: new Date()
    });

    res.json({
      success: true,
      message: 'Kehadiran berhasil dicatat',
      participant: {
        id: participant.id,
        User: {
          nama: user.nama_lengkap,
          email: user.email
        },
        attended_at: participant.attended_at
      }
    });
  } catch (error) {
    console.error('Scan attendance error:', error);
    res.status(500).json({
      success: false,
      message: 'Error scanning attendance',
      error: error.message
    });
  }
};
=======
>>>>>>> 2abfda7ee534c6e755ec7078e95159ca67f32216

module.exports = {
  getDashboardData,
  getEvents,
<<<<<<< HEAD
  getEventById,
  getParticipants,
  getAnalytics,
  exportAnalytics,
  createEvent,
  updateEvent,
  deleteEvent,
  getEventParticipants,
  scanAttendance
=======
  getParticipants,
  getAnalytics,
  createEvent,
  updateEvent,
  deleteEvent
>>>>>>> 2abfda7ee534c6e755ec7078e95159ca67f32216
};
