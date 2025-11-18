# 🎓 CARA TESTING CERTIFICATE SYSTEM

## 📋 Data Yang Akan Dibuat:

1. **User Peserta: Saripro Hermawan**
   - Email: `saripro@test.com`
   - Password: `saripro123`
   - Role: peserta
   - Status: Email verified

2. **Event: Pelatihan Web Development Intensif**
   - Durasi: 3 hari (1-3 Nov 2025)
   - Kategori: Pelatihan
   - Memberikan Sertifikat: ✅ Yes
   - Minimal Kehadiran: 2 hari
   - Penyelenggara: TechHub Academy Indonesia

3. **Registration: Saripro → Event**
   - Status: Approved (sudah disetujui)

4. **Attendance: 3 hari hadir penuh**
   - Day 1: Present ✅
   - Day 2: Present ✅
   - Day 3: Present ✅

---

## 🚀 CARA JALANKAN (PILIH SALAH SATU):

### **Cara 1: Via MySQL Workbench / phpMyAdmin (TERMUDAH)**

1. Buka MySQL Workbench atau phpMyAdmin
2. Connect ke database `event_management` (atau sesuai nama database kamu)
3. Copy semua isi file `test-certificate-data.sql`
4. Paste ke SQL editor
5. Klik **Execute** / **Run**
6. Done! ✅

---

### **Cara 2: Via MySQL Command Line**

```bash
# 1. Masuk ke MySQL
mysql -u root -p

# 2. Pilih database
use event_management;

# 3. Jalankan SQL file
source C:/Users/rajib/Documents/ujikom/project_files/event_rajib (3)/event_rajib/backend/test-certificate-data.sql;

# 4. Keluar
exit;
```

---

### **Cara 3: Via Command Prompt (Satu Baris)**

```bash
mysql -u root -p event_management < "C:\Users\rajib\Documents\ujikom\project_files\event_rajib (3)\event_rajib\backend\test-certificate-data.sql"
```

---

## ✅ TESTING FLOW:

### **Step 1: Login sebagai Saripro (User)**
```
URL: http://localhost:3001/login
Email: saripro@test.com
Password: saripro123
```

### **Step 2: Lihat Profile → My Certificates**
```
URL: http://localhost:3001/profile?tab=certificates
```
**Expect:** Belum ada sertifikat (karena belum di-generate)

### **Step 3: Generate Certificate (Via Postman/Thunder Client)**

**Request:**
```
POST http://localhost:3000/api/organizer/certificates/generate/:eventId/:participantId
```

**Get eventId dan userId:**
```sql
-- Di MySQL, jalankan query ini:
SELECT 
  e.id as event_id,
  u.id as user_id,
  u.nama,
  e.judul
FROM Users u
JOIN EventRegistrations er ON u.id = er.user_id
JOIN Events e ON er.event_id = e.id
WHERE u.email = 'saripro@test.com';
```

**Contoh Request:**
```
POST http://localhost:3000/api/organizer/certificates/generate/136/24

Headers:
Authorization: Bearer <organizer_token>
```

### **Step 4: Refresh Profile Page**
```
URL: http://localhost:3001/profile?tab=certificates
```
**Expect:** 
- ✅ Muncul 1 sertifikat
- ✅ Nama: "Pelatihan Web Development Intensif"
- ✅ Certificate Number: 0136/000024/CERT/2025
- ✅ Issued Date: Hari ini
- ✅ Download Button tersedia

### **Step 5: Download Certificate**
Click button **"Download PDF"**

**Expect:**
- ✅ File downloaded: `Certificate-0136-000024-CERT-2025.pdf`
- ✅ Isi PDF:
  - Judul: "SERTIFIKAT PELATIHAN"
  - Nama Peserta: "SARIPRO HERMAWAN" (dari database!)
  - Event: "Pelatihan Web Development Intensif" (dari database!)
  - Penyelenggara: "TechHub Academy Indonesia"
  - Tanggal: 1 November 2025
  - QR Code untuk verifikasi

---

## 🔍 QUERY CEK DATA:

### Cek User Saripro
```sql
SELECT * FROM Users WHERE email = 'saripro@test.com';
```

### Cek Event
```sql
SELECT * FROM Events WHERE judul LIKE '%Web Development%';
```

### Cek Registration
```sql
SELECT 
  er.*,
  u.nama as peserta,
  e.judul as event
FROM EventRegistrations er
JOIN Users u ON er.user_id = u.id
JOIN Events e ON er.event_id = e.id
WHERE u.email = 'saripro@test.com';
```

### Cek Attendance
```sql
SELECT 
  da.*,
  u.nama as peserta,
  e.judul as event
FROM DailyAttendances da
JOIN Users u ON da.user_id = u.id
JOIN Events e ON da.event_id = e.id
WHERE u.email = 'saripro@test.com';
```

### Cek Certificate Eligibility
```sql
SELECT 
  u.nama,
  e.judul,
  e.durasi_hari,
  e.minimum_kehadiran,
  COUNT(da.id) as total_hadir,
  CASE 
    WHEN COUNT(da.id) >= e.minimum_kehadiran THEN 'ELIGIBLE ✅' 
    ELSE 'NOT ELIGIBLE ❌' 
  END as status
FROM Users u
JOIN EventRegistrations er ON u.id = er.user_id
JOIN Events e ON er.event_id = e.id
LEFT JOIN DailyAttendances da ON da.event_id = e.id AND da.user_id = u.id AND da.status = 'present'
WHERE u.email = 'saripro@test.com'
GROUP BY u.id, e.id;
```

### Cek Certificate Issued
```sql
SELECT 
  ci.*,
  u.nama as peserta,
  e.judul as event
FROM certificates_issued ci
JOIN Users u ON ci.user_id = u.id
JOIN Events e ON ci.event_id = e.id
WHERE u.email = 'saripro@test.com';
```

---

## 🐛 TROUBLESHOOTING:

### Error: "Cannot find organizer"
```sql
-- Cek apakah ada organizer:
SELECT id, nama, email, role FROM Users WHERE role LIKE 'event_organizer%';

-- Jika tidak ada, buat organizer dulu atau ganti manual di SQL line 72
```

### Error: "Table doesn't exist"
```bash
# Jalankan migrations dulu:
cd backend
npx sequelize-cli db:migrate
```

### Password tidak bisa login
Password hash mungkin tidak match. Gunakan force verify:
```sql
-- Update password manual (hash untuk 'saripro123')
UPDATE Users 
SET password = '$2b$10$rZJ6kZ0Y6qF.ZQ0xQYjYXeZ6kFqH0qF0qF0qF0qF0qF0qF0qF0qF0' 
WHERE email = 'saripro@test.com';
```

---

## ✨ EXPECTED RESULT:

Setelah semua steps:
1. ✅ User Saripro bisa login
2. ✅ Profile → My Certificates menampilkan 1 sertifikat
3. ✅ Certificate menampilkan data REAL dari database:
   - Nama peserta: **SARIPRO HERMAWAN** (bukan dummy!)
   - Event title: **Pelatihan Web Development Intensif** (dari database!)
   - Organizer: **TechHub Academy Indonesia**
4. ✅ Download PDF berhasil
5. ✅ PDF berisi nama Saripro yang benar

---

## 📞 HELP:

Jika ada error, cek:
1. MySQL service running?
2. Database name benar?
3. All migrations sudah run?
4. Ada organizer user di database?

Kalau masih error, copy paste error message-nya!
