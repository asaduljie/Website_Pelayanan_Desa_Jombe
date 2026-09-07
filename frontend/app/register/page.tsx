'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { UserPlus, Lock, AlertCircle, ArrowRight } from 'lucide-react';
import api from '@/lib/api';

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    nik: '',
    name: '',
    phone: '',
    dusun: 'Dusun Jombe Utara',
    address: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === 'nik') {
      setFormData((prev) => ({ ...prev, nik: value.replace(/\D/g, '').slice(0, 16) }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (formData.nik.length !== 16) {
      setErrorMessage('NIK harus berjumlah 16 digit angka.');
      return;
    }

    if (formData.password.length < 6) {
      setErrorMessage('Kata sandi minimal 6 karakter.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setErrorMessage('Konfirmasi kata sandi tidak cocok.');
      return;
    }

    setLoading(true);

    try {
      const res = await api.post('/auth/register', {
        nik: formData.nik,
        name: formData.name,
        phone: formData.phone,
        address: `${formData.address}, ${formData.dusun}`,
        dusun: formData.dusun,
        password: formData.password,
      });

      if (res.data.status === 'success') {
        const { token, user } = res.data.data;
        localStorage.setItem('jombe_token', token);
        localStorage.setItem('jombe_user', JSON.stringify(user));
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new Event('jombe-auth-changed'));
        }
        router.push('/dashboard');
      }
    } catch (err: any) {
      setErrorMessage(err.response?.data?.message || 'Pendaftaran gagal. Pastikan NIK belum terdaftar.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-16 flex items-center justify-center max-w-xl mx-auto px-4">
      <div className="w-full bg-white rounded-3xl p-8 sm:p-10 border border-slate-200 shadow-xl space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-800 to-teal-900 text-white flex items-center justify-center mx-auto shadow-md">
            <UserPlus className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Pendaftaran Warga Jombe</h1>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Daftar akun warga menggunakan NIK untuk mempermudah permohonan dan pemantauan surat.
          </p>
        </div>

        {errorMessage && (
          <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="space-y-1">
            <label className="font-bold text-slate-700">NIK *</label>
            <input
              type="text"
              name="nik"
              required
              maxLength={16}
              value={formData.nik}
              onChange={handleChange}
              placeholder="Masukkan 16 digit NIK"
              className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-700 bg-slate-50 text-slate-900 font-mono"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-bold text-slate-700">Nama Lengkap *</label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="Nama pemohon"
                className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-700 bg-slate-50 text-slate-900"
              />
            </div>
            <div className="space-y-1">
              <label className="font-bold text-slate-700">Nomor Telepon *</label>
              <input
                type="tel"
                name="phone"
                required
                value={formData.phone}
                onChange={handleChange}
                placeholder="Nomor Telepon / HP"
                className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-700 bg-slate-50 text-slate-900"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-bold text-slate-700">Dusun *</label>
              <select
                name="dusun"
                value={formData.dusun}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-700 bg-slate-50 text-slate-900 font-medium"
              >
                <option value="Dusun Jombe Utara">Dusun Jombe Utara</option>
                <option value="Dusun Jombe Selatan">Dusun Jombe Selatan</option>
                <option value="Dusun Bulo-Bulo">Dusun Bulo-Bulo</option>
                <option value="Dusun Kaluku">Dusun Kaluku</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="font-bold text-slate-700">Alamat *</label>
              <input
                type="text"
                name="address"
                required
                value={formData.address}
                onChange={handleChange}
                placeholder="RT / RW / Jalan"
                className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-700 bg-slate-50 text-slate-900"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-bold text-slate-700">Kata Sandi *</label>
              <input
                type="password"
                name="password"
                required
                minLength={6}
                value={formData.password}
                onChange={handleChange}
                placeholder="Minimal 6 karakter"
                className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-700 bg-slate-50 text-slate-900"
              />
            </div>
            <div className="space-y-1">
              <label className="font-bold text-slate-700">Konfirmasi Sandi *</label>
              <input
                type="password"
                name="confirmPassword"
                required
                minLength={6}
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Ulangi kata sandi"
                className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-700 bg-slate-50 text-slate-900"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-emerald-800 hover:bg-emerald-900 disabled:opacity-50 text-white font-extrabold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 mt-2"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Mendaftarkan...</span>
              </>
            ) : (
              <>
                <UserPlus className="w-4 h-4" />
                <span>Daftar Akun</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="pt-4 border-t border-slate-100 text-center text-xs space-y-2">
          <p className="text-slate-600">
            Sudah punya akun?{' '}
            <Link href="/login" className="font-bold text-emerald-800 hover:underline">
              Masuk dengan NIK
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
