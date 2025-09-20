# 📦 Shopee Order Scanner (Chrome Extension)

Ekstensi Chrome sederhana untuk **ambil & copy data pesanan Shopee** langsung dari halaman **Shopee Seller Webchat**
👉 URL target: `https://seller.shopee.co.id/new-webchat/conversations*`

---

## ✨ Fitur

* **Scan otomatis** data pesanan dari DOM:

  * Username → `.UcYjICexD_`
  * Status → `.WTLtNaavkx`
  * Tanggal → `.BwOxlj0Ouf`
  * Order ID → `.RdfdqXn1AI`
* **Panel mengambang** di pojok kanan atas
* **Tombol copy (4 mode)** per pesanan:

  1. `username + 5 char akhir orderId`
  2. `username+last5` + enter kosong + `tanggal` + `orderId` + `username`
  3. `status` + `tanggal` + `orderId` + `username`
  4. `username` saja
* **Status berwarna** untuk memudahkan identifikasi:

  * 🟠 Dikemas
  * 🟢 Selesai
  * 🔴 Dibatalkan
  * 🔵 Dikirim
  * ⚫ Belum dibayar
* **Auto refresh** saat ada pesanan baru (pakai MutationObserver + interval 2 detik)
* **Collapse / expand** panel dengan tombol ▲/▼
* **Debug mode (?)** → cetak semua data order ke **Console**

---

## 📥 Instalasi

1. Download ZIP dari [Release](./releases) atau build sendiri
2. Ekstrak file ZIP
3. Buka `chrome://extensions/` (atau `edge://extensions/`)
4. Aktifkan **Developer mode**
5. Klik **Load unpacked** → pilih folder hasil ekstrak
6. Buka halaman: [Shopee Seller Webchat](https://seller.shopee.co.id/new-webchat/conversations)
7. Panel **Shopee Orders** akan muncul di kanan atas

---

## 🖼️ Tampilan

*(screenshot bisa kamu taruh di sini nanti)*
![Shopee Order Scanner Screenshot](docs/screenshot.png)

---

## ⚙️ Struktur Proyek

```
shopee-order-scanner/
├── manifest.json     # Konfigurasi ekstensi
├── content.js        # Script utama (scan & render UI)
├── content.css       # Style panel
├── icon16.png
├── icon48.png
├── icon128.png
└── README.md
```

---

## 🚀 Pengembangan

* Edit file `content.js` & `content.css` sesuai kebutuhan
* Setelah edit, reload ekstensi di `chrome://extensions/`

---

## 📜 Lisensi

MIT License – bebas dipakai & dimodifikasi.

---
