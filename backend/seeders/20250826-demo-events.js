'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // First, create a demo admin user if not exists
    const [adminUser] = await queryInterface.bulkInsert('Users', [{
      nama_lengkap: 'Admin Demo',
      email: 'admin@demo.com',
      password: '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password: password
      no_handphone: '081234567890',
      alamat: 'Jakarta',
      pendidikan_terakhir: 'S1',
      is_verified: true,
      role: 'admin',
      createdAt: new Date(),
      updatedAt: new Date()
    }], { returning: true });

    const userId = adminUser?.id || 1;

    // Insert sample events
    await queryInterface.bulkInsert('Events', [
      {
        judul: 'Workshop Web Development dengan React',
        tanggal: '2025-09-15',
        waktu: '09:00:00',
        lokasi: 'Universitas Indonesia, Depok',
        flyer_url: null,
        sertifikat_template: null,
        deskripsi: 'Workshop intensif untuk mempelajari pengembangan web modern menggunakan React.js. Peserta akan belajar komponen, state management, dan best practices dalam pengembangan aplikasi web.',
        created_by: userId,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        judul: 'Seminar AI dan Machine Learning',
        tanggal: '2025-09-20',
        waktu: '13:00:00',
        lokasi: 'Institut Teknologi Bandung',
        flyer_url: null,
        sertifikat_template: null,
        deskripsi: 'Seminar tentang perkembangan terkini AI dan Machine Learning. Pembicara dari industri teknologi terkemuka akan berbagi pengalaman dan insight tentang implementasi AI.',
        created_by: userId,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        judul: 'Kompetisi Programming Contest',
        tanggal: '2025-09-25',
        waktu: '08:00:00',
        lokasi: 'Universitas Gadjah Mada, Yogyakarta',
        flyer_url: null,
        sertifikat_template: null,
        deskripsi: 'Kompetisi programming untuk mahasiswa se-Indonesia. Peserta akan menyelesaikan berbagai problem solving menggunakan algoritma dan struktur data.',
        created_by: userId,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        judul: 'Workshop Mobile App Development',
        tanggal: '2025-10-05',
        waktu: '10:00:00',
        lokasi: 'Universitas Bina Nusantara, Jakarta',
        flyer_url: null,
        sertifikat_template: null,
        deskripsi: 'Workshop pengembangan aplikasi mobile menggunakan React Native. Peserta akan belajar membuat aplikasi cross-platform untuk iOS dan Android.',
        created_by: userId,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        judul: 'Seminar Cybersecurity dan Data Protection',
        tanggal: '2025-10-10',
        waktu: '14:00:00',
        lokasi: 'Institut Teknologi Sepuluh Nopember, Surabaya',
        flyer_url: null,
        sertifikat_template: null,
        deskripsi: 'Seminar tentang keamanan siber dan perlindungan data. Membahas ancaman keamanan terkini dan strategi untuk melindungi sistem informasi.',
        created_by: userId,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Events', null, {});
    await queryInterface.bulkDelete('Users', {
      email: 'admin@demo.com'
    }, {});
  }
};
