'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { MessageSquare, Upload, AlertCircle, CheckCircle2, Clock } from 'lucide-react';
import api from '@/lib/api';

export default function PengaduanPage() {
  const router = useRouter();
  const [complaints, setComplaints] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Jalan');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [photo, setPhoto] = useState<File | null>(null);

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    setLoading(true);
    try {
      const res = await api.get('/complaints');
      if (res.data.status === 'success') {
        setComplaints(res.data.data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('jombe_token');
    if (!token) {
      alert('Silakan login terlebih dahulu untuk mengirim pengaduan.');
      router.push('/login');
      return;
    }

    setSubmitting(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('category', category);
      formData.append('description', description);
      formData.append('location', location);
      if (photo) formData.append('photo', photo);

      const res = await api.post('/complaints', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (res.data.status === 'success') {
        setSuccessMessage('Pengaduan Anda berhasil dikirim dan akan segera ditinjau oleh tim desa.');
        setTitle('');
        setDescription('');
        setLocation('');
        setPhoto(null);
        fetchComplaints();
      }
    } catch (err: any) {
      setErrorMessage(err.response?.data?.message || 'Gagal mengirim pengaduan.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-jombe-900 to-jombe-800 text-white rounded-3xl p-8 sm:p-10 shadow-lg">
        <span className="text-xs text-emerald-300 font-bold uppercase tracking-widest block mb-1">Layanan Aspirasi & Laporan</span>
        <h1 className="text-3xl font-extrabold tracking-tight">Pengaduan Masyarakat Desa Jombe</h1>
        <p className="text-xs sm:text-sm text-gray-200 mt-2">
          Sampaikan laporan terkait jalan rusak, penerangan jalan, pengelolaan sampah, keamanan, atau fasilitas umum desa.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form Column */}
        <div className="lg:col-span-1 bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-soft h-fit space-y-4">
          <h2 className="text-base font-bold text-gray-900 border-b border-gray-100 pb-3 flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-jombe-700" />
            Buat Laporan Pengaduan
          </h2>

          {errorMessage && (
            <div className="p-3 rounded-xl bg-red-50 text-red-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="p-3 rounded-xl bg-emerald-50 text-emerald-800 text-xs flex items-center gap-2 font-semibold">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div className="space-y-1">
              <label className="font-bold text-gray-800">Judul Pengaduan *</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Contoh: Lampu Jalan Dusun Krajan Padam"
                required
                className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-jombe-600 bg-gray-50/50"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-gray-800">Kategori Laporan *</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-jombe-600 bg-gray-50/50"
              >
                <option value="Jalan">Jalan Rusak / Jembatan</option>
                <option value="Lampu">Lampu Penerangan Jalan</option>
                <option value="Sampah">Kebersihan / Pengelolaan Sampah</option>
                <option value="Fasilitas umum">Fasilitas Umum Desa</option>
                <option value="Lingkungan">Lingkungan & Saluran Air</option>
                <option value="Keamanan">Keamanan & Ketertiban</option>
                <option value="Lainnya">Lainnya</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-gray-800">Lokasi Kejadian / RT/RW *</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Contoh: Depan Masjid Dusun Krajan RT 02"
                required
                className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-jombe-600 bg-gray-50/50"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-gray-800">Deskripsi Lengkap *</label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Jelaskan detail permasalahan..."
                required
                className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-jombe-600 bg-gray-50/50"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-gray-800">Foto Bukti (Opsional)</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setPhoto(e.target.files ? e.target.files[0] : null)}
                className="w-full text-xs text-gray-500 file:mr-3 file:py-2 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-jombe-50 file:text-jombe-800 hover:file:bg-jombe-100"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 bg-jombe-800 hover:bg-jombe-900 disabled:opacity-50 text-white font-bold rounded-xl shadow-md transition-colors"
            >
              {submitting ? 'Mengirim...' : 'Kirim Pengaduan'}
            </button>
          </form>
        </div>

        {/* Complaints History List */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-base font-bold text-gray-900">Daftar Pengaduan Masuk</h2>

          {loading ? (
            <div className="text-center py-10 text-xs text-gray-500">Memuat pengaduan...</div>
          ) : complaints.length > 0 ? (
            <div className="space-y-4">
              {complaints.map((item) => (
                <div key={item.id} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-soft space-y-2">
                  <div className="flex justify-between items-start gap-2">
                    <div>
                      <span className="text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full bg-jombe-50 text-jombe-800 border border-jombe-200">
                        {item.category}
                      </span>
                      <h3 className="text-sm font-bold text-gray-900 mt-1">{item.title}</h3>
                    </div>
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900">
                      {item.status}
                    </span>
                  </div>

                  <p className="text-xs text-gray-600 leading-relaxed">{item.description}</p>

                  <div className="pt-2 flex justify-between items-center text-[11px] text-gray-400 border-t border-gray-50">
                    <span>Lokasi: {item.location}</span>
                    <span>{new Date(item.createdAt).toLocaleDateString('id-ID')}</span>
                  </div>

                  {item.adminResponse && (
                    <div className="mt-2 p-3 rounded-xl bg-emerald-50 text-xs text-emerald-950 border border-emerald-200">
                      <strong>Tanggapan Operator:</strong> {item.adminResponse}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white p-8 rounded-3xl border border-gray-100 text-center text-xs text-gray-500">
              Belum ada pengaduan dikirim.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
