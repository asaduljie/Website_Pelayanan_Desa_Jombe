'use client';

import React from 'react';
import Link from 'next/link';
import { Landmark, MessageSquare, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-slate-200 shadow-xl text-center space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center justify-center mx-auto text-2xl font-extrabold">
          404
        </div>

        <div className="space-y-2">
          <h1 className="text-xl font-extrabold text-slate-900">Halaman Tidak Ditemukan</h1>
          <p className="text-xs text-slate-500 leading-relaxed">
            Halaman yang Anda tuju tidak tersedia atau telah dipindahkan. Silakan kembali ke Beranda atau gunakan Layanan WhatsApp Bot Desa Jombe.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <Link
            href="/"
            className="flex-1 py-3 px-4 bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs rounded-xl shadow-md transition-colors flex items-center justify-center gap-2"
          >
            <Landmark className="w-4 h-4" /> Beranda Utama
          </Link>
          <a
            href="https://wa.me/6287853617893?text=Halo%20Bot%20Pelayanan%20Desa%20Jombe%2C%20saya%20ingin%20mengajukan%20permohonan%20surat."
            target="_blank"
            rel="noopener noreferrer"
            className="py-3 px-4 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-300 font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5"
          >
            <MessageSquare className="w-4 h-4 text-emerald-700" /> WhatsApp Bot
          </a>
        </div>
      </div>
    </div>
  );
}
