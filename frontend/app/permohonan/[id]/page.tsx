'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Download, ArrowLeft, Clock, CheckCircle2, AlertCircle, FileText } from 'lucide-react';
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
    const downloadUrl = `http://localhost:5000/api/operator/pdf/${id}`;
    window.open(downloadUrl, '_blank');
  };

  if (loading) return <div className="min-h-screen py-20 text-center text-xs text-gray-500">Memuat detail permohonan...</div>;

  if (!application) {
    return (
      <div className="min-h-screen py-20 max-w-lg mx-auto text-center px-4">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />
        <h2 className="text-base font-bold text-gray-900">Permohonan Tidak Ditemukan</h2>
        <button onClick={() => router.push('/dashboard')} className="mt-4 px-4 py-2 bg-jombe-800 text-white rounded-xl text-xs font-bold">
          Kembali ke Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Back Button */}
      <button
        onClick={() => router.back()}
        className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-600 hover:text-jombe-800 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Kembali
      </button>

      {/* Main Application Detail Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-soft space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-gray-100 pb-4 gap-4">
          <div>
            <span className="text-[10px] font-bold text-gray-400 uppercase block">Nomor Lacak</span>
            <h1 className="text-2xl font-extrabold text-jombe-900 font-mono">{application.applicationNumber}</h1>
            <p className="text-xs text-gray-500">{application.service?.name}</p>
          </div>

          <div className="flex items-center gap-3">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-900">
              {application.status}
            </span>

            {/* Direct Download Button */}
            <button
              onClick={handleDownloadPdf}
              className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-md"
            >
              <Download className="w-4 h-4" /> Unduh Surat PDF Resmi
            </button>
          </div>
        </div>

        {/* Dynamic Field Values */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider">Rincian Formulir Warga</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            {application.fieldValues && application.fieldValues.map((fv: any) => (
              <div key={fv.id || fv.value} className="bg-gray-50 p-3.5 rounded-xl border border-gray-200/80">
                <span className="text-gray-500 font-bold block text-[10px]">{fv.field?.label || 'Rincian'}:</span>
                <span className="text-gray-900 font-medium">{fv.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
