'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Search,
  FileText,
  Home as HomeIcon,
  Store,
  HeartHandshake,
  MessageSquare,
  ArrowRight,
  ShieldCheck,
  Clock,
  Users,
  CheckCircle2,
  AlertCircle,
  Building2,
  Landmark,
  Calendar,
  Newspaper,
  ChevronRight,
  PhoneCall,
  MapPin,
  Check,
  Send,
  Download,
} from 'lucide-react';
import api from '@/lib/api';

export default function HomePage() {
  const router = useRouter();
  const [trackingNumber, setTrackingNumber] = useState('');
  const [trackingResult, setTrackingResult] = useState<any>(null);
  const [trackingLoading, setTrackingLoading] = useState(false);
  const [trackingError, setTrackingError] = useState('');

  const [realStats, setRealStats] = useState<any>({
    totalPopulation: 0,
    totalDusun: 0,
    availableServices: 0,
    completedApplications: 0,
  });

  const [services, setServices] = useState<any[]>([]);
  const [news, setNews] = useState<any[]>([]);
  const [announcements, setAnnouncements] = useState<any[]>([]);

  // WhatsApp quick preview state
  const [waLatestMessage, setWaLatestMessage] = useState<any>(null);

  useEffect(() => {
    // Fetch Real Dynamic Profile & Statistics from DB API
    api.get('/content/profile').then((res) => {
      if (res.data.status === 'success') {
        const s = res.data.data.stats || {};
        setRealStats({
          totalPopulation: s.totalPopulation || 0,
          totalDusun: s.totalDusun || 0,
          availableServices: s.availableServices || 0,
          completedApplications: s.completedApplications || 0,
        });
      }
    }).catch(() => {});

    // Fetch Active Services from DB
    api.get('/services').then((res) => {
      if (res.data.status === 'success') {
        setServices(res.data.data);
      }
    }).catch(() => {});

    // Fetch News from DB
    api.get('/content/news').then((res) => {
      if (res.data.status === 'success') {
        setNews(res.data.data.slice(0, 3));
      }
    }).catch(() => {});

    // Fetch Announcements from DB
    api.get('/content/announcements').then((res) => {
      if (res.data.status === 'success') {
        setAnnouncements(res.data.data.slice(0, 3));
      }
    }).catch(() => {});

    // Fetch WhatsApp latest history
    api.get('/whatsapp/history?phone=6281299887766').then((res) => {
      if (res.data.status === 'success' && Array.isArray(res.data.data) && res.data.data.length > 0) {
        const lastMsg = res.data.data[res.data.data.length - 1];
        setWaLatestMessage(lastMsg);
      }
    }).catch(() => {});
  }, []);

  const handleTrackingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackingNumber.trim()) return;

    setTrackingLoading(true);
    setTrackingError('');
    setTrackingResult(null);

    try {
      const res = await api.get(`/applications/track?applicationNumber=${trackingNumber.trim()}`);
      if (res.data.status === 'success') {
        setTrackingResult(res.data.data);
      }
    } catch (err: any) {
      setTrackingError(err.response?.data?.message || 'Nomor permohonan tidak ditemukan dalam sistem.');
    } finally {
      setTrackingLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-br from-emerald-950 via-emerald-900 to-emerald-800 text-white pt-16 pb-28 lg:pt-24 lg:pb-36 border-b border-emerald-800/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl text-center mx-auto space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-800/80 border border-emerald-600/40 text-emerald-100 text-xs font-semibold backdrop-blur-md shadow-xs">
              <Landmark className="w-3.5 h-3.5 text-emerald-300" />
              Portal Resmi Pelayanan Administrasi Desa Jombe
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-tight">
              Pelayanan Publik Digital <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-200 to-teal-100">Desa Jombe</span>
            </h1>

            <p className="text-sm sm:text-base text-emerald-100/90 leading-relaxed font-normal max-w-2xl mx-auto">
              Layanan mandiri pengajuan surat administrasi kependudukan, perizinan usaha, dan pengaduan masyarakat secara transparan, cepat, dan terintegrasi.
            </p>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3.5">
              <Link
                href="/layanan"
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-md hover:shadow-emerald-500/25 transition-all flex items-center justify-center gap-2 group"
              >
                Ajukan Permohonan Surat
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/wa-bot"
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-sm backdrop-blur-md border border-white/20 transition-all flex items-center justify-center gap-2"
              >
                <MessageSquare className="w-4 h-4 text-emerald-300" />
                Layanan Chat WhatsApp
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Shape Separator */}
        <div className="absolute bottom-0 left-0 right-0 h-10 bg-slate-50/50 rounded-t-[36px]" />
      </section>

      {/* TRACKING & WHATSAPP QUICK STATUS SECTION */}
      <section className="-mt-14 relative z-20 max-w-5xl mx-auto px-4 space-y-6">
        {/* Main Tracking Box */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-200/80">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-base sm:text-lg font-extrabold text-slate-900 flex items-center gap-2">
                <Search className="w-5 h-5 text-emerald-700" />
                Cek Status Permohonan Surat
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">Masukkan nomor registrasi permohonan Anda untuk melihat perkembangan proses dokumen.</p>
            </div>
            <span className="text-[11px] px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 font-semibold border border-emerald-200 shrink-0">
              Pelacakan Real-Time
            </span>
          </div>

          <form onSubmit={handleTrackingSubmit} className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <input
                type="text"
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
                placeholder="Contoh: JMB-2026-00012"
                className="w-full px-4 py-3 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600 bg-slate-50 uppercase font-mono font-semibold text-slate-900"
              />
            </div>
            <button
              type="submit"
              disabled={trackingLoading}
              className="px-6 py-3 bg-emerald-800 hover:bg-emerald-900 disabled:opacity-50 text-white font-bold text-xs sm:text-sm rounded-xl shadow-sm transition-colors shrink-0 flex items-center justify-center gap-2"
            >
              {trackingLoading ? 'Memeriksa...' : 'Lacak Dokumen'}
            </button>
          </form>

          {/* Tracking Result Card */}
          {trackingError && (
            <div className="mt-4 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{trackingError}</span>
            </div>
          )}

          {trackingResult && (
            <div className="mt-6 p-5 rounded-2xl bg-emerald-50/70 border border-emerald-200 animate-in fade-in duration-200">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-emerald-200/80 pb-3 mb-3 gap-2">
                <div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Nomor Registrasi</span>
                  <h4 className="text-base font-extrabold text-emerald-950 font-mono">{trackingResult.applicationNumber}</h4>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Status Berkas</span>
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 inline-block mt-0.5">
                    {trackingResult.status}
                  </span>
                </div>
              </div>

              <div className="text-xs space-y-1.5 text-slate-700">
                <p><strong>Layanan:</strong> {trackingResult.serviceName}</p>
                <p><strong>Tanggal Diajukan:</strong> {new Date(trackingResult.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                {trackingResult.revisionNotes && (
                  <div className="mt-2.5 p-3 rounded-xl bg-amber-100 border border-amber-200 text-amber-950 text-xs">
                    <strong>Catatan Petugas:</strong> {trackingResult.revisionNotes}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* WhatsApp Chat History Live Preview Card */}
        <div className="bg-gradient-to-r from-slate-900 to-emerald-950 text-white rounded-3xl p-6 sm:p-7 shadow-lg border border-emerald-800/60 flex flex-col md:flex-row justify-between items-start md:items-center gap-5">
          <div className="space-y-1.5 max-w-xl">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-300">Layanan Terhubung WhatsApp Resmi</span>
            </div>
            <h3 className="text-base sm:text-lg font-extrabold text-white">
              Riwayat Percakapan & Pengajuan Surat via WhatsApp
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              {waLatestMessage
                ? `Pesan Terakhir: "${waLatestMessage.text.slice(0, 90)}..."`
                : 'Ajukan surat lewat chat WhatsApp. Surat resmi langsung diterbitkan dan dikirimkan kembali ke WhatsApp Anda.'}
            </p>
          </div>

          <Link
            href="/wa-bot"
            className="px-5 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-2xl shadow-md transition-all flex items-center gap-2 shrink-0 border border-emerald-400/40"
          >
            <MessageSquare className="w-4 h-4 text-emerald-100" />
            Buka Layanan WhatsApp
          </Link>
        </div>
      </section>

      {/* QUICK SERVICES SECTION */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-800">Katalog Administrasi</span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Layanan Surat Unggulan</h2>
          <p className="text-xs sm:text-sm text-slate-600">Pilih jenis dokumen administrasi resmi yang Anda butuhkan untuk pengajuan online.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <Link
            href="/layanan/surat-keterangan-usaha"
            className="bg-white p-6 rounded-2xl shadow-soft hover:shadow-soft-hover border border-slate-100 hover:border-emerald-200 transition-all group flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform border border-emerald-100">
                <Store className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-1.5 group-hover:text-emerald-800 transition-colors">Surat Keterangan Usaha</h3>
              <p className="text-xs text-slate-500 leading-relaxed mb-4">Pengantar resmi izin dan operasional usaha mikro & UMKM warga Desa Jombe.</p>
            </div>
            <span className="text-xs font-bold text-emerald-800 flex items-center gap-1 pt-3 border-t border-slate-100">
              Ajukan Permohonan <ChevronRight className="w-4 h-4" />
            </span>
          </Link>

          <Link
            href="/layanan/surat-keterangan-domisili"
            className="bg-white p-6 rounded-2xl shadow-soft hover:shadow-soft-hover border border-slate-100 hover:border-emerald-200 transition-all group flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-800 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform border border-teal-100">
                <HomeIcon className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-1.5 group-hover:text-emerald-800 transition-colors">Surat Keterangan Domisili</h3>
              <p className="text-xs text-slate-500 leading-relaxed mb-4">Keterangan resmi status tempat tinggal warga di wilayah Desa Jombe.</p>
            </div>
            <span className="text-xs font-bold text-emerald-800 flex items-center gap-1 pt-3 border-t border-slate-100">
              Ajukan Permohonan <ChevronRight className="w-4 h-4" />
            </span>
          </Link>

          <Link
            href="/layanan/surat-keterangan-tidak-mampu"
            className="bg-white p-6 rounded-2xl shadow-soft hover:shadow-soft-hover border border-slate-100 hover:border-emerald-200 transition-all group flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-sky-50 text-sky-800 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform border border-sky-100">
                <HeartHandshake className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-1.5 group-hover:text-emerald-800 transition-colors">Surat Keterangan Tidak Mampu</h3>
              <p className="text-xs text-slate-500 leading-relaxed mb-4">Keterangan keperluan beasiswa pendidikan, kesehatan, dan jaminan sosial.</p>
            </div>
            <span className="text-xs font-bold text-emerald-800 flex items-center gap-1 pt-3 border-t border-slate-100">
              Ajukan Permohonan <ChevronRight className="w-4 h-4" />
            </span>
          </Link>

          <Link
            href="/pengaduan"
            className="bg-white p-6 rounded-2xl shadow-soft hover:shadow-soft-hover border border-slate-100 hover:border-emerald-200 transition-all group flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-800 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform border border-slate-200">
                <MessageSquare className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-1.5 group-hover:text-emerald-800 transition-colors">Layanan Pengaduan Warga</h3>
              <p className="text-xs text-slate-500 leading-relaxed mb-4">Penyampaian aspirasi dan laporan kendala fasilitas publik desa.</p>
            </div>
            <span className="text-xs font-bold text-emerald-800 flex items-center gap-1 pt-3 border-t border-slate-100">
              Kirim Pengaduan <ChevronRight className="w-4 h-4" />
            </span>
          </Link>
        </div>
      </section>

      {/* REAL DYNAMIC VILLAGE STATISTICS SECTION */}
      <section className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-emerald-950 text-white py-16 border-y border-emerald-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center divide-y sm:divide-y-0 sm:divide-x divide-emerald-800/60">
            <div className="space-y-1 pt-4 sm:pt-0">
              <span className="text-3xl sm:text-4xl font-extrabold text-emerald-300 block">{realStats.totalPopulation ? realStats.totalPopulation.toLocaleString('id-ID') : '-'}</span>
              <span className="text-xs text-emerald-100/80 font-medium uppercase tracking-wider block">Jumlah Penduduk</span>
            </div>
            <div className="space-y-1 pt-4 sm:pt-0">
              <span className="text-3xl sm:text-4xl font-extrabold text-emerald-300 block">{realStats.totalDusun || '-'}</span>
              <span className="text-xs text-emerald-100/80 font-medium uppercase tracking-wider block">Wilayah Dusun</span>
            </div>
            <div className="space-y-1 pt-4 sm:pt-0">
              <span className="text-3xl sm:text-4xl font-extrabold text-emerald-300 block">{realStats.availableServices || '-'}</span>
              <span className="text-xs text-emerald-100/80 font-medium uppercase tracking-wider block">Layanan Online Aktif</span>
            </div>
            <div className="space-y-1 pt-4 sm:pt-0">
              <span className="text-3xl sm:text-4xl font-extrabold text-emerald-300 block">{realStats.completedApplications}</span>
              <span className="text-xs text-emerald-100/80 font-medium uppercase tracking-wider block">Permohonan Terselesaikan</span>
            </div>
          </div>
        </div>
      </section>

      {/* NEWS & ANNOUNCEMENTS */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-800">Publikasi Resmi</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Kabar & Pengumuman Desa</h2>
          </div>
          <Link href="/berita" className="text-xs font-bold text-emerald-800 hover:underline flex items-center gap-1">
            Lihat Semua Berita <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {news.length > 0 ? (
              news.map((item) => (
                <div key={item.id} className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-soft flex flex-col sm:flex-row gap-6 hover:border-emerald-200 transition-all">
                  <div className="w-full sm:w-48 h-32 bg-emerald-50 rounded-xl flex items-center justify-center shrink-0 border border-emerald-100">
                    <Newspaper className="w-9 h-9 text-emerald-700" />
                  </div>
                  <div className="flex-1 space-y-2">
                    <span className="text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                      {item.category}
                    </span>
                    <h3 className="text-base font-bold text-slate-900 leading-snug">{item.title}</h3>
                    <p className="text-xs text-slate-600 line-clamp-2">{item.excerpt || item.content}</p>
                    <span className="text-[11px] text-slate-400 block pt-1">
                      {new Date(item.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-white p-6 rounded-2xl border border-slate-200 text-xs text-slate-500 text-center">
                Belum ada publikasi berita terbaru.
              </div>
            )}
          </div>

          <div className="bg-white border border-slate-200 p-6 rounded-3xl space-y-4 shadow-soft">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
              <Calendar className="w-5 h-5 text-emerald-700" />
              Pengumuman Penting
            </h3>
            <div className="space-y-3">
              {announcements.length > 0 ? (
                announcements.map((ann) => (
                  <div key={ann.id} className="bg-slate-50 p-4 rounded-xl border border-slate-200/70 space-y-1">
                    <h4 className="text-xs font-bold text-slate-900">{ann.title}</h4>
                    <p className="text-xs text-slate-600 leading-relaxed">{ann.content}</p>
                  </div>
                ))
              ) : (
                <div className="bg-slate-50 p-4 rounded-xl text-xs text-slate-500">
                  Tidak ada pengumuman mendesak saat ini.
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
