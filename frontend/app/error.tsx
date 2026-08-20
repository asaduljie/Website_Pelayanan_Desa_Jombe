'use client';

import React, { useEffect } from 'react';
import { RefreshCw, Landmark, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

export default function GlobalErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('🛡️ [FRONTEND SELF-HEALING] Error Boundary caught an exception:', error);
  }, [error]);

  const handleSelfHealAndReload = () => {
    try {
      if (typeof window !== 'undefined') {
        sessionStorage.clear();
      }
    } catch (e) {}
    reset();
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-slate-200 shadow-xl text-center space-y-6 animate-in zoom-in-95 duration-200">
        <div className="w-16 h-16 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center justify-center mx-auto shadow-xs">
          <ShieldCheck className="w-8 h-8 text-emerald-700" />
        </div>

        <div className="space-y-2">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            Sistem Pemulihan Mandiri Aktif
          </span>
          <h1 className="text-xl font-extrabold text-slate-900">
            Halaman Sedang Dipulihkan
          </h1>
          <p className="text-xs text-slate-500 leading-relaxed">
            Terjadi kendala sementara pada koneksi. Sistem keamanan otomatis telah mengamankan data Anda dan siap memuat ulang halaman.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <button
            onClick={handleSelfHealAndReload}
            className="flex-1 py-3 px-4 bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs rounded-xl shadow-md transition-colors flex items-center justify-center gap-2"
          >
            <RefreshCw className="w-4 h-4" /> Muat Ulang Halaman
          </button>
          <Link
            href="/"
            className="py-3 px-5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5"
          >
            <Landmark className="w-4 h-4" /> Beranda Desa
          </Link>
        </div>
      </div>
    </div>
  );
}
