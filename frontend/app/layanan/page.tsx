'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  FileText,
  Search,
  Store,
  Home as HomeIcon,
  HeartHandshake,
  ArrowRight,
  Clock,
  ShieldCheck,
  CheckCircle2,
  Landmark,
} from 'lucide-react';
import api from '@/lib/api';

export default function LayananPage() {
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    setLoading(true);
    try {
      const res = await api.get('/services');
      if (res.data.status === 'success') {
        setServices(res.data.data);
      }
    } catch (e) {
      console.error(e);
      setServices([
        {
          id: 's1',
          name: 'Surat Keterangan Usaha (SKU)',
          slug: 'surat-keterangan-usaha',
          category: 'Surat Keterangan',
          description: 'Pengantar resmi untuk izin dan legalitas usaha mikro serta UMKM warga Desa Jombe.',
          estimatedDays: 1,
          requirements: 'Kartu Tanda Penduduk (KTP), Kartu Keluarga (KK), Foto Lokasi Usaha',
        },
        {
          id: 's2',
          name: 'Surat Keterangan Domisili',
          slug: 'surat-keterangan-domisili',
          category: 'Surat Keterangan',
          description: 'Surat keterangan resmi status tempat tinggal warga di wilayah Desa Jombe.',
          estimatedDays: 1,
          requirements: 'Kartu Tanda Penduduk (KTP), Kartu Keluarga (KK)',
        },
        {
          id: 's3',
          name: 'Surat Keterangan Tidak Mampu (SKTM)',
          slug: 'surat-keterangan-tidak-mampu',
          category: 'Bantuan Sosial',
          description: 'Surat pengantar untuk keringanan biaya beasiswa, kesehatan, dan bantuan sosial.',
          estimatedDays: 1,
          requirements: 'KTP Orang Tua/Pemohon, Kartu Keluarga (KK), Pengantar RT/RW',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const filteredServices = services.filter((s) => {
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase()) || (s.description && s.description.toLowerCase().includes(search.toLowerCase()));
    const matchCat = categoryFilter === 'ALL' || s.category === categoryFilter;
    return matchSearch && matchCat;
  });

  return (
    <div className="min-h-screen py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
      {/* Header Banner */}
      <div className="bg-gradient-to-br from-emerald-950 via-emerald-900 to-emerald-800 text-white rounded-3xl p-8 sm:p-12 shadow-lg space-y-4 border border-emerald-800/60">
        <div className="max-w-3xl space-y-3">
          <span className="text-xs text-emerald-300 font-bold uppercase tracking-widest block">Katalog Pelayanan Publik</span>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">Pengajuan Dokumen Surat Online</h1>
          <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed">
            Pilih jenis dokumen yang Anda perlukan di bawah ini. Isi formulir digital dan pantau perkembangan penerbitan surat resmi Anda.
          </p>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-soft flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0">
          {['ALL', 'Surat Keterangan', 'Bantuan Sosial', 'Administrasi'].map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
                categoryFilter === cat
                  ? 'bg-emerald-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat === 'ALL' ? 'Semua Kategori' : cat}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari nama layanan surat..."
            className="w-full pl-9 pr-4 py-2.5 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-700 bg-slate-50 text-slate-900 font-medium"
          />
        </div>
      </div>

      {/* Services Grid Catalog */}
      {loading ? (
        <div className="text-center py-16 text-xs text-slate-500">Memuat katalog layanan...</div>
      ) : filteredServices.length === 0 ? (
        <div className="text-center py-16 text-xs text-slate-500">Layanan tidak ditemukan.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map((s) => (
            <div
              key={s.id}
              className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-soft hover:shadow-soft-hover transition-all flex flex-col justify-between space-y-6"
            >
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-800 flex items-center justify-center font-bold border border-emerald-100">
                    <FileText className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-bold uppercase px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                    ~{s.estimatedDays || 1} Hari Kerja
                  </span>
                </div>

                <div>
                  <h3 className="text-lg font-extrabold text-slate-900 leading-snug mb-1">{s.name}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{s.description}</p>
                </div>

                {s.requirements && (
                  <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-2xl text-[11px] text-slate-800 space-y-1">
                    <span className="font-bold block text-[10px] uppercase text-slate-600">Dokumen Persyaratan:</span>
                    <p className="leading-normal text-slate-600">{s.requirements}</p>
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-slate-100">
                <Link
                  href={`/layanan/${s.slug}`}
                  className="w-full py-3.5 px-4 bg-emerald-800 hover:bg-emerald-900 text-white font-extrabold text-xs rounded-2xl shadow-xs transition-all flex items-center justify-center gap-2 group"
                >
                  Ajukan Permohonan
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
