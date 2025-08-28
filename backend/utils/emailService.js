const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail', // You can change this to your preferred email service
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const sendVerificationEmail = async (email, token, name) => {
  // Use localhost for development to avoid IP address issues
  const baseUrl = process.env.NODE_ENV === 'production' 
    ? process.env.FRONTEND_URL 
    : 'http://localhost:3001';
  const verificationUrl = `${baseUrl}/verify-email/${token}`;
  
  // Check if name is temporary/placeholder and use generic greeting
  const isTemporaryName = !name || 
    name.toLowerCase().includes('temporary') || 
    name.toLowerCase().includes('temp') || 
    name.toLowerCase().includes('placeholder') ||
    name.trim() === '';
  
  const greeting = isTemporaryName ? 'Halo!' : `Halo ${name}!`;
  
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Verifikasi Email - Sistem Manajemen Event',
    html: `
      <h2>${greeting}</h2>
      <p>Terima kasih telah mendaftar di Sistem Manajemen Event Sekolah.</p>
      <p>Silakan klik link di bawah ini untuk memverifikasi email Anda:</p>
      <a href="${verificationUrl}" style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Verifikasi Email</a>
      <p>Atau copy paste link ini ke browser: <br><code>${verificationUrl}</code></p>
      <p>Link ini akan kedaluwarsa dalam 24 jam.</p>
      <p>Jika Anda tidak mendaftar untuk akun ini, abaikan email ini.</p>
    `
  };

  return transporter.sendMail(mailOptions);
};

const sendAttendanceToken = async (email, token, eventTitle, name) => {
  // Check if name is temporary/placeholder and use generic greeting
  const isTemporaryName = !name || 
    name.toLowerCase().includes('temporary') || 
    name.toLowerCase().includes('temp') || 
    name.toLowerCase().includes('placeholder') ||
    name.trim() === '';
  
  const greeting = isTemporaryName ? 'Halo!' : `Halo ${name}!`;
  
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: `Token Absensi - ${eventTitle}`,
    html: `
      <h2>${greeting}</h2>
      <p>Anda telah berhasil mendaftar untuk event: <strong>${eventTitle}</strong></p>
      <p>Token absensi Anda adalah:</p>
      <h1 style="background-color: #f0f0f0; padding: 20px; text-align: center; font-family: monospace; letter-spacing: 3px;">${token}</h1>
      <p>Gunakan token ini untuk melakukan absensi pada saat event berlangsung.</p>
      <p>Simpan email ini dengan baik!</p>
    `
  };

  return transporter.sendMail(mailOptions);
};

const sendPasswordResetEmail = async (email, token, name) => {
  // Use localhost for development to avoid IP address issues
  const baseUrl = process.env.NODE_ENV === 'production' 
    ? process.env.FRONTEND_URL 
    : 'http://localhost:3001';
  const resetUrl = `${baseUrl}/reset-password?token=${token}`;
  
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Reset Password - Sistem Manajemen Event',
    html: `
      <h2>Halo!!</h2>
      <p>Anda telah meminta untuk mereset password akun Anda.</p>
      <p>Silakan klik link di bawah ini untuk mereset password:</p>
      <a href="${resetUrl}" style="background-color: #ff6b6b; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Reset Password</a>
      <p>Atau copy paste link ini ke browser: <br><code>${resetUrl}</code></p>
      <p>Link ini akan kedaluwarsa dalam 1 jam.</p>
      <p>Jika Anda tidak meminta reset password, abaikan email ini.</p>
    `
  };

  return transporter.sendMail(mailOptions);
};

module.exports = {
  sendVerificationEmail,
  sendAttendanceToken,
  sendPasswordResetEmail
};
