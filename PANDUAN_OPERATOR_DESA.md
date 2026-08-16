# BUKU PANDUAN PENGGUNAAN SISTEM "JOMBE DIGITAL"
**Pelayanan Administrasi Desa Jombe dalam Genggaman**
*Program Kerja Pengabdian Mahasiswa KKN - Pemerintah Desa Jombe, Kec. Jombang*

---

## 🔑 1. Akun Masuk Petugas Operator Desa
* **Alamat Web:** `http://localhost:3000/login`
* **Email Operator:** `operator@jombe.desa.id`
* **Kata Sandi:** `operator123`
* **Peran:** Petugas Operator Layanan Kantor Desa

---

## 🚀 2. Cara Menyalakan Sistem Setiap Hari
1. Nyalakan Komputer Kantor Desa.
2. Klik 2x pada file pintasan di Desktop: **`JALANKAN_SISTEM.bat`**.
3. Sistem akan otomatis menyalakan server dan membuka layar kerja Operator di browser web.

---

## 📝 3. Alur Kerja Pemeriksaan Permohonan Surat
1. **Melihat Permohonan Baru:**
   * Di tabel utama, permohonan yang masuk dari WhatsApp/Web warga berstatus **`PENDING`**.
   * Klik tombol hijau **`Periksa Permohonan & Foto`**.
2. **Memeriksa Keabsahan Dokumen & Foto (Tab 1):**
   * Periksa rincian data NIK, Nama, dan Keperluan Surat.
   * Klik foto e-KTP atau foto tempat usaha warga untuk **memperbesar (*Lightbox Zoom*)** dan mencocokkan keaslian data.
3. **Penerbitan Surat Balasan Resmi (Tab 2):**
   * Klik **Tab 2 ("Surat Balasan Keterangan Resmi")**.
   * Periksa draf surat balasan (SKU/Domisili/SKTM) yang telah otomatis dibuat oleh sistem.
   * (Opsional) Klik tombol **`Edit Surat`** jika ingin menambahkan kalimat khusus atau mengubah nomor surat manual.
4. **Menyetujui & Mengirimkan ke WhatsApp Warga:**
   * Klik tombol **`[ ✓ IYA (Setujui & Terbitkan Surat Balasan SKU ke WhatsApp Warga) ]`**.
   * Sistem secara otomatis mengunci surat, mencetak format PDF resmi dengan kop desa, dan **mengirimkan notifikasi serta berkas PDF surat langsung ke nomor WhatsApp warga yang bersangkutan**.

---

## 🔒 4. Keamanan Data & Kerahasiaan Dokumen
* Seluruh berkas foto KTP, Kartu Keluarga, dan dokumen warga dilindungi dengan enkripsi berlapis **AES-256-GCM**.
* Dokumen tidak dapat diakses atau diunduh oleh pihak luar yang tidak memiliki izin resmi dari Kantor Desa Jombe.
