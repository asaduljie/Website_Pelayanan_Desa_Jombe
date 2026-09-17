'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import {
  MessageSquare,
  X,
  Send,
  Bot,
  User,
  ArrowRight,
  HelpCircle,
  Sparkles,
  RefreshCw,
  ExternalLink,
  CheckCircle2,
  Clock,
  ShieldCheck,
} from 'lucide-react';
import api from '@/lib/api';

interface ActionButton {
  label: string;
  url: string;
}

interface Message {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  actionButton?: ActionButton;
  timestamp: string;
}

interface TopicKnowledge {
  id: string;
  title: string;
  keywords: string[];
  reply: string;
  actionButton?: ActionButton;
}

// Comprehensive offline-resilient Knowledge Base for ALL features of Lentera Desa Jombe
const KNOWLEDGE_BASE: TopicKnowledge[] = [
  {
    id: 'sku',
    title: 'Surat Keterangan Usaha (SKU)',
    keywords: [
      'sku', 'usaha', 'dagang', 'warung', 'toko', 'kios', 'jualan', 'kur',
      'modal', 'umkm', 'bisnis', 'izin usaha', 'kredit usaha', 'bank', 'pedagang'
    ],
    reply: `Informasi Surat Keterangan Usaha (SKU):\n\nSurat Keterangan Usaha (SKU) digunakan sebagai bukti legalitas usaha di Desa Jombe untuk pengajuan modal/KUR di bank, pendaftaran izin usaha, maupun pendataan bantuan UMKM.\n\n📋 Persyaratan Berkas:\n• Foto e-KTP Pemohon asli\n• Foto Kartu Keluarga (KK)\n• Foto Tempat / Kegiatan Usaha di Desa Jombe\n\n⏱️ Estimasi Proses: 1 Hari Kerja.\n💰 Biaya: 100% GRATIS (Rp 0,-).\n\nSetelah diverifikasi operator, berkas dicetak fisik untuk dibubuhi Tanda Tangan Basah Kepala Desa (JUSMAEDY, S.Pd) & cap stempel kantor desa.`,
    actionButton: { label: 'Ajukan SKU Sekarang', url: '/layanan/surat-keterangan-usaha' },
  },
  {
    id: 'sktm',
    title: 'Surat Keterangan Kurang Mampu (SKTM)',
    keywords: [
      'sktm', 'tidak mampu', 'kurang mampu', 'miskin', 'beasiswa', 'kip', 'kuliah',
      'sekolah', 'bantuan', 'bansos', 'keringanan', 'rumah sakit', 'bpjs', 'kis', 'pengobatan', 'spp'
    ],
    reply: `Informasi Surat Keterangan Kurang Mampu (SKTM):\n\nSKTM diterbitkan bagi warga Desa Jombe yang membutuhkan surat rekomendasi keringanan biaya pendidikan (KIP Kuliah/Sekolah), keringanan rumah sakit, maupun pengusulan program bantuan sosial (bansos).\n\n📋 Persyaratan Berkas:\n• Foto e-KTP Pemohon / Kepala Keluarga\n• Foto Kartu Keluarga (KK)\n• Keterangan tujuan/keperluan pemohon\n\n⏱️ Estimasi Proses: 1 Hari Kerja.\n💰 Biaya: 100% GRATIS (Rp 0,-).`,
    actionButton: { label: 'Ajukan SKTM Sekarang', url: '/layanan/surat-keterangan-tidak-mampu' },
  },
  {
    id: 'domisili',
    title: 'Surat Keterangan Domisili',
    keywords: [
      'domisili', 'tempat tinggal', 'tinggal', 'alamat', 'pindah', 'surat domisili',
      'keterangan domisili', 'kost', 'kontrak', 'menetap', 'warga baru', 'rt', 'rw'
    ],
    reply: `Informasi Surat Keterangan Domisili:\n\nSurat Keterangan Domisili menerangkan status tempat tinggal sah seorang warga di salah satu dusun di wilayah Desa Jombe, Kecamatan Turatea.\n\n📋 Persyaratan Berkas:\n• Foto e-KTP Pemohon\n• Foto Kartu Keluarga (KK)\n• Alamat lengkap tempat tinggal di Desa Jombe\n\n⏱️ Estimasi Proses: 1 Hari Kerja.\n💰 Biaya: 100% GRATIS (Rp 0,-).`,
    actionButton: { label: 'Ajukan Surat Domisili', url: '/layanan/surat-keterangan-domisili' },
  },
  {
    id: 'skkb',
    title: 'Surat Keterangan Kelakuan Baik (SKKB / SKCK)',
    keywords: [
      'skkb', 'skck', 'kelakuan baik', 'polisi', 'polsek', 'polres', 'lamar kerja',
      'pekerjaan', 'bumn', 'cpns', 'swasta', 'pengantar skck', 'kriminal', 'pidana'
    ],
    reply: `Informasi Surat Keterangan Kelakuan Baik (SKKB / SKCK):\n\nSKKB merupakan surat pengantar resmi desa untuk menerangkan bahwa pemohon bertingkah laku baik dan tidak tersangkut masalah hukum, digunakan untuk pengurusan SKCK di Polsek/Polres maupun syarat melamar pekerjaan.\n\n📋 Persyaratan Berkas:\n• Foto e-KTP Pemohon\n• Foto Kartu Keluarga (KK)\n• Keterangan instansi tujuan pengajuan\n\n⏱️ Estimasi Proses: 1 Hari Kerja.\n💰 Biaya: 100% GRATIS (Rp 0,-).`,
    actionButton: { label: 'Ajukan SKKB / SKCK', url: '/layanan/surat-keterangan-kelakuan-baik' },
  },
  {
    id: 'belum_menikah',
    title: 'Surat Keterangan Belum Menikah',
    keywords: [
      'belum menikah', 'belum kawin', 'lajang', 'single', 'bujang', 'gadis',
      'nikah', 'kua', 'pernikahan', 'tni', 'polri', 'ikatan dinas', 'kawin'
    ],
    reply: `Informasi Surat Keterangan Belum Menikah:\n\nSurat ini menyatakan secara sah bahwa pemohon berstatus lajang dan belum pernah menikah, biasa digunakan untuk kelengkapan administrasi KUA, seleksi kedinasan (TNI/Polri), maupun persyaratan pekerjaan.\n\n📋 Persyaratan Berkas:\n• Foto e-KTP Pemohon\n• Foto Kartu Keluarga (KK)\n• Pernyataan status belum menikah\n\n⏱️ Estimasi Proses: 1 Hari Kerja.\n💰 Biaya: 100% GRATIS (Rp 0,-).`,
    actionButton: { label: 'Ajukan Ket. Belum Menikah', url: '/layanan/surat-keterangan-belum-menikah' },
  },
  {
    id: 'wali',
    title: 'Surat Keterangan Wali',
    keywords: [
      'wali', 'surat wali', 'perwalian', 'anak', 'sekolah', 'kuliah',
      'wali nikah', 'orang tua wali', 'asuh', 'wali murid', 'ijazah'
    ],
    reply: `Informasi Surat Keterangan Wali:\n\nSurat Keterangan Wali menerangkan hubungan perwalian yang sah antara wali dengan anak untuk urusan pendaftaran sekolah/kampus, wali nikah, maupun keperluan administratif lainnya.\n\n📋 Persyaratan Berkas:\n• Foto e-KTP Wali Pemohon\n• Foto Kartu Keluarga (KK)\n• Akta Kelahiran atau identitas anak yang diwali\n\n⏱️ Estimasi Proses: 1 Hari Kerja.\n💰 Biaya: 100% GRATIS (Rp 0,-).`,
    actionButton: { label: 'Ajukan Surat Wali', url: '/layanan/surat-keterangan-wali' },
  },
  {
    id: 'kendaraan',
    title: 'Surat Keterangan Kepemilikan Kendaraan Bermotor',
    keywords: [
      'kendaraan', 'motor', 'mobil', 'stnk', 'bpkb', 'samsat', 'pajak',
      'jual beli motor', 'hilang stnk', 'kepemilikan kendaraan', 'sepeda motor', 'plat'
    ],
    reply: `Informasi Surat Keterangan Kepemilikan Kendaraan Bermotor:\n\nSurat ini menerangkan kepemilikan sah atas kendaraan bermotor (roda 2 / roda 4) di Desa Jombe untuk keperluan Samsat, pengurusan pajak, maupun bukti kepemilikan saat kehilangan dokumen.\n\n📋 Persyaratan Berkas:\n• Foto e-KTP Pemilik Kendaraan\n• Foto Kartu Keluarga (KK)\n• Data Nomor Polisi (Plat), Nomor Rangka, dan Nomor Mesin\n\n⏱️ Estimasi Proses: 1 Hari Kerja.\n💰 Biaya: 100% GRATIS (Rp 0,-).`,
    actionButton: { label: 'Ajukan Ket. Kendaraan', url: '/layanan/surat-keterangan-kepemilikan-kendaraan-bermotor' },
  },
  {
    id: 'kematian',
    title: 'Surat Keterangan Kematian',
    keywords: [
      'kematian', 'meninggal', 'wafat', 'almarhum', 'almarhumah', 'meninggal dunia',
      'akta kematian', 'waris', 'taspen', 'pensiun', 'ahli waris', 'kubur'
    ],
    reply: `Informasi Surat Keterangan Kematian:\n\nSurat Keterangan Kematian diterbitkan sebagai bukti sah meninggalnya warga Desa Jombe untuk penerbitan Akta Kematian di Disdukcapil, pengurusan hak waris, penutupan rekening, maupun klaim asuransi/pensiun.\n\n📋 Persyaratan Berkas:\n• Foto KTP Almarhum / Almarhumah\n• Foto e-KTP Pelapor (Keluarga / Ahli Waris)\n• Kartu Keluarga (KK)\n• Rincian waktu & tempat meninggal dunia\n\n⏱️ Estimasi Proses: 1 Hari Kerja.\n💰 Biaya: 100% GRATIS (Rp 0,-).`,
    actionButton: { label: 'Ajukan Surat Kematian', url: '/layanan/surat-keterangan-kematian' },
  },
  {
    id: 'umum',
    title: 'Surat Keterangan Umum / Lainnya',
    keywords: [
      'umum', 'surat umum', 'lainnya', 'rekomendasi', 'keterangan lain',
      'penghasilan', 'beda nama', 'kehilangan', 'keterangan dinas', 'pengantar'
    ],
    reply: `Informasi Surat Keterangan Umum / Lainnya:\n\nSurat Keterangan Umum melayani kebutuhan administrasi desa yang tidak termasuk dalam 8 jenis surat khusus, seperti surat keterangan beda nama di berkas, surat keterangan penghasilan orang tua, atau surat pengantar dinas.\n\n📋 Persyaratan Berkas:\n• Foto e-KTP Pemohon\n• Foto Kartu Keluarga (KK)\n• Rincian keperluan surat yang diajukan\n\n⏱️ Estimasi Proses: 1 Hari Kerja.\n💰 Biaya: 100% GRATIS (Rp 0,-).`,
    actionButton: { label: 'Ajukan Surat Umum', url: '/layanan/surat-keterangan-umum' },
  },
  {
    id: 'lacak',
    title: 'Fitur Lacak Status Surat',
    keywords: [
      'lacak', 'status', 'tracking', 'cek surat', 'sampai mana', 'nomor registrasi',
      'no reg', 'jmb', 'antrean', 'progress', 'progres', 'riwayat', 'pantau', 'cek'
    ],
    reply: `🔍 Cara Melacak Permohonan Surat (/lacak):\n\nAnda dapat memantau proses surat secara transparan tanpa harus datang ke kantor desa:\n1. Masuk ke menu "Lacak Permohonan" di website.\n2. Masukkan Nomor Registrasi Surat Anda (contoh: JMB-2026-00001) ATAU masukkan 16 digit NIK Anda.\n3. Klik "Cari".\n\n📌 Tahapan Status Surat:\n• MENUNGGU VERIFIKASI: Berkas baru masuk antrean operator.\n• SEDANG DIPROSES: Berkas diverifikasi dan draf surat sedang disiapkan.\n• PERLU PERBAIKAN: Dokumen foto buram atau data perlu diperbaiki.\n• DISETUJUI / SELESAI: Surat resmi siap diambil di kantor desa.`,
    actionButton: { label: 'Buka Menu Lacak Surat', url: '/lacak' },
  },
  {
    id: 'alur_ttd',
    title: 'Alur Penerbitan, Cetak Fisik & Tanda Tangan Basah',
    keywords: [
      'tanda tangan', 'ttd', 'basah', 'stempel', 'cap', 'cetak', 'print',
      'tte', 'legalitas', 'resmi', 'bagaimana alurnya', 'cara kerja', 'alur pengajuan', 'proses surat'
    ],
    reply: `💡 Alur Penerbitan & Legalitas Surat Resmi Desa Jombe:\n\n1️⃣ Pengajuan Online: Warga mengisi formulir pengajuan di website Lentera Desa kapan saja 24 jam.\n2️⃣ Verifikasi Operator: Petugas operator memeriksa kelengkapan identitas KTP/KK pemohon.\n3️⃣ Penerbitan Draf PDF: Sistem menerbitkan dokumen resmi ber-nomor registrasi agenda desa.\n4️⃣ Cetak Fisik: Dokumen dicetak pada lembar kertas berkop resmi Pemkab Jeneponto.\n5️⃣ Tanda Tangan Basah & Cap Stempel: Lembar cetak ditandatangani basah oleh Kepala Desa Jombe (JUSMAEDY, S.Pd) serta dibubuhi cap stempel basah kantor desa.\n6️⃣ Pengambilan: Berkas fisik siap diserahkan kepada warga di kantor desa.`,
    actionButton: { label: 'Lihat Semua Layanan Surat', url: '/layanan' },
  },
  {
    id: 'verifikasi',
    title: 'Validasi Arsip & Keaslian Dokumen Desa',
    keywords: [
      'validasi', 'verifikasi', 'keaslian', 'asli', 'palsu', 'cek barcode',
      'scan qr', 'qr code', 'legalisir', 'buku agenda', 'arsip'
    ],
    reply: `🛡️ Validasi & Verifikasi Surat Resmi Desa Jombe (/verifikasi-ttd):\n\nSetiap surat yang diterbitkan memiliki QR Code Registrasi Arsip Resmi.\n\nInstansi luar (seperti Bank, Kepolisian, Kampus, atau KUA) maupun warga dapat memindai QR Code tersebut untuk membuktikan keaslian berkas yang terdaftar sah dalam buku agenda kependudukan Pemerintah Desa Jombe, Kec. Turatea, Kab. Jeneponto.`,
    actionButton: { label: 'Buka Halaman Validasi', url: '/verifikasi-ttd' },
  },
  {
    id: 'pengaduan',
    title: 'Layanan Pengaduan & Aspirasi Warga',
    keywords: [
      'lapor', 'aduan', 'pengaduan', 'keluhan', 'aspirasi', 'jalan rusak', 'lampu jalan',
      'mati lampu', 'sampah', 'irigasi', 'saluran air', 'pupuk', 'pgd', 'tiket'
    ],
    reply: `📢 Layanan Pengaduan & Aspirasi Warga (/pengaduan):\n\nPemerintah Desa Jombe memfasilitasi aspirasi warga untuk melaporkan permasalahan seperti:\n• Infrastruktur: Jalan berlubang, jembatan, lampu penerangan jalan.\n• Pertanian & Lingkungan: Saluran irigasi, bantuan pupuk, kebersihan dusun.\n• Pelayanan Desa: Bantuan sosial atau masukan pelayanan perangkat desa.\n\nLaporan akan mendapatkan Nomor Tiket Aduan (PGD-XXXXX) dan dipantau langsung oleh perangkat desa.`,
    actionButton: { label: 'Kirim Pengaduan Sekarang', url: '/pengaduan' },
  },
  {
    id: 'profil_desa',
    title: 'Profil Desa & Statistik BPS Turatea 2025',
    keywords: [
      'profil', 'data desa', 'penduduk', 'bps', 'turatea', 'jeneponto', 'jumlah warga',
      'dusun', 'luas wilayah', 'petani', 'jagung', 'potensi', 'sejarah', 'visi', 'misi'
    ],
    reply: `🌾 Profil Resmi Desa Jombe (Sumber Otentik: BPS Kecamatan Turatea 2025):\n\n• Wilayah: Desa Jombe, Kecamatan Turatea, Kabupaten Jeneponto, Sulawesi Selatan.\n• Kepala Desa: JUSMAEDY, S.Pd\n• Sekretaris Desa: SYAMSUL RISWAN\n• Jumlah Penduduk: 2.670 Jiwa (1.336 Laki-laki, 1.334 Perempuan, 850 KK)\n• Pembagian Wilayah: Terdiri dari 5 Dusun:\n  1. Dusun Jombe Utara\n  2. Dusun Jombe Tengah\n  3. Dusun Jombe Selatan\n  4. Dusun Tompo Balang\n  5. Dusun Muncu-muncu\n• Potensi Komoditas: Pertanian Jagung Kuning (produksi 5.890 ton dari luas panen 1.100 hektare).`,
    actionButton: { label: 'Buka Profil & Peta Interaktif', url: '/profil' },
  },
  {
    id: 'kades_perangkat',
    title: 'Pemerintah Desa & Pejabat Kepala Desa',
    keywords: [
      'kades', 'kepala desa', 'sekdes', 'sekretaris desa', 'perangkat desa',
      'aparat', 'jusmaedy', 'syamsul', 'siapa kades', 'nama lurah', 'struktur'
    ],
    reply: `🏛️ Struktur Pimpinan Pemerintah Desa Jombe:\n\n• Kepala Desa: JUSMAEDY, S.Pd (Pemimpin penyelenggaraan pemerintahan, pembangunan desa, dan pembinaan kemasyarakatan).\n• Sekretaris Desa: SYAMSUL RISWAN (Koordinator administrasi pelayanan umum, keuangan, dan kearsipan desa).\n• Didukung jajaran Kasi, Kaur, serta 5 Kepala Dusun se-Desa Jombe.`,
    actionButton: { label: 'Lihat Struktur Aparatur Desa', url: '/profil' },
  },
  {
    id: 'berita',
    title: 'Berita & Pengumuman Desa',
    keywords: [
      'berita', 'pengumuman', 'agenda', 'kegiatan', 'apbdes', 'transparansi',
      'musrenbang', 'kerja bakti', 'info desa', 'jadwal'
    ],
    reply: `📰 Portal Berita & Pengumuman Desa (/berita):\n\nSeluruh informasi resmi desa disajikan secara terbuka:\n• Kabar kegiatan kemasyarakatan & pembangunan desa.\n• Pengumuman penyaluran bantuan sosial.\n• Agenda gotong royong dan musyawarah dusun.`,
    actionButton: { label: 'Baca Berita Desa', url: '/berita' },
  },
  {
    id: 'akun_login',
    title: 'Akun Warga & Login Berbasis NIK',
    keywords: [
      'akun', 'login', 'masuk', 'daftar', 'register', 'buat akun',
      'dashboard', 'nik', 'lupa password', 'kata sandi', 'ganti password'
    ],
    reply: `👤 Panduan Login & Akun Warga:\n\nSistem Lentera Desa dirancang mudah digunakan oleh seluruh lapisan warga:\n• Cukup masukkan 16 digit NIK e-KTP Anda untuk Masuk atau Mendaftar.\n• Tidak perlu menghafal kata sandi/password yang rumit.\n• Di Dashboard Warga (/dashboard), Anda dapat memantau riwayat surat permohonan dan tiket pengaduan Anda.`,
    actionButton: { label: 'Halaman Masuk / Daftar', url: '/login' },
  },
  {
    id: 'kantor_jam',
    title: 'Lokasi Kantor Desa & Jam Pelayanan',
    keywords: [
      'kantor', 'jam', 'buka', 'tutup', 'alamat', 'lokasi', 'hari kerja',
      'wita', 'tempat', 'dimana', 'posisi kantor'
    ],
    reply: `📍 Lokasi & Jam Buka Kantor Desa Jombe:\n\n• Alamat Kantor: Jalan Poros Dusun Jombe Selatan, Desa Jombe, Kecamatan Turatea, Kabupaten Jeneponto, Sulawesi Selatan.\n• Jam Pelayanan Fisik Kantor Desa:\n  Senin s.d. Jumat pukul 08.00 - 15.00 WITA.\n• Layanan Website Online (Lentera Desa):\n  Dapat diakses 24 Jam Nonstop setiap hari.`,
    actionButton: { label: 'Lihat Peta Lokasi Desa', url: '/profil' },
  },
  {
    id: 'biaya_gratis',
    title: 'Biaya Pelayanan Surat Administrasi',
    keywords: [
      'biaya', 'tarif', 'bayar', 'gratis', 'uang', 'ongkos', 'pungli',
      'harga', 'pembayaran', 'administrasi'
    ],
    reply: `💰 Biaya Pelayanan Surat:\n\nSeluruh pengurusan administrasi surat keterangan desa di Lentera Desa Jombe adalah 100% GRATIS (Rp 0,-).\n\nPemerintah Desa Jombe tidak memungut biaya administrasi apa pun bagi warga masyarakat.`,
    actionButton: { label: 'Katalog Layanan Surat', url: '/layanan' },
  },
  {
    id: 'kontak_wa',
    title: 'Kontak WhatsApp Petugas Pelayanan',
    keywords: [
      'kontak', 'hubungi', 'whatsapp', 'wa', 'telepon', 'hp', 'email',
      'nomor operator', 'call center', 'bantuan', 'cs'
    ],
    reply: `📞 Kontak Resmi Pelayanan Kantor Desa Jombe:\n\n• WhatsApp Pelayanan: 081234567890\n• Email Resmi: pelayanan@jombe.desa.id\n• Anda juga dapat berkoordinasi langsung dengan Kepala Dusun di wilayah tempat tinggal Anda (Dusun Jombe Utara, Tengah, Selatan, Tompo Balang, Muncu-muncu).`,
    actionButton: { label: 'Hubungi WhatsApp Petugas', url: 'https://wa.me/6281234567890' },
  },
  {
    id: 'sapaan_faq',
    title: 'Pusat Bantuan & Fitur Lentera Desa',
    keywords: [
      'halo', 'hai', 'assalamualaikum', 'pagi', 'siang', 'sore', 'malam',
      'terima kasih', 'makasih', 'siapa kamu', 'bisa apa', 'fitur apa saja', 'bantuan', 'tolong', 'menu'
    ],
    reply: `Halo! Selamat datang di Pusat Bantuan Cerdas Lentera Desa Jombe, Kec. Turatea, Kab. Jeneponto.\n\nSaya dapat membantu Anda dengan informasi lengkap seputar seluruh fitur website ini:\n1. 📜 Syarat & Panduan 9 Jenis Surat Keterangan Desa\n2. 🔍 Lacak Status Permohonan Surat (/lacak)\n3. 🛡️ Validasi Dokumen & QR Code Surat Resmi (/verifikasi-ttd)\n4. 📢 Kirim Pengaduan & Aspirasi Warga (/pengaduan)\n5. 🌾 Profil Desa & Data Resmi BPS Turatea 2025 (/profil)\n6. 📍 Lokasi Kantor di Dusun Jombe Selatan & Jam Kerja (WITA)\n7. 💰 Biaya Pelayanan (100% Gratis)\n\nSilakan ketik pertanyaan apa pun atau klik topik pilihan di bawah!`,
    actionButton: { label: 'Katalog Semua Layanan', url: '/layanan' },
  },
];

// Smart matching logic (client-side fallback & instant matching)
function matchKnowledgeLocally(inputPrompt: string): { reply: string; actionButton?: ActionButton } {
  const clean = String(inputPrompt || '').toLowerCase().trim();

  if (!clean) {
    return {
      reply: 'Halo! Ada yang bisa kami bantu seputar pelayanan surat atau informasi Desa Jombe?',
      actionButton: { label: 'Katalog Layanan Surat', url: '/layanan' },
    };
  }

  const queryTokens = clean
    .replace(/[^a-z0-9\s]/gi, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 1);

  let bestTopic: TopicKnowledge | null = null;
  let highestScore = 0;

  for (const topic of KNOWLEDGE_BASE) {
    let score = 0;

    for (const kw of topic.keywords) {
      if (clean.includes(kw)) {
        score += kw.includes(' ') ? 8 : 4;
      }
    }

    for (const token of queryTokens) {
      for (const kw of topic.keywords) {
        if (kw === token) {
          score += 3;
        } else if (kw.includes(token) || token.includes(kw)) {
          score += 1.5;
        }
      }
    }

    if (clean.includes(topic.id)) {
      score += 5;
    }

    if (score > highestScore) {
      highestScore = score;
      bestTopic = topic;
    }
  }

  if (bestTopic && highestScore >= 2.5) {
    return {
      reply: bestTopic.reply,
      actionButton: bestTopic.actionButton,
    };
  }

  return {
    reply: `Terima kasih telah bertanya di Pusat Bantuan Desa Jombe. Kami belum menemukan informasi persis untuk "${inputPrompt}".\n\nTopik populer yang sering ditanyakan warga:\n• Syarat Surat Keterangan Usaha (SKU) atau SKTM\n• Cara melacak surat (/lacak)\n• Alur cetak & tanda tangan basah Kepala Desa Jombe (JUSMAEDY, S.Pd)\n• Kirim pengaduan warga (/pengaduan)\n• Lokasi kantor desa di Dusun Jombe Selatan & jam buka (WITA).\n\nSilakan pilih salah satu menu di bawah atau perjelas kata kunci pertanyaan Anda.`,
    actionButton: { label: 'Buka Katalog Semua Layanan', url: '/layanan' },
  };
}

const QUICK_SUGGESTIONS = [
  'Syarat SKU',
  'Syarat SKTM',
  'Lacak Surat',
  'Alur TTD Basah',
  'Pengaduan Warga',
  'Data BPS 2025',
  'Jam Buka Kantor',
  'Biaya Layanan',
];

export default function AiChatModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'init-1',
      sender: 'bot',
      text: 'Halo! Selamat datang di Pusat Bantuan Cerdas Lentera Desa Jombe. Ada yang bisa kami bantu mengenai syarat surat administrasi, lacak berkas, pengaduan, atau informasi desa lainnya?',
      actionButton: { label: 'Jelajahi Katalog Layanan', url: '/layanan' },
      timestamp: 'Sekarang',
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [messages, isOpen]);

  const processQuery = async (queryText: string) => {
    const cleanQuery = queryText.trim();
    if (!cleanQuery || loading) return;

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: cleanQuery,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      // Try backend API first with a quick timeout fallback
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4000);

      const res = await api.post(
        '/ai/chat',
        { prompt: cleanQuery },
        { signal: controller.signal }
      );
      clearTimeout(timeoutId);

      if (res.data?.status === 'success' && res.data?.data?.reply) {
        const botData = res.data.data;
        setMessages((prev) => [
          ...prev,
          {
            id: `bot-${Date.now()}`,
            sender: 'bot',
            text: botData.reply,
            actionButton: botData.actionButton,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
        ]);
        return;
      }
      throw new Error('Fallback to local matching');
    } catch (error) {
      // Offline / network fallback with identical knowledge base
      const localResult = matchKnowledgeLocally(cleanQuery);
      setMessages((prev) => [
        ...prev,
        {
          id: `bot-${Date.now()}`,
          sender: 'bot',
          text: localResult.reply,
          actionButton: localResult.actionButton,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    processQuery(input);
  };

  const handleSuggestionClick = (suggestion: string) => {
    processQuery(suggestion);
  };

  const handleResetChat = () => {
    setMessages([
      {
        id: `init-${Date.now()}`,
        sender: 'bot',
        text: 'Percakapan telah diatur ulang. Ada informasi layanan desa atau persyaratan surat lain yang ingin Anda ketahui?',
        actionButton: { label: 'Katalog Layanan Surat', url: '/layanan' },
        timestamp: 'Sekarang',
      },
    ]);
  };

  return (
    <>
      {/* Floating Trigger Button */}
      <button
        id="btn-ai-cs-trigger"
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 z-40 px-4 py-3.5 bg-gradient-to-r from-emerald-800 to-emerald-950 hover:from-emerald-700 hover:to-emerald-900 text-white rounded-2xl shadow-xl shadow-emerald-900/30 transition-all transform hover:scale-105 flex items-center gap-2.5 border border-emerald-600/40 group ${
          isOpen ? 'hidden' : 'flex'
        }`}
        title="Pusat Bantuan AI Desa Jombe"
      >
        <div className="relative">
          <Sparkles className="w-5 h-5 text-amber-300 animate-pulse" />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-emerald-900 animate-ping" />
        </div>
        <div className="text-left">
          <div className="text-xs font-bold leading-none text-white">Bantuan AI Desa</div>
          <div className="text-[10px] text-emerald-300 leading-none mt-1">CS Online 24 Jam</div>
        </div>
      </button>

      {/* Help Modal */}
      {isOpen && (
        <div
          id="modal-ai-cs"
          className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 w-[94vw] max-w-sm sm:max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col h-[560px] animate-in fade-in slide-in-from-bottom-4 duration-200"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-emerald-900 via-emerald-850 to-teal-900 text-white p-4 flex items-center justify-between shadow-xs border-b border-emerald-800">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center border border-white/20 shadow-inner">
                <Bot className="w-5 h-5 text-amber-300" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xs font-bold leading-tight">AI Layanan Desa Jombe</h3>
                  <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[9px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                    🟢 Online
                  </span>
                </div>
                <span className="text-[10px] text-emerald-200 block mt-0.5">
                  Informasi Resmi Seluruh Fitur Website
                </span>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={handleResetChat}
                className="p-1.5 rounded-lg text-emerald-200 hover:text-white hover:bg-white/10 transition-colors"
                title="Reset Percakapan"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg text-emerald-200 hover:text-white hover:bg-white/10 transition-colors"
                title="Tutup Percakapan"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick Suggestion Chips Header */}
          <div className="bg-emerald-50/70 border-b border-emerald-150 px-3 py-2 overflow-x-auto flex gap-1.5 scrollbar-none">
            {QUICK_SUGGESTIONS.map((chip, idx) => (
              <button
                key={idx}
                onClick={() => handleSuggestionClick(chip)}
                className="whitespace-nowrap px-2.5 py-1 rounded-lg bg-white border border-emerald-200 text-[10px] font-semibold text-emerald-900 hover:bg-emerald-800 hover:text-white hover:border-emerald-800 transition-all shadow-xs shrink-0"
              >
                {chip}
              </button>
            ))}
          </div>

          {/* Chat Messages */}
          <div className="flex-1 p-3.5 overflow-y-auto space-y-3 bg-slate-50/70 text-xs">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'bot' && (
                  <div className="w-6 h-6 rounded-lg bg-emerald-800 text-white flex items-center justify-center shrink-0 mt-1 shadow-xs">
                    <Bot className="w-3.5 h-3.5 text-amber-300" />
                  </div>
                )}
                <div
                  className={`max-w-[85%] p-3.5 rounded-2xl leading-relaxed whitespace-pre-line ${
                    msg.sender === 'user'
                      ? 'bg-gradient-to-br from-emerald-800 to-emerald-900 text-white rounded-tr-none shadow-xs'
                      : 'bg-white text-slate-800 rounded-tl-none border border-slate-200/90 shadow-sm'
                  }`}
                >
                  <div className="text-[11.5px]">{msg.text}</div>

                  {msg.actionButton && (
                    <div className="mt-3 pt-2.5 border-t border-slate-150">
                      <Link
                        href={msg.actionButton.url}
                        onClick={() => setIsOpen(false)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 font-bold rounded-xl text-[11px] transition-colors border border-emerald-200 shadow-xs"
                      >
                        <span>{msg.actionButton.label}</span>
                        <ArrowRight className="w-3 h-3 text-emerald-700" />
                      </Link>
                    </div>
                  )}

                  <div
                    className={`mt-1.5 text-[9px] text-right font-medium ${
                      msg.sender === 'user' ? 'text-emerald-200' : 'text-slate-400'
                    }`}
                  >
                    {msg.timestamp}
                  </div>
                </div>

                {msg.sender === 'user' && (
                  <div className="w-6 h-6 rounded-lg bg-slate-200 text-slate-700 flex items-center justify-center shrink-0 mt-1 shadow-xs">
                    <User className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="flex gap-2 items-center">
                <div className="w-6 h-6 rounded-lg bg-emerald-800 text-white flex items-center justify-center shrink-0 shadow-xs">
                  <Bot className="w-3.5 h-3.5 text-amber-300 animate-spin" />
                </div>
                <div className="bg-white p-3 rounded-2xl rounded-tl-none border border-slate-200 text-xs text-slate-500 shadow-xs flex items-center gap-2">
                  <span className="inline-block w-1.5 h-1.5 bg-emerald-600 rounded-full animate-bounce [animation-delay:-0.3s]" />
                  <span className="inline-block w-1.5 h-1.5 bg-emerald-600 rounded-full animate-bounce [animation-delay:-0.15s]" />
                  <span className="inline-block w-1.5 h-1.5 bg-emerald-600 rounded-full animate-bounce" />
                  <span className="text-[11px] font-medium text-slate-500 ml-1">Mencocokkan informasi desa...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Footer */}
          <form
            onSubmit={handleSend}
            className="p-3 bg-white border-t border-slate-200 flex items-center gap-2 shadow-sm"
          >
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ketik pertanyaan atau kata kunci (contoh: syarat SKU, lacak surat, jam kantor)..."
              className="flex-1 px-3.5 py-2.5 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:border-transparent bg-slate-50 text-slate-900 font-medium placeholder:text-slate-400"
            />
            <button
              id="btn-ai-cs-send"
              type="submit"
              disabled={loading || !input.trim()}
              className="p-2.5 bg-emerald-800 hover:bg-emerald-900 disabled:opacity-40 text-white rounded-xl transition-all shadow-md active:scale-95 shrink-0"
              title="Kirim Pertanyaan"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
