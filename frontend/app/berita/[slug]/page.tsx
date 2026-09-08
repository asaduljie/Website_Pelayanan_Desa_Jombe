'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Calendar,
  User,
  Eye,
  Newspaper,
  AlertCircle,
  Share2,
  Tag,
  Check
} from 'lucide-react';
import api from '@/lib/api';
import { renderRichArticle } from '@/lib/formatMarkdown';

export default function BeritaDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const [article, setArticle] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

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

  const handleCopyLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loading) return <div className="min-h-screen py-20 text-center text-xs text-slate-500">Memuat artikel berita...</div>;

  if (!article) {
    return (
      <div className="min-h-screen py-20 max-w-lg mx-auto text-center px-4 space-y-4">
        <AlertCircle className="w-12 h-12 text-rose-500 mx-auto" />
        <h2 className="text-base font-bold text-slate-900">Berita Tidak Ditemukan</h2>
        <p className="text-xs text-slate-500">Artikel yang Anda cari mungkin telah dihapus atau tautan tidak valid.</p>
        <button
          onClick={() => router.push('/berita')}
          className="px-5 py-2.5 bg-emerald-800 text-white rounded-xl text-xs font-bold hover:bg-emerald-900 transition-colors cursor-pointer"
        >
          Kembali ke Kabar & Berita Desa
        </button>
      </div>
    );
  }

  const imageUrl = article.imageUrl || article.thumbnail;

  return (
    <div className="min-h-screen py-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
      {/* Back Button */}
      <div className="flex justify-between items-center">
        <button
          onClick={() => router.push('/berita')}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-emerald-900 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" /> Kembali ke Daftar Berita
        </button>

        <button
          onClick={handleCopyLink}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-emerald-900 bg-white border border-slate-200 px-3 py-1.5 rounded-xl shadow-2xs hover:bg-slate-50 transition-all cursor-pointer"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-600" />
              <span className="text-emerald-700">Tautan Disalin</span>
            </>
          ) : (
            <>
              <Share2 className="w-3.5 h-3.5" />
              <span>Bagikan Berita</span>
            </>
          )}
        </button>
      </div>

      {/* Article Container Card */}
      <article className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-soft space-y-6 overflow-hidden">
        {/* Header Metadata */}
        <div className="space-y-3.5">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300">
              {article.category || 'Publikasi Resmi'}
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight leading-snug">
            {article.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-2 border-t border-slate-100">
            <span className="flex items-center gap-1.5 font-medium">
              <Calendar className="w-4 h-4 text-emerald-800" />
              {new Date(article.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
            </span>
            <span className="flex items-center gap-1.5 font-medium">
              <User className="w-4 h-4 text-emerald-800" />
              {article.author?.name || 'Humas Pemdes Jombe'}
            </span>
            <span className="flex items-center gap-1.5 font-medium">
              <Eye className="w-4 h-4 text-emerald-800" />
              {article.views || 1} Dilihat
            </span>
          </div>
        </div>

        {/* Featured Banner Image (If Available) */}
        {imageUrl && (
          <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-sm max-h-[480px]">
            <img
              src={imageUrl}
              alt={article.title}
              className="w-full h-auto max-h-[480px] object-cover"
            />
          </div>
        )}

        {/* Article Body with Rich Formatting (Headings, Markdown, Quotes, Lists, Links, Images) */}
        <div className="pt-2 border-t border-slate-100">
          {renderRichArticle(article.content)}
        </div>

        {/* Article Footer */}
        <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row justify-between sm:items-center gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <Tag className="w-3.5 h-3.5 text-emerald-800" />
            <span>Kategori: <strong className="text-slate-800">{article.category}</strong></span>
          </div>
          <div>
            <span>Diterbitkan oleh: <strong className="text-emerald-950">{article.author?.name || 'Pemerintah Desa Jombe'}</strong></span>
          </div>
        </div>
      </article>
    </div>
  );
}
