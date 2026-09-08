'use client';

import React, { useState } from 'react';
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
  CheckCircle2
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
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <div className="max-w-3xl space-y-5">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-800/60 border border-emerald-500/40 text-xs font-bold uppercase tracking-widest text-emerald-300">
              <Landmark className="w-3.5 h-3.5" />
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
                <ShieldCheck className="w-3.5 h-3.5" /> Kepala Desa: JUSMAEDY, S.Pd
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
      </div>

      {/* Quick Stats Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-20">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-4">
          {[
            { val: '2.581', label: 'Total Penduduk', sub: 'Jiwa (Data BPS)', color: 'text-emerald-800' },
            { val: '3,76', label: 'Luas Wilayah', sub: 'km² (7% Kec. Turatea)', color: 'text-teal-800' },
            { val: '5', label: 'Wilayah Dusun', sub: 'Dusun Resmi', color: 'text-emerald-800' },
            { val: '686,44', label: 'Kepadatan', sub: 'jiwa / km²', color: 'text-slate-800' },
          ].map((item, idx) => (
            <div key={idx} className="bg-white rounded-2xl p-5 border border-slate-200 shadow-soft text-center space-y-1">
              <span className={`text-2xl sm:text-3xl font-black block tracking-tight ${item.color}`}>{item.val}</span>
              <span className="text-xs font-bold text-slate-800 block">{item.label}</span>
              <span className="text-[10px] text-slate-400 block">{item.sub}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Navigation Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2 border-b border-slate-200">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-2 whitespace-nowrap transition-all cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-emerald-800 text-white shadow-sm'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* ═══════════════════ TAB: TENTANG ═══════════════════ */}
        {activeTab === 'tentang' && (
          <div className="space-y-8 animate-in fade-in duration-200">
            {/* Visi & Misi */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-soft space-y-4">
                <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs uppercase tracking-wider">
                  <Star className="w-4 h-4" /> Visi Desa Jombe
                </div>
                <h3 className="text-xl font-extrabold text-slate-900 leading-snug">
                  &ldquo;Terwujudnya Desa Jombe yang Mandiri, Sejahtera, Transparan, dan Berkelanjutan Berbasis Pelayanan Digital.&rdquo;
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Menjadikan desa yang berdaya saing dengan penguatan ekonomi kerakyatan, transparansi anggaran, serta optimalisasi pelayanan birokrasi yang dekat dengan warga.
                </p>
              </div>

              <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-soft space-y-4">
                <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs uppercase tracking-wider">
                  <CheckCircle2 className="w-4 h-4" /> Misi Pembangunan Desa
                </div>
                <ul className="space-y-2.5 text-xs text-slate-700">
                  <li className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-lg bg-emerald-100 text-emerald-900 flex items-center justify-center font-bold shrink-0 text-[10px]">1</span>
                    <span>Meningkatkan kualitas pelayanan publik secara cepat, transparan, dan terdigitalisasi.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-lg bg-emerald-100 text-emerald-900 flex items-center justify-center font-bold shrink-0 text-[10px]">2</span>
                    <span>Mengembangkan sarana dan prasarana infrastruktur desa yang merata di 5 wilayah dusun.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-lg bg-emerald-100 text-emerald-900 flex items-center justify-center font-bold shrink-0 text-[10px]">3</span>
                    <span>Memajukan potensi pertanian, peternakan, dan UMKM warga masyarakat Desa Jombe.</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Geografis & Kewilayahan */}
            <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-soft space-y-6">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Compass className="w-5 h-5 text-emerald-800" />
                Kondisi Geografis & Batas Wilayah
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                  <span className="text-slate-400 font-bold block text-[10px] uppercase">Sebelah Utara</span>
                  <span className="font-bold text-slate-900">Desa Turatea Timur</span>
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                  <span className="text-slate-400 font-bold block text-[10px] uppercase">Sebelah Selatan</span>
                  <span className="font-bold text-slate-900">Kecamatan Binamu</span>
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                  <span className="text-slate-400 font-bold block text-[10px] uppercase">Sebelah Timur</span>
                  <span className="font-bold text-slate-900">Desa Mangepong</span>
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                  <span className="text-slate-400 font-bold block text-[10px] uppercase">Sebelah Barat</span>
                  <span className="font-bold text-slate-900">Desa Kayuloe Barat</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ═══════════════════ TAB: STATISTIK ═══════════════════ */}
        {activeTab === 'statistik' && (
          <div className="space-y-8 animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl border border-slate-200 shadow-soft overflow-hidden">
              <div className="px-8 py-5 border-b border-slate-100">
                <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
                  <Users className="w-5 h-5 text-emerald-700" /> Demografi Penduduk
                </h2>
              </div>
              <div className="p-8 space-y-6">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                  {[
                    { label: 'Total Penduduk', val: '2.581', sub: 'Jiwa', color: 'bg-emerald-50 border-emerald-200 text-emerald-900' },
                    { label: 'Laki-Laki', val: '1.269', sub: 'Jiwa (49,17%)', color: 'bg-sky-50 border-sky-200 text-sky-900' },
                    { label: 'Perempuan', val: '1.312', sub: 'Jiwa (50,83%)', color: 'bg-teal-50 border-teal-200 text-teal-900' },
                    { label: 'Kepadatan', val: '686,44', sub: 'Jiwa / km²', color: 'bg-slate-50 border-slate-200 text-slate-900' },
                  ].map((s, idx) => (
                    <div key={idx} className={`p-4 rounded-2xl border ${s.color}`}>
                      <span className="text-2xl font-black block tracking-tight">{s.val}</span>
                      <span className="text-xs font-bold block mt-0.5">{s.label}</span>
                      <span className="text-[10px] opacity-70 block">{s.sub}</span>
                    </div>
                  ))}
                </div>

                {/* Gender bar */}
                <div className="space-y-3 pt-4 border-t border-slate-100">
                  <h4 className="font-bold text-slate-800 text-sm">Komposisi Jenis Kelamin</h4>
                  <div className="space-y-2 text-xs">
                    <div>
                      <div className="flex justify-between mb-1.5 font-medium">
                        <span className="font-bold text-slate-700">Laki-laki</span>
                        <span className="font-bold text-sky-800">1.269 jiwa (49,17%)</span>
                      </div>
                      <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-sky-700 rounded-full" style={{ width: '49.17%' }} />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-1.5 font-medium">
                        <span className="font-bold text-slate-700">Perempuan</span>
                        <span className="font-bold text-teal-800">1.312 jiwa (50,83%)</span>
                      </div>
                      <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-teal-600 rounded-full" style={{ width: '50.83%' }} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Mata Pencaharian */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-soft overflow-hidden">
              <div className="px-8 py-5 border-b border-slate-100">
                <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
                  <Wheat className="w-5 h-5 text-emerald-700" /> Sektor Pekerjaan & Mata Pencaharian Warga
                </h2>
              </div>
              <div className="p-8 space-y-4">
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Mayoritas masyarakat Desa Jombe memiliki aktivitas ekonomi yang bertumpu pada sektor <strong>pertanian pangan</strong> dan <strong>peternakan</strong>.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {[
                    { icon: <Wheat className="w-6 h-6 text-emerald-700" />, label: 'Petani & Perkebunan', val: '479 orang', color: 'bg-emerald-50 border-emerald-200' },
                    { icon: <TreePine className="w-6 h-6 text-teal-700" />, label: 'Sektor Peternakan', val: '215 orang', color: 'bg-teal-50 border-teal-200' },
                    { icon: <Briefcase className="w-6 h-6 text-slate-700" />, label: 'PNS / TNI / POLRI & Lainnya', val: '72 orang', color: 'bg-slate-50 border-slate-200' },
                  ].map((item, idx) => (
                    <div key={idx} className={`${item.color} border rounded-2xl p-6 text-center space-y-2`}>
                      <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center mx-auto shadow-2xs border border-slate-100">
                        {item.icon}
                      </div>
                      <p className="text-2xl font-black text-slate-900">{item.val}</p>
                      <p className="text-xs text-slate-600 font-bold">{item.label}</p>
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
            {/* Kepala Desa Banner */}
            <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-teal-950 text-white rounded-3xl p-8 sm:p-10 shadow-lg border border-emerald-700/60 flex flex-col md:flex-row items-center gap-8">
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-emerald-800 border-2 border-emerald-500/60 flex items-center justify-center text-3xl font-black text-emerald-100 shadow-xl shrink-0">
                JD
              </div>
              <div className="space-y-2 text-center md:text-left">
                <span className="text-xs bg-emerald-800/80 text-emerald-200 font-bold uppercase px-3 py-1 rounded-full border border-emerald-600/50">
                  Kepala Desa Jombe
                </span>
                <h3 className="text-2xl sm:text-3xl font-black tracking-tight">JUSMAEDY, S.Pd</h3>
                <p className="text-xs text-emerald-200/90 leading-relaxed max-w-xl">
                  Memimpin tata kelola pemerintahan, pembangunan desa, pembinaan kemasyarakatan, dan pemberdayaan masyarakat Desa Jombe.
                </p>
              </div>
            </div>

            {/* Perangkat Desa Grid */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-soft">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-4 mb-6">
                <Users className="w-5 h-5 text-emerald-800" />
                <h2 className="text-base font-black text-slate-900">Perangkat & Aparatur Desa Jombe</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {aparatDesa.map((item, idx) => (
                  <div key={idx} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-3 hover:border-emerald-300 hover:shadow-soft transition-all flex flex-col justify-between">
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
                      <span className="text-[10px] bg-emerald-50 text-emerald-800 font-bold px-2.5 py-0.5 rounded-full border border-emerald-200">Aktif</span>
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
            <div className="bg-white rounded-3xl border border-slate-200 shadow-soft overflow-hidden">
              <div className="bg-gradient-to-r from-emerald-900 to-teal-900 px-8 py-5 text-white">
                <div className="flex items-center gap-2">
                  <Wheat className="w-5 h-5 text-emerald-300" />
                  <h2 className="text-lg font-black">Potensi Lahan Pertanian</h2>
                </div>
                <p className="text-xs text-emerald-200 mt-0.5">Data tata guna lahan produktif Desa Jombe</p>
              </div>
              <div className="p-8 space-y-6">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {[
                    { label: 'Sawah Teknis & Tadah Hujan', val: '192 ha', color: 'bg-emerald-50 border-emerald-200 text-emerald-900' },
                    { label: 'Tegalan / Lahan Kering', val: '212 ha', color: 'bg-teal-50 border-teal-200 text-teal-900' },
                    { label: 'Pekarangan & Permukiman', val: '21 ha', color: 'bg-lime-50 border-lime-200 text-lime-900' },
                    { label: 'Penggunaan Lainnya', val: '3,65 ha', color: 'bg-slate-50 border-slate-200 text-slate-800' },
                  ].map((item, idx) => (
                    <div key={idx} className={`rounded-2xl border p-5 text-center space-y-1 ${item.color}`}>
                      <span className="text-2xl font-black block">{item.val}</span>
                      <span className="text-xs font-bold uppercase tracking-wide block">{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Peternakan */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-soft overflow-hidden">
              <div className="bg-gradient-to-r from-teal-900 to-emerald-900 px-8 py-5 text-white">
                <div className="flex items-center gap-2">
                  <TreePine className="w-5 h-5 text-teal-300" />
                  <h2 className="text-lg font-black">Potensi Peternakan</h2>
                </div>
                <p className="text-xs text-teal-200 mt-0.5">Populasi hewan ternak masyarakat</p>
              </div>
              <div className="p-8 space-y-6">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {[
                    { label: 'Sapi', val: '43 ekor' },
                    { label: 'Kerbau', val: '0 ekor' },
                    { label: 'Kuda', val: '96 ekor' },
                    { label: 'Kambing', val: '288 ekor' },
                  ].map((item, idx) => (
                    <div key={idx} className="bg-slate-50 border border-slate-200 rounded-2xl p-5 text-center space-y-1">
                      <p className="text-2xl font-black text-emerald-800">{item.val}</p>
                      <p className="text-xs font-bold text-slate-700 uppercase">{item.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ═══════════════════ TAB: FASILITAS ═══════════════════ */}
        {activeTab === 'fasilitas' && (
          <div className="space-y-8 animate-in fade-in duration-200">
            {/* Fasilitas Kesehatan */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-soft overflow-hidden">
              <div className="px-8 py-5 border-b border-slate-100 flex items-center gap-2">
                <Stethoscope className="w-5 h-5 text-emerald-800" />
                <h2 className="text-base font-black text-slate-900">Fasilitas & Tenaga Kesehatan</h2>
              </div>
              <div className="p-8 space-y-5">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {[
                    { label: 'Pustu (Puskesmas Pembantu)', val: '1 Unit' },
                    { label: 'Posyandu di 5 Dusun', val: '5 Unit' },
                    { label: 'Tenaga Paramedis / Perawat', val: '3 Orang' },
                    { label: 'Bidan Desa', val: '3 Orang' },
                  ].map((item, idx) => (
                    <div key={idx} className="bg-slate-50 border border-slate-200 rounded-2xl p-5 text-center space-y-1">
                      <p className="text-xl font-black text-emerald-800">{item.val}</p>
                      <p className="text-xs font-bold text-slate-700">{item.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Tempat Ibadah & Olahraga */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-3xl border border-slate-200 shadow-soft overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-2">
                  <Landmark className="w-4 h-4 text-emerald-800" />
                  <h3 className="font-black text-slate-900 text-sm">Tempat Ibadah</h3>
                </div>
                <div className="divide-y divide-slate-100 text-xs">
                  {[
                    ['Masjid', '5 Unit'],
                    ['Mushola', '1 Unit'],
                    ['Gereja / Tempat Ibadah Lain', '0 Unit'],
                  ].map(([label, val], idx) => (
                    <div key={idx} className="flex justify-between px-6 py-3.5">
                      <span className="text-slate-600 font-medium">{label}</span>
                      <span className="font-bold text-slate-900">{val}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-3xl border border-slate-200 shadow-soft overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-2">
                  <Activity className="w-4 h-4 text-emerald-800" />
                  <h3 className="font-black text-slate-900 text-sm">Fasilitas Olahraga & Kepemudaan</h3>
                </div>
                <div className="divide-y divide-slate-100 text-xs">
                  {[
                    ['Lapangan Sepak Bola', '1 Lokasi'],
                    ['Lapangan Bola Voli', '1 Lokasi'],
                    ['Lapangan Sepak Takraw', '4 Lokasi'],
                    ['Fasilitas Bulu Tangkis / Tenis Meja', '4 Lokasi'],
                  ].map(([label, val], idx) => (
                    <div key={idx} className="flex justify-between px-6 py-3.5">
                      <span className="text-slate-600 font-medium">{label}</span>
                      <span className="font-bold text-slate-900">{val}</span>
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
            <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-soft">
              <div className="w-full h-[500px] rounded-2xl overflow-hidden border border-slate-200">
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
            <div className="bg-white rounded-3xl border border-slate-200 shadow-soft p-8">
              <h3 className="font-black text-slate-900 text-sm mb-4 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-emerald-700" /> Posisi & Aksesibilitas
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                {[
                  { label: 'Jarak ke Ibukota Kecamatan Turatea', val: '17 km', note: 'Jarak terjauh di kecamatan' },
                  { label: 'Jarak ke Ibukota Kabupaten Jeneponto', val: '8,70 km', note: 'Akses jalan poros utama' },
                  { label: 'Status Wilayah', val: 'Bukan Pantai', note: 'Wilayah daratan / agraris' },
                ].map((item, idx) => (
                  <div key={idx} className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-1">
                    <span className="text-slate-500 block">{item.label}</span>
                    <span className="text-xl font-black text-emerald-800">{item.val}</span>
                    {item.note && <span className="text-[10px] text-amber-800 font-semibold block">{item.note}</span>}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* CTA */}
        <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-r from-emerald-950 via-emerald-900 to-teal-950 text-white shadow-xl flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="space-y-1 text-center md:text-left">
            <h3 className="text-xl font-black">Butuh Surat atau Layanan Administrasi Desa?</h3>
            <p className="text-xs text-emerald-200/90">Ajukan permohonan surat secara mandiri dan lacak status secara real-time.</p>
          </div>
          <div className="flex flex-wrap gap-3 shrink-0">
            <Link
              href="/layanan"
              className="px-6 py-3.5 bg-emerald-700 hover:bg-emerald-600 text-white font-bold rounded-2xl text-xs shadow-md transition-all flex items-center gap-2"
            >
              <span>Ajukan Permohonan Surat</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/lacak"
              className="px-6 py-3.5 bg-white/10 hover:bg-white/20 text-white font-bold rounded-2xl text-xs transition-all border border-white/20"
            >
              Lacak Status Berkas
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
