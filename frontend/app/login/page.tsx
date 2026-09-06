'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShieldCheck, Lock, UserCheck, AlertCircle, ArrowRight, FileText } from 'lucide-react';
import api from '@/lib/api';

export default function LoginPage() {
  const router = useRouter();
  const [nik, setNik] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nik || !password) return;

    setLoading(true);
    setErrorMessage('');

    try {
      const res = await api.post('/auth/login', { nik, password });
      if (res.data.status === 'success') {
        const { token, user } = res.data.data;
        localStorage.setItem('jombe_token', token);
        localStorage.setItem('jombe_user', JSON.stringify(user));
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new Event('jombe-auth-changed'));
        }

        // Redirect directly to operator panel
        window.location.href = '/operator';
      }
    } catch (err: any) {
      setErrorMessage(err.response?.data?.message || 'Gagal masuk. Periksa NIK / Username dan kata sandi Anda.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-16 flex items-center justify-center max-w-md mx-auto px-4">
      <div className="w-full bg-white rounded-3xl p-8 border border-slate-200 shadow-xl space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-800 to-teal-900 text-white flex items-center justify-center mx-auto shadow-md">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <span className="text-[10px] font-bold uppercase tracking-widest bg-emerald-100 text-emerald-900 px-3 py-0.5 rounded-full inline-block">
            Akses Terbatas
          </span>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">Portal Petugas & Admin</h1>
          <p className="text-xs text-slate-500">
            Masuk khusus Operator & Aparatur Pemerintahan Desa Jombe.
          </p>
        </div>

        {errorMessage && (
          <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form action="javascript:void(0);" onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-gray-800">NIK / ID Petugas</label>
            <input
              type="text"
              value={nik}
              onChange={(e) => setNik(e.target.value)}
              placeholder="Masukkan NIK atau Username Operator"
              required
              className="w-full px-4 py-3 text-xs border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-700 bg-gray-50/50 font-mono"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-gray-800">Kata Sandi</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Masukkan kata sandi akun petugas"
              required
              className="w-full px-4 py-3 text-xs border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-700 bg-gray-50/50"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-emerald-800 hover:bg-emerald-900 disabled:opacity-50 text-white font-extrabold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Memverifikasi Akses...</span>
              </>
            ) : (
              <>
                <Lock className="w-4 h-4" />
                <span>Masuk Portal Petugas</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Citizen guidance box */}
        <div className="pt-4 border-t border-slate-100 bg-slate-50 -mx-8 -mb-8 p-6 rounded-b-3xl space-y-2 text-center text-xs">
          <span className="font-bold text-slate-800 block">Apakah Anda Warga Desa Jombe?</span>
          <p className="text-slate-500 text-[11px] leading-relaxed">
            Warga masyarakat <strong>tidak perlu login atau mendaftar akun</strong>. Permohonan surat keterangan dan pengaduan dapat diajukan langsung melalui form publik mandiri.
          </p>
          <div className="pt-2 flex justify-center gap-4">
            <Link href="/layanan" className="font-bold text-emerald-800 hover:underline flex items-center gap-1">
              <FileText className="w-3.5 h-3.5" /> Ajukan Surat
            </Link>
            <span className="text-slate-300">•</span>
            <Link href="/lacak" className="font-bold text-emerald-800 hover:underline">
              Lacak Status Surat
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
