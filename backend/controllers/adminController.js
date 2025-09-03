const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User, Event, EventRegistration } = require('../models');
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
    
    const activeEvents = await Event.count({
      where: {
        tanggal: {
          [Op.gte]: new Date()
        }
      }
    });

    const completedEvents = await Event.count({
      where: {
        tanggal: {
          [Op.lt]: new Date()
        }
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

module.exports = {
  adminLogin,
  getDashboardOverview,
  getMonthlyEventsStats,
  getMonthlyParticipantsStats,
  getTopEventsStats
};
