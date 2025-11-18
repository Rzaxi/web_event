 -- ============================================
-- TEST DATA UNTUK CERTIFICATE SYSTEM
-- ============================================

-- 1. BUAT USER BARU: SARIPRO
-- Email: saripro@test.com
-- Password: saripro123 (bcrypt hash)
INSERT INTO `Users` (
  `nama_lengkap`, 
  `email`, 
  `password_hash`, 
  `no_handphone`, 
  `alamat`, 
  `pendidikan_terakhir`, 
  `is_verified`, 
  `verification_token`,
  `role`,
  `createdAt`, 
  `updatedAt`
) VALUES (
  'Saripro Hermawan',
  'saripro@test.com',
  '$2b$10$YQiE8Z.QEZx8pJ5M5x6wXuH5J0K3vZ7dGJ8KzF9VxzYqF0pJZ5B4G', -- Password: saripro123
  '081234567890',
  'Jl. Testing No. 123, Jakarta',
  'S1 Teknik Informatika',
  1,
  NULL,
  'peserta',
  NOW(),
  NOW()
);

-- Get user ID (akan digunakan untuk registration)
SET @saripro_user_id = LAST_INSERT_ID();

-- 2. BUAT EVENT DENGAN CERTIFICATE ENABLED
-- Event ini akan dimiliki oleh organizer: sari.pro@gmail.com
-- Get organizer ID
SET @organizer_id = (SELECT id FROM Users WHERE email = 'sari.pro@gmail.com' LIMIT 1);

-- Verify organizer exists
SELECT @organizer_id as organizer_id_to_use;

INSERT INTO `Events` (
  `judul`,
  `deskripsi`,
  `tanggal`,
  `tanggal_selesai`,
  `waktu_mulai`,
  `waktu_selesai`,
  `lokasi`,
  `kapasitas_peserta`,
  `kategori`,
  `flyer_url`,
  `created_by`,
  `status_event`,
  `memberikan_sertifikat`,
  `durasi_hari`,
  `minimum_kehadiran`,
  `penyelenggara`,
  `sertifikat_template`,
  `createdAt`,
  `updatedAt`
) VALUES (
  'Pelatihan Web Development Intensif',
  'Pelatihan web development dari basic hingga advanced dengan sertifikat resmi. Materi meliputi HTML, CSS, JavaScript, React, Node.js, dan deployment.',
  '2025-11-01',
  '2025-11-03',
  '09:00:00',
  '16:00:00',
  'Gedung TechHub Jakarta, Lantai 5',
  50,
  'pelatihan',
  '/uploads/flyers/default-webdev.jpg',
  @organizer_id, -- Pakai organizer sari.pro
  'published',
  1, -- Memberikan sertifikat
  3, -- 3 hari pelatihan
  2, -- Minimal 2 hari kehadiran
  'TechHub Academy Indonesia',
  NULL, -- Akan pakai default template PDF
  NOW(),
  NOW()
);

-- Get event ID
SET @test_event_id = LAST_INSERT_ID();

-- 3. DAFTARKAN SARIPRO KE EVENT
INSERT INTO `EventRegistrations` (
  `user_id`,
  `event_id`,
  `status`,
  `createdAt`,
  `updatedAt`
) VALUES (
  @saripro_user_id,
  @test_event_id,
  'confirmed', -- Status confirmed (bukan approved)
  NOW(),
  NOW()
);

-- Get registration ID
SET @registration_id = LAST_INSERT_ID();

-- 4. BUAT DAILY ATTENDANCE RECORD (Simulasi user hadir 3 hari)
-- Hari 1
INSERT INTO `DailyAttendances` (
  `event_id`,
  `user_id`,
  `attendance_date`,
  `status`,
  `check_in_time`,
  `notes`,
  `createdAt`,
  `updatedAt`
) VALUES (
  @test_event_id,
  @saripro_user_id,
  '2025-11-01',
  'present',
  '2025-11-01 09:15:00',
  'Hadir tepat waktu',
  NOW(),
  NOW()
);

-- Hari 2
INSERT INTO `DailyAttendances` (
  `event_id`,
  `user_id`,
  `attendance_date`,
  `status`,
  `check_in_time`,
  `notes`,
  `createdAt`,
  `updatedAt`
) VALUES (
  @test_event_id,
  @saripro_user_id,
  '2025-11-02',
  'present',
  '2025-11-02 09:10:00',
  'Hadir tepat waktu',
  NOW(),
  NOW()
);

-- Hari 3
INSERT INTO `DailyAttendances` (
  `event_id`,
  `user_id`,
  `attendance_date`,
  `status`,
  `check_in_time`,
  `notes`,
  `createdAt`,
  `updatedAt`
) VALUES (
  @test_event_id,
  @saripro_user_id,
  '2025-11-03',
  'present',
  '2025-11-03 09:05:00',
  'Hadir tepat waktu',
  NOW(),
  NOW()
);

-- ============================================
-- INFORMASI UNTUK TESTING
-- ============================================

-- Display User Info
SELECT 
  @saripro_user_id as user_id,
  'saripro@test.com' as email,
  'saripro123' as password_plain,
  'Saripro Hermawan' as nama;

-- Display Event Info
SELECT 
  @test_event_id as event_id,
  'Pelatihan Web Development Intensif' as judul,
  'TechHub Academy Indonesia' as penyelenggara;

-- Display Registration Info
SELECT 
  @registration_id as registration_id,
  @saripro_user_id as user_id,
  @test_event_id as event_id,
  'confirmed' as status;

-- Check Attendance Summary
SELECT 
  COUNT(*) as total_hadir,
  3 as durasi_hari,
  2 as minimum_kehadiran,
  CASE WHEN COUNT(*) >= 2 THEN 'ELIGIBLE' ELSE 'NOT ELIGIBLE' END as certificate_status
FROM `DailyAttendances`
WHERE event_id = @test_event_id 
  AND user_id = @saripro_user_id 
  AND status = 'present';

-- ============================================
-- QUERY UNTUK CEK DATA
-- ============================================

-- Cek user Saripro
-- SELECT * FROM Users WHERE email = 'saripro@test.com';

-- Cek event
-- SELECT * FROM Events WHERE judul LIKE '%Web Development%';

-- Cek registration
-- SELECT * FROM EventRegistrations WHERE user_id = @saripro_user_id;

-- Cek attendance
-- SELECT * FROM DailyAttendances WHERE user_id = @saripro_user_id;

-- Cek eligibility
-- SELECT 
--   u.nama,
--   e.judul,
--   e.durasi_hari,
--   e.minimum_kehadiran,
--   COUNT(da.id) as total_hadir
-- FROM Users u
-- JOIN EventRegistrations er ON u.id = er.user_id
-- JOIN Events e ON er.event_id = e.id
-- LEFT JOIN DailyAttendances da ON da.event_id = e.id AND da.user_id = u.id AND da.status = 'present'
-- WHERE u.email = 'saripro@test.com'
-- GROUP BY u.id, e.id;
