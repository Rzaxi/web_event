const express = require('express');
const router = express.Router();

// Import controllers
const authController = require('../controllers/authController');
const eventController = require('../controllers/eventController');
const eventRegistrationController = require('../controllers/eventRegistrationController');
const dashboardController = require('../controllers/dashboardController');

// Import middleware
const { authenticateToken, requireAdmin, sessionTimeout } = require('../middleware/auth');
const upload = require('../middleware/upload');

// Auth routes (no authentication required)
router.post('/auth/register', authController.registerValidation, authController.register);
router.get('/auth/verify-email/:token', authController.verifyEmail);
router.post('/auth/login', authController.loginValidation, authController.login);
router.post('/auth/logout', authController.logout);
router.post('/auth/forgot-password', authController.requestPasswordReset);
router.post('/auth/reset-password', authController.confirmPasswordReset);
router.get('/debug/users', authController.debugUsers);
router.post('/auth/generate-token', authController.generateNewToken);
router.post('/auth/force-verify', authController.forceVerifyUser);
router.get('/auth/check-status', authController.checkVerificationStatus);

// Public event routes (no authentication required)
router.get('/events', eventController.getEvents);
router.get('/events/:id', eventController.getEventById);

// Protected routes (require authentication)
router.use(authenticateToken);
router.use(sessionTimeout);

// User routes
router.get('/users/profile', authController.getUserProfile);
router.put('/users/profile', authController.updateUserProfile);
router.get('/users/events', authController.getUserHistory);

// Event registration routes
router.post('/events/:id/register', eventRegistrationController.registerForEvent);
router.delete('/events/:id/register', eventRegistrationController.cancelRegistration);
router.get('/events/:id/registrations', eventRegistrationController.getEventRegistrations);

// Admin only routes
router.use(requireAdmin);

// Event management (admin only)
router.post('/events', upload.single('flyer'), eventController.eventValidation, eventController.createEvent);
router.put('/events/:id', upload.single('flyer'), eventController.eventValidation, eventController.updateEvent);
router.delete('/events/:id', eventController.deleteEvent);

// Export routes (admin only)
router.get('/dashboard/export/events', eventController.exportEvents);
router.get('/dashboard/export/participants/:eventId', eventController.exportEventParticipants);

// Certificate issuance (admin only)
router.post('/events/:id/issue-certificates', eventController.issueCertificates);

// Dashboard routes (admin only)
router.get('/dashboard/stats', dashboardController.getDashboardStatistics);

module.exports = router;
