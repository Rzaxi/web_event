const crypto = require('crypto');

/**
 * Generate a 10-digit numeric attendance token
 * @returns {string} 10-digit numeric token
 */
const generateAttendanceToken = () => {
  // Generate a random number between 1000000000 and 9999999999 (10 digits)
  const min = 1000000000;
  const max = 9999999999;
  const token = Math.floor(Math.random() * (max - min + 1)) + min;
  return token.toString();
};

/**
 * Generate a cryptographically secure 10-digit numeric token
 * Alternative method using crypto for better security
 * @returns {string} 10-digit numeric token
 */
const generateSecureAttendanceToken = () => {
  let token = '';
  while (token.length < 10) {
    const randomBytes = crypto.randomBytes(4);
    const randomNumber = randomBytes.readUInt32BE(0);
    token += randomNumber.toString();
  }
  // Take first 10 digits and ensure it doesn't start with 0
  token = token.substring(0, 10);
  if (token.charAt(0) === '0') {
    token = '1' + token.substring(1);
  }
  return token;
};

module.exports = {
  generateAttendanceToken,
  generateSecureAttendanceToken
};
