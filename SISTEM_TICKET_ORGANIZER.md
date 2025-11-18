# 🎫 SISTEM TICKET ORGANIZER - DOKUMENTASI LENGKAP

## 📋 OVERVIEW
Sistem ticket di organizer memungkinkan event organizer untuk membuat berbagai kategori tiket dengan harga, diskon, dan kuota yang berbeda.

## 🗄️ DATABASE YANG DIGUNAKAN

### 1. **Tabel `Events`** (Tabel Utama)
```sql
- id (Primary Key)
- judul, deskripsi, tanggal, lokasi, dll
- biaya (DECIMAL) - Harga default/backward compatibility
- kapasitas_peserta (INTEGER) - Total kapasitas dari semua tiket
- created_by (Foreign Key ke Users)
```

### 2. **Tabel `ticket_categories`** (Tabel Baru)
```sql
- id (Primary Key)
- event_id (Foreign Key ke Events)
- name (VARCHAR) - Nama kategori (Early Bird, Regular, VIP)
- description (TEXT) - Deskripsi kategori
- price (DECIMAL) - Harga final setelah diskon
- original_price (DECIMAL) - Harga asli sebelum diskon
- quota (INTEGER) - Kuota tiket untuk kategori ini
- sold_count (INTEGER) - Jumlah tiket terjual
- is_active (BOOLEAN) - Status tersedia/habis
- sale_start_date (DATE) - Tanggal mulai penjualan
- sale_end_date (DATE) - Tanggal berakhir penjualan
- badge_text (VARCHAR) - Text badge (HEMAT 20%)
- badge_color (ENUM) - Warna badge (green, blue, red, yellow, purple)
- sort_order (INTEGER) - Urutan tampilan
```

### 3. **Tabel `EventRegistrations`** (Updated)
```sql
- id (Primary Key)
- user_id (Foreign Key ke Users)
- event_id (Foreign Key ke Events)
- ticket_category_id (Foreign Key ke ticket_categories) - BARU!
- status (ENUM) - pending, confirmed, cancelled, attended
```

## 🔄 ALUR KERJA SISTEM

### **1. FRONTEND (CreateEvent.jsx)**
```javascript
// State untuk menyimpan ticket categories
const [ticketCategories, setTicketCategories] = useState([
  {
    id: 1,
    name: 'Early Bird',
    description: 'Penawaran khusus...',
    price: 0,
    originalPrice: 6000,
    discount: 20,
    quota: 50,
    isDefault: false,
    isAvailable: true,
    salesStart: '',
    salesEnd: ''
  },
  {
    id: 2,
    name: 'Regular',
    description: 'Tiket regular...',
    price: 0,
    originalPrice: 0,
    discount: 0,
    quota: 100,
    isDefault: true,
    isAvailable: true
  }
]);

// Kirim ke backend sebagai JSON string
formDataToSend.append('ticketCategories', JSON.stringify(ticketCategories));
```

### **2. BACKEND (organizerController.js)**
```javascript
// Terima data dari frontend
const { ticketCategories } = req.body;

// Parse JSON string
const parsedTicketCategories = JSON.parse(ticketCategories);

// Transform dan simpan ke database
const ticketCategoryData = parsedTicketCategories.map((ticket, index) => ({
  event_id: event.id,
  name: ticket.name,
  description: ticket.description,
  price: ticket.discount > 0 
    ? Math.floor(ticket.originalPrice * (100 - ticket.discount) / 100)
    : ticket.price,
  original_price: ticket.originalPrice > 0 ? ticket.originalPrice : null,
  quota: ticket.quota,
  sold_count: 0,
  is_active: ticket.isAvailable,
  badge_text: ticket.discount > 0 ? `HEMAT ${ticket.discount}%` : null,
  badge_color: ticket.discount > 0 ? 'green' : null,
  sort_order: index + 1
}));

await TicketCategory.bulkCreate(ticketCategoryData);
```

### **3. FRONTEND CONFIRMATION (EventConfirmation.jsx)**
```javascript
// Ambil ticket categories dari backend
const categoriesResponse = await eventsAPI.getTicketCategories(eventId);
setTicketCategories(categoriesResponse.data.data || []);

// Transform untuk display
const ticketTypes = ticketCategories.map(category => ({
  id: category.id.toString(),
  name: category.name,
  price: parseFloat(category.price),
  originalPrice: category.original_price,
  description: category.description,
  status: category.is_active ? 'Tersedia' : 'Habis',
  available: category.is_active,
  badge: category.badge_text,
  badgeColor: category.badge_color
}));
```

## 📊 CONTOH DATA FLOW

### **Input dari Organizer:**
```javascript
{
  name: "Early Bird",
  originalPrice: 100000,
  discount: 20,
  quota: 50,
  description: "Penawaran khusus early bird"
}
```

### **Disimpan ke Database:**
```sql
INSERT INTO ticket_categories VALUES (
  event_id: 1,
  name: "Early Bird",
  price: 80000,           -- 100000 - (100000 * 20/100)
  original_price: 100000,
  quota: 50,
  badge_text: "HEMAT 20%",
  badge_color: "green",
  is_active: true
);
```

### **Ditampilkan ke User:**
```javascript
{
  name: "Early Bird",
  price: 80000,
  originalPrice: 100000,
  badge: "HEMAT 20%",
  badgeColor: "green",
  status: "Tersedia"
}
```

## 🚀 STATUS IMPLEMENTASI

### ✅ **SUDAH SELESAI:**
- Frontend UI untuk membuat ticket categories
- Backend processing dan penyimpanan ke database
- Model dan migration untuk ticket_categories
- API endpoint untuk mengambil ticket categories
- Dynamic display di halaman konfirmasi

### 🔧 **PERLU DIJALANKAN:**
1. **Migration:**
   ```bash
   cd backend
   npx sequelize-cli db:migrate
   ```

2. **Restart Server:**
   ```bash
   npm start
   ```

3. **Test Create Event:** Buat event baru dengan ticket categories

## 🎯 HASIL AKHIR

Sekarang ketika organizer membuat event:
1. **UI Ticket Categories** akan muncul di CreateEvent.jsx
2. **Data tersimpan** ke tabel `ticket_categories`
3. **User melihat** kategori dinamis di halaman konfirmasi
4. **Registrasi** akan mencatat `ticket_category_id` yang dipilih

**Database ticket sudah terintegrasi penuh dengan sistem event!** 🎉
