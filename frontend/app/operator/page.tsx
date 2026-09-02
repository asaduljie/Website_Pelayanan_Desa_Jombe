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
  Newspaper,
  Trash2,
  Megaphone,
  Tag,
  MessageSquare,
  UserCheck,
  Image as ImageIcon,
  Camera,
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

  // Tab State
  const [activeTab, setActiveTab] = useState<'PERMOHONAN_WARGA' | 'PENGADUAN_WARGA' | 'KELOLA_BERITA' | 'KELOLA_PENGUMUMAN' | 'BERKAS_LAMPIRAN' | 'SURAT_BALASAN_SKU' | string>('PERMOHONAN_WARGA');

  // News & Announcement States
  const [newsList, setNewsList] = useState<any[]>([]);
  const [announcementsList, setAnnouncementsList] = useState<any[]>([]);
  const [newsLoading, setNewsLoading] = useState(false);

  // Complaints State
  const [complaintsList, setComplaintsList] = useState<any[]>([]);
  const [complaintsLoading, setComplaintsLoading] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState<any>(null);
  const [complaintStatusUpdate, setComplaintStatusUpdate] = useState('PROCESSING');
  const [complaintAdminResponse, setComplaintAdminResponse] = useState('');
  const [assignedOfficer, setAssignedOfficer] = useState('Kepala Dusun I (Krajan)');
  const [officerPhone, setOfficerPhone] = useState('081234567890');
  const [complaintSaving, setComplaintSaving] = useState(false);

  const [showCreateNewsModal, setShowCreateNewsModal] = useState(false);
  const [newsTitle, setNewsTitle] = useState('');
  const [newsCategory, setNewsCategory] = useState('Pemerintahan');
  const [newsExcerpt, setNewsExcerpt] = useState('');
  const [newsContent, setNewsContent] = useState('');
  const [newsSaving, setNewsSaving] = useState(false);

  const [showCreateAnnModal, setShowCreateAnnModal] = useState(false);
  const [annTitle, setAnnTitle] = useState('');
  const [annContent, setAnnContent] = useState('');
  const [annSaving, setAnnSaving] = useState(false);

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
    const currentYear = new Date().getFullYear();
    const romans = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'];
    const currentRomanMonth = romans[new Date().getMonth()] || 'VIII';
    const defaultNum = `${Math.floor(100 + Math.random() * 900)}/DJ/${currentRomanMonth}/${currentYear}`;

    setEditLetterNumber(app.letterNumber || defaultNum);
    setEditLetterContent(
      app.letterContent ||
        `Yang bersangkutan adalah benar-benar penduduk Desa kami yang berdomisili di wilayah Desa Jombe, Kecamatan Turatea, Kabupaten Jeneponto.`
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

  useEffect(() => {
    fetchNewsAndAnnouncements();
    fetchComplaints();
  }, []);

  const fetchNewsAndAnnouncements = async () => {
    setNewsLoading(true);
    try {
      const nRes = await api.get('/content/news');
      if (nRes.data.status === 'success') {
        setNewsList(nRes.data.data);
      }
      const aRes = await api.get('/content/announcements');
      if (aRes.data.status === 'success') {
        setAnnouncementsList(aRes.data.data);
      }
    } catch (e) {
    } finally {
      setNewsLoading(false);
    }
  };

  const handleCreateNews = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsTitle.trim() || !newsContent.trim()) return;
    setNewsSaving(true);
    try {
      const res = await api.post('/content/news', {
        title: newsTitle,
        category: newsCategory,
        excerpt: newsExcerpt,
        content: newsContent,
      });
      if (res.data.status === 'success') {
        alert('Berita desa berhasil dipublikasikan!');
        setShowCreateNewsModal(false);
        setNewsTitle('');
        setNewsExcerpt('');
        setNewsContent('');
        fetchNewsAndAnnouncements();
      }
    } catch (err: any) {
      alert('Gagal membuat berita: ' + (err.response?.data?.message || err.message));
    } finally {
      setNewsSaving(false);
    }
  };

  const handleDeleteNews = async (id: string, title: string) => {
    if (!confirm(`Hapus berita "${title}"?`)) return;
    try {
      await api.delete(`/content/news/${id}`);
      fetchNewsAndAnnouncements();
    } catch (e) {
      alert('Gagal menghapus berita.');
    }
  };

  const handleCreateAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!annTitle.trim() || !annContent.trim()) return;
    setAnnSaving(true);
    try {
      const res = await api.post('/content/announcements', {
        title: annTitle,
        content: annContent,
      });
      if (res.data.status === 'success') {
        alert('Pengumuman desa berhasil diterbitkan!');
        setShowCreateAnnModal(false);
        setAnnTitle('');
        setAnnContent('');
        fetchNewsAndAnnouncements();
      }
    } catch (err: any) {
      alert('Gagal membuat pengumuman.');
    } finally {
      setAnnSaving(false);
    }
  };

  const handleDeleteAnnouncement = async (id: string, title: string) => {
    if (!confirm(`Hapus pengumuman "${title}"?`)) return;
    try {
      await api.delete(`/content/announcements/${id}`);
      fetchNewsAndAnnouncements();
    } catch (e) {
      alert('Gagal menghapus pengumuman.');
    }
  };

  const fetchComplaints = async () => {
    setComplaintsLoading(true);
    try {
      const res = await api.get('/complaints');
      if (res.data.status === 'success') {
        setComplaintsList(res.data.data);
      }
    } catch (e) {
    } finally {
      setComplaintsLoading(false);
    }
  };

  const handleOpenComplaintDetail = (c: any) => {
    setSelectedComplaint(c);
    setComplaintStatusUpdate(c.status || 'PROCESSING');
    setComplaintAdminResponse(c.adminResponse || '');
    setAssignedOfficer(c.assignedOfficer || 'Kepala Dusun I (Krajan)');
    setOfficerPhone(c.officerPhone || '081234567890');
  };

  const handleForwardToOfficerWhatsApp = () => {
    if (!selectedComplaint) return;
    const cleanPhone = officerPhone.replace(/[^0-9]/g, '').replace(/^0/, '62');
    const msg =
      `*DISPOSISI LAPORAN PENGADUAN WARGA DESA JOMBE*\n\n` +
      `Kepada Yth. *${assignedOfficer}*\n` +
      `No. Tiket: *${selectedComplaint.ticketNumber}*\n` +
      `Kategori: *${selectedComplaint.category}*\n` +
      `Pelapor: *${selectedComplaint.userName || 'Warga Desa'}* (Telp: ${selectedComplaint.userPhone || '-'})\n` +
      `Lokasi: *${selectedComplaint.location}*\n\n` +
      `*Deskripsi Laporan:*\n${selectedComplaint.description}\n\n` +
      `*Instruksi Operator Desa:*\n${complaintAdminResponse || 'Mohon segera dilakukan pengecekan lapangan dan tindak lanjut perbaikan.'}\n\n` +
      `_Sistem Pelayanan Digital Desa Jombe_`;
    window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  const handleUpdateComplaintStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedComplaint) return;
    setComplaintSaving(true);
    try {
      const res = await api.patch(`/operator/complaints/${selectedComplaint.id}`, {
        status: complaintStatusUpdate,
        adminResponse: complaintAdminResponse,
        assignedOfficer,
        officerPhone,
      });
      if (res.data.status === 'success') {
        alert('Keputusan & Tanggapan pengaduan berhasil disimpan!');
        setSelectedComplaint(null);
        fetchComplaints();
      }
    } catch (e) {
      alert('Gagal memperbarui status pengaduan.');
    } finally {
      setComplaintSaving(false);
    }
  };

  const handleDeleteComplaint = async (id: string, title: string) => {
    if (!confirm(`Hapus laporan pengaduan "${title}"?`)) return;
    try {
      await api.delete(`/operator/complaints/${id}`);
      fetchComplaints();
    } catch (e) {
      alert('Gagal menghapus pengaduan.');
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

      {/* Primary Dashboard Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-3">
        <button
          onClick={() => setActiveTab('PERMOHONAN_WARGA')}
          className={`px-5 py-3 rounded-2xl font-extrabold text-xs flex items-center gap-2 transition-all shadow-xs ${
            activeTab === 'PERMOHONAN_WARGA'
              ? 'bg-emerald-900 text-white shadow-md'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <FileCheck className="w-4 h-4" /> Pemeriksaan Berkas Permohonan ({applications.length})
        </button>

        <button
          onClick={() => {
            setActiveTab('PENGADUAN_WARGA');
            fetchComplaints();
          }}
          className={`px-5 py-3 rounded-2xl font-extrabold text-xs flex items-center gap-2 transition-all shadow-xs ${
            activeTab === 'PENGADUAN_WARGA'
              ? 'bg-emerald-900 text-white shadow-md'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <MessageSquare className="w-4 h-4" /> Pengaduan Warga ({complaintsList.length})
        </button>

        <button
          onClick={() => {
            setActiveTab('KELOLA_BERITA');
            fetchNewsAndAnnouncements();
          }}
          className={`px-5 py-3 rounded-2xl font-extrabold text-xs flex items-center gap-2 transition-all shadow-xs ${
            activeTab === 'KELOLA_BERITA'
              ? 'bg-emerald-900 text-white shadow-md'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Newspaper className="w-4 h-4" /> Kelola & Tulis Berita ({newsList.length})
        </button>

        <button
          onClick={() => {
            setActiveTab('KELOLA_PENGUMUMAN');
            fetchNewsAndAnnouncements();
          }}
          className={`px-5 py-3 rounded-2xl font-extrabold text-xs flex items-center gap-2 transition-all shadow-xs ${
            activeTab === 'KELOLA_PENGUMUMAN'
              ? 'bg-emerald-900 text-white shadow-md'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Megaphone className="w-4 h-4" /> Pengumuman ({announcementsList.length})
        </button>
      </div>

      {/* ======================================================== */}
      {/* TAB 1: PEMERIKSAAN PERMOHONAN BERKAS WARGA               */}
      {/* ======================================================== */}
      {activeTab === 'PERMOHONAN_WARGA' && (
        <div className="space-y-6">
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

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <div className="relative flex-1 sm:w-64">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Cari NIK / Nama / No Registrasi..."
                    className="w-full pl-9 pr-4 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-700 bg-slate-50 text-slate-900 font-medium"
                  />
                </div>

                {applications.length > 0 && (
                  <button
                    onClick={async () => {
                      if (!confirm('Kosongkan semua berkas permohonan yang ada di daftar?')) return;
                      try {
                        await api.post('/operator/applications/clear-all');
                        fetchDashboardData();
                      } catch (e) {
                        alert('Gagal mengosongkan berkas.');
                      }
                    }}
                    className="px-3.5 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl text-xs font-bold transition-colors shrink-0 flex items-center gap-1.5"
                    title="Kosongkan Semua Berkas Uji Coba"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Bersihkan Semua
                  </button>
                )}
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
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleSelectApp(app)}
                              className="px-3.5 py-1.5 bg-emerald-800 hover:bg-emerald-900 text-white font-bold rounded-xl text-xs transition-colors shadow-xs flex items-center gap-1.5"
                            >
                              <Eye className="w-3.5 h-3.5" /> Periksa Permohonan & Foto
                            </button>
                            <button
                              onClick={async () => {
                                if (!confirm(`Hapus permohonan ${app.applicationNumber} (${app.user?.name})?`)) return;
                                try {
                                  await api.delete(`/operator/applications/${app.id}`);
                                  fetchDashboardData();
                                } catch (e) {
                                  alert('Gagal menghapus berkas.');
                                }
                              }}
                              className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                              title="Hapus Berkas Ini"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB: PENGADUAN & ASPIRASI WARGA                          */}
      {/* ======================================================== */}
      {activeTab === 'PENGADUAN_WARGA' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-soft space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-emerald-800" />
                Daftar Laporan Pengaduan & Aspirasi Warga
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">Laporan pengaduan masuk via WhatsApp Bot dan Portal Web resmi Desa Jombe.</p>
            </div>

            <button
              onClick={fetchComplaints}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-all"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Segarkan Data
            </button>
          </div>

          {complaintsLoading ? (
            <div className="text-center py-12 text-xs text-slate-500">Memuat data pengaduan...</div>
          ) : complaintsList.length === 0 ? (
            <div className="text-center py-14 bg-slate-50 rounded-2xl border border-dashed border-slate-200 space-y-2">
              <MessageSquare className="w-8 h-8 text-slate-400 mx-auto" />
              <p className="text-xs text-slate-500 font-bold">Belum ada pengaduan yang masuk.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 uppercase font-bold text-[10px] tracking-wider">
                  <tr>
                    <th className="px-6 py-3.5">No. Tiket</th>
                    <th className="px-6 py-3.5">Pelapor Warga</th>
                    <th className="px-6 py-3.5">Kategori & Judul Laporan</th>
                    <th className="px-6 py-3.5">Tanggal Masuk</th>
                    <th className="px-6 py-3.5">Status Penanganan</th>
                    <th className="px-6 py-3.5 text-right">Aksi Tindak Lanjut</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {complaintsList.map((comp) => (
                    <tr key={comp.id} className="hover:bg-slate-50/70">
                      <td className="px-6 py-4 font-mono font-bold text-emerald-950">
                        {comp.ticketNumber}
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-bold text-slate-900 block">{comp.userName || comp.user?.name || 'Warga Desa'}</span>
                        <span className="text-[10px] text-slate-500 font-mono block">NIK: {comp.userNik || comp.user?.nik || '-'}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 block w-fit mb-1">
                          {comp.category}
                        </span>
                        <span className="font-bold text-slate-900 block">{comp.title}</span>
                      </td>
                      <td className="px-6 py-4 text-slate-500">
                        {new Date(comp.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-[10px] font-bold ${
                            comp.status === 'RESOLVED'
                              ? 'bg-emerald-100 text-emerald-900'
                              : comp.status === 'PROCESSING'
                              ? 'bg-sky-100 text-sky-900'
                              : comp.status === 'REJECTED'
                              ? 'bg-rose-100 text-rose-900'
                              : 'bg-amber-100 text-amber-900'
                          }`}
                        >
                          {comp.status === 'RESOLVED' ? 'Selesai Ditangani' : comp.status === 'PROCESSING' ? 'Sedang Ditindaklanjuti' : comp.status === 'REJECTED' ? 'Ditolak' : 'Menunggu Tindakan'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleOpenComplaintDetail(comp)}
                            className="px-3.5 py-1.5 bg-emerald-800 hover:bg-emerald-900 text-white font-bold rounded-xl text-xs transition-colors shadow-xs flex items-center gap-1.5"
                          >
                            <Eye className="w-3.5 h-3.5" /> Lihat Detail & Tanggapi
                          </button>
                          <button
                            onClick={() => handleDeleteComplaint(comp.id, comp.title)}
                            className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                            title="Hapus Pengaduan"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 2: KELOLA & TULIS BERITA DESA                        */}
      {/* ======================================================== */}
      {activeTab === 'KELOLA_BERITA' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-soft space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
                <Newspaper className="w-5 h-5 text-emerald-800" />
                Manajemen Publikasi Berita Desa Jombe
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">Tulis, publikasikan, dan kelola berita resmi pemerintah desa yang tampil di halaman utama.</p>
            </div>

            <button
              onClick={() => setShowCreateNewsModal(true)}
              className="px-5 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-2 transition-all"
            >
              <Plus className="w-4 h-4" /> Tulis Berita Baru
            </button>
          </div>

          {newsLoading ? (
            <div className="text-center py-10 text-xs text-slate-500">Memuat data berita...</div>
          ) : newsList.length === 0 ? (
            <div className="text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-200 space-y-2">
              <Newspaper className="w-8 h-8 text-slate-400 mx-auto" />
              <p className="text-xs text-slate-500 font-bold">Belum ada berita yang diterbitkan.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {newsList.map((item) => (
                <div key={item.id} className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-all flex flex-col justify-between space-y-3">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300">
                        {item.category}
                      </span>
                      <span className="text-[11px] text-slate-400 font-medium">
                        {new Date(item.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </span>
                    </div>
                    <h3 className="text-sm font-bold text-slate-900 leading-snug">{item.title}</h3>
                    <p className="text-xs text-slate-600 line-clamp-3">{item.excerpt || item.content}</p>
                  </div>

                  <div className="flex justify-between items-center pt-3 border-t border-slate-200/80">
                    <span className="text-[11px] text-slate-500">Penulis: <strong>{item.author?.name || 'Humas'}</strong></span>
                    <button
                      onClick={() => handleDeleteNews(item.id, item.title)}
                      className="p-2 text-rose-600 hover:bg-rose-50 rounded-xl transition-colors text-xs font-bold flex items-center gap-1"
                      title="Hapus Berita"
                    >
                      <Trash2 className="w-4 h-4" /> Hapus
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 3: KELOLA PENGUMUMAN WARGA                           */}
      {/* ======================================================== */}
      {activeTab === 'KELOLA_PENGUMUMAN' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-soft space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
                <Megaphone className="w-5 h-5 text-amber-600" />
                Manajemen Pengumuman Penting Warga
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">Terbitkan pengumuman darurat, jadwal pelayanan, dan surat edaran desa.</p>
            </div>

            <button
              onClick={() => setShowCreateAnnModal(true)}
              className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-amber-950 font-extrabold text-xs rounded-xl shadow-md flex items-center gap-2 transition-all"
            >
              <Plus className="w-4 h-4" /> Buat Pengumuman Baru
            </button>
          </div>

          {announcementsList.length === 0 ? (
            <div className="text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-200 space-y-2">
              <Megaphone className="w-8 h-8 text-slate-400 mx-auto" />
              <p className="text-xs text-slate-500 font-bold">Belum ada pengumuman aktif.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {announcementsList.map((ann) => (
                <div key={ann.id} className="p-5 rounded-2xl border border-amber-200 bg-amber-50/40 flex justify-between items-start gap-4">
                  <div className="space-y-1">
                    <h3 className="text-sm font-bold text-slate-900">{ann.title}</h3>
                    <p className="text-xs text-slate-700 leading-relaxed">{ann.content}</p>
                    <span className="text-[10px] text-slate-400 block pt-1">
                      Diterbitkan: {new Date(ann.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </span>
                  </div>

                  <button
                    onClick={() => handleDeleteAnnouncement(ann.id, ann.title)}
                    className="p-2 text-rose-600 hover:bg-rose-100 rounded-xl transition-colors shrink-0"
                    title="Hapus Pengumuman"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: TULIS BERITA BARU                                 */}
      {/* ======================================================== */}
      {showCreateNewsModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-5 shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-150">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <Newspaper className="w-5 h-5 text-emerald-800" /> Tulis Publikasi Berita Desa
              </h3>
              <button onClick={() => setShowCreateNewsModal(false)} className="p-1 rounded-lg text-slate-400 hover:text-slate-800">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateNews} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Judul Berita</label>
                <input
                  type="text"
                  value={newsTitle}
                  onChange={(e) => setNewsTitle(e.target.value)}
                  placeholder="Contoh: Penyaluran Bantuan Pertanian Desa Jombe 2026..."
                  required
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-700 bg-slate-50 text-slate-900 font-semibold"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Kategori Berita</label>
                  <select
                    value={newsCategory}
                    onChange={(e) => setNewsCategory(e.target.value)}
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-700 bg-slate-50 text-slate-900 font-semibold"
                  >
                    <option value="Pemerintahan">Pemerintahan</option>
                    <option value="Pembangunan">Pembangunan</option>
                    <option value="UMKM & Ekonomi">UMKM & Ekonomi</option>
                    <option value="Sosial & Budaya">Sosial & Budaya</option>
                    <option value="Kesehatan">Kesehatan</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Ringkasan Singkat (Excerpt)</label>
                  <input
                    type="text"
                    value={newsExcerpt}
                    onChange={(e) => setNewsExcerpt(e.target.value)}
                    placeholder="Ringkasan singkat berita untuk kartu beranda..."
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-700 bg-slate-50 text-slate-900"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Isi Berita Lengkap</label>
                <textarea
                  rows={6}
                  value={newsContent}
                  onChange={(e) => setNewsContent(e.target.value)}
                  placeholder="Tuliskan isi berita dan informasi desa secara lengkap di sini..."
                  required
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-700 bg-slate-50 text-slate-900 leading-relaxed font-sans"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowCreateNewsModal(false)}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={newsSaving}
                  className="px-6 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white font-extrabold rounded-xl shadow-md flex items-center gap-1.5 transition-all"
                >
                  <Send className="w-4 h-4" /> {newsSaving ? 'Menerbitkan...' : 'Terbitkan Berita'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: BUAT PENGUMUMAN BARU                              */}
      {/* ======================================================== */}
      {showCreateAnnModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-5 shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-150">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <Megaphone className="w-5 h-5 text-amber-600" /> Terbitkan Pengumuman Warga
              </h3>
              <button onClick={() => setShowCreateAnnModal(false)} className="p-1 rounded-lg text-slate-400 hover:text-slate-800">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateAnnouncement} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Judul Pengumuman</label>
                <input
                  type="text"
                  value={annTitle}
                  onChange={(e) => setAnnTitle(e.target.value)}
                  placeholder="Contoh: Jadwal Pelayanan Pembuatan Dokumen Kependudukan..."
                  required
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 bg-slate-50 text-slate-900 font-semibold"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Isi Pengumuman</label>
                <textarea
                  rows={4}
                  value={annContent}
                  onChange={(e) => setAnnContent(e.target.value)}
                  placeholder="Tuliskan isi pengumuman atau instruksi untuk warga..."
                  required
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 bg-slate-50 text-slate-900 leading-relaxed"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowCreateAnnModal(false)}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={annSaving}
                  className="px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-amber-950 font-extrabold rounded-xl shadow-md flex items-center gap-1.5 transition-all"
                >
                  <Send className="w-4 h-4" /> {annSaving ? 'Menerbitkan...' : 'Terbitkan Pengumuman'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: DETAIL PENGADUAN WARGA & TANGGAPAN OPERATOR       */}
      {/* ======================================================== */}
      {selectedComplaint && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl overflow-y-auto max-h-[92vh] border border-slate-200 animate-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="flex justify-between items-start border-b border-slate-100 pb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300">
                    {selectedComplaint.category || 'Pengaduan Umum'}
                  </span>
                  <span className="text-xs text-slate-400 font-mono font-bold">
                    {selectedComplaint.ticketNumber}
                  </span>
                </div>
                <h3 className="text-lg font-extrabold text-slate-900">{selectedComplaint.title}</h3>
              </div>
              <button
                onClick={() => setSelectedComplaint(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Citizen Details */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-slate-400 block font-medium">Pelapor:</span>
                <span className="font-bold text-slate-900">{selectedComplaint.userName || selectedComplaint.user?.name || 'Warga Desa'}</span>
              </div>
              <div>
                <span className="text-slate-400 block font-medium">NIK Pelapor:</span>
                <span className="font-bold text-slate-900 font-mono">{selectedComplaint.userNik || selectedComplaint.user?.nik || '-'}</span>
              </div>
              <div>
                <span className="text-slate-400 block font-medium">No. Telepon / WA:</span>
                <span className="font-bold text-slate-900">{selectedComplaint.userPhone || selectedComplaint.user?.phone || '-'}</span>
              </div>
              <div>
                <span className="text-slate-400 block font-medium">Tanggal Lapor:</span>
                <span className="font-bold text-slate-900">
                  {new Date(selectedComplaint.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                </span>
              </div>
            </div>

            {/* Complaint Location & Full Description */}
            <div className="space-y-2 text-xs">
              <div>
                <span className="font-bold text-slate-700 block mb-1">Lokasi Kejadian:</span>
                <div className="p-3 bg-white border border-slate-200 rounded-xl text-slate-800 font-medium">
                  {selectedComplaint.location || 'Wilayah Desa Jombe'}
                </div>
              </div>

              <div>
                <span className="font-bold text-slate-700 block mb-1">Deskripsi Lengkap Masalah / Aspirasi:</span>
                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 leading-relaxed font-sans whitespace-pre-wrap">
                  {selectedComplaint.description}
                </div>
              </div>
            </div>

            {/* Photo Attachment (If Any) */}
            {selectedComplaint.photoUrl && (
              <div className="space-y-2">
                <span className="font-bold text-slate-700 text-xs block">Foto Bukti Lapangan:</span>
                <div
                  onClick={() => setPreviewDoc({ title: 'Foto Bukti Pengaduan', type: 'BUKTI', url: selectedComplaint.photoUrl })}
                  className="relative rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 max-h-48 cursor-pointer group"
                >
                  <img src={selectedComplaint.photoUrl} alt="Bukti Pengaduan" className="w-full h-48 object-cover group-hover:scale-105 transition-transform" />
                  <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold gap-1.5">
                    <Eye className="w-4 h-4" /> Klik untuk Memperbesar Foto
                  </div>
                </div>
              </div>
            )}

            {/* Operator Response & Status Form */}
            <form onSubmit={handleUpdateComplaintStatus} className="space-y-4 pt-4 border-t border-slate-100 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-800">Keputusan & Status Pengaduan</label>
                <select
                  value={complaintStatusUpdate}
                  onChange={(e) => setComplaintStatusUpdate(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-700 bg-slate-50 text-slate-900 font-bold"
                >
                  <option value="SUBMITTED">⏳ Menunggu Pemeriksaan (SUBMITTED)</option>
                  <option value="PROCESSING">🚀 Sedang Diproses Operator (PROCESSING)</option>
                  <option value="RESOLVED">✅ Selesai Ditangani (RESOLVED)</option>
                  <option value="REJECTED">❌ Ditolak / Tidak Valid (REJECTED)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-800">Catatan Tanggapan Resmi Operator Desa</label>
                <textarea
                  rows={3}
                  value={complaintAdminResponse}
                  onChange={(e) => setComplaintAdminResponse(e.target.value)}
                  placeholder="Tuliskan keterangan resmi penanganan untuk warga..."
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-700 bg-slate-50 text-slate-900 leading-relaxed font-sans"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedComplaint(null)}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl"
                >
                  Tutup
                </button>
                <button
                  type="submit"
                  disabled={complaintSaving}
                  className="px-6 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white font-extrabold rounded-xl shadow-md flex items-center gap-1.5 transition-all"
                >
                  <Send className="w-4 h-4" /> {complaintSaving ? 'Menyimpan...' : 'Simpan Keputusan & Tanggapan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

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
                <div className="pb-3 space-y-0.5 relative">
                  <div className="relative flex items-center justify-center min-h-[64px]">
                    <img
                      src="/logo_jeneponto.png"
                      alt="Logo Kabupaten Jeneponto"
                      className="w-14 h-auto absolute left-2 top-0 object-contain"
                    />
                    <div className="text-center px-16">
                      <h4 className="text-xs font-bold uppercase tracking-wide text-slate-900">PEMERINTAH KABUPATEN JENEPONTO</h4>
                      <h4 className="text-xs font-bold uppercase tracking-wide text-slate-900">KECAMATAN TURATEA</h4>
                      <h3 className="text-base font-extrabold uppercase tracking-wide text-slate-950">DESA JOMBE</h3>
                      <p className="text-[10px] font-sans text-slate-600">Alamat: Jl. Poros Dusun Jombe Selatan</p>
                    </div>
                  </div>
                  <div className="pt-2">
                    <div className="w-full border-b-[2.5px] border-slate-900"></div>
                    <div className="w-full border-b border-slate-900 mt-[2px]"></div>
                  </div>
                </div>

                {/* Judul & Nomor Surat Balasan */}
                <div className="text-center space-y-1">
                  <h3 className="text-sm font-bold uppercase underline tracking-wider font-sans">
                    {selectedApp.service?.name || 'SURAT KETERANGAN KURANG MAMPU'}
                  </h3>
                  {isEditingLetter ? (
                    <div className="max-w-xs mx-auto pt-1 font-sans">
                      <input
                        type="text"
                        value={editLetterNumber}
                        onChange={(e) => setEditLetterNumber(e.target.value)}
                        className="w-full text-center text-xs font-bold border border-emerald-600 rounded-lg p-1 bg-white"
                        placeholder="Nomor Surat: 341/DJ/VIII/2026"
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
                  <p>Yang bertanda tangan di bawah ini Kepala Desa Jombe Kecamatan Turatea Kabupaten Jeneponto menerangkan bahwa :</p>

                  <div className="pl-4 space-y-1 bg-white p-3.5 rounded-xl border border-slate-200 font-sans">
                    <div className="grid grid-cols-3">
                      <span className="text-slate-500 font-medium">Nama</span>
                      <span className="col-span-2 font-bold text-slate-900">: {selectedApp.user?.name}</span>
                    </div>
                    <div className="grid grid-cols-3">
                      <span className="text-slate-500 font-medium">NIK</span>
                      <span className="col-span-2 font-mono font-bold text-slate-900">: {selectedApp.user?.nik}</span>
                    </div>
                    <div className="grid grid-cols-3">
                      <span className="text-slate-500 font-medium">Tempat tanggal lahir</span>
                      <span className="col-span-2 text-slate-900">: Jeneponto, 15 Mei 1995</span>
                    </div>
                    <div className="grid grid-cols-3">
                      <span className="text-slate-500 font-medium">Jenis Kelamin</span>
                      <span className="col-span-2 text-slate-900">: Laki-laki</span>
                    </div>
                    <div className="grid grid-cols-3">
                      <span className="text-slate-500 font-medium">Warga Negara</span>
                      <span className="col-span-2 text-slate-900">: Indonesia</span>
                    </div>
                    <div className="grid grid-cols-3">
                      <span className="text-slate-500 font-medium">Agama</span>
                      <span className="col-span-2 text-slate-900">: Islam</span>
                    </div>
                    <div className="grid grid-cols-3">
                      <span className="text-slate-500 font-medium">Alamat</span>
                      <span className="col-span-2 font-medium text-slate-800">: {selectedApp.user?.address || 'Dusun Jombe Selatan Desa Jombe Kec. Turatea Kab. Jeneponto'}</span>
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

                  <p>Demikian surat keterangan ini diberikan kepada yang bersangkutan untuk digunakan sebagaimana mestinya.</p>
                </div>

                {/* Tanda Tangan Kepala Desa */}
                <div className="pt-4 flex justify-end text-xs font-sans">
                  <div className="text-center space-y-12 w-48">
                    <div>
                      <p className="text-[11px] text-slate-600">Jombe, {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                      <p className="font-semibold text-slate-800">Mengetahui</p>
                      <p className="font-bold text-slate-900">Kepala Desa Jombe</p>
                    </div>
                    <p className="font-bold underline text-slate-900 uppercase">JUSMAEDY, S.Pd</p>
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
              {previewDoc.url && !previewDoc.url.startsWith('blob:') ? (
                <img
                  src={previewDoc.url}
                  alt={previewDoc.title}
                  className="max-h-[65vh] max-w-full rounded-xl object-contain shadow-2xl border border-slate-700"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
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
                      <p><strong>Alamat</strong> : DUSUN KRAJAN RT 02 / RW 01</p>
                      <p><strong>Agama</strong> : ISLAM</p>
                      <p><strong>Status Perkawinan</strong> : KAWIN</p>
                      <p><strong>Pekerjaan</strong> : WIRASWASTA</p>
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
                ) : (
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col items-center justify-center space-y-3">
                    <img
                      src={
                        waStatus.qrCodeDataUrl ||
                        'https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=https%3A%2F%2Fwa.me%2F6285151199485%3Ftext%3DHalo%2520Bot%2520Pelayanan%2520Desa%2520Jombe'
                      }
                      alt="WhatsApp QR Code"
                      className="w-52 h-52 rounded-xl border border-slate-300 shadow-sm bg-white p-2"
                    />
                    <div className="text-center space-y-2 w-full">
                      <a
                        href="https://wa.me/6285151199485?text=Halo%20Bot%20Pelayanan%20Desa%20Jombe%2C%20saya%20ingin%20mengajukan%20permohonan%20surat."
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-all"
                      >
                        <MessageSquare className="w-4 h-4" /> Buka Chat Bot di WhatsApp (0851-5119-9485)
                      </a>
                    </div>
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
