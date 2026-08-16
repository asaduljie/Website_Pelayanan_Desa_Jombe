'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Store, Trash2, Edit3, Save, AlertCircle, ArrowLeft, CheckCircle2, FileText } from 'lucide-react';
import api from '@/lib/api';

export default function AdminLayananManagementPage() {
  const router = useRouter();
  const [admin, setAdmin] = useState<any>(null);
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Form New Service State
  const [showAddModal, setShowAddModal] = useState(false);
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Surat Keterangan');
  const [description, setDescription] = useState('');
  const [requirements, setRequirements] = useState('');
  const [estimatedDays, setEstimatedDays] = useState('1');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('jombe_user');
    if (!stored) {
      router.push('/login');
      return;
    }
    const userObj = JSON.parse(stored);
    if (userObj.role !== 'ADMIN') {
      alert('Akses khusus Admin / Kepala Desa.');
      router.push('/dashboard');
      return;
    }
    setAdmin(userObj);

    fetchServices();
  }, []);

  const fetchServices = async () => {
    setLoading(true);
    try {
      const res = await api.get('/services');
      if (res.data.status === 'success') {
        setServices(res.data.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setSubmitting(true);
    try {
      const res = await api.post('/admin/services', {
        name,
        category,
        description,
        requirements,
        estimatedDays: Number(estimatedDays),
        fields: [
          { label: 'Keperluan Surat', fieldName: 'keperluan', fieldType: 'TEXTAREA', isRequired: true },
        ],
      });

      if (res.data.status === 'success') {
        alert('Layanan baru dan form dinamis berhasil ditambahkan!');
        setShowAddModal(false);
        setName('');
        setDescription('');
        setRequirements('');
        fetchServices();
      }
    } catch (err: any) {
      alert('Gagal menambah layanan: ' + (err.response?.data?.message || 'Error'));
    } finally {
      setSubmitting(false);
    }
  };

  if (!admin) return null;

  return (
    <div className="min-h-screen py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-jombe-950 via-jombe-900 to-jombe-800 text-white rounded-3xl p-8 shadow-lg flex justify-between items-center">
        <div>
          <span className="text-xs text-emerald-400 font-bold uppercase tracking-widest block">Manajemen Administrasi Desa</span>
          <h1 className="text-2xl sm:text-3xl font-extrabold flex items-center gap-2">
            <Store className="w-7 h-7 text-emerald-400" /> Pengaturan Layanan & Form Dinamis
          </h1>
          <p className="text-xs text-gray-300 mt-1">Tambah, edit, dan atur formulir pengajuan surat desa tanpa perlu koding ulang.</p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-5 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-md transition-all flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Tambah Layanan Baru
        </button>
      </div>

      {/* Services List Table */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-soft overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <h2 className="text-base font-bold text-gray-900">Daftar Layanan Surat Aktif</h2>
          <span className="text-xs text-gray-500">{services.length} Layanan Terdaftar</span>
        </div>

        {loading ? (
          <div className="p-10 text-center text-xs text-gray-500">Memuat layanan...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
            {services.map((s) => (
              <div key={s.id} className="bg-gray-50/70 rounded-2xl p-5 border border-gray-200/80 space-y-3 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full bg-jombe-100 text-jombe-900">
                      {s.category}
                    </span>
                    <span className="text-[11px] text-gray-500">~{s.estimatedDays} Hari</span>
                  </div>

                  <h3 className="text-base font-bold text-gray-900">{s.name}</h3>
                  <p className="text-xs text-gray-600 line-clamp-2">{s.description || 'Layanan surat desa.'}</p>

                  <div className="pt-2">
                    <span className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Field Form Dinamis:</span>
                    <div className="flex flex-wrap gap-1">
                      {s.fields && s.fields.map((f: any) => (
                        <span key={f.id} className="px-2 py-0.5 bg-white border border-gray-200 rounded-md text-[10px] font-mono text-gray-700">
                          {f.label} ({f.fieldType})
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-gray-200 flex justify-between items-center text-xs">
                  <span className="text-emerald-700 font-bold text-[11px]">Status: Aktif</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* CREATE NEW SERVICE MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b border-gray-100 pb-3">
              <h3 className="text-base font-extrabold text-gray-900">+ Tambah Layanan Surat Baru</h3>
              <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-gray-700">✕</button>
            </div>

            <form onSubmit={handleCreateService} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-gray-800 block mb-1">Nama Layanan Surat *</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Contoh: Surat Keterangan Beda Nama"
                  required
                  className="w-full p-2.5 border border-gray-200 rounded-xl bg-gray-50"
                />
              </div>

              <div>
                <label className="font-bold text-gray-800 block mb-1">Kategori *</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full p-2.5 border border-gray-200 rounded-xl bg-gray-50"
                >
                  <option value="Surat Keterangan">Surat Keterangan</option>
                  <option value="Administrasi">Administrasi</option>
                  <option value="Bantuan Sosial">Bantuan Sosial</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-gray-800 block mb-1">Deskripsi Singkat</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Penjelasan fungsi surat..."
                  className="w-full p-2.5 border border-gray-200 rounded-xl bg-gray-50"
                />
              </div>

              <div>
                <label className="font-bold text-gray-800 block mb-1">Persyaratan Dokumen</label>
                <textarea
                  rows={2}
                  value={requirements}
                  onChange={(e) => setRequirements(e.target.value)}
                  placeholder="1. KTP, 2. Kartu Keluarga..."
                  className="w-full p-2.5 border border-gray-200 rounded-xl bg-gray-50"
                />
              </div>

              <div>
                <label className="font-bold text-gray-800 block mb-1">Estimasi Hari Pemrosesan</label>
                <input
                  type="number"
                  value={estimatedDays}
                  onChange={(e) => setEstimatedDays(e.target.value)}
                  className="w-full p-2.5 border border-gray-200 rounded-xl bg-gray-50"
                />
              </div>

              <div className="pt-3">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3 bg-jombe-800 hover:bg-jombe-900 disabled:opacity-50 text-white font-bold rounded-xl shadow-md transition-colors"
                >
                  {submitting ? 'Menyimpan...' : 'Simpan Layanan Baru'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
