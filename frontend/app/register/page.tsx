'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldCheck, FileText, Search, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function RegisterPage() {
  return (
    <div className="min-h-screen py-16 flex items-center justify-center max-w-lg mx-auto px-4">
      <div className="w-full bg-white rounded-3xl p-8 sm:p-10 border border-slate-200 shadow-xl space-y-6 text-center">
        <div className="w-16 h-16 rounded-3xl bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto shadow-inner">
          <CheckCircle2 className="w-9 h-9" />
        </div>

        <div className="space-y-2">
          <span className="text-[10px] font-bold uppercase tracking-widest bg-emerald-100 text-emerald-900 px-3 py-1 rounded-full">
            Kemudahan Layanan Mandiri
          </span>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Pendaftaran Akun Tidak Diperlukan
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Untuk mempermudah warga masyarakat Desa Jombe, seluruh layanan permohonan surat administrasi dan pengaduan aspirasi kini <strong>dapat langsung diajukan tanpa perlu mendaftar atau login akun</strong>.
          </p>
        </div>

        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs text-slate-700 text-left space-y-2">
          <span className="font-bold text-slate-900 block">Cara Pengajuan Mandiri:</span>
          <p>1. Buka menu <strong>Layanan Surat</strong> dan pilih jenis dokumen yang dibutuhkan.</p>
          <p>2. Masukkan <strong>NIK 16 digit</strong>, identitas pemohon, dusun, dan jawab soal verifikasi Captcha.</p>
          <p>3. Simpan <strong>Nomor Registrasi</strong> dan cek status surat Anda melalui menu <strong>Lacak Surat</strong>.</p>
        </div>

        <div className="space-y-3 pt-2">
          <Link
            href="/layanan"
            className="w-full py-3.5 bg-emerald-800 hover:bg-emerald-900 text-white font-bold rounded-2xl text-xs shadow-md transition-all flex items-center justify-center gap-2"
          >
            <FileText className="w-4 h-4" />
            <span>Ajukan Surat Mandiri Sekarang</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <Link
            href="/lacak"
            className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-2xl text-xs transition-colors flex items-center justify-center gap-2"
          >
            <Search className="w-4 h-4" />
            <span>Lacak Permohonan Saya</span>
          </Link>

          <Link
            href="/login"
            className="block text-[11px] text-slate-400 hover:text-slate-600 font-medium pt-2"
          >
            Aparatur / Operator Desa? Masuk ke Portal Petugas di sini
          </Link>
        </div>
      </div>
    </div>
  );
}
