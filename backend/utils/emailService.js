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

// Send attendance token email during event registration
const sendAttendanceTokenEmail = async (email, name, eventTitle, attendanceToken) => {
  try {
    // Check if name is temporary or empty
    const isTemporaryName = !name || 
      name.toLowerCase().includes('temporary') || 
      name.toLowerCase().includes('temp') || 
      name.toLowerCase().includes('placeholder') ||
      name.trim() === '';

    const greeting = isTemporaryName ? 'Halo!' : `Halo ${name}!`;

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: `Token Kehadiran - ${eventTitle}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
          <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #2563eb; margin: 0; font-size: 24px;">🎫 Token Kehadiran Event</h1>
            </div>
            
            <p style="color: #374151; font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
              ${greeting}
            </p>
            
            <p style="color: #374151; font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
              Selamat! Anda telah berhasil mendaftar untuk event <strong>${eventTitle}</strong>.
            </p>
            
            <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 25px 0; text-align: center;">
              <p style="color: #374151; font-size: 14px; margin-bottom: 10px;">
                <strong>Token Kehadiran Anda:</strong>
              </p>
              <div style="background-color: #2563eb; color: white; padding: 15px; border-radius: 6px; font-size: 24px; font-weight: bold; letter-spacing: 2px; font-family: 'Courier New', monospace;">
                ${attendanceToken}
              </div>
            </div>
            
            <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0;">
              <p style="color: #92400e; font-size: 14px; margin: 0; line-height: 1.5;">
                <strong>⚠️ Penting:</strong><br>
                • Simpan token ini dengan baik<br>
                • Token diperlukan untuk mengisi daftar hadir<br>
                • Tombol daftar hadir akan aktif setelah event dimulai<br>
                • Token hanya berlaku untuk event ini
              </p>
            </div>
            
            <p style="color: #6b7280; font-size: 14px; line-height: 1.6; margin-top: 30px;">
              Jika Anda memiliki pertanyaan, silakan hubungi tim support kami.
            </p>
            
            <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
              <p style="color: #9ca3af; font-size: 12px; margin: 0;">
                Email ini dikirim secara otomatis, mohon tidak membalas email ini.
              </p>
            </div>
          </div>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log('Attendance token email sent successfully to:', email);
  } catch (error) {
    console.error('Error sending attendance token email:', error);
    throw error;
  }
};

module.exports = {
  sendVerificationEmail,
  sendAttendanceTokenEmail: sendAttendanceToken,
  sendPasswordResetEmail,
  sendAttendanceTokenEmail
};
