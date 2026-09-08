'use client';

import React, { useState, useRef } from 'react';
import {
  Newspaper,
  X,
  Send,
  Image as ImageIcon,
  Link as LinkIcon,
  Bold,
  Italic,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Minus,
  Eye,
  Edit3,
  Upload,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  HelpCircle
} from 'lucide-react';
import api from '@/lib/api';
import { renderRichArticle } from '@/lib/formatMarkdown';

interface NewsEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNewsCreated: () => void;
  initialAuthorName?: string;
}

export default function NewsEditorModal({
  isOpen,
  onClose,
  onNewsCreated,
  initialAuthorName,
}: NewsEditorModalProps) {
  const [activeTab, setActiveTab] = useState<'write' | 'preview'>('write');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Pemerintahan');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [authorName, setAuthorName] = useState(initialAuthorName || 'Humas Pemdes Jombe');
  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Link & Image insert popover states
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [linkText, setLinkText] = useState('');
  const [linkUrl, setLinkUrl] = useState('');

  const [showImageModal, setShowImageModal] = useState(false);
  const [inlineImageAlt, setInlineImageAlt] = useState('');
  const [inlineImageUrl, setInlineImageUrl] = useState('');

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const inlineFileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  // Insert formatting into textarea at cursor position
  const insertText = (before: string, after: string = '', defaultText: string = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = textarea.value.substring(start, end) || defaultText;
    const replacement = before + selectedText + after;

    const newContent =
      textarea.value.substring(0, start) +
      replacement +
      textarea.value.substring(end);

    setContent(newContent);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        start + before.length,
        start + before.length + selectedText.length
      );
    }, 50);
  };

  const handleInsertLink = () => {
    if (!linkUrl.trim()) return;
    const label = linkText.trim() || linkUrl.trim();
    const markdown = `[${label}](${linkUrl.trim()})`;
    insertText(markdown, '', '');
    setShowLinkModal(false);
    setLinkText('');
    setLinkUrl('');
  };

  const handleInsertInlineImage = () => {
    if (!inlineImageUrl.trim()) return;
    const alt = inlineImageAlt.trim() || 'Foto Berita Desa Jombe';
    const markdown = `\n![${alt}](${inlineImageUrl.trim()})\n`;
    insertText(markdown, '', '');
    setShowImageModal(false);
    setInlineImageAlt('');
    setInlineImageUrl('');
  };

  // Upload thumbnail as Base64/dataURL
  const handleFeaturedImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert('Ukuran gambar terlalu besar. Maksimal 5MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      const base64 = uploadEvent.target?.result as string;
      setImageUrl(base64);
    };
    reader.readAsDataURL(file);
  };

  // Upload inline image as Base64/dataURL
  const handleInlineImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert('Ukuran gambar terlalu besar. Maksimal 5MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      const base64 = uploadEvent.target?.result as string;
      setInlineImageUrl(base64);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      setErrorMessage('Judul dan isi berita wajib diisi.');
      return;
    }

    setSaving(true);
    setErrorMessage('');

    try {
      const payload = {
        title: title.trim(),
        category,
        excerpt: excerpt.trim() || content.trim().slice(0, 150) + '...',
        content: content.trim(),
        imageUrl: imageUrl.trim() || undefined,
        author: { name: authorName.trim() || 'Humas Pemdes Jombe' },
      };

      const res = await api.post('/content/news', payload);
      if (res.data.status === 'success') {
        alert('Berita desa berhasil dipublikasikan!');
        onNewsCreated();
        onClose();
      }
    } catch (err: any) {
      console.error('Publish news error:', err);
      setErrorMessage(err.response?.data?.message || 'Gagal menerbitkan berita.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl max-w-4xl w-full flex flex-col max-h-[92vh] shadow-2xl border border-slate-200 overflow-hidden">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-emerald-950 text-white p-5 px-6 flex items-center justify-between border-b border-emerald-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-800 border border-emerald-700 flex items-center justify-center text-emerald-300">
              <Newspaper className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">Editor Berita & Publikasi Desa</h3>
              <p className="text-xs text-emerald-200/80">Buat artikel berita resmi dengan gambar, tautan link, dan format profesional</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* View Switcher Tabs */}
            <div className="bg-emerald-950/80 p-1 rounded-xl border border-emerald-700 flex items-center text-xs">
              <button
                type="button"
                onClick={() => setActiveTab('write')}
                className={`px-3 py-1 rounded-lg font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  activeTab === 'write' ? 'bg-emerald-700 text-white shadow-xs' : 'text-emerald-200 hover:text-white'
                }`}
              >
                <Edit3 className="w-3.5 h-3.5" /> Tulis
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('preview')}
                className={`px-3 py-1 rounded-lg font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  activeTab === 'preview' ? 'bg-emerald-700 text-white shadow-xs' : 'text-emerald-200 hover:text-white'
                }`}
              >
                <Eye className="w-3.5 h-3.5" /> Pratinjau
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-emerald-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5 text-xs">
          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 flex items-center gap-2 font-bold">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{errorMessage}</span>
            </div>
          )}

          {activeTab === 'write' ? (
            <div className="space-y-4">
              {/* Judul & Kategori */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2 space-y-1.5">
                  <label className="font-bold text-slate-800 block">Judul Berita *</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Contoh: Penyaluran Bantuan Alsintan untuk Kelompok Tani Desa Jombe 2026"
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-700 text-xs font-bold text-slate-900 bg-slate-50"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-slate-800 block">Kategori Berita</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-700 text-xs font-bold text-slate-900 bg-white"
                  >
                    <option value="Pemerintahan">Pemerintahan</option>
                    <option value="Pembangunan">Pembangunan</option>
                    <option value="Pertanian & Ketahanan Pangan">Pertanian & Ketahanan Pangan</option>
                    <option value="UMKM & Ekonomi">UMKM & Ekonomi</option>
                    <option value="Sosial & Budaya">Sosial & Budaya</option>
                    <option value="Kesehatan">Kesehatan</option>
                    <option value="Kegiatan Warga">Kegiatan Warga</option>
                  </select>
                </div>
              </div>

              {/* Ringkasan & Penulis */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2 space-y-1.5">
                  <label className="font-bold text-slate-800 block">Ringkasan Singkat (Excerpt)</label>
                  <input
                    type="text"
                    value={excerpt}
                    onChange={(e) => setExcerpt(e.target.value)}
                    placeholder="Deskripsi singkat yang tampil di beranda sebelum pembaca klik artikel..."
                    className="w-full px-3.5 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-700 text-xs text-slate-800 bg-slate-50"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-800 block">Nama Penulis / Humas</label>
                  <input
                    type="text"
                    value={authorName}
                    onChange={(e) => setAuthorName(e.target.value)}
                    placeholder="Humas Pemdes Jombe"
                    className="w-full px-3.5 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-700 text-xs font-semibold text-slate-800 bg-slate-50"
                  />
                </div>
              </div>

              {/* Gambar Sampul / Featured Image Banner */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
                  <div>
                    <label className="font-bold text-slate-800 block flex items-center gap-1.5">
                      <ImageIcon className="w-4 h-4 text-emerald-800" />
                      Foto Utama / Sampul Berita (Thumbnail)
                    </label>
                    <span className="text-[11px] text-slate-500">Dapat mengunggah file foto langsung atau menempelkan URL gambar.</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFeaturedImageUpload}
                      accept="image/*"
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-3.5 py-1.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl font-bold flex items-center gap-1.5 cursor-pointer shadow-2xs"
                    >
                      <Upload className="w-3.5 h-3.5" /> Unggah Foto
                    </button>
                    {imageUrl && (
                      <button
                        type="button"
                        onClick={() => setImageUrl('')}
                        className="px-2.5 py-1.5 bg-rose-50 text-rose-700 border border-rose-200 rounded-xl font-bold hover:bg-rose-100 cursor-pointer"
                      >
                        Hapus Foto
                      </button>
                    )}
                  </div>
                </div>

                <input
                  type="text"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="Atau tempel URL gambar: https://example.com/foto-berita.jpg"
                  className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-xs bg-white text-slate-800"
                />

                {imageUrl && (
                  <div className="mt-2 relative rounded-2xl overflow-hidden max-h-48 border border-slate-200">
                    <img src={imageUrl} alt="Pratinjau Sampul" className="w-full h-48 object-cover" />
                  </div>
                )}
              </div>

              {/* Advanced Rich Text Toolbar & Content Area */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="font-bold text-slate-800 block">Isi Lengkap Berita & Pengumuman *</label>
                  <span className="text-[11px] text-slate-400 font-mono">
                    {content.length} karakter • {content.trim() ? content.trim().split(/\s+/).length : 0} kata
                  </span>
                </div>

                {/* Toolbar */}
                <div className="p-2 bg-slate-100 border border-slate-200 rounded-t-2xl flex flex-wrap items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => insertText('**', '**', 'Teks Tebal')}
                    title="Teks Tebal (Bold)"
                    className="p-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-emerald-50 hover:text-emerald-900 hover:border-emerald-300 font-bold cursor-pointer"
                  >
                    <Bold className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => insertText('*', '*', 'Teks Miring')}
                    title="Teks Miring (Italic)"
                    className="p-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-emerald-50 hover:text-emerald-900 hover:border-emerald-300 cursor-pointer"
                  >
                    <Italic className="w-4 h-4" />
                  </button>

                  <div className="w-[1px] h-5 bg-slate-300 mx-1" />

                  <button
                    type="button"
                    onClick={() => insertText('\n## ', '\n', 'Judul Bagian')}
                    title="Heading 2 (Judul Bagian)"
                    className="p-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-emerald-50 hover:text-emerald-900 hover:border-emerald-300 cursor-pointer flex items-center gap-1"
                  >
                    <Heading2 className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => insertText('\n### ', '\n', 'Sub Judul')}
                    title="Heading 3 (Sub Judul)"
                    className="p-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-emerald-50 hover:text-emerald-900 hover:border-emerald-300 cursor-pointer flex items-center gap-1"
                  >
                    <Heading3 className="w-4 h-4" />
                  </button>

                  <div className="w-[1px] h-5 bg-slate-300 mx-1" />

                  <button
                    type="button"
                    onClick={() => insertText('\n- ', '\n', 'Poin Daftar')}
                    title="Daftar Poin (Bullet List)"
                    className="p-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-emerald-50 hover:text-emerald-900 hover:border-emerald-300 cursor-pointer"
                  >
                    <List className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => insertText('\n1. ', '\n', 'Langkah Pertama')}
                    title="Daftar Berurutan (Numbered List)"
                    className="p-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-emerald-50 hover:text-emerald-900 hover:border-emerald-300 cursor-pointer"
                  >
                    <ListOrdered className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => insertText('\n> ', '\n', 'Kutipan pernyataan resmi aparat / warga')}
                    title="Kutipan (Quote)"
                    className="p-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-emerald-50 hover:text-emerald-900 hover:border-emerald-300 cursor-pointer"
                  >
                    <Quote className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => insertText('\n---\n')}
                    title="Garis Pembatas (Divider)"
                    className="p-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-emerald-50 hover:text-emerald-900 hover:border-emerald-300 cursor-pointer"
                  >
                    <Minus className="w-4 h-4" />
                  </button>

                  <div className="w-[1px] h-5 bg-slate-300 mx-1" />

                  {/* Insert Link Button */}
                  <button
                    type="button"
                    onClick={() => setShowLinkModal(true)}
                    title="Sisipkan Tautan Link (Hyperlink)"
                    className="px-2.5 py-1 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-900 hover:bg-emerald-100 font-bold cursor-pointer flex items-center gap-1.5"
                  >
                    <LinkIcon className="w-3.5 h-3.5 text-emerald-800" />
                    <span>Tautan Link</span>
                  </button>

                  {/* Insert Inline Image Button */}
                  <button
                    type="button"
                    onClick={() => setShowImageModal(true)}
                    title="Sisipkan Foto dalam Isi Berita"
                    className="px-2.5 py-1 rounded-lg bg-teal-50 border border-teal-200 text-teal-900 hover:bg-teal-100 font-bold cursor-pointer flex items-center gap-1.5"
                  >
                    <ImageIcon className="w-3.5 h-3.5 text-teal-800" />
                    <span>Sisipkan Foto</span>
                  </button>
                </div>

                {/* Textarea */}
                <textarea
                  ref={textareaRef}
                  rows={10}
                  required
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Tuliskan isi berita lengkap di sini. Gunakan tombol toolbar di atas untuk menambahkan judul bagian (##), poin daftar (-), foto gambar, atau tautan link..."
                  className="w-full p-4 border border-t-0 border-slate-200 rounded-b-2xl focus:outline-none focus:ring-2 focus:ring-emerald-700 bg-slate-50 text-slate-900 font-sans text-xs leading-relaxed"
                />
              </div>
            </div>
          ) : (
            /* Live Preview Mode */
            <div className="space-y-5 bg-white p-6 rounded-2xl border border-slate-200 shadow-inner">
              <div className="border-b border-slate-100 pb-4 space-y-2">
                <span className="text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300">
                  {category}
                </span>
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight">
                  {title || 'Judul Berita Belum Diisi'}
                </h1>
                <div className="flex items-center gap-3 text-slate-500 text-[11px] pt-1">
                  <span>Oleh: <strong>{authorName || 'Humas'}</strong></span>
                  <span>•</span>
                  <span>{new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                </div>
              </div>

              {imageUrl && (
                <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-md">
                  <img src={imageUrl} alt="Sampul Berita" className="w-full max-h-[380px] object-cover" />
                </div>
              )}

              <div className="pt-2">
                {renderRichArticle(content || 'Isi berita akan muncul di sini saat Anda mengetik...')}
              </div>
            </div>
          )}

          {/* Footer Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <span className="text-[11px] text-slate-500">
              * Berita yang dipublikasikan akan langsung tampil di halaman Berita dan Beranda Desa Jombe.
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold hover:bg-slate-50 transition-colors cursor-pointer"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-2 disabled:opacity-50 cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>{saving ? 'Menerbitkan...' : 'Terbitkan Berita'}</span>
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Popover / Modal: Sisipkan Link */}
      {showLinkModal && (
        <div className="fixed inset-0 z-60 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-5 space-y-4 shadow-2xl border border-slate-200">
            <div className="flex justify-between items-center border-b border-slate-100 pb-2">
              <h4 className="font-bold text-slate-900 flex items-center gap-2 text-xs">
                <LinkIcon className="w-4 h-4 text-emerald-800" /> Sisipkan Tautan Link
              </h4>
              <button onClick={() => setShowLinkModal(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Teks / Judul Link</label>
                <input
                  type="text"
                  value={linkText}
                  onChange={(e) => setLinkText(e.target.value)}
                  placeholder="Contoh: Dokumen Hasil Musrenbangdes PDF"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-700"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Alamat URL Web / Dokumen (https://...)</label>
                <input
                  type="url"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  placeholder="https://example.com/info"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-700"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowLinkModal(false)}
                className="px-3 py-1.5 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleInsertLink}
                className="px-4 py-1.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs shadow-xs"
              >
                Sisipkan Link
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Popover / Modal: Sisipkan Foto / Gambar Inline */}
      {showImageModal && (
        <div className="fixed inset-0 z-60 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-5 space-y-4 shadow-2xl border border-slate-200">
            <div className="flex justify-between items-center border-b border-slate-100 pb-2">
              <h4 className="font-bold text-slate-900 flex items-center gap-2 text-xs">
                <ImageIcon className="w-4 h-4 text-teal-800" /> Sisipkan Foto / Gambar
              </h4>
              <button onClick={() => setShowImageModal(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Keterangan / Caption Foto</label>
                <input
                  type="text"
                  value={inlineImageAlt}
                  onChange={(e) => setInlineImageAlt(e.target.value)}
                  placeholder="Contoh: Suasana Penyerahan Bantuan Bibit Jagung"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-700"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="font-bold text-slate-700 block">Pilih File Foto atau URL Gambar</label>
                  <input
                    type="file"
                    ref={inlineFileInputRef}
                    onChange={handleInlineImageUpload}
                    accept="image/*"
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => inlineFileInputRef.current?.click()}
                    className="text-[11px] font-bold text-teal-800 underline flex items-center gap-1 cursor-pointer"
                  >
                    <Upload className="w-3 h-3" /> Unggah File
                  </button>
                </div>
                <input
                  type="text"
                  value={inlineImageUrl}
                  onChange={(e) => setInlineImageUrl(e.target.value)}
                  placeholder="https://example.com/foto.jpg"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-700"
                />
              </div>

              {inlineImageUrl && (
                <div className="mt-2 rounded-xl overflow-hidden max-h-36 border border-slate-200">
                  <img src={inlineImageUrl} alt="Pratinjau" className="w-full h-36 object-cover" />
                </div>
              )}
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowImageModal(false)}
                className="px-3 py-1.5 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleInsertInlineImage}
                className="px-4 py-1.5 rounded-xl bg-teal-800 hover:bg-teal-900 text-white font-bold text-xs shadow-xs"
              >
                Sisipkan Foto
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
