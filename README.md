# Sistem Informasi Manajemen Event Sekolah

Sistem manajemen event sekolah yang lengkap dengan fitur registrasi, absensi, dan dashboard admin.

## Fitur Utama

### Untuk Peserta:
- ✅ Registrasi akun dengan verifikasi email
- ✅ Login/logout dengan session timeout (5 menit inactivity)
- ✅ Melihat daftar event dengan search dan pagination
- ✅ Mendaftar event dan mendapat token absensi via email
- ✅ Melakukan absensi dengan token 10 digit
- ✅ Melihat riwayat event yang diikuti
- ✅ Reset password via email

### Untuk Admin:
- ✅ Semua fitur peserta
- ✅ Mengelola event (CRUD operations)
- ✅ Dashboard dengan statistik lengkap
- ✅ Export data event dan peserta ke Excel
- ✅ Melihat laporan kehadiran per event

## Teknologi yang Digunakan

### Backend:
- Node.js + Express.js
- MySQL + Sequelize ORM
- JWT untuk autentikasi
- Bcrypt untuk hash password
- Nodemailer untuk email
- Express-validator untuk validasi
- XLSX untuk export Excel
- Express-session untuk session management

### Frontend:
- React.js dengan Vite
- Axios untuk HTTP requests
- React Router untuk routing
- React Toastify untuk notifikasi
- CSS modern dengan responsive design

## Instalasi dan Setup

### 1. Prerequisites
- Node.js (v16 atau lebih baru)
- MySQL Server
- Git

### 2. Clone Repository
```bash
git clone <repository-url>
cd event_rajib
```

### 3. Setup Backend

```bash
cd backend
npm install
```

### 4. Konfigurasi Database
1. Buat database MySQL dengan nama `event_db`
2. Update file `.env` dengan konfigurasi database Anda:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=event_db
DB_PORT=3306

# JWT Configuration
JWT_SECRET=your_jwt_secret_change_this_in_production

# Session Configuration
SESSION_SECRET=your_session_secret_change_this_in_production

# Email Configuration (Gmail example)
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password

# Frontend URL
FRONTEND_URL=http://localhost:3000

# Server Configuration
PORT=3001
```

### 5. Setup Email (Gmail)
1. Aktifkan 2-Factor Authentication di Gmail
2. Generate App Password di Google Account Settings
3. Gunakan App Password sebagai `EMAIL_PASS` di file `.env`

### 6. Jalankan Backend
```bash
npm run dev
```

Backend akan berjalan di `http://localhost:3001`

### 7. Setup Frontend
```bash
cd ../frontend
npm install
npm run dev
```

Frontend akan berjalan di `http://localhost:3000`

## Struktur Database

### Tabel `users`
- id (PK, Auto Increment)
- nama_lengkap (VARCHAR, NOT NULL)
- email (VARCHAR, UNIQUE, NOT NULL)
- no_handphone (VARCHAR, NOT NULL)
- alamat (TEXT)
- pendidikan_terakhir (VARCHAR)
- password_hash (VARCHAR, NOT NULL)
- is_verified (BOOLEAN, DEFAULT false)
- verification_token (VARCHAR)
- verification_expiry (DATETIME)
- role (ENUM: 'admin', 'peserta', DEFAULT 'peserta')

### Tabel `events`
- id (PK, Auto Increment)
- judul (VARCHAR, NOT NULL)
- tanggal (DATE, NOT NULL)
- waktu (TIME, NOT NULL)
- lokasi (VARCHAR, NOT NULL)
- flyer_url (VARCHAR)
- sertifikat_template (VARCHAR)
- deskripsi (TEXT)
- created_by (FK ke users, NOT NULL)

### Tabel `event_registrations`
- id (PK, Auto Increment)
- user_id (FK ke users, NOT NULL)
- event_id (FK ke events, NOT NULL)
- token_absen (VARCHAR(10), UNIQUE, NOT NULL)
- token_sent_at (DATETIME)
- hadir (BOOLEAN, DEFAULT false)
- absen_at (DATETIME)
- sertifikat_url (VARCHAR)

### Tabel `password_resets`
- id (PK, Auto Increment)
- user_id (FK ke users, NOT NULL)
- reset_token (VARCHAR, UNIQUE, NOT NULL)
- reset_expiry (DATETIME, NOT NULL)

## API Endpoints

### Authentication
- `POST /api/register` - Registrasi akun
- `POST /api/verify-email` - Verifikasi email
- `POST /api/login` - Login
- `POST /api/logout` - Logout
- `POST /api/password-reset/request` - Request reset password
- `POST /api/password-reset/confirm` - Konfirmasi reset password

### User
- `GET /api/user/history` - Riwayat event peserta (Protected)

### Events
- `GET /api/events` - List event (dengan pagination, search, sort)
- `GET /api/events/:id` - Detail event
- `POST /api/events` - Tambah event (Admin only)
- `PUT /api/events/:id` - Edit event (Admin only)
- `DELETE /api/events/:id` - Hapus event (Admin only)

### Event Registration
- `POST /api/events/:id/register` - Daftar event (Protected)
- `POST /api/events/:id/absen` - Absensi dengan token

### Export
- `GET /api/events/export` - Export semua event ke Excel (Admin only)
- `GET /api/events/:id/participants/export` - Export peserta event ke Excel (Admin only)

### Dashboard
- `GET /api/dashboard/statistics` - Statistik dashboard (Admin only)

## Fitur Keamanan

1. **Password Hashing**: Menggunakan bcrypt dengan salt rounds 12
2. **JWT Authentication**: Token dengan expiry 24 jam
3. **Session Management**: Session timeout 5 menit inactivity
4. **Email Verification**: Wajib verifikasi email sebelum login
5. **Input Validation**: Validasi semua input menggunakan express-validator
6. **CORS Protection**: Konfigurasi CORS untuk frontend
7. **SQL Injection Protection**: Menggunakan Sequelize ORM

## Cara Penggunaan

### Untuk Peserta:
1. **Registrasi**: Daftar akun baru dengan email valid
2. **Verifikasi**: Cek email dan klik link verifikasi
3. **Login**: Masuk dengan email dan password
4. **Browse Events**: Lihat daftar event yang tersedia
5. **Daftar Event**: Klik "Daftar Event" pada event yang diinginkan
6. **Terima Token**: Cek email untuk mendapat token absensi 10 digit
7. **Absensi**: Pada saat event, masuk ke halaman Absensi dan input token

### Untuk Admin:
1. **Login**: Masuk dengan akun admin
2. **Dashboard**: Lihat statistik dan laporan
3. **Kelola Event**: Tambah, edit, atau hapus event
4. **Export Data**: Download data event atau peserta dalam format Excel
5. **Monitor**: Pantau tingkat kehadiran dan registrasi

## Troubleshooting

### Backend tidak bisa start:
- Pastikan MySQL server berjalan
- Cek konfigurasi database di file `.env`
- Pastikan port 3001 tidak digunakan aplikasi lain

### Email tidak terkirim:
- Pastikan konfigurasi email di `.env` benar
- Gunakan App Password untuk Gmail
- Cek firewall dan koneksi internet

### Frontend tidak bisa connect ke backend:
- Pastikan backend berjalan di port 3001
- Cek konfigurasi CORS di backend
- Pastikan `FRONTEND_URL` di `.env` sesuai

## Kontribusi

1. Fork repository ini
2. Buat branch baru (`git checkout -b feature/AmazingFeature`)
3. Commit perubahan (`git commit -m 'Add some AmazingFeature'`)
4. Push ke branch (`git push origin feature/AmazingFeature`)
5. Buat Pull Request

## License

Distributed under the MIT License. See `LICENSE` for more information.

## Support

Jika ada pertanyaan atau masalah, silakan buat issue di repository ini.

---

**Sistem Informasi Manajemen Event Sekolah** - Dibuat dengan ❤️ untuk memudahkan pengelolaan event sekolah.
