'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Calendar, User, Eye, Newspaper, AlertCircle } from 'lucide-react';
import api from '@/lib/api';

export default function BeritaDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const [article, setArticle] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDetail();
  }, [slug]);

  const fetchDetail = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/content/news/${slug}`);
      if (res.data.status === 'success') {
        setArticle(res.data.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="min-h-screen py-20 text-center text-xs text-gray-500">Memuat artikel berita...</div>;

  if (!article) {
    return (
      <div className="min-h-screen py-20 max-w-lg mx-auto text-center px-4">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />
        <h2 className="text-base font-bold text-gray-900">Berita Tidak Ditemukan</h2>
        <button onClick={() => router.push('/berita')} className="mt-4 px-4 py-2 bg-jombe-800 text-white rounded-xl text-xs font-bold">
          Kembali ke Daftar Berita
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Back Button */}
      <button
        onClick={() => router.back()}
        className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-600 hover:text-jombe-800 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Kembali ke Berita
      </button>

      {/* Article Header Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-gray-100 shadow-soft space-y-6">
        <div className="space-y-3">
          <span className="text-xs font-bold uppercase px-3 py-1 rounded-full bg-jombe-50 text-jombe-800 border border-jombe-200">
            {article.category}
          </span>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-gray-900 tracking-tight leading-tight">
            {article.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500 pt-2 border-t border-gray-100">
            <span className="flex items-center gap-1.5 font-medium">
              <Calendar className="w-4 h-4 text-jombe-700" />
              {new Date(article.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
            </span>
            <span className="flex items-center gap-1.5 font-medium">
              <User className="w-4 h-4 text-jombe-700" />
              {article.author?.name || 'Humas Desa Jombe'}
            </span>
            <span className="flex items-center gap-1.5 font-medium">
              <Eye className="w-4 h-4 text-jombe-700" />
              {article.views || 0} Dilihat
            </span>
          </div>
        </div>

        {/* Article Body */}
        <div className="prose max-w-none text-xs sm:text-sm text-gray-800 leading-relaxed space-y-4 pt-4 border-t border-gray-100 whitespace-pre-line">
          {article.content}
        </div>
      </div>
    </div>
  );
}
