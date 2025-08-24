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
