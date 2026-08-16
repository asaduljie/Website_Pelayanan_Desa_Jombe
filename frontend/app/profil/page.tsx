'use client';

import React, { useState, useEffect } from 'react';
import { Building2, Users, MapPin, Award, CheckCircle2, ShieldCheck, Compass, Target, Landmark } from 'lucide-react';
import api from '@/lib/api';

export default function ProfilDesaPage() {
  const [profileData, setProfileData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/content/profile').then((res) => {
      if (res.data.status === 'success') {
        setProfileData(res.data.data);
      }
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const p = profileData?.profile || {};
  const s = profileData?.stats || {};

  return (
    <div className="min-h-screen py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
      {/* Header Banner */}
      <div className="bg-gradient-to-br from-emerald-950 via-emerald-900 to-emerald-800 text-white rounded-3xl p-8 sm:p-12 shadow-lg border border-emerald-800/60">
        <div className="max-w-3xl space-y-3">
          <span className="text-xs text-emerald-300 font-bold uppercase tracking-widest block">Pemerintah Desa Jombe</span>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">Profil & Informasi Wilayah Desa</h1>
          <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed">
            Mengenal lebih dekat Desa Jombe, Kecamatan Jombang, Kabupaten Jombang — Menuju Tata Kelola Desa Mandiri, Akuntabel, dan Berkelanjutan Berbasis Pelayanan Digital.
          </p>
        </div>
      </div>

      {/* Vision & Mission */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-soft space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-800 flex items-center justify-center border border-emerald-100">
            <Target className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-extrabold text-slate-900">Visi Desa Jombe</h2>
          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line font-normal">
            {p.vision || 'Terwujudnya Desa Jombe yang Mandiri, Sejahtera, Transparan, dan Berkelanjutan berbasis Pelayanan Digital.'}
          </p>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-soft space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-800 flex items-center justify-center border border-teal-100">
            <Compass className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-extrabold text-slate-900">Misi Utama</h2>
          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line font-normal">
            {p.mission || '1. Meningkatkan kualitas pelayanan publik secara transparan & cepat.\n2. Mengembangkan sarana infrastruktur desa yang merata.\n3. Memajukan ekonomi masyarakat melalui UMKM digital desa.'}
          </p>
        </div>
      </div>

      {/* Demographics & Real Statistics */}
      <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-emerald-950 text-white rounded-3xl p-8 sm:p-12 shadow-xl space-y-8 border border-emerald-800">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <span className="text-xs text-emerald-300 font-bold uppercase tracking-widest">Demografi Kependudukan</span>
          <h2 className="text-2xl font-extrabold">Data Statistik Wilayah & Warga</h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
            <span className="text-2xl sm:text-3xl font-extrabold text-emerald-300 block">
              {s.totalPopulation ? s.totalPopulation.toLocaleString('id-ID') : '-'}
            </span>
            <span className="text-[11px] text-emerald-100/80 font-medium">Total Penduduk</span>
          </div>
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
            <span className="text-2xl sm:text-3xl font-extrabold text-emerald-300 block">
              {s.totalFamily ? s.totalFamily.toLocaleString('id-ID') : '-'}
            </span>
            <span className="text-[11px] text-emerald-100/80 font-medium">Kepala Keluarga (KK)</span>
          </div>
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
            <span className="text-2xl sm:text-3xl font-extrabold text-emerald-300 block">
              {s.totalDusun || '-'}
            </span>
            <span className="text-[11px] text-emerald-100/80 font-medium">Wilayah Dusun</span>
          </div>
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
            <span className="text-2xl sm:text-3xl font-extrabold text-emerald-300 block">
              {s.totalRt || '-'} RT / {s.totalRw || '-'} RW
            </span>
            <span className="text-[11px] text-emerald-100/80 font-medium">Rukun Tetangga & Warga</span>
          </div>
        </div>
      </div>
    </div>
  );
}
