'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  MapPin, Users, Home, Layers, Sparkles, Shield, ArrowRight,
  Hash, TreePine, Building, Heart, Wifi, Trophy, Wheat,
  ChevronRight, Star, Activity
} from 'lucide-react';

export default function ProfilDesaPage() {
  const [activeTab, setActiveTab] = useState<'tentang' | 'aparat' | 'statistik' | 'potensi' | 'fasilitas' | 'peta'>('tentang');

  const aparatDesa = [
    { jabatan: 'Sekretaris Desa', nama: 'SYAMSUL RISWAN', avatarColor: 'from-emerald-800 to-slate-900', tugas: 'Mengkoordinasikan administrasi pemerintahan, keuangan, perumusan kebijakan desa, dan pengarsipan kepegawaian.' },
    { jabatan: 'Kasi Pemerintahan', nama: 'ZAINAL MUTTAQIN AHMAD', avatarColor: 'from-teal-800 to-slate-900', tugas: 'Mengelola tata kelola kependudukan, pertanahan, ketertiban umum, dan penyusunan profil wilayah desa.' },
    { jabatan: 'Kasi Pelayanan Umum', nama: 'SARDI', avatarColor: 'from-emerald-700 to-cyan-900', tugas: 'Melaksanakan pelayanan administrasi kependudukan dan penerbitan surat keterangan untuk masyarakat.' },
    { jabatan: 'Kasi Kesra', nama: 'SUKARDI', avatarColor: 'from-teal-700 to-emerald-900', tugas: 'Mengelola program kesejahteraan rakyat, kesehatan, bantuan sosial, dan pemberdayaan masyarakat desa.' },
    { jabatan: 'Kaur Perencanaan', nama: 'SYARIF AL-QADRI', avatarColor: 'from-slate-700 to-emerald-950', tugas: 'Menyusun RKPDes, RPJMDes, inventaris aset kekayaan desa, dan perencanaan pembangunan desa.' },
    { jabatan: 'Kaur Keuangan', nama: 'ARIANTO', avatarColor: 'from-emerald-800 to-slate-800', tugas: 'Menatausahakan APBDes, penerimaan pendapatan asli desa, transfer dana desa (ADD/DD), serta laporan keuangan.' },
    { jabatan: 'Kaur Administrasi dan T.U', nama: 'KASMAWATI', avatarColor: 'from-teal-800 to-slate-800', tugas: 'Mengelola administrasi umum perkantoran desa, tata usaha, dan pengarsipan surat masuk dan keluar.' },
    { jabatan: 'Kepala Dusun Jombe Utara', nama: 'MUHAJRIN JUMARANG', avatarColor: 'from-emerald-900 to-teal-800', tugas: 'Pembinaan ketertiban, pelayanan warga, dan penggerak gotong royong di wilayah Dusun Jombe Utara.' },
    { jabatan: 'Kepala Dusun Jombe Tengah', nama: 'BASO', avatarColor: 'from-slate-800 to-teal-900', tugas: 'Koordinator kewilayahan, penyalur aspirasi warga, dan penggerak swadaya Dusun Jombe Tengah.' },
    { jabatan: 'Kepala Dusun Jombe Selatan', nama: 'SAPARUDDIN', avatarColor: 'from-teal-800 to-emerald-900', tugas: 'Pembinaan ketertiban dan pelayanan warga masyarakat di wilayah Dusun Jombe Selatan.' },
    { jabatan: 'Kepala Dusun Tompo Balang', nama: 'NURLELA KAMARUDDIN', avatarColor: 'from-emerald-800 to-cyan-900', tugas: 'Koordinator pelayanan administrasi dan pembinaan kemasyarakatan di wilayah Dusun Tompo Balang.' },
    { jabatan: 'Kepala Dusun Muncu-muncu', nama: 'ICAL RAHMAN', avatarColor: 'from-indigo-900 to-slate-900', tugas: 'Koordinator pelayanan administrasi dan pembinaan kemasyarakatan di wilayah Dusun Muncu-muncu.' },
  ];

  const tabs = [
    { id: 'tentang', label: 'Tentang Desa', icon: <Star className="w-4 h-4" /> },
    { id: 'statistik', label: 'Statistik', icon: <Activity className="w-4 h-4" /> },
    { id: 'aparat', label: 'Perangkat Desa', icon: <Users className="w-4 h-4" /> },
    { id: 'potensi', label: 'Potensi', icon: <TreePine className="w-4 h-4" /> },
    { id: 'fasilitas', label: 'Fasilitas', icon: <Building className="w-4 h-4" /> },
    { id: 'peta', label: 'Peta', icon: <MapPin className="w-4 h-4" /> },
  ] as const;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Banner */}
      <div className="relative overflow-hidden bg-gradient-to-br from-emerald-950 via-emerald-900 to-teal-950 text-white">
        <div className="absolute inset-0 bg-[url('/hero-desa.jpg')] bg-cover bg-center opacity-10" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <div className="max-w-3xl space-y-5">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-800/60 border border-emerald-500/40 text-xs font-bold uppercase tracking-widest text-emerald-300">
              <Sparkles className="w-3.5 h-3.5" />
              Profil Resmi Desa — Data BPS 2025
            </div>
            <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-tight">
              Desa <span className="text-emerald-400">Jombe</span>
            </h1>
            <p className="text-base text-emerald-100/90 leading-relaxed max-w-xl">
              Kecamatan Turatea, Kabupaten Jeneponto, Provinsi Sulawesi Selatan.<br/>
              Desa dengan klasifikasi <strong className="text-emerald-300">Swasembada</strong> dan status perkembangan <strong className="text-emerald-300">Cepat Berkembang</strong>.
            </p>
            <div className="flex flex-wrap gap-3 pt-1 text-xs font-semibold text-emerald-200">
              <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-full border border-white/20">
                <MapPin className="w-3.5 h-3.5" /> Kode Wilayah: 7304082009
              </span>
              <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-full border border-white/20">
                <Shield className="w-3.5 h-3.5" /> Kades: JUSMAEDY, S.Pd
              </span>
              <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-full border border-white/20">
                <Layers className="w-3.5 h-3.5" /> 5 Dusun · 10 RW
              </span>
              <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-full border border-white/20">
                <Trophy className="w-3.5 h-3.5" /> Swasembada · Cepat Berkembang
              </span>
            </div>
          </div>
        </div>
        {/* Wave bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-8 bg-slate-50" style={{clipPath:'ellipse(55% 100% at 50% 100%)'}} />
      </div>

      {/* Quick Stats Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-1">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-8">
          {[
            { val: '2.670', label: 'Total Penduduk', sub: 'Jiwa (2024)', color: 'text-emerald-800' },
            { val: '850', label: 'Kepala Keluarga', sub: 'KK Terdaftar', color: 'text-teal-800' },
            { val: '3,76', label: 'Luas Wilayah', sub: 'km²', color: 'text-emerald-800' },
            { val: '710', label: 'Kepadatan', sub: 'Jiwa/km²', color: 'text-teal-800' },
          ].map((s, i) => (
            <div key={i} className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm text-center space-y-1 hover:shadow-md transition-shadow">
              <span className={`text-3xl font-black ${s.color}`}>{s.val}</span>
              <span className="text-xs font-bold text-slate-700 block uppercase tracking-wide">{s.label}</span>
              <span className="text-[10px] text-slate-400">{s.sub}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 space-y-8">
        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-3">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2.5 rounded-2xl text-xs font-extrabold transition-all flex items-center gap-2 ${
                activeTab === tab.id
                  ? 'bg-emerald-800 text-white shadow-md'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* ═══════════════════ TAB: TENTANG DESA ═══════════════════ */}
        {activeTab === 'tentang' && (
          <div className="space-y-8 animate-in fade-in duration-200">
            {/* Gambaran Umum */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="bg-gradient-to-r from-emerald-900 to-teal-900 px-8 py-5">
                <h2 className="text-lg font-black text-white flex items-center gap-2">
                  <Star className="w-5 h-5 text-emerald-300" /> Gambaran Umum Desa Jombe
                </h2>
              </div>
              <div className="p-8 text-sm text-slate-700 leading-relaxed space-y-4">
                <p>
                  <strong>Desa Jombe</strong> merupakan salah satu desa di Kecamatan Turatea, Kabupaten Jeneponto, Provinsi Sulawesi Selatan, dengan kode wilayah <strong>7304082009</strong>. Desa ini memiliki luas wilayah <strong>3,76 km²</strong> atau sekitar 7,00% dari total luas Kecamatan Turatea.
                </p>
                <p>
                  Berdasarkan data BPS Kecamatan Turatea Dalam Angka 2025, Desa Jombe merupakan <strong>desa yang paling jauh dari ibu kota Kecamatan Turatea</strong>, yaitu sekitar 17 km, sedangkan jarak ke ibu kota Kabupaten Jeneponto adalah 8,70 km. Status wilayah Jombe adalah <strong>bukan daerah pantai</strong>.
                </p>
                <p>
                  Pada tahun 2024, Desa Jombe diklasifikasikan sebagai desa <strong>Swasembada</strong> dengan tingkat perkembangan <strong>Cepat Berkembang</strong>. Desa ini telah didukung jaringan seluler dengan kekuatan sinyal kuat dan jaringan internet <strong>4G/LTE</strong>.
                </p>
              </div>
            </div>

            {/* Identitas & Geografis */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="px-6 py-4 bg-slate-50 border-b border-slate-200">
                  <h3 className="font-black text-slate-900 flex items-center gap-2 text-sm">
                    <MapPin className="w-4 h-4 text-emerald-700" /> Identitas & Letak Geografis
                  </h3>
                </div>
                <div className="divide-y divide-slate-100 text-xs">
                  {[
                    ['Nama Desa', 'Jombe'],
                    ['Kecamatan', 'Turatea'],
                    ['Kabupaten', 'Jeneponto'],
                    ['Provinsi', 'Sulawesi Selatan'],
                    ['Kode Wilayah', '7304082009'],
                    ['Status Wilayah', 'Bukan Daerah Pantai'],
                    ['Luas Wilayah', '3,76 km²'],
                    ['% Luas Kecamatan', '7,00%'],
                    ['Jarak ke Ibukota Kecamatan', '17 km'],
                    ['Jarak ke Ibukota Kabupaten', '8,70 km'],
                    ['Jumlah RW', '10 RW'],
                    ['Jumlah Dusun', '5 Dusun'],
                  ].map(([label, val]) => (
                    <div key={label} className="flex justify-between px-6 py-3">
                      <span className="text-slate-500">{label}</span>
                      <span className="font-bold text-slate-900 text-right">{val}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-6">
                {/* Status Perkembangan */}
                <div className="bg-gradient-to-br from-emerald-900 to-teal-950 rounded-3xl p-8 text-white text-center space-y-3">
                  <Trophy className="w-10 h-10 text-emerald-300 mx-auto" />
                  <h3 className="font-black text-xl">Status Perkembangan Desa</h3>
                  <div className="flex flex-col gap-3">
                    <div className="bg-emerald-700/60 border border-emerald-500/40 rounded-2xl px-6 py-3">
                      <span className="text-xs text-emerald-300 font-bold uppercase tracking-wider block">Klasifikasi Desa</span>
                      <span className="text-2xl font-black text-white">Swasembada</span>
                    </div>
                    <div className="bg-emerald-700/60 border border-emerald-500/40 rounded-2xl px-6 py-3">
                      <span className="text-xs text-emerald-300 font-bold uppercase tracking-wider block">Tingkat Perkembangan</span>
                      <span className="text-2xl font-black text-white">Cepat Berkembang</span>
                    </div>
                  </div>
                  <p className="text-xs text-emerald-200">Sumber: BPS Kecamatan Turatea Dalam Angka 2025</p>
                </div>

                {/* Internet */}
                <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-4">
                  <h3 className="font-black text-slate-900 text-sm flex items-center gap-2">
                    <Wifi className="w-4 h-4 text-emerald-700" /> Konektivitas Digital
                  </h3>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    {[
                      { label: 'Jaringan Seluler', val: 'Kuat', color: 'bg-green-50 text-green-800 border-green-200' },
                      { label: 'Jenis Internet', val: '4G/LTE', color: 'bg-blue-50 text-blue-800 border-blue-200' },
                    ].map(item => (
                      <div key={item.label} className={`rounded-2xl border p-3 text-center ${item.color}`}>
                        <span className="text-[10px] font-bold uppercase block opacity-70">{item.label}</span>
                        <span className="text-base font-black">{item.val}</span>
                      </div>
                    ))}
                  </div>
                  <p className="text-[11px] text-slate-400">Sumber: BPS Kecamatan Turatea Dalam Angka 2025</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ═══════════════════ TAB: STATISTIK ═══════════════════ */}
        {activeTab === 'statistik' && (
          <div className="space-y-8 animate-in fade-in duration-200">
            {/* Kependudukan */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="bg-gradient-to-r from-emerald-900 to-teal-900 px-8 py-5">
                <h2 className="text-lg font-black text-white flex items-center gap-2">
                  <Users className="w-5 h-5 text-emerald-300" /> Data Kependudukan 2024
                </h2>
                <p className="text-xs text-emerald-200 mt-1">Sumber: BPS Kecamatan Turatea Dalam Angka 2025</p>
              </div>
              <div className="p-8 space-y-6">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {[
                    { val: '2.670', label: 'Total Penduduk', sub: 'Jiwa', color: 'text-emerald-800' },
                    { val: '850', label: 'Kepala Keluarga', sub: 'KK', color: 'text-teal-800' },
                    { val: '710,11', label: 'Kepadatan', sub: 'Jiwa/km²', color: 'text-emerald-800' },
                    { val: '100,15', label: 'Rasio Kelamin', sub: 'L per 100 P', color: 'text-teal-800' },
                  ].map((s, i) => (
                    <div key={i} className="bg-slate-50 rounded-2xl p-5 text-center space-y-1 border border-slate-200">
                      <span className={`text-2xl font-black ${s.color}`}>{s.val}</span>
                      <span className="text-xs font-bold text-slate-700 block">{s.label}</span>
                      <span className="text-[10px] text-slate-400">{s.sub}</span>
                    </div>
                  ))}
                </div>

                {/* Gender bar */}
                <div className="space-y-3">
                  <h4 className="font-bold text-slate-800 text-sm">Komposisi Jenis Kelamin</h4>
                  <div className="space-y-2 text-xs">
                    <div>
                      <div className="flex justify-between mb-1.5 font-medium">
                        <span>👨 Laki-laki</span>
                        <span className="font-bold text-emerald-800">1.336 jiwa (50,04%)</span>
                      </div>
                      <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-700 rounded-full" style={{width:'50.04%'}} />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-1.5 font-medium">
                        <span>👩 Perempuan</span>
                        <span className="font-bold text-teal-800">1.334 jiwa (49,96%)</span>
                      </div>
                      <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-teal-600 rounded-full" style={{width:'49.96%'}} />
                      </div>
                    </div>
                  </div>
                  <p className="text-[11px] text-slate-400">% penduduk terhadap Kecamatan Turatea: <strong>7,33%</strong></p>
                </div>
              </div>
            </div>

            {/* Data Perumahan */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="px-8 py-5 border-b border-slate-100">
                <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
                  <Home className="w-5 h-5 text-emerald-700" /> Data Perumahan 2024
                </h2>
              </div>
              <div className="p-8">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
                  {[
                    { label: 'Total Rumah', val: '519 unit', color: 'bg-emerald-50 border-emerald-200 text-emerald-800' },
                    { label: 'Rumah Permanen', val: '313 unit', color: 'bg-teal-50 border-teal-200 text-teal-800' },
                    { label: 'Semi Permanen', val: '196 unit', color: 'bg-slate-50 border-slate-200 text-slate-800' },
                    { label: 'Rumah Darurat', val: '10 unit', color: 'bg-amber-50 border-amber-200 text-amber-800' },
                    { label: 'Tingkat I', val: '514 rumah', color: 'bg-emerald-50 border-emerald-200 text-emerald-800' },
                    { label: 'Tingkat II', val: '5 rumah', color: 'bg-teal-50 border-teal-200 text-teal-800' },
                  ].map(item => (
                    <div key={item.label} className={`rounded-2xl border p-4 text-center ${item.color}`}>
                      <span className="text-[10px] font-bold uppercase block opacity-70 mb-1">{item.label}</span>
                      <span className="text-lg font-black">{item.val}</span>
                    </div>
                  ))}
                </div>

                {/* Bar chart rumah */}
                <div className="mt-6 space-y-3">
                  <h4 className="font-bold text-slate-800 text-sm">Komposisi Jenis Rumah</h4>
                  {[
                    { label: 'Permanen', val: 313, total: 519, color: 'bg-emerald-700' },
                    { label: 'Semi Permanen', val: 196, total: 519, color: 'bg-teal-500' },
                    { label: 'Darurat', val: 10, total: 519, color: 'bg-amber-500' },
                  ].map(item => (
                    <div key={item.label} className="text-xs">
                      <div className="flex justify-between mb-1 font-medium">
                        <span>{item.label}</span>
                        <span className="font-bold">{item.val} unit ({Math.round(item.val/item.total*100)}%)</span>
                      </div>
                      <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                        <div className={`h-full ${item.color} rounded-full`} style={{width:`${item.val/item.total*100}%`}} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Mata Pencaharian */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="px-8 py-5 border-b border-slate-100">
                <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
                  <Wheat className="w-5 h-5 text-emerald-700" /> Mata Pencaharian 2024
                </h2>
              </div>
              <div className="p-8 space-y-4">
                <p className="text-sm text-slate-600 leading-relaxed">
                  Masyarakat Desa Jombe memiliki aktivitas ekonomi yang banyak bertumpu pada sektor <strong>pertanian</strong> dan <strong>peternakan</strong>. Pada tahun 2024 tercatat 485 orang bermata pencaharian sebagai petani dan 220 orang pada sektor ternak, sementara 75 orang tercatat sebagai PNS/ABRI.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {[
                    { emoji: '👨‍🌾', label: 'Petani', val: '485 orang', color: 'from-emerald-800 to-teal-900' },
                    { emoji: '🐄', label: 'Sektor Ternak', val: '220 orang', color: 'from-teal-800 to-slate-800' },
                    { emoji: '🏛️', label: 'PNS / ABRI', val: '75 orang', color: 'from-slate-700 to-emerald-900' },
                  ].map(item => (
                    <div key={item.label} className={`bg-gradient-to-br ${item.color} rounded-2xl p-6 text-white text-center space-y-1`}>
                      <span className="text-3xl">{item.emoji}</span>
                      <p className="text-2xl font-black">{item.val}</p>
                      <p className="text-xs text-white/80 font-bold">{item.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ═══════════════════ TAB: APARAT ═══════════════════ */}
        {activeTab === 'aparat' && (
          <div className="space-y-8 animate-in fade-in duration-200">
            {/* Kepala Desa */}
            <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-teal-950 text-white rounded-3xl p-8 sm:p-10 shadow-lg border border-emerald-700/60 flex flex-col md:flex-row items-center gap-8">
              <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-3xl bg-gradient-to-tr from-emerald-600 to-teal-400 p-1 shrink-0 shadow-xl">
                <div className="w-full h-full bg-slate-900 rounded-[22px] flex items-center justify-center text-3xl font-black text-emerald-200">JD</div>
              </div>
              <div className="space-y-2 text-center md:text-left">
                <span className="text-xs bg-emerald-700/70 text-emerald-200 font-bold uppercase px-3 py-1 rounded-full border border-emerald-500/40">Kepala Desa Jombe</span>
                <h3 className="text-2xl sm:text-3xl font-black tracking-tight">JUSMAEDY, S.Pd</h3>
              </div>
            </div>

            {/* Kelembagaan */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8">
              <h3 className="font-black text-slate-900 text-sm mb-5 flex items-center gap-2">
                <Building className="w-4 h-4 text-emerald-700" /> Kelembagaan Desa
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                {[
                  { emoji: '🏛️', label: 'Kantor Desa', val: '1' },
                  { emoji: '🏢', label: 'Balai Desa', val: '1' },
                  { emoji: '👥', label: 'BPD', val: '1' },
                  { emoji: '🌾', label: 'P3A', val: '1' },
                  { emoji: '🤝', label: 'Karang Taruna', val: '1' },
                ].map(item => (
                  <div key={item.label} className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-center space-y-1">
                    <span className="text-2xl">{item.emoji}</span>
                    <p className="text-xl font-black text-emerald-800">{item.val}</p>
                    <p className="text-[10px] font-bold text-slate-600 uppercase">{item.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Card Grid Perangkat */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-4 mb-6">
                <Users className="w-5 h-5 text-emerald-800" />
                <h2 className="text-base font-black text-slate-900">Perangkat Desa Jombe — Tahun Anggaran 2025</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {aparatDesa.map((item, idx) => (
                  <div key={idx} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3 hover:border-emerald-300 hover:shadow-md transition-all flex flex-col justify-between">
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-11 h-11 rounded-2xl bg-gradient-to-br ${item.avatarColor} flex items-center justify-center text-white font-black text-sm shadow shrink-0`}>
                          {item.nama.substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <span className="text-[10px] font-bold uppercase text-emerald-800 block">{item.jabatan}</span>
                          <h4 className="text-sm font-extrabold text-slate-900 leading-tight">{item.nama}</h4>
                        </div>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed border-t border-slate-100 pt-3">{item.tugas}</p>
                    </div>
                    <div className="pt-2 flex justify-end">
                      <span className="text-[10px] bg-emerald-50 text-emerald-700 font-bold px-2.5 py-1 rounded-full border border-emerald-200">Aktif</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ═══════════════════ TAB: POTENSI ═══════════════════ */}
        {activeTab === 'potensi' && (
          <div className="space-y-8 animate-in fade-in duration-200">
            {/* Pertanian */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="bg-gradient-to-r from-emerald-900 to-teal-900 px-8 py-5">
                <h2 className="text-lg font-black text-white">🌾 Potensi Pertanian</h2>
                <p className="text-xs text-emerald-200 mt-1">Data penggunaan lahan 2024 — Sumber: BPS</p>
              </div>
              <div className="p-8 space-y-6">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {[
                    { label: 'Sawah', val: '192 ha', sub: '110 ha teknis + 82 ha tadah hujan', color: 'bg-emerald-50 border-emerald-300 text-emerald-800' },
                    { label: 'Tegalan', val: '212 ha', sub: 'Lahan kering produktif', color: 'bg-teal-50 border-teal-300 text-teal-800' },
                    { label: 'Pekarangan', val: '21 ha', sub: 'Lahan sekitar permukiman', color: 'bg-lime-50 border-lime-300 text-lime-800' },
                    { label: 'Lain-lain', val: '3,65 ha', sub: 'Penggunaan lainnya', color: 'bg-slate-50 border-slate-300 text-slate-700' },
                  ].map(item => (
                    <div key={item.label} className={`rounded-2xl border p-5 text-center space-y-1 ${item.color}`}>
                      <span className="text-2xl font-black block">{item.val}</span>
                      <span className="text-xs font-bold uppercase tracking-wide block">{item.label}</span>
                      <span className="text-[10px] opacity-70">{item.sub}</span>
                    </div>
                  ))}
                </div>
                {/* Bar chart lahan */}
                <div className="space-y-3">
                  <h4 className="font-bold text-slate-800 text-sm">Perbandingan Penggunaan Lahan</h4>
                  {[
                    { label: '🌾 Sawah', val: 192, max: 212, color: 'bg-emerald-600' },
                    { label: '🌱 Tegalan', val: 212, max: 212, color: 'bg-teal-500' },
                    { label: '🏡 Pekarangan', val: 21, max: 212, color: 'bg-lime-500' },
                    { label: '📦 Lain-lain', val: 3.65, max: 212, color: 'bg-slate-400' },
                  ].map(item => (
                    <div key={item.label} className="text-xs">
                      <div className="flex justify-between mb-1.5 font-medium">
                        <span>{item.label}</span>
                        <span className="font-bold">{item.val} ha</span>
                      </div>
                      <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                        <div className={`h-full ${item.color} rounded-full transition-all`} style={{width:`${(item.val/item.max)*100}%`}} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Peternakan */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="bg-gradient-to-r from-teal-900 to-emerald-900 px-8 py-5">
                <h2 className="text-lg font-black text-white">🐄 Potensi Peternakan</h2>
                <p className="text-xs text-emerald-200 mt-1">Data populasi ternak 2024 — Sumber: BPS</p>
              </div>
              <div className="p-8 space-y-6">
                <div>
                  <h4 className="font-bold text-slate-800 text-sm mb-4">Ternak Besar</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {[
                      { emoji: '🐄', label: 'Sapi', val: '43 ekor' },
                      { emoji: '🐃', label: 'Kerbau', val: '0 ekor' },
                      { emoji: '🐎', label: 'Kuda', val: '96 ekor' },
                      { emoji: '🐐', label: 'Kambing', val: '288 ekor' },
                    ].map(item => (
                      <div key={item.label} className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-center space-y-1">
                        <span className="text-3xl">{item.emoji}</span>
                        <p className="text-lg font-black text-emerald-800">{item.val}</p>
                        <p className="text-[10px] font-bold text-slate-600 uppercase">{item.label}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <p className="text-xs text-slate-400 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
                  ⚠️ Data unggas (ayam buras, itik) pada tabel BPS 2024 tercatat "–" untuk Desa Jombe, yang berarti tidak ada atau nol berdasarkan keterangan BPS.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ═══════════════════ TAB: FASILITAS ═══════════════════ */}
        {activeTab === 'fasilitas' && (
          <div className="space-y-8 animate-in fade-in duration-200">
            {/* Kesehatan */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="px-8 py-5 border-b border-slate-100">
                <h2 className="text-base font-black text-slate-900">🏥 Fasilitas Kesehatan 2024</h2>
              </div>
              <div className="p-8 space-y-5">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {[
                    { emoji: '🏥', label: 'Pustu', val: '1' },
                    { emoji: '👶', label: 'Posyandu', val: '5' },
                    { emoji: '👨‍⚕️', label: 'Paramedis', val: '3 perawat' },
                    { emoji: '👩‍⚕️', label: 'Bidan', val: '3' },
                  ].map(item => (
                    <div key={item.label} className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-center space-y-1">
                      <span className="text-2xl">{item.emoji}</span>
                      <p className="text-lg font-black text-emerald-800">{item.val}</p>
                      <p className="text-[10px] font-bold text-slate-600 uppercase">{item.label}</p>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-slate-400">Tidak tercatat: rumah sakit, puskesmas, poskesdes, apotek, dokter.</p>
              </div>
            </div>

            {/* Keagamaan + Olahraga */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100">
                  <h3 className="font-black text-slate-900 text-sm">🕌 Tempat Ibadah</h3>
                </div>
                <div className="divide-y divide-slate-100 text-xs">
                  {[
                    ['Masjid', '5'],
                    ['Mushola', '1'],
                    ['Gereja', '0'],
                    ['Pura', '0'],
                    ['Vihara', '0'],
                  ].map(([label, val]) => (
                    <div key={label} className="flex justify-between px-6 py-3">
                      <span className="text-slate-500">{label}</span>
                      <span className="font-bold text-slate-900">{val}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100">
                  <h3 className="font-black text-slate-900 text-sm">⚽ Fasilitas Olahraga</h3>
                </div>
                <div className="divide-y divide-slate-100 text-xs">
                  {[
                    ['Sepak Bola', '1'],
                    ['Bola Voli', '1'],
                    ['Bulu Tangkis', '1'],
                    ['Tenis Meja', '3'],
                    ['Lapangan Tenis', '0'],
                    ['Sepak Takraw', '4'],
                  ].map(([label, val]) => (
                    <div key={label} className="flex justify-between px-6 py-3">
                      <span className="text-slate-500">{label}</span>
                      <span className="font-bold text-slate-900">{val}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Infrastruktur Pemerintahan */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="px-8 py-5 border-b border-slate-100">
                <h2 className="text-base font-black text-slate-900">🏛️ Infrastruktur Pemerintahan</h2>
              </div>
              <div className="p-8">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {[
                    { emoji: '🏛️', label: 'Kantor Desa', val: '1' },
                    { emoji: '🏢', label: 'Balai Desa', val: '1' },
                    { emoji: '🏘️', label: 'RW', val: '10' },
                    { emoji: '🏠', label: 'Dusun', val: '5' },
                  ].map(item => (
                    <div key={item.label} className="bg-slate-50 border border-slate-200 rounded-2xl p-5 text-center space-y-1">
                      <span className="text-3xl">{item.emoji}</span>
                      <p className="text-2xl font-black text-emerald-800">{item.val}</p>
                      <p className="text-[10px] font-bold text-slate-600 uppercase">{item.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ═══════════════════ TAB: PETA ═══════════════════ */}
        {activeTab === 'peta' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-sm">
              <div className="w-full h-[520px] rounded-2xl overflow-hidden border border-slate-200">
                <iframe
                  title="Peta Desa Jombe"
                  src="https://maps.google.com/maps?q=Desa%20Jombe%2C%20Kecamatan%20Turatea%2C%20Kabupaten%20Jeneponto%2C%20Sulawesi%20Selatan&t=&z=14&ie=UTF8&iwloc=&output=embed"
                  width="100%" height="100%"
                  style={{border:0}} allowFullScreen loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8">
              <h3 className="font-black text-slate-900 text-sm mb-4 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-emerald-700" /> Posisi & Jarak Strategis
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                {[
                  { label: 'Ke Ibukota Kecamatan Turatea', val: '17 km', note: 'Jarak terjauh di kecamatan' },
                  { label: 'Ke Ibukota Kabupaten Jeneponto', val: '8,70 km', note: '' },
                  { label: 'Status Wilayah', val: 'Bukan Pantai', note: 'Wilayah daratan' },
                ].map(item => (
                  <div key={item.label} className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-1">
                    <span className="text-slate-500 block">{item.label}</span>
                    <span className="text-xl font-black text-emerald-800">{item.val}</span>
                    {item.note && <span className="text-[10px] text-amber-700 font-bold">{item.note}</span>}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* CTA */}
        <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-r from-emerald-900 via-teal-900 to-emerald-950 text-white shadow-xl flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="space-y-1 text-center md:text-left">
            <h3 className="text-xl font-black">Butuh Surat atau Dokumen Resmi?</h3>
            <p className="text-xs text-emerald-100/90">Ajukan permohonan surat secara online. Cukup masukkan NIK Anda.</p>
          </div>
          <div className="flex flex-wrap gap-3 shrink-0">
            <Link href="/layanan" className="px-6 py-3.5 bg-emerald-700 hover:bg-emerald-600 text-white font-bold rounded-2xl text-xs shadow transition-all flex items-center gap-2">
              <span>Pilih Jenis Surat</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/lacak" className="px-6 py-3.5 bg-white/10 hover:bg-white/20 text-white font-bold rounded-2xl text-xs transition-all border border-white/20">
              Lacak Status Berkas
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
