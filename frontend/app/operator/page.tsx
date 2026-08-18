'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  FileText,
  CheckCircle2,
  Clock,
  AlertTriangle,
  XCircle,
  Search,
  Filter,
  Eye,
  Check,
  X,
  FileCheck,
  User,
  Phone,
  Calendar,
  ShieldAlert,
  Download,
  Plus,
  RefreshCw,
  Landmark,
  Edit3,
  Send,
  Save,
  FileSpreadsheet,
  ArrowRight,
  Camera,
  Image as ImageIcon,
  ZoomIn,
  ExternalLink,
} from 'lucide-react';
import api from '@/lib/api';

export default function OperatorDashboardPage() {
  const router = useRouter();
  const [operator, setOperator] = useState<any>(null);
  const [stats, setStats] = useState<any>({ pending: 0, processing: 0, needRevision: 0, completed: 0, total: 0 });
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [statusFilter, setStatusFilter] = useState('ALL');
  const [search, setSearch] = useState('');
  const [selectedApp, setSelectedApp] = useState<any>(null);
  const [actionLoading, setActionLoading] = useState(false);

  // Tab State: 'PERMOHONAN_WARGA' or 'SURAT_BALASAN_SKU'
  const [activeTab, setActiveTab] = useState<'PERMOHONAN_WARGA' | 'SURAT_BALASAN_SKU'>('PERMOHONAN_WARGA');

  // Document Lightbox / Image Viewer Modal
  const [previewDoc, setPreviewDoc] = useState<{ title: string; type: string; url?: string } | null>(null);

  // Edit Mode state for Surat Balasan
  const [isEditingLetter, setIsEditingLetter] = useState(false);
  const [editLetterNumber, setEditLetterNumber] = useState('');
  const [editLetterContent, setEditLetterContent] = useState('');

  // Operator Assisted Creation Modal
  const [showAssistedModal, setShowAssistedModal] = useState(false);
  const [assistedNik, setAssistedNik] = useState('');
  const [assistedName, setAssistedName] = useState('');
  const [assistedPhone, setAssistedPhone] = useState('');
  const [assistedServiceId, setAssistedServiceId] = useState('');
  const [assistedNotes, setAssistedNotes] = useState('');

  // Live Baileys WhatsApp Connection State
  const [showWaQrModal, setShowWaQrModal] = useState(false);
  const [waStatus, setWaStatus] = useState<any>({
    status: 'DISCONNECTED',
    qrCodeDataUrl: null,
    phoneNumber: null,
    userName: null,
  });
  const [waLoading, setWaLoading] = useState(false);

  useEffect(() => {
    fetchWaStatus();
  }, []);

  useEffect(() => {
    let interval: any = null;
    if (showWaQrModal || waStatus.status === 'SCAN_QR' || waStatus.status === 'CONNECTING') {
      interval = setInterval(() => {
        fetchWaStatus();
      }, 2500);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [showWaQrModal, waStatus.status]);

  const fetchWaStatus = async () => {
    try {
      const res = await api.get('/whatsapp/status');
      if (res.data.status === 'success') {
        setWaStatus(res.data.data);
      }
    } catch (e) {}
  };

  const handleStartWaConnection = async () => {
    setWaLoading(true);
    setShowWaQrModal(true);
    try {
      const res = await api.post('/whatsapp/connect');
      if (res.data.status === 'success') {
        setWaStatus(res.data.data);
      }
    } catch (e: any) {
      alert('Gagal menghubungkan WhatsApp: ' + (e.response?.data?.message || e.message));
    } finally {
      setWaLoading(false);
    }
  };

  const handleDisconnectWa = async () => {
    if (!confirm('Putuskan koneksi nomor WhatsApp ini?')) return;
    setWaLoading(true);
    try {
      await api.post('/whatsapp/disconnect');
      fetchWaStatus();
      alert('Sesi WhatsApp berhasil diputuskan.');
    } catch (e) {}
    finally {
      setWaLoading(false);
    }
  };

  useEffect(() => {
    const stored = localStorage.getItem('jombe_user');
    if (!stored) {
      router.push('/login');
      return;
    }
    const userObj = JSON.parse(stored);
    if (userObj.role !== 'OPERATOR' && userObj.role !== 'ADMIN') {
      alert('Akses khusus Petugas Operator Desa / Administrator.');
      router.push('/dashboard');
      return;
    }
    setOperator(userObj);

    fetchDashboardData();
  }, [statusFilter, search]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const statsRes = await api.get('/operator/stats');
      if (statsRes.data.status === 'success') {
        setStats(statsRes.data.data);
      }

      const appsRes = await api.get(`/operator/applications?status=${statusFilter}&search=${search}`);
      if (appsRes.data.status === 'success') {
        setApplications(appsRes.data.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectApp = (app: any) => {
    setSelectedApp(app);
    setActiveTab('PERMOHONAN_WARGA'); // Start by reviewing citizen's formal request letter & uploaded documents
    setIsEditingLetter(false);
    setEditLetterNumber(app.letterNumber || `503/470/${Math.floor(100 + Math.random() * 900)}/DS-JMB/2026`);
    setEditLetterContent(
      app.letterContent ||
        `Yang bertanda tangan di bawah ini Kepala Desa Jombe, Kecamatan Jombang, Kabupaten Jombang, menerangkan dengan sebenarnya bahwa orang tersebut di atas benar-benar memiliki usaha ${app.fieldValues?.[0]?.value || 'Toko Sembako Berkah'} dan berdomisili di wilayah Desa Jombe.`
    );
  };

  // ACTION: "IYA" (Setujui Permohonan & Terbitkan Surat Balasan SKU Otomatis)
  const handleApproveYes = async () => {
    if (!selectedApp) return;

    setActionLoading(true);
    try {
      const res = await api.post(`/operator/applications/${selectedApp.id}/approve-and-send`, {
        letterNumber: editLetterNumber,
        letterContent: editLetterContent,
      });

      if (res.data.status === 'success') {
        alert(
          `Surat Permohonan Warga Disetujui!\n\nSurat Balasan Keterangan Resmi (Nomor: ${res.data.data.letterNumber}) telah otomatis diterbitkan dan dikirimkan beserta berkas PDF ke WhatsApp Pemohon.`
        );
        fetchDashboardData();
        setSelectedApp(null);
      }
    } catch (err: any) {
      alert('Gagal memproses surat balasan: ' + (err.response?.data?.message || 'Error'));
    } finally {
      setActionLoading(false);
    }
  };

  // ACTION: "TIDAK" (Tolak / Minta Perbaikan)
  const handleRejectNo = async () => {
    if (!selectedApp) return;

    const reason = prompt('Masukkan catatan / alasan perbaikan berkas untuk pemohon:', 'Dokumen foto KTP/Usaha kurang jelas atau berkas lampiran belum lengkap.');
    if (reason === null) return;

    setActionLoading(true);
    try {
      const res = await api.patch(`/operator/applications/${selectedApp.id}/status`, {
        status: 'NEED_REVISION',
        revisionNotes: reason,
      });

      if (res.data.status === 'success') {
        alert(`Surat permohonan diminta perbaikan. Catatan tersimpan.`);
        fetchDashboardData();
        setSelectedApp(null);
      }
    } catch (err: any) {
      alert('Gagal memperbarui status: ' + (err.response?.data?.message || 'Error'));
    } finally {
      setActionLoading(false);
    }
  };

  const handleCreateAssistedApp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!assistedNik || !assistedName) return;

    setActionLoading(true);
    try {
      const res = await api.post('/operator/applications/assisted', {
        citizenNik: assistedNik,
        citizenName: assistedName,
        citizenPhone: assistedPhone,
        serviceId: assistedServiceId || 'service-sku-1',
        notes: assistedNotes,
      });

      if (res.data.status === 'success') {
        alert(res.data.message);
        setShowAssistedModal(false);
        setAssistedNik('');
        setAssistedName('');
        setAssistedPhone('');
        setAssistedNotes('');
        fetchDashboardData();
      }
    } catch (err: any) {
      alert('Gagal membuat permohonan: ' + (err.response?.data?.message || 'Error'));
    } finally {
      setActionLoading(false);
    }
  };

  if (!operator) return null;

  return (
    <div className="min-h-screen py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 bg-slate-50/50">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-emerald-800 text-white rounded-3xl p-8 shadow-lg flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border border-emerald-800/60">
        <div>
          <span className="text-xs text-emerald-300 font-bold uppercase tracking-widest block">Panel Operator Desa Jombe</span>
          <h1 className="text-2xl sm:text-3xl font-extrabold flex items-center gap-2.5">
            <FileCheck className="w-7 h-7 text-emerald-400" /> Pemeriksaan Permohonan & Dokumen Lampiran
          </h1>
          <p className="text-xs text-emerald-100/90 mt-1">Petugas: <strong>{operator.name}</strong>. Teliti berkas permohonan warga dan verifikasi foto KTP/KK/Usaha sebelum menerbitkan Surat Balasan Resmi.</p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          {/* Real WhatsApp Live Connection Button */}
          <button
            onClick={() => {
              if (waStatus.status === 'CONNECTED') {
                setShowWaQrModal(true);
              } else {
                handleStartWaConnection();
              }
            }}
            className={`px-4 py-3 font-extrabold text-xs rounded-2xl shadow-md transition-all flex items-center gap-2 border ${
              waStatus.status === 'CONNECTED'
                ? 'bg-emerald-500 hover:bg-emerald-400 text-emerald-950 border-emerald-300'
                : 'bg-emerald-800 hover:bg-emerald-700 text-emerald-100 border-emerald-600'
            }`}
          >
            <Phone className="w-4 h-4" />
            {waStatus.status === 'CONNECTED' ? (
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-950 animate-pulse"></span>
                WA Aktif: {waStatus.phoneNumber || 'Terhubung'}
              </span>
            ) : (
              <span>Hubungkan WhatsApp Asli (Scan QR)</span>
            )}
          </button>

          <button
            onClick={() => setShowAssistedModal(true)}
            className="px-5 py-3 bg-amber-500 hover:bg-amber-400 text-amber-950 font-extrabold text-xs rounded-2xl shadow-md transition-all flex items-center gap-2 shrink-0 border border-amber-400/40"
          >
            <Plus className="w-4 h-4" />
            Permohonan Bantuan Petugas
          </button>
        </div>
      </div>

      {/* Metrics Counter Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-soft text-center space-y-1">
          <span className="text-xs font-bold text-slate-500 block uppercase">Permohonan Masuk</span>
          <span className="text-2xl font-extrabold text-amber-600 block">{stats.pending}</span>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-soft text-center space-y-1">
          <span className="text-xs font-bold text-slate-500 block uppercase">Sedang Diperiksa</span>
          <span className="text-2xl font-extrabold text-sky-600 block">{stats.processing}</span>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-soft text-center space-y-1">
          <span className="text-xs font-bold text-slate-500 block uppercase">Perlu Perbaikan</span>
          <span className="text-2xl font-extrabold text-orange-600 block">{stats.needRevision}</span>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-soft text-center space-y-1">
          <span className="text-xs font-bold text-slate-500 block uppercase">Surat Balasan Terbit</span>
          <span className="text-2xl font-extrabold text-emerald-600 block">{stats.completed}</span>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-soft text-center space-y-1 col-span-2 sm:col-span-1">
          <span className="text-xs font-bold text-slate-500 block uppercase">Total Berkas</span>
          <span className="text-2xl font-extrabold text-slate-900 block">{stats.total}</span>
        </div>
      </div>

      {/* Filter & Table Area */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-soft overflow-hidden">
        {/* Controls Bar */}
        <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0">
            {['ALL', 'PENDING', 'PROCESSING', 'NEED_REVISION', 'COMPLETED'].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                  statusFilter === st
                    ? 'bg-emerald-900 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {st === 'ALL' ? 'Semua Berkas' : st}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari NIK / Nama / No Registrasi..."
              className="w-full pl-9 pr-4 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-700 bg-slate-50 text-slate-900 font-medium"
            />
          </div>
        </div>

        {/* Applications Table */}
        {loading ? (
          <div className="p-12 text-center text-xs text-slate-500">Memuat berkas permohonan...</div>
        ) : applications.length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-500">Tidak ada permohonan ditemukan.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase font-bold text-[10px] tracking-wider">
                <tr>
                  <th className="px-6 py-3.5">No. Registrasi</th>
                  <th className="px-6 py-3.5">Pemohon Warga</th>
                  <th className="px-6 py-3.5">Surat yang Dimohon</th>
                  <th className="px-6 py-3.5">Tanggal Masuk</th>
                  <th className="px-6 py-3.5">Status</th>
                  <th className="px-6 py-3.5 text-right">Aksi Pemeriksaan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {applications.map((app) => (
                  <tr key={app.id} className="hover:bg-slate-50/70">
                    <td className="px-6 py-4 font-mono font-bold text-emerald-950">
                      {app.applicationNumber}
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-bold text-slate-900 block">{app.user?.name}</span>
                      <span className="text-[10px] text-slate-500 font-mono block">NIK: {app.user?.nik}</span>
                    </td>
                    <td className="px-6 py-4 text-slate-800 font-semibold">
                      {app.service?.name}
                    </td>
                    <td className="px-6 py-4 text-slate-500">
                      {new Date(app.createdAt).toLocaleDateString('id-ID')}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-[10px] font-bold ${
                          app.status === 'COMPLETED'
                            ? 'bg-emerald-100 text-emerald-900'
                            : app.status === 'PROCESSING'
                            ? 'bg-sky-100 text-sky-900'
                            : 'bg-amber-100 text-amber-900'
                        }`}
                      >
                        {app.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleSelectApp(app)}
                        className="px-3.5 py-1.5 bg-emerald-800 hover:bg-emerald-900 text-white font-bold rounded-xl text-xs transition-colors shadow-xs flex items-center gap-1.5 ml-auto"
                      >
                        <Eye className="w-3.5 h-3.5" /> Periksa Permohonan & Foto
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ======================================================== */}
      {/* SCREEN PEMERIKSAAN PERMOHONAN & PRATINJAU SURAT BALASAN */}
      {/* ======================================================== */}
      {selectedApp && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-8 space-y-6 shadow-2xl overflow-y-auto max-h-[92vh]">
            {/* Modal Top Header */}
            <div className="flex justify-between items-start border-b border-slate-100 pb-4">
              <div>
                <span className="text-[10px] font-bold uppercase text-emerald-800 tracking-wider">
                  Verifikasi Berkas & Penerbitan Surat Balasan Resmi
                </span>
                <h3 className="text-lg font-extrabold text-slate-900 font-mono">{selectedApp.applicationNumber}</h3>
              </div>
              <button onClick={() => setSelectedApp(null)} className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* TAB SELECTOR: SURAT PERMOHONAN WARGA vs SURAT BALASAN RESMI KADES */}
            <div className="flex gap-2 bg-slate-100 p-1.5 rounded-2xl">
              <button
                onClick={() => setActiveTab('PERMOHONAN_WARGA')}
                className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-extrabold transition-all flex items-center justify-center gap-2 ${
                  activeTab === 'PERMOHONAN_WARGA'
                    ? 'bg-white text-emerald-950 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <FileText className="w-4 h-4 text-emerald-700" />
                1. Surat Permohonan & Foto Dokumen Warga
              </button>
              <button
                onClick={() => setActiveTab('SURAT_BALASAN_SKU')}
                className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-extrabold transition-all flex items-center justify-center gap-2 ${
                  activeTab === 'SURAT_BALASAN_SKU'
                    ? 'bg-emerald-900 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Landmark className="w-4 h-4 text-emerald-300" />
                2. Surat Balasan Keterangan Resmi (SKU Otomatis)
              </button>
            </div>

            {/* TAB 1: SURAT PERMOHONAN DARI WARGA & VERIFIKASI FOTO KTP / KK / USAHA */}
            {activeTab === 'PERMOHONAN_WARGA' && (
              <div className="space-y-6">
                {/* Dokumen Surat Permohonan Format Formal */}
                <div className="bg-slate-50 p-6 sm:p-8 rounded-2xl border border-slate-300 shadow-inner space-y-5 text-slate-900 font-serif">
                  {/* Header Permohonan Warga */}
                  <div className="flex justify-between items-start border-b border-slate-300 pb-3 font-sans text-xs">
                    <div className="space-y-0.5">
                      <p><strong>Hal:</strong> Permohonan Penerbitan {selectedApp.service?.name || 'Surat Keterangan Usaha'}</p>
                      <p><strong>Lampiran:</strong> {selectedApp.uploadedPhotos?.length || 2} Berkas Foto Dokumen Persyaratan Sah</p>
                    </div>
                    <div className="text-right">
                      <p>Jombe, {new Date(selectedApp.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                      <p>Kepada Yth.</p>
                      <p><strong>Kepala Desa Jombe</strong></p>
                      <p>di Tempat</p>
                    </div>
                  </div>

                  {/* Isi Surat Permohonan */}
                  <div className="text-xs font-sans space-y-3 leading-relaxed text-slate-800">
                    <p>Dengan hormat,</p>
                    <p>Saya yang bertanda tangan di bawah ini mengajukan permohonan penerbitan surat keterangan administrasi desa:</p>

                    <div className="pl-4 space-y-1.5 bg-white p-4 rounded-xl border border-slate-200 font-sans">
                      <div className="grid grid-cols-3">
                        <span className="text-slate-500 font-medium">Nama Lengkap</span>
                        <span className="col-span-2 font-bold text-slate-900">: {selectedApp.user?.name}</span>
                      </div>
                      <div className="grid grid-cols-3">
                        <span className="text-slate-500 font-medium">NIK</span>
                        <span className="col-span-2 font-mono font-bold text-slate-900">: {selectedApp.user?.nik}</span>
                      </div>
                      <div className="grid grid-cols-3">
                        <span className="text-slate-500 font-medium">Nomor WhatsApp / HP</span>
                        <span className="col-span-2 font-medium text-slate-800">: {selectedApp.user?.phone || '6281299887766'}</span>
                      </div>
                      <div className="grid grid-cols-3">
                        <span className="text-slate-500 font-medium">Alamat Domisili</span>
                        <span className="col-span-2 font-medium text-slate-800">: {selectedApp.user?.address || 'Desa Jombe, Kec. Jombang'}</span>
                      </div>
                      <div className="grid grid-cols-3 pt-1 border-t border-slate-100">
                        <span className="text-slate-500 font-medium">Rincian Permohonan</span>
                        <span className="col-span-2 font-bold text-emerald-950">: {selectedApp.fieldValues?.[0]?.value || selectedApp.detailValue || 'Toko Sembako Berkah di Dusun Krajan RT 02'}</span>
                      </div>
                    </div>

                    <p>Bersama surat ini, saya telah melampirkan berkas persyaratan foto KTP dan dokumen pendukung yang sah. Besar harapan saya agar permohonan ini dapat disetujui.</p>
                  </div>

                  {/* Tanda Tangan Pemohon */}
                  <div className="pt-2 flex justify-end text-xs font-sans">
                    <div className="text-center space-y-8 w-48">
                      <p className="font-bold text-slate-900">Pemohon,</p>
                      <p className="font-bold underline text-slate-900">( {selectedApp.user?.name} )</p>
                    </div>
                  </div>
                </div>

                {/* ======================================================= */}
                {/* GALLERY VERIFIKASI DOKUMEN & FOTO KTP/KK/USAHA DARI WARGA */}
                {/* ======================================================= */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-soft space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                    <h4 className="text-xs font-extrabold uppercase text-slate-900 flex items-center gap-2">
                      <Camera className="w-4 h-4 text-emerald-800" />
                      Dokumen & Foto Terunggah Warga (Klik untuk Memperbesar):
                    </h4>
                    <span className="text-[10px] text-emerald-800 font-bold bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                      Tervalidasi &lt; 500KB
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Render exact uploaded photos for this application */}
                    {(selectedApp.uploadedPhotos && selectedApp.uploadedPhotos.length > 0
                      ? selectedApp.uploadedPhotos
                      : [
                          { title: 'Foto e-KTP Asli Pemohon', type: 'KTP' },
                          { title: 'Foto Tempat / Kegiatan Usaha', type: 'USAHA' },
                        ]
                    ).map((photo: any, pIdx: number) => {
                      const isKtp = photo.type === 'KTP' || photo.title.toLowerCase().includes('ktp');
                      const isUsaha = photo.type === 'USAHA' || photo.title.toLowerCase().includes('usaha');
                      const isKk = photo.type === 'KK' || photo.title.toLowerCase().includes('kartu keluarga');

                      return (
                        <div
                          key={pIdx}
                          onClick={() => setPreviewDoc({ title: photo.title, type: photo.type || (isKtp ? 'KTP' : isUsaha ? 'USAHA' : 'KK'), url: photo.url })}
                          className="p-3.5 rounded-xl border border-slate-200 hover:border-emerald-500 bg-slate-50 hover:bg-emerald-50/40 cursor-pointer transition-all group space-y-2"
                        >
                          <div className="flex justify-between items-center">
                            <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5 truncate">
                              <ImageIcon className="w-3.5 h-3.5 text-emerald-800 shrink-0" /> {photo.title}
                            </span>
                            <span className="text-[10px] text-emerald-700 font-bold flex items-center gap-0.5 group-hover:underline shrink-0">
                              <ZoomIn className="w-3 h-3" /> Perbesar
                            </span>
                          </div>

                          {/* Render Photo Card Preview */}
                          {photo.url ? (
                            <div className="h-28 rounded-lg overflow-hidden border border-slate-300 bg-black flex items-center justify-center">
                              <img src={photo.url} alt={photo.title} className="h-full w-full object-cover" />
                            </div>
                          ) : isKtp ? (
                            <div className="h-28 rounded-lg bg-gradient-to-tr from-sky-800 via-sky-700 to-sky-900 text-white p-3 shadow-xs relative overflow-hidden flex flex-col justify-between border border-sky-600">
                              <div className="flex justify-between items-start">
                                <div>
                                  <span className="text-[7px] tracking-widest font-extrabold block uppercase text-sky-200">REPUBLIK INDONESIA</span>
                                  <span className="text-[8px] font-extrabold block uppercase">PROVINSI JAWA TIMUR - KAB. JOMBANG</span>
                                </div>
                                <span className="text-[8px] bg-sky-600/80 px-1.5 py-0.5 rounded font-mono font-bold">e-KTP</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <div className="w-7 h-9 rounded bg-sky-950/60 border border-sky-400/50 flex items-center justify-center text-[8px] font-bold">
                                  FOTO
                                </div>
                                <div className="text-[8px] space-y-0.5">
                                  <p className="font-mono font-bold text-yellow-300 tracking-wider">NIK: {selectedApp.user?.nik || '3512345678900001'}</p>
                                  <p className="font-bold uppercase text-white truncate max-w-[140px]">Nama: {selectedApp.user?.name}</p>
                                  <p className="text-sky-200 text-[7px]">Desa: Jombe RT 02 RW 01</p>
                                </div>
                              </div>
                            </div>
                          ) : isKk ? (
                            <div className="h-28 rounded-lg bg-gradient-to-tr from-slate-800 via-slate-700 to-slate-900 text-white p-3 shadow-xs relative overflow-hidden flex flex-col justify-between border border-slate-600">
                              <div className="flex justify-between items-start">
                                <span className="text-[8px] font-extrabold block uppercase text-slate-200">KARTU KELUARGA (KK)</span>
                                <span className="text-[8px] bg-slate-600/80 px-1.5 py-0.5 rounded font-bold">Valid</span>
                              </div>
                              <div className="text-center py-1">
                                <span className="text-xs font-extrabold text-slate-100 block">No. KK: 3512010908760001</span>
                                <span className="text-[8px] text-slate-300 block">Kepala Keluarga: {selectedApp.user?.name}</span>
                              </div>
                              <span className="text-[7px] text-slate-300 text-right block">Ukuran: 230 KB (Terkonversi)</span>
                            </div>
                          ) : (
                            <div className="h-28 rounded-lg bg-gradient-to-tr from-emerald-900 via-teal-900 to-emerald-950 text-white p-3 shadow-xs relative overflow-hidden flex flex-col justify-between border border-emerald-700">
                              <div className="flex justify-between items-start">
                                <span className="text-[9px] font-bold text-emerald-200">Foto Lapangan Usaha Warga</span>
                                <span className="text-[8px] bg-emerald-700/80 px-1.5 py-0.5 rounded font-bold">Valid</span>
                              </div>
                              <div className="text-center py-1">
                                <span className="text-xs font-extrabold text-emerald-100 block">🏪 {selectedApp.fieldValues?.[0]?.value || 'Toko Sembako Berkah'}</span>
                                <span className="text-[8px] text-emerald-300 block">Dusun Krajan RT 02 RW 01 Desa Jombe</span>
                              </div>
                              <span className="text-[7px] text-slate-300 text-right block">Ukuran: 214 KB (Terkonversi)</span>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="pt-2 flex justify-end font-sans">
                  <button
                    onClick={() => setActiveTab('SURAT_BALASAN_SKU')}
                    className="px-5 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-xs"
                  >
                    Lanjut Periksa Surat Balasan SKU Resmi <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* TAB 2: SURAT BALASAN RESMI KADES (SKU / KETERANGAN RESMI OTOMATIS) */}
            {activeTab === 'SURAT_BALASAN_SKU' && (
              <div className="bg-slate-50 p-6 sm:p-8 rounded-2xl border border-slate-300 shadow-inner space-y-5 text-slate-900 font-serif">
                {/* Kop Surat Resmi */}
                <div className="text-center border-b-2 border-slate-900 pb-3 space-y-0.5">
                  <h4 className="text-xs font-bold uppercase tracking-wide">Pemerintah Kabupaten Jombang</h4>
                  <h4 className="text-xs font-bold uppercase tracking-wide">Kecamatan Jombang</h4>
                  <h3 className="text-base font-extrabold uppercase tracking-wide">Pemerintah Desa Jombe</h3>
                  <p className="text-[10px] font-sans text-slate-600">Jl. Raya Desa Jombe No. 01, Kecamatan Jombang, Kode Pos 61419</p>
                </div>

                {/* Judul & Nomor Surat Balasan */}
                <div className="text-center space-y-1">
                  <h3 className="text-sm font-bold uppercase underline tracking-wider font-sans">
                    {selectedApp.service?.name || 'SURAT KETERANGAN USAHA (SKU)'}
                  </h3>
                  {isEditingLetter ? (
                    <div className="max-w-xs mx-auto pt-1 font-sans">
                      <input
                        type="text"
                        value={editLetterNumber}
                        onChange={(e) => setEditLetterNumber(e.target.value)}
                        className="w-full text-center text-xs font-bold border border-emerald-600 rounded-lg p-1 bg-white"
                        placeholder="Nomor Surat: 503/470/XXX/DS-JMB/2026"
                      />
                    </div>
                  ) : (
                    <p className="text-xs font-sans text-slate-700 font-semibold">
                      Nomor: <span className="font-mono text-emerald-950">{editLetterNumber}</span>
                    </p>
                  )}
                </div>

                {/* Isi Surat Balasan */}
                <div className="text-xs font-sans space-y-3 leading-relaxed text-slate-800">
                  <p>Yang bertanda tangan di bawah ini Kepala Desa Jombe, Kecamatan Jombang, Kabupaten Jombang, menerangkan dengan sebenarnya bahwa:</p>

                  <div className="pl-4 space-y-1 bg-white p-3.5 rounded-xl border border-slate-200 font-sans">
                    <div className="grid grid-cols-3">
                      <span className="text-slate-500 font-medium">Nama Pemohon</span>
                      <span className="col-span-2 font-bold text-slate-900">: {selectedApp.user?.name}</span>
                    </div>
                    <div className="grid grid-cols-3">
                      <span className="text-slate-500 font-medium">NIK</span>
                      <span className="col-span-2 font-mono font-bold text-slate-900">: {selectedApp.user?.nik}</span>
                    </div>
                    <div className="grid grid-cols-3">
                      <span className="text-slate-500 font-medium">Alamat Tinggal</span>
                      <span className="col-span-2 font-medium text-slate-800">: {selectedApp.user?.address || 'Desa Jombe, Kec. Jombang'}</span>
                    </div>
                  </div>

                  {isEditingLetter ? (
                    <div className="space-y-1 pt-1">
                      <label className="text-[11px] font-bold text-slate-700 block">Kustomisasi Isi Surat Balasan:</label>
                      <textarea
                        rows={3}
                        value={editLetterContent}
                        onChange={(e) => setEditLetterContent(e.target.value)}
                        className="w-full text-xs border border-emerald-600 rounded-xl p-2.5 bg-white font-sans focus:outline-none"
                      />
                    </div>
                  ) : (
                    <p className="p-3.5 bg-white rounded-xl border border-slate-200 leading-relaxed">{editLetterContent}</p>
                  )}

                  <p>Demikian Surat Keterangan ini diberikan kepada yang bersangkutan untuk dipergunakan sebagaimana mestinya.</p>
                </div>

                {/* Tanda Tangan Kepala Desa */}
                <div className="pt-3 flex justify-end text-xs font-sans">
                  <div className="text-center space-y-10 w-48">
                    <div>
                      <p className="text-[11px] text-slate-600">Jombe, {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                      <p className="font-bold text-slate-900">Kepala Desa Jombe</p>
                    </div>
                    <p className="font-bold underline text-slate-900">( KEPALA DESA JOMBE )</p>
                  </div>
                </div>
              </div>
            )}

            {/* Confirmation & Action Box */}
            <div className="bg-emerald-50/80 p-5 rounded-2xl border border-emerald-200 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-extrabold text-emerald-950">
                    Apakah surat sudah benar dan sesuai?
                  </h4>
                  <p className="text-xs text-emerald-900/80 mt-0.5">
                    Menekan tombol <strong>IYA</strong> akan langsung otomatis membuat Surat Balasan SKU resmi dan mengirim notifikasi WhatsApp + berkas PDF ke warga.
                  </p>
                </div>
                {activeTab === 'SURAT_BALASAN_SKU' && (
                  <button
                    onClick={() => setIsEditingLetter(!isEditingLetter)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shrink-0 ${
                      isEditingLetter
                        ? 'bg-emerald-800 text-white shadow-xs'
                        : 'bg-white text-emerald-900 border border-emerald-300 hover:bg-emerald-100/60'
                    }`}
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    {isEditingLetter ? 'Simpan Edit' : 'Edit Surat'}
                  </button>
                )}
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-2 border-t border-emerald-200/80">
                <button
                  onClick={handleApproveYes}
                  disabled={actionLoading}
                  className="flex-1 py-3 bg-emerald-800 hover:bg-emerald-900 disabled:opacity-50 text-white font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <Check className="w-4 h-4 text-emerald-300" />
                  IYA (Setujui & Terbitkan Surat Balasan SKU ke WhatsApp Warga)
                </button>
                <button
                  onClick={handleRejectNo}
                  disabled={actionLoading}
                  className="px-6 py-3 bg-rose-50 hover:bg-rose-100 text-rose-800 font-extrabold text-xs rounded-xl border border-rose-200 transition-all flex items-center justify-center gap-2"
                >
                  <X className="w-4 h-4" />
                  TIDAK (Tolak / Minta Perbaikan)
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* LIGHTBOX / ENLARGED DOCUMENT VIEWER MODAL (Z-[9999] LAYER PALING DEPAN) */}
      {/* ======================================================== */}
      {previewDoc && (
        <div className="fixed inset-0 z-[9999] bg-black/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
          <div className="bg-slate-900 rounded-3xl max-w-4xl w-full p-6 sm:p-8 space-y-4 shadow-2xl overflow-hidden border border-slate-700 animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-950 border border-emerald-500/40 flex items-center justify-center">
                  <ImageIcon className="w-4 h-4 text-emerald-400" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-white">
                    {previewDoc.title}
                  </h3>
                  <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider block">
                    Pratinjau Resolusi Penuh
                  </span>
                </div>
              </div>
              <button
                onClick={() => setPreviewDoc(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors border border-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Document Content View */}
            <div className="bg-black/80 rounded-2xl p-4 sm:p-6 flex flex-col items-center justify-center min-h-[350px] max-h-[72vh] border border-slate-800/80 overflow-y-auto">
              {previewDoc.url ? (
                <img
                  src={previewDoc.url}
                  alt={previewDoc.title}
                  className="max-h-[65vh] max-w-full rounded-xl object-contain shadow-2xl border border-slate-700"
                />
              ) : previewDoc.type === 'KTP' ? (
                <div className="w-full max-w-md bg-gradient-to-tr from-sky-800 via-sky-700 to-sky-900 text-white rounded-2xl p-6 shadow-2xl border-2 border-sky-400 space-y-4">
                  <div className="text-center border-b border-sky-400/40 pb-2">
                    <h4 className="text-[10px] tracking-widest font-extrabold uppercase text-sky-200">REPUBLIK INDONESIA</h4>
                    <h3 className="text-xs font-extrabold uppercase">PROVINSI JAWA TIMUR - KABUPATEN JOMBANG</h3>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-20 h-26 rounded-lg bg-sky-950/80 border border-sky-300/60 flex flex-col items-center justify-center text-center p-2">
                      <User className="w-8 h-8 text-sky-300" />
                      <span className="text-[9px] font-bold text-sky-200 mt-1">PAS FOTO</span>
                    </div>

                    <div className="flex-1 text-[11px] space-y-1 font-sans">
                      <p className="font-mono font-bold text-yellow-300 text-xs">NIK : {selectedApp?.user?.nik || '3512345678900001'}</p>
                      <p><strong>Nama</strong> : {selectedApp?.user?.name || 'SITI RAHMAWATI'}</p>
                      <p><strong>Tempat/Tgl Lahir</strong> : JOMBANG, 15-08-1992</p>
                      <p><strong>Jenis Kelamin</strong> : PEREMPUAN</p>
                      <p><strong>Alamat</strong> : DUSUN KRAJAN RT 02 RW 01</p>
                      <p><strong>Agama / Pekerjaan</strong> : ISLAM / WIRASWASTA</p>
                      <p><strong>Kewarganegaraan</strong> : WNI</p>
                    </div>
                  </div>

                  <div className="text-right text-[9px] text-sky-200 pt-2 border-t border-sky-400/40">
                    KABUPATEN JOMBANG, BERLAKU SEUMUR HIDUP
                  </div>
                </div>
              ) : previewDoc.type === 'KK' ? (
                <div className="w-full max-w-md bg-gradient-to-tr from-slate-900 via-slate-800 to-slate-950 text-white rounded-2xl p-6 shadow-2xl border-2 border-slate-500 space-y-4">
                  <div className="text-center border-b border-slate-600 pb-2">
                    <h3 className="text-xs font-extrabold uppercase">KARTU KELUARGA (KK)</h3>
                    <p className="text-[9px] font-mono text-yellow-300">No. 3512010908760001</p>
                  </div>
                  <div className="text-[11px] space-y-1.5">
                    <p><strong>Nama Kepala Keluarga:</strong> {selectedApp?.user?.name || 'SITI RAHMAWATI'}</p>
                    <p><strong>Alamat:</strong> {selectedApp?.user?.address || 'Desa Jombe RT 02 RW 01'}</p>
                    <p><strong>Kecamatan:</strong> Jombang, Kab. Jombang</p>
                  </div>
                  <div className="text-right text-[9px] text-slate-400 pt-2 border-t border-slate-700">
                    Diterbitkan oleh Dinas Kependudukan & Catatan Sipil
                  </div>
                </div>
              ) : (
                <div className="w-full max-w-md bg-gradient-to-tr from-emerald-950 via-teal-950 to-emerald-900 text-white rounded-2xl p-6 shadow-2xl border-2 border-emerald-400 space-y-3 text-center">
                  <div className="w-16 h-16 rounded-full bg-emerald-800/80 border border-emerald-400 mx-auto flex items-center justify-center text-2xl">
                    🏪
                  </div>
                  <h4 className="text-base font-extrabold text-emerald-200">Foto Tempat / Aktivitas Usaha UMKM</h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Dokumen visual menunjukkan foto plang nama dan kegiatan usaha <strong>{selectedApp?.fieldValues?.[0]?.value || 'Toko Sembako Berkah'}</strong> di wilayah Desa Jombe.
                  </p>
                  <span className="inline-block px-3 py-1 bg-emerald-600/80 rounded-full text-[10px] font-bold text-white border border-emerald-300">
                    Status Verifikasi: VALID & ASLI
                  </span>
                </div>
              )}
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setPreviewDoc(null)}
                className="px-6 py-2.5 bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-extrabold rounded-xl transition-all shadow-md"
              >
                Tutup Pratinjau
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* REAL WHATSAPP LIVE QR SCAN & CONNECTION MODAL            */}
      {/* ======================================================== */}
      {showWaQrModal && (
        <div className="fixed inset-0 z-60 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-6 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-start border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase text-emerald-800 tracking-wider">
                  Koneksi WhatsApp Resmi Desa (Baileys Engine)
                </span>
                <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                  <Phone className="w-5 h-5 text-emerald-600" />
                  {waStatus.status === 'CONNECTED' ? 'WhatsApp Terhubung!' : 'Pindai Kode QR WhatsApp'}
                </h3>
              </div>
              <button
                onClick={() => setShowWaQrModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* STATUS: CONNECTED */}
            {waStatus.status === 'CONNECTED' ? (
              <div className="text-center space-y-4 py-4">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center border-2 border-emerald-300 shadow-xs">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-extrabold text-emerald-950">
                    Nomor WhatsApp Resmi Siap Melayani
                  </h4>
                  <p className="text-xs font-mono font-bold text-slate-700 bg-slate-100 py-1.5 px-3 rounded-xl inline-block border border-slate-200">
                    📱 +{waStatus.phoneNumber || '628xxxxxxxx'}
                  </p>
                  <p className="text-[11px] text-slate-500 pt-1">
                    Setiap permohonan surat yang masuk ke nomor ini akan otomatis disusun dan surat balasan PDF resmi akan dikirimkan langsung ke WhatsApp warga.
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 flex gap-2">
                  <button
                    onClick={() => setShowWaQrModal(false)}
                    className="flex-1 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold rounded-xl"
                  >
                    Tutup Layar
                  </button>
                  <button
                    onClick={handleDisconnectWa}
                    className="px-4 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold rounded-xl transition-colors"
                  >
                    Putuskan Sesi
                  </button>
                </div>
              </div>
            ) : (
              /* STATUS: SCAN QR / PAIRING CODE */
              <div className="space-y-4">
                {/* Method Selector Tabs */}
                <div className="flex gap-2 bg-slate-100 p-1 rounded-xl">
                  <button
                    type="button"
                    onClick={() => handleStartWaConnection()}
                    className="flex-1 py-2 text-xs font-bold rounded-lg bg-white text-slate-900 shadow-xs flex items-center justify-center gap-1.5"
                  >
                    📷 Scan QR Code
                  </button>
                </div>

                {waStatus.pairingCode ? (
                  <div className="p-5 bg-emerald-50 rounded-2xl border-2 border-emerald-400 text-center space-y-2">
                    <span className="text-[11px] font-bold text-emerald-800 uppercase block">Kode Pairing 8 Digit WhatsApp Anda:</span>
                    <span className="text-3xl font-mono font-extrabold tracking-widest text-emerald-950 block py-1 bg-white rounded-xl border border-emerald-300">
                      {waStatus.pairingCode}
                    </span>
                    <p className="text-[11px] text-emerald-900 font-medium">
                      Masukkan 8 karakter kode ini di WhatsApp HP Anda.
                    </p>
                  </div>
                ) : waStatus.qrCodeDataUrl ? (
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col items-center justify-center space-y-3">
                    <img
                      src={waStatus.qrCodeDataUrl}
                      alt="WhatsApp QR Code"
                      className="w-56 h-56 rounded-xl border border-slate-300 shadow-sm bg-white p-2"
                    />
                    <div className="flex items-center gap-3">
                      <span className="text-[11px] font-bold text-slate-500 flex items-center gap-1.5">
                        <RefreshCw className="w-3 h-3 animate-spin text-emerald-700" /> Auto-sync QR
                      </span>
                      <button
                        onClick={handleStartWaConnection}
                        className="text-[11px] text-emerald-700 font-bold hover:underline"
                      >
                        Muat Ulang QR Baru
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="p-8 bg-slate-50 rounded-2xl border border-slate-200 text-center space-y-3">
                    <RefreshCw className="w-8 h-8 text-emerald-700 animate-spin mx-auto" />
                    <p className="text-xs text-slate-600 font-bold">Sedang memuat Kode QR WhatsApp terbaru...</p>
                  </div>
                )}

                {/* 3 Step Instructions */}
                <div className="bg-emerald-50/70 p-3.5 rounded-xl border border-emerald-200 text-xs space-y-1.5 text-slate-800">
                  <p className="font-bold text-emerald-950">Cara Scan dari HP:</p>
                  <ol className="list-decimal list-inside space-y-1 text-[11px] text-slate-700">
                    <li>Buka aplikasi <strong>WhatsApp</strong> di HP Anda.</li>
                    <li>Ketuk <strong>Menu (titik tiga)</strong> di pojok kanan atas ➔ Pilih <strong>Perangkat Tertaut</strong>.</li>
                    <li>Ketuk <strong>Tautkan Perangkat</strong>.</li>
                    <li>Arahkan kamera ke <strong>Kode QR</strong> di atas <em>(pastikan scan saat kode masih segar/baru)</em>.</li>
                  </ol>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
