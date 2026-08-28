'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Building2, Lock, UserCheck, AlertCircle, ArrowRight } from 'lucide-react';
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

        if (user.role === 'OPERATOR' || user.role === 'ADMIN') {
          router.push('/operator');
        } else {
          router.push('/dashboard');
        }
      }
    } catch (err: any) {
      setErrorMessage(err.response?.data?.message || 'Gagal masuk. Periksa NIK dan kata sandi Anda.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-16 flex items-center justify-center max-w-md mx-auto px-4">
      <div className="w-full bg-white rounded-3xl p-8 border border-gray-100 shadow-xl space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-jombe-700 text-white flex items-center justify-center mx-auto shadow-md">
            <Building2 className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">Masuk JOMBE DIGITAL</h1>
          <p className="text-xs text-gray-500">Masuk untuk mengurus permohonan surat & pengaduan desa.</p>
        </div>

        {errorMessage && (
          <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-gray-800">NIK (Nomor Induk Kependudukan)</label>
            <input
              type="text"
              value={nik}
              onChange={(e) => setNik(e.target.value)}
              placeholder="Masukkan 16 Digit NIK Anda"
              required
              className="w-full px-4 py-2.5 text-xs border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-jombe-600 bg-gray-50/50"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-gray-800">Kata Sandi</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Masukkan kata sandi akun"
              required
              className="w-full px-4 py-2.5 text-xs border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-jombe-600 bg-gray-50/50"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-emerald-800 hover:bg-emerald-900 disabled:opacity-50 text-white font-extrabold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
          >
            {loading ? 'Memverifikasi Akun...' : 'Masuk ke Akun'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <p className="text-center text-xs text-slate-600 pt-2 border-t border-slate-100">
          Belum memiliki akun warga?{' '}
          <Link href="/register" className="font-bold text-emerald-800 hover:underline">
            Daftar Warga Baru
          </Link>
        </p>
      </div>
    </div>
  );
}
