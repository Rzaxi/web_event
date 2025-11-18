# Auto Logout System

## Overview
Sistem auto logout yang simple dan efisien untuk semua role (Admin, User, Event Organizer) dengan timeout 1 jam tanpa peringatan.

## Features
- ✅ Auto logout setelah 1 jam tidak ada aktivitas
- ✅ Berlaku untuk semua role (Admin, User, Event Organizer)  
- ✅ Tidak ada peringatan - langsung logout
- ✅ Redirect otomatis ke halaman login yang sesuai
- ✅ Clear semua data session dan localStorage
- ✅ JWT token expiration 1 jam

## How It Works

### Frontend
1. **AutoLogoutProvider** - Wrapper component yang menangani auto logout
2. **useAutoLogout hook** - Hook yang mendeteksi aktivitas user
3. **Activity Detection** - Monitor mouse, keyboard, scroll, touch events
4. **API Interceptor** - Handle 401/403 response untuk auto logout

### Backend
1. **JWT Token** - Expired dalam 1 jam
2. **Session Management** - Track last activity
3. **Middleware** - Validate token dan session

## Implementation

### Files Created/Modified:
- `hooks/useAutoLogout.js` - Main auto logout logic
- `components/common/AutoLogoutProvider.jsx` - Context provider
- `components/common/SessionStatus.jsx` - Optional status display
- `services/api.js` - Updated interceptor
- `App.jsx` - Wrapped with AutoLogoutProvider
- `controllers/authController.js` - JWT expiration 1h
- `controllers/adminController.js` - JWT expiration 1h

### Activity Events Monitored:
- mousedown, mousemove
- keypress, keydown  
- scroll, touchstart
- click

### Auto Logout Triggers:
- No activity for 1 hour
- JWT token expired (401 response)
- Session expired (403 response)
- API call with invalid token

### Redirect Logic:
- `/admin/*` pages → `/admin/login`
- `/organizer/*` pages → `/login`
- Other pages → `/login`

## Usage

Auto logout sudah aktif secara otomatis untuk semua user yang login. Tidak perlu konfigurasi tambahan.

### Optional: Show Session Status (Development)
```jsx
import SessionStatus from './components/common/SessionStatus';

// Add to any component for testing
<SessionStatus show={true} />
```

## Configuration

### Timeout Duration
```javascript
// hooks/useAutoLogout.js
const TIMEOUT_DURATION = 60 * 60 * 1000; // 1 hour
```

### JWT Expiration
```javascript
// backend controllers
{ expiresIn: '1h' }
```

## Testing

1. Login ke sistem
2. Tunggu 1 jam tanpa aktivitas
3. Atau set timeout lebih pendek untuk testing
4. User akan otomatis logout dan redirect ke login

## Security Benefits

- ✅ Prevent unauthorized access pada session yang ditinggalkan
- ✅ Reduce risk of session hijacking
- ✅ Comply dengan security best practices
- ✅ Automatic cleanup of sensitive data
