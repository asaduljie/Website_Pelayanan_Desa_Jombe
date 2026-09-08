'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  MapPin,
  Users,
  Layers,
  ArrowRight,
  TreePine,
  Building,
  Building2,
  Heart,
  Trophy,
  Wheat,
  Activity,
  Landmark,
  ShieldCheck,
  Stethoscope,
  Baby,
  Briefcase,
  Compass,
  CheckCircle2,
  Search,
  ChevronRight,
  Eye,
  BarChart3,
  Navigation,
  TrendingUp,
  X,
  ExternalLink,
  Award,
  Check,
  Zap,
  Droplets,
  Home,
  Flame,
  Radio,
  Truck,
  Music,
  ShieldAlert,
  GraduationCap
} from 'lucide-react';

interface AparatDetail {
  jabatan: string;
  nama: string;
  kategori: 'pimpinan' | 'sekretariat' | 'teknis' | 'dusun';
  avatarColor: string;
  tugas: string;
  tupoksi: string[];
}

export default function ProfilDesaPage() {
  const [activeTab, setActiveTab] = useState<'tentang' | 'statistik' | 'pertanian' | 'sosial' | 'infrastruktur' | 'aparat' | 'dusun' | 'peta'>('tentang');
  
  // Interactive Aparat Filter & Modal
  const [aparatFilter, setAparatFilter] = useState<'semua' | 'pimpinan' | 'sekretariat' | 'teknis' | 'dusun'>('semua');
  const [aparatSearch, setAparatSearch] = useState('');
  const [selectedAparat, setSelectedAparat] = useState<AparatDetail | null>(null);

  // Interactive Statistics Sub-tab
  const [statTab, setStatTab] = useState<'demografi' | 'pekerjaan' | 'kelahiran' | 'perumahan'>('demografi');

  // 5 Dusun Resmi Desa Jombe beserta Kepala Dusun
  const daftarDusun = [
    {
      nama: 'Dusun Jombe Utara',
      kepalaDusun: 'MUHAJRIN JUMARANG',
      avatarColor: 'from-emerald-800 to-teal-950',
      poskamling: '1 Unit',
    },
    {
      nama: 'Dusun Jombe Tengah',
      kepalaDusun: 'BASO',
      avatarColor: 'from-teal-800 to-slate-900',
      poskamling: '1 Unit (Pusat Pemerintahan)',
    },
    {
      nama: 'Dusun Jombe Selatan',
      kepalaDusun: 'SAPARUDDIN',
      avatarColor: 'from-emerald-900 to-slate-900',
      poskamling: '1 Unit',
    },
    {
      nama: 'Dusun Tompo Balang',
      kepalaDusun: 'NURLELA KAMARUDDIN',
      avatarColor: 'from-teal-900 to-emerald-950',
      poskamling: '1 Unit',
    },
    {
      nama: 'Dusun Muncu-muncu',
      kepalaDusun: 'ICAL RAHMAN',
      avatarColor: 'from-slate-800 to-teal-950',
      poskamling: '1 Unit',
    }
  ];

  // Data Aparatur Resmi Desa Jombe
  const aparatDesa: AparatDetail[] = [
    {
      jabatan: 'Kepala Desa',
      nama: 'JUSMAEDY, S.Pd',
      kategori: 'pimpinan',
      avatarColor: 'from-emerald-900 via-emerald-800 to-teal-950',
      tugas: 'Memimpin penyelenggaraan pemerintahan desa, pelaksanaan pembangunan, pembinaan kemasyarakatan, dan pemberdayaan masyarakat Desa Jombe.',
      tupoksi: [
        'Memegang kekuasaan pengelolaan Keuangan dan Aset Desa.',
        'Menetapkan Peraturan Desa bersama Badan Permusyawaratan Desa (BPD).',
        'Mewakili desa di dalam dan di luar pengadilan sesuai ketentuan perundang-undangan.'
      ]
    },
    {
      jabatan: 'Sekretaris Desa',
      nama: 'SYAMSUL RISWAN',
      kategori: 'sekretariat',
      avatarColor: 'from-emerald-800 to-slate-900',
      tugas: 'Mengkoordinasikan administrasi pemerintahan, ketatausahaan, keuangan, dan pelayanan umum desa.',
      tupoksi: [
        'Mengoordinasikan penyusunan rancangan peraturan desa dan APBDes.',
        'Memverifikasi kelengkapan berkas administrasi dan surat menyurat dinas.',
        'Mengelola tata naskah dinas dan kearsipan pemerintah desa.'
      ]
    },
    {
      jabatan: 'Kasi Pemerintahan',
      nama: 'ZAINAL MUTTAQIN AHMAD',
      kategori: 'teknis',
      avatarColor: 'from-teal-800 to-slate-900',
      tugas: 'Melaksanakan tugas di bidang administrasi kependudukan, pertanahan, ketertiban umum, dan perlindungan masyarakat.',
      tupoksi: [
        'Mengelola administrasi kependudukan dan registrasi warga.',
        'Fasilitasi administrasi pertanahan dan batas kepemilikan tanah.',
        'Pembinaan ketentraman dan ketertiban umum (Trantib & 10 Personil Hansip).'
      ]
    },
    {
      jabatan: 'Kasi Pelayanan Umum',
      nama: 'SARDI',
      kategori: 'teknis',
      avatarColor: 'from-emerald-700 to-cyan-900',
      tugas: 'Melaksanakan pelayanan administrasi surat keterangan kependudukan dan fasilitasi layanan permohonan warga.',
      tupoksi: [
        'Verifikasi dan pemrosesan permohonan surat keterangan warga.',
        'Fasilitasi sistem pelayanan digital mandiri masyarakat.',
        'Pencatatan buku registrasi penerbitan surat desa.'
      ]
    },
    {
      jabatan: 'Kasi Kesra',
      nama: 'SUKARDI',
      kategori: 'teknis',
      avatarColor: 'from-teal-700 to-emerald-900',
      tugas: 'Melaksanakan program kesejahteraan sosial, kesehatan masyarakat, keagamaan, dan pemberdayaan masyarakat.',
      tupoksi: [
        'Koordinasi kegiatan 5 Posyandu terpadu dan pemantauan kesehatan.',
        'Verifikasi pendataan program bantuan sosial dan kesejahteraan.',
        'Pembinaan 5 kelompok remaja masjid, 5 pondok pengajian, dan majelis ta\'lim.'
      ]
    },
    {
      jabatan: 'Kaur Perencanaan',
      nama: 'SYARIF AL-QADRI',
      kategori: 'sekretariat',
      avatarColor: 'from-slate-700 to-emerald-950',
      tugas: 'Menyusun rencana kerja pembangunan desa (RKPDes), inventarisasi aset desa, dan evaluasi pembangunan.',
      tupoksi: [
        'Menyusun dokumen perencanaan desa (RPJMDes dan RKPDes).',
        'Menginventarisasi aset dan sarana prasarana fisik desa.',
        'Monitoring dan evaluasi pelaksanaan kegiatan pembangunan desa.'
      ]
    },
    {
      jabatan: 'Kaur Keuangan',
      nama: 'ARIANTO',
      kategori: 'sekretariat',
      avatarColor: 'from-emerald-800 to-slate-800',
      tugas: 'Melaksanakan penatausahaan keuangan desa, penerimaan pendapatan asli desa, dan pelaporan APBDes.',
      tupoksi: [
        'Menyiapkan dokumen penatausahaan keuangan desa.',
        'Mencatat pembukuan penerimaan dan pengeluaran kas desa.',
        'Menyusun laporan pertanggungjawaban realisasi APBDes.'
      ]
    },
    {
      jabatan: 'Kaur Administrasi dan T.U',
      nama: 'KASMAWATI',
      kategori: 'sekretariat',
      avatarColor: 'from-teal-800 to-slate-800',
      tugas: 'Melaksanakan urusan tata usaha kantor, surat menyurat resmi, ekspedisi, dan kearsipan desa.',
      tupoksi: [
        'Pencatatan agenda surat masuk dan ekspedisi surat keluar.',
        'Pengelolaan perlengkapan kantor dan tata usaha dinas.',
        'Penyusunan notula rapat musyawarah desa.'
      ]
    },
    {
      jabatan: 'Kepala Dusun Jombe Utara',
      nama: 'MUHAJRIN JUMARANG',
      kategori: 'dusun',
      avatarColor: 'from-emerald-900 to-teal-800',
      tugas: 'Pelayanan kewilayahan, pembinaan ketertiban lingkungan, dan koordinasi warga di Dusun Jombe Utara.',
      tupoksi: [
        'Pelayanan pengantar surat dan administrasi warga tingkat dusun.',
        'Pembinaan ketertiban dan kerukunan warga Dusun Jombe Utara.',
        'Mengoordinasikan gotong royong dan poskamling dusun.'
      ]
    },
    {
      jabatan: 'Kepala Dusun Jombe Tengah',
      nama: 'BASO',
      kategori: 'dusun',
      avatarColor: 'from-slate-800 to-teal-900',
      tugas: 'Pelayanan kewilayahan, pembinaan ketertiban lingkungan, dan koordinasi warga di Dusun Jombe Tengah.',
      tupoksi: [
        'Pelayanan pengantar surat dan administrasi warga tingkat dusun.',
        'Pembinaan ketertiban kawasan sentra perkantoran dan perdagangan.',
        'Mengoordinasikan kegiatan kemasyarakatan.'
      ]
    },
    {
      jabatan: 'Kepala Dusun Jombe Selatan',
      nama: 'SAPARUDDIN',
      kategori: 'dusun',
      avatarColor: 'from-teal-800 to-emerald-900',
      tugas: 'Pelayanan kewilayahan, pembinaan ketertiban lingkungan, dan koordinasi warga di Dusun Jombe Selatan.',
      tupoksi: [
        'Pelayanan pengantar surat dan administrasi warga tingkat dusun.',
        'Pembinaan ketertiban dan ketentraman lingkungan dusun.',
        'Mengoordinasikan kelompok tani dan gotong royong warga.'
      ]
    },
    {
      jabatan: 'Kepala Dusun Tompo Balang',
      nama: 'NURLELA KAMARUDDIN',
      kategori: 'dusun',
      avatarColor: 'from-emerald-800 to-cyan-900',
      tugas: 'Pelayanan kewilayahan, pembinaan ketertiban lingkungan, dan koordinasi warga di Dusun Tompo Balang.',
      tupoksi: [
        'Pelayanan pengantar surat dan administrasi warga tingkat dusun.',
        'Pembinaan kemasyarakatan dan posyandu wilayah.',
        'Mengoordinasikan pemeliharaan saluran irigasi pertanian dusun.'
      ]
    },
    {
      jabatan: 'Kepala Dusun Muncu-muncu',
      nama: 'ICAL RAHMAN',
      kategori: 'dusun',
      avatarColor: 'from-indigo-900 to-slate-900',
      tugas: 'Pelayanan kewilayahan, pembinaan ketertiban lingkungan, dan koordinasi warga di Dusun Muncu-muncu.',
      tupoksi: [
        'Pelayanan pengantar surat dan administrasi warga tingkat dusun.',
        'Pembinaan ketertiban lingkungan perbatasan dusun.',
        'Mengoordinasikan kelompok peternak dan swadaya masyarakat.'
      ]
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

  const tabs = [
    { id: 'tentang', label: 'Tentang Desa', icon: <Landmark className="w-4 h-4" /> },
    { id: 'statistik', label: 'Statistik Penduduk', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'pertanian', label: 'Lahan & Pertanian', icon: <Wheat className="w-4 h-4" /> },
    { id: 'sosial', label: 'Sosial & Kesehatan', icon: <Heart className="w-4 h-4" /> },
    { id: 'infrastruktur', label: 'Infrastruktur & Hunian', icon: <Home className="w-4 h-4" /> },
    { id: 'aparat', label: 'Perangkat Desa', icon: <Users className="w-4 h-4" /> },
    { id: 'dusun', label: 'Wilayah Dusun', icon: <Layers className="w-4 h-4" /> },
    { id: 'peta', label: 'Geografis & Peta', icon: <Compass className="w-4 h-4" /> },
  ] as const;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-emerald-800 selection:text-white pb-16">
      {/* ═════════════════════ HERO BANNER RESMI ═════════════════════ */}
      <div className="relative overflow-hidden bg-gradient-to-br from-emerald-950 via-emerald-900 to-teal-950 text-white border-b border-emerald-800/40">
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
              Pemerintah Desa Jombe · Kecamatan Turatea · Kabupaten Jeneponto
            </div>

            <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
              Profil Resmi <span className="text-emerald-400">Desa Jombe</span>
            </h1>

            <p className="text-sm sm:text-base text-emerald-100/90 leading-relaxed max-w-2xl font-medium">
              Data resmi bersumber langsung dari publikasi resmi <strong>Badan Pusat Statistik (BPS) &quot;Kecamatan Turatea Dalam Angka 2025&quot;</strong> dan dokumen administrasi Pemerintah Desa Jombe, Sulawesi Selatan.
            </p>

            {/* Official Metadata Badges (BPS 2025) */}
            <div className="flex flex-wrap gap-2 pt-2 text-xs font-semibold text-emerald-100">
              <span className="flex items-center gap-1.5 bg-emerald-950/80 px-3 py-1.5 rounded-xl border border-emerald-700/50">
                <MapPin className="w-3.5 h-3.5 text-emerald-400" /> Luas Wilayah: <strong>3,76 km² (7,00% Kec. Turatea)</strong>
              </span>
              <span className="flex items-center gap-1.5 bg-emerald-950/80 px-3 py-1.5 rounded-xl border border-emerald-700/50">
                <Users className="w-3.5 h-3.5 text-emerald-400" /> Penduduk: <strong>2.670 Jiwa (BPS 2025)</strong>
              </span>
              <span className="flex items-center gap-1.5 bg-emerald-950/80 px-3 py-1.5 rounded-xl border border-emerald-700/50">
                <Trophy className="w-3.5 h-3.5 text-amber-400" /> Status: <strong>Swasembada · Cepat Berkembang</strong>
              </span>
              <span className="flex items-center gap-1.5 bg-emerald-950/80 px-3 py-1.5 rounded-xl border border-emerald-700/50">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Kepala Desa: <strong>JUSMAEDY, S.Pd</strong>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ═════════════════════ QUICK STATS CARDS (BPS 2025) ═════════════════════ */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
          {[
            { val: '2.670', unit: 'Jiwa', label: 'Total Penduduk', sub: '1.336 L / 1.334 P (BPS 2025)', icon: <Users className="w-4 h-4 text-emerald-700" />, tabTarget: 'statistik' },
            { val: '3,76', unit: 'km²', label: 'Luas Wilayah', sub: '7,00% Luas Kec. Turatea', icon: <Compass className="w-4 h-4 text-teal-700" />, tabTarget: 'tentang' },
            { val: '710,11', unit: 'jiwa/km²', label: 'Kepadatan Penduduk', sub: 'Rasio Gender: 100,15', icon: <TrendingUp className="w-4 h-4 text-slate-700" />, tabTarget: 'statistik' },
            { val: '10', unit: 'RW', label: 'Rukun Warga (RW)', sub: 'Tersebar di 5 Dusun Resmi', icon: <Layers className="w-4 h-4 text-indigo-700" />, tabTarget: 'dusun' },
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
                  Detail <ChevronRight className="w-3 h-3" />
                </span>
              </div>
              <div>
                <span className="text-2xl sm:text-3xl font-black text-slate-900 block tracking-tight">
                  {item.val} <span className="text-xs font-bold text-slate-500">{item.unit}</span>
                </span>
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
            TAB 1: TENTANG DESA & STATUS PEMERINTAHAN (BPS)
           ════════════════════════════════════════════════════════════════════ */}
        {activeTab === 'tentang' && (
          <div className="space-y-6">
            {/* Tabel Informasi Dasar & Geografis BPS */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-5">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
                    <Landmark className="w-5 h-5 text-emerald-800" />
                    Informasi Dasar & Geografis (Tabel 1.1.1 – 1.1.4 BPS)
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Data resmi wilayah Desa Jombe dari publikasi BPS Kabupaten Jeneponto.
                  </p>
                </div>
                <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                  BPS 2025
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                {[
                  { label: 'Luas Wilayah Desa', val: '3,76 km²', note: 'Tabel 1.1.1 BPS' },
                  { label: 'Persentase Luas Kecamatan', val: '7,00%', note: 'Dari total luas Kecamatan Turatea (53,76 km²)' },
                  { label: 'Jarak ke Ibu Kota Kecamatan', val: '17,00 km', note: 'Desa paling jauh dari ibukota Kec. Turatea (Tabel 1.1.2)' },
                  { label: 'Jarak ke Ibu Kota Kabupaten', val: '8,70 km', note: 'Jarak menuju ibukota Kabupaten Jeneponto' },
                  { label: 'Status Wilayah', val: 'Bukan Daerah Pantai', note: 'Topografi dataran/perbukitan (Tabel 1.1.4)' },
                  { label: 'Ketinggian Wilayah', val: 'Kategori 1000+ m dpl', note: 'Tabel 1.1.4 BPS' },
                  { label: 'Status Perkembangan Desa', val: 'Swasembada', note: 'Tabel 2.1.2 BPS' },
                  { label: 'Tingkat Perkembangan', val: 'Cepat Berkembang', note: 'Tabel 2.2.10 BPS' },
                  { label: 'Jumlah Rukun Warga (RW)', val: '10 RW', note: 'Tabel 2.1.1 BPS' },
                ].map((item, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                    <span className="text-[11px] font-semibold text-slate-500 block">{item.label}</span>
                    <span className="text-lg sm:text-xl font-black text-slate-900 block">{item.val}</span>
                    <span className="text-[10px] text-emerald-800 font-medium block">{item.note}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Kelembagaan Desa & Keamanan (Tabel 2.2.4 - 2.2.9 BPS) */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-5">
              <div className="border-b border-slate-100 pb-3">
                <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-emerald-800" />
                  Kelembagaan & Prasarana Desa (Tabel 2.2.4 – 2.2.9 BPS)
                </h2>
                <p className="text-xs text-slate-500">Organisasi dan fasilitas kemasyarakatan yang tercatat resmi dalam BPS.</p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 text-xs">
                {[
                  { label: 'Badan Permusyawaratan Desa (BPD)', val: '1 Unit', sub: 'Tabel 2.2.4' },
                  { label: 'P3A (Perkumpulan Petani Air)', val: '1 Unit', sub: 'Tabel 2.2.4' },
                  { label: 'Karang Taruna Desa', val: '1 Unit', sub: 'Tabel 2.2.4' },
                  { label: 'Tim Penggerak PKK', val: '1 Unit', sub: 'Tabel 2.2.5' },
                  { label: 'Kelompok Wanita Tani (KWT)', val: '1 Unit', sub: 'Tabel 2.2.5' },
                  { label: 'Kantor & Balai Pertemuan Desa', val: '1 Kantor / 1 Balai', sub: 'Tabel 2.2.8' },
                  { label: 'Pos Kamling Lingkungan', val: '5 Unit', sub: 'Tabel 2.2.9' },
                  { label: 'Personil Hansip / Wanra', val: '10 Personil', sub: 'Tabel 2.2.9' },
                ].map((k, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">{k.sub}</span>
                    <span className="text-base font-black text-slate-900 block">{k.val}</span>
                    <span className="text-[11px] text-slate-600 font-medium block">{k.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Batas Wilayah Administrasi (Tabel 1.1.3 BPS) */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-5">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                <Compass className="w-5 h-5 text-emerald-800" />
                <div>
                  <h2 className="text-base font-black text-slate-900">Batas Wilayah Administrasi (Tabel 1.1.3 BPS)</h2>
                  <p className="text-xs text-slate-500">Batas wilayah hukum dan administrasi Desa Jombe dengan wilayah sekitar.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                {[
                  { arah: 'Sebelah Utara', batas: 'Desa Turatea Timur' },
                  { arah: 'Sebelah Selatan', batas: 'Kecamatan Binamu' },
                  { arah: 'Sebelah Timur', batas: 'Desa Mangepong' },
                  { arah: 'Sebelah Barat', batas: 'Desa Kayuloe Barat' },
                ].map((b, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">{b.arah}</span>
                    <span className="text-sm font-black text-slate-900 block">{b.batas}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ════════════════════════════════════════════════════════════════════
            TAB 2: STATISTIK & KEPENDUDUKAN (BPS 2025)
           ════════════════════════════════════════════════════════════════════ */}
        {activeTab === 'statistik' && (
          <div className="space-y-6">
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                <div>
                  <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-emerald-800" />
                    Statistik Kependudukan (Tabel 3.1 & 3.4 BPS)
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Data kependudukan bersumber dari Dinas Kependudukan dan Pencatatan Sipil / BPS 2025.
                  </p>
                </div>

                {/* Sub Tab Switcher */}
                <div className="flex gap-1.5 bg-slate-100 p-1 rounded-xl self-start sm:self-auto overflow-x-auto">
                  {[
                    { id: 'demografi', label: 'Demografi & Gender' },
                    { id: 'pekerjaan', label: 'Mata Pencaharian' },
                    { id: 'kelahiran', label: 'Data Kelahiran' },
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

              {/* STAT SUB-TAB 1: DEMOGRAFI BPS */}
              {statTab === 'demografi' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 text-center">
                    {[
                      { label: 'Total Penduduk', val: '2.670', sub: 'Jiwa (Tabel 3.1 BPS)', color: 'bg-emerald-50 border-emerald-200 text-emerald-900' },
                      { label: 'Laki-Laki', val: '1.336', sub: 'Jiwa (50,04%)', color: 'bg-sky-50 border-sky-200 text-sky-900' },
                      { label: 'Perempuan', val: '1.334', sub: 'Jiwa (49,96%)', color: 'bg-teal-50 border-teal-200 text-teal-900' },
                      { label: 'Kepadatan Penduduk', val: '710,11', sub: 'Jiwa / km²', color: 'bg-slate-50 border-slate-200 text-slate-900' },
                    ].map((s, idx) => (
                      <div key={idx} className={`p-4 rounded-2xl border ${s.color} space-y-1`}>
                        <span className="text-2xl font-black block tracking-tight">{s.val}</span>
                        <span className="text-xs font-bold block">{s.label}</span>
                        <span className="text-[10px] opacity-75 block">{s.sub}</span>
                      </div>
                    ))}
                  </div>

                  {/* Gender Split Visualizer */}
                  <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                        Komposisi Jenis Kelamin Penduduk (Tabel 3.1 BPS)
                      </h4>
                      <span className="text-xs font-bold text-slate-500">Rasio Jenis Kelamin: 100,15 (Persentase Kecamatan: 7,33%)</span>
                    </div>

                    <div className="h-5 w-full bg-slate-200 rounded-full overflow-hidden flex shadow-inner">
                      <div className="h-full bg-sky-700 flex items-center justify-center text-[10px] font-black text-white" style={{ width: '50.04%' }}>
                        Laki-laki 1.336 (50,04%)
                      </div>
                      <div className="h-full bg-teal-600 flex items-center justify-center text-[10px] font-black text-white" style={{ width: '49.96%' }}>
                        Perempuan 1.334 (49,96%)
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
                      <div className="bg-white p-3.5 rounded-xl border border-slate-200 flex items-center justify-between">
                        <span className="font-semibold text-slate-700 flex items-center gap-2">
                          <span className="w-3 h-3 rounded-full bg-sky-700" />
                          Laki-Laki (BPS 2025)
                        </span>
                        <span className="font-black text-slate-900">1.336 Jiwa</span>
                      </div>
                      <div className="bg-white p-3.5 rounded-xl border border-slate-200 flex items-center justify-between">
                        <span className="font-semibold text-slate-700 flex items-center gap-2">
                          <span className="w-3 h-3 rounded-full bg-teal-600" />
                          Perempuan (BPS 2025)
                        </span>
                        <span className="font-black text-slate-900">1.334 Jiwa</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* STAT SUB-TAB 2: MATA PENCAHARIAN BPS (TABEL 3.4) */}
              {statTab === 'pekerjaan' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
                    {[
                      { icon: <Wheat className="w-5 h-5 text-emerald-800" />, label: 'Petani Tanaman Pangan', val: '485 orang', sub: 'Sektor Utama (Tabel 3.4)' },
                      { icon: <TreePine className="w-5 h-5 text-teal-800" />, label: 'Peternak', val: '220 orang', sub: 'Ternak Kambing/Kuda/Sapi' },
                      { icon: <Truck className="w-5 h-5 text-indigo-800" />, label: 'Sektor Angkutan / Transport', val: '123 orang', sub: 'Tabel 3.4 Lanjutan' },
                      { icon: <Briefcase className="w-5 h-5 text-slate-800" />, label: 'PNS / ABRI', val: '75 orang', sub: 'Pegawai Pemerintah/TNI' },
                      { icon: <Building className="w-5 h-5 text-amber-800" />, label: 'Pedagang', val: '62 orang', sub: 'Perniagaan & Toko' },
                      { icon: <Activity className="w-5 h-5 text-cyan-800" />, label: 'Sektor Industri', val: '39 orang', sub: 'Industri Pengolahan/Kerajinan' },
                      { icon: <Users className="w-5 h-5 text-rose-800" />, label: 'Sektor Jasa', val: '19 orang', sub: 'Pelayanan & Jasa Lain' },
                      { icon: <Trophy className="w-5 h-5 text-emerald-700" />, label: 'Nelayan & Tambak', val: '0 orang', sub: 'Bukan Daerah Pantai' },
                    ].map((item, idx) => (
                      <div key={idx} className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-2">
                        <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center border border-slate-200 shadow-2xs">
                          {item.icon}
                        </div>
                        <div>
                          <p className="text-xl font-black text-slate-900">{item.val}</p>
                          <p className="text-xs text-slate-800 font-bold mt-0.5">{item.label}</p>
                          <p className="text-[10px] text-slate-500">{item.sub}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* STAT SUB-TAB 3: DATA KELAHIRAN (TABEL 3.3) */}
              {statTab === 'kelahiran' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                    <div className="p-5 rounded-2xl bg-sky-50 border border-sky-200 space-y-1">
                      <span className="text-2xl font-black text-sky-900 block">21 Bayi</span>
                      <span className="text-xs font-bold text-slate-800 block">Kelahiran Laki-Laki</span>
                      <span className="text-[10px] text-slate-500 block">Tahun 2024 (Puskesmas)</span>
                    </div>
                    <div className="p-5 rounded-2xl bg-teal-50 border border-teal-200 space-y-1">
                      <span className="text-2xl font-black text-teal-900 block">22 Bayi</span>
                      <span className="text-xs font-bold text-slate-800 block">Kelahiran Perempuan</span>
                      <span className="text-[10px] text-slate-500 block">Tahun 2024 (Puskesmas)</span>
                    </div>
                    <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-1">
                      <span className="text-2xl font-black text-emerald-900 block">43 Bayi</span>
                      <span className="text-xs font-bold text-slate-800 block">Total Kelahiran (2024)</span>
                      <span className="text-[10px] text-slate-500 block">Tabel 3.3 BPS</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ════════════════════════════════════════════════════════════════════
            TAB 3: PERTANIAN, LAHAN & TERNAK (BPS)
           ════════════════════════════════════════════════════════════════════ */}
        {activeTab === 'pertanian' && (
          <div className="space-y-6">
            {/* Tata Guna Lahan (Tabel 5.8 & 5.9 BPS) */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-5">
              <div className="border-b border-slate-100 pb-3">
                <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
                  <Wheat className="w-5 h-5 text-emerald-800" />
                  Luas Lahan & Penggunaannya (Tabel 5.8 & 5.9 BPS)
                </h2>
                <p className="text-xs text-slate-500">Distribusi tata guna lahan produktif di Desa Jombe dari Dinas Pertanian Kabupaten Jeneponto.</p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
                {[
                  { label: 'Lahan Sawah Total', val: '192,00 ha', sub: '110 ha Teknis + 82 ha Tadah Hujan', color: 'bg-emerald-50 border-emerald-200 text-emerald-900' },
                  { label: 'Tegalan / Lahan Kering', val: '212,00 ha', sub: 'Lahan Kering Produktif', color: 'bg-teal-50 border-teal-200 text-teal-900' },
                  { label: 'Pekarangan & Bangunan', val: '21,00 ha', sub: 'Kawasan Permukiman Warga', color: 'bg-slate-50 border-slate-200 text-slate-900' },
                  { label: 'Penggunaan Lainnya', val: '3,65 ha', sub: 'Saluran, Jalan, & Lain-lain', color: 'bg-amber-50 border-amber-200 text-amber-900' },
                ].map((item, idx) => (
                  <div key={idx} className={`rounded-2xl border p-4 text-center space-y-1 ${item.color}`}>
                    <span className="text-xl sm:text-2xl font-black block">{item.val}</span>
                    <span className="text-xs font-bold block">{item.label}</span>
                    <span className="text-[10px] opacity-75 block">{item.sub}</span>
                  </div>
                ))}
              </div>

              {/* Rincian Sawah Teknis & Tadah Hujan */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs space-y-2">
                <span className="font-bold text-slate-900 block">Rincian Pengairan Sawah (Tabel 5.9 BPS):</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-700">
                  <div className="bg-white p-3 rounded-xl border border-slate-200 flex justify-between">
                    <span>Sawah Pengairan Teknis:</span>
                    <strong className="text-emerald-900">110,00 Ha</strong>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-slate-200 flex justify-between">
                    <span>Sawah Tadah Hujan / Pasang Surut:</span>
                    <strong className="text-emerald-900">82,00 Ha</strong>
                  </div>
                </div>
              </div>
            </div>

            {/* Populasi Hewan Ternak (Tabel 5.12 BPS) */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-5">
              <div className="border-b border-slate-100 pb-3">
                <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
                  <TreePine className="w-5 h-5 text-emerald-800" />
                  Populasi Hewan Ternak Besar (Tabel 5.12 BPS)
                </h2>
                <p className="text-xs text-slate-500">Populasi ternak masyarakat Desa Jombe dari Dinas Pertanian Bidang Peternakan.</p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 text-center">
                {[
                  { label: 'Kambing', val: '288', unit: 'Ekor', color: 'text-emerald-900', note: 'Ternak Terbanyak' },
                  { label: 'Kuda', val: '96', unit: 'Ekor', color: 'text-teal-900', note: 'Ternak Khas Jeneponto' },
                  { label: 'Sapi', val: '43', unit: 'Ekor', color: 'text-indigo-900', note: 'Ternak Sapi Potong' },
                  { label: 'Kerbau & Domba', val: '0', unit: 'Ekor', color: 'text-slate-600', note: 'Nol Ekor Tercatat' },
                ].map((item, idx) => (
                  <div key={idx} className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-1">
                    <p className={`text-2xl sm:text-3xl font-black ${item.color}`}>{item.val} <span className="text-xs font-medium text-slate-500">{item.unit}</span></p>
                    <p className="text-xs font-bold text-slate-800">{item.label}</p>
                    <p className="text-[10px] text-slate-500">{item.note}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ════════════════════════════════════════════════════════════════════
            TAB 4: SOSIAL, KESEHATAN, AGAMA & OLAHRAGA (BPS)
           ════════════════════════════════════════════════════════════════════ */}
        {activeTab === 'sosial' && (
          <div className="space-y-6">
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
              <div className="border-b border-slate-100 pb-4">
                <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
                  <Heart className="w-5 h-5 text-emerald-800" />
                  Kesehatan, Agama & Keolahragaan (Bab 4 BPS)
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Fasilitas pelayanan kesehatan, keagamaan, dan fasilitas olahraga yang terdata resmi di Desa Jombe.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Fasilitas Kesehatan (Tabel 4.2.3 & 4.2.4) */}
                <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 space-y-4">
                  <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs uppercase tracking-wider border-b border-slate-200 pb-2">
                    <Stethoscope className="w-4 h-4" />
                    Kesehatan & Tenaga Medis (BPS)
                  </div>
                  <div className="space-y-2 text-xs">
                    {[
                      ['Pustu (Puskesmas Pembantu)', '1 Unit (Tabel 4.2.3)'],
                      ['Posyandu Balita & Lansia', '5 Unit (Tabel 4.2.3)'],
                      ['Bidan Desa', '3 Orang (Tabel 4.2.4)'],
                      ['Dukun Bayi Terbina', '2 Orang (Tabel 4.2.4)'],
                      ['Peserta KB Aktif', '191 Akseptor (Tabel 4.2.5)'],
                      ['Pasangan Usia Subur (PUS)', '433 Pasangan (Tabel 4.2.5)'],
                    ].map(([label, val], idx) => (
                      <div key={idx} className="flex justify-between items-center py-1.5 border-b border-slate-200/60 last:border-0">
                        <span className="text-slate-600">{label}</span>
                        <span className="font-bold text-slate-900">{val}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Tempat Ibadah & Keagamaan (Tabel 4.4.1 & 2.2.7) */}
                <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 space-y-4">
                  <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs uppercase tracking-wider border-b border-slate-200 pb-2">
                    <Landmark className="w-4 h-4" />
                    Tempat Ibadah & Agama (BPS)
                  </div>
                  <div className="space-y-2 text-xs">
                    {[
                      ['Masjid Jami', '5 Unit (Tabel 4.4.1)'],
                      ['Mushola', '1 Unit (Tabel 4.4.1)'],
                      ['Gereja / Pura / Vihara', '0 Unit (Tabel 4.4.1)'],
                      ['Kelompok Remaja Masjid', '5 Kelompok (Tabel 2.2.7)'],
                      ['Pondok Pengajian', '5 Pondok (Tabel 2.2.7)'],
                      ['Majelis Ta\'lim', '1 Kelompok (Tabel 2.2.7)'],
                      ['Pencatatan Nikah (2024)', '13 Peristiwa (Tabel 4.4.8)'],
                    ].map(([label, val], idx) => (
                      <div key={idx} className="flex justify-between items-center py-1.5 border-b border-slate-200/60 last:border-0">
                        <span className="text-slate-600">{label}</span>
                        <span className="font-bold text-slate-900">{val}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Fasilitas Olahraga & Kesenian (Tabel 4.4.6 & 4.4.9) */}
                <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 space-y-4">
                  <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs uppercase tracking-wider border-b border-slate-200 pb-2">
                    <Activity className="w-4 h-4" />
                    Olahraga & Seni (BPS)
                  </div>
                  <div className="space-y-2 text-xs">
                    {[
                      ['Lapangan Sepak Bola', '1 Lokasi (Tabel 4.4.6)'],
                      ['Lapangan Bola Voli', '1 Lokasi (Tabel 4.4.6)'],
                      ['Lapangan Bulu Tangkis', '1 Lokasi (Tabel 4.4.6)'],
                      ['Tenis Meja', '3 Meja (Tabel 4.4.6)'],
                      ['Lapangan Sepak Takraw', '4 Lokasi (Tabel 4.4.6)'],
                      ['Grup Seni Qasidah', '2 Grup (Tabel 4.4.9)'],
                      ['Grup Musik Elekton', '3 Grup (Tabel 4.4.9)'],
                    ].map(([label, val], idx) => (
                      <div key={idx} className="flex justify-between items-center py-1.5 border-b border-slate-200/60 last:border-0">
                        <span className="text-slate-600">{label}</span>
                        <span className="font-bold text-slate-900">{val}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Status Keamanan & Bencana Alam (Tabel 4.4.2 & 4.4.7 BPS) */}
              <div className="bg-emerald-50/70 p-4 rounded-2xl border border-emerald-200 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs">
                <div className="space-y-0.5">
                  <strong className="text-slate-900 block font-black">Status Keamanan & Kebencanaan Desa Jombe (BPS):</strong>
                  <span className="text-slate-700">0 Bencana Alam (Bebas Banjir, Gempa, Longsor) · 1 Kasus Pencurian tercatat Polsek (Tabel 4.4.7)</span>
                </div>
                <span className="px-3 py-1 rounded-full bg-emerald-800 text-white font-bold text-[11px] shrink-0">
                  Wilayah Aman & Kondusif
                </span>
              </div>
            </div>
          </div>
        )}

        {/* ════════════════════════════════════════════════════════════════════
            TAB 5: INFRASTRUKTUR, PERUMAHAN & KOMUNIKASI (BPS)
           ════════════════════════════════════════════════════════════════════ */}
        {activeTab === 'infrastruktur' && (
          <div className="space-y-6">
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
              <div className="border-b border-slate-100 pb-4">
                <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
                  <Home className="w-5 h-5 text-emerald-800" />
                  Perumahan, Sanitasi, Energi & Komunikasi (Bab 4 & 6 BPS)
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Profil perumahan, kelistrikan, sanitasi, dan akses telekomunikasi warga Desa Jombe.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
                {/* Listrik PLN */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center font-bold">
                    <Zap className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Tabel 4.3.2</span>
                    <p className="text-lg font-black text-slate-900">850 Keluarga</p>
                    <p className="text-slate-700 font-bold mt-0.5">100% Pengguna Listrik PLN</p>
                    <span className="text-[10px] text-slate-500 block">Penerangan Jalan: Listrik Pemda</span>
                  </div>
                </div>

                {/* Air Minum & Sanitasi */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <div className="w-8 h-8 rounded-xl bg-sky-100 text-sky-900 flex items-center justify-center font-bold">
                    <Droplets className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Tabel 4.3.1 & 4.3.4</span>
                    <p className="text-lg font-black text-slate-900">Sumur Bor / Pompa</p>
                    <p className="text-slate-700 font-bold mt-0.5">Jamban Sendiri (100%)</p>
                    <span className="text-[10px] text-slate-500 block">Sanitasi Mandiri Keluarga</span>
                  </div>
                </div>

                {/* Bahan Bakar Memasak */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <div className="w-8 h-8 rounded-xl bg-rose-100 text-rose-900 flex items-center justify-center font-bold">
                    <Flame className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Tabel 4.3.5</span>
                    <p className="text-lg font-black text-slate-900">Gas Elpiji 3 kg</p>
                    <p className="text-slate-700 font-bold mt-0.5">Bahan Bakar Utama</p>
                    <span className="text-[10px] text-slate-500 block">Digunakan Mayoritas Warga</span>
                  </div>
                </div>

                {/* Telekomunikasi & Internet */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-900 flex items-center justify-center font-bold">
                    <Radio className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Tabel 6.3.2 & 6.3.3</span>
                    <p className="text-lg font-black text-slate-900">4 Operator Seluler</p>
                    <p className="text-slate-700 font-bold mt-0.5">Sinyal Kuat 4G / LTE</p>
                    <span className="text-[10px] text-slate-500 block">Akses Internet Lancar</span>
                  </div>
                </div>
              </div>

              {/* Data Fisik Rumah Tinggal (Tabel 4.4.10 & 4.4.11) */}
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3">
                <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                  Klasifikasi Bangunan Tempat Tinggal Warga (Tabel 4.4.10 & 4.4.11 BPS)
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div className="bg-white p-3.5 rounded-xl border border-slate-200 text-center">
                    <span className="text-slate-500 block">Total Rumah</span>
                    <strong className="text-lg font-black text-slate-900">519 Unit</strong>
                    <span className="text-[10px] text-slate-400 block">514 Lt.1 / 5 Lt.2</span>
                  </div>
                  <div className="bg-white p-3.5 rounded-xl border border-slate-200 text-center">
                    <span className="text-slate-500 block">Bangunan Permanen</span>
                    <strong className="text-lg font-black text-emerald-900">313 Unit</strong>
                    <span className="text-[10px] text-emerald-700 block">60,3% Rumah</span>
                  </div>
                  <div className="bg-white p-3.5 rounded-xl border border-slate-200 text-center">
                    <span className="text-slate-500 block">Semi Permanen</span>
                    <strong className="text-lg font-black text-teal-900">196 Unit</strong>
                    <span className="text-[10px] text-teal-700 block">37,8% Rumah</span>
                  </div>
                  <div className="bg-white p-3.5 rounded-xl border border-slate-200 text-center">
                    <span className="text-slate-500 block">Rumah Darurat</span>
                    <strong className="text-lg font-black text-slate-700">10 Unit</strong>
                    <span className="text-[10px] text-slate-500 block">1,9% Rumah</span>
                  </div>
                </div>
              </div>

              {/* Akses Jalan & Transportasi (Tabel 6.2.1 BPS) */}
              <div className="bg-emerald-50/70 p-4 rounded-2xl border border-emerald-200 text-xs text-slate-800 space-y-1">
                <span className="font-bold text-slate-900 block">Prasarana Jalan & Transportasi (Tabel 6.2.1 BPS):</span>
                <p className="leading-relaxed">
                  Jenis permukaan jalan darat terluas di Desa Jombe adalah <strong>Aspal / Beton</strong>, dan <strong>dapat dilalui kendaraan bermotor roda 4 atau lebih sepanjang tahun</strong>. Fasilitas angkutan umum darat tersedia dengan trayek tetap.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ════════════════════════════════════════════════════════════════════
            TAB 6: APARATUR PEMERINTAHAN DESA (SK RIL DARI DESA)
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
                  Kepala Desa Jombe
                </div>
                <h3 className="text-2xl sm:text-3xl font-black tracking-tight">JUSMAEDY, S.Pd</h3>
                <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed max-w-2xl font-medium">
                  Memimpin penyelenggaraan pemerintahan desa, pelaksanaan pembangunan, pembinaan kemasyarakatan, dan pemberdayaan masyarakat Desa Jombe.
                </p>
              </div>
              <button
                onClick={() => setSelectedAparat(aparatDesa[0])}
                className="px-4 py-2.5 bg-white text-emerald-950 font-bold rounded-xl text-xs hover:bg-emerald-50 transition-all shrink-0 cursor-pointer shadow-sm flex items-center gap-1.5"
              >
                <Eye className="w-4 h-4" />
                <span>Lihat Tupoksi</span>
              </button>
            </div>

            {/* Filter & Search Toolbar */}
            <div className="bg-white p-4 sm:p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row gap-3 justify-between items-center">
                {/* Category Filters */}
                <div className="flex flex-wrap gap-1.5 w-full sm:w-auto">
                  {[
                    { id: 'semua', label: 'Semua Aparat (13)' },
                    { id: 'pimpinan', label: 'Kepala Desa' },
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
                        Tupoksi <ChevronRight className="w-3.5 h-3.5" />
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
            TAB 7: 5 WILAYAH DUSUN RESMI
           ════════════════════════════════════════════════════════════════════ */}
        {activeTab === 'dusun' && (
          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
                    <Layers className="w-5 h-5 text-emerald-800" />
                    5 Wilayah Dusun Resmi Desa Jombe
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Pemerintah Desa Jombe terbagi atas 5 wilayah dusun administratif dengan total 10 Rukun Warga (RW) dan 5 Pos Kamling aktif.
                  </p>
                </div>
                <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                  5 Dusun · 10 RW
                </span>
              </div>

              {/* Dusun Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {daftarDusun.map((dusun, idx) => (
                  <div
                    key={idx}
                    className="p-5 rounded-2xl border border-slate-200 bg-slate-50 space-y-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-11 h-11 rounded-2xl bg-gradient-to-br ${dusun.avatarColor} flex items-center justify-center text-white font-black text-xs shadow-2xs shrink-0`}>
                        {dusun.nama.split(' ').map(n => n[0]).slice(1).join('')}
                      </div>
                      <div>
                        <span className="text-[10px] font-bold uppercase text-emerald-800 tracking-wider block">
                          Wilayah Dusun
                        </span>
                        <h4 className="text-sm font-black text-slate-900">
                          {dusun.nama}
                        </h4>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-200 text-xs space-y-1">
                      <div>
                        <span className="text-slate-500 block">Kepala Dusun:</span>
                        <strong className="text-slate-900 text-sm">{dusun.kepalaDusun}</strong>
                      </div>
                      <div className="pt-1 text-[11px] text-slate-600">
                        Pos Keamanan: <span className="font-semibold text-slate-800">{dusun.poskamling}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ════════════════════════════════════════════════════════════════════
            TAB 8: GEOGRAFIS & PETA (BPS)
           ════════════════════════════════════════════════════════════════════ */}
        {activeTab === 'peta' && (
          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-5">
              <div className="border-b border-slate-100 pb-4">
                <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
                  <Navigation className="w-5 h-5 text-emerald-800" />
                  Jarak & Aksesibilitas (Tabel 1.1.2 BPS)
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">Jarak resmi antar-ibukota sesuai tabel BPS Kabupaten Jeneponto.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                  <span className="text-slate-500 font-medium block">Jarak ke Ibu Kota Kecamatan Turatea</span>
                  <span className="text-2xl font-black text-emerald-900 block">17,00 km</span>
                  <span className="text-[11px] text-amber-800 font-semibold block">Desa paling jauh dari ibu kota Kecamatan Turatea (Tabel 1.1.2)</span>
                </div>
                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                  <span className="text-slate-500 font-medium block">Jarak ke Ibu Kota Kabupaten Jeneponto</span>
                  <span className="text-2xl font-black text-emerald-900 block">8,70 km</span>
                  <span className="text-[11px] text-slate-600 font-semibold block">Akses ke pusat pemerintahan Kabupaten Jeneponto (Tabel 1.1.2)</span>
                </div>
              </div>
            </div>

            {/* Embedded Google Map */}
            <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-sm space-y-3">
              <div className="flex items-center justify-between px-2 pt-1">
                <span className="text-xs font-black text-slate-900 flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-emerald-800" />
                  Peta Spasial Desa Jombe
                </span>
                <a
                  href="https://maps.google.com/maps?q=Desa+Jombe+Turatea+Jeneponto"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-bold text-emerald-800 hover:text-emerald-950 flex items-center gap-1"
                >
                  Buka di Google Maps <ExternalLink className="w-3 h-3" />
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
              Layanan Administrasi
            </span>
            <h3 className="text-lg sm:text-xl font-black text-white mt-1">
              Pelayanan Administrasi Warga Desa Jombe
            </h3>
            <p className="text-xs text-emerald-100/80 max-w-xl font-medium">
              Ajukan permohonan surat keterangan dan pantau progres berkas secara mandiri melalui website resmi desa.
            </p>
          </div>
          <div className="flex flex-wrap gap-2.5 shrink-0">
            <Link
              href="/layanan"
              className="px-5 py-3 bg-emerald-700 hover:bg-emerald-600 text-white font-bold rounded-xl text-xs shadow-sm transition-all flex items-center gap-2"
            >
              <span>Ajukan Permohonan Surat</span>
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
                    Pemerintah Desa Jombe
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
