const express = require('express');
const router = express.Router();

// Import controllers
const authController = require('../controllers/authController');
const eventController = require('../controllers/eventController');
const eventRegistrationController = require('../controllers/eventRegistrationController');
const userController = require('../controllers/userController');
const certificateController = require('../controllers/certificateController');
const dashboardController = require('../controllers/dashboardController');
const bookmarkController = require('../controllers/bookmarkController');
const notificationController = require('../controllers/notificationController');
<<<<<<< HEAD
// Temporarily comment out to test
// const ticketCategoryController = require('../controllers/ticketCategoryController');
=======
>>>>>>> 2abfda7ee534c6e755ec7078e95159ca67f32216

// Import middleware
const { authenticateToken, requireAdmin, sessionTimeout, optionalAuth } = require('../middleware/auth');
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

// Public event routes (optional authentication to check registration status)
router.get('/events', eventController.getEvents);
router.get('/events/:id', optionalAuth, eventController.getEventById);
<<<<<<< HEAD
// Temporarily comment out
// router.get('/events/:eventId/ticket-categories', ticketCategoryController.getEventTicketCategories);
=======
>>>>>>> 2abfda7ee534c6e755ec7078e95159ca67f32216

// Protected routes (require authentication)
router.use(authenticateToken);
router.use(sessionTimeout);

// User routes
router.get('/users/profile', authController.getUserProfile);
router.put('/users/profile', authController.updateUserProfile);
router.put('/users/change-password', authController.changePassword);
router.get('/users/events', authController.getUserHistory);
router.get('/users/events/:id', eventController.getEventById); // Event detail with registration status

// Certificate routes for logged-in user
<<<<<<< HEAD
router.get('/users/certificates', certificateController.getUserCertificates);
router.get('/certificates/:certificateId/download', certificateController.downloadCertificate);
=======
>>>>>>> 2abfda7ee534c6e755ec7078e95159ca67f32216
router.get('/events/:eventId/certificate-eligibility', userController.getCertificateEligibility);
router.get('/events/:eventId/certificate/download', userController.downloadCertificate);

// Event registration routes
router.post('/events/:id/register', eventController.registerForEvent);
router.delete('/events/:id/register', eventController.unregisterFromEvent);
router.get('/events/:id/registrations', eventRegistrationController.getEventRegistrations);
<<<<<<< HEAD
router.get('/events/:id/attendance-token', eventController.getUserAttendanceToken);
=======
>>>>>>> 2abfda7ee534c6e755ec7078e95159ca67f32216

// Bookmark routes (require authentication)
router.post('/bookmarks/:eventId/toggle', bookmarkController.toggleBookmark);
router.get('/bookmarks', bookmarkController.getUserBookmarks);
router.get('/bookmarks/:eventId/check', bookmarkController.checkBookmark);
router.delete('/bookmarks/:eventId', bookmarkController.removeBookmark);

// Notification routes (require authentication)
router.get('/notifications', notificationController.getNotifications);
router.get('/notifications/unread-count', notificationController.getUnreadCount);
router.put('/notifications/:id/read', notificationController.markAsRead);
router.put('/notifications/mark-all-read', notificationController.markAllAsRead);
router.delete('/notifications/:id', notificationController.deleteNotification);
router.delete('/notifications/clear-all', notificationController.clearAll);

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

// Admin: check a user's certificate eligibility
router.get('/admin/events/:eventId/users/:userId/certificate-eligibility', certificateController.checkCertificateEligibility);

// Dashboard routes (admin only)
router.get('/dashboard/stats', dashboardController.getDashboardStatistics);

module.exports = router;
