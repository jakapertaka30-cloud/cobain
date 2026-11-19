# Dashboard Kartu Riwayat Maintenance – PT Gardena Furniture

Aplikasi web statis (tanpa server, tanpa instalasi) untuk mencatat dan memantau riwayat maintenance peralatan produksi.

## Struktur
```
gardena-maintenance/
├── index.html      Kerangka halaman, tabel, dan form dialog
├── css/style.css   Seluruh tampilan (mendukung mode terang/gelap dan cetak)
├── js/data.js      Data master 21 peralatan, jadwal PM (Tabel 3.10), data awal (Tabel 3.9)
├── js/app.js       Logika: KPI, grafik, filter, form input, ekspor CSV, penyimpanan
└── README.md
```

## Cara pakai
1. Buka `index.html` di browser (klik dua kali). Tidak perlu server.
2. Klik **+ Catat Maintenance** untuk menambah catatan baru.
3. **Ekspor CSV** untuk membuka data di Excel. **Cetak Kartu** untuk mencetak.
4. **Reset Data** mengembalikan ke data laporan KP.

## Penyimpanan data
Data tersimpan di `localStorage` browser (kunci `gardena_mtn_v2`), jadi hanya ada di browser dan perangkat yang dipakai.
Untuk dipakai bersama banyak orang, backend/database perlu ditambahkan (lihat saran di bawah).

## Cara mengubah data
- Tambah/ubah peralatan atau frekuensi PM: edit `NAMA_PERALATAN` dan `FREKUENSI_PM` di `js/data.js`.
- Ubah data awal laporan: edit `DATA_AWAL` di `js/data.js`, lalu klik Reset Data.

## Catatan
- Entri No. 16 tidak ada di laporan, jadi total di dashboard (17 entri) sedikit di bawah total laporan (18 catatan).
- Skrip dimuat dengan urutan `data.js` lalu `app.js` dan tidak memakai ES module, supaya tetap jalan saat dibuka lewat `file://`.

## Pengembangan lanjutan (opsional)
Backend (Node/Express + SQLite/PostgreSQL) agar data terpusat, login per peran (Operator, Staff Maintenance, SPV), pengingat jadwal PM otomatis, dan unggah foto kerusakan.
