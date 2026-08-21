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
            className="w-full py-3 bg-jombe-800 hover:bg-jombe-900 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
          >
            {loading ? 'Memverifikasi Akun...' : 'Masuk ke Sistem'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Demo Accounts Quick Fill */}
        <div className="pt-4 border-t border-gray-100 space-y-2 text-center">
          <span className="text-[11px] font-bold text-gray-400 block uppercase tracking-wider">Akun Demo Sistem</span>
          <div className="flex flex-wrap justify-center gap-2">
            <button
              onClick={() => { setNik('3512345678900001'); setPassword('password123'); }}
              className="px-2.5 py-1 bg-jombe-50 text-jombe-800 rounded-lg text-[10px] font-bold border border-jombe-200 hover:bg-jombe-100"
            >
              Demo Warga
            </button>
            <button
              onClick={() => { setNik('3512345678900009'); setPassword('password123'); }}
              className="px-2.5 py-1 bg-amber-50 text-amber-800 rounded-lg text-[10px] font-bold border border-amber-200 hover:bg-amber-100"
            >
              Demo Operator
            </button>
          </div>
        </div>

        <p className="text-center text-xs text-gray-600 pt-2">
          Belum memiliki akun?{' '}
          <Link href="/register" className="font-bold text-jombe-800 hover:underline">
            Daftar Warga Baru
          </Link>
        </p>
      </div>
    </div>
  );
}
