const jwt = require('jsonwebtoken');
const { User } = require('../models');

const adminAuth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    console.log('Admin auth - Token received:', token ? 'Yes' : 'No');
    console.log('Admin auth - Token value:', token);

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.'
      });
    }

    // For development, accept hardcoded admin token
    if (token === 'admin-token-123') {
      console.log('Admin auth - Using hardcoded token');
      req.user = {
        id: 1,
        username: 'admin',
        role: 'admin'
      };
      return next();
    }

    // Try to verify JWT token
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
      console.log('Admin auth - JWT decoded:', decoded);
      
      // Check if user is admin
      if (decoded.role !== 'admin') {
        console.log('Admin auth - User role is not admin:', decoded.role);
        return res.status(403).json({
          success: false,
          message: 'Access denied. Admin privileges required.'
        });
      }

      req.user = decoded;
      return next();

    } catch (jwtError) {
      console.log('Admin auth - JWT verification failed:', jwtError.message);
      return res.status(401).json({
        success: false,
        message: 'Invalid token.'
      });
    }

  } catch (error) {
    console.error('Admin auth error:', error);
    res.status(401).json({
      success: false,
      message: 'Invalid token.'
    });
  }
};

module.exports = adminAuth;
