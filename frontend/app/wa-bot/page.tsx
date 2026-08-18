'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  MessageSquare,
  Send,
  ArrowLeft,
  Check,
  CheckCheck,
  RefreshCw,
  LayoutDashboard,
  ShieldCheck,
  Download,
  FileText,
  Search,
  MoreVertical,
  Camera,
  Trash2,
  Phone,
  Video,
  Users,
  Paperclip,
  Image as ImageIcon,
  X,
  Upload,
} from 'lucide-react';
import api from '@/lib/api';

interface ChatBubble {
  id?: string;
  sender: 'warga' | 'bot';
  text: string;
  timestamp: string;
  imageUrl?: string;
  imageCaption?: string;
  pdfUrl?: string;
  letterNumber?: string;
}

const INITIAL_GREETING_MESSAGE: ChatBubble = {
  id: 'msg-init',
  sender: 'bot',
  text:
    '*LAYANAN WHATSAPP RESMI DESA JOMBE*\n\n' +
    'Silakan ketik kode surat yang ingin Anda ajukan:\n' +
    '- Ketik *SKU* (Surat Keterangan Usaha)\n' +
    '- Ketik *DOMISILI* (Surat Keterangan Domisili)\n' +
    '- Ketik *SKTM* (Surat Keterangan Tidak Mampu)\n\n' +
    '_Ketik salah satu kode layanan di atas:_',
  timestamp: '09:41',
};

// Helper: Cleanly parse WhatsApp markdown (*bold* and _italic_) into HTML without raw asterisks
const renderFormattedText = (rawText: string) => {
  if (!rawText) return null;
  const lines = rawText.split('\n');
  return lines.map((line, lIdx) => {
    const parts = line.split(/(\*[^*]+\*|_[^_]+_)/g);
    return (
      <span key={lIdx} className="block min-h-[1.2em]">
        {parts.map((part, pIdx) => {
          if (part.startsWith('*') && part.endsWith('*') && part.length > 2) {
            return <strong key={pIdx} className="font-bold text-slate-950">{part.slice(1, -1)}</strong>;
          }
          if (part.startsWith('_') && part.endsWith('_') && part.length > 2) {
            return <span key={pIdx} className="text-slate-600 italic">{part.slice(1, -1)}</span>;
          }
          return <span key={pIdx}>{part}</span>;
        })}
      </span>
    );
  });
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

export default function WhatsAppBotSimulatorPage() {
  const [phone, setPhone] = useState('6281299887766');
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [messages, setMessages] = useState<ChatBubble[]>([INITIAL_GREETING_MESSAGE]);

  // WhatsApp Screen State: 'CHAT_LIST' (Halaman Pertama WA) or 'CHAT_ROOM' (Halaman Chat)
  const [currentScreen, setCurrentScreen] = useState<'CHAT_LIST' | 'CHAT_ROOM'>('CHAT_LIST');

  // Active Tab in Chat List: 'CHATS', 'STATUS', 'CALLS'
  const [activeTab, setActiveTab] = useState<'CHATS' | 'STATUS' | 'CALLS'>('CHATS');

  // Attachment Popup Menu State
  const [showAttachmentMenu, setShowAttachmentMenu] = useState(false);

  // Selected Upload Preview State
  const [attachedImage, setAttachedImage] = useState<{ url: string; label: string; size: string } | null>(null);

  // Track previous message length to prevent auto-scrolling on polling
  const prevMsgLengthRef = useRef<number>(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    fetchChatHistory(true);

    const interval = setInterval(() => {
      fetchChatHistory(false);
    }, 3000);

    return () => clearInterval(interval);
  }, [phone]);

  const fetchChatHistory = async (shouldScroll: boolean = false) => {
    try {
      const res = await api.get(`/whatsapp/history?phone=${phone}`);
      if (res.data.status === 'success' && Array.isArray(res.data.data)) {
        const newMsgs: ChatBubble[] = res.data.data.length > 0 ? res.data.data : [INITIAL_GREETING_MESSAGE];

        if (newMsgs.length > prevMsgLengthRef.current) {
          setMessages(newMsgs);
          prevMsgLengthRef.current = newMsgs.length;
          if (shouldScroll || newMsgs.length > 1) {
            setTimeout(() => {
              messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
            }, 100);
          }
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  const getFormattedTime = () => {
    return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if ((!inputMessage.trim() && !attachedImage) || loading) return;

    const userText = inputMessage.trim() || (attachedImage ? `[Lampiran ${attachedImage.label}]` : '');
    const nowTime = getFormattedTime();

    const currentAttachment = attachedImage;
    setInputMessage('');
    setAttachedImage(null);
    setShowAttachmentMenu(false);

    const newMsg: ChatBubble = {
      sender: 'warga',
      text: userText,
      timestamp: nowTime,
      imageUrl: currentAttachment?.url,
      imageCaption: currentAttachment?.label,
    };

    const updated = [...messages, newMsg];
    setMessages(updated);
    prevMsgLengthRef.current = updated.length;
    setLoading(true);

    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 50);

    try {
      const res = await api.post('/whatsapp/bot', {
        from: phone,
        message: userText,
        imageUrl: currentAttachment?.url,
        imageCaption: currentAttachment?.label,
      });

      if (res.data.status === 'success') {
        fetchChatHistory(true);
      }
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          sender: 'bot',
          text: 'Terjadi kendala saat menghubungkan ke server pelayanan. Silakan coba kembali.',
          timestamp: getFormattedTime(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Handle Photo & Camera Upload from WA Chat Bar
  const handlePhotoSelect = async (e: React.ChangeEvent<HTMLInputElement>, label: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const compressedBlob = await compressImage(file);
    const previewUrl = URL.createObjectURL(compressedBlob);
    const sizeKb = Math.round(compressedBlob.size / 1024);

    setAttachedImage({
      url: previewUrl,
      label: label,
      size: `${sizeKb} KB`,
    });
    setShowAttachmentMenu(false);
  };

  // ACTION: Hapus Pesan & Mengulang Percakapan dari Awal
  const handleClearAndResetChat = async () => {
    try {
      await api.post('/whatsapp/bot', { from: phone, message: 'RESET' });
      setMessages([INITIAL_GREETING_MESSAGE]);
      prevMsgLengthRef.current = 1;
      setInputMessage('');
      setAttachedImage(null);
      alert('Riwayat percakapan telah direset. Halaman kembali ke pesan awal.');
    } catch (e) {
      setMessages([INITIAL_GREETING_MESSAGE]);
      prevMsgLengthRef.current = 1;
    }
  };

  const lastMessage = messages.length > 0 ? messages[messages.length - 1] : INITIAL_GREETING_MESSAGE;

  return (
    <div className="min-h-screen py-8 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 bg-slate-50/50">
      {/* Back & Quick Nav Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <button
          onClick={() => window.history.back()}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-emerald-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Kembali
        </button>

        <div className="flex items-center gap-2">
          <Link
            href="/operator"
            className="px-4 py-2 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs"
          >
            <LayoutDashboard className="w-4 h-4" /> Panel Operator (Verifikasi Permohonan)
          </Link>
          <button
            onClick={handleClearAndResetChat}
            className="px-3.5 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs"
            title="Hapus Pesan & Ulang dari Awal"
          >
            <Trash2 className="w-4 h-4" /> Hapus Pesan & Ulang Chat
          </button>
        </div>
      </div>

      {/* Simulator Explanation Header */}
      <div className="bg-emerald-950 text-white rounded-3xl p-6 sm:p-8 shadow-md border border-emerald-900 space-y-2">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-emerald-700 flex items-center justify-center font-bold text-xs">
            <MessageSquare className="w-4 h-4 text-emerald-100" />
          </div>
          <h1 className="text-lg font-extrabold">Simulasi Perangkat WhatsApp Warga Desa Jombe</h1>
        </div>
        <p className="text-xs text-emerald-100/90 leading-relaxed max-w-2xl">
          Alur Wajib: Pilih Layanan (SKU) ➔ NIK ➔ Nama ➔ Rincian Usaha ➔ <strong>Kirim Foto e-KTP / Usaha (Kamera 📷 / Lampiran 📎)</strong> ➔ Konfirmasi <strong>SETUJU</strong>.
        </p>
      </div>

      {/* ======================================================== */}
      {/* WHATSAPP SMARTPHONE FRAME CONTAINER (RESPONSIVE & SCROLL)*/}
      {/* ======================================================== */}
      <div className="max-w-md mx-auto bg-white rounded-[36px] border-[8px] border-slate-800 shadow-2xl overflow-hidden flex flex-col h-[650px] max-h-[85vh] relative">
        {/* Smartphone Speaker & Camera Notch */}
        <div className="bg-slate-800 h-4 flex items-center justify-center shrink-0">
          <div className="w-16 h-1.5 bg-slate-700 rounded-full"></div>
        </div>

        {/* ======================================================== */}
        {/* SCREEN 1: HALAMAN PERTAMA WHATSAPP (DAFTAR CHAT / BERANDA)*/}
        {/* ======================================================== */}
        {currentScreen === 'CHAT_LIST' && (
          <div className="flex-1 flex flex-col bg-white min-h-0">
            {/* WhatsApp App Green Top Bar */}
            <div className="bg-[#075e54] text-white p-4 space-y-3 shadow-md shrink-0">
              <div className="flex justify-between items-center">
                <span className="text-lg font-bold tracking-wide">WhatsApp</span>
                <div className="flex items-center gap-4 text-white/90">
                  <Camera className="w-5 h-5 cursor-pointer" />
                  <Search className="w-5 h-5 cursor-pointer" />
                  <MoreVertical className="w-5 h-5 cursor-pointer" />
                </div>
              </div>

              {/* WhatsApp Tabs */}
              <div className="flex justify-between items-center text-xs font-bold tracking-wider uppercase border-t border-[#128c7e]/40 pt-2">
                <button
                  onClick={() => setActiveTab('CHATS')}
                  className={`pb-1 border-b-2 transition-colors ${
                    activeTab === 'CHATS' ? 'border-white text-white' : 'border-transparent text-emerald-200'
                  }`}
                >
                  CHAT
                </button>
                <button
                  onClick={() => setActiveTab('STATUS')}
                  className={`pb-1 border-b-2 transition-colors ${
                    activeTab === 'STATUS' ? 'border-white text-white' : 'border-transparent text-emerald-200'
                  }`}
                >
                  STATUS
                </button>
                <button
                  onClick={() => setActiveTab('CALLS')}
                  className={`pb-1 border-b-2 transition-colors ${
                    activeTab === 'CALLS' ? 'border-white text-white' : 'border-transparent text-emerald-200'
                  }`}
                >
                  PANGGILAN
                </button>
              </div>
            </div>

            {/* WhatsApp Chat List Items */}
            <div className="flex-1 overflow-y-auto divide-y divide-slate-100 bg-white">
              <div
                onClick={() => {
                  setCurrentScreen('CHAT_ROOM');
                  setTimeout(() => {
                    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
                  }, 100);
                }}
                className="p-3.5 flex items-center gap-3.5 hover:bg-slate-50 cursor-pointer transition-colors group"
              >
                <div className="relative w-12 h-12 rounded-full bg-emerald-800 text-white flex items-center justify-center font-bold text-sm shrink-0 border border-emerald-600 shadow-2xs">
                  <ShieldCheck className="w-6 h-6 text-emerald-200" />
                  <span className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white"></span>
                </div>

                <div className="flex-1 overflow-hidden">
                  <div className="flex justify-between items-center">
                    <h4 className="text-xs font-extrabold text-slate-900 group-hover:text-emerald-800 flex items-center gap-1 truncate">
                      Pelayanan Desa Jombe
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    </h4>
                    <span className="text-[10px] text-slate-400 font-medium" suppressHydrationWarning>
                      {mounted ? (lastMessage ? lastMessage.timestamp : '09:41') : '09:41'}
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-500 truncate mt-0.5">
                    {lastMessage ? lastMessage.text.replace(/\*/g, '') : 'Ketik SKU untuk mengajukan surat...'}
                  </p>
                </div>
              </div>

              {/* Dummy Item 2 */}
              <div className="p-3.5 flex items-center gap-3.5 opacity-60">
                <div className="w-12 h-12 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center font-bold text-sm shrink-0">
                  <Users className="w-6 h-6 text-slate-500" />
                </div>
                <div className="flex-1 overflow-hidden">
                  <div className="flex justify-between items-center">
                    <h4 className="text-xs font-bold text-slate-900 truncate">Warga RT 02 Dusun Krajan</h4>
                    <span className="text-[10px] text-slate-400">Kemarin</span>
                  </div>
                  <p className="text-[11px] text-slate-500 truncate mt-0.5">Pak RT: Kerja bakti hari minggu...</p>
                </div>
              </div>

              {/* Dummy Item 3 */}
              <div className="p-3.5 flex items-center gap-3.5 opacity-60">
                <div className="w-12 h-12 rounded-full bg-teal-100 text-teal-800 flex items-center justify-center font-bold text-xs shrink-0">
                  BJ
                </div>
                <div className="flex-1 overflow-hidden">
                  <div className="flex justify-between items-center">
                    <h4 className="text-xs font-bold text-slate-900 truncate">BUMDes Berkah Jombe</h4>
                    <span className="text-[10px] text-slate-400">12/08</span>
                  </div>
                  <p className="text-[11px] text-slate-500 truncate mt-0.5">Katalog pupuk & bibit siap kirim...</p>
                </div>
              </div>
            </div>

            <div className="p-4 flex justify-end bg-white border-t border-slate-100 shrink-0">
              <button
                onClick={() => setCurrentScreen('CHAT_ROOM')}
                className="w-12 h-12 rounded-2xl bg-[#00a884] text-white flex items-center justify-center shadow-lg hover:bg-[#008f6f] transition-all"
                title="Buka Chat Pelayanan"
              >
                <MessageSquare className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* SCREEN 2: HALAMAN CHAT ROOM DENGAN TOMBOL FOTO & KAMERA  */}
        {/* ======================================================== */}
        {currentScreen === 'CHAT_ROOM' && (
          <div className="flex-1 flex flex-col bg-[#efeae2] min-h-0 relative">
            {/* WhatsApp Chat Room Header */}
            <div className="bg-[#075e54] text-white px-3 py-2.5 flex items-center justify-between shadow-xs shrink-0 z-10">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentScreen('CHAT_LIST')}
                  className="p-1 -ml-1 text-white hover:bg-emerald-800 rounded-full transition-colors"
                  title="Kembali ke Daftar Chat"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <div className="w-9 h-9 rounded-full bg-emerald-800 flex items-center justify-center font-bold text-xs border border-emerald-600 shrink-0">
                  <ShieldCheck className="w-5 h-5 text-emerald-100" />
                </div>
                <div className="overflow-hidden">
                  <h3 className="text-xs font-bold leading-tight flex items-center gap-1 truncate">
                    Pelayanan Desa Jombe
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
                  </h3>
                  <span className="text-[10px] text-emerald-200 block">Akun Resmi Pemerintah Desa</span>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={handleClearAndResetChat}
                  title="Hapus Chat & Ulang Percakapan"
                  className="p-1.5 text-emerald-200 hover:text-rose-300 hover:bg-emerald-800/80 rounded-lg transition-colors flex items-center gap-1 text-[10px] font-bold"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Chat Messages Body with Attached Photo Rendering */}
            <div className="flex-1 p-3.5 overflow-y-auto space-y-3 bg-[url('https://user-images.githubusercontent.com/15075759/28719144-86da05a0-7396-11e7-8572-0359f2e21677.png')] bg-repeat min-h-0">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.sender === 'warga' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[88%] p-3 rounded-2xl text-xs shadow-xs relative ${
                      msg.sender === 'warga'
                        ? 'bg-[#dcf8c6] text-slate-900 rounded-tr-none'
                        : 'bg-white text-slate-900 rounded-tl-none whitespace-pre-line border border-slate-200/60'
                    }`}
                  >
                    {/* Render Image Attachment Bubble if any */}
                    {msg.imageUrl && (
                      <div className="mb-2 rounded-xl overflow-hidden border border-slate-300/80 bg-black/10">
                        <img src={msg.imageUrl} alt="Lampiran" className="max-h-40 w-full object-cover" />
                        {msg.imageCaption && (
                          <div className="p-1.5 bg-black/40 text-white font-bold text-[10px]">
                            📷 {msg.imageCaption}
                          </div>
                        )}
                      </div>
                    )}

                    <div className="leading-relaxed space-y-1">{renderFormattedText(msg.text)}</div>

                    {/* ATTACHED PDF CARD IF NOTIFICATION CONTAINS PDF */}
                    {msg.pdfUrl && (
                      <div className="mt-3 pt-2.5 border-t border-slate-200 space-y-2">
                        <div className="bg-emerald-50 p-2.5 rounded-xl border border-emerald-200 flex items-center gap-2">
                          <FileText className="w-5 h-5 text-emerald-800 shrink-0" />
                          <div className="overflow-hidden">
                            <span className="font-bold text-emerald-950 block text-[11px] truncate">
                              Surat_Resmi_Desa_Jombe.pdf
                            </span>
                            <span className="text-[10px] text-emerald-700 block">Surat Balasan Keterangan Resmi</span>
                          </div>
                        </div>
                        <a
                          href={msg.pdfUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full py-2 bg-emerald-800 hover:bg-emerald-900 text-white font-bold rounded-xl text-[11px] flex items-center justify-center gap-1.5 transition-colors shadow-xs"
                        >
                          <Download className="w-3.5 h-3.5" /> Unduh Dokumen Surat PDF
                        </a>
                      </div>
                    )}

                    <div className="text-[9px] text-slate-400 text-right mt-1.5 flex items-center justify-end gap-1" suppressHydrationWarning>
                      <span>{mounted ? msg.timestamp : '09:41'}</span>
                      {msg.sender === 'warga' && <CheckCheck className="w-3.5 h-3.5 text-blue-500" />}
                    </div>
                  </div>
                </div>
              ))}

              {loading && (
                <div className="bg-white p-2.5 rounded-xl text-[11px] text-slate-500 w-fit border border-slate-200">
                  Mengetik pesan...
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* ATTACHMENT POPUP MENU (GALERI & KAMERA LANGSUNG) */}
            {showAttachmentMenu && (
              <div className="absolute bottom-16 left-4 right-4 bg-white rounded-2xl p-4 shadow-2xl border border-slate-200 z-30 animate-in fade-in slide-in-from-bottom-2 duration-150 space-y-3">
                <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                  <span className="text-xs font-bold text-slate-900">Lampirkan Dokumen Foto Persyaratan</span>
                  <button onClick={() => setShowAttachmentMenu(false)} className="text-slate-400 hover:text-slate-700">
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {/* Option 1: Foto e-KTP Pemohon */}
                  <label className="p-3 bg-sky-50 hover:bg-sky-100 rounded-xl border border-sky-200 flex flex-col items-center justify-center gap-1 cursor-pointer transition-colors text-center">
                    <Camera className="w-6 h-6 text-sky-700" />
                    <span className="text-[11px] font-bold text-sky-950">Foto e-KTP</span>
                    <span className="text-[9px] text-sky-600">Kamera / Galeri</span>
                    <input
                      type="file"
                      accept="image/*"
                      capture="environment"
                      onChange={(e) => handlePhotoSelect(e, 'Foto e-KTP Pemohon')}
                      className="hidden"
                    />
                  </label>

                  {/* Option 2: Foto Tempat Usaha / KK */}
                  <label className="p-3 bg-emerald-50 hover:bg-emerald-100 rounded-xl border border-emerald-200 flex flex-col items-center justify-center gap-1 cursor-pointer transition-colors text-center">
                    <ImageIcon className="w-6 h-6 text-emerald-700" />
                    <span className="text-[11px] font-bold text-emerald-950">Foto Usaha / KK</span>
                    <span className="text-[9px] text-emerald-600">Kamera / Galeri</span>
                    <input
                      type="file"
                      accept="image/*"
                      capture="environment"
                      onChange={(e) => handlePhotoSelect(e, 'Foto Tempat Usaha / KK')}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
            )}

            {/* PREVIEW ATTACHED IMAGE BEFORE SENDING */}
            {attachedImage && (
              <div className="bg-emerald-50 px-3.5 py-2 border-t border-emerald-200 flex items-center justify-between z-20">
                <div className="flex items-center gap-2 overflow-hidden">
                  <img src={attachedImage.url} alt="Attached" className="w-8 h-8 rounded-lg object-cover border border-emerald-300" />
                  <div className="truncate">
                    <span className="text-[11px] font-bold text-emerald-950 block truncate">{attachedImage.label}</span>
                    <span className="text-[9px] text-emerald-700 font-semibold">{attachedImage.size} (Auto-Compressed)</span>
                  </div>
                </div>
                <button
                  onClick={() => setAttachedImage(null)}
                  className="p-1 rounded-full text-slate-400 hover:text-rose-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* QUICK REPLY CHIPS (SURAT & PENGADUAN) */}
            <div className="bg-[#f0f0f0] px-3 py-1.5 flex items-center gap-1.5 overflow-x-auto border-t border-slate-200 shrink-0 text-[10px]">
              <span className="text-slate-400 font-bold shrink-0">Opsi Cepat:</span>
              <button
                type="button"
                onClick={() => handleSendDirectText('1')}
                className="px-2.5 py-1 bg-white hover:bg-emerald-50 text-emerald-900 font-bold rounded-lg border border-slate-300 shrink-0 transition-colors shadow-2xs"
              >
                📄 1. Pengajuan Surat
              </button>
              <button
                type="button"
                onClick={() => handleSendDirectText('2')}
                className="px-2.5 py-1 bg-white hover:bg-amber-50 text-amber-900 font-bold rounded-lg border border-amber-300 shrink-0 transition-colors shadow-2xs"
              >
                📢 2. Pengaduan Warga
              </button>
              <button
                type="button"
                onClick={() => handleSendDirectText('SKU')}
                className="px-2 py-1 bg-white hover:bg-slate-100 text-slate-700 font-bold rounded-lg border border-slate-300 shrink-0 transition-colors"
              >
                SKU
              </button>
              <button
                type="button"
                onClick={() => handleSendDirectText('DOMISILI')}
                className="px-2 py-1 bg-white hover:bg-slate-100 text-slate-700 font-bold rounded-lg border border-slate-300 shrink-0 transition-colors"
              >
                Domisili
              </button>
              <button
                type="button"
                onClick={() => handleSendDirectText('SETUJU')}
                className="px-2.5 py-1 bg-emerald-800 hover:bg-emerald-900 text-white font-bold rounded-lg shrink-0 transition-colors"
              >
                ✓ SETUJU
              </button>
              <button
                type="button"
                onClick={() => handleSendDirectText('MENU')}
                className="px-2 py-1 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold rounded-lg shrink-0 transition-colors"
              >
                Menu Utama
              </button>
            </div>

            {/* WHATSAPP CHAT INPUT FOOTER WITH ATTACHMENT & CAMERA BUTTONS */}
            <form onSubmit={handleSendMessage} className="bg-[#f0f0f0] p-2.5 flex items-center gap-2 border-t border-slate-300 shrink-0 z-10">
              {/* Attachment Paperclip Button (📎) */}
              <button
                type="button"
                onClick={() => setShowAttachmentMenu(!showAttachmentMenu)}
                className={`p-2 rounded-full transition-colors ${
                  showAttachmentMenu ? 'bg-emerald-800 text-white' : 'text-slate-600 hover:bg-slate-200'
                }`}
                title="Lampirkan Dokumen Foto"
              >
                <Paperclip className="w-5 h-5" />
              </button>

              {/* Direct Camera Button (📷) */}
              <label
                className="p-2 text-slate-600 hover:bg-slate-200 rounded-full cursor-pointer transition-colors"
                title="Ambil Foto Kamera Langsung"
              >
                <Camera className="w-5 h-5" />
                <input
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={(e) => handlePhotoSelect(e, 'Foto Kamera Langsung Warga')}
                  className="hidden"
                />
              </label>

              {/* Text Input */}
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder={attachedImage ? 'Klik tombol kirim untuk melampirkan foto...' : 'Ketik balasan (SKU, NIK, SETUJU)...'}
                className="flex-1 px-3.5 py-2 text-xs bg-white border border-slate-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#075e54] text-slate-900 font-medium"
              />

              {/* Send Button */}
              <button
                type="submit"
                disabled={loading || (!inputMessage.trim() && !attachedImage)}
                className="w-10 h-10 bg-[#075e54] hover:bg-[#064e46] disabled:opacity-50 text-white rounded-full flex items-center justify-center shadow-xs shrink-0 transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
