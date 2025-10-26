const express = require('express');
const router = express.Router();
const organizerController = require('../controllers/organizerController');
const { authenticateToken } = require('../middleware/auth');

// Middleware to check if user is an event organizer
const checkOrganizerRole = (req, res, next) => {
  console.log('Checking organizer role for user:', req.user?.id, 'Role:', req.user?.role);
  
  if (!req.user) {
    return res.status(403).json({
      success: false,
      message: 'User not authenticated'
    });
  }

  const userRole = req.user.role || '';
  const isOrganizer = userRole.includes('event_organizer_basic') || 
                     userRole.includes('event_organizer_pro') ||
                     userRole === 'admin'; // Allow admin for testing

  if (!isOrganizer) {
    console.log('Access denied for role:', userRole);
    return res.status(403).json({
      success: false,
      message: 'Access denied. Event Organizer subscription required. Please upgrade your account.',
      currentRole: userRole
    });
  }
  
  console.log('Organizer role check passed');
  next();
};

// Apply authentication and role check to all routes
router.use(authenticateToken);
router.use(checkOrganizerRole);

// Dashboard routes
router.get('/dashboard', organizerController.getDashboardData);

// Events routes
router.get('/events', organizerController.getEvents);
router.post('/events', organizerController.createEvent);
router.put('/events/:id', organizerController.updateEvent);
router.delete('/events/:id', organizerController.deleteEvent);

// Participants routes
router.get('/participants', organizerController.getParticipants);

// Analytics routes
router.get('/analytics', organizerController.getAnalytics);

module.exports = router;
