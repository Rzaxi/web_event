# 🔍 QR Scanner Debug Guide

## Masalah: Scanner Stuck di "Memuat scanner..."

### ✅ **PERBAIKAN YANG SUDAH DILAKUKAN:**

1. **Explicit Permission Check**
   - Scanner sekarang request permission kamera secara explicit
   - Timeout 10 detik untuk permission request
   - Error message yang spesifik untuk setiap jenis error

2. **Console Logging**
   - Semua proses scanner di-log dengan prefix `[Scanner]`
   - Buka Console (tekan F12) untuk melihat apa yang terjadi

3. **Better Timeout Handling**
   - 10 detik timeout untuk camera permission
   - 12 detik fallback timeout total
   - Loading state bisa di-cancel kapan saja

4. **User Feedback**
   - Instruksi jelas saat loading
   - Error message yang actionable
   - Tombol "Gunakan Input Manual" selalu tersedia

---

## 🔧 **CARA DEBUG:**

### 1. Buka Console Browser (F12)
Perhatikan log yang muncul dengan format:
```
[Scanner] Initializing...
[Scanner] Requesting camera permission...
[Scanner] Camera permission granted
[Scanner] Rendering scanner UI...
[Scanner] Scanner rendered, waiting for camera...
[Scanner] Scanner ready
```

### 2. Cek Error yang Muncul

#### Error: "MediaDevices not supported"
- **Penyebab:** Browser terlalu lama / tidak support WebRTC
- **Solusi:** Update browser atau gunakan Chrome/Firefox terbaru

#### Error: "Akses kamera ditolak"
- **Penyebab:** User klik "Block" di popup permission
- **Solusi:** 
  1. Klik ikon kamera di address bar (sebelah kiri)
  2. Pilih "Izinkan" / "Allow"
  3. Refresh halaman

#### Error: "Kamera tidak ditemukan"
- **Penyebab:** Laptop tidak punya kamera atau kamera disable
- **Solusi:** 
  1. Cek Device Manager apakah kamera terdeteksi
  2. Pastikan kamera tidak di-disable di BIOS/Windows
  3. Gunakan Input Manual sebagai alternatif

#### Error: "Permission timeout"
- **Penyebab:** User tidak respond popup permission dalam 10 detik
- **Solusi:** 
  1. Coba lagi dan langsung klik "Izinkan"
  2. Refresh halaman jika popup tidak muncul

#### Error: "Scanner timeout"
- **Penyebab:** Scanner library gagal initialize dalam 12 detik
- **Solusi:**
  1. Refresh halaman
  2. Tutup aplikasi lain yang menggunakan kamera (Zoom, Teams, dll)
  3. Gunakan Input Manual

---

## 📋 **CHECKLIST TROUBLESHOOTING:**

- [ ] Buka di `http://localhost:3001` (bukan IP address)
- [ ] Browser adalah Chrome/Firefox terbaru
- [ ] Kamera laptop berfungsi (test di aplikasi Camera Windows)
- [ ] Tidak ada aplikasi lain yang menggunakan kamera
- [ ] Popup permission browser muncul dan diklik "Izinkan"
- [ ] Console (F12) menunjukkan log `[Scanner]`
- [ ] Tidak ada error di Console

---

## 🚀 **JIKA MASIH STUCK:**

1. **Test kamera dengan cara lain:**
   - Buka camera app Windows
   - Pastikan kamera berfungsi

2. **Test permission browser:**
   - Ketik di address bar: `chrome://settings/content/camera`
   - Pastikan localhost tidak di-block

3. **Clear browser cache:**
   - Settings → Privacy → Clear browsing data
   - Pilih "Cached images and files"

4. **Gunakan alternatif:**
   - Klik tombol "Input Manual" 
   - Masukkan kode 10 digit dari e-ticket
   - Sama efektifnya dengan scan QR

---

## 💡 **INFO TAMBAHAN:**

### Kenapa Scanner Butuh Permission?
Browser perlu izin eksplisit untuk akses kamera karena privasi & keamanan.

### Kenapa Stuck di Loading?
Kemungkinan:
1. Popup permission tidak muncul (di-block oleh browser)
2. User tidak klik "Izinkan" 
3. Kamera sedang dipakai aplikasi lain
4. Browser compatibility issue

### Solusi Terbaik?
**Gunakan Input Manual!** Sama cepat dan reliable, tidak perlu permission kamera.

---

## 📞 **CONTACT:**

Jika masih ada masalah setelah mengikuti semua langkah di atas:
1. Screenshot Console (F12) yang menunjukkan error
2. Screenshot popup permission yang muncul
3. Info browser dan OS version
