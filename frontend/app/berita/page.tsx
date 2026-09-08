'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Newspaper, Search, ArrowRight, Calendar, User, Eye, Landmark } from 'lucide-react';
import api from '@/lib/api';

export default function BeritaPage() {
  const [news, setNews] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNews();
  }, [search, category]);

  const fetchNews = async () => {
    setLoading(true);
    try {
      let url = '/content/news?';
      if (search) url += `search=${encodeURIComponent(search)}&`;
      if (category) url += `category=${encodeURIComponent(category)}&`;

      const res = await api.get(url);
      if (res.data.status === 'success') {
        setNews(res.data.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    'Semua',
    'Pemerintahan',
    'Pembangunan',
    'Pertanian & Ketahanan Pangan',
    'UMKM & Ekonomi',
    'Sosial & Budaya',
    'Kesehatan',
    'Kegiatan Warga',
  ];

  return (
    <div className="min-h-screen py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-emerald-950 text-white rounded-3xl p-8 sm:p-12 shadow-lg border border-emerald-800">
        <div className="flex items-center gap-2 mb-2 text-xs font-bold uppercase tracking-widest text-emerald-300">
          <Landmark className="w-4 h-4" /> Publikasi Resmi Desa Jombe
        </div>
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight">Kabar & Berita Desa</h1>
        <p className="text-xs sm:text-sm text-emerald-100/90 mt-2 max-w-2xl leading-relaxed">
          Informasi resmi mengenai program pembangunan, ketahanan pangan, pelayanan publik, dan kabar kegiatan masyarakat di wilayah Desa Jombe.
        </p>
      </div>

      {/* Filter & Search Box */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 sm:p-5 rounded-3xl border border-slate-200 shadow-soft">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari berita berdasarkan judul atau topik..."
            className="w-full pl-10 pr-4 py-2.5 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-700 bg-slate-50 text-slate-900 font-medium"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {categories.map((cat) => {
            const isSelected = (cat === 'Semua' && category === '') || category === cat;
            return (
              <button
                key={cat}
                onClick={() => setCategory(cat === 'Semua' ? '' : cat)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold shrink-0 transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-emerald-800 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* News Grid */}
      {loading ? (
        <div className="py-20 text-center text-xs text-slate-500">Memuat kabar berita...</div>
      ) : news.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {news.map((item) => {
            const thumbnail = item.imageUrl || item.thumbnail;
            return (
              <Link
                key={item.id}
                href={`/berita/${item.slug}`}
                className="bg-white rounded-3xl border border-slate-200 shadow-soft hover:shadow-soft-hover hover:border-emerald-300 transition-all overflow-hidden flex flex-col justify-between group"
              >
                <div>
                  {thumbnail ? (
                    <div className="h-48 overflow-hidden bg-slate-100 border-b border-slate-100">
                      <img
                        src={thumbnail}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = 'none';
                        }}
                      />
                    </div>
                  ) : (
                    <div className="h-3 bg-gradient-to-r from-emerald-800 to-teal-700" />
                  )}

                  <div className="p-6 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-900 border border-emerald-200">
                        {item.category}
                      </span>
                      <span className="text-[10px] text-slate-400 flex items-center gap-1">
                        <Eye className="w-3 h-3" /> {item.views || 1} Dilihat
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-slate-900 group-hover:text-emerald-900 transition-colors leading-snug">
                      {item.title}
                    </h3>
                    <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                      {item.excerpt || item.content}
                    </p>
                  </div>
                </div>

                <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-emerald-800">
                  <span className="text-[11px] text-slate-500 font-normal">
                    {new Date(item.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </span>
                  <span className="flex items-center gap-1 group-hover:translate-x-1 transition-transform font-bold">
                    Baca Berita <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      ) : (
        <div className="py-20 text-center bg-white rounded-3xl border border-slate-200 text-xs text-slate-500 space-y-2">
          <Newspaper className="w-10 h-10 text-slate-300 mx-auto" />
          <p className="font-bold">Belum ada berita dipublikasikan pada kategori ini.</p>
        </div>
      )}
    </div>
  );
}
