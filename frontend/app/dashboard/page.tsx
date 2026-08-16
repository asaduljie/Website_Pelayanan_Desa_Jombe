'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FileText, Clock, CheckCircle2, AlertCircle, PlusCircle, ArrowRight, User, Phone, MapPin, Bell } from 'lucide-react';
import api from '@/lib/api';

export default function CitizenDashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [applications, setApplications] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('jombe_user');
    if (!stored) {
      router.push('/login');
      return;
    }
    setUser(JSON.parse(stored));
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const appRes = await api.get('/applications/my');
      if (appRes.data.status === 'success') {
        setApplications(appRes.data.data);
      }

      const notifRes = await api.get('/notifications');
      if (notifRes.data.status === 'success') {
        setNotifications(notifRes.data.data.notifications || []);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-100 text-amber-900 border border-amber-200">PENDING</span>;
      case 'VERIFIED':
        return <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-blue-100 text-blue-900 border border-blue-200">DIVERIFIKASI</span>;
      case 'PROCESSING':
        return <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-blue-100 text-blue-900 border border-blue-200">DIPROSES</span>;
      case 'NEED_REVISION':
        return <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-orange-100 text-orange-900 border border-orange-200">BUTUH PERBAIKAN</span>;
      case 'COMPLETED':
        return <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-900 border border-emerald-200">SELESAI</span>;
      case 'REJECTED':
        return <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-red-100 text-red-900 border border-red-200">DITOLAK</span>;
      default:
        return <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-gray-100 text-gray-800">{status}</span>;
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-jombe-900 to-jombe-800 text-white rounded-3xl p-6 sm:p-10 mb-8 shadow-md flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-1">
          <span className="text-xs text-emerald-300 font-bold uppercase tracking-widest">Dashboard MASYARAKAT</span>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Halo, {user.name} 👋</h1>
          <p className="text-xs text-gray-200">Kelola dan pantau seluruh permohonan surat administrasi desa Anda.</p>
        </div>

        <Link
          href="/layanan"
          className="px-5 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white font-bold text-xs shadow-lg transition-all flex items-center gap-2"
        >
          <PlusCircle className="w-4 h-4" />
          Ajukan Permohonan Baru
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Column: Applications List */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-soft">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-4">
              <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
                <FileText className="w-5 h-5 text-jombe-700" />
                Riwayat Permohonan Surat Saya
              </h2>
              <span className="text-xs text-gray-500 font-medium">Total: {applications.length} Permohonan</span>
            </div>

            {loading ? (
              <div className="text-center py-10 text-xs text-gray-500">Memuat riwayat permohonan...</div>
            ) : applications.length > 0 ? (
              <div className="space-y-4">
                {applications.map((app) => (
                  <div
                    key={app.id}
                    className="p-5 rounded-2xl border border-gray-100 bg-gray-50/50 hover:bg-jombe-50/40 hover:border-jombe-200 transition-all flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-extrabold text-jombe-900 font-mono">{app.applicationNumber}</span>
                        {getStatusBadge(app.status)}
                      </div>
                      <h3 className="text-sm font-bold text-gray-900">{app.service.name}</h3>
                      <span className="text-[11px] text-gray-500 block">
                        Diajukan pada: {new Date(app.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                      </span>
                    </div>

                    <Link
                      href={`/permohonan/${app.id}`}
                      className="px-4 py-2 bg-white border border-gray-200 hover:bg-jombe-700 hover:text-white hover:border-jombe-700 text-jombe-800 rounded-xl text-xs font-bold transition-all flex items-center gap-1 shadow-2xs"
                    >
                      Detail & Tracking <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-gray-50/50 rounded-2xl border border-dashed border-gray-200 space-y-3">
                <FileText className="w-10 h-10 text-gray-300 mx-auto" />
                <p className="text-xs text-gray-500 font-medium">Anda belum pernah mengajukan permohonan surat.</p>
                <Link href="/layanan" className="inline-block px-4 py-2 bg-jombe-800 text-white rounded-xl text-xs font-bold">
                  Pilih Layanan & Buat Surat
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar Column: Profile & Notifications */}
        <div className="space-y-6">
          {/* Profile Card */}
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-soft space-y-4">
            <h3 className="text-sm font-bold text-gray-900 border-b border-gray-100 pb-3 flex items-center gap-2">
              <User className="w-4 h-4 text-jombe-700" />
              Profil Saya
            </h3>

            <div className="space-y-3 text-xs text-gray-700">
              <div>
                <span className="text-[10px] font-bold text-gray-400 uppercase block">NIK</span>
                <span className="font-bold text-gray-900 font-mono">{user.nik}</span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-gray-400 uppercase block">Nama Lengkap</span>
                <span className="font-semibold text-gray-900">{user.name}</span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-gray-400 uppercase block">Nomor HP / WhatsApp</span>
                <span className="font-semibold text-gray-900">{user.phone}</span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-gray-400 uppercase block">Alamat</span>
                <span className="font-medium text-gray-700">{user.address || 'Desa Jombe'}</span>
              </div>
            </div>
          </div>

          {/* Notifications Card */}
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-soft space-y-4">
            <h3 className="text-sm font-bold text-gray-900 border-b border-gray-100 pb-3 flex items-center gap-2">
              <Bell className="w-4 h-4 text-jombe-700" />
              Notifikasi Terbaru
            </h3>

            <div className="space-y-3">
              {notifications.length > 0 ? (
                notifications.slice(0, 5).map((n) => (
                  <div key={n.id} className="p-3 rounded-xl bg-jombe-50/50 border border-jombe-100 text-xs space-y-1">
                    <span className="font-bold text-jombe-900 block">{n.title}</span>
                    <p className="text-gray-600 leading-snug text-[11px]">{n.message}</p>
                  </div>
                ))
              ) : (
                <p className="text-xs text-gray-500">Belum ada notifikasi.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
