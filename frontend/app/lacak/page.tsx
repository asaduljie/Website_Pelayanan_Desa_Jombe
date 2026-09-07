'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  Search,
  FileText,
  Clock,
  CheckCircle2,
  XCircle,
  Download,
  Printer,
  ShieldCheck,
  AlertCircle,
  ArrowRight,
  User,
  MapPin,
  Calendar,
  MessageSquare
} from 'lucide-react';
import api from '@/lib/api';

function LacakContent() {
  const searchParams = useSearchParams();
  const initialNo = searchParams.get('no') || '';

  const [identifier, setIdentifier] = useState(initialNo);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [searched, setSearched] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const [complaintResult, setComplaintResult] = useState<any | null>(null);

  useEffect(() => {
    if (initialNo) {
      handleSearch(initialNo);
    }
  }, [initialNo]);

  const handleSearch = async (queryValue?: string) => {
    const q = (queryValue !== undefined ? queryValue : identifier).trim();
    if (!q) {
      setErrorMessage('Silakan masukkan Nomor Registrasi Surat atau NIK 16 digit Anda.');
      return;
    }

    setLoading(true);
    setErrorMessage('');
    setSearched(true);
    setResults([]);
    setComplaintResult(null);

    try {
      // 1. If it's a complaint ticket (PGD-...)
      if (q.toUpperCase().startsWith('PGD-')) {
        const compRes = await api.get('/complaints');
        if (compRes.data.status === 'success') {
          const found = compRes.data.data.find(
            (c: any) => c.ticketNumber?.toUpperCase() === q.toUpperCase() || String(c.id) === q
          );
          if (found) {
            setComplaintResult(found);
            setLoading(false);
            return;
          }
        }
      }

      // 2. Otherwise search applications via /applications/track
      const isNik = /^\d{16}$/.test(q);
      const res = await api.get('/applications/track', {
        params: isNik ? { nik: q } : { regNo: q },
      });

      if (res.data.status === 'success') {
        setResults(res.data.data || []);
      }
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.response?.data?.message || 'Gagal melacak permohonan. Pastikan nomor registrasi atau NIK tepat.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'COMPLETED':
      case 'APPROVED':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-900 border border-emerald-300">
            <CheckCircle2 className="w-4 h-4 text-emerald-700" />
            Disetujui & Diterbitkan
          </span>
        );
      case 'PROCESSING':
      case 'VERIFIED':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-sky-100 text-sky-900 border border-sky-300">
            <Clock className="w-4 h-4 text-sky-700" />
            Sedang Diverifikasi Petugas
          </span>
        );
      case 'NEED_REVISION':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-orange-100 text-orange-900 border border-orange-300">
            <AlertCircle className="w-4 h-4 text-orange-700" />
            Perlu Perbaikan Berkas
          </span>
        );
      case 'REJECTED':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-900 border border-rose-300">
            <XCircle className="w-4 h-4 text-rose-700" />
            Permohonan Ditolak
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300">
            <Clock className="w-4 h-4 text-amber-700" />
            Menunggu Antrean Verifikasi
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen py-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-emerald-800 text-white rounded-3xl p-8 sm:p-10 shadow-lg border border-emerald-700/50">
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight">Lacak Status Surat & Layanan</h1>
        <p className="text-sm text-emerald-100/90 mt-2 max-w-2xl leading-relaxed">
          Pantau progres permohonan surat keterangan dan pengaduan Anda. Setelah surat disetujui, Anda dapat langsung mengunduh dan mencetak berkas PDF resmi.
        </p>
      </div>

      {/* Search Bar Box */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-soft space-y-4">
        <label className="block text-sm font-bold text-slate-800">
          Masukkan Nomor Registrasi Berkas atau NIK:
        </label>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="Nomor Registrasi atau NIK"
              className="w-full pl-11 pr-4 py-3 border border-slate-300 rounded-2xl text-sm bg-slate-50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-700 font-mono"
            />
          </div>
          <button
            onClick={() => handleSearch()}
            disabled={loading}
            className="px-6 py-3 bg-emerald-800 hover:bg-emerald-900 disabled:opacity-50 text-white font-bold rounded-2xl text-sm shadow-md transition-all flex items-center justify-center gap-2 shrink-0"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Mencari...</span>
              </>
            ) : (
              <>
                <Search className="w-4 h-4" />
                <span>Cari Status</span>
              </>
            )}
          </button>
        </div>

        {errorMessage && (
          <div className="p-3.5 rounded-xl bg-red-50 text-red-700 text-xs flex items-center gap-2 border border-red-200">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

      </div>

      {/* Complaint Search Result */}
      {complaintResult && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-soft space-y-5 animate-in fade-in duration-200">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 border-b border-slate-100 pb-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300">
                  {complaintResult.category}
                </span>
                <span className="text-xs font-mono font-bold text-slate-500">
                  {complaintResult.ticketNumber}
                </span>
              </div>
              <h2 className="text-xl font-extrabold text-slate-900">{complaintResult.title}</h2>
            </div>
            {getStatusBadge(complaintResult.status)}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs bg-slate-50 p-4 rounded-2xl border border-slate-200">
            <div>
              <span className="text-slate-400 block font-medium">Pelapor:</span>
              <span className="font-bold text-slate-900">{complaintResult.userName || 'Warga Desa'}</span>
            </div>
            <div>
              <span className="text-slate-400 block font-medium">Lokasi:</span>
              <span className="font-bold text-slate-900">{complaintResult.location || 'Desa Jombe'}</span>
            </div>
            <div>
              <span className="text-slate-400 block font-medium">Tanggal Masuk:</span>
              <span className="font-bold text-slate-900">
                {new Date(complaintResult.createdAt).toLocaleDateString('id-ID', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </span>
            </div>
          </div>

          <div className="space-y-1.5 text-xs">
            <span className="font-bold text-slate-700">Rincian Laporan:</span>
            <p className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 leading-relaxed whitespace-pre-wrap">
              {complaintResult.description}
            </p>
          </div>

          {complaintResult.adminResponse ? (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-1 text-xs">
              <span className="font-extrabold text-emerald-900 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-700" /> Tindak Lanjut Operator / Pemerintah Desa Jombe:
              </span>
              <p className="text-slate-800 leading-relaxed">{complaintResult.adminResponse}</p>
            </div>
          ) : (
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center gap-2">
              <Clock className="w-4 h-4 shrink-0 text-amber-700" />
              <span>Laporan pengaduan ini sedang dalam antrean verifikasi oleh Operator Desa Jombe.</span>
            </div>
          )}
        </div>
      )}

      {/* Applications Search Results */}
      {searched && !complaintResult && results.length > 0 && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <h2 className="text-lg font-bold text-slate-900">
            Ditemukan {results.length} Berkas Permohonan Surat
          </h2>

          <div className="space-y-6">
            {results.map((item) => (
              <div
                key={item.id}
                className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-soft space-y-5"
              >
                {/* Header Card */}
                <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-4 border-b border-slate-100 pb-4">
                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-1.5">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-900 border border-emerald-200 uppercase">
                        {item.letterType?.name || 'Surat Keterangan'}
                      </span>
                      <span className="font-mono text-xs font-black text-slate-700 bg-slate-100 px-2.5 py-0.5 rounded-md">
                        {item.registrationNo || `JMB-2026-${String(item.id).padStart(5, '0')}`}
                      </span>
                    </div>
                    <h3 className="text-xl font-black text-slate-900">{item.letterType?.name || 'Surat Permohonan Warga'}</h3>
                  </div>
                  <div>{getStatusBadge(item.status)}</div>
                </div>

                {/* Info Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs bg-slate-50 p-4 rounded-2xl border border-slate-200">
                  <div>
                    <span className="text-slate-400 block font-medium">Nama Pemohon:</span>
                    <span className="font-bold text-slate-900">{item.applicantName || item.user?.name || '-'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-medium">NIK:</span>
                    <span className="font-bold text-slate-900 font-mono">{item.applicantNik || item.user?.nik || '-'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-medium">Dusun / Alamat:</span>
                    <span className="font-bold text-slate-900">{item.applicantAddress || item.user?.address || 'Desa Jombe'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-medium">Tanggal Pengajuan:</span>
                    <span className="font-bold text-slate-900">
                      {new Date(item.createdAt).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </span>
                  </div>
                </div>

                {/* Progress Timeline */}
                <div className="py-2">
                  <span className="text-xs font-bold text-slate-700 block mb-3">Tahapan Proses Permohonan:</span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center gap-2 text-emerald-950 font-medium">
                      <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                      <span>1. Berkas Diterima Sistem</span>
                    </div>

                    <div
                      className={`p-3 rounded-xl border flex items-center gap-2 font-medium ${
                        item.status === 'PROCESSING' || item.status === 'VERIFIED' || item.status === 'COMPLETED' || item.status === 'APPROVED'
                          ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
                          : item.status === 'REJECTED'
                          ? 'bg-rose-50 border-rose-200 text-rose-950'
                          : 'bg-slate-50 border-slate-200 text-slate-400'
                      }`}
                    >
                      {item.status === 'PROCESSING' || item.status === 'VERIFIED' || item.status === 'COMPLETED' || item.status === 'APPROVED' ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                      ) : item.status === 'REJECTED' ? (
                        <XCircle className="w-4 h-4 text-rose-700 shrink-0" />
                      ) : (
                        <Clock className="w-4 h-4 text-slate-400 shrink-0" />
                      )}
                      <span>2. Verifikasi Data Warga</span>
                    </div>

                    <div
                      className={`p-3 rounded-xl border flex items-center gap-2 font-medium ${
                        item.status === 'COMPLETED' || item.status === 'APPROVED'
                          ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
                          : item.status === 'REJECTED'
                          ? 'bg-rose-50 border-rose-200 text-rose-950'
                          : 'bg-slate-50 border-slate-200 text-slate-400'
                      }`}
                    >
                      {item.status === 'COMPLETED' || item.status === 'APPROVED' ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                      ) : item.status === 'REJECTED' ? (
                        <XCircle className="w-4 h-4 text-rose-700 shrink-0" />
                      ) : (
                        <Clock className="w-4 h-4 text-slate-400 shrink-0" />
                      )}
                      <span>3. Penerbitan & TTD Kades</span>
                    </div>
                  </div>
                </div>

                {/* Rejection Note */}
                {item.status === 'REJECTED' && item.rejectionReason && (
                  <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-950 text-xs space-y-1">
                    <span className="font-bold block flex items-center gap-1.5 text-rose-800">
                      <AlertCircle className="w-4 h-4" /> Catatan Penolakan Berkas:
                    </span>
                    <p className="leading-relaxed">{item.rejectionReason}</p>
                    <p className="text-[11px] text-rose-700 pt-1">
                      Silakan ajukan ulang permohonan baru dengan memperbaiki catatan di atas.
                    </p>
                  </div>
                )}

                {/* Approved Download Action (Strictly Only When Completed / Approved) */}
                {(item.status === 'COMPLETED' || item.status === 'APPROVED') ? (
                  <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                    <div>
                      <span className="font-extrabold text-sm text-emerald-950 block flex items-center gap-1.5">
                        <ShieldCheck className="w-5 h-5 text-emerald-700" />
                        Surat Resmi Telah Diterbitkan
                      </span>
                      <p className="text-xs text-emerald-800 mt-0.5">
                        Dokumen telah ditandatangani Kepala Desa Jombe (Jusmaedy, S.Pd) dengan KOP resmi dan siap dicetak / diunduh.
                      </p>
                    </div>

                    <a
                      href={item.pdfUrl || `${(process.env.NEXT_PUBLIC_API_URL || 'https://lentera-desa-backend.vercel.app/api').replace(/\/$/, '')}/operator/pdf/${item.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-5 py-3 bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 shrink-0"
                    >
                      <Download className="w-4 h-4" />
                      <span>Unduh & Cetak Dokumen PDF</span>
                    </a>
                  </div>
                ) : (
                  <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200 text-amber-900 text-xs flex items-center gap-2.5">
                    <Clock className="w-4 h-4 text-amber-700 shrink-0" />
                    <span>Surat masih dalam proses verifikasi oleh Operator Kantor Desa Jombe. Dokumen PDF baru dapat diunduh setelah disetujui.</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {searched && !loading && !complaintResult && results.length === 0 && (
        <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center space-y-3">
          <FileText className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">Data Tidak Ditemukan</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Tidak ditemukan berkas surat atau pengaduan dengan identitas &quot;{identifier}&quot;. Pastikan nomor registrasi atau NIK yang Anda masukkan sudah benar.
          </p>
          <div className="pt-2">
            <Link
              href="/layanan"
              className="inline-flex items-center gap-2 text-xs font-bold text-emerald-800 hover:text-emerald-900"
            >
              <span>Ajukan Permohonan Surat Baru</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default function LacakPage() {
  return (
    <Suspense fallback={<div className="min-h-screen py-20 text-center text-xs text-slate-500">Memuat halaman pelacakan...</div>}>
      <LacakContent />
    </Suspense>
  );
}
