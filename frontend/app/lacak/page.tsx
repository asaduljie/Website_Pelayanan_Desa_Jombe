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
  MessageSquare,
  Landmark,
  FileCheck,
  AlertTriangle
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
      setIdentifier(initialNo);
      handleSearch(initialNo);
    }
  }, [initialNo]);

  const handleSearch = async (queryValue?: string) => {
    const q = (queryValue !== undefined ? queryValue : identifier).trim();
    if (!q) {
      setErrorMessage('Silakan masukkan Nomor Registrasi Surat atau NIK Anda.');
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
        try {
          const compRes = await api.get('/complaints');
          if (compRes.data.status === 'success' && Array.isArray(compRes.data.data)) {
            const found = compRes.data.data.find(
              (c: any) =>
                c.ticketNumber?.toUpperCase() === q.toUpperCase() ||
                String(c.id).toUpperCase() === q.toUpperCase()
            );
            if (found) {
              setComplaintResult(found);
              setLoading(false);
              return;
            }
          }
        } catch (e) {}
      }

      // 2. Query /applications/track
      const isNik = /^\d{16}$/.test(q);
      const res = await api.get('/applications/track', {
        params: isNik
          ? { nik: q, query: q }
          : { regNo: q, applicationNumber: q, query: q },
      });

      if (res.data.status === 'success') {
        let list: any[] = [];
        if (Array.isArray(res.data.allMatches) && res.data.allMatches.length > 0) {
          list = res.data.allMatches;
        } else if (Array.isArray(res.data.data)) {
          list = res.data.data;
        } else if (res.data.data && typeof res.data.data === 'object') {
          list = [res.data.data];
        } else if (res.data.result) {
          list = [res.data.result];
        }

        setResults(list);
      }
    } catch (err: any) {
      console.error('Track error:', err);
      // Fallback check if user is logged in
      try {
        const myApps = await api.get('/applications/my');
        if (myApps.data.status === 'success' && Array.isArray(myApps.data.data)) {
          const filtered = myApps.data.data.filter((a: any) =>
            a.applicationNumber?.toUpperCase().includes(q.toUpperCase()) ||
            a.id === q
          );
          if (filtered.length > 0) {
            setResults(filtered);
            setLoading(false);
            return;
          }
        }
      } catch (e) {}

      setErrorMessage(
        err.response?.data?.message ||
        `Permohonan dengan nomor registrasi / NIK "${q}" tidak ditemukan. Pastikan data yang dimasukkan sudah benar.`
      );
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
            Disetujui & Selesai
          </span>
        );
      case 'PROCESSING':
      case 'VERIFIED':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-sky-100 text-sky-900 border border-sky-300">
            <Clock className="w-4 h-4 text-sky-700" />
            Sedang Diproses Operator
          </span>
        );
      case 'NEED_REVISION':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-orange-100 text-orange-900 border border-orange-300">
            <AlertCircle className="w-4 h-4 text-orange-700" />
            Perlu Perbaikan Dokumen
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
            Menunggu Verifikasi
          </span>
        );
    }
  };

  const getComplaintStatusBadge = (status: string) => {
    switch (status) {
      case 'RESOLVED':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-900 border border-emerald-300">
            <CheckCircle2 className="w-4 h-4 text-emerald-700" />
            Selesai Ditindaklanjuti
          </span>
        );
      case 'PROCESSING':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-sky-100 text-sky-900 border border-sky-300">
            <Clock className="w-4 h-4 text-sky-700" />
            Sedang Ditindaklanjuti
          </span>
        );
      case 'REJECTED':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-900 border border-rose-300">
            <XCircle className="w-4 h-4 text-rose-700" />
            Pengaduan Ditolak
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300">
            <Clock className="w-4 h-4 text-amber-700" />
            Menunggu Tindakan
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen py-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-emerald-800 text-white rounded-3xl p-8 sm:p-10 shadow-lg border border-emerald-700/50">
        <div className="flex items-center gap-2 mb-2 text-xs font-bold uppercase tracking-wider text-emerald-300">
          <Landmark className="w-4 h-4" /> Pelayanan Publik Desa Jombe
        </div>
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight">Lacak Status Surat & Permohonan</h1>
        <p className="text-sm text-emerald-100/90 mt-2 max-w-2xl leading-relaxed">
          Pantau progres permohonan surat administrasi dan pengaduan warga secara transparan. Setelah berkas disetujui, Anda dapat langsung mengunduh dan mencetak dokumen PDF resmi.
        </p>
      </div>

      {/* Search Input Box */}
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
              placeholder="Contoh: JMB-2026-00001 atau 730408xxxxxxxxxx"
              className="w-full pl-11 pr-4 py-3 border border-slate-300 rounded-2xl text-sm bg-slate-50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-700 font-mono"
            />
          </div>
          <button
            onClick={() => handleSearch()}
            disabled={loading}
            className="px-6 py-3 bg-emerald-800 hover:bg-emerald-900 disabled:opacity-50 text-white font-bold rounded-2xl text-sm shadow-md transition-all flex items-center justify-center gap-2 shrink-0 cursor-pointer"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Melacak...</span>
              </>
            ) : (
              <>
                <Search className="w-4 h-4" />
                <span>Lacak Status</span>
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
                  {complaintResult.category || 'Pengaduan Warga'}
                </span>
                <span className="text-xs font-mono font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">
                  {complaintResult.ticketNumber}
                </span>
              </div>
              <h2 className="text-xl font-extrabold text-slate-900">{complaintResult.title}</h2>
            </div>
            {getComplaintStatusBadge(complaintResult.status)}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs bg-slate-50 p-4 rounded-2xl border border-slate-200">
            <div>
              <span className="text-slate-400 block font-medium">Pelapor:</span>
              <span className="font-bold text-slate-900">{complaintResult.userName || complaintResult.user?.name || 'Warga Desa'}</span>
            </div>
            <div>
              <span className="text-slate-400 block font-medium">Lokasi / Dusun:</span>
              <span className="font-bold text-slate-900">{complaintResult.location || 'Desa Jombe'}</span>
            </div>
            <div>
              <span className="text-slate-400 block font-medium">Tanggal Pengaduan:</span>
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
            <span className="font-bold text-slate-700">Rincian Laporan Pengaduan:</span>
            <p className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 leading-relaxed whitespace-pre-wrap font-sans">
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
              <span>Laporan pengaduan ini sedang dalam antrean pemeriksaan oleh Operator Kantor Desa Jombe.</span>
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
            {results.map((item) => {
              const serviceName = item.serviceName || item.service?.name || item.letterType?.name || 'Surat Permohonan Warga';
              const appNumber = item.applicationNumber || item.registrationNo || item.id;
              const applicantName = item.applicantName || item.user?.name || 'Warga Desa';
              const applicantNik = item.applicantNik || item.user?.nik || '-';
              const applicantAddress = item.applicantAddress || item.user?.address || (item.user?.dusun ? `${item.user.dusun}, Desa Jombe` : 'Desa Jombe');
              const isCompleted = item.status === 'COMPLETED' || item.status === 'APPROVED';

              return (
                <div
                  key={item.id}
                  className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-soft space-y-5"
                >
                  {/* Card Header */}
                  <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-4 border-b border-slate-100 pb-4">
                    <div>
                      <div className="flex flex-wrap items-center gap-2 mb-1.5">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-900 border border-emerald-200 uppercase">
                          {serviceName}
                        </span>
                        <span className="font-mono text-xs font-black text-slate-700 bg-slate-100 px-2.5 py-0.5 rounded-md">
                          {appNumber}
                        </span>
                      </div>
                      <h3 className="text-xl font-black text-slate-900">{serviceName}</h3>
                    </div>
                    <div>{getStatusBadge(item.status)}</div>
                  </div>

                  {/* Info Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs bg-slate-50 p-4 rounded-2xl border border-slate-200">
                    <div>
                      <span className="text-slate-400 block font-medium">Nama Pemohon:</span>
                      <span className="font-bold text-slate-900">{applicantName}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block font-medium">NIK:</span>
                      <span className="font-bold text-slate-900 font-mono">{applicantNik}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block font-medium">Dusun / Alamat:</span>
                      <span className="font-bold text-slate-900">{applicantAddress}</span>
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
                      {/* Step 1 */}
                      <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center gap-2 text-emerald-950 font-semibold">
                        <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                        <span>1. Berkas Diterima Sistem</span>
                      </div>

                      {/* Step 2 */}
                      <div
                        className={`p-3 rounded-xl border flex items-center gap-2 font-semibold ${
                          item.status === 'PROCESSING' || item.status === 'VERIFIED' || isCompleted
                            ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
                            : item.status === 'REJECTED'
                            ? 'bg-rose-50 border-rose-200 text-rose-950'
                            : 'bg-slate-50 border-slate-200 text-slate-400'
                        }`}
                      >
                        {item.status === 'PROCESSING' || item.status === 'VERIFIED' || isCompleted ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                        ) : item.status === 'REJECTED' ? (
                          <XCircle className="w-4 h-4 text-rose-700 shrink-0" />
                        ) : (
                          <Clock className="w-4 h-4 text-slate-400 shrink-0" />
                        )}
                        <span>2. Verifikasi Petugas Desa</span>
                      </div>

                      {/* Step 3 */}
                      <div
                        className={`p-3 rounded-xl border flex items-center gap-2 font-semibold ${
                          isCompleted
                            ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
                            : item.status === 'REJECTED'
                            ? 'bg-rose-50 border-rose-200 text-rose-950'
                            : 'bg-slate-50 border-slate-200 text-slate-400'
                        }`}
                      >
                        {isCompleted ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                        ) : item.status === 'REJECTED' ? (
                          <XCircle className="w-4 h-4 text-rose-700 shrink-0" />
                        ) : (
                          <Clock className="w-4 h-4 text-slate-400 shrink-0" />
                        )}
                        <span>3. Penerbitan & TTD Kepala Desa</span>
                      </div>
                    </div>
                  </div>

                  {/* Notes / Revision Reason */}
                  {item.revisionNotes && (
                    <div className={`p-4 rounded-2xl border text-xs space-y-1 ${
                      isCompleted
                        ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950'
                        : item.status === 'REJECTED'
                        ? 'bg-rose-50 border-rose-200 text-rose-950'
                        : item.status === 'NEED_REVISION'
                        ? 'bg-orange-50 border-orange-200 text-orange-950'
                        : 'bg-slate-50 border-slate-200 text-slate-800'
                    }`}>
                      <span className="font-bold block flex items-center gap-1.5">
                        {isCompleted ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                        ) : (
                          <AlertCircle className="w-4 h-4 text-slate-700" />
                        )}
                        Catatan Petugas:
                      </span>
                      <p className="leading-relaxed">{item.revisionNotes}</p>
                    </div>
                  )}

                  {/* Action Box: Download when completed, or waiting message */}
                  {isCompleted ? (
                    <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                      <div>
                        <span className="font-extrabold text-sm text-emerald-950 block flex items-center gap-1.5">
                          <ShieldCheck className="w-5 h-5 text-emerald-700" />
                          Surat Resmi Telah Diterbitkan & Ditandatangani
                        </span>
                        <p className="text-xs text-emerald-800 mt-0.5">
                          Dokumen resmi berkop Pemerintah Desa Jombe telah disahkan dan siap dicetak / diunduh.
                        </p>
                      </div>

                      <a
                        href={item.pdfUrl || `${(process.env.NEXT_PUBLIC_API_URL || 'https://lentera-desa-backend.vercel.app/api').replace(/\/$/, '')}/operator/pdf/${item.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-5 py-3 bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 shrink-0"
                      >
                        <Download className="w-4 h-4" />
                        <span>Unduh Surat PDF Resmi</span>
                      </a>
                    </div>
                  ) : (
                    <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200 text-amber-900 text-xs flex items-center gap-2.5">
                      <Clock className="w-4 h-4 text-amber-700 shrink-0" />
                      <span>Surat saat ini sedang diproses oleh Operator Kantor Desa Jombe. Dokumen PDF dapat diunduh langsung setelah permohonan disetujui.</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Empty State */}
      {searched && !loading && !complaintResult && results.length === 0 && (
        <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center space-y-3">
          <FileText className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">Data Permohonan Tidak Ditemukan</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Tidak ditemukan berkas surat atau pengaduan dengan identitas &quot;{identifier}&quot;. Pastikan nomor registrasi atau NIK yang Anda masukkan sudah benar.
          </p>
          <div className="pt-2">
            <Link
              href="/layanan"
              className="inline-flex items-center gap-2 text-xs font-bold text-emerald-800 hover:text-emerald-950 bg-emerald-50 hover:bg-emerald-100 px-4 py-2.5 rounded-xl transition-all"
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
