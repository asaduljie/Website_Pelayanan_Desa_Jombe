'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  MapPin,
  Users,
  Home,
  Compass,
  Award,
  Layers,
  CheckCircle2,
  Building,
  Sparkles,
  Shield,
  ArrowRight,
  Hash
} from 'lucide-react';

export default function ProfilDesaPage() {
  const [activeTab, setActiveTab] = useState<'aparat' | 'demografi' | 'peta'>('aparat');

  const aparatDesa = [
    {
      jabatan: 'Sekretaris Desa',
      nama: 'SYAMSUL RISWAN',
      avatarColor: 'from-emerald-800 to-slate-900',
      tugas: 'Mengkoordinasikan administrasi pemerintahan, keuangan, perumusan kebijakan desa, dan pengarsipan kepegawaian.',
    },
    {
      jabatan: 'Kasi Pemerintahan',
      nama: 'ZAINAL MUTTAQIN AHMAD',
      avatarColor: 'from-teal-800 to-slate-900',
      tugas: 'Mengelola tata kelola kependudukan, pertanahan, ketertiban umum, dan penyusunan profil wilayah desa.',
    },
    {
      jabatan: 'Kasi Pelayanan Umum',
      nama: 'SARDI',
      avatarColor: 'from-emerald-700 to-cyan-900',
      tugas: 'Melaksanakan pelayanan administrasi kependudukan dan penerbitan surat keterangan untuk masyarakat.',
    },
    {
      jabatan: 'Kasi Kesra',
      nama: 'SUKARDI',
      avatarColor: 'from-teal-700 to-emerald-900',
      tugas: 'Mengelola program kesejahteraan rakyat, kesehatan, bantuan sosial, dan pemberdayaan masyarakat desa.',
    },
    {
      jabatan: 'Kaur Perencanaan',
      nama: 'SYARIF AL-QADRI',
      avatarColor: 'from-slate-700 to-emerald-950',
      tugas: 'Menyusun RKPDes, RPJMDes, inventaris aset kekayaan desa, dan perencanaan pembangunan desa.',
    },
    {
      jabatan: 'Kaur Keuangan',
      nama: 'ARIANTO',
      avatarColor: 'from-emerald-800 to-slate-800',
      tugas: 'Menatausahakan APBDes, penerimaan pendapatan asli desa, transfer dana desa (ADD/DD), serta laporan keuangan.',
    },
    {
      jabatan: 'Kaur Administrasi dan T.U',
      nama: 'KASMAWATI',
      avatarColor: 'from-teal-800 to-slate-800',
      tugas: 'Mengelola administrasi umum perkantoran desa, tata usaha, dan pengarsipan surat masuk dan keluar.',
    },
    {
      jabatan: 'Kepala Dusun Jombe Utara',
      nama: 'MUHAJRIN JUMARANG',
      avatarColor: 'from-emerald-900 to-teal-800',
      tugas: 'Pembinaan ketertiban, pelayanan warga, dan penggerak gotong royong di wilayah Dusun Jombe Utara.',
    },
    {
      jabatan: 'Kepala Dusun Jombe Tengah',
      nama: 'BASO',
      avatarColor: 'from-slate-800 to-teal-900',
      tugas: 'Koordinator kewilayahan, penyalur aspirasi warga, dan penggerak swadaya Dusun Jombe Tengah.',
    },
    {
      jabatan: 'Kepala Dusun Jombe Selatan',
      nama: 'SAPARUDDIN',
      avatarColor: 'from-teal-800 to-emerald-900',
      tugas: 'Pembinaan ketertiban dan pelayanan warga masyarakat di wilayah Dusun Jombe Selatan.',
    },
    {
      jabatan: 'Kepala Dusun Tompo Balang',
      nama: 'NURLELA KAMARUDDIN',
      avatarColor: 'from-emerald-800 to-cyan-900',
      tugas: 'Koordinator pelayanan administrasi dan pembinaan kemasyarakatan di wilayah Dusun Tompo Balang.',
    },
    {
      jabatan: 'Kepala Dusun Muncu-muncu',
      nama: 'ICAL RAHMAN',
      avatarColor: 'from-indigo-900 to-slate-900',
      tugas: 'Koordinator pelayanan administrasi dan pembinaan kemasyarakatan di wilayah Dusun Muncu-muncu.',
    },
  ];

  const dusunList = [
    { no: '01', nama: 'Dusun Jombe Utara', kadus: 'MUHAJRIN JUMARANG', color: 'bg-emerald-100 text-emerald-900' },
    { no: '02', nama: 'Dusun Jombe Tengah', kadus: 'BASO', color: 'bg-teal-100 text-teal-900' },
    { no: '03', nama: 'Dusun Jombe Selatan', kadus: 'SAPARUDDIN', color: 'bg-emerald-100 text-emerald-900' },
    { no: '04', nama: 'Dusun Tompo Balang', kadus: 'NURLELA KAMARUDDIN', color: 'bg-teal-100 text-teal-900' },
    { no: '05', nama: 'Dusun Muncu-muncu', kadus: 'ICAL RAHMAN', color: 'bg-emerald-100 text-emerald-900' },
  ];

  return (
    <div className="min-h-screen py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-950 via-emerald-900 to-teal-950 text-white p-8 sm:p-12 shadow-xl border border-emerald-800/60">
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-800/60 border border-emerald-500/40 text-xs font-bold uppercase tracking-wider text-emerald-300">
            <Sparkles className="w-3.5 h-3.5" />
            Profil Resmi Pemerintahan Desa
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
            Desa Jombe
          </h1>
          <p className="text-sm sm:text-base text-emerald-100/90">
            Kecamatan Turatea, Kabupaten Jeneponto, Sulawesi Selatan
          </p>
          <div className="pt-2 flex flex-wrap items-center gap-4 text-xs font-medium text-emerald-200">
            <span className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-emerald-400" /> Kode Wilayah: 7304082009
            </span>
            <span className="flex items-center gap-1.5">
              <Shield className="w-4 h-4 text-emerald-400" /> Kepala Desa: <strong>JUSMAEDY, S.Pd</strong>
            </span>
            <span className="flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-emerald-400" /> 5 Dusun
            </span>
          </div>
        </div>
        <div className="absolute right-0 bottom-0 translate-x-10 translate-y-10 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none"></div>
      </div>

      {/* Statistik Resmi */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm text-center space-y-1">
          <span className="text-3xl font-black text-emerald-800">2.670</span>
          <span className="text-xs text-slate-500 font-bold block uppercase tracking-wide">Total Penduduk</span>
          <span className="text-[10px] text-slate-400">Kemendagri, Mei 2025</span>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm text-center space-y-1">
          <span className="text-3xl font-black text-teal-800">850</span>
          <span className="text-xs text-slate-500 font-bold block uppercase tracking-wide">Kepala Keluarga</span>
          <span className="text-[10px] text-slate-400">Kemendagri, Mei 2025</span>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm text-center space-y-1">
          <span className="text-3xl font-black text-emerald-800">5</span>
          <span className="text-xs text-slate-500 font-bold block uppercase tracking-wide">Dusun</span>
          <span className="text-[10px] text-slate-400">Wilayah Administrasi</span>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm text-center space-y-1">
          <span className="text-3xl font-black text-teal-800">46</span>
          <span className="text-xs text-slate-500 font-bold block uppercase tracking-wide">Kepadatan</span>
          <span className="text-[10px] text-slate-400">Jiwa/km², Kemendagri</span>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-3">
        <button
          onClick={() => setActiveTab('aparat')}
          className={`px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-extrabold transition-all flex items-center gap-2 ${
            activeTab === 'aparat'
              ? 'bg-emerald-800 text-white shadow-md'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Perangkat Desa</span>
        </button>

        <button
          onClick={() => setActiveTab('demografi')}
          className={`px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-extrabold transition-all flex items-center gap-2 ${
            activeTab === 'demografi'
              ? 'bg-emerald-800 text-white shadow-md'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Home className="w-4 h-4" />
          <span>Data Kependudukan</span>
        </button>

        <button
          onClick={() => setActiveTab('peta')}
          className={`px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-extrabold transition-all flex items-center gap-2 ${
            activeTab === 'peta'
              ? 'bg-emerald-800 text-white shadow-md'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <MapPin className="w-4 h-4" />
          <span>Peta Wilayah</span>
        </button>
      </div>

      {/* TAB: PERANGKAT DESA */}
      {activeTab === 'aparat' && (
        <div className="space-y-8 animate-in fade-in duration-200">
          {/* Kepala Desa Card */}
          <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-teal-950 text-white rounded-3xl p-8 sm:p-10 shadow-lg border border-emerald-700/60 flex flex-col md:flex-row items-center gap-8">
            <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-3xl bg-gradient-to-tr from-emerald-600 to-teal-400 p-1 shrink-0 shadow-xl">
              <div className="w-full h-full bg-slate-900 rounded-[22px] flex items-center justify-center text-3xl font-black text-emerald-200">
                JD
              </div>
            </div>
            <div className="space-y-2 text-center md:text-left">
              <span className="text-xs bg-emerald-700/70 text-emerald-200 font-bold uppercase px-3 py-1 rounded-full border border-emerald-500/40">
                Kepala Desa Jombe
              </span>
              <h3 className="text-2xl sm:text-3xl font-black tracking-tight">JUSMAEDY, S.Pd</h3>
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
                <div
                  key={idx}
                  className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3 hover:border-emerald-300 hover:shadow-md transition-all flex flex-col justify-between"
                >
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
                    <p className="text-xs text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                      {item.tugas}
                    </p>
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

      {/* TAB: DATA KEPENDUDUKAN */}
      {activeTab === 'demografi' && (
        <div className="space-y-8 animate-in fade-in duration-200">
          {/* Data Resmi Gender */}
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-5">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-4">
              <Hash className="w-5 h-5 text-emerald-800" />
              <h2 className="text-base font-black text-slate-900">Data Kependudukan Resmi</h2>
              <span className="ml-auto text-[10px] font-bold text-slate-400 bg-slate-100 px-2.5 py-1 rounded-full">Kemendagri · 08/05/2025</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
              <div className="space-y-3">
                <span className="font-bold text-slate-800 block">Komposisi Jenis Kelamin:</span>
                <div>
                  <div className="flex justify-between font-medium mb-1.5">
                    <span>Laki-Laki</span>
                    <span className="font-bold text-emerald-800">1.336 Jiwa</span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                    <div className="bg-emerald-700 h-full rounded-full" style={{ width: '50.04%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between font-medium mb-1.5">
                    <span>Perempuan</span>
                    <span className="font-bold text-teal-800">1.334 Jiwa</span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                    <div className="bg-teal-600 h-full rounded-full" style={{ width: '49.96%' }}></div>
                  </div>
                </div>
                <p className="text-[11px] text-slate-400 pt-1 font-mono">
                  Total: 2.670 jiwa · 850 KK · Kode PUM: 7304082009
                </p>
              </div>
              <div className="space-y-2">
                <span className="font-bold text-slate-800 block">Info Wilayah:</span>
                <table className="w-full text-xs">
                  <tbody className="divide-y divide-slate-100">
                    <tr><td className="py-2 text-slate-500">Provinsi</td><td className="py-2 font-bold text-right">Sulawesi Selatan</td></tr>
                    <tr><td className="py-2 text-slate-500">Kabupaten</td><td className="py-2 font-bold text-right">Kab. Jeneponto</td></tr>
                    <tr><td className="py-2 text-slate-500">Kecamatan</td><td className="py-2 font-bold text-right">Turatea</td></tr>
                    <tr><td className="py-2 text-slate-500">Status</td><td className="py-2 font-bold text-right">Desa</td></tr>
                    <tr><td className="py-2 text-slate-500">Kepadatan</td><td className="py-2 font-bold text-right">46 Jiwa/km²</td></tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Daftar Dusun */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-100 flex items-center gap-2">
              <Layers className="w-5 h-5 text-emerald-800" />
              <h2 className="text-base font-black text-slate-900">Pembagian Wilayah Dusun</h2>
            </div>
            <div className="divide-y divide-slate-100">
              {dusunList.map((d) => (
                <div key={d.no} className="flex items-center gap-4 px-6 py-4 hover:bg-slate-50 transition-colors">
                  <div className={`w-10 h-10 rounded-xl ${d.color} flex items-center justify-center font-black text-xs shrink-0`}>
                    {d.no}
                  </div>
                  <div className="flex-1">
                    <p className="font-extrabold text-slate-900 text-sm">{d.nama}</p>
                    <p className="text-xs text-slate-500">Kadus: <span className="font-bold text-slate-700">{d.kadus}</span></p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB: PETA WILAYAH */}
      {activeTab === 'peta' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="w-full h-96 sm:h-[520px] rounded-2xl overflow-hidden border border-slate-200">
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
        </div>
      )}

      {/* CTA */}
      <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-r from-emerald-900 via-teal-900 to-emerald-950 text-white shadow-xl flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="space-y-1 text-center md:text-left">
          <h3 className="text-xl font-black">Butuh Surat Keterangan atau Dokumen Resmi?</h3>
          <p className="text-xs text-emerald-100/90">Ajukan permohonan surat secara online. Cukup masukkan NIK Anda.</p>
        </div>
        <div className="flex flex-wrap gap-3 shrink-0">
          <Link href="/layanan" className="px-6 py-3.5 bg-emerald-700 hover:bg-emerald-600 text-white font-bold rounded-2xl text-xs shadow transition-all flex items-center gap-2">
            <span>Pilih Jenis Surat</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link href="/lacak" className="px-6 py-3.5 bg-white/10 hover:bg-white/20 text-white font-bold rounded-2xl text-xs backdrop-blur-sm transition-all border border-white/20">
            Lacak Status Berkas
          </Link>
        </div>
      </div>
    </div>
  );
}
