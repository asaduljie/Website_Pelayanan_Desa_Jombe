'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Lock, UserCheck, AlertCircle, ArrowRight, UserPlus } from 'lucide-react';
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
      const res = await api.post('/auth/login', { nik: nik.trim(), password });
      if (res.data.status === 'success') {
        const { token, user } = res.data.data;
        localStorage.setItem('jombe_token', token);
        localStorage.setItem('jombe_user', JSON.stringify(user));
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new Event('jombe-auth-changed'));
        }

        if (user.role === 'OPERATOR' || user.role === 'ADMIN') {
          window.location.href = '/operator';
        } else {
          window.location.href = '/dashboard';
        }
      }
    } catch (err: any) {
      setErrorMessage(err.response?.data?.message || 'Gagal masuk. Periksa kembali NIK dan kata sandi Anda.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-16 flex items-center justify-center max-w-md mx-auto px-4">
      <div className="w-full bg-white rounded-3xl p-8 border border-slate-200 shadow-xl space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-800 to-teal-900 text-white flex items-center justify-center mx-auto shadow-md">
            <UserCheck className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Masuk Portal Desa</h1>
          <p className="text-xs text-slate-500">
            Masukkan NIK dan kata sandi Anda.
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
            <label className="block text-xs font-bold text-slate-800">NIK *</label>
            <input
              type="text"
              value={nik}
              onChange={(e) => setNik(e.target.value.replace(/\D/g, '').slice(0, 16))}
              placeholder="Masukkan NIK"
              required
              maxLength={16}
              className="w-full px-4 py-3 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-700 bg-slate-50 font-mono text-slate-900"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-800">Kata Sandi *</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Masukkan kata sandi"
              required
              className="w-full px-4 py-3 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-700 bg-slate-50 text-slate-900"
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
                <span>Memproses...</span>
              </>
            ) : (
              <>
                <Lock className="w-4 h-4" />
                <span>Masuk</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Links */}
        <div className="pt-4 border-t border-slate-100 text-center text-xs space-y-3">
          <p className="text-slate-600">
            Belum punya akun?{' '}
            <Link href="/register" className="font-bold text-emerald-800 hover:underline inline-flex items-center gap-1">
              <UserPlus className="w-3.5 h-3.5" /> Daftar Akun Warga
            </Link>
          </p>

          <p className="text-[11px] text-slate-400">
            Atau ajukan langsung tanpa masuk:{' '}
            <Link href="/layanan" className="font-bold text-slate-700 hover:underline">
              Layanan Surat Mandiri
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
