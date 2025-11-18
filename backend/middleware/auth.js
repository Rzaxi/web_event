const jwt = require('jsonwebtoken');
const { User } = require('../models');

const authenticateToken = async (req, res, next) => {
  console.log('=== AUTHENTICATION CHECK ===');
  console.log('Request URL:', req.originalUrl);
  console.log('Request Method:', req.method);
  
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  console.log('Auth Header:', authHeader ? 'Present' : 'Missing');
  console.log('Token:', token ? `${token.substring(0, 20)}...` : 'Missing');

  if (!token) {
    console.log('❌ No token provided');
    return res.status(401).json({ message: 'Access token required' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Token decoded successfully:', { userId: decoded.userId, email: decoded.email, role: decoded.role });
    
    const user = await User.findByPk(decoded.userId);
    console.log('User found in DB:', user ? { id: user.id, email: user.email, role: user.role } : 'Not found');
    
    if (!user) {
      console.log('❌ User not found in database');
      return res.status(401).json({ message: 'Invalid token' });
    }

    req.user = user;
    console.log('✅ Authentication successful');
    next();
  } catch (error) {
    console.log('❌ Token verification failed:', error.message);
    return res.status(403).json({ message: 'Invalid or expired token' });
  }
};

const requireAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' });
  }
  next();
};

const sessionTimeout = (req, res, next) => {
  if (req.session.lastActivity) {
    const now = Date.now();
    const timeDiff = now - req.session.lastActivity;
    const thirtyMinutes = 30 * 60 * 1000; // 30 minutes in milliseconds

    if (timeDiff > thirtyMinutes) {
      req.session.destroy();
      return res.status(401).json({ message: 'Session expired due to inactivity' });
    }
  }
  
  req.session.lastActivity = Date.now();
  next();
};

// Optional authentication - doesn't fail if no token
const optionalAuth = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    // No token, continue without user
    return next();
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findByPk(decoded.userId);
    
    if (user) {
      req.user = user;
    }
  } catch (error) {
    // Invalid token, continue without user
    console.error('Optional auth error:', error.message);
  }
  
  next();
};

module.exports = {
  authenticateToken,
  requireAdmin,
  sessionTimeout,
  optionalAuth
};
