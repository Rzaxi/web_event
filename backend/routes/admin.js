const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Controllers
const {
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
} = require('../controllers/adminController');

const {
  getAllEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  getEventParticipants,
  getAllParticipants,
  getEventOptions
} = require('../controllers/adminEventController');

const {
  checkCertificateEligibility,
  markDailyAttendance,
  getEventAttendanceSummary,
  issueCertificatesForEvent
} = require('../controllers/certificateController');

// Middleware
const adminAuth = require('../middleware/adminAuth');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '../public/uploads/flyers');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'flyer-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only JPG, JPEG, and PNG files are allowed'));
    }
  }
});

// Debug middleware
router.use((req, res, next) => {
  console.log(`Admin route accessed: ${req.method} ${req.path}`);
  console.log('Request headers:', req.headers);
  next();
});

// Test endpoint
router.get('/test', (req, res) => {
  console.log('Test endpoint accessed successfully!');
  res.json({ message: 'Admin route is working!' });
});

// Authentication Routes
router.post('/login', express.json(), adminLogin);

// Dashboard Statistics Routes (Protected)
router.get('/statistics/overview', adminAuth, getDashboardOverview);
router.get('/statistics/monthly-events', adminAuth, getMonthlyEventsStats);
router.get('/statistics/monthly-participants', adminAuth, getMonthlyParticipantsStats);
router.get('/statistics/top-events', adminAuth, getTopEventsStats);

// Event Management Routes (Protected)
router.get('/events', adminAuth, getAllEvents);
router.get('/events/options', adminAuth, getEventOptions);
router.get('/events/:id', adminAuth, getEventById);
router.post('/events', adminAuth, upload.single('flyer'), createEvent);
router.put('/events/:id', adminAuth, upload.single('flyer'), updateEvent);
router.delete('/events/:id', adminAuth, deleteEvent);

// Participant Management Routes (Protected)
router.get('/events/:id/participants', adminAuth, getEventParticipants);
router.get('/participants/export', adminAuth, getAllParticipants);
router.put('/registrations/:id/status', adminAuth, require('../controllers/adminParticipantController').updateRegistrationStatus);
router.put('/registrations/bulk-status', adminAuth, require('../controllers/adminParticipantController').bulkUpdateStatus);

// User Management Routes (Protected)
router.get('/users', adminAuth, getAllUsers);
router.put('/users/:id/verification', adminAuth, updateUserVerification);

// Registration Management Routes (Protected)
router.get('/registrations', (req, res, next) => {
  console.log('=== ROUTE /admin/registrations HIT ===');
  console.log('Full URL:', req.originalUrl);
  console.log('Method:', req.method);
  next();
}, adminAuth, getAllRegistrations);
router.put('/registrations/:id/status', adminAuth, updateRegistrationStatus);

module.exports = router;
