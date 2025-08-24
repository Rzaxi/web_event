const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const { User, PasswordReset } = require('../models');
const { sendVerificationEmail, sendPasswordResetEmail } = require('../utils/emailService');
const { generateVerificationToken, generateResetToken } = require('../utils/tokenGenerator');

// Register new user
const register = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { nama_lengkap, email, no_handphone, alamat, pendidikan_terakhir, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'Email sudah terdaftar' });
    }

    // Hash password
    const saltRounds = 12;
    const password_hash = await bcrypt.hash(password, saltRounds);

    // Generate verification token
    const verification_token = generateVerificationToken();
    const verification_expiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // Create user
    const user = await User.create({
      nama_lengkap,
      email,
      no_handphone,
      alamat,
      pendidikan_terakhir,
      password_hash,
      verification_token,
      verification_expiry,
      is_verified: false,
      role: 'peserta'
    });

    // Send verification email
    try {
      await sendVerificationEmail(email, verification_token, nama_lengkap);
    } catch (emailError) {
      console.error('Failed to send verification email:', emailError);
      // Don't fail registration if email fails
    }

    res.status(201).json({
      message: 'Registrasi berhasil! Silakan cek email untuk verifikasi.',
      user: {
        id: user.id,
        nama_lengkap: user.nama_lengkap,
        email: user.email,
        is_verified: user.is_verified
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
};

// Verify email
const verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;
    console.log('Verifying token:', token);

    if (!token) {
      console.log('No token provided');
      return res.status(400).json({ message: 'Token verifikasi diperlukan' });
    }

    // Check if any user was previously verified with this token pattern
    // Look for users who might have had this token but are now verified
    const allUsers = await User.findAll({
      attributes: ['id', 'email', 'is_verified', 'verification_token', 'verification_expiry']
    });
    
    console.log('All users in database:', allUsers.length);
    
    // Don't assume - only return success if we can actually verify the specific user

    // First, check if any user has this exact token
    const userWithToken = await User.findOne({
      where: {
        verification_token: token
      }
    });

    console.log('User with exact token found:', userWithToken ? 'Yes' : 'No');
    if (userWithToken) {
      console.log('User email:', userWithToken.email);
      console.log('Token expiry:', userWithToken.verification_expiry);
      console.log('Current time:', new Date());
      console.log('Is verified:', userWithToken.is_verified);
      
      // Check if already verified
      if (userWithToken.is_verified) {
        return res.json({ message: 'Email sudah diverifikasi sebelumnya. Anda dapat login sekarang!' });
      }
      
      // Check if expired
      if (userWithToken.verification_expiry && new Date() > userWithToken.verification_expiry) {
        return res.status(400).json({ message: 'Token sudah kedaluwarsa. Silakan minta token baru.' });
      }
      
      // Token is valid and not expired, verify the user
      console.log('Updating user verification status...');
      await userWithToken.update({
        is_verified: true,
        verification_token: null,
        verification_expiry: null
      });

      console.log('Email verification successful');
      return res.json({ message: 'Email berhasil diverifikasi!' });
    }

    console.log('Token not found in database');
    return res.status(400).json({ message: 'Token tidak valid atau sudah kedaluwarsa' });
    
  } catch (error) {
    console.error('Email verification error:', error);
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
};

// Login
const login = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: 'Email atau password salah' });
    }

    // Check if email is verified
    if (!user.is_verified) {
      return res.status(401).json({ message: 'Email belum diverifikasi' });
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Email atau password salah' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Set session
    req.session.userId = user.id;
    req.session.lastActivity = Date.now();

    res.json({
      message: 'Login berhasil',
      token,
      user: {
        id: user.id,
        nama_lengkap: user.nama_lengkap,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
};

// Logout
const logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: 'Gagal logout' });
    }
    res.json({ message: 'Logout berhasil' });
  });
};

// Request password reset
const requestPasswordReset = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) {
      // Don't reveal if email exists or not
      return res.json({ message: 'Jika email terdaftar, link reset password akan dikirim' });
    }

    // Generate reset token
    const reset_token = generateResetToken();
    const reset_expiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    // Save reset token
    await PasswordReset.create({
      user_id: user.id,
      reset_token,
      reset_expiry
    });

    // Send reset email
    try {
      await sendPasswordResetEmail(email, reset_token, user.nama_lengkap);
    } catch (emailError) {
      console.error('Failed to send reset email:', emailError);
    }

    res.json({ message: 'Jika email terdaftar, link reset password akan dikirim' });
  } catch (error) {
    console.error('Password reset request error:', error);
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
};

// Confirm password reset
const confirmPasswordReset = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({ message: 'Token dan password baru diperlukan' });
    }

    // Find valid reset token
    const resetRecord = await PasswordReset.findOne({
      where: {
        reset_token: token,
        reset_expiry: {
          [require('sequelize').Op.gt]: new Date()
        }
      },
      include: [User]
    });

    if (!resetRecord) {
      return res.status(400).json({ message: 'Token tidak valid atau sudah kedaluwarsa' });
    }

    // Hash new password
    const saltRounds = 12;
    const password_hash = await bcrypt.hash(newPassword, saltRounds);

    // Update user password
    await resetRecord.User.update({ password_hash });

    // Delete reset token
    await resetRecord.destroy();

    res.json({ message: 'Password berhasil direset' });
  } catch (error) {
    console.error('Password reset confirmation error:', error);
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
};

// Get user history
const getUserHistory = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findByPk(userId, {
      include: [{
        model: require('../models').EventRegistration,
        include: [{
          model: require('../models').Event,
          attributes: ['id', 'judul', 'tanggal', 'waktu', 'lokasi']
        }]
      }]
    });

    const history = user.EventRegistrations.map(registration => ({
      event: registration.Event,
      registered_at: registration.createdAt,
      sertifikat_url: registration.sertifikat_url
    }));

    res.json({ history });
  } catch (error) {
    console.error('Get user history error:', error);
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
};

// Validation rules
const registerValidation = [
  body('nama_lengkap').notEmpty().withMessage('Nama lengkap diperlukan'),
  body('email').isEmail().withMessage('Email tidak valid'),
  body('no_handphone').notEmpty().withMessage('Nomor handphone diperlukan'),
  body('password').isLength({ min: 6 }).withMessage('Password minimal 6 karakter')
];

const loginValidation = [
  body('email').isEmail().withMessage('Email tidak valid'),
  body('password').notEmpty().withMessage('Password diperlukan')
];

// Get user profile
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: ['id', 'nama_lengkap', 'email', 'no_handphone', 'alamat', 'pendidikan_terakhir', 'role', 'is_verified', 'createdAt']
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update user profile
const updateUserProfile = async (req, res) => {
  try {
    const { nama_lengkap, email, no_handphone, alamat, pendidikan_terakhir } = req.body;

    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if email is already taken by another user
    if (email && email !== user.email) {
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return res.status(400).json({ message: 'Email already in use' });
      }
    }

    await user.update({
      nama_lengkap: nama_lengkap || user.nama_lengkap,
      email: email || user.email,
      no_handphone: no_handphone || user.no_handphone,
      alamat: alamat || user.alamat,
      pendidikan_terakhir: pendidikan_terakhir || user.pendidikan_terakhir
    });

    res.json({
      message: 'Profile updated successfully',
      user: {
        id: user.id,
        nama_lengkap: user.nama_lengkap,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Debug endpoint to check all users and their tokens
const debugUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ['id', 'email', 'verification_token', 'verification_expiry', 'is_verified'],
      order: [['createdAt', 'DESC']],
      limit: 10
    });
    
    console.log('All users with tokens:', JSON.stringify(users, null, 2));
    res.json({ users });
  } catch (error) {
    console.error('Debug users error:', error);
    res.status(500).json({ message: 'Error fetching users' });
  }
};

// Force verify user by email (for fixing broken verification)
const forceVerifyUser = async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ message: 'Email diperlukan' });
    }

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: 'User tidak ditemukan' });
    }

    if (user.is_verified) {
      return res.json({ message: 'User sudah verified' });
    }

    await user.update({
      is_verified: true,
      verification_token: null,
      verification_expiry: null
    });

    console.log('Force verified user:', email);
    res.json({ message: 'User berhasil diverifikasi secara manual!' });
  } catch (error) {
    console.error('Force verify error:', error);
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
};

// Check user verification status by email
const checkVerificationStatus = async (req, res) => {
  try {
    const { email } = req.query;
    
    if (!email) {
      return res.status(400).json({ message: 'Email diperlukan' });
    }

    const user = await User.findOne({ 
      where: { email },
      attributes: ['id', 'email', 'is_verified', 'verification_token', 'verification_expiry']
    });
    
    if (!user) {
      return res.status(404).json({ message: 'User tidak ditemukan' });
    }

    res.json({ 
      email: user.email,
      is_verified: user.is_verified,
      has_token: !!user.verification_token,
      token_expired: user.verification_expiry ? new Date() > user.verification_expiry : null
    });
  } catch (error) {
    console.error('Check verification status error:', error);
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
};

// Generate new verification token for existing user
const generateNewToken = async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ message: 'Email diperlukan' });
    }

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: 'User tidak ditemukan' });
    }

    if (user.is_verified) {
      return res.status(400).json({ message: 'Email sudah diverifikasi' });
    }

    // Generate new token
    const verification_token = generateVerificationToken();
    const verification_expiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    await user.update({
      verification_token,
      verification_expiry
    });

    console.log('New token generated:', verification_token);
    console.log('For user:', email);

    // Send verification email
    try {
      await sendVerificationEmail(email, verification_token, user.nama_lengkap);
    } catch (emailError) {
      console.error('Failed to send verification email:', emailError);
    }

    res.json({ 
      message: 'Token verifikasi baru telah dikirim ke email Anda',
      token: verification_token // For debugging - remove in production
    });
  } catch (error) {
    console.error('Generate new token error:', error);
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
};

module.exports = {
  register,
  verifyEmail,
  login,
  logout,
  requestPasswordReset,
  confirmPasswordReset,
  getUserHistory,
  getUserProfile,
  updateUserProfile,
  registerValidation,
  loginValidation,
  debugUsers,
  generateNewToken,
  forceVerifyUser,
  checkVerificationStatus
};