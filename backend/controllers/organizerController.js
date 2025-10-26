const { Event, EventRegistration, User, sequelize, Sequelize } = require('../models');
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
        attributes: ['id', 'status']
      }]
    });

    // Calculate statistics
    const totalEvents = events.length;
    const activeEvents = events.filter(event => event.status_event === 'published').length;
    const completedEvents = events.filter(event => event.status_event === 'completed').length;
    
    // Calculate total participants
    let totalParticipants = 0;
    events.forEach(event => {
      totalParticipants += event.EventRegistrations ? event.EventRegistrations.length : 0;
    });

    // Get recent events (last 5)
    const recentEvents = events
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5)
      .map(event => ({
        id: event.id,
        judul: event.judul,
        tanggal: event.tanggal,
        waktu_mulai: event.waktu_mulai,
        lokasi: event.lokasi,
        kapasitas_peserta: event.kapasitas_peserta,
        registeredCount: event.EventRegistrations ? event.EventRegistrations.length : 0,
        status_event: event.status_event
      }));

    res.json({
      success: true,
      data: {
        stats: {
          totalEvents,
          activeEvents,
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
    const { search, status } = req.query;

    let whereClause = { created_by: organizerId };

    // Add search filter
    if (search) {
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
    }));

    res.json({
      success: true,
      data: eventsWithStats
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

// Create new event
const createEvent = async (req, res) => {
  try {
    const organizerId = req.user.id;
    const {
      judul,
      deskripsi,
      tanggal,
      waktu_mulai,
      lokasi,
      kategori,
      kapasitas_peserta,
      biaya,
      status_event = 'draft'
    } = req.body;

    // Validation
    if (!judul || !tanggal || !waktu_mulai || !lokasi) {
      return res.status(400).json({
        success: false,
        message: 'Field wajib: judul, tanggal, waktu_mulai, lokasi'
      });
    }

    const event = await Event.create({
      judul,
      deskripsi,
      tanggal,
      waktu_mulai,
      lokasi,
      kategori,
      kapasitas_peserta: kapasitas_peserta || 50,
      biaya: biaya || 0,
      status_event,
      created_by: organizerId
    });

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
    const updateData = req.body;

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
        attributes: ['id', 'status']
      }]
    });

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
        participants: event.EventRegistrations ? event.EventRegistrations.length : 0,
        revenue: parseFloat(event.biaya || 0) * (event.EventRegistrations ? event.EventRegistrations.length : 0)
      }))
      .sort((a, b) => b.participants - a.participants)
      .slice(0, 4);

    // Calculate stats
    const totalEvents = events.length;
    const totalParticipants = events.reduce((sum, event) => 
      sum + (event.EventRegistrations ? event.EventRegistrations.length : 0), 0);
    const totalRevenue = events.reduce((sum, event) => 
      sum + (parseFloat(event.biaya || 0) * (event.EventRegistrations ? event.EventRegistrations.length : 0)), 0);
    const avgParticipants = totalEvents > 0 ? Math.round(totalParticipants / totalEvents) : 0;

    res.json({
      success: true,
      data: {
        monthlyEvents,
        eventCategories,
        topEvents,
        stats: {
          totalEvents,
          totalParticipants,
          totalRevenue,
          avgParticipants,
          completionRate: 85, // Mock data
          satisfactionRate: 4.2 // Mock data
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


module.exports = {
  getDashboardData,
  getEvents,
  getParticipants,
  getAnalytics,
  createEvent,
  updateEvent,
  deleteEvent
};
