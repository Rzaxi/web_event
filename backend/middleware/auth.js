const jwt = require('jsonwebtoken');
const { User } = require('../models');

const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findByPk(decoded.userId);
    
    if (!user) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    req.user = user;
    next();
  } catch (error) {
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
    const fiveMinutes = 5 * 60 * 1000; // 5 minutes in milliseconds

    if (timeDiff > fiveMinutes) {
      req.session.destroy();
      return res.status(401).json({ message: 'Session expired due to inactivity' });
    }
  }
  
  req.session.lastActivity = Date.now();
  next();
};

module.exports = {
  authenticateToken,
  requireAdmin,
  sessionTimeout
};
