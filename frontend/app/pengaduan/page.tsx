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
  const [category, setCategory] = useState('Jalan & Jembatan');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [photo, setPhoto] = useState<File | null>(null);

  const [selectedDetailComplaint, setSelectedDetailComplaint] = useState<any>(null);

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
      let photoBase64 = '';
      if (photo) {
        photoBase64 = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.readAsDataURL(photo);
        });
      }

      const res = await api.post('/complaints', {
        title,
        category,
        description,
        location,
        photoUrl: photoBase64 || undefined,
      });

      if (res.data.status === 'success') {
        setSuccessMessage('Pengaduan Anda berhasil dikirim dan akan segera diperiksa oleh Operator Desa.');
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
      <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-emerald-800 text-white rounded-3xl p-8 sm:p-10 shadow-lg">
        <span className="text-xs text-emerald-300 font-bold uppercase tracking-widest block mb-1">Layanan Aspirasi & Laporan</span>
        <h1 className="text-3xl font-extrabold tracking-tight">Pengaduan Masyarakat Desa Jombe</h1>
        <p className="text-xs sm:text-sm text-gray-200 mt-2">
          Sampaikan laporan terkait jalan rusak, penerangan jalan, pengelolaan sampah, keamanan, atau fasilitas umum desa langsung ke Operator Desa.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form Column */}
        <div className="lg:col-span-1 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-soft h-fit space-y-4">
          <h2 className="text-base font-bold text-gray-900 border-b border-gray-100 pb-3 flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-emerald-800" />
            Buat Laporan Pengaduan
          </h2>

          {errorMessage && (
            <div className="p-3 rounded-xl bg-red-50 text-red-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {errorMessage}
            </div>
          )}

          {successMessage && (
            <div className="p-3 rounded-xl bg-emerald-50 text-emerald-800 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              {successMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div className="space-y-1">
              <label className="font-bold text-gray-700">Kategori Laporan</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-700 bg-gray-50 text-gray-900 font-medium"
              >
                <option value="Jalan & Jembatan">Jalan & Jembatan</option>
                <option value="Penerangan Jalan (PJU)">Penerangan Jalan (PJU)</option>
                <option value="Kebersihan & Lingkungan">Kebersihan & Lingkungan</option>
                <option value="Fasilitas Umum & Air">Fasilitas Umum & Air</option>
                <option value="Keamanan & Ketertiban">Keamanan & Ketertiban</option>
                <option value="Lainnya">Lainnya</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-gray-700">Judul Pengaduan</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Contoh: Lampu jalan mati di Dusun II"
                className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-700 bg-gray-50 text-gray-900"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-gray-700">Lokasi Kejadian</label>
              <input
                type="text"
                required
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Contoh: RT 03 / RW 02 dekat pos ronda"
                className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-700 bg-gray-50 text-gray-900"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-gray-700">Deskripsi Lengkap Masalah</label>
              <textarea
                required
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Jelaskan secara rinci kondisi lapangan agar dapat ditangani..."
                className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-700 bg-gray-50 text-gray-900"
              ></textarea>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-gray-700">Foto Bukti Lapangan (Opsional)</label>
              <div className="border border-dashed border-gray-300 rounded-xl p-3 text-center bg-gray-50">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setPhoto(e.target.files[0]);
                    }
                  }}
                  className="hidden"
                  id="photo-upload"
                />
                <label htmlFor="photo-upload" className="cursor-pointer flex flex-col items-center gap-1 text-gray-500">
                  <Upload className="w-5 h-5 text-gray-400" />
                  <span className="font-medium">{photo ? photo.name : 'Pilih Foto / Gambar Bukti'}</span>
                </label>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 bg-emerald-800 hover:bg-emerald-900 disabled:opacity-50 text-white font-bold rounded-xl shadow-md transition-colors"
            >
              {submitting ? 'Mengirim...' : 'Kirim Pengaduan'}
            </button>
          </form>
        </div>

        {/* Complaints History List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-base font-bold text-gray-900">Daftar Pengaduan Masuk</h2>
            <span className="text-xs text-slate-500 font-medium">Total: {complaints.length} Laporan</span>
          </div>

          {loading ? (
            <div className="text-center py-10 text-xs text-gray-500">Memuat pengaduan...</div>
          ) : complaints.length > 0 ? (
            <div className="space-y-4">
              {complaints.map((item) => (
                <div key={item.id} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-soft space-y-3 hover:border-emerald-300 transition-all">
                  <div className="flex justify-between items-start gap-2">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300">
                          {item.category}
                        </span>
                        <span className="text-xs font-mono font-bold text-slate-500">
                          {item.ticketNumber || `PGD-2026-${String(item.id).slice(-4)}`}
                        </span>
                      </div>
                      <h3 className="text-base font-extrabold text-slate-900 leading-snug">{item.title}</h3>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-[10px] font-bold shrink-0 ${
                        item.status === 'RESOLVED'
                          ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                          : item.status === 'PROCESSING'
                          ? 'bg-sky-100 text-sky-900 border border-sky-300'
                          : item.status === 'REJECTED'
                          ? 'bg-rose-100 text-rose-900 border border-rose-300'
                          : 'bg-amber-100 text-amber-900 border border-amber-300'
                      }`}
                    >
                      {item.status === 'RESOLVED'
                        ? 'Selesai Ditangani'
                        : item.status === 'PROCESSING'
                        ? 'Sedang Diproses Operator'
                        : item.status === 'REJECTED'
                        ? 'Ditolak'
                        : 'Menunggu Pemeriksaan'}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-wrap">{item.description}</p>

                  {item.photoUrl && !item.photoUrl.startsWith('blob:') && (
                    <div className="mt-2 rounded-2xl overflow-hidden border border-slate-200 max-h-56 bg-slate-50">
                      <img
                        src={item.photoUrl}
                        alt="Bukti Lapangan"
                        className="w-full h-52 object-cover"
                        onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
                      />
                    </div>
                  )}

                  <div className="pt-2 flex flex-wrap justify-between items-center gap-2 text-[11px] text-slate-500 border-t border-slate-100 font-medium">
                    <span>📍 Lokasi: <strong>{item.location || 'Desa Jombe'}</strong></span>
                    <span>🕒 {new Date(item.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                  </div>

                  {item.adminResponse && (
                    <div className="mt-3 p-3.5 rounded-2xl bg-emerald-50 text-xs text-emerald-950 border border-emerald-200 space-y-1">
                      <span className="font-extrabold text-emerald-900 block flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-700" /> Tanggapan Resmi Operator Desa:
                      </span>
                      <p className="leading-relaxed font-sans">{item.adminResponse}</p>
                    </div>
                  )}

                  <div className="pt-2 flex justify-end">
                    <button
                      onClick={() => setSelectedDetailComplaint(item)}
                      className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5 transition-colors"
                    >
                      <MessageSquare className="w-3.5 h-3.5" /> Lihat Detail Pengaduan Lengkap
                    </button>
                  </div>
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

      {/* MODAL DETAIL PENGADUAN WARGA */}
      {selectedDetailComplaint && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-6 shadow-2xl overflow-y-auto max-h-[90vh] border border-slate-200 animate-in zoom-in-95 duration-150 text-xs">
            <div className="flex justify-between items-start border-b border-slate-100 pb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300">
                    {selectedDetailComplaint.category}
                  </span>
                  <span className="text-xs font-mono font-bold text-slate-500">
                    {selectedDetailComplaint.ticketNumber || `PGD-2026-${String(selectedDetailComplaint.id).slice(-4)}`}
                  </span>
                </div>
                <h3 className="text-lg font-extrabold text-slate-900">{selectedDetailComplaint.title}</h3>
              </div>
              <button
                onClick={() => setSelectedDetailComplaint(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 grid grid-cols-2 gap-3">
              <div>
                <span className="text-slate-400 block font-medium">Pelapor:</span>
                <span className="font-bold text-slate-900">{selectedDetailComplaint.userName || 'Warga Desa'}</span>
              </div>
              <div>
                <span className="text-slate-400 block font-medium">Status:</span>
                <span className="font-bold text-emerald-800">{selectedDetailComplaint.status}</span>
              </div>
              <div>
                <span className="text-slate-400 block font-medium">Lokasi:</span>
                <span className="font-bold text-slate-900">{selectedDetailComplaint.location || '-'}</span>
              </div>
              <div>
                <span className="text-slate-400 block font-medium">Tanggal Lapor:</span>
                <span className="font-bold text-slate-900">{new Date(selectedDetailComplaint.createdAt).toLocaleDateString('id-ID')}</span>
              </div>
            </div>

            <div className="space-y-2">
              <span className="font-bold text-slate-700 block">Deskripsi Masalah:</span>
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 leading-relaxed font-sans whitespace-pre-wrap">
                {selectedDetailComplaint.description}
              </div>
            </div>

            {selectedDetailComplaint.photoUrl && !selectedDetailComplaint.photoUrl.startsWith('blob:') && (
              <div className="space-y-2">
                <span className="font-bold text-slate-700 block">Foto Bukti Lapangan:</span>
                <div className="rounded-2xl overflow-hidden border border-slate-200 max-h-64 bg-slate-100">
                  <img
                    src={selectedDetailComplaint.photoUrl}
                    alt="Bukti Foto"
                    className="w-full h-64 object-cover"
                    onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
                  />
                </div>
              </div>
            )}

            {selectedDetailComplaint.adminResponse ? (
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-1">
                <span className="font-extrabold text-emerald-900 block flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700" /> Tanggapan Resmi Operator Desa:
                </span>
                <p className="text-slate-800 leading-relaxed font-sans">{selectedDetailComplaint.adminResponse}</p>
              </div>
            ) : (
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 flex items-center gap-2">
                <Clock className="w-4 h-4 shrink-0 text-amber-700" />
                <span>Pengaduan sedang dalam antrean pemeriksaan oleh Operator Desa Jombe.</span>
              </div>
            )}

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedDetailComplaint(null)}
                className="px-5 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white font-bold rounded-xl shadow-md transition-colors"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
