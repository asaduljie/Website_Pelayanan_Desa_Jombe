'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ShieldCheck, FileText, Search, ArrowRight } from 'lucide-react';

export default function WaBotPage() {
  const router = useRouter();

  useEffect(() => {
    // Automatically redirect to services after 2 seconds
    const timer = setTimeout(() => {
      router.replace('/layanan');
    }, 2500);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-screen py-20 flex items-center justify-center max-w-lg mx-auto px-4">
      <div className="w-full bg-white rounded-3xl p-8 sm:p-10 border border-slate-200 shadow-xl space-y-6 text-center">
        <div className="w-16 h-16 rounded-3xl bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto">
          <FileText className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <span className="text-[10px] font-bold uppercase tracking-widest bg-emerald-100 text-emerald-900 px-3 py-1 rounded-full">
            Peralihan Layanan Resmi
          </span>
          <h1 className="text-2xl font-black text-slate-900">
            Layanan Terpusat Melalui Website
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Seluruh layanan permohonan surat administrasi dan pengaduan warga Desa Jombe kini dipusatkan secara mandiri melalui website resmi Lentera Desa Jombe.
          </p>
        </div>

        <p className="text-xs text-slate-400">
          Mengalihkan Anda secara otomatis ke halaman Layanan Surat...
        </p>

        <div className="pt-2 flex flex-col gap-2">
          <Link
            href="/layanan"
            className="w-full py-3 bg-emerald-800 hover:bg-emerald-900 text-white font-bold rounded-2xl text-xs shadow-md transition-all flex items-center justify-center gap-2"
          >
            <span>Buka Layanan Surat Sekarang</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/lacak"
            className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-2xl text-xs transition-colors"
          >
            Lacak Status Dokumen
          </Link>
        </div>
      </div>
    </div>
  );
}
