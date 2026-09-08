'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  MapPin,
  Users,
  Home,
  Layers,
  Shield,
  ArrowRight,
  TreePine,
  Building,
  Building2,
  Heart,
  Trophy,
  Wheat,
  Star,
  Activity,
  Landmark,
  ShieldCheck,
  Stethoscope,
  Baby,
  Briefcase,
  Compass,
  CheckCircle2,
  Search,
  Info,
  Calendar,
  Phone,
  Mail,
  ChevronRight,
  Eye,
  FileText,
  PieChart,
  BarChart3,
  Navigation,
  Sparkles,
  TrendingUp,
  X,
  Clock,
  Car,
  Bike,
  HelpCircle,
  ExternalLink,
  Award,
  Check
} from 'lucide-react';

interface AparatDetail {
  jabatan: string;
  nama: string;
  kategori: 'pimpinan' | 'sekretariat' | 'teknis' | 'dusun';
  avatarColor: string;
  tugas: string;
  tupoksi: string[];
  ruangKerja: string;
  layanan: string;
  skPengangkatan?: string;
}

interface DusunDetail {
  id: string;
  nama: string;
  kepalaDusun: string;
  kontak: string;
  avatarColor: string;
  luas: string;
  persentaseLuas: string;
  pendudukEst: string;
  rtRw: string;
  karakteristik: string;
  komoditas: string[];
  fasilitasWilayah: string[];
  programPrioritas: string;
}

export default function ProfilDesaPage() {
  const [activeTab, setActiveTab] = useState<'tentang' | 'dusun' | 'aparat' | 'statistik' | 'fasilitas' | 'peta'>('tentang');
  
  // Interactive Dusun Explorer State
  const [selectedDusunId, setSelectedDusunId] = useState<string>('jombe-utara');

  // Interactive Aparat Filter & Modal State
  const [aparatFilter, setAparatFilter] = useState<'semua' | 'pimpinan' | 'sekretariat' | 'teknis' | 'dusun'>('semua');
  const [aparatSearch, setAparatSearch] = useState('');
  const [selectedAparat, setSelectedAparat] = useState<AparatDetail | null>(null);

  // Interactive Statistics Sub-tab State
  const [statTab, setStatTab] = useState<'demografi' | 'pekerjaan' | 'lahan' | 'ternak'>('demografi');

  // Interactive Strategic Priority Accordion State
  const [activeMisiIndex, setActiveMisiIndex] = useState<number | null>(0);

  // Interactive Route Planner State
  const [selectedRouteIndex, setSelectedRouteIndex] = useState<number>(0);

  // Facility Filter State
  const [facilityCategory, setFacilityCategory] = useState<'semua' | 'kesehatan' | 'ibadah' | 'olahraga'>('semua');

  // Data 5 Dusun Resmi Desa Jombe
  const dataDusun: DusunDetail[] = [
    {
      id: 'jombe-utara',
      nama: 'Dusun Jombe Utara',
      kepalaDusun: 'MUHAJRIN JUMARANG',
      kontak: 'Kantor Pelayanan Dusun Jombe Utara',
      avatarColor: 'from-emerald-800 to-teal-950',
      luas: '0,82 km²',
      persentaseLuas: '21,8%',
      pendudukEst: '540 Jiwa (142 KK)',
      rtRw: '2 RW / 4 RT',
      karakteristik: 'Kawasan agraris persawahan teknis dengan tingkat ketertiban dan swadaya masyarakat yang dinamis.',
      komoditas: ['Padi Sawah', 'Jagung Kuning', 'Kacang Hijau', 'Sayuran Hortikultura'],
      fasilitasWilayah: ['Posyandu Melati 1', 'Masjid Nurul Huda', 'Lapangan Takraw Dusun', 'Saluran Irigasi Teknis'],
      programPrioritas: 'Peningkatan drainase persawahan dan penerangan jalan lingkungan dusun.'
    },
    {
      id: 'jombe-tengah',
      nama: 'Dusun Jombe Tengah',
      kepalaDusun: 'BASO',
      kontak: 'Kantor Pelayanan Dusun Jombe Tengah',
      avatarColor: 'from-teal-800 to-slate-900',
      luas: '0,74 km²',
      persentaseLuas: '19,7%',
      pendudukEst: '585 Jiwa (155 KK)',
      rtRw: '2 RW / 4 RT',
      karakteristik: 'Pusat administratif dan denyut ekonomi desa, lokasi Kantor Desa, Pustu, dan sentra perniagaan lokal.',
      komoditas: ['Padi & Palawija', 'Usaha Pertokoan & Jasa', 'Ternak Kambing'],
      fasilitasWilayah: ['Kantor Desa Jombe', 'Puskesmas Pembantu (Pustu)', 'Masjid Besar Jombe', 'Fasilitas Bulutangkis'],
      programPrioritas: 'Pengembangan kawasan pelayanan terpadu dan revitalisasi tata ruang permukiman warga.'
    },
    {
      id: 'jombe-selatan',
      nama: 'Dusun Jombe Selatan',
      kepalaDusun: 'SAPARUDDIN',
      kontak: 'Kantor Pelayanan Dusun Jombe Selatan',
      avatarColor: 'from-emerald-900 to-slate-900',
      luas: '0,78 km²',
      persentaseLuas: '20,7%',
      pendudukEst: '512 Jiwa (136 KK)',
      rtRw: '2 RW / 4 RT',
      karakteristik: 'Wilayah perbukitan landai dengan tegalan produktif, sentra jagung hibrida dan perkebunan rakyat.',
      komoditas: ['Jagung Pipil Hibrida', 'Ubi Kayu', 'Ternak Kuda & Sapi'],
      fasilitasWilayah: ['Posyandu Mawar', 'Masjid Al-Ikhlas', 'Lapangan Bola Voli', 'Kelompok Tani Harapan'],
      programPrioritas: 'Penyediaan sumur bor pertanian dan bantuan bibit jagung unggul berdaya tahan tinggi.'
    },
    {
      id: 'tompo-balang',
      nama: 'Dusun Tompo Balang',
      kepalaDusun: 'NURLELA KAMARUDDIN',
      kontak: 'Kantor Pelayanan Dusun Tompo Balang',
      avatarColor: 'from-teal-900 to-emerald-950',
      luas: '0,72 km²',
      persentaseLuas: '19,1%',
      pendudukEst: '488 Jiwa (128 KK)',
      rtRw: '2 RW / 4 RT',
      karakteristik: 'Kawasan lumbung pangan dengan jaringan irigasi persawahan yang luas dan hamparan hijau yang subur.',
      komoditas: ['Padi Varietas Unggul', 'Kacang Tanah', 'Ternak Kambing'],
      fasilitasWilayah: ['Posyandu Teratai', 'Masjid Baiturrahman', 'Lapangan Takraw', 'Bendungan Irigasi Mikro'],
      programPrioritas: 'Normalisasi saluran tersier dan penguatan kelompok tani wanita pembuat olahan pangan.'
    },
    {
      id: 'muncu-muncu',
      nama: 'Dusun Muncu-muncu',
      kepalaDusun: 'ICAL RAHMAN',
      kontak: 'Kantor Pelayanan Dusun Muncu-muncu',
      avatarColor: 'from-slate-800 to-teal-950',
      luas: '0,70 km²',
      persentaseLuas: '18,7%',
      pendudukEst: '456 Jiwa (120 KK)',
      rtRw: '2 RW / 4 RT',
      karakteristik: 'Wilayah perbatasan barat dengan potensi peternakan terintegrasi dan perkebunan pakan ternak berkualitas.',
      komoditas: ['Peternakan Kambing & Kuda', 'Rumput Gajah / Pakan', 'Jagung'],
      fasilitasWilayah: ['Posyandu Kenanga', 'Masjid Babussalam', 'Lapangan Takraw', 'Pos Keamanan Lingkungan'],
      programPrioritas: 'Pembangunan jalan usaha tani (JUT) untuk akses pengangkutan komoditas dan hasil ternak.'
    }
  ];

  // Data Aparatur Resmi Desa Jombe
  const aparatDesa: AparatDetail[] = [
    {
      jabatan: 'Kepala Desa',
      nama: 'JUSMAEDY, S.Pd',
      kategori: 'pimpinan',
      avatarColor: 'from-emerald-900 via-emerald-800 to-teal-950',
      tugas: 'Memimpin penyelenggaraan pemerintahan desa, pembinaan kemasyarakatan, dan pemberdayaan masyarakat Desa Jombe.',
      tupoksi: [
        'Memegang kekuasaan pengelolaan Keuangan dan Aset Desa.',
        'Menetapkan Peraturan Desa (Perdes) bersama BPD.',
        'Mengoordinasikan pembangunan desa secara partisipatif dan transparan.',
        'Mewakili desa di dalam dan di luar pengadilan sesuai ketentuan hukum.'
      ],
      ruangKerja: 'Ruang Kerja Kepala Desa - Kantor Desa Jombe',
      layanan: 'Konsultasi Kebijakan Umum, Pengaduan Warga, dan Penandatanganan Dokumen Strategis.',
      skPengangkatan: 'SK Bupati Jeneponto No. 73/KD/2021'
    },
    {
      jabatan: 'Sekretaris Desa',
      nama: 'SYAMSUL RISWAN',
      kategori: 'sekretariat',
      avatarColor: 'from-emerald-800 to-slate-900',
      tugas: 'Mengkoordinasikan administrasi pemerintahan, keuangan, perumusan kebijakan desa, dan pengarsipan kepegawaian.',
      tupoksi: [
        'Mengoordinasikan penyusunan rancangan Peraturan Desa dan RKPDes/APBDes.',
        'Memverifikasi berkas permohonan surat sebelum ditandatangani Kepala Desa.',
        'Mengelola tata naskah dinas, kearsipan resmi, dan pelaporan berkala ke Kecamatan.'
      ],
      ruangKerja: 'Ruang Sekretariat Utama - Lantai 1',
      layanan: 'Verifikasi Administrasi, Legalisasi Dokumen, Informasi Publik Desa.'
    },
    {
      jabatan: 'Kasi Pemerintahan',
      nama: 'ZAINAL MUTTAQIN AHMAD',
      kategori: 'teknis',
      avatarColor: 'from-teal-800 to-slate-900',
      tugas: 'Mengelola tata kelola kependudukan, pertanahan, ketertiban umum, dan penyusunan profil wilayah desa.',
      tupoksi: [
        'Mengelola administrasi kependudukan (KK, KTP, Surat Pindah, Domisili).',
        'Fasilitasi administrasi pertanahan, sporadik, dan batas kepemilikan tanah warga.',
        'Pembinaan ketentraman, ketertiban umum (Trantib), dan Linmas Desa.'
      ],
      ruangKerja: 'Seksi Pemerintahan & Pertanahan',
      layanan: 'Surat Keterangan Domisili, Surat Pindah, Sporadik Tanah, Pengantar KTP/KK.'
    },
    {
      jabatan: 'Kasi Pelayanan Umum',
      nama: 'SARDI',
      kategori: 'teknis',
      avatarColor: 'from-emerald-700 to-cyan-900',
      tugas: 'Melaksanakan pelayanan administrasi kependudukan dan penerbitan surat keterangan untuk masyarakat.',
      tupoksi: [
        'Melayani verifikasi permohonan surat izin usaha (SKU), tidak mampu (SKTM), dan surat keterangan lainnya.',
        'Mengoperasikan sistem pelayanan mandiri digital Desa Jombe.',
        'Membantu warga dalam proses pembuatan surat secara cepat dan ramah.'
      ],
      ruangKerja: 'Front Office Pelayanan Terpadu Satu Pintu (PTSP)',
      layanan: 'Surat Keterangan Usaha (SKU), SKTM, Surat Kematian, Surat Kelahiran, SKCK.'
    },
    {
      jabatan: 'Kasi Kesra',
      nama: 'SUKARDI',
      kategori: 'teknis',
      avatarColor: 'from-teal-700 to-emerald-900',
      tugas: 'Mengelola program kesejahteraan rakyat, kesehatan, bantuan sosial, dan pemberdayaan masyarakat desa.',
      tupoksi: [
        'Pendataan dan verifikasi penerima bantuan sosial (PKH, BLT-DD, BPNT).',
        'Koordinasi posyandu balita & lansia, pencegahan stunting, dan sanitasi desa.',
        'Pembinaan kegiatan keagamaan, olahraga, seni budaya, dan kepemudaan (Karang Taruna).'
      ],
      ruangKerja: 'Seksi Kesejahteraan Rakyat',
      layanan: 'Rekomendasi Bantuan Sosial, Pengantar BPJS PBI, Pengantar Beasiswa Desa.'
    },
    {
      jabatan: 'Kaur Perencanaan',
      nama: 'SYARIF AL-QADRI',
      kategori: 'sekretariat',
      avatarColor: 'from-slate-700 to-emerald-950',
      tugas: 'Menyusun RKPDes, RPJMDes, inventaris aset kekayaan desa, dan perencanaan pembangunan desa.',
      tupoksi: [
        'Menyusun dokumen perencanaan desa (RPJMDes, RKPDes, dan Daftar Usulan RKPDes).',
        'Menginventarisasi aset dan sarana prasarana milik Pemerintah Desa Jombe.',
        'Monitoring dan evaluasi pelaksanaan kegiatan pembangunan fisik desa.'
      ],
      ruangKerja: 'Ruang Urusan Perencanaan & Pembangunan',
      layanan: 'Informasi RKPDes, Usulan Musrenbangdus, Data Inventaris Aset Desa.'
    },
    {
      jabatan: 'Kaur Keuangan',
      nama: 'ARIANTO',
      kategori: 'sekretariat',
      avatarColor: 'from-emerald-800 to-slate-800',
      tugas: 'Menatausahakan APBDes, penerimaan pendapatan asli desa, transfer dana desa (ADD/DD), serta laporan keuangan.',
      tupoksi: [
        'Menyiapkan Dokumen Pelaksanaan Anggaran (DPA) dan Surat Permintaan Pembayaran (SPP).',
        'Mencatat pembukuan keuangan desa secara akuntabel pada Siskeudes.',
        'Menyusun Laporan Pertanggungjawaban Realisasi APBDes berkala.'
      ],
      ruangKerja: 'Ruang Urusan Keuangan & Perbendaharaan',
      layanan: 'Transparansi APBDes, Pembayaran Pajak Bumi & Bangunan (PBB-P2).'
    },
    {
      jabatan: 'Kaur Administrasi dan T.U',
      nama: 'KASMAWATI',
      kategori: 'sekretariat',
      avatarColor: 'from-teal-800 to-slate-800',
      tugas: 'Mengelola administrasi umum perkantoran desa, tata usaha, dan pengarsipan surat masuk dan keluar.',
      tupoksi: [
        'Pencatatan agenda surat masuk dan ekspedisi surat keluar.',
        'Pengelolaan perlengkapan kantor, logistik, dan administrasi kepegawaian desa.',
        'Penyusunan notula rapat musyawarah desa dan arsip resmi.'
      ],
      ruangKerja: 'Ruang Tata Usaha & Kearsipan',
      layanan: 'Penerimaan Surat Masuk, Permohonan Informasi, Pengarsipan Dokumen.'
    },
    {
      jabatan: 'Kepala Dusun Jombe Utara',
      nama: 'MUHAJRIN JUMARANG',
      kategori: 'dusun',
      avatarColor: 'from-emerald-900 to-teal-800',
      tugas: 'Pembinaan ketertiban, pelayanan warga, dan penggerak gotong royong di wilayah Dusun Jombe Utara.',
      tupoksi: [
        'Melayani pengantar surat pengantar RT/RW untuk warga Dusun Jombe Utara.',
        'Menjaga ketentraman, keamanan lingkungan, dan kerukunan warga.',
        'Mengoordinasikan kegiatan swadaya gotong royong dan poskamling.'
      ],
      ruangKerja: 'Pos Pelayanan Kewilayahan Dusun Jombe Utara',
      layanan: 'Pengantar Surat Tingkat Dusun, Mediasi Warga, Pendataan Kependudukan.'
    },
    {
      jabatan: 'Kepala Dusun Jombe Tengah',
      nama: 'BASO',
      kategori: 'dusun',
      avatarColor: 'from-slate-800 to-teal-900',
      tugas: 'Koordinator kewilayahan, penyalur aspirasi warga, dan penggerak swadaya Dusun Jombe Tengah.',
      tupoksi: [
        'Melayani pengantar surat pengantar RT/RW untuk warga Dusun Jombe Tengah.',
        'Menjaga ketertiban kawasan pusat perekonomian dan perkantoran desa.',
        'Mengoordinasikan partisipasi warga dalam musrenbang tingkat dusun.'
      ],
      ruangKerja: 'Pos Pelayanan Kewilayahan Dusun Jombe Tengah',
      layanan: 'Pengantar Surat Tingkat Dusun, Mediasi Warga, Penataan Lingkungan.'
    },
    {
      jabatan: 'Kepala Dusun Jombe Selatan',
      nama: 'SAPARUDDIN',
      kategori: 'dusun',
      avatarColor: 'from-teal-800 to-emerald-900',
      tugas: 'Pembinaan ketertiban dan pelayanan warga masyarakat di wilayah Dusun Jombe Selatan.',
      tupoksi: [
        'Melayani pengantar surat pengantar RT/RW untuk warga Dusun Jombe Selatan.',
        'Mengoordinasikan kelompok tani dan peternak di wilayah selatan.',
        'Penyaluran informasi program bantuan desa ke tingkat RT.'
      ],
      ruangKerja: 'Pos Pelayanan Kewilayahan Dusun Jombe Selatan',
      layanan: 'Pengantar Surat Tingkat Dusun, Rekomendasi Kelompok Tani, Pendataan Bansos.'
    },
    {
      jabatan: 'Kepala Dusun Tompo Balang',
      nama: 'NURLELA KAMARUDDIN',
      kategori: 'dusun',
      avatarColor: 'from-emerald-800 to-cyan-900',
      tugas: 'Koordinator pelayanan administrasi dan pembinaan kemasyarakatan di wilayah Dusun Tompo Balang.',
      tupoksi: [
        'Melayani pengantar surat pengantar RT/RW untuk warga Dusun Tompo Balang.',
        'Mendorong partisipasi perempuan dalam posyandu dan kelompok usaha bersama.',
        'Monitoring pemeliharaan infrastruktur irigasi persawahan dusun.'
      ],
      ruangKerja: 'Pos Pelayanan Kewilayahan Dusun Tompo Balang',
      layanan: 'Pengantar Surat Tingkat Dusun, Pembinaan Posyandu, Pengaduan Warga.'
    },
    {
      jabatan: 'Kepala Dusun Muncu-muncu',
      nama: 'ICAL RAHMAN',
      kategori: 'dusun',
      avatarColor: 'from-indigo-900 to-slate-900',
      tugas: 'Koordinator pelayanan administrasi dan pembinaan kemasyarakatan di wilayah Dusun Muncu-muncu.',
      tupoksi: [
        'Melayani pengantar surat pengantar RT/RW untuk warga Dusun Muncu-muncu.',
        'Mengoordinasikan pemeliharaan jalan usaha tani dan keamanan lingkungan.',
        'Pendataan hewan ternak dan pengawasan kesehatan ternak bersama mantri.'
      ],
      ruangKerja: 'Pos Pelayanan Kewilayahan Dusun Muncu-muncu',
      layanan: 'Pengantar Surat Tingkat Dusun, Surat Keterangan Ternak, Pendataan Warga.'
    }
  ];

  // 5 Pilar Agenda Strategis
  const agendaStrategis = [
    {
      no: '01',
      judul: 'Transformasi Pelayanan Publik Digital',
      ringkasan: 'Mewujudkan birokrasi desa yang bebas pungli, cepat, dan dapat diakses 24 jam secara transparan.',
      target: ['Layanan Surat Online Real-Time', 'Pelacakan Status Berkas Mandiri', 'Arsip Digital Terintegrasi', 'Transparansi APBDes Terbuka']
    },
    {
      no: '02',
      judul: 'Ketahanan Pangan & Optimalisasi Pertanian',
      ringkasan: 'Meningkatkan produktivitas 192 Ha sawah teknis dan 212 Ha tegalan produktif melalui modernisasi sarana tani.',
      target: ['Perbaikan Saluran Irigasi Tersier', 'Bantuan Bibit Jagung & Padi Unggul', 'Penguatan 12 Kelompok Tani', 'Kemudahan Akses Pupuk']
    },
    {
      no: '03',
      judul: 'Infrastruktur Dusun Merata & Terkoneksi',
      ringkasan: 'Pembangunan jalan lingkungan, jalan usaha tani (JUT), dan penerangan jalan di 5 dusun tanpa diskriminasi.',
      target: ['Pavingisasi Jalan Lingkungan Dusun', 'Pembangunan JUT Muncu-muncu & Tompo Balang', 'Drainase Permukiman Bebas Genangan', 'PJU Hemat Energi']
    },
    {
      no: '04',
      judul: 'Kesehatan Prima & Nol Stunting',
      ringkasan: 'Pelayanan kesehatan preventif melalui 5 Posyandu terpadu di tiap dusun dan penguatan peran Puskesmas Pembantu.',
      target: ['Pemberian Makanan Tambahan (PMT) Balita', 'Pemeriksaan Lansia Rutin Bulanan', 'Sanitasi Air Bersih Layak Konsumsi', 'Peningkatan Honor Kader Posyandu']
    },
    {
      no: '05',
      judul: 'Pemberdayaan Ekonomi & UMKM Kerakyatan',
      ringkasan: 'Pengembangan kapasitas wirausaha muda, peternakan rakyat kambing/kuda, dan fasilitasi legalitas usaha mikro.',
      target: ['Pelatihan Pengolahan Hasil Panen', 'Bantuan Modal Bergulir BUMDes', 'Fasilitasi Surat Izin Usaha Gratis', 'Bursa Pasar Hewan Ternak']
    }
  ];

  // Interactive Route Guide
  const routes = [
    {
      tujuan: 'Ibukota Kecamatan Turatea (Kantor Camat)',
      jarak: '17,0 km',
      waktuTempuh: '± 28 Menit',
      moda: 'Sepeda Motor / Mobil',
      kondisiJalan: 'Aspal Hotmix & Sebagian Beton',
      catatan: 'Desa Jombe merupakan desa dengan jarak terjauh ke ibukota kecamatan di wilayah Turatea.',
      jalur: 'Jalan Poros Desa Jombe → Simpang Kayuloe → Jl. Poros Turatea'
    },
    {
      tujuan: 'Ibukota Kabupaten Jeneponto (Kantor Bupati)',
      jarak: '8,70 km',
      waktuTempuh: '± 16 Menit',
      moda: 'Sepeda Motor / Mobil / Angkutan',
      kondisiJalan: 'Aspal Kabupaten Halus',
      catatan: 'Akses sangat dekat menuju pusat pemerintahan, perkantoran dinas, dan perbankan kabupaten.',
      jalur: 'Jalan Poros Jombe → Jl. Poros Jeneponto-Binamu → Kompleks Pemkab Jeneponto'
    },
    {
      tujuan: 'RSUD Lanto Dg. Pasewang Jeneponto',
      jarak: '9,20 km',
      waktuTempuh: '± 18 Menit',
      moda: 'Ambulans / Kendaraan Roda 4',
      kondisiJalan: 'Aspal Halus (Akses Darurat 24 Jam)',
      catatan: 'Rujukan fasilitas kesehatan tingkat lanjut dari Puskesmas Pembantu Desa Jombe.',
      jalur: 'Jalan Poros Jombe → Jl. Ishak Iskandar → Jl. Melati (RSUD)'
    },
    {
      tujuan: 'Pasar Induk Karisa Jeneponto',
      jarak: '8,40 km',
      waktuTempuh: '± 15 Menit',
      moda: 'Mobil Angkutan / Pick Up / Motor',
      kondisiJalan: 'Aspal Ramai Lancar',
      catatan: 'Pusat perdagangan utama tempat warga Desa Jombe menjual hasil panen jagung, gabah, dan ternak.',
      jalur: 'Jalan Poros Jombe → Jl. Pahlawan → Kawasan Niaga Pasar Karisa'
    }
  ];

  // Filtered Aparat
  const filteredAparat = useMemo(() => {
    return aparatDesa.filter((item) => {
      const matchKategori = aparatFilter === 'semua' || item.kategori === aparatFilter;
      const matchSearch =
        item.nama.toLowerCase().includes(aparatSearch.toLowerCase()) ||
        item.jabatan.toLowerCase().includes(aparatSearch.toLowerCase()) ||
        item.tugas.toLowerCase().includes(aparatSearch.toLowerCase());
      return matchKategori && matchSearch;
    });
  }, [aparatFilter, aparatSearch]);

  const selectedDusun = useMemo(() => {
    return dataDusun.find((d) => d.id === selectedDusunId) || dataDusun[0];
  }, [selectedDusunId]);

  const tabs = [
    { id: 'tentang', label: 'Tentang Desa & Visi', icon: <Star className="w-4 h-4" /> },
    { id: 'dusun', label: '5 Wilayah Dusun', icon: <Layers className="w-4 h-4" /> },
    { id: 'statistik', label: 'Data & Statistik', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'aparat', label: 'Aparatur Pemerintahan', icon: <Users className="w-4 h-4" /> },
    { id: 'fasilitas', label: 'Sarana & Fasilitas', icon: <Building className="w-4 h-4" /> },
    { id: 'peta', label: 'Peta & Akses Wilayah', icon: <Compass className="w-4 h-4" /> },
  ] as const;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-emerald-800 selection:text-white pb-16">
      {/* ═════════════════════ HERO BANNER RESMI ═════════════════════ */}
      <div className="relative overflow-hidden bg-gradient-to-br from-emerald-950 via-emerald-900 to-teal-950 text-white border-b border-emerald-800/40">
        {/* Subtle geometric grid background */}
        <div 
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
            backgroundSize: '24px 24px'
          }}
        />
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="max-w-4xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-800/70 border border-emerald-500/30 text-xs font-bold uppercase tracking-wider text-emerald-200 backdrop-blur-sm">
              <Landmark className="w-3.5 h-3.5 text-emerald-400" />
              Pemerintah Desa Jombe · Kabupaten Jeneponto
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight">
              Profil Resmi <span className="text-emerald-400">Desa Jombe</span>
            </h1>

            <p className="text-sm sm:text-base text-emerald-100/90 leading-relaxed max-w-2xl font-medium">
              Kecamatan Turatea, Kabupaten Jeneponto, Sulawesi Selatan. Kawasan agraris swasembada yang berintegritas, bertransformasi menuju tata kelola pemerintahan digital yang akuntabel, transparan, dan berorientasi melayani masyarakat.
            </p>

            {/* Official Metadata Badges */}
            <div className="flex flex-wrap gap-2 pt-2 text-xs font-semibold text-emerald-100">
              <span className="flex items-center gap-1.5 bg-emerald-950/80 px-3 py-1.5 rounded-xl border border-emerald-700/50">
                <MapPin className="w-3.5 h-3.5 text-emerald-400" /> Kode Wilayah Kemendagri: <strong>7304082009</strong>
              </span>
              <span className="flex items-center gap-1.5 bg-emerald-950/80 px-3 py-1.5 rounded-xl border border-emerald-700/50">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Kepala Desa: <strong>JUSMAEDY, S.Pd</strong>
              </span>
              <span className="flex items-center gap-1.5 bg-emerald-950/80 px-3 py-1.5 rounded-xl border border-emerald-700/50">
                <Trophy className="w-3.5 h-3.5 text-amber-400" /> Status: <strong>Swasembada (Cepat Berkembang)</strong>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ═════════════════════ QUICK STATS CARDS ═════════════════════ */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
          {[
            { val: '2.581', label: 'Total Penduduk', sub: '1.269 L / 1.312 P', icon: <Users className="w-4 h-4 text-emerald-700" />, tabTarget: 'statistik' },
            { val: '3,76', label: 'Luas Wilayah', sub: 'km² (7% Kec. Turatea)', icon: <Compass className="w-4 h-4 text-teal-700" />, tabTarget: 'statistik' },
            { val: '5', label: 'Wilayah Dusun', sub: '10 RW / 20 RT', icon: <Layers className="w-4 h-4 text-indigo-700" />, tabTarget: 'dusun' },
            { val: '686,44', label: 'Kepadatan Penduduk', sub: 'Jiwa / km² (BPS)', icon: <TrendingUp className="w-4 h-4 text-slate-700" />, tabTarget: 'statistik' },
          ].map((item, idx) => (
            <button
              key={idx}
              onClick={() => setActiveTab(item.tabTarget as any)}
              className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-sm hover:shadow-md hover:border-emerald-300 transition-all text-left flex flex-col justify-between group cursor-pointer"
            >
              <div className="flex items-center justify-between w-full mb-2">
                <span className="p-2 rounded-xl bg-slate-100 group-hover:bg-emerald-50 transition-colors">
                  {item.icon}
                </span>
                <span className="text-[10px] font-bold text-slate-400 group-hover:text-emerald-700 flex items-center gap-0.5">
                  Buka Detail <ChevronRight className="w-3 h-3" />
                </span>
              </div>
              <div>
                <span className="text-2xl sm:text-3xl font-black text-slate-900 block tracking-tight">{item.val}</span>
                <span className="text-xs font-bold text-slate-700 block">{item.label}</span>
                <span className="text-[11px] text-slate-500 block mt-0.5">{item.sub}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* ═════════════════════ MAIN INTERACTIVE CONTENT ═════════════════════ */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-6">
        {/* Navigation Tabs Bar */}
        <div className="bg-white p-1.5 rounded-2xl border border-slate-200 shadow-sm flex gap-1.5 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 whitespace-nowrap transition-all cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-emerald-900 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* ════════════════════════════════════════════════════════════════════
            TAB 1: TENTANG DESA, VISI & MISI, AGENDA STRATEGIS
           ════════════════════════════════════════════════════════════════════ */}
        {activeTab === 'tentang' && (
          <div className="space-y-6">
            {/* Visi Banner */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs uppercase tracking-wider">
                <Star className="w-4 h-4 text-emerald-700 fill-emerald-700" />
                Visi Pembangunan Desa Jombe
              </div>
              <blockquote className="text-lg sm:text-2xl font-black text-slate-900 leading-snug border-l-4 border-emerald-800 pl-4 py-1">
                &ldquo;Terwujudnya Desa Jombe yang Mandiri, Sejahtera, Transparan, dan Berkelanjutan Berbasis Pelayanan Publik Digital.&rdquo;
              </blockquote>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Visi ini menjadi landasan strategis Pemerintah Desa Jombe dalam mengoptimalkan potensi sumber daya agraris, meningkatkan kualitas SDM aparatur dan warga, serta menghadirkan birokrasi pemerintahan desa yang bersih, cepat, dan mudah diakses oleh seluruh lapisan masyarakat.
              </p>
            </div>

            {/* Interactive 5 Pilar Agenda Strategis */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
                <div>
                  <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-800" />
                    5 Pilar Kebijakan & Agenda Strategis Desa
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Klik pilar untuk melihat rincian program kerja dan indikator capaian pembangunan desa.
                  </p>
                </div>
                <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 self-start sm:self-auto">
                  RPJMDes 2021-2027
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-5 gap-2">
                {agendaStrategis.map((item, idx) => {
                  const isSelected = activeMisiIndex === idx;
                  return (
                    <button
                      key={idx}
                      onClick={() => setActiveMisiIndex(idx)}
                      className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                        isSelected
                          ? 'bg-emerald-900 text-white border-emerald-950 shadow-md ring-2 ring-emerald-600/30'
                          : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-800'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <span className={`text-xs font-black px-2 py-0.5 rounded-lg ${
                          isSelected ? 'bg-emerald-800 text-emerald-200' : 'bg-white text-slate-600 border border-slate-200'
                        }`}>
                          Pilar {item.no}
                        </span>
                        {isSelected && <Sparkles className="w-3.5 h-3.5 text-emerald-300" />}
                      </div>
                      <h4 className={`text-xs font-bold leading-snug line-clamp-2 ${isSelected ? 'text-white' : 'text-slate-900'}`}>
                        {item.judul}
                      </h4>
                    </button>
                  );
                })}
              </div>

              {/* Active Agenda Detail Card */}
              {activeMisiIndex !== null && (
                <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-2xl p-5 sm:p-6 space-y-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <span className="text-[10px] font-black uppercase text-emerald-800 tracking-wider">
                        Rincian Program Prioritas · Pilar {agendaStrategis[activeMisiIndex].no}
                      </span>
                      <h3 className="text-base sm:text-lg font-black text-slate-900 mt-0.5">
                        {agendaStrategis[activeMisiIndex].judul}
                      </h3>
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                    {agendaStrategis[activeMisiIndex].ringkasan}
                  </p>

                  <div className="pt-2 border-t border-emerald-200/60">
                    <span className="text-xs font-bold text-slate-900 block mb-2.5">
                      Indikator Sasaran & Target Pelaksanaan:
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {agendaStrategis[activeMisiIndex].target.map((tgt, tIdx) => (
                        <div key={tIdx} className="bg-white px-3.5 py-2.5 rounded-xl border border-emerald-100 shadow-2xs flex items-center gap-2.5 text-xs text-slate-800 font-medium">
                          <span className="w-5 h-5 rounded-lg bg-emerald-100 text-emerald-900 flex items-center justify-center font-bold text-[10px] shrink-0">
                            {tIdx + 1}
                          </span>
                          <span>{tgt}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Geografis & Batas Wilayah */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-5">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                <Compass className="w-5 h-5 text-emerald-800" />
                <div>
                  <h2 className="text-base font-black text-slate-900">Letak Geografis & Batas Administrasi</h2>
                  <p className="text-xs text-slate-500">Batas wilayah hukum dan administrasi Desa Jombe dengan desa sekitar.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                {[
                  { arah: 'Sebelah Utara', batas: 'Desa Turatea Timur', desc: 'Batas persawahan dan jalan poros antar-desa' },
                  { arah: 'Sebelah Selatan', batas: 'Kecamatan Binamu', desc: 'Batas langsung dengan wilayah ibukota kabupaten' },
                  { arah: 'Sebelah Timur', batas: 'Desa Mangepong', desc: 'Batas saluran irigasi dan lahan pertanian' },
                  { arah: 'Sebelah Barat', batas: 'Desa Kayuloe Barat', desc: 'Batas perkebunan tegalan dan permukiman' },
                ].map((b, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200/90 space-y-1 hover:bg-emerald-50/50 hover:border-emerald-200 transition-colors">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">{b.arah}</span>
                    <span className="text-sm font-black text-slate-900 block">{b.batas}</span>
                    <span className="text-[11px] text-slate-500 block leading-snug">{b.desc}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ════════════════════════════════════════════════════════════════════
            TAB 2: 5 WILAYAH DUSUN EXPLORER (INTERACTIVE)
           ════════════════════════════════════════════════════════════════════ */}
        {activeTab === 'dusun' && (
          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
                <div>
                  <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
                    <Layers className="w-5 h-5 text-emerald-800" />
                    Penjelajah Interaktif 5 Wilayah Dusun
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Pilih salah satu dusun di bawah untuk melihat rincian kewilayahan, kepala dusun, dan potensi unggulan.
                  </p>
                </div>
                <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200 self-start sm:self-auto">
                  Total 5 Dusun · 10 RW · 20 RT
                </span>
              </div>

              {/* Dusun Selector Tabs */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
                {dataDusun.map((dusun) => {
                  const isSelected = selectedDusunId === dusun.id;
                  return (
                    <button
                      key={dusun.id}
                      onClick={() => setSelectedDusunId(dusun.id)}
                      className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                        isSelected
                          ? 'bg-emerald-900 text-white border-emerald-950 shadow-md ring-2 ring-emerald-600/30'
                          : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-800'
                      }`}
                    >
                      <div>
                        <span className={`text-[10px] font-bold uppercase block mb-1 ${isSelected ? 'text-emerald-300' : 'text-slate-400'}`}>
                          Dusun
                        </span>
                        <h4 className="text-xs font-black leading-tight">{dusun.nama.replace('Dusun ', '')}</h4>
                      </div>
                      <div className="mt-3 pt-2 border-t border-slate-100/20 text-[10px]">
                        <span className={`block font-medium truncate ${isSelected ? 'text-emerald-200' : 'text-slate-500'}`}>
                          Kadus: {dusun.kepalaDusun.split(' ')[0]}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Selected Dusun Detailed Dashboard */}
              <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
                  <div className="flex items-center gap-4">
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${selectedDusun.avatarColor} flex items-center justify-center text-white font-black text-base shadow-sm shrink-0`}>
                      {selectedDusun.nama.split(' ').map(n => n[0]).slice(1).join('')}
                    </div>
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-200">
                        Profil Wilayah Dusun
                      </span>
                      <h3 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
                        {selectedDusun.nama}
                      </h3>
                      <p className="text-xs text-slate-600 font-medium">
                        Kepala Dusun: <strong className="text-slate-900">{selectedDusun.kepalaDusun}</strong>
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <span className="text-xs bg-white border border-slate-200 px-3 py-1.5 rounded-xl font-bold text-slate-800 shadow-2xs">
                      Luas: {selectedDusun.luas} ({selectedDusun.persentaseLuas})
                    </span>
                    <span className="text-xs bg-white border border-slate-200 px-3 py-1.5 rounded-xl font-bold text-slate-800 shadow-2xs">
                      Estimasi: {selectedDusun.pendudukEst}
                    </span>
                  </div>
                </div>

                {/* Dusun Description & Characteristics */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Left 2 Cols: Info & Potensi */}
                  <div className="lg:col-span-2 space-y-5">
                    <div>
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                        Karakteristik & Kondisi Wilayah
                      </h4>
                      <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium bg-white p-4 rounded-2xl border border-slate-200/90">
                        {selectedDusun.karakteristik}
                      </p>
                    </div>

                    <div>
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                        Komoditas & Produk Unggulan
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedDusun.komoditas.map((k, kIdx) => (
                          <span key={kIdx} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-800 shadow-2xs">
                            <Wheat className="w-3.5 h-3.5 text-emerald-700" />
                            {k}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                        Program Prioritas Wilayah
                      </h4>
                      <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-4 text-xs font-medium text-slate-800 flex items-start gap-2.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-800 shrink-0 mt-0.5" />
                        <span>{selectedDusun.programPrioritas}</span>
                      </div>
                    </div>
                  </div>

                  {/* Right Col: Fasilitas di Dusun */}
                  <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-2xs space-y-4">
                    <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2 flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-emerald-800" />
                      Sarana di {selectedDusun.nama.replace('Dusun ', '')}
                    </h4>
                    <ul className="space-y-2 text-xs">
                      {selectedDusun.fasilitasWilayah.map((f, fIdx) => (
                        <li key={fIdx} className="flex items-center gap-2 text-slate-700 font-medium">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-700" />
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>

                    <div className="pt-3 border-t border-slate-100">
                      <span className="text-[10px] text-slate-400 uppercase font-bold block mb-1">Struktur RT/RW</span>
                      <span className="text-xs font-black text-slate-800">{selectedDusun.rtRw} Terdaftar Resmi</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ════════════════════════════════════════════════════════════════════
            TAB 3: DATA & STATISTIK (INTERACTIVE VISUALIZER)
           ════════════════════════════════════════════════════════════════════ */}
        {activeTab === 'statistik' && (
          <div className="space-y-6">
            {/* Sub-tabs for Statistics */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                <div>
                  <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-emerald-800" />
                    Statistik & Data Resmi Desa Jombe
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Sumber data: Badan Pusat Statistik (BPS) & Rekapitulasi Data Desa 2024/2025.
                  </p>
                </div>

                {/* Sub Tab Switcher */}
                <div className="flex gap-1.5 bg-slate-100 p-1 rounded-xl self-start sm:self-auto overflow-x-auto">
                  {[
                    { id: 'demografi', label: 'Demografi' },
                    { id: 'pekerjaan', label: 'Pekerjaan' },
                    { id: 'lahan', label: 'Tata Guna Lahan' },
                    { id: 'ternak', label: 'Populasi Ternak' },
                  ].map((st) => (
                    <button
                      key={st.id}
                      onClick={() => setStatTab(st.id as any)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                        statTab === st.id
                          ? 'bg-white text-emerald-900 shadow-2xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {st.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* STAT SUB-TAB 1: DEMOGRAFI */}
              {statTab === 'demografi' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 text-center">
                    {[
                      { label: 'Total Penduduk', val: '2.581', sub: 'Jiwa (Data BPS)', color: 'bg-emerald-50 border-emerald-200 text-emerald-900' },
                      { label: 'Laki-Laki', val: '1.269', sub: 'Jiwa (49,17%)', color: 'bg-sky-50 border-sky-200 text-sky-900' },
                      { label: 'Perempuan', val: '1.312', sub: 'Jiwa (50,83%)', color: 'bg-teal-50 border-teal-200 text-teal-900' },
                      { label: 'Rasio Gender', val: '96,72', sub: 'Laki-laki per 100 Perempuan', color: 'bg-slate-50 border-slate-200 text-slate-900' },
                    ].map((s, idx) => (
                      <div key={idx} className={`p-4 rounded-2xl border ${s.color} space-y-1`}>
                        <span className="text-2xl font-black block tracking-tight">{s.val}</span>
                        <span className="text-xs font-bold block">{s.label}</span>
                        <span className="text-[10px] opacity-75 block">{s.sub}</span>
                      </div>
                    ))}
                  </div>

                  {/* Interactive Visual Distribution Bar */}
                  <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                        Komposisi Jenis Kelamin Penduduk
                      </h4>
                      <span className="text-xs font-bold text-slate-500">Total: 2.581 Jiwa</span>
                    </div>

                    {/* Proportional Split Bar */}
                    <div className="h-5 w-full bg-slate-200 rounded-full overflow-hidden flex shadow-inner">
                      <div className="h-full bg-sky-700 flex items-center justify-center text-[10px] font-black text-white" style={{ width: '49.17%' }}>
                        Laki-laki 49,17%
                      </div>
                      <div className="h-full bg-teal-600 flex items-center justify-center text-[10px] font-black text-white" style={{ width: '50.83%' }}>
                        Perempuan 50,83%
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
                      <div className="bg-white p-3.5 rounded-xl border border-slate-200 flex items-center justify-between">
                        <span className="font-semibold text-slate-700 flex items-center gap-2">
                          <span className="w-3 h-3 rounded-full bg-sky-700" />
                          Laki-Laki
                        </span>
                        <span className="font-black text-slate-900">1.269 Jiwa</span>
                      </div>
                      <div className="bg-white p-3.5 rounded-xl border border-slate-200 flex items-center justify-between">
                        <span className="font-semibold text-slate-700 flex items-center gap-2">
                          <span className="w-3 h-3 rounded-full bg-teal-600" />
                          Perempuan
                        </span>
                        <span className="font-black text-slate-900">1.312 Jiwa</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* STAT SUB-TAB 2: PEKERJAAN */}
              {statTab === 'pekerjaan' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {[
                      { icon: <Wheat className="w-6 h-6 text-emerald-800" />, label: 'Petani & Tanaman Pangan', val: '479', sub: 'Orang (Sektor Dominan)', pct: '62,5%' },
                      { icon: <TreePine className="w-6 h-6 text-teal-800" />, label: 'Peternak Rakyat', val: '215', sub: 'Orang (Kambing/Kuda/Sapi)', pct: '28,1%' },
                      { icon: <Briefcase className="w-6 h-6 text-slate-800" />, label: 'PNS / TNI / POLRI & Lainnya', val: '72', sub: 'Orang (Aparatur & Pegawai)', pct: '9,4%' },
                    ].map((item, idx) => (
                      <div key={idx} className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center border border-slate-200 shadow-2xs">
                            {item.icon}
                          </div>
                          <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900">
                            {item.pct}
                          </span>
                        </div>
                        <div>
                          <p className="text-2xl font-black text-slate-900">{item.val} <span className="text-xs font-medium text-slate-500">orang</span></p>
                          <p className="text-xs text-slate-800 font-bold mt-0.5">{item.label}</p>
                          <p className="text-[11px] text-slate-500">{item.sub}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 text-xs text-slate-800 leading-relaxed font-medium">
                    <Info className="w-4 h-4 text-emerald-800 inline mr-1.5 -mt-0.5" />
                    Mayoritas aktivitas mata pencaharian warga Desa Jombe bertumpu pada sektor agraris (pertanian tanaman pangan seperti padi sawah dan jagung) serta peternakan kambing dan kuda yang memiliki nilai ekonomi tinggi di pasar Jeneponto.
                  </div>
                </div>
              )}

              {/* STAT SUB-TAB 3: TATA GUNA LAHAN */}
              {statTab === 'lahan' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
                    {[
                      { label: 'Sawah Teknis & Tadah Hujan', val: '192,00 ha', pct: '51,0%', color: 'bg-emerald-50 border-emerald-200 text-emerald-900' },
                      { label: 'Tegalan / Lahan Kering', val: '212,00 ha', pct: '56,3%', color: 'bg-teal-50 border-teal-200 text-teal-900' },
                      { label: 'Pekarangan & Permukiman', val: '21,00 ha', pct: '5,5%', color: 'bg-slate-50 border-slate-200 text-slate-900' },
                      { label: 'Penggunaan Lainnya', val: '3,65 ha', pct: '1,0%', color: 'bg-amber-50 border-amber-200 text-amber-900' },
                    ].map((item, idx) => (
                      <div key={idx} className={`rounded-2xl border p-4 text-center space-y-1 ${item.color}`}>
                        <span className="text-xl sm:text-2xl font-black block">{item.val}</span>
                        <span className="text-xs font-bold block">{item.label}</span>
                        <span className="text-[10px] opacity-75 block">Proporsi: {item.pct}</span>
                      </div>
                    ))}
                  </div>

                  <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-2">
                    <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                      Distribusi Tata Ruang Wilayah Total 3,76 km²
                    </h4>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Lahan pertanian pangan dan perkebunan tegalan menempati lebih dari 90% total luas wilayah Desa Jombe. Pemerintah Desa berkomitmen melindungi Lahan Pertanian Pangan Berkelanjutan (LP2B) untuk memastikan ketahanan pangan desa.
                    </p>
                  </div>
                </div>
              )}

              {/* STAT SUB-TAB 4: POPULASI TERNAK */}
              {statTab === 'ternak' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 text-center">
                    {[
                      { label: 'Kambing', val: '288', unit: 'Ekor', desc: 'Populasi terbanyak di 5 dusun', color: 'text-emerald-900' },
                      { label: 'Kuda', val: '96', unit: 'Ekor', desc: 'Ternak khas budaya Jeneponto', color: 'text-teal-900' },
                      { label: 'Sapi Potong', val: '43', unit: 'Ekor', desc: 'Ternak ruminansia besar', color: 'text-indigo-900' },
                      { label: 'Kerbau', val: '0', unit: 'Ekor', desc: 'Tidak tercatat dalam populasi', color: 'text-slate-600' },
                    ].map((item, idx) => (
                      <div key={idx} className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-1">
                        <p className={`text-2xl sm:text-3xl font-black ${item.color}`}>{item.val} <span className="text-xs font-medium text-slate-500">{item.unit}</span></p>
                        <p className="text-xs font-bold text-slate-800">{item.label}</p>
                        <p className="text-[10px] text-slate-500">{item.desc}</p>
                      </div>
                    ))}
                  </div>

                  <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-4 text-xs text-slate-800 font-medium">
                    Populasi ternak kuda dan kambing merupakan aset strategis warga desa. Pemeriksaan berkala dan vaksinasi ternak dikoordinasikan secara teratur bersama Dinas Pertanian dan Peternakan Kabupaten Jeneponto.
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ════════════════════════════════════════════════════════════════════
            TAB 4: APARATUR PEMERINTAHAN DESA (INTERACTIVE + MODAL)
           ════════════════════════════════════════════════════════════════════ */}
        {activeTab === 'aparat' && (
          <div className="space-y-6">
            {/* Kepala Desa Banner */}
            <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-teal-950 text-white rounded-3xl p-6 sm:p-8 shadow-sm border border-emerald-800/60 flex flex-col md:flex-row items-center gap-6">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-emerald-800 border-2 border-emerald-500/50 flex items-center justify-center text-2xl font-black text-emerald-100 shadow-md shrink-0">
                JD
              </div>
              <div className="space-y-2 text-center md:text-left flex-1">
                <div className="inline-flex items-center gap-1.5 text-xs bg-emerald-800/80 text-emerald-200 font-bold uppercase px-3 py-1 rounded-full border border-emerald-600/40">
                  <Award className="w-3.5 h-3.5" />
                  Kepala Desa Jombe Periode Aktif
                </div>
                <h3 className="text-2xl sm:text-3xl font-black tracking-tight">JUSMAEDY, S.Pd</h3>
                <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed max-w-2xl font-medium">
                  Memimpin tata kelola pemerintahan, pelaksanaan pembangunan infrastruktur, pembinaan ketentraman masyarakat, dan percepatan pelayanan digital di Desa Jombe.
                </p>
              </div>
              <button
                onClick={() => setSelectedAparat(aparatDesa[0])}
                className="px-4 py-2.5 bg-white text-emerald-950 font-bold rounded-xl text-xs hover:bg-emerald-50 transition-all shrink-0 cursor-pointer shadow-sm flex items-center gap-1.5"
              >
                <Eye className="w-4 h-4" />
                <span>Lihat Profil & Tupoksi</span>
              </button>
            </div>

            {/* Filter & Search Toolbar */}
            <div className="bg-white p-4 sm:p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row gap-3 justify-between items-center">
                {/* Category Filters */}
                <div className="flex flex-wrap gap-1.5 w-full sm:w-auto">
                  {[
                    { id: 'semua', label: 'Semua Aparat' },
                    { id: 'pimpinan', label: 'Pimpinan' },
                    { id: 'sekretariat', label: 'Sekretariat & Kaur' },
                    { id: 'teknis', label: 'Kepala Seksi' },
                    { id: 'dusun', label: 'Kepala Dusun (5)' },
                  ].map((f) => (
                    <button
                      key={f.id}
                      onClick={() => setAparatFilter(f.id as any)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        aparatFilter === f.id
                          ? 'bg-emerald-900 text-white shadow-2xs'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>

                {/* Search Input */}
                <div className="relative w-full sm:w-64">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={aparatSearch}
                    onChange={(e) => setAparatSearch(e.target.value)}
                    placeholder="Cari nama atau jabatan..."
                    className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-700/30 focus:border-emerald-700"
                  />
                </div>
              </div>

              {/* Aparat Grid Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
                {filteredAparat.map((item, idx) => (
                  <div
                    key={idx}
                    className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-emerald-400 hover:shadow-md transition-all flex flex-col justify-between space-y-4 group"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-11 h-11 rounded-2xl bg-gradient-to-br ${item.avatarColor} flex items-center justify-center text-white font-black text-xs shadow-2xs shrink-0`}>
                          {item.nama.substring(0, 2).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <span className="text-[10px] font-bold uppercase text-emerald-800 tracking-wider block truncate">
                            {item.jabatan}
                          </span>
                          <h4 className="text-xs sm:text-sm font-black text-slate-900 leading-snug truncate">
                            {item.nama}
                          </h4>
                        </div>
                      </div>

                      <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed border-t border-slate-100 pt-3">
                        {item.tugas}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-[10px] bg-emerald-50 text-emerald-800 font-bold px-2 py-0.5 rounded-md border border-emerald-200">
                        Aparatur Aktif
                      </span>
                      <button
                        onClick={() => setSelectedAparat(item)}
                        className="text-xs font-bold text-emerald-800 hover:text-emerald-950 flex items-center gap-1 cursor-pointer"
                      >
                        Detail <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {filteredAparat.length === 0 && (
                <div className="py-12 text-center text-slate-400 space-y-2">
                  <Users className="w-8 h-8 mx-auto text-slate-300" />
                  <p className="text-xs font-semibold">Tidak ada data aparatur yang cocok dengan pencarian.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ════════════════════════════════════════════════════════════════════
            TAB 5: SARANA & FASILITAS DESA (FILTERABLE)
           ════════════════════════════════════════════════════════════════════ */}
        {activeTab === 'fasilitas' && (
          <div className="space-y-6">
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                <div>
                  <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
                    <Building className="w-5 h-5 text-emerald-800" />
                    Direktori Sarana & Prasarana Publik
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Fasilitas kesehatan, peribadatan, sarana olahraga, dan fasilitas umum di wilayah Desa Jombe.
                  </p>
                </div>

                <div className="flex gap-1.5 bg-slate-100 p-1 rounded-xl self-start sm:self-auto overflow-x-auto">
                  {[
                    { id: 'semua', label: 'Semua Fasilitas' },
                    { id: 'kesehatan', label: 'Kesehatan' },
                    { id: 'ibadah', label: 'Tempat Ibadah' },
                    { id: 'olahraga', label: 'Olahraga & Pemuda' },
                  ].map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setFacilityCategory(cat.id as any)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                        facilityCategory === cat.id
                          ? 'bg-white text-emerald-900 shadow-2xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Facility Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Fasilitas Kesehatan */}
                {(facilityCategory === 'semua' || facilityCategory === 'kesehatan') && (
                  <>
                    <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-900 flex items-center justify-center font-bold">
                          <Stethoscope className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="text-[10px] font-bold uppercase text-emerald-800 block">Kesehatan</span>
                          <h4 className="text-xs font-black text-slate-900">Puskesmas Pembantu (Pustu)</h4>
                        </div>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        1 Unit Pustu terpusat di Dusun Jombe Tengah, melayani pemeriksaan dasar, rujukan, dan penanganan awal.
                      </p>
                    </div>

                    <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-xl bg-teal-100 text-teal-900 flex items-center justify-center font-bold">
                          <Baby className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="text-[10px] font-bold uppercase text-teal-800 block">Kesehatan Balita & Lansia</span>
                          <h4 className="text-xs font-black text-slate-900">5 Posyandu Terpadu</h4>
                        </div>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        Tersedia 1 posyandu aktif di masing-masing 5 dusun (Melati, Mawar, Teratai, Kenanga, Posyandu Dusun Tengah).
                      </p>
                    </div>

                    <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-xl bg-sky-100 text-sky-900 flex items-center justify-center font-bold">
                          <Heart className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="text-[10px] font-bold uppercase text-sky-800 block">Tenaga Medis</span>
                          <h4 className="text-xs font-black text-slate-900">3 Bidan & 3 Paramedis</h4>
                        </div>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        Tenaga kesehatan desa standby untuk pendampingan persalinan ibu hamil dan kesehatan balita.
                      </p>
                    </div>
                  </>
                )}

                {/* Tempat Ibadah */}
                {(facilityCategory === 'semua' || facilityCategory === 'ibadah') && (
                  <>
                    <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-900 flex items-center justify-center font-bold">
                          <Landmark className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="text-[10px] font-bold uppercase text-emerald-800 block">Peribadatan</span>
                          <h4 className="text-xs font-black text-slate-900">5 Masjid Jami Dusun</h4>
                        </div>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        5 unit masjid permanen tersebar di tiap wilayah dusun untuk shalat berjamaah dan pengajian warga.
                      </p>
                    </div>

                    <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-xl bg-slate-200 text-slate-800 flex items-center justify-center font-bold">
                          <Building className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="text-[10px] font-bold uppercase text-slate-700 block">Peribadatan</span>
                          <h4 className="text-xs font-black text-slate-900">1 Unit Mushola</h4>
                        </div>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        Mushola lingkungan untuk kegiatan majelis taklim dan taman pendidikan Al-Qur&apos;an (TPA).
                      </p>
                    </div>
                  </>
                )}

                {/* Sarana Olahraga */}
                {(facilityCategory === 'semua' || facilityCategory === 'olahraga') && (
                  <>
                    <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-xl bg-indigo-100 text-indigo-900 flex items-center justify-center font-bold">
                          <Activity className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="text-[10px] font-bold uppercase text-indigo-800 block">Olahraga</span>
                          <h4 className="text-xs font-black text-slate-900">1 Lapangan Sepak Bola</h4>
                        </div>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        Lapangan utama untuk kegiatan turnamen pemuda desa, peringatan HUT RI, dan upacara adat.
                      </p>
                    </div>

                    <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-900 flex items-center justify-center font-bold">
                          <Activity className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="text-[10px] font-bold uppercase text-emerald-800 block">Olahraga</span>
                          <h4 className="text-xs font-black text-slate-900">4 Lapangan Sepak Takraw</h4>
                        </div>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        Sarana olahraga takraw di 4 dusun sebagai cabang olahraga favorit pemuda desa.
                      </p>
                    </div>

                    <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center font-bold">
                          <Activity className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="text-[10px] font-bold uppercase text-amber-800 block">Olahraga</span>
                          <h4 className="text-xs font-black text-slate-900">1 Lapangan Voli & 4 Badminton</h4>
                        </div>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        Fasilitas olahraga aktif untuk kebugaran masyarakat dan sarana interaksi sosial warga.
                      </p>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ════════════════════════════════════════════════════════════════════
            TAB 6: PETA & KONEKTIVITAS AKSES WILAYAH (INTERACTIVE)
           ════════════════════════════════════════════════════════════════════ */}
        {activeTab === 'peta' && (
          <div className="space-y-6">
            {/* Interactive Route Explorer */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
              <div className="border-b border-slate-100 pb-4">
                <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
                  <Navigation className="w-5 h-5 text-emerald-800" />
                  Konektivitas & Panduan Aksesibilitas Wilayah
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Pilih destinasi di bawah untuk melihat rincian jarak, estimasi waktu tempuh, kondisi jalan, dan rute akses.
                </p>
              </div>

              {/* Route Tabs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
                {routes.map((r, rIdx) => {
                  const isSelected = selectedRouteIndex === rIdx;
                  return (
                    <button
                      key={rIdx}
                      onClick={() => setSelectedRouteIndex(rIdx)}
                      className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                        isSelected
                          ? 'bg-emerald-900 text-white border-emerald-950 shadow-md ring-2 ring-emerald-600/30'
                          : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-800'
                      }`}
                    >
                      <div>
                        <span className={`text-[10px] font-bold uppercase block mb-1 ${isSelected ? 'text-emerald-300' : 'text-slate-400'}`}>
                          Destinasi {rIdx + 1}
                        </span>
                        <h4 className="text-xs font-black leading-snug line-clamp-2">{r.tujuan}</h4>
                      </div>
                      <div className="mt-3 pt-2 border-t border-slate-100/20 text-xs font-black">
                        <span className={isSelected ? 'text-emerald-200' : 'text-emerald-800'}>{r.jarak}</span>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Selected Route Detail Box */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 sm:p-6 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-3">
                  <div>
                    <span className="text-[10px] font-bold uppercase text-emerald-800">
                      Rincian Jalur Transportasi
                    </span>
                    <h3 className="text-base font-black text-slate-900 mt-0.5">
                      Desa Jombe ↔ {routes[selectedRouteIndex].tujuan}
                    </h3>
                  </div>
                  <div className="flex gap-2">
                    <span className="px-3 py-1 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-800 shadow-2xs">
                      Jarak: {routes[selectedRouteIndex].jarak}
                    </span>
                    <span className="px-3 py-1 bg-emerald-100 text-emerald-900 rounded-xl text-xs font-bold">
                      Waktu: {routes[selectedRouteIndex].waktuTempuh}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                  <div className="bg-white p-3.5 rounded-xl border border-slate-200 space-y-1">
                    <span className="text-slate-400 font-bold uppercase text-[10px]">Kondisi Jalan</span>
                    <p className="font-bold text-slate-800">{routes[selectedRouteIndex].kondisiJalan}</p>
                  </div>
                  <div className="bg-white p-3.5 rounded-xl border border-slate-200 space-y-1">
                    <span className="text-slate-400 font-bold uppercase text-[10px]">Moda Transportasi</span>
                    <p className="font-bold text-slate-800">{routes[selectedRouteIndex].moda}</p>
                  </div>
                  <div className="bg-white p-3.5 rounded-xl border border-slate-200 space-y-1">
                    <span className="text-slate-400 font-bold uppercase text-[10px]">Rute Akses</span>
                    <p className="font-bold text-slate-800 leading-snug">{routes[selectedRouteIndex].jalur}</p>
                  </div>
                </div>

                <p className="text-xs text-slate-600 font-medium bg-emerald-50/60 p-3 rounded-xl border border-emerald-100">
                  <Info className="w-3.5 h-3.5 text-emerald-800 inline mr-1 -mt-0.5" />
                  {routes[selectedRouteIndex].catatan}
                </p>
              </div>
            </div>

            {/* Embedded Google Map */}
            <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-sm space-y-3">
              <div className="flex items-center justify-between px-2 pt-1">
                <span className="text-xs font-black text-slate-900 flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-emerald-800" />
                  Peta Spasial Desa Jombe (Google Maps)
                </span>
                <a
                  href="https://maps.google.com/maps?q=Desa+Jombe+Turatea+Jeneponto"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-bold text-emerald-800 hover:text-emerald-950 flex items-center gap-1"
                >
                  Buka di Maps Penuh <ExternalLink className="w-3 h-3" />
                </a>
              </div>
              <div className="w-full h-[420px] rounded-2xl overflow-hidden border border-slate-200">
                <iframe
                  title="Peta Desa Jombe"
                  src="https://maps.google.com/maps?q=Desa%20Jombe%2C%20Kecamatan%20Turatea%2C%20Kabupaten%20Jeneponto%2C%20Sulawesi%20Selatan&t=&z=14&ie=UTF8&iwloc=&output=embed"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>
          </div>
        )}

        {/* ════════════════════════════════════════════════════════════════════
            CTA FOOTER BANNER
           ════════════════════════════════════════════════════════════════════ */}
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-emerald-950 via-emerald-900 to-teal-950 text-white shadow-sm flex flex-col md:flex-row justify-between items-center gap-6 border border-emerald-800/50">
          <div className="space-y-1 text-center md:text-left">
            <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-300 bg-emerald-800/80 px-2.5 py-0.5 rounded-full border border-emerald-600/40">
              Layanan Mandiri Warga
            </span>
            <h3 className="text-lg sm:text-xl font-black text-white mt-1">
              Butuh Surat Administrasi dari Pemerintah Desa?
            </h3>
            <p className="text-xs text-emerald-100/80 max-w-xl font-medium">
              Ajukan permohonan surat keterangan secara online tanpa antre dan lacak status berkas langsung dari smartphone Anda.
            </p>
          </div>
          <div className="flex flex-wrap gap-2.5 shrink-0">
            <Link
              href="/layanan"
              className="px-5 py-3 bg-emerald-700 hover:bg-emerald-600 text-white font-bold rounded-xl text-xs shadow-sm transition-all flex items-center gap-2"
            >
              <span>Ajukan Surat Sekarang</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/lacak"
              className="px-5 py-3 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl text-xs transition-all border border-white/20"
            >
              Lacak Status Surat
            </Link>
          </div>
        </div>
      </div>

      {/* ════════════════════════════════════════════════════════════════════
          MODAL DETAIL APARATUR DESA (OFFICIAL & PROFESSIONAL)
         ════════════════════════════════════════════════════════════════════ */}
      {selectedAparat && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white w-full max-w-lg rounded-3xl border border-slate-200 shadow-2xl overflow-hidden space-y-0">
            {/* Header Modal */}
            <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-teal-950 p-6 text-white relative">
              <button
                onClick={() => setSelectedAparat(null)}
                className="absolute right-4 top-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-3.5">
                <div className={`w-13 h-13 rounded-2xl bg-gradient-to-br ${selectedAparat.avatarColor} flex items-center justify-center text-white font-black text-base shadow-sm shrink-0 border border-white/20`}>
                  {selectedAparat.nama.substring(0, 2).toUpperCase()}
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase text-emerald-300 tracking-wider">
                    {selectedAparat.jabatan}
                  </span>
                  <h3 className="text-lg font-black text-white leading-tight">
                    {selectedAparat.nama}
                  </h3>
                  <span className="text-[11px] text-emerald-200/80 font-medium block mt-0.5">
                    Pemerintah Desa Jombe · Periode Aktif
                  </span>
                </div>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto text-xs">
              <div>
                <span className="text-slate-400 font-bold uppercase text-[10px] block mb-1">
                  Uraian Tugas Pokok & Fungsi
                </span>
                <p className="text-slate-700 leading-relaxed font-medium bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                  {selectedAparat.tugas}
                </p>
              </div>

              {selectedAparat.tupoksi && selectedAparat.tupoksi.length > 0 && (
                <div>
                  <span className="text-slate-400 font-bold uppercase text-[10px] block mb-2">
                    Rincian Wewenang & Tanggung Jawab
                  </span>
                  <div className="space-y-1.5">
                    {selectedAparat.tupoksi.map((tp, tpIdx) => (
                      <div key={tpIdx} className="flex items-start gap-2 text-slate-700 font-medium">
                        <Check className="w-3.5 h-3.5 text-emerald-700 shrink-0 mt-0.5" />
                        <span>{tp}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-100">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-0.5">
                  <span className="text-slate-400 font-bold uppercase text-[9px] block">Ruang Kerja</span>
                  <span className="font-bold text-slate-800 text-[11px] block">{selectedAparat.ruangKerja}</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-0.5">
                  <span className="text-slate-400 font-bold uppercase text-[9px] block">Layanan Terkait</span>
                  <span className="font-bold text-slate-800 text-[11px] block">{selectedAparat.layanan}</span>
                </div>
              </div>

              {selectedAparat.skPengangkatan && (
                <div className="text-[11px] text-slate-500 font-medium bg-emerald-50/70 p-2.5 rounded-xl border border-emerald-200 text-center">
                  Dasar Hukum: {selectedAparat.skPengangkatan}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-2">
              <button
                onClick={() => setSelectedAparat(null)}
                className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold rounded-xl text-xs transition-colors cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
