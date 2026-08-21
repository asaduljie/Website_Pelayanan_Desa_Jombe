'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  User,
  ShieldCheck,
  Phone,
  Mail,
  MapPin,
  Calendar,
  FileText,
  CheckCircle2,
  Lock,
  Edit3,
  Save,
  ArrowRight,
  LogOut,
  LayoutDashboard,
  Building2,
  KeyRound,
  IdCard,
} from 'lucide-react';
import api from '@/lib/api';

export default function UserProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Form Fields
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    dusun: '',
    rt: '',
    rw: '',
  });

  // User's Application Stats
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    processing: 0,
  });

  useEffect(() => {
    const stored = localStorage.getItem('jombe_user');
    if (!stored) {
      setLoading(false);
      return;
    }

    try {
      const parsed = JSON.parse(stored);
      setUser(parsed);
      setFormData({
        name: parsed.name || '',
        phone: parsed.phone || '',
        email: parsed.email || 'warga@jombe.desa.id',
        address: parsed.address || 'Desa Jombe RT 02 RW 01',
        dusun: parsed.dusun || 'Krajan',
        rt: parsed.rt || '002',
        rw: parsed.rw || '001',
      });
    } catch (e) {}

    // Fetch live profile from backend
    api
      .get('/auth/profile')
      .then((res) => {
        if (res.data.status === 'success' && res.data.data) {
          const u = res.data.data;
          setUser(u);
          setFormData({
            name: u.name || '',
            phone: u.phone || '',
            email: u.email || 'warga@jombe.desa.id',
            address: u.address || 'Desa Jombe RT 02 RW 01',
            dusun: u.dusun || 'Krajan',
            rt: u.rt || '002',
            rw: u.rw || '001',
          });
        }
      })
      .catch(() => {});

    // Fetch user application statistics
    api
      .get('/applications/my')
      .then((res) => {
        if (res.data.status === 'success' && Array.isArray(res.data.data)) {
          const apps = res.data.data;
          setStats({
            total: apps.length,
            completed: apps.filter((a: any) => a.status === 'COMPLETED').length,
            processing: apps.filter((a: any) => a.status === 'PROCESSING' || a.status === 'PENDING').length,
          });
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg('');
    setErrorMsg('');

    try {
      const res = await api.patch('/auth/profile', formData);
      if (res.data.status === 'success') {
        const updated = res.data.data;
        setUser(updated);
        localStorage.setItem('jombe_user', JSON.stringify(updated));
        setSuccessMsg('Profil Anda berhasil diperbarui!');
        setIsEditing(false);
      }
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || 'Gagal memperbarui profil.');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('jombe_token');
    localStorage.removeItem('jombe_user');
    setUser(null);
    router.push('/login');
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="text-center space-y-2">
          <div className="w-10 h-10 border-4 border-emerald-800 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-xs text-slate-500 font-semibold">Memuat Profil Pengguna...</p>
        </div>
      </div>
    );
  }

  // If user is not logged in
  if (!user) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-slate-200 shadow-xl text-center space-y-5">
          <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-800 flex items-center justify-center mx-auto border border-emerald-200">
            <User className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-extrabold text-slate-900">Masuk Akun Diperlukan</h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              Silakan masuk ke akun Anda untuk melihat data profil kependudukan, riwayat permohonan surat, dan status verifikasi berkas.
            </p>
          </div>
          <div className="pt-2 flex flex-col gap-2.5">
            <Link
              href="/login"
              className="w-full py-3 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold rounded-xl shadow-md transition-all"
            >
              Masuk Akun Pengguna
            </Link>
            <Link
              href="/register"
              className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition-all"
            >
              Daftar Akun Warga Baru
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-emerald-800 text-white rounded-3xl p-6 sm:p-10 shadow-lg flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border border-emerald-800/80">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-emerald-800/80 border-2 border-emerald-400/60 flex items-center justify-center text-white font-extrabold text-2xl shadow-md">
            {user.name?.charAt(0)?.toUpperCase() || 'W'}
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase font-bold tracking-widest px-2.5 py-0.5 rounded-full bg-emerald-700/80 text-emerald-100 border border-emerald-500/40">
                {user.role === 'OPERATOR' ? 'Petugas Operator Desa' : user.role === 'ADMIN' ? 'Administrator' : 'Warga Terdaftar'}
              </span>
              <span className="inline-flex items-center gap-1 text-[10px] text-emerald-300 font-bold">
                <ShieldCheck className="w-3.5 h-3.5" /> Terverifikasi
              </span>
            </div>
            <h1 className="text-xl sm:text-3xl font-extrabold tracking-tight text-white">{user.name}</h1>
            <p className="text-xs text-emerald-100 font-mono">NIK: {user.nik}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {user.role === 'OPERATOR' || user.role === 'ADMIN' ? (
            <Link
              href="/operator"
              className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-amber-950 font-extrabold text-xs rounded-xl shadow-sm transition-all flex items-center gap-1.5"
            >
              <LayoutDashboard className="w-4 h-4" /> Panel Operator
            </Link>
          ) : (
            <Link
              href="/dashboard"
              className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs rounded-xl shadow-sm transition-all flex items-center gap-1.5"
            >
              <FileText className="w-4 h-4" /> Permohonan Saya
            </Link>
          )}
          <button
            onClick={handleLogout}
            className="px-4 py-2.5 bg-white/10 hover:bg-rose-600 text-white font-bold text-xs rounded-xl border border-white/20 transition-all flex items-center gap-1.5"
          >
            <LogOut className="w-4 h-4" /> Keluar
          </button>
        </div>
      </div>

      {/* Success / Error Alerts */}
      {successMsg && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-700" />
          <span>{successMsg}</span>
        </div>
      )}
      {errorMsg && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold flex items-center gap-2">
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-soft space-y-1">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Total Permohonan Surat</span>
          <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 block">{stats.total} Berkas</span>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-soft space-y-1">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Surat Selesai Diterbitkan</span>
          <span className="text-2xl sm:text-3xl font-extrabold text-emerald-700 block">{stats.completed} Surat</span>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-soft space-y-1">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Sedang Diproses</span>
          <span className="text-2xl sm:text-3xl font-extrabold text-amber-600 block">{stats.processing} Berkas</span>
        </div>
      </div>

      {/* Profile Detail & Edit Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Digital Resident Card (KTP Digital) */}
        <div className="space-y-6">
          <div className="bg-gradient-to-tr from-sky-900 via-sky-800 to-sky-950 text-white rounded-3xl p-6 shadow-xl border-2 border-sky-400 space-y-4">
            <div className="text-center border-b border-sky-400/40 pb-2">
              <h4 className="text-[10px] tracking-widest font-extrabold uppercase text-sky-200">REPUBLIK INDONESIA</h4>
              <h3 className="text-xs font-extrabold uppercase">KARTU TANDA PENDUDUK DIGITAL (e-KTP)</h3>
            </div>

            <div className="space-y-2 text-xs">
              <div>
                <span className="text-[9px] font-mono uppercase text-sky-300 block">Nomor Induk Kependudukan (NIK)</span>
                <span className="font-mono font-bold text-yellow-300 text-sm">{user.nik}</span>
              </div>
              <div>
                <span className="text-[9px] uppercase text-sky-300 block">Nama Lengkap</span>
                <span className="font-extrabold uppercase">{user.name}</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-[9px] uppercase text-sky-300 block">Dusun</span>
                  <span className="font-semibold">{formData.dusun || 'Krajan'}</span>
                </div>
                <div>
                  <span className="text-[9px] uppercase text-sky-300 block">RT / RW</span>
                  <span className="font-semibold">{formData.rt || '002'} / {formData.rw || '001'}</span>
                </div>
              </div>
              <div>
                <span className="text-[9px] uppercase text-sky-300 block">Desa / Kecamatan</span>
                <span className="font-semibold">Desa Jombe, Kec. Turatea</span>
              </div>
            </div>

            <div className="text-right text-[9px] text-sky-200 pt-2 border-t border-sky-400/40">
              STATUS: AKTIF & TERVERIFIKASI SISTEM
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-soft space-y-4">
            <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
              <KeyRound className="w-4 h-4 text-emerald-800" />
              Keamanan Akun
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Akun Anda dilindungi dengan enkripsi data kependudukan dan otentikasi resmi Pemerintah Desa Jombe.
            </p>
            <Link
              href="/layanan"
              className="w-full py-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-1 border border-emerald-200"
            >
              Ajukan Surat Baru <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Right Column: User Profile Data / Edit Form */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-soft space-y-6">
            <div className="flex justify-between items-center border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                  <User className="w-5 h-5 text-emerald-800" />
                  Informasi Data Diri Pengguna
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">Kelola identitas dan kontak akun pelayanan desa Anda.</p>
              </div>

              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5"
                >
                  <Edit3 className="w-3.5 h-3.5" /> Ubah Profil
                </button>
              ) : (
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors"
                >
                  Batal
                </button>
              )}
            </div>

            {/* Read-Only View or Edit Form */}
            {!isEditing ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/60 space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Nama Lengkap</span>
                  <span className="font-extrabold text-slate-900 text-sm block">{user.name}</span>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/60 space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Nomor Induk Kependudukan (NIK)</span>
                  <span className="font-mono font-bold text-slate-900 text-sm block">{user.nik}</span>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/60 space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Nomor WhatsApp / HP</span>
                  <span className="font-bold text-slate-900 text-sm block">{formData.phone || user.phone || '-'}</span>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/60 space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Email Terdaftar</span>
                  <span className="font-semibold text-slate-900 block">{formData.email || user.email || '-'}</span>
                </div>

                <div className="sm:col-span-2 p-4 rounded-2xl bg-slate-50 border border-slate-200/60 space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Alamat Domisili</span>
                  <span className="font-medium text-slate-800 leading-relaxed block">
                    {formData.address || user.address || 'Desa Jombe, Kecamatan Turatea, Kabupaten Jeneponto'}
                  </span>
                </div>
              </div>
            ) : (
              <form onSubmit={handleUpdateProfile} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">Nama Lengkap</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                      className="w-full px-3.5 py-2.5 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-700 bg-slate-50"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">Nomor WhatsApp / HP</label>
                    <input
                      type="text"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      required
                      className="w-full px-3.5 py-2.5 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-700 bg-slate-50"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">Email</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-700 bg-slate-50"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">Dusun</label>
                    <input
                      type="text"
                      value={formData.dusun}
                      onChange={(e) => setFormData({ ...formData, dusun: e.target.value })}
                      placeholder="Contoh: Krajan"
                      className="w-full px-3.5 py-2.5 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-700 bg-slate-50"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">RT / RW</label>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        value={formData.rt}
                        onChange={(e) => setFormData({ ...formData, rt: e.target.value })}
                        placeholder="RT 002"
                        className="w-full px-3.5 py-2.5 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-700 bg-slate-50"
                      />
                      <input
                        type="text"
                        value={formData.rw}
                        onChange={(e) => setFormData({ ...formData, rw: e.target.value })}
                        placeholder="RW 001"
                        className="w-full px-3.5 py-2.5 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-700 bg-slate-50"
                      />
                    </div>
                  </div>

                  <div className="space-y-1 sm:col-span-2">
                    <label className="text-xs font-bold text-slate-700">Alamat Lengkap</label>
                    <textarea
                      rows={2}
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-700 bg-slate-50"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-6 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-extrabold rounded-xl shadow-md flex items-center gap-1.5 transition-all"
                  >
                    <Save className="w-4 h-4" /> {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
