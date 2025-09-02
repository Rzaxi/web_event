'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Events', [
      {
        judul: 'Workshop Web Development Modern',
        tanggal: '2025-09-03',
        waktu: '09:00:00',
        lokasi: 'Lab Komputer A',
        deskripsi: 'Kompetisi futsal seru antar kelas untuk mempererat tali persaudaraan dan sportivitas. Hadiah menarik menanti para juara!',
        flyer_url: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&h=600&fit=crop&crop=center',
        sertifikat_template: null,
        kategori: 'teknologi',
        tingkat_kesulitan: 'menengah',
        kapasitas_peserta: 30,
        biaya: 0.00,
        status_event: 'published',
        created_by: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        judul: 'Turnamen Futsal Antar Kelas',
        tanggal: '2025-09-04',
        waktu: '14:00:00',
        lokasi: 'Lapangan Futsal Sekolah',
        deskripsi: 'Kompetisi futsal seru antar kelas untuk mempererat tali persaudaraan dan sportivitas. Hadiah menarik menanti para juara!',
        flyer_url: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&h=600&fit=crop&crop=center',
        sertifikat_template: null,
        kategori: 'olahraga',
        tingkat_kesulitan: 'pemula',
        kapasitas_peserta: 80,
        biaya: 25000.00,
        status_event: 'published',
        created_by: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        judul: 'Seminar Karir & Entrepreneurship',
        tanggal: '2025-09-05',
        waktu: '10:00:00',
        lokasi: 'Aula Utama',
        deskripsi: 'Seminar inspiratif tentang perencanaan karir dan kewirausahaan bersama praktisi industri dan entrepreneur sukses.',
        flyer_url: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&h=600&fit=crop&crop=center',
        sertifikat_template: null,
        kategori: 'akademik',
        tingkat_kesulitan: 'pemula',
        kapasitas_peserta: 150,
        biaya: 0.00,
        status_event: 'published',
        created_by: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        judul: 'Festival Seni & Budaya',
        tanggal: '2025-09-06',
        waktu: '08:00:00',
        lokasi: 'Gedung Serbaguna',
        deskripsi: 'Perayaan seni dan budaya Indonesia dengan berbagai pertunjukan tari, musik, dan pameran karya seni siswa.',
        flyer_url: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=600&fit=crop&crop=center',
        sertifikat_template: null,
        kategori: 'seni_budaya',
        tingkat_kesulitan: 'pemula',
        kapasitas_peserta: 200,
        biaya: 15000.00,
        status_event: 'published',
        created_by: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        judul: 'Kompetisi Robotika Tingkat Sekolah',
        tanggal: '2025-09-07',
        waktu: '09:00:00',
        lokasi: 'Lab Robotika',
        deskripsi: 'Kompetisi robotika untuk mengasah kreativitas dan kemampuan teknis siswa dalam bidang teknologi dan engineering.',
        flyer_url: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&h=600&fit=crop&crop=center',
        sertifikat_template: null,
        kategori: 'teknologi',
        tingkat_kesulitan: 'lanjutan',
        kapasitas_peserta: 24,
        biaya: 50000.00,
        status_event: 'published',
        created_by: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        judul: 'Bakti Sosial & Lingkungan',
        tanggal: '2025-09-08',
        waktu: '07:00:00',
        lokasi: 'Desa Sukamaju',
        deskripsi: 'Kegiatan bakti sosial membersihkan lingkungan dan membantu masyarakat sekitar sebagai bentuk kepedulian sosial.',
        flyer_url: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=800&h=600&fit=crop&crop=center',
        sertifikat_template: null,
        kategori: 'sosial',
        tingkat_kesulitan: 'pemula',
        kapasitas_peserta: 50,
        biaya: 0.00,
        status_event: 'published',
        created_by: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        judul: 'Workshop Fotografi & Videografi',
        tanggal: '2025-09-09',
        waktu: '13:00:00',
        lokasi: 'Studio Multimedia',
        deskripsi: 'Belajar teknik fotografi dan videografi dari dasar hingga mahir dengan peralatan profesional dan mentor berpengalaman.',
        flyer_url: 'https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=800&h=600&fit=crop&crop=center',
        sertifikat_template: null,
        kategori: 'seni_budaya',
        tingkat_kesulitan: 'menengah',
        kapasitas_peserta: 20,
        biaya: 75000.00,
        status_event: 'published',
        created_by: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        judul: 'Olimpiade Matematika Internal',
        tanggal: '2025-09-10',
        waktu: '08:00:00',
        lokasi: 'Ruang Kelas 12A',
        deskripsi: 'Kompetisi matematika untuk mempersiapkan siswa menghadapi olimpiade tingkat nasional dan mengasah kemampuan problem solving.',
        flyer_url: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&h=600&fit=crop&crop=center',
        sertifikat_template: null,
        kategori: 'akademik',
        tingkat_kesulitan: 'lanjutan',
        kapasitas_peserta: 40,
        biaya: 0.00,
        status_event: 'published',
        created_by: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Events', null, {});
  }
};
