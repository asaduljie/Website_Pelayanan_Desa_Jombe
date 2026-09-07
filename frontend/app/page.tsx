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
  MapPin,
  Compass,
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
    totalPopulation: 2854,
    totalDusun: 4,
    availableServices: 6,
    completedApplications: 0,
  });

  const [services, setServices] = useState<any[]>([]);
  const [news, setNews] = useState<any[]>([]);
  const [announcements, setAnnouncements] = useState<any[]>([]);

  useEffect(() => {
    // Fetch Real Dynamic Profile & Statistics from DB API
    api.get('/content/profile').then((res) => {
      if (res.data.status === 'success') {
        const s = res.data.data.stats || {};
        setRealStats({
          totalPopulation: s.totalPopulation || 2854,
          totalDusun: s.totalDusun || 4,
          availableServices: s.availableServices || 6,
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
  }, []);

  const handleTrackingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const q = trackingNumber.trim();
    if (!q) return;

    // Direct redirect to dedicated tracking page
    router.push(`/lacak?no=${encodeURIComponent(q)}`);
  };

  return (
    <div className="min-h-screen bg-slate-50/50">
      {/* HERO SECTION WITH VILLAGE LANDSCAPE BACKGROUND */}
      <section className="relative overflow-hidden text-white pt-20 pb-32 lg:pt-28 lg:pb-40 border-b border-emerald-900/40">
        {/* Full-Bleed Background Image */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <img
            src="/images/hero-desa-jombe.jpg"
            alt="Pemandangan Desa Jombe"
            className="w-full h-full object-cover object-center scale-105"
          />
        </div>
        {/* Deep Emerald Gradient & Vignette Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-950/95 via-emerald-950/80 to-emerald-900/70 z-1" />
        <div className="absolute inset-0 bg-black/25 z-1" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl text-center mx-auto space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-950/80 border border-emerald-400/40 text-emerald-100 text-xs font-semibold backdrop-blur-md shadow-lg">
              <Landmark className="w-4 h-4 text-emerald-300" />
              Portal Resmi Pelayanan Administrasi Desa Jombe
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-tight drop-shadow-md">
              Pelayanan Publik Digital <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-200 via-teal-100 to-amber-200">Desa Jombe</span>
            </h1>

            <p className="text-sm sm:text-base text-emerald-100/95 leading-relaxed font-normal max-w-2xl mx-auto drop-shadow-xs">
              Layanan pengajuan surat kependudukan, perizinan usaha, dan pengaduan aspirasi masyarakat secara transparan dan terintegrasi.
            </p>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3.5">
              <Link
                href="/layanan"
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-sm shadow-xl hover:shadow-emerald-500/30 transition-all flex items-center justify-center gap-2 group transform hover:-translate-y-0.5"
              >
                Ajukan Permohonan Surat
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/profil"
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white/15 hover:bg-white/25 text-white font-bold text-sm backdrop-blur-md border border-white/30 transition-all flex items-center justify-center gap-2 shadow-lg"
              >
                <Compass className="w-4 h-4 text-emerald-300" />
                Lihat Profil Desa Jombe
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Shape Separator */}
        <div className="absolute bottom-0 left-0 right-0 h-12 bg-slate-50/50 rounded-t-[40px]" />
      </section>

      {/* TRACKING & PROFIL QUICK SECTION */}
      <section className="-mt-14 relative z-20 max-w-5xl mx-auto px-4 space-y-6">
        {/* Main Tracking Box */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-200/80">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-base sm:text-lg font-extrabold text-slate-900 flex items-center gap-2">
                <Search className="w-5 h-5 text-emerald-700" />
                Lacak Status Surat & Pengaduan Warga
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Masukkan Nomor Registrasi atau NIK Anda.
              </p>
            </div>
          </div>

          <form onSubmit={handleTrackingSubmit} className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <input
                type="text"
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
                placeholder="Nomor Registrasi atau NIK"
                className="w-full px-4 py-3 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600 bg-slate-50 uppercase font-mono font-semibold text-slate-900"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-3 bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs sm:text-sm rounded-xl shadow-sm transition-colors shrink-0 flex items-center justify-center gap-2"
            >
              <Search className="w-4 h-4" />
              <span>Cari Status Berkas</span>
            </button>
          </form>
        </div>

        {/* Profil Desa Highlight Banner */}
        <div className="bg-gradient-to-r from-slate-900 via-emerald-950 to-teal-950 text-white rounded-3xl p-6 sm:p-8 shadow-lg border border-emerald-800/60 flex flex-col md:flex-row justify-between items-start md:items-center gap-5">
          <div className="space-y-2 max-w-xl">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-300">
                Pemerintahan & Wilayah Desa
              </span>
            </div>
            <h3 className="text-lg sm:text-xl font-black text-white">
              Profil Resmi Desa Jombe, Turatea, Jeneponto
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Informasi kependudukan, peta interaktif wilayah, potensi pertanian, serta aparatur pemerintah desa di bawah kepemimpinan Kepala Desa <strong>JUSMAEDY, S.Pd</strong>.
            </p>
          </div>


          <Link
            href="/profil"
            className="px-6 py-3.5 bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs rounded-2xl shadow-md transition-all flex items-center gap-2 shrink-0 border border-emerald-500/40"
          >
            <Compass className="w-4 h-4 text-emerald-200" />
            <span>Jelajahi Profil Desa</span>
          </Link>
        </div>
      </section>

      {/* QUICK SERVICES SECTION */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-800">Katalog Administrasi</span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Layanan Surat Mandiri</h2>
          <p className="text-xs sm:text-sm text-slate-600">
            Tanpa perlu antre di kantor desa. Pilih jenis surat, isi data diri & NIK, lalu unduh berkas PDF resmi setelah disetujui.
          </p>
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
              <p className="text-xs text-slate-500 leading-relaxed mb-4">Pengantar resmi operasional usaha mikro & UMKM warga Desa Jombe.</p>
            </div>
            <span className="text-xs font-bold text-emerald-800 flex items-center gap-1 pt-3 border-t border-slate-100">
              Ajukan Mandiri <ChevronRight className="w-4 h-4" />
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
              <p className="text-xs text-slate-500 leading-relaxed mb-4">Keterangan resmi tempat tinggal warga di wilayah 4 dusun Desa Jombe.</p>
            </div>
            <span className="text-xs font-bold text-emerald-800 flex items-center gap-1 pt-3 border-t border-slate-100">
              Ajukan Mandiri <ChevronRight className="w-4 h-4" />
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
              <p className="text-xs text-slate-500 leading-relaxed mb-4">Untuk keperluan beasiswa sekolah, KIP kuliah, BPJS, atau bantuan sosial.</p>
            </div>
            <span className="text-xs font-bold text-emerald-800 flex items-center gap-1 pt-3 border-t border-slate-100">
              Ajukan Mandiri <ChevronRight className="w-4 h-4" />
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
              <p className="text-xs text-slate-500 leading-relaxed mb-4">Penyampaian laporan kendala jalan, lampu, kebersihan, atau fasilitas umum.</p>
            </div>
            <span className="text-xs font-bold text-emerald-800 flex items-center gap-1 pt-3 border-t border-slate-100">
              Kirim Laporan <ChevronRight className="w-4 h-4" />
            </span>
          </Link>
        </div>
      </section>

      {/* REAL DYNAMIC VILLAGE STATISTICS SECTION */}
      <section className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-emerald-950 text-white py-16 border-y border-emerald-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center divide-y sm:divide-y-0 sm:divide-x divide-emerald-800/60">
            <div className="space-y-1 pt-4 sm:pt-0">
              <span className="text-3xl sm:text-4xl font-extrabold text-emerald-300 block">
                {realStats.totalPopulation ? realStats.totalPopulation.toLocaleString('id-ID') : '2.854'}
              </span>
              <span className="text-xs text-emerald-100/80 font-medium uppercase tracking-wider block">Jumlah Penduduk (Jiwa)</span>
            </div>
            <div className="space-y-1 pt-4 sm:pt-0">
              <span className="text-3xl sm:text-4xl font-extrabold text-emerald-300 block">{realStats.totalDusun || '4'}</span>
              <span className="text-xs text-emerald-100/80 font-medium uppercase tracking-wider block">Wilayah Dusun</span>
            </div>
            <div className="space-y-1 pt-4 sm:pt-0">
              <span className="text-3xl sm:text-4xl font-extrabold text-emerald-300 block">{realStats.availableServices || '6'}</span>
              <span className="text-xs text-emerald-100/80 font-medium uppercase tracking-wider block">Layanan Surat Online</span>
            </div>
            <div className="space-y-1 pt-4 sm:pt-0">
              <span className="text-3xl sm:text-4xl font-extrabold text-emerald-300 block">{realStats.completedApplications}</span>
              <span className="text-xs text-emerald-100/80 font-medium uppercase tracking-wider block">Surat Diterbitkan</span>
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
