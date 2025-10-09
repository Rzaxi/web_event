const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User, Event, EventRegistration, Attendance, DailyAttendance } = require('../models');
const { Op } = require('sequelize');

// Admin Login
const adminLogin = async (req, res) => {
  try {
    console.log('Request body:', req.body);
    console.log('Request headers:', req.headers);
    
    const { username, password } = req.body;
    
    console.log('Admin login attempt:', { username, password: password ? 'provided' : 'missing' });

    if (!username || !password) {
      console.log('Missing username or password');
      return res.status(400).json({
        success: false,
        message: 'Username dan password harus diisi'
      });
    }

    // For development, use hardcoded admin credentials
    if (username === 'admin' && password === 'admin123') {
      console.log('Using hardcoded admin credentials');
      const token = jwt.sign(
        { 
          id: 1, 
          username: 'admin', 
          role: 'admin' 
        },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '24h' }
      );

      return res.json({
        success: true,
        message: 'Login berhasil',
        token,
        user: {
          id: 1,
          username: 'admin',
          role: 'admin',
          name: 'Administrator'
        }
      });
    }

    console.log('Hardcoded credentials not matched, checking database...');

    // Check if admin user exists in database
    const admin = await User.findOne({ 
      where: { 
        username,
        role: 'admin' 
      } 
    });

    if (!admin) {
      console.log('Admin user not found in database');
      return res.status(401).json({
        success: false,
        message: 'Username atau password salah'
      });
    }

    const isValidPassword = await bcrypt.compare(password, admin.password);
    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: 'Username atau password salah'
      });
    }

    const token = jwt.sign(
      { 
        id: admin.id, 
        username: admin.username, 
        role: admin.role 
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      success: true,
      message: 'Login berhasil',
      token,
      user: {
        id: admin.id,
        username: admin.username,
        role: admin.role,
        name: admin.name
      }
    });

  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Get Dashboard Overview Statistics
const getDashboardOverview = async (req, res) => {
  try {
    const totalEvents = await Event.count();
    const totalParticipants = await EventRegistration.count({
      where: { status: 'confirmed' }
    });
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Debug: Log current date and check events
    console.log('Today:', today);
    
    const allEvents = await Event.findAll({
      attributes: ['id', 'judul', 'tanggal', 'tanggal_selesai'],
      raw: true
    });
    console.log('All events:', allEvents);
    
    const activeEvents = await Event.count({
      where: {
        [Op.or]: [
          {
            tanggal: {
              [Op.gte]: today
            }
          },
          {
            tanggal_selesai: {
              [Op.gte]: today
            }
          }
        ]
      }
    });
    
    console.log('Active events count:', activeEvents);

    const completedEvents = await Event.count({
      where: {
        [Op.and]: [
          {
            tanggal: {
              [Op.lt]: today
            }
          },
          {
            [Op.or]: [
              { tanggal_selesai: null },
              {
                tanggal_selesai: {
                  [Op.lt]: today
                }
              }
            ]
          }
        ]
      }
    });

    res.json({
      success: true,
      data: {
        totalEvents,
        totalParticipants,
        activeEvents,
        completedEvents
      }
    });

  } catch (error) {
    console.error('Dashboard overview error:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal mengambil data overview'
    });
  }
};

// Get Monthly Events Statistics
const getMonthlyEventsStats = async (req, res) => {
  try {
    const currentYear = new Date().getFullYear();
    const monthlyStats = [];

    for (let month = 1; month <= 12; month++) {
      const startDate = new Date(currentYear, month - 1, 1);
      const endDate = new Date(currentYear, month, 0);

      const eventCount = await Event.count({
        where: {
          createdAt: {
            [Op.between]: [startDate, endDate]
          }
        }
      });

      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
                         'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

      monthlyStats.push({
        month: monthNames[month - 1],
        events: eventCount
      });
    }

    res.json({
      success: true,
      data: monthlyStats
    });

  } catch (error) {
    console.error('Monthly events stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal mengambil statistik event bulanan'
    });
  }
};

// Get Monthly Participants Statistics
const getMonthlyParticipantsStats = async (req, res) => {
  try {
    const currentYear = new Date().getFullYear();
    const monthlyStats = [];

    for (let month = 1; month <= 12; month++) {
      const startDate = new Date(currentYear, month - 1, 1);
      const endDate = new Date(currentYear, month, 0);

      const participantCount = await EventRegistration.count({
        where: {
          status: 'confirmed',
          createdAt: {
            [Op.between]: [startDate, endDate]
          }
        }
      });

      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
                         'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

      monthlyStats.push({
        month: monthNames[month - 1],
        participants: participantCount
      });
    }

    res.json({
      success: true,
      data: monthlyStats
    });

  } catch (error) {
    console.error('Monthly participants stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal mengambil statistik peserta bulanan'
    });
  }
};

// Get Top 10 Events by Participants
const getTopEventsStats = async (req, res) => {
  try {
    const topEvents = await Event.findAll({
      attributes: [
        'id',
        'judul',
        [
          require('sequelize').literal(`(
            SELECT COUNT(*)
            FROM EventRegistrations as er
            WHERE er.event_id = Event.id
            AND er.status = 'confirmed'
          )`),
          'participantCount'
        ]
      ],
      order: [
        [require('sequelize').literal('participantCount'), 'DESC']
      ],
      limit: 10
    });

    const formattedData = topEvents.map(event => ({
      name: event.judul,
      participants: parseInt(event.dataValues.participantCount) || 0
    }));

    res.json({
      success: true,
      data: formattedData
    });

  } catch (error) {
    console.error('Top events stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal mengambil statistik top events'
    });
  }
};

// Get All Users for User Management
const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      where: {
        role: 'peserta'
      },
      attributes: ['id', 'nama_lengkap', 'email', 'no_handphone', 'alamat', 'pendidikan_terakhir', 'is_verified', 'createdAt'],
      order: [['createdAt', 'DESC']]
    });

    res.json({
      success: true,
      data: users
    });

  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal mengambil data pengguna'
    });
  }
};

// Get All Registrations for Registration Management
const getAllRegistrations = async (req, res) => {
  try {
    console.log('=== getAllRegistrations CALLED ===');
    console.log('Request URL:', req.originalUrl);
    console.log('Request method:', req.method);
    console.log('=== getAllRegistrations START ===');
    
    // Simplified query - just get basic registration data first
    const registrations = await EventRegistration.findAll({
      attributes: ['id', 'user_id', 'event_id', 'status', 'createdAt'],
      order: [['createdAt', 'DESC']],
      limit: 50 // Add limit to prevent overwhelming queries
    });

    console.log(`Found ${registrations.length} registrations`);

    if (registrations.length === 0) {
      return res.json({
        success: true,
        data: []
      });
    }

    // Get all user IDs and event IDs
    const userIds = [...new Set(registrations.map(r => r.user_id))];
    const eventIds = [...new Set(registrations.map(r => r.event_id))];

    console.log(`Fetching ${userIds.length} users and ${eventIds.length} events`);

    // Fetch users and events separately
    const [users, events] = await Promise.all([
      User.findAll({
        where: { id: userIds },
        attributes: ['id', 'nama_lengkap', 'email', 'no_handphone', 'alamat', 'pendidikan_terakhir']
      }),
      Event.findAll({
        where: { id: eventIds },
        attributes: ['id', 'judul', 'tanggal', 'waktu_mulai', 'waktu_selesai', 'lokasi', 'kategori', 'tingkat_kesulitan', 'deskripsi']
      })
    ]);

    // Create lookup maps
    const userMap = new Map(users.map(u => [u.id, u]));
    const eventMap = new Map(events.map(e => [e.id, e]));

    // Combine data
    const result = registrations.map(registration => ({
      id: registration.id,
      user_id: registration.user_id,
      event_id: registration.event_id,
      status: registration.status,
      createdAt: registration.createdAt,
      User: userMap.get(registration.user_id) || null,
      Event: eventMap.get(registration.event_id) || null,
      Attendance: null // Will be populated separately if needed
    }));

    console.log('=== getAllRegistrations SUCCESS ===');

    res.json({
      success: true,
      data: result
    });

  } catch (error) {
    console.error('=== getAllRegistrations ERROR ===', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({
      success: false,
      message: 'Gagal mengambil data pendaftaran',
      error: error.message
    });
  }
};

// Update Registration Status
const updateRegistrationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['pending', 'confirmed', 'cancelled'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Status tidak valid'
      });
    }

    const registration = await EventRegistration.findByPk(id);
    if (!registration) {
      return res.status(404).json({
        success: false,
        message: 'Pendaftaran tidak ditemukan'
      });
    }

    await registration.update({ status });

    // Create an attendance record if registration is confirmed
    if (status === 'confirmed') {
      const existingAttendance = await Attendance.findOne({
        where: { registration_id: registration.id }
      });

      if (!existingAttendance) {
        await Attendance.create({
          user_id: registration.user_id,
          event_id: registration.event_id,
          registration_id: registration.id,
          status: 'absent', // Default status
        });
      }
    }

    res.json({
      success: true,
      message: 'Status pendaftaran berhasil diperbarui'
    });

  } catch (error) {
    console.error('Update registration status error:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal memperbarui status pendaftaran'
    });
  }
};

// Update User Verification Status
const updateUserVerification = async (req, res) => {
  try {
    const { id } = req.params;
    const { is_verified } = req.body;

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Pengguna tidak ditemukan'
      });
    }

    await user.update({ is_verified });

    res.json({
      success: true,
      message: 'Status verifikasi pengguna berhasil diperbarui'
    });

  } catch (error) {
    console.error('Update user verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal memperbarui status verifikasi'
    });
  }
};

// Get All Attendances for Attendance Management
const getAllAttendances = async (req, res) => {
  try {
    const attendances = await Attendance.findAll({
      include: [
        {
          model: User,
          attributes: ['id', 'nama_lengkap', 'email'],
        },
        {
          model: Event,
          attributes: ['id', 'judul', 'tanggal'],
        },
      ],
      order: [['createdAt', 'DESC']],
    });

    res.json({
      success: true,
      data: attendances,
    });

  } catch (error) {
    console.error('Get all attendances error:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal mengambil data kehadiran',
      error: error.message,
    });
  }
};

// Update Attendance Status
const updateAttendanceStatus = async (req, res) => {
  try {
    const { id } = req.params; // This is the attendance ID
    const { status } = req.body;

    if (!['present', 'absent', 'late', 'excused'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Status kehadiran tidak valid',
      });
    }

    const attendance = await Attendance.findByPk(id);
    if (!attendance) {
      return res.status(404).json({
        success: false,
        message: 'Data kehadiran tidak ditemukan',
      });
    }

    const updateData = { status };
    if (status === 'present' && !attendance.check_in_time) {
        updateData.check_in_time = new Date();
    }

    await attendance.update(updateData);

    res.json({
      success: true,
      message: 'Status kehadiran berhasil diperbarui',
    });

  } catch (error) {
    console.error('Update attendance status error:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal memperbarui status kehadiran',
    });
  }
};

module.exports = {
  adminLogin,
  getDashboardOverview,
  getMonthlyEventsStats,
  getMonthlyParticipantsStats,
  getTopEventsStats,
  getAllUsers,
  getAllRegistrations,
  updateRegistrationStatus,
  updateUserVerification,
  getAllAttendances,
  updateAttendanceStatus
};
