import { Request, Response } from 'express';
import prisma from '../config/db';

export interface AiTopic {
  id: string;
  title: string;
  keywords: string[];
  reply: string;
  actionButton?: { label: string; url: string };
}

export const AI_KNOWLEDGE_BASE: AiTopic[] = [
  {
    id: 'sku',
    title: 'Surat Keterangan Usaha (SKU)',
    keywords: ['sku', 'usaha', 'dagang', 'warung', 'toko', 'kios', 'jualan', 'kur', 'modal', 'umkm', 'bisnis', 'izin usaha', 'keterangan usaha', 'kredit usaha', 'bank'],
    reply: `Informasi Surat Keterangan Usaha (SKU):\n\nSurat Keterangan Usaha (SKU) dipergunakan untuk keperluan legalitas usaha, pengajuan permodalan/KUR di perbankan, perizinan dagang, maupun pendataan bantuan UMKM.\n\n📋 Persyaratan Berkas Dokumen:\n• Foto e-KTP Pemohon asli\n• Foto Kartu Keluarga (KK)\n• Foto Tempat / Aktivitas Usaha di wilayah Desa Jombe\n\n⏱️ Estimasi Waktu Proses: 1 Hari Kerja.\n💰 Biaya: GRATIS (Rp 0,-).\n\nSetelah diajukan dan diverifikasi operator, berkas PDF siap dicetak untuk dibubuhi tanda tangan basah Kepala Desa Jombe (JUSMAEDY, S.Pd) serta cap stempel kantor desa.`,
    actionButton: { label: 'Ajukan SKU Sekarang', url: '/layanan/surat-keterangan-usaha' },
  },
  {
    id: 'sktm',
    title: 'Surat Keterangan Kurang Mampu (SKTM)',
    keywords: ['sktm', 'tidak mampu', 'kurang mampu', 'miskin', 'beasiswa', 'kip', 'kuliah', 'sekolah', 'bantuan', 'bansos', 'keringanan', 'rumah sakit', 'bpjs', 'kis', 'pengobatan'],
    reply: `Informasi Surat Keterangan Kurang Mampu (SKTM):\n\nSKTM diterbitkan bagi warga Desa Jombe yang membutuhkan surat pengantar resmi untuk pengajuan beasiswa pendidikan (KIP Kuliah/Sekolah), keringanan biaya rumah sakit, maupun pendaftaran program jaminan sosial pemerintah.\n\n📋 Persyaratan Berkas Dokumen:\n• Foto e-KTP Pemohon / Kepala Keluarga\n• Foto Kartu Keluarga (KK)\n• Keterangan keperluan pemohon\n\n⏱️ Estimasi Waktu Proses: 1 Hari Kerja.\n💰 Biaya: GRATIS (Rp 0,-).`,
    actionButton: { label: 'Ajukan SKTM Sekarang', url: '/layanan/surat-keterangan-tidak-mampu' },
  },
  {
    id: 'domisili',
    title: 'Surat Keterangan Domisili',
    keywords: ['domisili', 'tempat tinggal', 'tinggal', 'alamat', 'pindah', 'surat domisili', 'keterangan domisili', 'kost', 'kontrak', 'menetap', 'warga baru'],
    reply: `Informasi Surat Keterangan Domisili:\n\nSurat Keterangan Domisili menerangkan secara sah bahwa warga yang bersangkutan bertempat tinggal dan menetap di salah satu dusun di wilayah Desa Jombe, Kecamatan Turatea.\n\n📋 Persyaratan Berkas Dokumen:\n• Foto e-KTP Pemohon\n• Foto Kartu Keluarga (KK)\n• Alamat jelas tempat tinggal di Desa Jombe\n\n⏱️ Estimasi Waktu Proses: 1 Hari Kerja.\n💰 Biaya: GRATIS (Rp 0,-).`,
    actionButton: { label: 'Ajukan Surat Domisili', url: '/layanan/surat-keterangan-domisili' },
  },
  {
    id: 'skkb',
    title: 'Surat Keterangan Kelakuan Baik (SKKB / SKCK)',
    keywords: ['skkb', 'skck', 'kelakuan baik', 'polisi', 'polsek', 'polres', 'lamar kerja', 'pekerjaan', 'bumn', 'cpns', 'swasta', 'pengantar skck', 'pidana', 'kriminal'],
    reply: `Informasi Surat Keterangan Kelakuan Baik (SKKB / SKCK):\n\nSKKB merupakan surat pengantar resmi desa untuk menerangkan bahwa pemohon berkelakuan baik dan tidak sedang tersangkut perkara kriminal, biasa digunakan untuk syarat penerbitan SKCK di kepolisian maupun kelengkapan melamar kerja.\n\n📋 Persyaratan Berkas Dokumen:\n• Foto e-KTP Pemohon\n• Foto Kartu Keluarga (KK)\n• Keterangan instansi/tujuan pengajuan\n\n⏱️ Estimasi Waktu Proses: 1 Hari Kerja.\n💰 Biaya: GRATIS (Rp 0,-).`,
    actionButton: { label: 'Ajukan SKKB / SKCK', url: '/layanan/surat-keterangan-kelakuan-baik' },
  },
  {
    id: 'belum_menikah',
    title: 'Surat Keterangan Belum Menikah',
    keywords: ['belum menikah', 'belum kawin', 'lajang', 'single', 'bujang', 'gadis', 'nikah', 'kua', 'pernikahan', 'tni', 'polri', 'ikatan dinas', 'kawin'],
    reply: `Informasi Surat Keterangan Belum Menikah:\n\nSurat ini menyatakan status pemohon belum pernah melangsungkan pernikahan, biasa digunakan untuk kelengkapan administrasi berkas nikah di KUA, pendaftaran TNI/Polri, ikatan dinas, maupun persyaratan kerja.\n\n📋 Persyaratan Berkas Dokumen:\n• Foto e-KTP Pemohon\n• Foto Kartu Keluarga (KK)\n• Pernyataan status lajang\n\n⏱️ Estimasi Waktu Proses: 1 Hari Kerja.\n💰 Biaya: GRATIS (Rp 0,-).`,
    actionButton: { label: 'Ajukan Ket. Belum Menikah', url: '/layanan/surat-keterangan-belum-menikah' },
  },
  {
    id: 'wali',
    title: 'Surat Keterangan Wali',
    keywords: ['wali', 'surat wali', 'perwalian', 'anak', 'sekolah', 'kuliah', 'wali nikah', 'orang tua wali', 'asuh', 'wali murid', 'ijazah'],
    reply: `Informasi Surat Keterangan Wali:\n\nSurat Keterangan Wali menerangkan hubungan perwalian yang sah antara orang tua/wali dengan anak untuk keperluan pendaftaran pendidikan sekolah/kampus, wali nikah, maupun urusan administrasi hukum.\n\n📋 Persyaratan Berkas Dokumen:\n• Foto e-KTP Wali Pemohon\n• Foto Kartu Keluarga (KK)\n• Akta Kelahiran atau identitas anak/pihak yang diwali\n\n⏱️ Estimasi Waktu Proses: 1 Hari Kerja.\n💰 Biaya: GRATIS (Rp 0,-).`,
    actionButton: { label: 'Ajukan Surat Wali', url: '/layanan/surat-keterangan-wali' },
  },
  {
    id: 'kendaraan',
    title: 'Surat Keterangan Kepemilikan Kendaraan Bermotor',
    keywords: ['kendaraan', 'motor', 'mobil', 'stnk', 'bpkb', 'samsat', 'pajak', 'jual beli motor', 'hilang stnk', 'kepemilikan kendaraan', 'sepeda motor'],
    reply: `Informasi Surat Keterangan Kepemilikan Kendaraan Bermotor:\n\nSurat ini menerangkan kepemilikan sah atas kendaraan bermotor roda 2 atau roda 4 di wilayah Desa Jombe, digunakan untuk pengurusan Samsat, bukti kepemilikan, atau dokumen pelengkap kehilangan STNK/BPKB.\n\n📋 Persyaratan Berkas Dokumen:\n• Foto e-KTP Pemilik Kendaraan\n• Foto Kartu Keluarga (KK)\n• Rincian nomor polisi (Plat), nomor rangka/mesin, dan bukti sah kendaraan\n\n⏱️ Estimasi Waktu Proses: 1 Hari Kerja.\n💰 Biaya: GRATIS (Rp 0,-).`,
    actionButton: { label: 'Ajukan Ket. Kendaraan', url: '/layanan/surat-keterangan-kepemilikan-kendaraan-bermotor' },
  },
  {
    id: 'kematian',
    title: 'Surat Keterangan Kematian',
    keywords: ['kematian', 'meninggal', 'wafat', 'almarhum', 'almarhumah', 'meninggal dunia', 'akta kematian', 'waris', 'taspen', 'pensiun', 'ahli waris', 'kubur'],
    reply: `Informasi Surat Keterangan Kematian:\n\nSurat Keterangan Kematian diterbitkan sebagai bukti otentik wafatnya seorang warga Desa Jombe, dipergunakan untuk penerbitan Akta Kematian di Disdukcapil, pembagian hak waris, penutupan rekening, maupun klaim pensiun/asuransi.\n\n📋 Persyaratan Berkas Dokumen:\n• Foto KTP Almarhum / Almarhumah\n• Foto e-KTP Pelapor (Keluarga / Ahli Waris)\n• Kartu Keluarga (KK)\n• Waktu, tanggal, dan tempat meninggal dunia\n\n⏱️ Estimasi Waktu Proses: 1 Hari Kerja.\n💰 Biaya: GRATIS (Rp 0,-).`,
    actionButton: { label: 'Ajukan Surat Kematian', url: '/layanan/surat-keterangan-kematian' },
  },
  {
    id: 'umum',
    title: 'Surat Keterangan Umum / Lainnya',
    keywords: ['umum', 'surat umum', 'lainnya', 'rekomendasi', 'keterangan lain', 'penghasilan', 'beda nama', 'kehilangan', 'keterangan dinas', 'surat pengantar'],
    reply: `Informasi Surat Keterangan Umum / Lainnya:\n\nSurat Keterangan Umum melayani kebutuhan administrasi dinas yang tidak tercakup dalam 8 kategori surat khusus, seperti surat keterangan beda nama, surat keterangan penghasilan orang tua, atau surat pengantar keperluan khusus.\n\n📋 Persyaratan Berkas Dokumen:\n• Foto e-KTP Pemohon\n• Foto Kartu Keluarga (KK)\n• Rincian keperluan surat keterangan yang dibutuhkan\n\n⏱️ Estimasi Waktu Proses: 1 Hari Kerja.\n💰 Biaya: GRATIS (Rp 0,-).`,
    actionButton: { label: 'Ajukan Surat Umum', url: '/layanan/surat-keterangan-umum' },
  },
  {
    id: 'alur_ttd',
    title: 'Alur Penerbitan, Cetak Fisik & Tanda Tangan Basah',
    keywords: ['tanda tangan', 'ttd', 'basah', 'stempel', 'cap', 'cetak', 'print', 'tte', 'legalitas', 'resmi', 'bagaimana alurnya', 'cara kerja', 'alur pengajuan', 'proses surat'],
    reply: `💡 Alur Pelayanan & Legalitas Surat Desa Jombe:\n\n1️⃣ Pengajuan Mandiri: Warga mengisi formulir pengajuan online di website Lentera Desa kapan saja 24 jam.\n2️⃣ Verifikasi Berkas: Petugas Operator Kantor Desa memeriksa kelengkapan KTP/KK dan data pemohon.\n3️⃣ Penerbitan Draf PDF: Sistem menerbitkan dokumen surat resmi ber-nomor registrasi buku agenda desa.\n4️⃣ Cetak Fisik (Print): Dokumen dicetak pada kertas ber-kop resmi Pemerintah Kabupaten Jeneponto.\n5️⃣ Tanda Tangan Basah & Stempel: Lembar fisik surat ditandatangani basah oleh Kepala Desa Jombe (JUSMAEDY, S.Pd) serta dibubuhi cap stempel basah kantor desa.\n6️⃣ Pengambilan: Surat sah fisik siap diserahkan kepada warga pemohon di kantor desa atau dikoordinasikan bersama Kepala Dusun.`,
    actionButton: { label: 'Katalog Semua Layanan', url: '/layanan' },
  },
  {
    id: 'lacak',
    title: 'Fitur Lacak Status Permohonan',
    keywords: ['lacak', 'status', 'tracking', 'cek surat', 'sampai mana', 'nomor registrasi', 'no reg', 'jmb', 'antrean', 'progress', 'progres', 'riwayat', 'pantau'],
    reply: `🔍 Cara Melacak Status Permohonan Surat (/lacak):\n\nAnda dapat memantau proses permohonan surat secara transparan tanpa perlu datang ke kantor desa:\n1. Buka menu "Lacak Permohonan" di website.\n2. Masukkan Nomor Registrasi Surat Anda (contoh: JMB-2026-00001) ATAU masukkan 16 digit NIK Anda.\n3. Klik tombol "Cari".\n\n📌 Arti Status Permohonan:\n• MENUNGGU VERIFIKASI: Berkas baru masuk antrean pemeriksaan operator.\n• SEDANG DIPROSES: Berkas diverifikasi dan draf surat sedang disiapkan.\n• PERLU PERBAIKAN: Ada foto dokumen yang buram/kurang lengkap (silakan perbaiki).\n• DISETUJUI / SELESAI: Surat resmi telah selesai dan siap diambil.`,
    actionButton: { label: 'Buka Halaman Lacak Surat', url: '/lacak' },
  },
  {
    id: 'verifikasi',
    title: 'Validasi Arsip & Keaslian Dokumen Desa',
    keywords: ['validasi', 'verifikasi', 'keaslian', 'asli', 'palsu', 'cek barcode', 'scan qr', 'qr code', 'legalisir', 'buku agenda', 'arsip'],
    reply: `🛡️ Fitur Validasi Surat Resmi Desa Jombe (/verifikasi-ttd):\n\nSetiap surat yang diterbitkan dilengkapi QR Code Registrasi Arsip Resmi.\n\nInstansi luar (seperti Bank, Kepolisian, Kampus, atau KUA) maupun warga dapat memindai QR Code tersebut untuk memverifikasi bahwa surat bersangkutan benar-benar terdaftar secara sah dalam buku agenda kependudukan Pemerintah Desa Jombe, Kecamatan Turatea, Kabupaten Jeneponto.\n\nDokumen cetak fisik dinyatakan berkekuatan hukum penuh setelah dibubuhi tanda tangan basah Kepala Desa Jombe (JUSMAEDY, S.Pd) dan cap stempel basah kantor desa.`,
    actionButton: { label: 'Halaman Validasi Dokumen', url: '/verifikasi-ttd' },
  },
  {
    id: 'pengaduan',
    title: 'Layanan Pengaduan & Aspirasi Warga',
    keywords: ['lapor', 'aduan', 'pengaduan', 'keluhan', 'aspirasi', 'jalan rusak', 'lampu jalan', 'mati lampu', 'sampah', 'irigasi', 'saluran air', 'pupuk', 'pgd', 'tiket'],
    reply: `📢 Layanan Pengaduan & Aspirasi Warga (/pengaduan):\n\nPemerintah Desa Jombe membuka ruang aspirasi bagi seluruh warga untuk menyampaikan laporan atau usulan terkait:\n• Infrastruktur: Jalan rusak, gorong-gorong, lampu penerangan jalan.\n• Pertanian & Lingkungan: Saluran irigasi sawah, ketersediaan pupuk, kebersihan dusun.\n• Pelayanan Desa: Bantuan sosial, pelayanan perangkat, keamanan lingkungan.\n\nSetiap laporan akan mendapatkan Nomor Tiket (PGD-XXXXX) dan langsung dipantau oleh perangkat desa untuk ditindaklanjuti.`,
    actionButton: { label: 'Kirim Pengaduan Warga', url: '/pengaduan' },
  },
  {
    id: 'profil_desa',
    title: 'Profil Desa Jombe & Statistik BPS Turatea 2025',
    keywords: ['profil', 'data desa', 'penduduk', 'bps', 'turatea', 'jeneponto', 'jumlah warga', 'dusun', 'luas wilayah', 'petani', 'jagung', 'potensi', 'sejarah', 'visi', 'misi'],
    reply: `🌾 Profil Otentik Desa Jombe (Data Resmi BPS Kecamatan Turatea 2025):\n\n• Wilayah: Desa Jombe, Kecamatan Turatea, Kabupaten Jeneponto, Sulawesi Selatan.\n• Kepala Desa: JUSMAEDY, S.Pd\n• Sekretaris Desa: SYAMSUL RISWAN\n• Jumlah Penduduk: 2.670 Jiwa (1.336 Laki-laki, 1.334 Perempuan, 850 KK)\n• Pembagian Wilayah: Terdiri dari 5 Dusun:\n  1. Dusun Jombe Utara\n  2. Dusun Jombe Tengah\n  3. Dusun Jombe Selatan\n  4. Dusun Tompo Balang\n  5. Dusun Muncu-muncu\n• Potensi Utama: Pertanian Jagung Kuning (produksi 5.890 ton dari luas panen 1.100 hektare).`,
    actionButton: { label: 'Lihat Profil & Peta Interaktif', url: '/profil' },
  },
  {
    id: 'kades_perangkat',
    title: 'Pemerintah Desa & Pejabat Kepala Desa',
    keywords: ['kades', 'kepala desa', 'sekdes', 'sekretaris desa', 'perangkat desa', 'aparat', 'jusmaedy', 'syamsul', 'siapa kades', 'nama lurah', 'struktur'],
    reply: `🏛️ Struktur Pimpinan Pemerintah Desa Jombe:\n\n• Kepala Desa: JUSMAEDY, S.Pd (Pemimpin penyelenggaraan pemerintahan, pembangunan, pembinaan kemasyarakatan, dan pemberdayaan masyarakat Desa Jombe).\n• Sekretaris Desa: SYAMSUL RISWAN (Koordinator administrasi pelayanan umum, keuangan, dan kearsipan desa).\n• Didukung oleh jajaran Kepala Seksi (Kasi), Kepala Urusan (Kaur), dan 5 Kepala Dusun se-Desa Jombe.`,
    actionButton: { label: 'Lihat Struktur Aparatur Desa', url: '/profil' },
  },
  {
    id: 'berita',
    title: 'Berita & Pengumuman Desa',
    keywords: ['berita', 'pengumuman', 'agenda', 'kegiatan', 'apbdes', 'transparansi', 'musrenbang', 'kerja bakti', 'info desa', 'jadwal'],
    reply: `📰 Portal Berita & Pengumuman Desa (/berita):\n\nSeluruh publikasi resmi desa disajikan secara transparan:\n• Berita kegiatan pembangunan dan program kemasyarakatan desa.\n• Pengumuman penyaluran bantuan sosial dan imbauan Kepala Desa.\n• Agenda kerja bakti dan musyawarah dusun.\n\nWarga dapat membaca kabar terbaru secara berkala di portal berita.`,
    actionButton: { label: 'Buka Berita Desa', url: '/berita' },
  },
  {
    id: 'akun_login',
    title: 'Akun Warga & Login Berbasis NIK',
    keywords: ['akun', 'login', 'masuk', 'daftar', 'register', 'buat akun', 'dashboard', 'nik', 'lupa password', 'kata sandi', 'ganti password'],
    reply: `👤 Panduan Akun Warga & Login Mandiri:\n\nUntuk mempermudah warga, sistem Lentera Desa menggunakan metode Autentikasi NIK Praktis:\n• Cukup masukkan 16 digit NIK e-KTP Anda untuk Masuk atau Mendaftar.\n• Tidak perlu menghafal kata sandi/password yang rumit.\n• Di halaman Dashboard Warga (/dashboard), Anda dapat melihat riwayat seluruh surat yang pernah diajukan, melihat tindak lanjut pengaduan, dan mengubah nomor WhatsApp/alamat domisili Anda.`,
    actionButton: { label: 'Masuk / Daftar Akun', url: '/login' },
  },
  {
    id: 'operator_admin',
    title: 'Portal Khusus Operator & Petugas Desa',
    keywords: ['operator', 'admin', 'petugas', 'dashboard operator', 'verifikator', 'login operator'],
    reply: `⚙️ Dashboard Operator Desa (/operator):\n\nPortal ini diperuntukkan bagi petugas administrasi dan aparatur Kantor Desa Jombe untuk:\n• Memeriksa berkas permohonan surat masuk secara berkala\n• Memeriksa lampiran foto KTP/KK pemohon dengan fitur zoom resolusi tinggi\n• Menyetujui dan mencetak draf PDF surat resmi berkop Pemkab Jeneponto\n• Menjawab dan menindaklanjuti pengaduan warga\n• Mengunggah artikel berita dan pengumuman desa.`,
    actionButton: { label: 'Buka Layanan Operator', url: '/operator' },
  },
  {
    id: 'kantor_jam',
    title: 'Lokasi Kantor Desa & Jam Pelayanan',
    keywords: ['kantor', 'jam', 'buka', 'tutup', 'alamat', 'lokasi', 'hari kerja', 'wita', 'tempat', 'dimana', 'posisi kantor'],
    reply: `📍 Lokasi & Jam Operasional Kantor Desa Jombe:\n\n• Alamat Kantor: Jalan Poros Dusun Jombe Selatan, Desa Jombe, Kecamatan Turatea, Kabupaten Jeneponto, Sulawesi Selatan.\n• Jam Pelayanan Fisik Kantor Desa:\n  Senin s.d. Jumat pukul 08.00 - 15.00 WITA.\n• Layanan Website Mandiri (Lentera Desa):\n  Aktif melayani pengajuan online 24 Jam Nonstop setiap hari.`,
    actionButton: { label: 'Lihat Lokasi di Peta Profil', url: '/profil' },
  },
  {
    id: 'biaya_gratis',
    title: 'Biaya Pelayanan Surat Administrasi',
    keywords: ['biaya', 'tarif', 'bayar', 'gratis', 'uang', 'ongkos', 'pungli', 'harga', 'pembayaran', 'administrasi'],
    reply: `💰 Informasi Biaya Pelayanan Surat:\n\nSeluruh pelayanan administrasi surat keterangan kependudukan di Pemerintah Desa Jombe melalui sistem Lentera Desa adalah 100% GRATIS (Rp 0,-).\n\nTidak dipungut biaya apa pun dari pengajuan hingga pencetakan surat resmi.`,
    actionButton: { label: 'Lihat Katalog Surat Gratis', url: '/layanan' },
  },
  {
    id: 'kontak_wa',
    title: 'Kontak WhatsApp & Bantuan Langsung Petugas',
    keywords: ['kontak', 'hubungi', 'whatsapp', 'wa', 'telepon', 'hp', 'email', 'nomor operator', 'call center', 'bantuan', 'cs'],
    reply: `📞 Kontak Resmi Pelayanan Kantor Desa Jombe:\n\nJika memerlukan konsultasi atau bantuan langsung dari perangkat desa:\n• WhatsApp Petugas Pelayanan: 081234567890\n• Email Resmi: pelayanan@jombe.desa.id\n• Anda juga dapat menghubungi Kepala Dusun di wilayah masing-masing (Dusun Jombe Utara, Tengah, Selatan, Tompo Balang, Muncu-muncu).`,
    actionButton: { label: 'Hubungi WhatsApp Petugas', url: 'https://wa.me/6281234567890' },
  },
  {
    id: 'sapaan_faq',
    title: 'Pusat Bantuan & Fitur Website',
    keywords: ['halo', 'hai', 'assalamualaikum', 'pagi', 'siang', 'sore', 'malam', 'terima kasih', 'makasih', 'siapa kamu', 'bisa apa', 'fitur apa saja', 'bantuan', 'tolong', 'menu'],
    reply: `Halo! Selamat datang di Pusat Bantuan Cerdas Lentera Desa Jombe, Kecamatan Turatea, Kabupaten Jeneponto.\n\nSaya dapat memberikan informasi lengkap mengenai seluruh fitur website ini:\n1. 📜 Persyaratan & Pengajuan 9 Jenis Surat Keterangan Desa\n2. 🔍 Lacak Status Permohonan Surat secara Real-Time (/lacak)\n3. 🛡️ Validasi & Verifikasi Surat Resmi Desa (/verifikasi-ttd)\n4. 📢 Kirim Pengaduan & Aspirasi Warga (/pengaduan)\n5. 🌾 Profil Desa & Data Resmi BPS Turatea 2025 (/profil)\n6. 📰 Berita, Pengumuman, Jam Kantor (WITA), dan Alamat Desa.\n\nSilakan ketik pertanyaan apa pun yang Anda ingin ketahui!`,
    actionButton: { label: 'Jelajahi Katalog Layanan', url: '/layanan' },
  },
];

/**
 * Smart Keyword Matching Engine:
 * Evaluates the user's input across all topics and returns the best matching result.
 */
export function matchAiKnowledge(inputPrompt: string): { reply: string; actionButton?: { label: string; url: string } } {
  const clean = String(inputPrompt || '').toLowerCase().trim();

  if (!clean) {
    return {
      reply: 'Halo! Ada yang bisa kami bantu seputar pelayanan surat atau informasi Desa Jombe?',
      actionButton: { label: 'Katalog Layanan Surat', url: '/layanan' },
    };
  }

  // Extract query words (filtering short words)
  const queryTokens = clean
    .replace(/[^a-z0-9\s]/gi, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 1);

  let bestTopic: AiTopic | null = null;
  let highestScore = 0;

  for (const topic of AI_KNOWLEDGE_BASE) {
    let score = 0;

    // Check direct substring matches for entire keyword phrases
    for (const kw of topic.keywords) {
      if (clean.includes(kw)) {
        score += kw.includes(' ') ? 8 : 4;
      }
    }

    // Check individual token matches
    for (const token of queryTokens) {
      for (const kw of topic.keywords) {
        if (kw === token) {
          score += 3;
        } else if (kw.includes(token) || token.includes(kw)) {
          score += 1.5;
        }
      }
    }

    // Prioritize specific service matches if user mentions service name directly
    if (clean.includes(topic.id)) {
      score += 5;
    }

    if (score > highestScore) {
      highestScore = score;
      bestTopic = topic;
    }
  }

  // Threshold check
  if (bestTopic && highestScore >= 2.5) {
    return {
      reply: bestTopic.reply,
      actionButton: bestTopic.actionButton,
    };
  }

  // Fallback if no specific topic scored enough
  return {
    reply: `Terima kasih telah menghubungi Pusat Informasi Desa Jombe. Kami belum menemukan informasi yang persis sama dengan kata kunci "${inputPrompt}".\n\nTopik populer yang sering ditanyakan warga:\n• Syarat Surat Keterangan Usaha (SKU) atau SKTM\n• Cara melacak status surat (/lacak)\n• Alur cetak & tanda tangan basah Kepala Desa\n• Lapor pengaduan warga (/pengaduan)\n• Jam buka kantor desa dan lokasi di Dusun Jombe Selatan.\n\nSilakan klik tombol di bawah untuk melihat katalog layanan lengkap atau perjelas kata kunci pertanyaan Anda.`,
    actionButton: { label: 'Buka Katalog Semua Layanan', url: '/layanan' },
  };
}

export const handleAiQuery = async (req: Request, res: Response) => {
  try {
    const prompt = req.body.prompt || req.body.message || req.body.query || '';

    if (!prompt || String(prompt).trim().length === 0) {
      return res.status(400).json({ status: 'error', message: 'Pertanyaan tidak boleh kosong.' });
    }

    // Try matching active database services first for real-time dynamic sync
    try {
      const lower = String(prompt).toLowerCase();
      const services = await prisma.service.findMany({
        where: { isActive: true },
        select: { id: true, name: true, slug: true, description: true, requirements: true, estimatedDays: true },
      });

      for (const s of services) {
        if (lower.includes(s.name.toLowerCase()) || (s.slug && lower.includes(s.slug.replace(/-/g, ' ')))) {
          return res.status(200).json({
            status: 'success',
            data: {
              reply: `Informasi Pelayanan ${s.name}:\n\nKeterangan: ${s.description || 'Layanan administrasi resmi Pemerintah Desa Jombe, Kec. Turatea, Kab. Jeneponto.'}\n\nPersyaratan Dokumen:\n${s.requirements || 'e-KTP dan Kartu Keluarga (KK)'}\n\nEstimasi Waktu Pemrosesan: ${s.estimatedDays || 1} Hari Kerja (Gratis/Rp 0,-).\n\nSurat resmi dicetak untuk dibubuhi tanda tangan basah Kepala Desa Jombe (JUSMAEDY, S.Pd) serta stempel resmi kantor desa.`,
              actionButton: {
                label: `Ajukan ${s.name}`,
                url: `/layanan/${s.slug}`,
              },
            },
          });
        }
      }
    } catch (dbErr) {}

    // Match against full AI Knowledge Base
    const result = matchAiKnowledge(prompt);

    return res.status(200).json({
      status: 'success',
      data: result,
    });
  } catch (error) {
    return res.status(200).json({
      status: 'success',
      data: {
        reply: 'Selamat datang di Pusat Informasi Pelayanan Pemerintah Desa Jombe. Silakan tanyakan informasi persyaratan administrasi surat yang Anda butuhkan.',
        actionButton: { label: 'Katalog Layanan Surat', url: '/layanan' },
      },
    });
  }
};
