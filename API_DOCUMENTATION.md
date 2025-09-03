# 📋 API Documentation - Event Management System

**Base URL:** `http://localhost:3000/api`

## 🔐 Authentication Endpoints

### 1. Register User
- **Method:** `POST`
- **URL:** `/auth/register`
- **Body (JSON):**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "user"
}
```

### 2. Login User
- **Method:** `POST`
- **URL:** `/auth/login`
- **Body (JSON):**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

### 3. Verify Email
- **Method:** `POST`
- **URL:** `/auth/verify-email`
- **Body (JSON):**
```json
{
  "token": "verification_token_here"
}
```

### 4. Forgot Password
- **Method:** `POST`
- **URL:** `/auth/forgot-password`
- **Body (JSON):**
```json
{
  "email": "john@example.com"
}
```

### 5. Reset Password
- **Method:** `POST`
- **URL:** `/auth/reset-password`
- **Body (JSON):**
```json
{
  "token": "reset_token_here",
  "newPassword": "newpassword123"
}
```

## 🎉 Event Endpoints

### 6. Get All Events
- **Method:** `GET`
- **URL:** `/events`
- **Query Params (optional):**
  - `page=1`
  - `limit=10`
  - `search=keyword`

### 7. Get Event by ID
- **Method:** `GET`
- **URL:** `/events/:id`
- **Example:** `/events/1`

### 8. Create Event (Admin Only)
- **Method:** `POST`
- **URL:** `/events`
- **Headers:** `Authorization: Bearer your_jwt_token`
- **Body (multipart/form-data):**
  - `judul` (string, required): Judul event.
  - `tanggal` (string, required): Tanggal event (format: YYYY-MM-DD).
  - `waktu` (string, required): Waktu event (format: HH:MM).
  - `lokasi` (string, required): Lokasi event.
  - `deskripsi` (string, optional): Deskripsi lengkap event.
  - `sertifikat_template` (string, optional): URL atau path ke template sertifikat.
  - `flyer` (file, optional): File gambar untuk flyer event (jpg, png, gif, max 2MB).

### 9. Update Event (Admin Only)
- **Method:** `PUT`
- **URL:** `/events/:id`
- **Headers:** `Authorization: Bearer your_jwt_token`
- **Body (multipart/form-data):** Same as create event. Semua field bersifat opsional.

### 10. Delete Event (Admin Only)
- **Method:** `DELETE`
- **URL:** `/events/:id`
- **Headers:** `Authorization: Bearer your_jwt_token`

### 11. Issue Certificates (Admin Only)
- **Method:** `POST`
- **URL:** `/events/:id/issue-certificates`
- **Headers:** `Authorization: Bearer your_jwt_token`
- **Description:** Menerbitkan sertifikat untuk semua peserta yang terdaftar di sebuah event. Membutuhkan `sertifikat_template` pada data event.
- **Example:** `/events/1/issue-certificates`

## 📝 Registration Endpoints

### 12. Register for Event
- **Method:** `POST`
- **URL:** `/events/:id/register`
- **Headers:** `Authorization: Bearer your_jwt_token`
- **Example:** `/events/1/register`

### 13. Cancel Registration
- **Method:** `DELETE`
- **URL:** `/events/:id/register`
- **Headers:** `Authorization: Bearer your_jwt_token`

### 14. Get Event Registrations (Admin Only)
- **Method:** `GET`
- **URL:** `/events/:id/registrations`
- **Headers:** `Authorization: Bearer your_jwt_token`

## 👤 User Profile Endpoints

### 15. Get User Profile
- **Method:** `GET`
- **URL:** `/users/profile`
- **Headers:** `Authorization: Bearer your_jwt_token`

### 18. Update User Profile
- **Method:** `PUT`
- **URL:** `/users/profile`
- **Headers:** `Authorization: Bearer your_jwt_token`
- **Body (JSON):**
```json
{
  "name": "John Doe Updated",
  "email": "john.updated@example.com"
}
```

### 19. Get User Events
- **Method:** `GET`
- **URL:** `/users/events`
- **Headers:** `Authorization: Bearer your_jwt_token`

## 📊 Dashboard Endpoints (Admin Only)

### 20. Get Dashboard Stats
- **Method:** `GET`
- **URL:** `/dashboard/stats`
- **Headers:** `Authorization: Bearer your_jwt_token`

### 21. Export Events
- **Method:** `GET`
- **URL:** `/dashboard/export/events`
- **Headers:** `Authorization: Bearer your_jwt_token`

### 22. Export Participants
- **Method:** `GET`
- **URL:** `/dashboard/export/participants/:eventId`
- **Headers:** `Authorization: Bearer your_jwt_token`

## 🔧 Testing Tips

### Headers untuk Authenticated Requests:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json
```

### Sample Admin User (untuk testing):
```json
{
  "email": "admin@school.com",
  "password": "admin123",
  "role": "admin"
}
```

### Sample Regular User:
```json
{
  "email": "student@school.com", 
  "password": "student123",
  "role": "user"
}
```

## 📋 Testing Flow:
1. Register user → Get verification email → Verify email
2. Login → Get JWT token
3. Use JWT token untuk semua authenticated requests
4. Test CRUD operations untuk events (admin)
5. Test registration dan attendance (user)

---

# 🔐 Admin API Endpoints

## Admin Authentication

### Admin Login
```http
POST /api/admin/login
Content-Type: application/json

{
  "username": "admin",
  "password": "admin123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login berhasil",
  "token": "jwt_token_here",
  "user": {
    "id": 1,
    "username": "admin",
    "role": "admin",
    "name": "Administrator"
  }
}
```

## Admin Dashboard Statistics

### Get Dashboard Overview
```http
GET /api/admin/statistics/overview
Authorization: Bearer {admin_token}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "totalEvents": 145,
    "totalParticipants": 2850,
    "activeEvents": 12,
    "completedEvents": 133
  }
}
```

### Get Monthly Events Statistics
```http
GET /api/admin/statistics/monthly-events
Authorization: Bearer {admin_token}
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "month": "Jan",
      "events": 12
    },
    {
      "month": "Feb", 
      "events": 8
    }
  ]
}
```

### Get Monthly Participants Statistics
```http
GET /api/admin/statistics/monthly-participants
Authorization: Bearer {admin_token}
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "month": "Jan",
      "participants": 250
    },
    {
      "month": "Feb",
      "participants": 180
    }
  ]
}
```

### Get Top 10 Events Statistics
```http
GET /api/admin/statistics/top-events
Authorization: Bearer {admin_token}
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "name": "Workshop Web Development",
      "participants": 250
    },
    {
      "name": "Seminar Digital Marketing",
      "participants": 230
    }
  ]
}
```

## Admin Event Management

### Get All Events (Admin)
```http
GET /api/admin/events?search=workshop&status=active&page=1&limit=10
Authorization: Bearer {admin_token}
```

**Response:**
```json
{
  "success": true,
  "events": [
    {
      "id": 1,
      "title": "Workshop Web Development",
      "description": "Belajar membuat website modern",
      "date": "2024-01-15",
      "time": "09:00",
      "location": "Lab Komputer 1",
      "maxParticipants": 30,
      "registeredCount": 25,
      "flyer": "/uploads/flyers/flyer-123.jpg",
      "createdAt": "2024-01-12T10:00:00Z",
      "updatedAt": "2024-01-12T10:00:00Z"
    }
  ],
  "pagination": {
    "total": 50,
    "page": 1,
    "limit": 10,
    "totalPages": 5
  }
}
```

### Create New Event
```http
POST /api/admin/events
Authorization: Bearer {admin_token}
Content-Type: multipart/form-data

title: Workshop Web Development
description: Belajar membuat website modern dengan React
date: 2024-01-15
time: 09:00
location: Lab Komputer 1
maxParticipants: 30
flyer: [file upload]
```

**Response:**
```json
{
  "success": true,
  "message": "Event berhasil dibuat",
  "event": {
    "id": 1,
    "title": "Workshop Web Development",
    "description": "Belajar membuat website modern dengan React",
    "date": "2024-01-15",
    "time": "09:00",
    "location": "Lab Komputer 1",
    "maxParticipants": 30,
    "flyer": "/uploads/flyers/flyer-123.jpg"
  }
}
```

### Update Event
```http
PUT /api/admin/events/{id}
Authorization: Bearer {admin_token}
Content-Type: multipart/form-data

title: Workshop Web Development (Updated)
description: Updated description
date: 2024-01-20
time: 10:00
location: Lab Komputer 2
maxParticipants: 35
flyer: [file upload - optional]
```

### Delete Event
```http
DELETE /api/admin/events/{id}
Authorization: Bearer {admin_token}
```

**Response:**
```json
{
  "success": true,
  "message": "Event berhasil dihapus"
}
```

## Admin Participant Management

### Get Event Participants
```http
GET /api/admin/events/{id}/participants
Authorization: Bearer {admin_token}
```

**Response:**
```json
{
  "success": true,
  "event": {
    "id": 1,
    "title": "Workshop Web Development",
    "date": "2024-01-15",
    "time": "09:00",
    "location": "Lab Komputer 1"
  },
  "participants": [
    {
      "id": 1,
      "registrationDate": "2024-01-10T10:00:00Z",
      "attendanceStatus": "hadir",
      "user": {
        "id": 1,
        "name": "John Doe",
        "email": "john@example.com",
        "phone": "08123456789",
        "school": "SMA Negeri 1",
        "class": "XII IPA 1"
      }
    }
  ],
  "totalParticipants": 25
}
```

### Export All Participants
```http
GET /api/admin/participants/export
Authorization: Bearer {admin_token}
```

**Response:**
```json
{
  "success": true,
  "participants": [
    {
      "Nama Peserta": "John Doe",
      "Email": "john@example.com",
      "No. Telepon": "08123456789",
      "Sekolah": "SMA Negeri 1",
      "Kelas": "XII IPA 1",
      "Nama Event": "Workshop Web Development",
      "Tanggal Event": "2024-01-15",
      "Waktu Event": "09:00",
      "Lokasi Event": "Lab Komputer 1",
      "Tanggal Daftar": "2024-01-10T10:00:00Z",
      "Status Kehadiran": "hadir"
    }
  ]
}
```

## 🔒 Admin Authentication Rules
- Admin login menggunakan username/password
- Demo credentials: `admin` / `admin123`
- Admin token berlaku 24 jam
- Semua admin endpoints memerlukan Bearer token
- H-3 rule: Event hanya bisa dibuat minimal 3 hari sebelum tanggal pelaksanaan
- Event yang sudah dimulai tidak bisa diedit/dihapus

## 📊 Business Rules
- Statistik peserta diambil dari data yang sudah confirmed
- Export data dalam format Excel/CSV
- File upload untuk flyer maksimal 5MB (JPG, PNG, JPEG)
- Pendaftaran otomatis tertutup saat event dimulai
