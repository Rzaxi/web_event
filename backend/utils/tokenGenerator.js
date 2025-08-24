const crypto = require('crypto');

const generateVerificationToken = () => {
  return crypto.randomBytes(32).toString('hex');
};

const generateAttendanceToken = () => {
  // Generate 10-digit numeric token
  return Math.floor(1000000000 + Math.random() * 9000000000).toString();
};

const generateResetToken = () => {
  return crypto.randomBytes(32).toString('hex');
};

module.exports = {
  generateVerificationToken,
  generateAttendanceToken,
  generateResetToken
};
