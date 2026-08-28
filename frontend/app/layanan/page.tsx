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
          id: 's-sktm',
          name: 'Surat Keterangan Kurang Mampu (SKTM)',
          slug: 'surat-keterangan-tidak-mampu',
          category: 'Bantuan Sosial',
          description: 'Surat keterangan resmi keluarga berpenghasilan rendah / kurang mampu untuk keperluan DTKS, beasiswa, dan bantuan sosial.',
          estimatedDays: 1,
          requirements: 'e-KTP Pemohon, Kartu Keluarga (KK), Keterangan Tujuan / Keperluan',
        },
        {
          id: 's-wali',
          name: 'Surat Keterangan Wali',
          slug: 'surat-keterangan-wali',
          category: 'Administrasi',
          description: 'Surat keterangan pengakuan hak perwalian anak/siswa/mahasiswa untuk kelengkapan administrasi pendidikan atau instansi.',
          estimatedDays: 1,
          requirements: 'e-KTP Wali, Kartu Keluarga (KK), NISN / Data Anak',
        },
        {
          id: 's-kendaraan',
          name: 'Surat Keterangan Kepemilikan Kendaraan Bermotor',
          slug: 'surat-keterangan-kepemilikan-kendaraan-bermotor',
          category: 'Surat Keterangan',
          description: 'Surat keterangan resmi kepemilikan sah sepeda motor/mobil dan legalitas kendaraan belum balik nama.',
          estimatedDays: 1,
          requirements: 'e-KTP Pemilik, STNK/BPKB, Foto Kendaraan (No. Polisi, No. Rangka, No. Mesin)',
        },
        {
          id: 's-sku',
          name: 'Surat Keterangan Usaha (SKU)',
          slug: 'surat-keterangan-usaha',
          category: 'Surat Keterangan',
          description: 'Pengantar resmi untuk izin legalitas dan bantuan modal usaha mikro serta UMKM warga Desa Jombe.',
          estimatedDays: 1,
          requirements: 'e-KTP Pemilik Usaha, Kartu Keluarga (KK), Foto Usaha/Toko',
        },
        {
          id: 's-domisili',
          name: 'Surat Keterangan Domisili',
          slug: 'surat-keterangan-domisili',
          category: 'Surat Keterangan',
          description: 'Surat keterangan resmi tempat tinggal dan domisili warga di wilayah dusun Desa Jombe.',
          estimatedDays: 1,
          requirements: 'e-KTP Pemohon, Kartu Keluarga (KK)',
        },
        {
          id: 's-skkb',
          name: 'Surat Keterangan Kelakuan Baik (SKKB)',
          slug: 'surat-keterangan-kelakuan-baik',
          category: 'Surat Keterangan',
          description: 'Surat pengantar berkelakuan baik dari pemerintah desa untuk persyaratan kerja, lamaran, atau SKCK.',
          estimatedDays: 1,
          requirements: 'e-KTP Pemohon, Kartu Keluarga (KK), Pas Foto',
        },
        {
          id: 's-belum-menikah',
          name: 'Surat Keterangan Belum Menikah',
          slug: 'surat-keterangan-belum-menikah',
          category: 'Administrasi',
          description: 'Surat keterangan resmi status belum pernah menikah/lajang untuk persyaratan kerja atau pernikahan.',
          estimatedDays: 1,
          requirements: 'e-KTP Pemohon, Kartu Keluarga (KK)',
        },
        {
          id: 's-kematian',
          name: 'Surat Keterangan Kematian',
          slug: 'surat-keterangan-kematian',
          category: 'Administrasi',
          description: 'Penerbitan surat keterangan meninggal dunia untuk pengurusan ahli waris, akta kematian, atau perbankan.',
          estimatedDays: 1,
          requirements: 'e-KTP Pelapor, KK Almarhum, Keterangan Tanggal & Tempat Meninggal',
        },
        {
          id: 's-umum',
          name: 'Surat Keterangan Umum / Lainnya',
          slug: 'surat-keterangan-umum',
          category: 'Surat Keterangan',
          description: 'Surat keterangan resmi pemerintah desa untuk keperluan administrasi lainnya.',
          estimatedDays: 1,
          requirements: 'e-KTP Pemohon, Kartu Keluarga (KK), Detail Keterangan Permohonan',
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
