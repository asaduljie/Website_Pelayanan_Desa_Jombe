# JOMBE DIGITAL - Sistem Pelayanan Digital Desa Jombe

> "Pelayanan Desa Jombe dalam Genggaman — Lebih Mudah, Cepat, dan Transparan."

Platform pelayanan administrasi publik digital terpadu untuk **Desa Jombe, Kecamatan Jombang**. Memungkinkan warga mengajukan permohonan surat administrasi secara online, melacak status secara real-time, mengunggah dokumen persyaratan, mengunduh hasil surat PDF resmi, menyampaikan pengaduan masyarakat, serta memanfaatkan AI Assistant untuk panduan informasi desa.

---

## 🚀 Fitur Utama Sistem

### 1. Website Masyarakat & Mobile App (Android Flutter)
- **Satu Database, Satu Backend API**: Integrasi realtime antara Website Next.js dan Mobile App Flutter.
- **Katalog Layanan & Form Dinamis**: Surat Keterangan Usaha (SKU), Surat Domisili, SKTM, Surat Pengantar, dll.
- **Real-Time Tracking Permohonan**: Lacak status via Nomor Permohonan (`JMB-2026-XXXXX`).
- **Private Document Vault & Stream Gateway**: Pengunggahan berkas terenkripsi dengan otorisasi ketat & temporary signed token (5 menit).
- **Pengaduan Masyarakat**: Fitur pelaporan masalah jalan, sampah, penerangan jalan, & fasilitas umum.
- **AI Assistant Pelayanan Desa**: Asisten pintar yang menjawab informasi dan memandu pembuatan surat.

### 2. Dashboard Operator Desa
- **Real-Time Overview & Analytics**: Pantau permohonan baru, perbaikan, & permohonan selesai.
- **Verifikasi Berkas Warga**: Peninjauan dokumen KTP/KK, ubah status (`VERIFIED`, `PROCESSING`, `NEED_REVISION`, `COMPLETED`, `REJECTED`).
- **Automatic PDF Letter Generator**: Generate surat resmi ber-kop Desa Jombe dari data pemohon.
- **PLAN B (Bantuan Input Warga WA/Offline)**: Fitur khusus operator untuk membantu warga lansia / awam teknologi menginput permohonan & mengirimkan tanda terima otomatis via WhatsApp.

### 3. Dashboard Admin & Kepala Desa
- **Monitoring & Audit Log**: Pencatatan jejak digital mutlak setiap pembacaan data NIK/dokumen warga (Zero Trust Security).
- **Manajemen Layanan & Form Builder**: Pengaturan jenis surat & field dinamis tanpa koding ulang.

---

## 🔒 Arsitektur Keamanan (Zero Trust & OWASP Top 10)

1. **AES-256-GCM Encryption**: Data PII (NIK, KK, HP) terenkripsi simetris di database PostgreSQL.
2. **Password Security**: Hashing Argon2id / Bcrypt Cost 12.
3. **Proteksi BOLA/IDOR**: Dual-check otorisasi bahwa warga hanya bisa melihat permohonan miliknya sendiri.
4. **Strict Binary Magic Bytes Check**: Pengecekan signature file upload (PDF/JPG/PNG) untuk menggagalkan skrip jahat/Web Shell.
5. **Rate Limiting & Security Headers**: Helmet.js, IP Throttling, & Cloudflare WAF Ready.
6. **SSL Pinning**: Komunikasi Flutter Android dikunci ke certificate server resmi.

---

## 💻 Tech Stack

- **Frontend Web**: Next.js 14 (App Router), TypeScript, Tailwind CSS, Lucide Icons, Axios.
- **Backend API**: Node.js, Express.js, TypeScript, Prisma ORM, JWT, Multer, PDFKit.
- **Database**: PostgreSQL (Relational & Scalable).
- **Mobile App**: Flutter (Dart), `flutter_secure_storage`.

---

## 📂 Struktur Project

```text
kkn desa/
├── backend/            # Express TypeScript API, Prisma Schema, Seed, Controllers & Services
├── frontend/           # Next.js 14 Web Application (Masyarakat, Operator & Admin)
└── mobile/             # Flutter Android Mobile Application
```

---

## 🛠️ Panduan Jalankan Proyek (Development)

### 1. Backend API
```bash
cd backend
npm install
npx prisma generate
# (Pastikan PostgreSQL aktif di localhost:5432)
npx prisma db push
npx prisma db seed
npm run dev
# Running on http://localhost:5000/api
```

### 2. Frontend Next.js
```bash
cd frontend
npm install
npm run dev
# Running on http://localhost:3000
```

### 3. Mobile App Flutter
```bash
cd mobile
flutter pub get
flutter run
```

### Menjaga sesi WhatsApp tetap terhubung

Jalankan backend WhatsApp pada server Node.js yang selalu hidup (misalnya PC kantor dengan PM2, VPS, Railway/Render dengan persistent disk), bukan function serverless. Tambahkan variabel berikut pada environment backend dan arahkan ke volume/disk yang **tidak dihapus saat restart**:

```env
WHATSAPP_AUTH_DIR=/data/jombe-whatsapp-session
```

Pada Windows lokal, gunakan path tetap, misalnya `C:\JombeData\whatsapp-session`. Setelah satu kali scan QR/kode pairing, kredensial sesi akan dimuat ulang otomatis ketika browser, backend, atau laptop dinyalakan kembali. Sesi hanya dihapus oleh tombol **Putuskan Sesi** (atau jika WhatsApp sendiri membatalkan perangkat tertaut).

> Vercel tidak dapat menjadi host engine WhatsApp 24/7 karena filesystem function-nya sementara dan koneksi proses panjang dihentikan. Frontend boleh di Vercel, tetapi backend/engine WhatsApp harus berada di layanan persistent di atas.

---

## 🔑 Akun Demo Testing

| Role | NIK | Password | Akses |
|---|---|---|---|
| **Warga Demo** | `3512345678900001` | `password123` | Web Warga / Flutter App |
| **Operator Desa** | `3512345678900009` | `password123` | `/operator` (Web Operator) |
| **Admin / Kades** | `3512345678900000` | `password123` | `/operator` / `/admin` |

---
© {new Date().getFullYear()} Pemerintah Desa Jombe, Kecamatan Jombang.
