'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Newspaper, Search, ArrowRight, Calendar, User, Eye } from 'lucide-react';
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

  return (
    <div className="min-h-screen py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-jombe-900 via-jombe-800 to-jombe-700 text-white rounded-3xl p-8 sm:p-12 shadow-lg">
        <span className="text-xs text-emerald-300 font-bold uppercase tracking-widest block mb-1">Kabar & Publikasi</span>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Berita & Kegiatan Desa Jombe</h1>
        <p className="text-xs sm:text-sm text-gray-200 mt-2 max-w-2xl">
          Informasi terkini mengenai kegiatan pembangunan, pelayanan publik, sosial kemasyarakatan, dan kabar Desa Jombe.
        </p>
      </div>

      {/* Filter & Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-gray-100 shadow-soft">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari kata kunci berita..."
            className="w-full pl-10 pr-4 py-2.5 text-xs border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-jombe-600 bg-gray-50/50"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
          <button
            onClick={() => setCategory('')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold shrink-0 ${category === '' ? 'bg-jombe-800 text-white' : 'bg-gray-100 text-gray-700'}`}
          >
            Semua
          </button>
          <button
            onClick={() => setCategory('Pelayanan Publik')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold shrink-0 ${category === 'Pelayanan Publik' ? 'bg-jombe-800 text-white' : 'bg-gray-100 text-gray-700'}`}
          >
            Pelayanan Publik
          </button>
          <button
            onClick={() => setCategory('Pembangunan')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold shrink-0 ${category === 'Pembangunan' ? 'bg-jombe-800 text-white' : 'bg-gray-100 text-gray-700'}`}
          >
            Pembangunan
          </button>
          <button
            onClick={() => setCategory('Kegiatan Warga')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold shrink-0 ${category === 'Kegiatan Warga' ? 'bg-jombe-800 text-white' : 'bg-gray-100 text-gray-700'}`}
          >
            Kegiatan Warga
          </button>
        </div>
      </div>

      {/* News Grid */}
      {loading ? (
        <div className="py-20 text-center text-xs text-gray-500">Memuat berita...</div>
      ) : news.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {news.map((item) => (
            <Link
              key={item.id}
              href={`/berita/${item.slug}`}
              className="bg-white rounded-2xl border border-gray-100 shadow-soft hover:shadow-soft-hover transition-all overflow-hidden flex flex-col justify-between group"
            >
              <div className="p-6 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full bg-jombe-50 text-jombe-800 border border-jombe-200">
                    {item.category}
                  </span>
                  <span className="text-[10px] text-gray-400 flex items-center gap-1">
                    <Eye className="w-3 h-3" /> {item.views || 0} Dilihat
                  </span>
                </div>

                <h3 className="text-base font-bold text-gray-900 group-hover:text-jombe-800 transition-colors leading-snug">
                  {item.title}
                </h3>
                <p className="text-xs text-gray-600 line-clamp-3 leading-relaxed">
                  {item.excerpt || item.content}
                </p>
              </div>

              <div className="px-6 py-3.5 bg-gray-50/50 border-t border-gray-100 flex items-center justify-between text-xs font-semibold text-jombe-800">
                <span className="text-[11px] text-gray-500 font-normal">
                  {new Date(item.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                </span>
                <span className="flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  Baca Selengkapnya <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="py-20 text-center bg-white rounded-3xl border border-gray-100 text-xs text-gray-500 space-y-2">
          <Newspaper className="w-10 h-10 text-gray-300 mx-auto" />
          <p>Belum ada berita dipublikasikan.</p>
        </div>
      )}
    </div>
  );
}
