'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Download, ArrowLeft, Clock, CheckCircle2, AlertCircle, XCircle, FileText, ShieldCheck } from 'lucide-react';
import api from '@/lib/api';

export default function PermohonanDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [application, setApplication] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDetail();
  }, [id]);

  const fetchDetail = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/applications/${id}`);
      if (res.data.status === 'success') {
        setApplication(res.data.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPdf = () => {
    const baseUrl = (process.env.NEXT_PUBLIC_API_URL || 'https://lentera-desa-backend.vercel.app/api').replace(/\/$/, '');
    const downloadUrl = `${baseUrl}/operator/pdf/${id}`;
    window.open(downloadUrl, '_blank');
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

  if (loading) return <div className="min-h-screen py-20 text-center text-xs text-slate-500">Memuat detail permohonan...</div>;

  if (!application) {
    return (
      <div className="min-h-screen py-20 max-w-lg mx-auto text-center px-4 space-y-4">
        <AlertCircle className="w-12 h-12 text-rose-500 mx-auto" />
        <h2 className="text-base font-bold text-slate-900">Permohonan Tidak Ditemukan</h2>
        <button
          onClick={() => router.push('/dashboard')}
          className="px-5 py-2.5 bg-emerald-800 text-white rounded-xl text-xs font-bold hover:bg-emerald-900 transition-colors cursor-pointer"
        >
          Kembali ke Permohonan Saya
        </button>
      </div>
    );
  }

  const isCompleted = application.status === 'COMPLETED' || application.status === 'APPROVED';

  return (
    <div className="min-h-screen py-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
      {/* Back Button */}
      <button
        onClick={() => router.back()}
        className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-emerald-900 transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" /> Kembali
      </button>

      {/* Main Application Detail Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-soft space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-100 pb-5 gap-4">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase block tracking-wider">Nomor Registrasi Surat</span>
            <h1 className="text-2xl font-extrabold text-slate-900 font-mono">{application.applicationNumber}</h1>
            <p className="text-xs text-emerald-800 font-semibold mt-0.5">{application.service?.name}</p>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            {getStatusBadge(application.status)}

            {/* Direct Download Button (Only when completed/approved) */}
            {isCompleted ? (
              <button
                onClick={handleDownloadPdf}
                className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm cursor-pointer"
              >
                <Download className="w-4 h-4" /> Unduh Dokumen PDF
              </button>
            ) : (
              <span className="text-[11px] text-amber-900 font-medium bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-200 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-amber-700" /> Dalam Pemeriksaan Operator
              </span>
            )}
          </div>
        </div>

        {/* Dynamic Field Values */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
            <FileText className="w-4 h-4 text-emerald-700" />
            Rincian Formulir Permohonan Warga
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            {application.fieldValues && application.fieldValues.map((fv: any) => (
              <div key={fv.id || fv.value} className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                <span className="text-slate-500 font-bold block text-[10px]">{fv.field?.label || 'Keterangan'}:</span>
                <span className="text-slate-900 font-medium">{fv.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
