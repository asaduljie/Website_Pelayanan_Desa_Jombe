'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { MessageSquare, Upload, AlertCircle, CheckCircle2, Clock, ShieldCheck, MapPin, Search, ExternalLink } from 'lucide-react';
import api from '@/lib/api';
import Captcha from '@/components/ui/Captcha';

export default function PengaduanPage() {
  const [complaints, setComplaints] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Form states - mandiri publik
  const [nik, setNik] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('Dusun Jombe Utara');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Jalan & Jembatan');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [photo, setPhoto] = useState<File | null>(null);

  // Captcha state
  const [captchaToken, setCaptchaToken] = useState('');
  const [captchaAnswer, setCaptchaAnswer] = useState('');
  const [captchaKey, setCaptchaKey] = useState(0);

  // Success modal
  const [createdTicket, setCreatedTicket] = useState<any>(null);
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
    setErrorMessage('');

    if (nik.trim().length !== 16 || !/^\d{16}$/.test(nik.trim())) {
      setErrorMessage('NIK wajib berupa 16 digit angka sesuai KTP Anda.');
      return;
    }

    if (!captchaAnswer.trim()) {
      setErrorMessage('Silakan jawab soal matematika Captcha keamanan.');
      return;
    }

    setSubmitting(true);

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
        nik: nik.trim(),
        name: name.trim(),
        phone: phone.trim(),
        address,
        title: title.trim(),
        category,
        description: description.trim(),
        location: location.trim(),
        photoUrl: photoBase64 || undefined,
        captchaToken,
        captchaAnswer: captchaAnswer.trim(),
      });

      if (res.data.status === 'success') {
        setCreatedTicket(res.data.data);
        // Reset form
        setTitle('');
        setDescription('');
        setLocation('');
        setPhoto(null);
        setCaptchaAnswer('');
        setCaptchaKey((prev) => prev + 1);
        fetchComplaints();
      }
    } catch (err: any) {
      setErrorMessage(err.response?.data?.message || 'Gagal mengirim pengaduan. Silakan periksa kembali data Anda.');
      setCaptchaKey((prev) => prev + 1);
    } finally {
      setSubmitting(false);
    }
  };

  const filteredComplaints = complaints.filter((c) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      c.title?.toLowerCase().includes(q) ||
      c.ticketNumber?.toLowerCase().includes(q) ||
      c.category?.toLowerCase().includes(q) ||
      c.location?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="min-h-screen py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-emerald-800 text-white rounded-3xl p-8 sm:p-10 shadow-lg border border-emerald-700/40">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs bg-emerald-700/60 text-emerald-200 font-bold uppercase px-3 py-1 rounded-full border border-emerald-600/40">
            Layanan Publik Mandiri
          </span>
          <span className="text-xs text-emerald-300 font-medium">Tanpa Perlu Login Akun</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Pengaduan Masyarakat Desa Jombe</h1>
        <p className="text-sm text-emerald-100/90 mt-2 max-w-3xl leading-relaxed">
          Sampaikan laporan terkait jalan rusak, saluran irigasi, lampu penerangan jalan, kebersihan, atau fasilitas umum desa. Setiap laporan diverifikasi langsung oleh Operator Desa.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form Column */}
        <div className="lg:col-span-1 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-soft h-fit space-y-5">
          <div>
            <h2 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-3 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-emerald-800" />
              Formulir Aspirasi & Pengaduan
            </h2>
            <p className="text-xs text-slate-500 mt-2">
              Isi data diri pemohon dan rincian masalah.
            </p>
          </div>

          {errorMessage && (
            <div className="p-3 rounded-xl bg-red-50 text-red-700 text-xs flex items-center gap-2 border border-red-200">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div className="space-y-1">
              <label className="font-bold text-gray-700">NIK *</label>
              <input
                type="text"
                required
                maxLength={16}
                value={nik}
                onChange={(e) => setNik(e.target.value.replace(/\D/g, ''))}
                placeholder="Masukkan NIK KTP"
                className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-700 bg-gray-50 text-gray-900 font-mono"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="font-bold text-gray-700">Nama Lengkap *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Nama pelapor"
                  className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-700 bg-gray-50 text-gray-900"
                />
              </div>
              <div className="space-y-1">
                <label className="font-bold text-gray-700">Nomor Telepon *</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Nomor Telepon / HP"
                  className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-700 bg-gray-50 text-gray-900"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-gray-700">Dusun Domisili *</label>
              <select
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-700 bg-gray-50 text-gray-900 font-medium"
              >
                <option value="Dusun Jombe Utara">Dusun Jombe Utara</option>
                <option value="Dusun Jombe Selatan">Dusun Jombe Selatan</option>
                <option value="Dusun Bulo-Bulo">Dusun Bulo-Bulo</option>
                <option value="Dusun Kaluku">Dusun Kaluku</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-gray-700">Kategori Masalah *</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-700 bg-gray-50 text-gray-900 font-medium"
              >
                <option value="Jalan & Jembatan">Jalan & Jembatan</option>
                <option value="Penerangan Jalan">Penerangan Jalan</option>
                <option value="Kebersihan & Lingkungan">Kebersihan & Lingkungan</option>
                <option value="Fasilitas Umum & Air">Fasilitas Umum & Air</option>
                <option value="Keamanan & Ketertiban">Keamanan & Ketertiban</option>
                <option value="Lainnya">Lainnya</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-gray-700">Judul Laporan *</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Contoh: Lampu PJU mati di poros Dusun Kaluku"
                className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-700 bg-gray-50 text-gray-900"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-gray-700">Lokasi Spesifik Kejadian *</label>
              <input
                type="text"
                required
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Contoh: Depan Posyandu / RT 02 Dusun Bulo-Bulo"
                className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-700 bg-gray-50 text-gray-900"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-gray-700">Uraian Lengkap Masalah *</label>
              <textarea
                required
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Jelaskan kronologi atau kondisi di lapangan secara detail..."
                className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-700 bg-gray-50 text-gray-900"
              ></textarea>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-gray-700">Foto Bukti Lapangan (Opsional)</label>
              <div className="border border-dashed border-gray-300 rounded-xl p-3 text-center bg-gray-50 hover:bg-gray-100 transition-colors">
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
                <label htmlFor="photo-upload" className="cursor-pointer flex flex-col items-center gap-1 text-gray-600">
                  <Upload className="w-5 h-5 text-emerald-700" />
                  <span className="font-medium text-[11px]">{photo ? photo.name : 'Pilih Berkas Foto'}</span>
                </label>
              </div>
            </div>

            {/* Captcha Security */}
            <div className="pt-2 border-t border-slate-100">
              <Captcha
                key={captchaKey}
                onVerify={(token, answer) => {
                  setCaptchaToken(token);
                  setCaptchaAnswer(answer);
                }}
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3.5 bg-emerald-800 hover:bg-emerald-900 disabled:opacity-50 text-white font-bold rounded-xl shadow-md transition-colors flex items-center justify-center gap-2 text-sm"
            >
              {submitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Mengirim Laporan...</span>
                </>
              ) : (
                <>
                  <MessageSquare className="w-4 h-4" />
                  <span>Kirim Laporan Pengaduan</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Complaints History List */}
        <div className="lg:col-span-2 space-y-5">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
            <div>
              <h2 className="text-lg font-bold text-gray-900">Daftar Pengaduan Masuk</h2>
              <p className="text-xs text-slate-500">Transparansi aspirasi warga Desa Jombe dan tindak lanjut aparatur.</p>
            </div>
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari laporan atau no. tiket..."
                className="pl-9 pr-3 py-1.5 border border-slate-200 rounded-xl text-xs bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-700"
              />
            </div>
          </div>

          {loading ? (
            <div className="text-center py-16 text-xs text-gray-500 bg-white rounded-3xl border border-slate-100">
              <div className="w-6 h-6 border-2 border-emerald-700 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
              Memuat pengaduan warga...
            </div>
          ) : filteredComplaints.length > 0 ? (
            <div className="space-y-4">
              {filteredComplaints.map((item) => (
                <div key={item.id} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-soft space-y-3 hover:border-emerald-400 transition-all">
                  <div className="flex justify-between items-start gap-2">
                    <div>
                      <div className="flex flex-wrap items-center gap-2 mb-1">
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
                        ? 'Sedang Ditindaklanjuti'
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
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      Lokasi: <strong>{item.location || 'Desa Jombe'}</strong>
                    </span>
                    <span>🕒 {new Date(item.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                  </div>

                  {item.adminResponse && (
                    <div className="mt-3 p-3.5 rounded-2xl bg-emerald-50 text-xs text-emerald-950 border border-emerald-200 space-y-1">
                      <span className="font-extrabold text-emerald-900 flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-700" /> Tindak Lanjut Operator / Pemerintah Desa Jombe:
                      </span>
                      <p className="leading-relaxed font-sans">{item.adminResponse}</p>
                    </div>
                  )}

                  <div className="pt-2 flex justify-between items-center">
                    <Link
                      href={`/lacak?no=${encodeURIComponent(item.ticketNumber || '')}`}
                      className="text-xs text-emerald-700 hover:text-emerald-900 font-bold flex items-center gap-1"
                    >
                      <ExternalLink className="w-3 h-3" /> Lacak Status Tiket
                    </Link>
                    <button
                      onClick={() => setSelectedDetailComplaint(item)}
                      className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5 transition-colors"
                    >
                      <MessageSquare className="w-3.5 h-3.5" /> Lihat Detail
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white p-12 rounded-3xl border border-gray-100 text-center text-xs text-gray-500 space-y-2">
              <MessageSquare className="w-8 h-8 text-slate-300 mx-auto" />
              <p className="font-semibold text-slate-700">Belum ada data pengaduan yang sesuai.</p>
              <p className="text-slate-400">Jadilah yang pertama menyampaikan aspirasi Anda untuk kemajuan Desa Jombe.</p>
            </div>
          )}
        </div>
      </div>

      {/* MODAL SUKSES PENGAJUAN */}
      {createdTicket && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-5 shadow-2xl border border-emerald-200 animate-in zoom-in-95 duration-150 text-center">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-800 rounded-2xl flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h3 className="text-xl font-black text-slate-900">Laporan Berhasil Terkirim!</h3>
              <p className="text-xs text-slate-600">
                Laporan Anda telah tercatat dalam sistem pelayanan Desa Jombe dan akan ditindaklanjuti oleh aparat desa.
              </p>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-1">
              <span className="text-[11px] text-slate-500 block uppercase font-bold tracking-wider">Nomor Tiket Pengaduan</span>
              <span className="text-xl font-mono font-black text-emerald-800 tracking-wider">
                {createdTicket.ticketNumber}
              </span>
              <p className="text-[10px] text-slate-400 mt-1">Simpan nomor tiket ini untuk melacak perkembangan penanganan laporan Anda.</p>
            </div>

            <div className="flex flex-col gap-2 pt-2">
              <Link
                href={`/lacak?no=${encodeURIComponent(createdTicket.ticketNumber)}`}
                className="w-full py-3 bg-emerald-800 hover:bg-emerald-900 text-white font-bold rounded-xl text-xs shadow-md transition-colors flex items-center justify-center gap-2"
              >
                <span>Buka Menu Lacak Tiket Sekarang</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
              <button
                onClick={() => setCreatedTicket(null)}
                className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-colors"
              >
                Tutup Jendela Ini
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL DETAIL PENGADUAN LENGKAP */}
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
