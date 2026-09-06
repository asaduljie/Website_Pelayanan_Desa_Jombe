'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  MapPin,
  Users,
  Home,
  Compass,
  Award,
  BookOpen,
  Briefcase,
  Layers,
  Phone,
  Mail,
  CheckCircle2,
  Calendar,
  Building,
  Sparkles,
  TreePine,
  Shield,
  ArrowRight
} from 'lucide-react';

export default function ProfilDesaPage() {
  const [activeTab, setActiveTab] = useState<'profil' | 'aparat' | 'demografi' | 'peta'>('profil');

  const aparatDesa = [
    {
      jabatan: 'Kepala Desa Jombe',
      nama: 'JUSMAEDY, S.Pd',
      status: 'Pimpinan Pemerintahan Desa',
      avatarColor: 'from-emerald-700 to-teal-900',
      periode: '2021 - 2027',
      tugas: 'Memimpin penyelenggaraan pemerintahan desa, pembinaan kemasyarakatan, dan pemberdayaan masyarakat desa.'
    },
    {
      jabatan: 'Sekretaris Desa',
      nama: 'Herman, S.Sos',
      status: 'Koordinator Administrasi',
      avatarColor: 'from-emerald-800 to-slate-900',
      periode: 'Aparatur Desa Aktif',
      tugas: 'Mengkoordinasikan administrasi pemerintahan, keuangan, perumusan kebijakan desa, dan arsip kepegawaian.'
    },
    {
      jabatan: 'Kasi Pemerintahan',
      nama: 'Syamsuddin',
      status: 'Aparatur Desa Aktif',
      avatarColor: 'from-teal-800 to-slate-900',
      periode: 'Aparatur Desa Aktif',
      tugas: 'Mengelola tata kelola kependudukan, pertanahan, ketertiban umum, dan penyusunan profil wilayah desa.'
    },
    {
      jabatan: 'Kasi Kesejahteraan & Pelayanan',
      nama: 'Hasnah, S.Pd',
      status: 'Aparatur Desa Aktif',
      avatarColor: 'from-emerald-700 to-cyan-900',
      periode: 'Aparatur Desa Aktif',
      tugas: 'Melaksanakan pembangunan sarana prasarana desa, kesehatan (Posyandu), pemberdayaan perempuan, dan pelayanan sosial.'
    },
    {
      jabatan: 'Kaur Keuangan',
      nama: 'Nurul Hidayah, S.E',
      status: 'Aparatur Desa Aktif',
      avatarColor: 'from-teal-700 to-emerald-900',
      periode: 'Aparatur Desa Aktif',
      tugas: 'Menatausahakan APBDes, penerimaan pendapatan asli desa, transfer dana desa (ADD/DD), serta laporan pertanggungjawaban keuangan.'
    },
    {
      jabatan: 'Kaur Perencanaan & Umum',
      nama: 'Rahmat Kurniawan',
      status: 'Aparatur Desa Aktif',
      avatarColor: 'from-slate-700 to-emerald-950',
      periode: 'Aparatur Desa Aktif',
      tugas: 'Menyusun RKPDes, RPJMDes, inventaris aset kekayaan desa, dan administrasi perkantoran umum.'
    },
    {
      jabatan: 'Kepala Dusun Jombe Utara',
      nama: 'Kamaruddin Daeng Gassing',
      status: 'Kepala Kewilayahan',
      avatarColor: 'from-emerald-800 to-slate-800',
      periode: 'Dusun Jombe Utara',
      tugas: 'Pembinaan ketertiban, pelayanan warga dusun, dan penggerak gotong royong di wilayah Jombe Utara.'
    },
    {
      jabatan: 'Kepala Dusun Jombe Selatan',
      nama: 'Dg. Nuntung',
      status: 'Kepala Kewilayahan',
      avatarColor: 'from-teal-800 to-slate-800',
      periode: 'Dusun Jombe Selatan',
      tugas: 'Pembinaan ketertiban dan pelayanan warga masyarakat di wilayah Dusun Jombe Selatan.'
    },
    {
      jabatan: 'Kepala Dusun Bulo-Bulo',
      nama: 'Mustari Daeng Rangka',
      status: 'Kepala Kewilayahan',
      avatarColor: 'from-emerald-900 to-teal-800',
      periode: 'Dusun Bulo-Bulo',
      tugas: 'Koordinator kewilayahan, penyalur aspirasi warga dan penggerak swadaya dusun Bulo-Bulo.'
    },
    {
      jabatan: 'Kepala Dusun Kaluku',
      nama: 'Dg. Nai',
      status: 'Kepala Kewilayahan',
      avatarColor: 'from-slate-800 to-teal-900',
      periode: 'Dusun Kaluku',
      tugas: 'Koordinator pelayanan administrasi dan pembinaan kemasyarakatan di wilayah Dusun Kaluku.'
    },
    {
      jabatan: 'Ketua BPD Desa Jombe',
      nama: 'Ruslan, S.Pd',
      status: 'Badan Permusyawaratan Desa',
      avatarColor: 'from-indigo-900 to-slate-900',
      periode: 'Mitra Pengawas Desa',
      tugas: 'Membahas dan menyepakati rancangan Perdes bersama Kepala Desa, menampung aspirasi warga, dan mengawasi kinerja Pemdes.'
    }
  ];

  return (
    <div className="min-h-screen py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      {/* Hero Header Profil */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-950 via-emerald-900 to-teal-950 text-white p-8 sm:p-12 shadow-xl border border-emerald-800/60">
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-800/60 border border-emerald-500/40 text-xs font-bold uppercase tracking-wider text-emerald-300">
            <Sparkles className="w-3.5 h-3.5" />
            Portal Profil Resmi Pemerintahan Desa
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
            Desa Jombe, Kecamatan Turatea
          </h1>
          <p className="text-sm sm:text-base text-emerald-100/90 leading-relaxed">
            Kabupaten Jeneponto, Sulawesi Selatan. Desa yang menjunjung tinggi kearifan lokal, keterbukaan informasi publik, pertanian maju, dan transformasi pelayanan digital mandiri untuk seluruh masyarakat.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-4 text-xs font-medium text-emerald-200">
            <span className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-emerald-400" /> Kec. Turatea, Kab. Jeneponto
            </span>
            <span className="flex items-center gap-1.5">
              <Shield className="w-4 h-4 text-emerald-400" /> Kepala Desa: <strong>JUSMAEDY, S.Pd</strong>
            </span>
            <span className="flex items-center gap-1.5">
              <TreePine className="w-4 h-4 text-emerald-400" /> 4 Dusun Terintegrasi
            </span>
          </div>
        </div>

        {/* Decorative background element */}
        <div className="absolute right-0 bottom-0 translate-x-10 translate-y-10 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none"></div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-3">
        <button
          onClick={() => setActiveTab('profil')}
          className={`px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-extrabold transition-all flex items-center gap-2 ${
            activeTab === 'profil'
              ? 'bg-emerald-800 text-white shadow-md shadow-emerald-900/20'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Compass className="w-4 h-4" />
          <span>Profil & Visi Misi</span>
        </button>

        <button
          onClick={() => setActiveTab('aparat')}
          className={`px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-extrabold transition-all flex items-center gap-2 ${
            activeTab === 'aparat'
              ? 'bg-emerald-800 text-white shadow-md shadow-emerald-900/20'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Struktur Aparat Desa</span>
        </button>

        <button
          onClick={() => setActiveTab('demografi')}
          className={`px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-extrabold transition-all flex items-center gap-2 ${
            activeTab === 'demografi'
              ? 'bg-emerald-800 text-white shadow-md shadow-emerald-900/20'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Home className="w-4 h-4" />
          <span>Data Riil Kependudukan</span>
        </button>

        <button
          onClick={() => setActiveTab('peta')}
          className={`px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-extrabold transition-all flex items-center gap-2 ${
            activeTab === 'peta'
              ? 'bg-emerald-800 text-white shadow-md shadow-emerald-900/20'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <MapPin className="w-4 h-4" />
          <span>Peta Wilayah Desa</span>
        </button>
      </div>

      {/* TAB CONTENT: PROFIL & SEJARAH & VISI MISI */}
      {activeTab === 'profil' && (
        <div className="space-y-10 animate-in fade-in duration-200">
          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-soft text-center space-y-1">
              <span className="text-3xl font-black text-emerald-800">2.854</span>
              <span className="text-xs text-slate-500 font-bold block uppercase tracking-wide">Total Penduduk</span>
              <span className="text-[10px] text-slate-400">Jiwa Terdaftar</span>
            </div>
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-soft text-center space-y-1">
              <span className="text-3xl font-black text-teal-800">742</span>
              <span className="text-xs text-slate-500 font-bold block uppercase tracking-wide">Kepala Keluarga</span>
              <span className="text-[10px] text-slate-400">Data KK Aktif</span>
            </div>
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-soft text-center space-y-1">
              <span className="text-3xl font-black text-emerald-800">4</span>
              <span className="text-xs text-slate-500 font-bold block uppercase tracking-wide">Dusun Wilayah</span>
              <span className="text-[10px] text-slate-400">Pemerintahan Wilayah</span>
            </div>
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-soft text-center space-y-1">
              <span className="text-3xl font-black text-teal-800">5,42</span>
              <span className="text-xs text-slate-500 font-bold block uppercase tracking-wide">Luas Wilayah (km²)</span>
              <span className="text-[10px] text-slate-400">Kecamatan Turatea</span>
            </div>
          </div>

          {/* Sejarah & Gambaran Umum */}
          <div className="bg-white p-8 sm:p-10 rounded-3xl border border-slate-200 shadow-soft space-y-5">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-4">
              <BookOpen className="w-5 h-5 text-emerald-800" />
              <h2 className="text-xl font-black text-slate-900">Sejarah & Gambaran Umum Desa Jombe</h2>
            </div>
            <div className="text-slate-700 text-sm leading-relaxed space-y-4 font-sans">
              <p>
                <strong>Desa Jombe</strong> merupakan salah satu desa yang terletak di Kecamatan Turatea, Kabupaten Jeneponto, Provinsi Sulawesi Selatan. Masyarakat Desa Jombe dikenal memiliki nilai kekeluargaan yang erat, semangat gotong royong tinggi, serta tradisi budaya Makassar yang masih terpelihara dengan sangat asri.
              </p>
              <p>
                Secara geografis, Desa Jombe didominasi oleh bentang alam pertanian subur yang cocok untuk budidaya jagung kuning hibrida dan persawahan padi tadah hujan. Sebagian besar masyarakat berprofesi sebagai petani, peternak kuda dan sapi, serta pelaku usaha mikro kecil dan menengah (UMKM) pengolahan hasil panen.
              </p>
              <p>
                Di era kepemimpinan Kepala Desa <strong>JUSMAEDY, S.Pd</strong>, Desa Jombe terus berbenah melakukan pembaruan infrastruktur pedesaan, peningkatan mutu kesehatan ibu dan anak melalui Posyandu terpadu, dan modernisasi birokrasi pelayanan publik dengan meluncurkan sistem administrasi digital berbasis web.
              </p>
            </div>
          </div>

          {/* Visi & Misi */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Visi */}
            <div className="bg-gradient-to-br from-emerald-900 to-teal-950 text-white p-8 sm:p-10 rounded-3xl shadow-soft space-y-4">
              <div className="flex items-center gap-2 text-emerald-300">
                <Award className="w-6 h-6" />
                <span className="text-xs font-bold uppercase tracking-widest">Visi Desa Jombe</span>
              </div>
              <h3 className="text-2xl font-black leading-snug">
                &quot;Terwujudnya Desa Jombe yang Mandiri, Religius, Transparan, Berdaya Saing, dan Sejahtera Berbasis Pelayanan Digital dan Pertanian Modern.&quot;
              </h3>
              <p className="text-xs text-emerald-100/80 leading-relaxed pt-2">
                Menempatkan kesejahteraan warga sebagai prioritas utama dengan didukung tata kelola pemerintahan yang bersih, transparan, dan dapat dipertanggungjawabkan.
              </p>
            </div>

            {/* Misi */}
            <div className="bg-white p-8 sm:p-10 rounded-3xl border border-slate-200 shadow-soft space-y-5">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-800" />
                <h3 className="text-xl font-black text-slate-900">Misi Pembangunan Desa</h3>
              </div>
              <ul className="space-y-3.5 text-xs text-slate-700 leading-relaxed">
                <li className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center shrink-0 text-[11px]">
                    1
                  </span>
                  <span>Meningkatkan kualitas tata kelola birokrasi desa yang jujur, cepat, dan transparan melalui layanan administrasi surat online tanpa diskriminasi.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center shrink-0 text-[11px]">
                    2
                  </span>
                  <span>Membangun dan memelihara sarana infrastruktur jalan tani, jembatan dusun, penerangan jalan umum (PJU), dan irigasi pertanian.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center shrink-0 text-[11px]">
                    3
                  </span>
                  <span>Mendorong kemandirian ekonomi keluarga melalui kelompok tani (Poktan), optimalisasi panen jagung dan padi, serta pemberdayaan UMKM lokal.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center shrink-0 text-[11px]">
                    4
                  </span>
                  <span>Mewujudkan masyarakat yang agamis, menjaga kerukunan antar dusun, serta meningkatkan mutu layanan kesehatan Posyandu dan pendidikan generasi muda desa.</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Potensi Desa */}
          <div className="bg-white p-8 sm:p-10 rounded-3xl border border-slate-200 shadow-soft space-y-6">
            <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
              <TreePine className="w-5 h-5 text-emerald-800" />
              Potensi Unggulan Wilayah Desa Jombe
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <span className="text-2xl">🌽</span>
                <h4 className="font-extrabold text-sm text-slate-900">Pertanian Jagung Kuning</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Komoditas utama Desa Jombe yang menjadi sumber pendapatan penting masyarakat dengan produktivitas panen ribuan ton per musim.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <span className="text-2xl">🌾</span>
                <h4 className="font-extrabold text-sm text-slate-900">Padi Sawah & Irigasi</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Hamparan sawah tadah hujan dan saluran irigasi pedesaan yang menopang ketahanan pangan mandiri masyarakat lokal secara berkesinambungan.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <span className="text-2xl">🐎</span>
                <h4 className="font-extrabold text-sm text-slate-900">Peternakan Kuda & Sapi</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Sentra budidaya peternakan tradisional khas Jeneponto, memasok hewan ternak sehat dengan pengawasan kelompok peternak desa.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: STRUKTUR APARAT DESA */}
      {activeTab === 'aparat' && (
        <div className="space-y-8 animate-in fade-in duration-200">
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-soft">
            <h2 className="text-xl font-black text-slate-900 flex items-center gap-2 mb-2">
              <Users className="w-5 h-5 text-emerald-800" />
              Struktur Organisasi & Aparatur Pemerintah Desa Jombe
            </h2>
            <p className="text-xs text-slate-500 max-w-3xl leading-relaxed">
              Berikut adalah susunan lengkap pejabat dan aparatur Pemerintah Desa Jombe, Kecamatan Turatea, Kabupaten Jeneponto yang siap melayani kebutuhan administratif dan pembinaan masyarakat.
            </p>
          </div>

          {/* Highlight Kades Card */}
          <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-teal-950 text-white rounded-3xl p-8 sm:p-10 shadow-lg border border-emerald-700/60 flex flex-col md:flex-row items-center gap-8">
            <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-3xl bg-gradient-to-tr from-emerald-600 to-teal-400 p-1 shrink-0 shadow-xl">
              <div className="w-full h-full bg-slate-900 rounded-[22px] flex items-center justify-center text-4xl font-black text-emerald-200">
                JD
              </div>
            </div>
            <div className="space-y-2 text-center md:text-left">
              <span className="text-xs bg-emerald-700/70 text-emerald-200 font-bold uppercase px-3 py-1 rounded-full border border-emerald-500/40">
                Kepala Desa Jombe
              </span>
              <h3 className="text-2xl sm:text-3xl font-black tracking-tight">JUSMAEDY, S.Pd</h3>
              <p className="text-xs text-emerald-200 font-mono">Periode Jabatan: 2021 - 2027</p>
              <p className="text-xs sm:text-sm text-emerald-100/90 max-w-2xl leading-relaxed pt-1">
                &quot;Komitmen kami adalah memberikan pelayanan masyarakat yang cepat, ramah, dan transparan tanpa pungli. Pintu kantor desa selalu terbuka untuk seluruh warga Desa Jombe.&quot;
              </p>
            </div>
          </div>

          {/* Grid Aparat Lainnya */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {aparatDesa.slice(1).map((item, idx) => (
              <div
                key={idx}
                className="bg-white p-6 rounded-3xl border border-slate-200 shadow-soft space-y-4 hover:border-emerald-300 transition-all flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${item.avatarColor} flex items-center justify-center text-white font-black text-sm shadow-md`}>
                      {item.nama.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <span className="text-[10px] font-bold uppercase text-emerald-800 block">
                        {item.jabatan}
                      </span>
                      <h4 className="text-base font-extrabold text-slate-900 leading-tight">
                        {item.nama}
                      </h4>
                    </div>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed font-sans pt-1 border-t border-slate-100">
                    {item.tugas}
                  </p>
                </div>

                <div className="pt-2 flex justify-between items-center text-[11px] text-slate-400 font-medium">
                  <span>Status: {item.status}</span>
                  <span className="text-emerald-800 font-bold">Aktif</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB CONTENT: DEMOGRAFI & KEPENDUDUKAN */}
      {activeTab === 'demografi' && (
        <div className="space-y-8 animate-in fade-in duration-200">
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-soft">
            <h2 className="text-xl font-black text-slate-900 flex items-center gap-2 mb-2">
              <Home className="w-5 h-5 text-emerald-800" />
              Statistik & Data Riil Kependudukan Desa Jombe
            </h2>
            <p className="text-xs text-slate-500 max-w-3xl leading-relaxed">
              Data konsolidasi kependudukan terbaru mencakup persebaran wilayah 4 dusun di Desa Jombe, jenis kelamin, dan mata pencaharian pokok warga.
            </p>
          </div>

          {/* Rincian Persebaran 4 Dusun */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-soft space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-900 flex items-center justify-center font-black text-xs">
                01
              </div>
              <h3 className="text-base font-extrabold text-slate-900">Dusun Jombe Utara</h3>
              <p className="text-xs text-slate-600">Pusat pemukiman warga bagian utara dan sentra persawahan padi.</p>
              <div className="pt-2 border-t border-slate-100 text-xs space-y-1 font-medium text-slate-700">
                <div className="flex justify-between">
                  <span className="text-slate-400">Kepala Dusun:</span>
                  <span className="font-bold">Kamaruddin Dg. Gassing</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Estimasi KK:</span>
                  <span className="font-bold text-emerald-800">± 198 KK</span>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-soft space-y-3">
              <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-900 flex items-center justify-center font-black text-xs">
                02
              </div>
              <h3 className="text-base font-extrabold text-slate-900">Dusun Jombe Selatan</h3>
              <p className="text-xs text-slate-600">Wilayah kantor desa, sentra perdagangan kecil, dan sarana umum.</p>
              <div className="pt-2 border-t border-slate-100 text-xs space-y-1 font-medium text-slate-700">
                <div className="flex justify-between">
                  <span className="text-slate-400">Kepala Dusun:</span>
                  <span className="font-bold">Dg. Nuntung</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Estimasi KK:</span>
                  <span className="font-bold text-emerald-800">± 185 KK</span>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-soft space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-900 flex items-center justify-center font-black text-xs">
                03
              </div>
              <h3 className="text-base font-extrabold text-slate-900">Dusun Bulo-Bulo</h3>
              <p className="text-xs text-slate-600">Wilayah lumbung jagung kuning dan peternakan sapi masyarakat.</p>
              <div className="pt-2 border-t border-slate-100 text-xs space-y-1 font-medium text-slate-700">
                <div className="flex justify-between">
                  <span className="text-slate-400">Kepala Dusun:</span>
                  <span className="font-bold">Mustari Dg. Rangka</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Estimasi KK:</span>
                  <span className="font-bold text-emerald-800">± 182 KK</span>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-soft space-y-3">
              <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-900 flex items-center justify-center font-black text-xs">
                04
              </div>
              <h3 className="text-base font-extrabold text-slate-900">Dusun Kaluku</h3>
              <p className="text-xs text-slate-600">Kawasan perkebunan kelapa, jagung hibrida, dan peternakan kuda.</p>
              <div className="pt-2 border-t border-slate-100 text-xs space-y-1 font-medium text-slate-700">
                <div className="flex justify-between">
                  <span className="text-slate-400">Kepala Dusun:</span>
                  <span className="font-bold">Dg. Nai</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Estimasi KK:</span>
                  <span className="font-bold text-emerald-800">± 177 KK</span>
                </div>
              </div>
            </div>
          </div>

          {/* Tabel Komposisi Penduduk */}
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-soft space-y-4">
            <h3 className="text-base font-extrabold text-slate-900">Komposisi Penduduk Berdasarkan Gender & Pekerjaan</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
              <div className="border border-slate-200 rounded-2xl p-5 space-y-3">
                <span className="font-bold text-slate-800 block text-sm">Jenis Kelamin:</span>
                <div className="space-y-2">
                  <div>
                    <div className="flex justify-between font-medium mb-1">
                      <span>Laki-Laki</span>
                      <span className="font-bold text-emerald-800">1.412 Jiwa (49.5%)</span>
                    </div>
                    <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                      <div className="bg-emerald-700 h-full rounded-full" style={{ width: '49.5%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between font-medium mb-1">
                      <span>Perempuan</span>
                      <span className="font-bold text-teal-800">1.442 Jiwa (50.5%)</span>
                    </div>
                    <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                      <div className="bg-teal-600 h-full rounded-full" style={{ width: '50.5%' }}></div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border border-slate-200 rounded-2xl p-5 space-y-2">
                <span className="font-bold text-slate-800 block text-sm">Mata Pencaharian Utama:</span>
                <ul className="space-y-1.5 text-slate-600">
                  <li className="flex justify-between">
                    <span>• Petani Jagung & Padi:</span>
                    <strong className="text-slate-900">± 68%</strong>
                  </li>
                  <li className="flex justify-between">
                    <span>• Peternak (Kuda, Sapi, Kambing):</span>
                    <strong className="text-slate-900">± 15%</strong>
                  </li>
                  <li className="flex justify-between">
                    <span>• Pedagang, Wiraswasta & UMKM:</span>
                    <strong className="text-slate-900">± 9%</strong>
                  </li>
                  <li className="flex justify-between">
                    <span>• Pegawai Negeri / Guru / Honorer:</span>
                    <strong className="text-slate-900">± 8%</strong>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: PETA WILAYAH DESA */}
      {activeTab === 'peta' && (
        <div className="space-y-8 animate-in fade-in duration-200">
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-soft">
            <h2 className="text-xl font-black text-slate-900 flex items-center gap-2 mb-2">
              <MapPin className="w-5 h-5 text-emerald-800" />
              Peta Geografis Desa Jombe, Turatea, Jeneponto
            </h2>
            <p className="text-xs text-slate-500 max-w-3xl leading-relaxed">
              Navigasi interaktif peta satelit wilayah Desa Jombe dan batas-batas administratif desa di Kabupaten Jeneponto, Sulawesi Selatan.
            </p>
          </div>

          {/* Google Maps Embed Frame */}
          <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-soft overflow-hidden">
            <div className="w-full h-96 sm:h-[480px] rounded-2xl overflow-hidden border border-slate-200">
              <iframe
                title="Peta Desa Jombe, Turatea, Jeneponto"
                src="https://maps.google.com/maps?q=Desa%20Jombe%2C%20Kecamatan%20Turatea%2C%20Kabupaten%20Jeneponto%2C%20Sulawesi%20Selatan&t=&z=14&ie=UTF8&iwloc=&output=embed"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>

          {/* Batas Batas Wilayah */}
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-soft space-y-4">
            <h3 className="text-base font-extrabold text-slate-900">Batas-Batas Wilayah Administratif Desa Jombe:</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <span className="text-slate-400 block font-bold uppercase text-[10px]">Batas Utara</span>
                <strong className="text-slate-900 text-sm mt-1 block">Desa Mangepong</strong>
                <span className="text-slate-500 text-[11px]">Kecamatan Turatea</span>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <span className="text-slate-400 block font-bold uppercase text-[10px]">Batas Selatan</span>
                <strong className="text-slate-900 text-sm mt-1 block">Kel. Empoang</strong>
                <span className="text-slate-500 text-[11px]">Kecamatan Binamu</span>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <span className="text-slate-400 block font-bold uppercase text-[10px]">Batas Timur</span>
                <strong className="text-slate-900 text-sm mt-1 block">Desa Bontomate&apos;ne</strong>
                <span className="text-slate-500 text-[11px]">Kecamatan Turatea</span>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <span className="text-slate-400 block font-bold uppercase text-[10px]">Batas Barat</span>
                <strong className="text-slate-900 text-sm mt-1 block">Desa Kayuloe Barat</strong>
                <span className="text-slate-500 text-[11px]">Aliran Sungai Jeneponto</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Call to Action: Butuh Layanan Surat? */}
      <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-r from-emerald-900 via-teal-900 to-emerald-950 text-white shadow-xl flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="space-y-2 text-center md:text-left">
          <h3 className="text-2xl font-black">Butuh Surat Keterangan atau Dokumen Resmi?</h3>
          <p className="text-xs sm:text-sm text-emerald-100/90 max-w-xl">
            Warga Desa Jombe kini dapat langsung mengajukan surat secara online tanpa perlu mendaftar akun. Cukup masukkan NIK dan ikuti instruksi yang tertera.
          </p>
        </div>

        <div className="flex flex-wrap gap-3 shrink-0">
          <Link
            href="/layanan"
            className="px-6 py-3.5 bg-emerald-700 hover:bg-emerald-600 text-white font-bold rounded-2xl text-xs shadow-md transition-all flex items-center gap-2"
          >
            <span>Pilih Jenis Surat</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/lacak"
            className="px-6 py-3.5 bg-white/10 hover:bg-white/20 text-white font-bold rounded-2xl text-xs backdrop-blur-xs transition-all border border-white/20"
          >
            <span>Lacak Status Berkas</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
