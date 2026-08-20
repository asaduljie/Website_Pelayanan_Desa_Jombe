# 🚀 PANDUAN LENGKAP DEPLOY: VERCEL + SUPABASE
## Website Pelayanan Digital Desa Jombe ("JOMBE DIGITAL")

Panduan ini berisi langkah-langkah praktis untuk mempublikasikan website Desa Jombe secara online gratis menggunakan **Vercel** (untuk Web Frontend Next.js) dan **Supabase** (untuk Database PostgreSQL Cloud).

---

### 📦 BAGIAN 1: SETUP SUPABASE (DATABASE CLOUD)

1. **Buka & Login ke Supabase**:
   * Kunjungi [https://supabase.com](https://supabase.com) dan login menggunakan akun GitHub Anda.

2. **Buat Proyek Baru (*New Project*)**:
   * Klik tombol **"New Project"**.
   * **Name**: `Desa-Jombe-Digital`
   * **Database Password**: Buat password yang kuat (dan simpan/catat!).
   * **Region**: Pilih `Singapore (ap-southeast-1)` (Paling cepat untuk Indonesia).
   * Klik **"Create new project"** (tunggu 1-2 menit hingga status *Active*).

3. **Ambil Connection String Database**:
   * Masuk ke menu **Project Settings** (ikon gerigi di kiri bawah) ➔ **Database**.
   * Gulir ke bagian **Connection String** ➔ Pilih tab **URI**.
   * Salin string koneksinya:
     ```env
     DATABASE_URL="postgresql://postgres:[PASSWORD-ANDA]@db.[PROJECT-REF].supabase.co:5432/postgres"
     ```

4. **Kirim Skema Database ke Supabase (Migration)**:
   * Di komputer lokal Anda, buka terminal di folder `backend`:
     ```bash
     cd backend
     npx prisma db push
     npx prisma db seed
     ```
   * *Tabel pengguna, layanan surat, berita, dan pengaduan langsung otomatis terisi di Supabase!*

---

### ⚡ BAGIAN 2: DEPLOY FRONTEND KE VERCEL

1. **Buka & Login ke Vercel**:
   * Kunjungi [https://vercel.com](https://vercel.com) dan login dengan akun GitHub Anda.

2. **Impor Repositori GitHub**:
   * Klik tombol **"Add New..."** ➔ **"Project"**.
   * Cari repositori: `Website_Pelayanan_Desa_Jombe` dan klik **"Import"**.

3. **Konfigurasi Proyek di Vercel**:
   * **Root Directory**: Klik *Edit* dan pilih folder **`frontend`** (Sangat Penting!).
   * **Framework Preset**: Pilih **`Next.js`**.
   * **Build Command**: `next build` (default).
   * **Output Directory**: `.next` (default).

4. **Isi Environment Variables di Vercel**:
   * Buka bagian **Environment Variables** dan tambahkan:
     | Key / Nama Variabel | Nilai / Value |
     | :--- | :--- |
     | `NEXT_PUBLIC_API_URL` | URL backend server Anda (misal: `https://api-desa-jombe.railway.app/api` atau `http://localhost:5000/api`) |
     | `NEXT_PUBLIC_APP_NAME` | `JOMBE DIGITAL - Pelayanan Desa Jombe` |

5. **Klik Tombol "Deploy"**:
   * Tunggu sekitar 1–2 menit hingga proses *building* selesai.
   * Website Desa Jombe Anda langsung resmi aktif dengan domain gratis, misalnya:
     👉 **`https://website-pelayanan-desa-jombe.vercel.app`**

---

### 🛡️ Catatan WhatsApp Bot & Supabase Keep-Alive:
* **Web Portal Warga & Operator**: Berjalan 100% online di cloud Vercel + Supabase 24/7.
* **WhatsApp Engine (Baileys)**: Karena Baileys memerlukan soket koneksi WhatsApp yang terus menyala (*persistent daemon*), Anda cukup menjalankan file **`START_SERVER_PERMANEN.bat`** di komputer kantor desa. Server desa akan otomatis terhubung ke database Supabase dan menjaga Supabase selalu aktif tanpa pernah di-pause! 🚀
