'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Building2, UserPlus, AlertCircle, ArrowRight } from 'lucide-react';
import api from '@/lib/api';

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    nik: '',
    name: '',
    phone: '',
    email: '',
    password: '',
    address: '',
    dusun: 'Jombe Krajan',
    rt: '001',
    rw: '001',
  });
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');

    try {
      const res = await api.post('/auth/register', formData);
      if (res.data.status === 'success') {
        const { token, user } = res.data.data;
        localStorage.setItem('jombe_token', token);
        localStorage.setItem('jombe_user', JSON.stringify(user));
        router.push('/dashboard');
      }
    } catch (err: any) {
      setErrorMessage(err.response?.data?.message || 'Pendaftaran gagal. Pastikan NIK belum pernah terdaftar.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-16 flex items-center justify-center max-w-lg mx-auto px-4">
      <div className="w-full bg-white rounded-3xl p-8 border border-gray-100 shadow-xl space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-jombe-700 text-white flex items-center justify-center mx-auto shadow-md">
            <UserPlus className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">Pendaftaran Warga Jombe</h1>
          <p className="text-xs text-gray-500">Buat akun warga untuk mempermudah permohonan surat administrasi digital.</p>
        </div>

        {errorMessage && (
          <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-gray-800">NIK (Nomor Induk Kependudukan) *</label>
            <input
              type="text"
              name="nik"
              value={formData.nik}
              onChange={handleChange}
              placeholder="16 Digit Angka NIK"
              maxLength={16}
              required
              className="w-full px-4 py-2.5 text-xs border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-jombe-600 bg-gray-50/50"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-gray-800">Nama Lengkap (Sesuai KTP) *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Nama Lengkap Anda"
              required
              className="w-full px-4 py-2.5 text-xs border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-jombe-600 bg-gray-50/50"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-gray-800">Nomor HP / WhatsApp *</label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="081234567890"
                required
                className="w-full px-4 py-2.5 text-xs border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-jombe-600 bg-gray-50/50"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-gray-800">Email (Opsional)</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="alamat@email.com"
                className="w-full px-4 py-2.5 text-xs border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-jombe-600 bg-gray-50/50"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-gray-800">Alamat Tempat Tinggal *</label>
            <textarea
              name="address"
              rows={2}
              value={formData.address}
              onChange={handleChange}
              placeholder="Nama jalan / dusun / RT / RW"
              required
              className="w-full px-4 py-2.5 text-xs border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-jombe-600 bg-gray-50/50"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-gray-800">Kata Sandi Akun *</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Minimal 6 Karakter"
              required
              className="w-full px-4 py-2.5 text-xs border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-jombe-600 bg-gray-50/50"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-jombe-800 hover:bg-jombe-900 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
          >
            {loading ? 'Mendaftarkan Akun...' : 'Daftar Akun Warga'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <p className="text-center text-xs text-gray-600 pt-2">
          Sudah memiliki akun?{' '}
          <Link href="/login" className="font-bold text-jombe-800 hover:underline">
            Masuk Sekarang
          </Link>
        </p>
      </div>
    </div>
  );
}
