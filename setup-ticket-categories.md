# Setup Ticket Categories

## Langkah-langkah untuk mengaktifkan fitur kategori tiket dinamis:

### 1. Jalankan Migration
```bash
cd backend
npx sequelize-cli db:migrate
```

### 2. Jalankan Seeder (Opsional - untuk event yang sudah ada)
```bash
npx sequelize-cli db:seed --seed 20241111000000-create-default-ticket-categories.js
```

### 3. Restart Server Backend
```bash
npm start
```

## Fitur yang Ditambahkan:

### Backend:
- ✅ Model `TicketCategory` dengan field lengkap
- ✅ Migration untuk tabel `ticket_categories`
- ✅ Migration untuk menambah `ticket_category_id` ke `EventRegistrations`
- ✅ Controller `ticketCategoryController` untuk CRUD
- ✅ Routes untuk public dan organizer
- ✅ Auto-create default categories jika belum ada

### Frontend:
- ✅ API function `getTicketCategories()`
- ✅ Dynamic ticket categories di `EventConfirmation.jsx`
- ✅ Badge dengan warna dinamis
- ✅ Quota display
- ✅ Status availability

### Struktur Data Ticket Category:
```javascript
{
  id: 1,
  event_id: 1,
  name: "Early Bird",
  description: "Penawaran khusus...",
  price: 80000,
  original_price: 100000,
  quota: 50,
  sold_count: 25,
  is_active: true,
  badge_text: "HEMAT 20%",
  badge_color: "green",
  sort_order: 1
}
```

## Testing:
1. Buka halaman konfirmasi event
2. Kategori tiket akan muncul dinamis sesuai data backend
3. Jika belum ada kategori, akan auto-create Early Bird (habis) dan Regular (tersedia)
