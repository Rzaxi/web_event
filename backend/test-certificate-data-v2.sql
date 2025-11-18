-- ============================================
-- TEST DATA CERTIFICATE SYSTEM V2 - IMPROVED
-- Data lebih realistis dengan 2 user baru dan event baru
-- ============================================

-- 1. BUAT 2 USER BARU DENGAN DATA REALISTIS
-- User 1: Ahmad Rizki (Mahasiswa IT)
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
  'Ahmad Rizki Pratama',
  'ahmad.rizki@student.ac.id',
  '$2b$10$YQiE8Z.QEZx8pJ5M5x6wXuH5J0K3vZ7dGJ8KzF9VxzYqF0pJZ5B4G', -- Password: rizki123
  '081234567891',
  'Jl. Sudirman No. 45, Bandung, Jawa Barat',
  'S1 Teknik Informatika - Semester 6',
  1,
  NULL,
  'peserta',
  NOW(),
  NOW()
);

SET @ahmad_user_id = LAST_INSERT_ID();

-- User 2: Siti Nurhaliza (Professional Designer)
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
  'Siti Nurhaliza Dewi',
  'siti.nurhaliza@designer.com',
  '$2b$10$YQiE8Z.QEZx8pJ5M5x6wXuH5J0K3vZ7dGJ8KzF9VxzYqF0pJZ5B4G', -- Password: siti123
  '081234567892',
  'Jl. Gatot Subroto No. 88, Jakarta Selatan',
  'S1 Desain Komunikasi Visual',
  1,
  NULL,
  'peserta',
  NOW(),
  NOW()
);

SET @siti_user_id = LAST_INSERT_ID();

-- User 3: Budi Santoso (Software Developer)
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
  'Budi Santoso Wijaya',
  'budi.santoso@developer.id',
  '$2b$10$YQiE8Z.QEZx8pJ5M5x6wXuH5J0K3vZ7dGJ8KzF9VxzYqF0pJZ5B4G', -- Password: budi123
  '081234567893',
  'Jl. Diponegoro No. 77, Yogyakarta',
  'S1 Sistem Informasi',
  1,
  NULL,
  'peserta',
  NOW(),
  NOW()
);

SET @budi_user_id = LAST_INSERT_ID();

-- 2. BUAT EVENT BARU YANG LEBIH MENARIK
-- Event: Bootcamp Digital Marketing & UI/UX Design
-- Get organizer ID (sari.pro@gmail.com)
SET @organizer_id = (SELECT id FROM Users WHERE email = 'sari.pro@gmail.com' LIMIT 1);

-- Verify organizer exists
SELECT @organizer_id as organizer_id_to_use, 'sari.pro@gmail.com' as organizer_email;

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
  `biaya`,
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
  'Bootcamp Digital Marketing & UI/UX Design Professional',
  'Program intensif 5 hari untuk menguasai Digital Marketing dan UI/UX Design. Materi meliputi: Social Media Marketing, Google Ads, SEO, Content Strategy, Figma, Adobe XD, User Research, Prototyping, dan Portfolio Building. Sertifikat profesional tersedia bagi peserta yang lulus.',
  '2025-12-01',
  '2025-12-05',
  '08:30:00',
  '17:00:00',
  'Creative Hub Jakarta, Jl. Senopati No. 15, Jakarta Selatan',
  30,
  'bootcamp',
  2500000.00,
  '/uploads/flyers/bootcamp-digital-marketing-uiux.jpg',
  @organizer_id,
  'published',
  1, -- Memberikan sertifikat
  5, -- 5 hari bootcamp
  4, -- Minimal 4 hari kehadiran untuk sertifikat
  'Digital Creative Academy Indonesia',
  NULL, -- Akan pakai template PDF default
  NOW(),
  NOW()
);

SET @bootcamp_event_id = LAST_INSERT_ID();

-- 3. DAFTARKAN KEDUA USER KE EVENT
-- Registration Ahmad Rizki
INSERT INTO `EventRegistrations` (
  `user_id`,
  `event_id`,
  `status`,
  `attendance_token`,
  `createdAt`,
  `updatedAt`
) VALUES (
  @ahmad_user_id,
  @bootcamp_event_id,
  'confirmed',
  'AHMAD12345', -- Token kehadiran
  NOW(),
  NOW()
);

SET @ahmad_registration_id = LAST_INSERT_ID();

-- Registration Siti Nurhaliza
INSERT INTO `EventRegistrations` (
  `user_id`,
  `event_id`,
  `status`,
  `attendance_token`,
  `createdAt`,
  `updatedAt`
) VALUES (
  @siti_user_id,
  @bootcamp_event_id,
  'confirmed',
  'SITI567890', -- Token kehadiran
  NOW(),
  NOW()
);

SET @siti_registration_id = LAST_INSERT_ID();

-- Registration Budi Santoso
INSERT INTO `EventRegistrations` (
  `user_id`,
  `event_id`,
  `status`,
  `attendance_token`,
  `createdAt`,
  `updatedAt`
) VALUES (
  @budi_user_id,
  @bootcamp_event_id,
  'confirmed',
  'BUDI098765', -- Token kehadiran
  NOW(),
  NOW()
);

SET @budi_registration_id = LAST_INSERT_ID();

-- 4. BUAT DAILY ATTENDANCE RECORDS
-- AHMAD RIZKI - Hadir 5 hari penuh (ELIGIBLE untuk sertifikat)
-- Hari 1 - Digital Marketing Fundamentals
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
  @bootcamp_event_id,
  @ahmad_user_id,
  '2025-12-01',
  'present',
  '2025-12-01 08:25:00',
  'Hadir tepat waktu, aktif bertanya tentang SEO strategy',
  NOW(),
  NOW()
);

-- Hari 2 - Social Media Marketing & Content Strategy
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
  @bootcamp_event_id,
  @ahmad_user_id,
  '2025-12-02',
  'present',
  '2025-12-02 08:30:00',
  'Presentasi content strategy sangat baik',
  NOW(),
  NOW()
);

-- Hari 3 - UI/UX Design Fundamentals
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
  @bootcamp_event_id,
  @ahmad_user_id,
  '2025-12-03',
  'present',
  '2025-12-03 08:20:00',
  'Menguasai Figma dengan cepat, design wireframe bagus',
  NOW(),
  NOW()
);

-- Hari 4 - Advanced Prototyping & User Research
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
  @bootcamp_event_id,
  @ahmad_user_id,
  '2025-12-04',
  'present',
  '2025-12-04 08:35:00',
  'Prototype interaktif sangat impresif',
  NOW(),
  NOW()
);

-- Hari 5 - Portfolio Building & Final Presentation
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
  @bootcamp_event_id,
  @ahmad_user_id,
  '2025-12-05',
  'present',
  '2025-12-05 08:15:00',
  'Final presentation excellent, portfolio siap untuk industri',
  NOW(),
  NOW()
);

-- SITI NURHALIZA - Hadir 3 hari (TIDAK ELIGIBLE karena kurang dari 4 hari)
-- Hari 1 - Digital Marketing Fundamentals
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
  @bootcamp_event_id,
  @siti_user_id,
  '2025-12-01',
  'present',
  '2025-12-01 08:40:00',
  'Background design membantu memahami materi dengan cepat',
  NOW(),
  NOW()
);

-- Hari 2 - Absent (sakit)
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
  @bootcamp_event_id,
  @siti_user_id,
  '2025-12-02',
  'excused',
  NULL,
  'Sakit demam, ada surat dokter',
  NOW(),
  NOW()
);

-- Hari 3 - UI/UX Design Fundamentals
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
  @bootcamp_event_id,
  @siti_user_id,
  '2025-12-03',
  'present',
  '2025-12-03 08:45:00',
  'Sudah recover, sangat antusias dengan materi UI/UX',
  NOW(),
  NOW()
);

-- Hari 4 - Late arrival
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
  @bootcamp_event_id,
  @siti_user_id,
  '2025-12-04',
  'late',
  '2025-12-04 10:30:00',
  'Terlambat 2 jam karena macet, tapi mengikuti sesi sore dengan baik',
  NOW(),
  NOW()
);

-- Hari 5 - Absent (keperluan keluarga)
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
  @bootcamp_event_id,
  @siti_user_id,
  '2025-12-05',
  'absent',
  NULL,
  'Keperluan keluarga mendadak, tidak bisa hadir final presentation',
  NOW(),
  NOW()
);

-- BUDI SANTOSO - Hadir 4 hari (ELIGIBLE untuk sertifikat)
-- Hari 1 - Digital Marketing Fundamentals
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
  @bootcamp_event_id,
  @budi_user_id,
  '2025-12-01',
  'present',
  '2025-12-01 08:50:00',
  'Background programming membantu memahami digital marketing automation',
  NOW(),
  NOW()
);

-- Hari 2 - Social Media Marketing & Content Strategy
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
  @bootcamp_event_id,
  @budi_user_id,
  '2025-12-02',
  'present',
  '2025-12-02 08:45:00',
  'Sangat tertarik dengan marketing automation tools',
  NOW(),
  NOW()
);

-- Hari 3 - UI/UX Design Fundamentals  
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
  @bootcamp_event_id,
  @budi_user_id,
  '2025-12-03',
  'present',
  '2025-12-03 08:30:00',
  'Belajar UI/UX untuk improve aplikasi yang sedang dikembangkan',
  NOW(),
  NOW()
);

-- Hari 4 - Advanced Prototyping & User Research
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
  @bootcamp_event_id,
  @budi_user_id,
  '2025-12-04',
  'present',
  '2025-12-04 08:40:00',
  'Prototype yang dibuat sangat teknis dan fungsional',
  NOW(),
  NOW()
);

-- Hari 5 - Portfolio Building & Final Presentation (Absent - meeting klien)
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
  @bootcamp_event_id,
  @budi_user_id,
  '2025-12-05',
  'excused',
  NULL,
  'Meeting penting dengan klien, tapi sudah submit portfolio via email',
  NOW(),
  NOW()
);

-- 5. GENERATE CERTIFICATE UNTUK AHMAD & BUDI (yang eligible)
INSERT INTO `certificates_issued` (
  `event_id`,
  `user_id`,
  `certificate_number`,
  `certificate_url`,
  `issued_date`,
  `downloaded_at`,
  `download_count`
) VALUES (
  @bootcamp_event_id,
  @ahmad_user_id,
  CONCAT('CERT-', YEAR(NOW()), '-', LPAD(MONTH(NOW()), 2, '0'), '-', LPAD(@ahmad_user_id, 4, '0')),
  '/certificates/bootcamp-digital-marketing-uiux-ahmad-rizki.pdf',
  NOW(),
  NULL,
  0
);

-- Generate certificate untuk Budi juga
INSERT INTO `certificates_issued` (
  `event_id`,
  `user_id`,
  `certificate_number`,
  `certificate_url`,
  `issued_date`,
  `downloaded_at`,
  `download_count`
) VALUES (
  @bootcamp_event_id,
  @budi_user_id,
  CONCAT('CERT-', YEAR(NOW()), '-', LPAD(MONTH(NOW()), 2, '0'), '-', LPAD(@budi_user_id, 4, '0')),
  '/certificates/bootcamp-digital-marketing-uiux-budi-santoso.pdf',
  NOW(),
  NULL,
  0
);

-- ============================================
-- INFORMASI HASIL UNTUK TESTING
-- ============================================

-- Display Users Info
SELECT 
  @ahmad_user_id as ahmad_user_id,
  'ahmad.rizki@student.ac.id' as ahmad_email,
  'rizki123' as ahmad_password,
  'Ahmad Rizki Pratama' as ahmad_nama,
  @siti_user_id as siti_user_id,
  'siti.nurhaliza@designer.com' as siti_email,
  'siti123' as siti_password,
  'Siti Nurhaliza Dewi' as siti_nama,
  @budi_user_id as budi_user_id,
  'budi.santoso@developer.id' as budi_email,
  'budi123' as budi_password,
  'Budi Santoso Wijaya' as budi_nama;

-- Display Event Info
SELECT 
  @bootcamp_event_id as event_id,
  'Bootcamp Digital Marketing & UI/UX Design Professional' as judul,
  'Digital Creative Academy Indonesia' as penyelenggara,
  '5 hari' as durasi,
  'Minimal 4 hari kehadiran' as syarat_sertifikat,
  'Rp 2.500.000' as biaya;

-- Display Registration Info
SELECT 
  @ahmad_registration_id as ahmad_registration_id,
  @siti_registration_id as siti_registration_id,
  @budi_registration_id as budi_registration_id,
  'confirmed' as status_all;

-- Check Attendance Summary Ahmad (ELIGIBLE)
SELECT 
  'Ahmad Rizki Pratama' as nama,
  COUNT(CASE WHEN status = 'present' THEN 1 END) as hadir_penuh,
  COUNT(CASE WHEN status IN ('present', 'late') THEN 1 END) as total_hadir,
  5 as durasi_hari,
  4 as minimum_kehadiran,
  CASE WHEN COUNT(CASE WHEN status = 'present' THEN 1 END) >= 4 THEN 'ELIGIBLE ✅' ELSE 'NOT ELIGIBLE ❌' END as certificate_status
FROM `DailyAttendances`
WHERE event_id = @bootcamp_event_id 
  AND user_id = @ahmad_user_id;

-- Check Attendance Summary Siti (NOT ELIGIBLE)
SELECT 
  'Siti Nurhaliza Dewi' as nama,
  COUNT(CASE WHEN status = 'present' THEN 1 END) as hadir_penuh,
  COUNT(CASE WHEN status IN ('present', 'late') THEN 1 END) as total_hadir,
  5 as durasi_hari,
  4 as minimum_kehadiran,
  CASE WHEN COUNT(CASE WHEN status = 'present' THEN 1 END) >= 4 THEN 'ELIGIBLE ✅' ELSE 'NOT ELIGIBLE ❌' END as certificate_status
FROM `DailyAttendances`
WHERE event_id = @bootcamp_event_id 
  AND user_id = @siti_user_id;

-- Check Attendance Summary Budi (ELIGIBLE)
SELECT 
  'Budi Santoso Wijaya' as nama,
  COUNT(CASE WHEN status = 'present' THEN 1 END) as hadir_penuh,
  COUNT(CASE WHEN status IN ('present', 'late') THEN 1 END) as total_hadir,
  5 as durasi_hari,
  4 as minimum_kehadiran,
  CASE WHEN COUNT(CASE WHEN status = 'present' THEN 1 END) >= 4 THEN 'ELIGIBLE ✅' ELSE 'NOT ELIGIBLE ❌' END as certificate_status
FROM `DailyAttendances`
WHERE event_id = @bootcamp_event_id 
  AND user_id = @budi_user_id;

-- Check Certificate Issued
SELECT 
  ci.certificate_number,
  u.nama_lengkap,
  e.judul as event_title,
  ci.issued_date,
  ci.certificate_url
FROM certificates_issued ci
JOIN Users u ON ci.user_id = u.id
JOIN Events e ON ci.event_id = e.id
WHERE ci.event_id = @bootcamp_event_id;

-- ============================================
-- QUERY UNTUK CEK DATA LENGKAP
-- ============================================

-- Cek semua user baru
-- SELECT id, nama_lengkap, email, role FROM Users WHERE email IN ('ahmad.rizki@student.ac.id', 'siti.nurhaliza@designer.com');

-- Cek event bootcamp
-- SELECT * FROM Events WHERE judul LIKE '%Bootcamp Digital Marketing%';

-- Cek registrations
-- SELECT er.*, u.nama_lengkap FROM EventRegistrations er JOIN Users u ON er.user_id = u.id WHERE er.event_id = @bootcamp_event_id;

-- Cek attendance detail
-- SELECT da.*, u.nama_lengkap FROM DailyAttendances da JOIN Users u ON da.user_id = u.id WHERE da.event_id = @bootcamp_event_id ORDER BY da.attendance_date, u.nama_lengkap;

-- Cek eligibility summary
-- SELECT 
--   u.nama_lengkap,
--   e.judul,
--   e.durasi_hari,
--   e.minimum_kehadiran,
--   COUNT(CASE WHEN da.status = 'present' THEN 1 END) as hadir_penuh,
--   COUNT(CASE WHEN da.status IN ('present', 'late') THEN 1 END) as total_hadir,
--   CASE WHEN COUNT(CASE WHEN da.status = 'present' THEN 1 END) >= e.minimum_kehadiran THEN 'ELIGIBLE' ELSE 'NOT ELIGIBLE' END as certificate_status
-- FROM Users u
-- JOIN EventRegistrations er ON u.id = er.user_id
-- JOIN Events e ON er.event_id = e.id
-- LEFT JOIN DailyAttendances da ON da.event_id = e.id AND da.user_id = u.id
-- WHERE e.id = @bootcamp_event_id
-- GROUP BY u.id, e.id;
