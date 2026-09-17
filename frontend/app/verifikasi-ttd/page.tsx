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
        {/* Brand Header */}
        <div className="flex flex-col items-center text-center space-y-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-800 text-white flex items-center justify-center font-black text-lg shadow-md">
              <ShieldCheck className="w-6 h-6 text-emerald-300" />
            </div>
            <div className="border-l border-slate-300 pl-3 text-left">
              <span className="text-xs font-black text-slate-900 tracking-wider uppercase block leading-tight">
                VALIDASI SURAT RESMI
              </span>
              <span className="text-[10px] text-slate-500 font-medium block">
                Pemerintah Desa Jombe, Kec. Turatea, Kab. Jeneponto
              </span>
            </div>
          </div>
          <p className="text-xs text-slate-500 font-medium">
            Layanan Pengecekan Keabsahan Registrasi Surat & Arsip Administrasi Desa Jombe
          </p>
        </div>

        {/* Verification Card */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-soft space-y-6">
          <div className="text-center space-y-1">
            <h1 className="text-xl font-bold text-slate-900">Verifikasi Keabsahan Surat Desa</h1>
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
              <Search className="w-4 h-4" /> Periksa Validitas Dokumen
            </button>
          </form>

          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-[11px] text-emerald-900 flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
            <span className="leading-relaxed">
              Sistem memverifikasi nomor registrasi resmi yang tercatat pada buku register Pemerintah Desa Jombe. Dokumen cetak fisik dinyatakan sah apabila telah ditandatangani basah oleh Kepala Desa Jombe (<strong>JUSMAEDY, S.Pd</strong>) serta dibubuhi stempel basah resmi kantor desa.
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
        <span className="font-bold text-slate-700">Portal Arsip Resmi Desa Jombe</span>
        <span>(c) Pemerintah Desa Jombe, Jeneponto 2026</span>
      </div>
    </div>
  );
}
