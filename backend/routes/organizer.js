const express = require('express');
const router = express.Router();
<<<<<<< HEAD
const multer = require('multer');
const path = require('path');
const organizerController = require('../controllers/organizerController');
const { authenticateToken } = require('../middleware/auth');

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (file.fieldname === 'flyer') {
      cb(null, 'uploads/flyers/');
    } else if (file.fieldname === 'certificate_template') {
      cb(null, 'uploads/certificates/');
    }
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB max
  fileFilter: function (req, file, cb) {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'));
    }
  }
});

// Middleware to check if user is an event organizer
const checkOrganizerRole = (req, res, next) => {
  console.log('=== ORGANIZER ROLE CHECK ===');
  console.log('User ID:', req.user?.id);
  console.log('User Role:', req.user?.role);
  console.log('User Email:', req.user?.email);
  console.log('Full User Object:', JSON.stringify(req.user, null, 2));
  
  if (!req.user) {
    console.log('❌ User not authenticated');
=======
const organizerController = require('../controllers/organizerController');
const { authenticateToken } = require('../middleware/auth');

// Middleware to check if user is an event organizer
const checkOrganizerRole = (req, res, next) => {
  console.log('Checking organizer role for user:', req.user?.id, 'Role:', req.user?.role);
  
  if (!req.user) {
>>>>>>> 2abfda7ee534c6e755ec7078e95159ca67f32216
    return res.status(403).json({
      success: false,
      message: 'User not authenticated'
    });
  }

  const userRole = req.user.role || '';
<<<<<<< HEAD
  console.log('Processing role:', userRole);
  
  const isOrganizer = userRole.includes('event_organizer') || // Allow all event_organizer variants
                     userRole === 'admin'; // Allow admin for testing

  console.log('Is organizer check result:', isOrganizer);
  console.log('Role includes event_organizer:', userRole.includes('event_organizer'));
  console.log('Role is admin:', userRole === 'admin');

  if (!isOrganizer) {
    console.log('❌ Access denied for role:', userRole);
=======
  const isOrganizer = userRole.includes('event_organizer_basic') || 
                     userRole.includes('event_organizer_pro') ||
                     userRole === 'admin'; // Allow admin for testing

  if (!isOrganizer) {
    console.log('Access denied for role:', userRole);
>>>>>>> 2abfda7ee534c6e755ec7078e95159ca67f32216
    return res.status(403).json({
      success: false,
      message: 'Access denied. Event Organizer subscription required. Please upgrade your account.',
      currentRole: userRole
    });
  }
  
<<<<<<< HEAD
  console.log('✅ Organizer role check passed');
=======
  console.log('Organizer role check passed');
>>>>>>> 2abfda7ee534c6e755ec7078e95159ca67f32216
  next();
};

// Apply authentication and role check to all routes
router.use(authenticateToken);
router.use(checkOrganizerRole);

// Dashboard routes
router.get('/dashboard', organizerController.getDashboardData);

<<<<<<< HEAD
// Event management routes
router.get('/events', organizerController.getEvents);
router.get('/events/:id', organizerController.getEventById);
router.post('/events', upload.fields([
  { name: 'flyer', maxCount: 1 },
  { name: 'certificate_template', maxCount: 1 }
]), organizerController.createEvent);
router.put('/events/:id', upload.fields([
  { name: 'flyer', maxCount: 1 },
  { name: 'certificate_template', maxCount: 1 }
]), organizerController.updateEvent);
=======
// Events routes
router.get('/events', organizerController.getEvents);
router.post('/events', organizerController.createEvent);
router.put('/events/:id', organizerController.updateEvent);
>>>>>>> 2abfda7ee534c6e755ec7078e95159ca67f32216
router.delete('/events/:id', organizerController.deleteEvent);

// Participants routes
router.get('/participants', organizerController.getParticipants);

// Analytics routes
router.get('/analytics', organizerController.getAnalytics);
<<<<<<< HEAD
router.get('/analytics/export', organizerController.exportAnalytics);

// Attendance routes
router.get('/events/:eventId/participants', organizerController.getEventParticipants);
router.post('/attendance/scan', organizerController.scanAttendance);

// Certificate routes
const certificateController = require('../controllers/certificateController');
// Temporarily comment out to test
// const ticketCategoryController = require('../controllers/ticketCategoryController');
router.post('/certificates/template', certificateController.saveCertificateTemplate);
router.get('/certificates/templates', certificateController.getCertificateTemplates);
router.get('/certificates/template/:eventId', certificateController.getCertificateTemplate);
router.get('/certificates/eligible/:eventId', certificateController.getEligibleParticipants);
router.post('/certificates/issue/:eventId/:participantId', certificateController.issueCertificate);
router.post('/certificates/generate/:eventId/:participantId', certificateController.generateCertificate);

// Certificate Management (New)
router.get('/certificates/events', certificateController.getOrganizerEventsWithCertificates);
router.get('/certificates/events/:eventId/participants', certificateController.getEligibleParticipantsForEvent);
router.post('/certificates/events/:eventId/bulk-generate', certificateController.bulkGenerateCertificates);

// Debug endpoint
router.get('/certificates/debug', certificateController.debugCertificates);

// Fix certificate data endpoint
router.post('/certificates/fix', certificateController.fixCertificateData);

// Ticket Category Management routes - TEMPORARILY DISABLED
/*
router.get('/events/:eventId/ticket-categories', ticketCategoryController.getEventTicketCategories);
router.post('/events/:eventId/ticket-categories', ticketCategoryController.createTicketCategory);
router.put('/events/:eventId/ticket-categories/:categoryId', ticketCategoryController.updateTicketCategory);
router.delete('/events/:eventId/ticket-categories/:categoryId', ticketCategoryController.deleteTicketCategory);
*/
=======
>>>>>>> 2abfda7ee534c6e755ec7078e95159ca67f32216

module.exports = router;
