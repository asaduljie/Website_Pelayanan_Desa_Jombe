'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  FileText,
  Upload,
  Camera,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  FileCheck,
  Send,
  ShieldCheck,
  Copy,
  ExternalLink,
  Sparkles,
} from 'lucide-react';
import api from '@/lib/api';
import Captcha from '@/components/ui/Captcha';

// Requirement definitions by service slug
const SERVICE_REQUIREMENTS: Record<string, Array<{ id: string; label: string; description: string; required: boolean }>> = {
  'surat-keterangan-tidak-mampu': [
    { id: 'ktp', label: 'Foto e-KTP Pemohon / Orang Tua', description: 'Foto e-KTP asli pemohon atau orang tua (jelas & terbaca)', required: true },
    { id: 'kk', label: 'Foto Kartu Keluarga (KK)', description: 'Foto Kartu Keluarga pemohon', required: true },
    { id: 'pendukung', label: 'Bukti Pendukung / Keterangan DTKS (Opsional)', description: 'Foto kartu KIS/PKH/KIP atau surat pengantar (jika ada)', required: false },
  ],
  'surat-keterangan-wali': [
    { id: 'ktp_wali', label: 'Foto e-KTP Wali / Orang Tua', description: 'Foto e-KTP wali yang bersangkutan', required: true },
    { id: 'kk', label: 'Foto Kartu Keluarga (KK)', description: 'Foto Kartu Keluarga pemohon/wali', required: true },
    { id: 'identitas_anak', label: 'Foto Rapor / Kartu Pelajar / NISN Anak', description: 'Foto bukti identitas anak / siswa yang diwakilkan', required: true },
  ],
  'surat-keterangan-kepemilikan-kendaraan-bermotor': [
    { id: 'ktp', label: 'Foto e-KTP Pemilik Kendaraan', description: 'Foto e-KTP pemohon yang sah', required: true },
    { id: 'stnk_bpkb', label: 'Foto STNK / BPKB Kendaraan', description: 'Foto STNK atau BPKB kendaraan bermotor', required: true },
    { id: 'kendaraan', label: 'Foto Fisik Kendaraan & Plat Nomor', description: 'Foto kendaraan yang memuat plat nomor polisi jelas', required: true },
  ],
  'surat-keterangan-usaha': [
    { id: 'ktp', label: 'Foto e-KTP Pemilik Usaha', description: 'Foto e-KTP asli yang masih berlaku (jelas & tidak buram)', required: true },
    { id: 'kk', label: 'Foto Kartu Keluarga (KK)', description: 'Foto Kartu Keluarga pemilik usaha', required: true },
    { id: 'usaha', label: 'Foto Tempat / Aktivitas Usaha', description: 'Foto toko / tempat dagang / aktivitas usaha warga di desa', required: true },
  ],
  'surat-keterangan-domisili': [
    { id: 'ktp', label: 'Foto e-KTP Pemohon', description: 'Foto e-KTP pemohon yang masih berlaku', required: true },
    { id: 'kk', label: 'Foto Kartu Keluarga (KK)', description: 'Foto Kartu Keluarga tempat tinggal pemohon', required: true },
  ],
  'surat-keterangan-kelakuan-baik': [
    { id: 'ktp', label: 'Foto e-KTP Pemohon', description: 'Foto e-KTP pemohon', required: true },
    { id: 'kk', label: 'Foto Kartu Keluarga (KK)', description: 'Foto Kartu Keluarga pemohon', required: true },
    { id: 'pas_foto', label: 'Pas Foto Formal (3x4 atau 4x6)', description: 'Foto formal latar belakang merah / biru (jika ada)', required: false },
  ],
  'surat-keterangan-belum-menikah': [
    { id: 'ktp', label: 'Foto e-KTP Pemohon', description: 'Foto e-KTP pemohon yang masih berlaku', required: true },
    { id: 'kk', label: 'Foto Kartu Keluarga (KK)', description: 'Foto Kartu Keluarga pemohon', required: true },
  ],
  'surat-keterangan-kematian': [
    { id: 'kk', label: 'Foto Kartu Keluarga (KK)', description: 'Foto Kartu Keluarga almarhum/ah', required: true },
    { id: 'ktp_pelapor', label: 'Foto e-KTP Pelapor / Ahli Waris', description: 'Foto e-KTP anggota keluarga yang melaporkan', required: true },
    { id: 'surat_rs', label: 'Surat Kematian RS / Pengantar Dusun', description: 'Surat kematian dari RS / bidan / pengantar dusun (jika ada)', required: false },
  ],
  'surat-keterangan-umum': [
    { id: 'ktp', label: 'Foto e-KTP Pemohon', description: 'Foto e-KTP pemohon yang masih berlaku', required: true },
    { id: 'kk', label: 'Foto Kartu Keluarga (KK)', description: 'Foto Kartu Keluarga pemohon', required: true },
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

  // Form Identitas Pemohon
  const [nama, setNama] = useState('');
  const [nik, setNik] = useState('');
  const [phone, setPhone] = useState('');
  const [dusun, setDusun] = useState('Dusun Jombe Selatan');
  const [alamatLengkap, setAlamatLengkap] = useState('');

  // Captcha State
  const [captchaToken, setCaptchaToken] = useState('');
  const [captchaAnswer, setCaptchaAnswer] = useState('');
  const [captchaError, setCaptchaError] = useState('');

  // Result State for Success Modal
  const [submittedResult, setSubmittedResult] = useState<any>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    api
      .get(`/services/${slug}`)
      .then((res) => {
        if (res.data.status === 'success') {
          setService(res.data.data);
        }
      })
      .catch(() => {
        const fallbackTitles: Record<string, string> = {
          'surat-keterangan-tidak-mampu': 'Surat Keterangan Kurang Mampu (SKTM)',
          'surat-keterangan-wali': 'Surat Keterangan Wali',
          'surat-keterangan-kepemilikan-kendaraan-bermotor': 'Surat Keterangan Kepemilikan Kendaraan Bermotor',
          'surat-keterangan-usaha': 'Surat Keterangan Usaha (SKU)',
          'surat-keterangan-domisili': 'Surat Keterangan Domisili',
          'surat-keterangan-kelakuan-baik': 'Surat Keterangan Kelakuan Baik (SKKB)',
          'surat-keterangan-belum-menikah': 'Surat Keterangan Belum Menikah',
          'surat-keterangan-kematian': 'Surat Keterangan Kematian',
          'surat-keterangan-umum': 'Surat Keterangan Umum / Lainnya',
        };
        setService({
          id: `srv-${slug}`,
          name: fallbackTitles[slug] || 'Surat Keterangan Resmi',
          slug: slug,
          category: 'Pelayanan Publik',
          description: 'Pengajuan dokumen resmi Pemerintah Desa Jombe, Kecamatan Turatea, Kabupaten Jeneponto.',
        });
      })
      .finally(() => setLoading(false));
  }, [slug]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('jombe_user');
      if (stored) {
        try {
          const u = JSON.parse(stored);
          if (u.name) setNama(u.name);
          if (u.nik) setNik(u.nik);
          if (u.phone) setPhone(u.phone);
          if (u.dusun) setDusun(u.dusun);
          if (u.address) setAlamatLengkap(u.address);
        } catch (e) {}
      }
    }
  }, []);

  const requiredDocs = SERVICE_REQUIREMENTS[slug] || [
    { id: 'ktp', label: 'Foto KTP Pemohon', description: 'Foto e-KTP asli yang masih berlaku', required: true },
    { id: 'kk', label: 'Foto Kartu Keluarga (KK)', description: 'Foto Kartu Keluarga pemohon', required: true },
  ];

  const handleFileUpload = async (docId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const compressedBlob = await compressImage(file);
    const compressedFile = new File([compressedBlob], file.name, { type: compressedBlob.type });
    const sizeKb = Math.round(compressedBlob.size / 1024);

    const reader = new FileReader();
    reader.readAsDataURL(compressedBlob);
    reader.onloadend = () => {
      const base64data = reader.result as string;
      setUploadedFiles((prev) => ({
        ...prev,
        [docId]: {
          file: compressedFile,
          preview: base64data,
          compressedSize: `${sizeKb} KB (Terkonversi Ringan)`,
        },
      }));
    };
  };

  const handleCopyAppNumber = (appNum: string) => {
    navigator.clipboard.writeText(appNum);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCaptchaError('');

    const cleanNik = nik.replace(/\D/g, '');
    if (cleanNik.length !== 16) {
      alert('NIK wajib berjumlah tepat 16 digit angka sesuai e-KTP.');
      return;
    }

    if (!captchaAnswer) {
      setCaptchaError('Silakan jawab pertanyaan verifikasi keamanan (Captcha).');
      return;
    }

    // Check mandatory docs
    for (const doc of requiredDocs) {
      if (doc.required && !uploadedFiles[doc.id]) {
        alert(`Mohon unggah berkas persyaratan: ${doc.label}`);
        return;
      }
    }

    setSubmitting(true);
    try {
      const photosArray = Object.entries(uploadedFiles).map(([docId, fileItem]) => {
        const matchingDoc = requiredDocs.find((d) => d.id === docId);
        return {
          title: matchingDoc ? matchingDoc.label : `Foto Dokumen ${docId}`,
          type: docId.toUpperCase(),
          url: fileItem.preview,
        };
      });

      const fullAddress = `${dusun}, Desa Jombe${alamatLengkap ? ` (${alamatLengkap})` : ''}`;
      const detailsArray = Object.entries(formData).map(([k, v]) => `${k}: ${v}`);
      const combinedDetails = detailsArray.length > 0 ? detailsArray.join(', ') : 'Pengajuan Surat Mandiri Portal Desa Jombe';

      const dataPayload = {
        nik: cleanNik,
        name: nama,
        phone: phone || '-',
        address: fullAddress,
        serviceId: service?.id || `srv-${slug}`,
        serviceName: service?.name || 'Surat Keterangan Resmi',
        serviceSlug: slug,
        fieldValues: combinedDetails,
        uploadedPhotos: photosArray,
        captchaToken,
        captchaAnswer,
      };

      const res = await api.post('/applications', dataPayload);

      if (res.data?.status === 'success') {
        setSubmittedResult({
          applicationNumber: res.data.data.applicationNumber,
          serviceName: res.data.data.serviceName || service?.name,
          userName: res.data.data.userName || nama,
          userNik: cleanNik,
          createdAt: res.data.data.createdAt,
        });
      }
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Gagal mengirim permohonan surat.';
      if (msg.toLowerCase().includes('captcha')) {
        setCaptchaError(msg);
      } else {
        alert(msg);
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="min-h-screen py-20 text-center text-xs text-slate-500">Memuat formulir pengajuan...</div>;
  }

  // ============================================================================
  // SUCCESS CONFIRMATION MODAL (PUBLIC TRACKING NOTIFICATION)
  // ============================================================================
  if (submittedResult) {
    return (
      <div className="min-h-screen py-12 max-w-2xl mx-auto px-4 sm:px-6">
        <div className="bg-white rounded-3xl p-8 border border-emerald-200 shadow-xl space-y-6 text-center">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto shadow-inner">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 inline-block">
              Permohonan Berhasil Dikirim
            </span>
            <h2 className="text-2xl font-extrabold text-slate-900">Surat Sedang Diproses Operator</h2>
            <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
              Data permohonan dan berkas dokumen Anda telah masuk ke sistem antrean verifikasi Kantor Desa Jombe.
            </p>
          </div>

          {/* Registration Number Card */}
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 text-left space-y-3">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Nomor Registrasi Surat Anda:</span>
            <div className="flex items-center justify-between gap-3 bg-white p-3 rounded-xl border border-slate-300">
              <span className="font-mono text-lg font-black text-emerald-900 tracking-wider">
                {submittedResult.applicationNumber}
              </span>
              <button
                type="button"
                onClick={() => handleCopyAppNumber(submittedResult.applicationNumber)}
                className="px-3 py-1.5 text-xs font-bold bg-emerald-50 text-emerald-800 hover:bg-emerald-100 rounded-lg border border-emerald-200 flex items-center gap-1.5 transition-all"
              >
                <Copy className="w-3.5 h-3.5" />
                {copied ? 'Tersalin!' : 'Salin Nomor'}
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600 pt-2 border-t border-slate-200">
              <div><span className="text-slate-400 font-medium">Layanan:</span> <span className="font-bold text-slate-800 block">{submittedResult.serviceName}</span></div>
              <div><span className="text-slate-400 font-medium">Nama Pemohon:</span> <span className="font-bold text-slate-800 block">{submittedResult.userName}</span></div>
            </div>
          </div>

          {/* Direct Actions */}
          <div className="space-y-2 pt-2">
            <button
              onClick={() => router.push(`/lacak?nomor=${submittedResult.applicationNumber}`)}
              className="w-full py-3.5 bg-emerald-800 hover:bg-emerald-900 text-white font-extrabold text-xs rounded-xl shadow-md flex items-center justify-center gap-2 transition-all"
            >
              <ExternalLink className="w-4 h-4" /> Lacak Status Surat Ini Sekarang
            </button>
            <button
              onClick={() => router.push('/layanan')}
              className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-all"
            >
              Kembali ke Katalog Layanan Surat
            </button>
          </div>

          <p className="text-[11px] text-slate-400">
            💡 <em>Simpan nomor registrasi Anda. Begitu surat disetujui, Anda dapat langsung mengunduh berkas PDF resmi dari menu Lacak Surat.</em>
          </p>
        </div>
      </div>
    );
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
        <h1 className="text-2xl sm:text-3xl font-extrabold">{service?.name || 'Surat Keterangan Usaha'}</h1>
        <p className="text-xs text-emerald-100/90 leading-relaxed max-w-2xl">
          Layanan administrasi resmi Desa Jombe. Masukkan NIK Anda, unggah foto dokumen persyaratan, dan sistem akan menerbitkan nomor registrasi lacak surat.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* SECTION 1: DATA IDENTITAS PEMOHON */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-soft space-y-6">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <FileText className="w-4 h-4 text-emerald-800" /> 1. Data Identitas Pemohon
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1">
              <label className="font-bold text-slate-700 block">NIK *</label>
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={16}
                required
                value={nik}
                placeholder="Masukkan NIK"
                onChange={(e) => setNik(e.target.value.replace(/\D/g, ''))}
                className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl bg-slate-50 text-slate-900 font-mono font-medium focus:ring-2 focus:ring-emerald-700"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700 block">Nama Lengkap *</label>
              <input
                type="text"
                required
                value={nama}
                placeholder="Nama Pemohon"
                onChange={(e) => setNama(e.target.value)}
                className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl bg-slate-50 text-slate-900 font-medium focus:ring-2 focus:ring-emerald-700"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700 block">Dusun *</label>
              <select
                value={dusun}
                onChange={(e) => setDusun(e.target.value)}
                className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl bg-slate-50 text-slate-900 font-medium focus:ring-2 focus:ring-emerald-700"
              >
                <option value="Dusun Jombe Selatan">Dusun Jombe Selatan</option>
                <option value="Dusun Jombe Barat">Dusun Jombe Barat</option>
                <option value="Dusun Jombe Timur">Dusun Jombe Timur</option>
                <option value="Dusun Jombe Utara">Dusun Jombe Utara</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700 block">Nomor Telepon *</label>
              <input
                type="tel"
                required
                value={phone}
                placeholder="Nomor Telepon / HP"
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl bg-slate-50 text-slate-900 font-medium focus:ring-2 focus:ring-emerald-700"
              />
            </div>

            <div className="sm:col-span-2 space-y-1">
              <label className="font-bold text-slate-700 block">Alamat Lengkap</label>
              <input
                type="text"
                value={alamatLengkap}
                placeholder="Contoh: RT 02 RW 01, Dekat Masjid / Lapangan"
                onChange={(e) => setAlamatLengkap(e.target.value)}
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
                  <label className="font-bold text-slate-700 block">Nama Usaha / Toko / Dagang *</label>
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
                    placeholder="Contoh: Penjualan Sembako, Pertanian Jagung, Peternakan"
                    onChange={(e) => setFormData({ ...formData, jenis_usaha: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl bg-slate-50 text-slate-900 font-medium focus:ring-2 focus:ring-emerald-700"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 block">Alamat / Lokasi Tempat Usaha *</label>
                  <textarea
                    rows={2}
                    required
                    placeholder="Contoh: Jl. Poros Dusun Jombe Selatan RT 02 RW 01 Desa Jombe"
                    onChange={(e) => setFormData({ ...formData, alamat_usaha: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl bg-slate-50 text-slate-900 font-medium focus:ring-2 focus:ring-emerald-700"
                  />
                </div>
              </>
            ) : (
              <div className="space-y-1">
                <label className="font-bold text-slate-700 block">Keperluan / Keterangan Pengajuan Surat *</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Jelaskan keperluan pembuatan surat ini, contoh: Persyaratan beasiswa, pendaftaran sekolah, kelengkapan administrasi bank, dll."
                  onChange={(e) => setFormData({ ...formData, keperluan: e.target.value })}
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl bg-slate-50 text-slate-900 font-medium focus:ring-2 focus:ring-emerald-700"
                />
              </div>
            )}
          </div>
        </div>

        {/* SECTION 3: UPLOAD DOKUMEN & AUTO COMPRESSION */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-soft space-y-6">
          <div className="border-b border-slate-100 pb-3 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
            <div>
              <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <Camera className="w-4 h-4 text-emerald-800" /> 3. Dokumen Persyaratan Wajib Diunggah
              </h3>
              <p className="text-xs text-slate-500">Mendukung format .JPG, .JPEG, .PNG, dan .PDF (Otomatis dikompres ringan &lt; 500KB).</p>
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

        {/* SECTION 4: CAPTCHA ANTI-BOT VERIFICATION */}
        <Captcha
          onCaptchaChange={(t, a) => {
            setCaptchaToken(t);
            setCaptchaAnswer(a);
            setCaptchaError('');
          }}
          error={captchaError}
        />

        {/* SUBMIT BUTTON */}
        <div className="pt-2">
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
