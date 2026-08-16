'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  FileText,
  Upload,
  Camera,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  Image as ImageIcon,
  FileCheck,
  Send,
  Sparkles,
  ShieldCheck,
  X,
} from 'lucide-react';
import api from '@/lib/api';

// Requirement definitions by service slug
const SERVICE_REQUIREMENTS: Record<string, Array<{ id: string; label: string; description: string; required: boolean }>> = {
  'surat-keterangan-usaha': [
    { id: 'ktp', label: 'Foto KTP Pemohon', description: 'Foto e-KTP asli yang masih berlaku (jelas & tidak buram)', required: true },
    { id: 'usaha', label: 'Foto Tempat / Kegiatan Usaha', description: 'Foto papan nama / toko / aktivitas usaha warga', required: true },
  ],
  'surat-keterangan-domisili': [
    { id: 'ktp', label: 'Foto KTP Pemohon', description: 'Foto e-KTP pemohon yang masih berlaku', required: true },
    { id: 'kk', label: 'Foto Kartu Keluarga (KK)', description: 'Foto Kartu Keluarga tempat tinggal pemohon', required: true },
  ],
  'surat-keterangan-tidak-mampu': [
    { id: 'ktp', label: 'Foto KTP Pemohon / Orang Tua', description: 'Foto e-KTP pemohon atau orang tua', required: true },
    { id: 'kk', label: 'Foto Kartu Keluarga (KK)', description: 'Foto Kartu Keluarga pemohon', required: true },
  ],
  'surat-keterangan-kelahiran': [
    { id: 'kk', label: 'Foto Kartu Keluarga (KK)', description: 'Foto KK keluarga pemohon', required: true },
    { id: 'ktp_ortu', label: 'Foto KTP Kedua Orang Tua', description: 'Foto e-KTP Ayah dan Ibu', required: true },
    { id: 'surat_bidan', label: 'Surat Pengantar Bidan / Rumah Sakit', description: 'Surat keterangan kelahiran dari bidan / klinik / RS', required: true },
  ],
  'surat-keterangan-kematian': [
    { id: 'kk', label: 'Foto Kartu Keluarga (KK)', description: 'Foto Kartu Keluarga almarhum/ah', required: true },
    { id: 'ktp_jenazah', label: 'Foto KTP Almarhum / Jenazah', description: 'Foto e-KTP almarhum/ah', required: true },
    { id: 'surat_rs', label: 'Surat Kematian RS / Pengantar RT', description: 'Surat kematian dari dokter / rumah sakit / pengantar RT', required: true },
  ],
};

// Helper: Auto-compress images down to < 500KB
const compressImage = async (file: File): Promise<Blob> => {
  if (file.type === 'application/pdf') return file;

  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        // Max dimension 1280px for clear document readability & small file size
        const MAX_DIMENSION = 1280;
        if (width > height && width > MAX_DIMENSION) {
          height = Math.round((height * MAX_DIMENSION) / width);
          width = MAX_DIMENSION;
        } else if (height > MAX_DIMENSION) {
          width = Math.round((width * MAX_DIMENSION) / height);
          height = MAX_DIMENSION;
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);

        // Quality 0.75 results in ~150KB - 300KB file size
        canvas.toBlob(
          (blob) => {
            resolve(blob || file);
          },
          'image/jpeg',
          0.75
        );
      };
    };
  });
};

export default function ServiceApplicationFormPage() {
  const params = useParams();
  const router = useRouter();
  const slug = String(params.slug);

  const [service, setService] = useState<any>(null);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [uploadedFiles, setUploadedFiles] = useState<Record<string, { file: File; preview: string; compressedSize: string }>>({});
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  // User auth state
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const stored = localStorage.getItem('jombe_user');
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch (e) {}
    }

    api
      .get(`/services/${slug}`)
      .then((res) => {
        if (res.data.status === 'success') {
          setService(res.data.data);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [slug]);

  const requiredDocs = SERVICE_REQUIREMENTS[slug] || [
    { id: 'ktp', label: 'Foto KTP Pemohon', description: 'Foto e-KTP asli yang masih berlaku', required: true },
    { id: 'kk', label: 'Foto Kartu Keluarga (KK)', description: 'Foto Kartu Keluarga pemohon', required: true },
  ];

  const handleFileUpload = async (docId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Auto Compress Image
    const compressedBlob = await compressImage(file);
    const compressedFile = new File([compressedBlob], file.name, { type: compressedBlob.type });
    const previewUrl = file.type.startsWith('image/') ? URL.createObjectURL(compressedBlob) : '';

    const sizeKb = Math.round(compressedBlob.size / 1024);

    setUploadedFiles((prev) => ({
      ...prev,
      [docId]: {
        file: compressedFile,
        preview: previewUrl,
        compressedSize: `${sizeKb} KB (Terkonversi Ringan)`,
      },
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check mandatory docs
    for (const doc of requiredDocs) {
      if (doc.required && !uploadedFiles[doc.id]) {
        alert(`Mohon unggah dokumen: ${doc.label}`);
        return;
      }
    }

    setSubmitting(true);
    try {
      const token = localStorage.getItem('jombe_token');
      const dataPayload = {
        serviceId: service?.id || 'service-sku-1',
        fieldValues: Object.entries(formData).map(([k, v]) => `${k}: ${v}`).join(', ') || 'Permohonan Surat Keterangan Usaha Desa Jombe',
      };

      const res = await api.post('/applications', dataPayload, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      if (res.data.status === 'success') {
        alert(`Permohonan Surat Berhasil Dikirim!\n\nNomor Registrasi: ${res.data.data.applicationNumber}\nDokumen Surat Permohonan Anda telah masuk ke sistem Operator Desa Jombe.`);
        router.push('/dashboard');
      }
    } catch (err: any) {
      alert('Gagal mengirim permohonan: ' + (err.response?.data?.message || 'Error'));
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="min-h-screen py-20 text-center text-xs text-slate-500">Memuat formulir pengajuan...</div>;
  }

  return (
    <div className="min-h-screen py-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 bg-slate-50/50">
      {/* Back Button */}
      <button
        onClick={() => router.push('/layanan')}
        className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-emerald-900 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Kembali ke Katalog Layanan
      </button>

      {/* Header Banner */}
      <div className="bg-gradient-to-br from-emerald-950 via-emerald-900 to-emerald-800 text-white rounded-3xl p-8 shadow-lg border border-emerald-800/60 space-y-2">
        <span className="text-[10px] text-emerald-300 font-bold uppercase tracking-widest block">Formulir Permohonan Administrasi</span>
        <h1 className="text-2xl sm:text-3xl font-extrabold">{service?.name || 'Surat Keterangan Usaha (SKU)'}</h1>
        <p className="text-xs text-emerald-100/90 leading-relaxed max-w-2xl">
          Isi data identitas permohonan dan unggah dokumen persyaratan yang diwajibkan di bawah ini. Foto akan otomatis dikompres agar ringan dan cepat diunggah.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* SECTION 1: DATA IDENTITAS PEMOHON */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-soft space-y-6">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <FileText className="w-4 h-4 text-emerald-800" /> 1. Data Identitas Pemohon
            </h3>
            <p className="text-xs text-slate-500">Pastikan data di bawah sesuai dengan Kartu Tanda Penduduk (KTP).</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1">
              <label className="font-bold text-slate-700 block">Nama Lengkap Pemohon *</label>
              <input
                type="text"
                required
                defaultValue={user?.name || 'Siti Rahmawati'}
                onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl bg-slate-50 text-slate-900 font-medium focus:ring-2 focus:ring-emerald-700"
              />
            </div>
            <div className="space-y-1">
              <label className="font-bold text-slate-700 block">NIK (16 Digit) *</label>
              <input
                type="text"
                required
                defaultValue={user?.nik || '3512345678900001'}
                onChange={(e) => setFormData({ ...formData, nik: e.target.value })}
                className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl bg-slate-50 text-slate-900 font-mono font-medium focus:ring-2 focus:ring-emerald-700"
              />
            </div>
            <div className="space-y-1">
              <label className="font-bold text-slate-700 block">Nomor WhatsApp / HP Aktif *</label>
              <input
                type="tel"
                required
                defaultValue={user?.phone || '085712345678'}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="Contoh: 081234567890"
                className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl bg-slate-50 text-slate-900 font-medium focus:ring-2 focus:ring-emerald-700"
              />
            </div>
            <div className="space-y-1">
              <label className="font-bold text-slate-700 block">Alamat Domisili Lengkap *</label>
              <input
                type="text"
                required
                defaultValue={user?.address || 'Dusun Krajan RT 02 RW 01 Desa Jombe'}
                onChange={(e) => setFormData({ ...formData, alamat: e.target.value })}
                className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl bg-slate-50 text-slate-900 font-medium focus:ring-2 focus:ring-emerald-700"
              />
            </div>
          </div>
        </div>

        {/* SECTION 2: RINCIAN KETERANGAN SURAT */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-soft space-y-6">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <FileCheck className="w-4 h-4 text-emerald-800" /> 2. Rincian Keterangan yang Diajukan
            </h3>
            <p className="text-xs text-slate-500">Tuliskan rincian lengkap mengenai permohonan surat Anda.</p>
          </div>

          <div className="space-y-4 text-xs">
            {slug === 'surat-keterangan-usaha' ? (
              <>
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 block">Nama Usaha / Toko *</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Warung Kopi & Sembako Berkah"
                    onChange={(e) => setFormData({ ...formData, nama_usaha: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl bg-slate-50 text-slate-900 font-medium focus:ring-2 focus:ring-emerald-700"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 block">Jenis Bidang Usaha / Komoditas *</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Penjualan Sembako & Makanan Ringan"
                    onChange={(e) => setFormData({ ...formData, jenis_usaha: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl bg-slate-50 text-slate-900 font-medium focus:ring-2 focus:ring-emerald-700"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 block">Alamat / Lokasi Usaha *</label>
                  <textarea
                    rows={2}
                    required
                    placeholder="Contoh: Jl. Diponegoro Dusun Krajan RT 02 RW 01 Desa Jombe"
                    onChange={(e) => setFormData({ ...formData, alamat_usaha: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl bg-slate-50 text-slate-900 font-medium focus:ring-2 focus:ring-emerald-700"
                  />
                </div>
              </>
            ) : (
              <div className="space-y-1">
                <label className="font-bold text-slate-700 block">Keperluan / Keterangan Tambahan *</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Jelaskan keperluan pembuatan surat ini..."
                  onChange={(e) => setFormData({ ...formData, keperluan: e.target.value })}
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl bg-slate-50 text-slate-900 font-medium focus:ring-2 focus:ring-emerald-700"
                />
              </div>
            )}
          </div>
        </div>

        {/* SECTION 3: CONDITIONAL UPLOAD DOKUMEN & AUTO COMPRESSION */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-soft space-y-6">
          <div className="border-b border-slate-100 pb-3 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
            <div>
              <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <Camera className="w-4 h-4 text-emerald-800" /> 3. Dokumen Persyaratan Wajib Diunggah
              </h3>
              <p className="text-xs text-slate-500">Mendukung format .JPG, .JPEG, .PNG, dan .PDF (Otomatis dikompres &lt; 500KB).</p>
            </div>
            <span className="text-[10px] px-2.5 py-1 bg-emerald-50 text-emerald-800 rounded-full font-bold border border-emerald-200">
              Kompresi Otomatis Aktif
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {requiredDocs.map((doc) => {
              const fileData = uploadedFiles[doc.id];
              return (
                <div
                  key={doc.id}
                  className={`p-5 rounded-2xl border transition-all ${
                    fileData ? 'bg-emerald-50/60 border-emerald-300' : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-xs font-bold text-slate-900 block">{doc.label} {doc.required && <span className="text-rose-600">*</span>}</span>
                    {fileData && (
                      <span className="px-2 py-0.5 bg-emerald-600 text-white rounded-full text-[10px] font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Terunggah
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500 mb-4">{doc.description}</p>

                  {fileData?.preview && (
                    <div className="mb-3 rounded-xl overflow-hidden border border-slate-200 max-h-36 bg-black flex items-center justify-center">
                      <img src={fileData.preview} alt="Preview" className="max-h-36 object-contain" />
                    </div>
                  )}

                  {fileData && (
                    <span className="text-[10px] text-emerald-800 font-bold block mb-3 font-mono">
                      Ukuran Berkas: {fileData.compressedSize}
                    </span>
                  )}

                  {/* Upload & Camera Buttons */}
                  <div className="flex items-center gap-2">
                    {/* Direct Camera Trigger (Mobile friendly with capture="environment") */}
                    <label className="flex-1 py-2 px-3 bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs rounded-xl border border-slate-200 cursor-pointer flex items-center justify-center gap-1.5 transition-colors shadow-2xs">
                      <Camera className="w-3.5 h-3.5 text-emerald-800" />
                      Ambil Foto Kamera
                      <input
                        type="file"
                        accept="image/*"
                        capture="environment"
                        onChange={(e) => handleFileUpload(doc.id, e)}
                        className="hidden"
                      />
                    </label>

                    {/* Galeri / PDF Upload Trigger */}
                    <label className="py-2 px-3 bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs rounded-xl border border-slate-200 cursor-pointer flex items-center justify-center gap-1.5 transition-colors shadow-2xs">
                      <Upload className="w-3.5 h-3.5 text-slate-600" />
                      Pilih Berkas
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/jpg,application/pdf"
                        onChange={(e) => handleFileUpload(doc.id, e)}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* SUBMIT BUTTON */}
        <div className="pt-4">
          <button
            type="submit"
            disabled={submitting}
            className="w-full py-4 bg-emerald-800 hover:bg-emerald-900 disabled:opacity-50 text-white font-extrabold text-sm rounded-2xl shadow-md transition-all flex items-center justify-center gap-2"
          >
            <Send className="w-4 h-4" />
            {submitting ? 'Mengirimkan Permohonan Surat...' : 'Kirim Permohonan Surat Resmi'}
          </button>
        </div>
      </form>
    </div>
  );
}
