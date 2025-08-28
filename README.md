# 📋 EVENT MANAGEMENT SYSTEM - PROJECT OVERVIEW

## 🎯 DESKRIPSI PROJECT

**Sistem Informasi Manajemen Event Sekolah** adalah aplikasi web full-stack yang dirancang untuk memudahkan pengelolaan event sekolah secara digital. Sistem ini menyediakan platform terintegrasi untuk registrasi peserta, manajemen event, sistem absensi digital, dan dashboard admin yang komprehensif.

### 🎪 Tujuan Utama:
- Digitalisasi proses manajemen event sekolah
- Otomatisasi sistem registrasi dan absensi
- Penyediaan dashboard analytics untuk admin
- Meningkatkan efisiensi pengelolaan event

---

## 🛠️ TEKNOLOGI & TOOLS YANG DIGUNAKAN

### **Backend Technologies:**
| Technology | Version | Purpose |
|------------|---------|---------|
| **Node.js** | Latest | Server-side JavaScript runtime |
| **Express.js** | ^4.16.1 | Web application framework |
| **MySQL** | Latest | Relational database |
| **Sequelize** | ^6.37.7 | Object-Relational Mapping (ORM) |
| **JWT** | ^9.0.2 | JSON Web Token authentication |
| **Bcrypt.js** | ^2.4.3 | Password hashing |
| **Nodemailer** | ^6.9.8 | Email service integration |
| **Multer** | ^1.4.5 | File upload handling |
| **XLSX** | ^0.18.5 | Excel file generation |
| **Express-Validator** | ^7.0.1 | Input validation |
| **CORS** | ^2.8.5 | Cross-Origin Resource Sharing |
| **Dotenv** | ^17.2.1 | Environment variables |

### **Frontend Technologies:**
| Technology | Version | Purpose |
|------------|---------|---------|
| **React.js** | ^18.2.0 | Frontend JavaScript library |
| **Vite** | ^5.2.0 | Build tool and dev server |
| **React Router** | ^6.24.0 | Client-side routing |
| **Axios** | ^1.7.2 | HTTP client |
| **Tailwind CSS** | ^3.4.17 | Utility-first CSS framework |
| **Chart.js** | ^4.4.3 | Data visualization |
| **React Hook Form** | ^7.62.0 | Form handling |
| **React Toastify** | ^10.0.5 | Toast notifications |
| **Lucide React** | ^0.400.0 | Icon library |
| **React Scroll** | ^1.9.3 | Smooth scrolling |

### **Development Tools:**
- **ESLint** - Code linting
- **Nodemon** - Auto-restart development server
- **PostCSS** - CSS processing
- **Autoprefixer** - CSS vendor prefixes

### **Database:**
- **MySQL Server** - Primary database
- **Sequelize Migrations** - Database schema management

### **Security & Authentication:**
- **JWT (JSON Web Tokens)** - Stateless authentication
- **Bcrypt** - Password hashing with salt
- **Express Session** - Session management
- **CORS** - Cross-origin security
- **Input Validation** - SQL injection prevention

---

## ⭐ FITUR UTAMA SISTEM

### **👥 FITUR UNTUK PESERTA:**

#### 🔐 **Authentication & Security**
- ✅ **Registrasi Akun** dengan validasi email
- ✅ **Verifikasi Email** wajib sebelum login
- ✅ **Login/Logout** dengan JWT authentication
- ✅ **Reset Password** via email
- ✅ **Session Timeout** otomatis (5 menit inactivity)

#### 📅 **Event Management**
- ✅ **Browse Events** dengan search dan filter
- ✅ **Pagination** untuk performa optimal
- ✅ **Event Details** lengkap dengan flyer
- ✅ **Event Registration** satu klik
- ✅ **Event History** riwayat keikutsertaan

#### 📧 **Digital Attendance System**
- ✅ **Token Absensi** 10 digit via email
- ✅ **QR Code Integration** (future enhancement)
- ✅ **Real-time Attendance** tracking
- ✅ **Attendance Verification** otomatis

#### 📱 **User Experience**
- ✅ **Responsive Design** mobile-friendly
- ✅ **Modern UI/UX** dengan Tailwind CSS
- ✅ **Toast Notifications** real-time feedback
- ✅ **Loading States** smooth user experience

### **👨‍💼 FITUR UNTUK ADMIN:**

#### 📊 **Dashboard & Analytics**
- ✅ **Statistics Dashboard** dengan charts
- ✅ **Event Analytics** participation rates
- ✅ **User Management** overview
- ✅ **Real-time Data** updates

#### 🎪 **Event Management (CRUD)**
- ✅ **Create Events** dengan flyer upload
- ✅ **Edit Events** real-time updates
- ✅ **Delete Events** dengan confirmation
- ✅ **Event Status** management

#### 📈 **Reporting & Export**
- ✅ **Excel Export** event data
- ✅ **Participant Lists** per event
- ✅ **Attendance Reports** detailed analytics
- ✅ **Custom Date Ranges** filtering

#### 👥 **User Management**
- ✅ **User Roles** (Admin/Peserta)
- ✅ **User Verification** status
- ✅ **Bulk Operations** efficiency tools

---

## 🏗️ ARSITEKTUR SISTEM

### **Frontend Architecture:**
```
React App (SPA)
├── Components (Reusable UI)
├── Pages (Route Components)
├── Services (API Calls)
├── Hooks (Custom React Hooks)
├── Utils (Helper Functions)
└── Context (State Management)
```

### **Backend Architecture:**
```
Express.js Server
├── Controllers (Business Logic)
├── Models (Database Schema)
├── Routes (API Endpoints)
├── Middleware (Auth, Validation)
├── Utils (Helper Functions)
└── Config (Database, Email)
```

### **Database Schema:**
- **Users** - User accounts and profiles
- **Events** - Event information and metadata
- **Event_Registrations** - User-Event relationships
- **Password_Resets** - Password reset tokens

---

## 🚀 SETUP & INSTALLATION

### 1. Clone Repository
```bash
git clone <your-repo-url>
cd event_rajib
```

### 2. Backend Setup
```bash
cd backend
npm install
```

**Configure Environment:**
1. Copy `.env.example` to `.env`
2. Copy `config/config.json.example` to `config/config.json`
3. Update both files with your actual database credentials

### 3. Frontend Setup
```bash
cd ../frontend
npm install
```

### 4. Database Setup
- Create MySQL database named `event_db`
- Run migrations if available
- Import sample data if needed

### 5. Run Application
**Backend:**
```bash
cd backend
npm start
```

**Frontend:**
```bash
cd frontend
npm run dev
```

## 🔒 Security Notes

**NEVER commit these files to public repositories:**
- `.env` files
- `config/config.json`
- `uploads/` folder contents
- Any files containing passwords, API keys, or sensitive data

**Always use the `.example` files as templates for new deployments.**

## 📝 Environment Variables Required

### Backend (.env)
- `DB_HOST` - Database host
- `DB_USER` - Database username  
- `DB_PASSWORD` - Database password
- `DB_NAME` - Database name
- `JWT_SECRET` - JWT signing secret
- `SESSION_SECRET` - Session secret
- `EMAIL_USER` - Email for notifications
- `EMAIL_PASS` - Email app password
- `FRONTEND_URL` - Frontend URL for CORS

---

**📅 Dibuat:** 2024  
**👨‍💻 Developer:** Rajib  
**🎯 Purpose:** Ujian Kompetensi Keahlian (UKK)  
**🏫 Institution:** Sekolah  

---

*Sistem ini dirancang untuk memenuhi kebutuhan modern pengelolaan event sekolah dengan teknologi terkini dan standar keamanan tinggi.*
