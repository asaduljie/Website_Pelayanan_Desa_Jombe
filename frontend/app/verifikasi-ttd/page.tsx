'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, ShieldCheck, Landmark } from 'lucide-react';
import Link from 'next/link';

export default function VerifikasiTteIndexPage() {
  const router = useRouter();
  const [docNumber, setDocNumber] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (docNumber.trim()) {
      router.push(`/verifikasi-ttd/${encodeURIComponent(docNumber.trim())}`);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between py-12 px-4 sm:px-6">
      <div className="max-w-xl w-full mx-auto space-y-8">
        {/* TTE Brand Header */}
        <div className="flex flex-col items-center text-center space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-amber-500 via-rose-500 to-indigo-600 bg-clip-text text-transparent">
              tte
            </span>
            <div className="border-l border-slate-300 pl-2 text-left">
              <span className="text-[11px] font-extrabold text-slate-800 tracking-wider uppercase block leading-tight">
                TANDA TANGAN ELEKTRONIK
              </span>
              <span className="text-[9px] text-slate-500 font-medium block">
                Pemerintah Kabupaten Jombang
              </span>
            </div>
          </div>
          <p className="text-xs text-slate-500 font-medium">
            Layanan Verifikasi Dokumen & Tanda Tangan Digital Desa Jombe
          </p>
        </div>

        {/* Verification Card */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-soft space-y-6">
          <div className="text-center space-y-1">
            <h1 className="text-xl font-bold text-slate-900">Verifikasi Keaslian Surat Desa</h1>
            <p className="text-xs text-slate-500">
              Pindai QR Barcode pada surat fisik atau masukkan Nomor Registrasi / Nomor Surat di bawah:
            </p>
          </div>

          <form onSubmit={handleSearch} className="space-y-4 text-xs">
            <div className="space-y-1.5">
              <label className="font-bold text-slate-700">Nomor Registrasi / ID Permohonan</label>
              <input
                type="text"
                required
                value={docNumber}
                onChange={(e) => setDocNumber(e.target.value)}
                placeholder="Contoh: JMB-2026-00012"
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-700 bg-slate-50 uppercase font-mono font-bold text-slate-900"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-emerald-800 hover:bg-emerald-900 text-white font-bold rounded-xl shadow-md transition-colors flex items-center justify-center gap-2"
            >
              <Search className="w-4 h-4" /> Periksa Validitas TTE
            </button>
          </form>

          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-[11px] text-emerald-900 flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
            <span>
              Sistem verifikasi terintegrasi dengan Balai Sertifikasi Elektronik (BSrE) memastikan dokumen tidak dapat dipalsukan dan sah secara hukum.
            </span>
          </div>
        </div>

        <div className="text-center">
          <Link
            href="/"
            className="text-xs text-emerald-800 font-bold hover:underline inline-flex items-center gap-1.5"
          >
            <Landmark className="w-4 h-4" /> Kembali ke Portal Utama Desa Jombe
          </Link>
        </div>
      </div>

      {/* Footer */}
      <div className="max-w-xl w-full mx-auto mt-12 pt-6 border-t border-slate-200 flex justify-between items-center text-[11px] text-slate-500">
        <span className="font-bold text-slate-700">tte BSrE Desa Jombe</span>
        <span>(c) Pemerintah Desa Jombe 2026</span>
      </div>
    </div>
  );
}
