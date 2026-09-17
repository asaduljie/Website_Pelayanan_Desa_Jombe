'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import {
  X,
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  MousePointerClick,
  CheckCircle2,
  FileText,
  Search,
  MessageSquare,
  ShieldCheck,
  UserCheck,
  HelpCircle,
} from 'lucide-react';

export interface TutorialStep {
  stepNumber: number;
  title: string;
  actionText: string; // Apa yang ditekan / diklik
  screenDescription: string;
  voiceScript: string;
  mascotTip: string;
  screenType: 'menu_layanan' | 'form_surat' | 'upload_berkas' | 'kirim_sukses' | 'lacak_input' | 'lacak_result' | 'pengaduan_form' | 'login_nik' | 'ttd_basah';
}

export interface TutorialConfig {
  id: string;
  title: string;
  subtitle: string;
  steps: TutorialStep[];
}

export const TUTORIAL_DATA: Record<string, TutorialConfig> = {
  sku: {
    id: 'sku',
    title: 'Panduan Pengajuan Surat Keterangan Usaha (SKU)',
    subtitle: 'Langkah mudah mengajukan surat keterangan usaha dari rumah 24 jam',
    steps: [
      {
        stepNumber: 1,
        title: 'Buka Menu Katalog Layanan',
        actionText: '👆 Klik tombol "Layanan" pada navigasi atas atau beranda',
        screenDescription: 'Halaman Beranda Desa Jombe > Navigasi Utama',
        voiceScript: 'Halo warga Desa Jombe! Langkah pertama, silakan klik menu Layanan di bagian navigasi atas untuk melihat seluruh pilihan surat administrasi desa.',
        mascotTip: 'Klik menu "Layanan" di navigasi atas atau tombol "Katalog Surat" di beranda.',
        screenType: 'menu_layanan',
      },
      {
        stepNumber: 2,
        title: 'Pilih Surat Keterangan Usaha (SKU)',
        actionText: '👆 Tekan kartu "Surat Keterangan Usaha (SKU)"',
        screenDescription: 'Katalog Layanan Surat > Kartu SKU',
        voiceScript: 'Langkah kedua, cari dan tekan kartu Surat Keterangan Usaha. Surat ini gratis dan siap diproses dalam satu hari kerja.',
        mascotTip: 'Pilih kartu Surat Keterangan Usaha. Biayanya 100% gratis tanpa pungli ya!',
        screenType: 'form_surat',
      },
      {
        stepNumber: 3,
        title: 'Isi NIK & Keterangan Usaha',
        actionText: '✍️ Ketik 16 Digit NIK e-KTP & Rincian Usaha Anda',
        screenDescription: 'Formulir Permohonan SKU > Bidang NIK & Data Usaha',
        voiceScript: 'Langkah ketiga, masukkan 16 digit NIK e-KTP Anda, nama tempat usaha, serta dusun lokasi usaha Anda di Desa Jombe.',
        mascotTip: 'Pastikan 16 digit NIK Anda sesuai KTP asli agar data otomatis terhubung.',
        screenType: 'form_surat',
      },
      {
        stepNumber: 4,
        title: 'Unggah Foto KTP, KK, & Usaha',
        actionText: '📎 Klik tombol "Pilih Berkas" untuk upload foto KTP, KK, & Usaha',
        screenDescription: 'Lampiran Berkas > Upload Foto KTP & KK',
        voiceScript: 'Langkah keempat, lampirkan foto e-KTP asli, Kartu Keluarga, dan foto tempat usaha Anda yang jelas dan tidak buram.',
        mascotTip: 'Gunakan kamera HP dengan pencahayaan terang agar berkas mudah diverifikasi operator.',
        screenType: 'upload_berkas',
      },
      {
        stepNumber: 5,
        title: 'Tekan Tombol Kirim Permohonan',
        actionText: '🚀 Tekan tombol hijau "Kirim Permohonan"',
        screenDescription: 'Bawah Formulir > Tombol Kirim Permohonan',
        voiceScript: 'Langkah kelima, tekan tombol hijau Kirim Permohonan. Anda akan menerima Nomor Registrasi berawalan JMB untuk memantau status surat.',
        mascotTip: 'Simpan Nomor Registrasi JMB Anda untuk mengecek status permohonan.',
        screenType: 'kirim_sukses',
      },
      {
        stepNumber: 6,
        title: 'Cetak & Tanda Tangan Basah Kades',
        actionText: '🏛️ Ambil surat fisik ber-TTD basah di Kantor Desa',
        screenDescription: 'Verifikasi Operator > Cetak & TTD Basah Kades JUSMAEDY, S.Pd',
        voiceScript: 'Langkah terakhir, operator mencetak berkas untuk ditandatangani basah oleh Kepala Desa Jombe, Bapak JUSMAEDY, S.Pd, dan diberi stempel cap basah. Surat fisik resmi siap Anda ambil!',
        mascotTip: 'Surat resmi sah setelah ditandatangani basah oleh Kepala Desa dan distempel kantor desa.',
        screenType: 'ttd_basah',
      },
    ],
  },
  lacak: {
    id: 'lacak',
    title: 'Panduan Melacak Status Permohonan Surat',
    subtitle: 'Pantau kemajuan berkas surat Anda secara real-time tanpa perlu bolak-balik ke kantor',
    steps: [
      {
        stepNumber: 1,
        title: 'Buka Halaman Lacak Surat',
        actionText: '👆 Klik menu "Lacak Permohonan" di navigasi atas',
        screenDescription: 'Halaman Navigasi > Menu Lacak Surat (/lacak)',
        voiceScript: 'Untuk mengecek status surat Anda, langkah pertama klik menu Lacak Permohonan di navigasi atas.',
        mascotTip: 'Menu Lacak Surat aktif 24 jam untuk transparansi penuh permohonan warga.',
        screenType: 'menu_layanan',
      },
      {
        stepNumber: 2,
        title: 'Masukkan Nomor Registrasi / NIK',
        actionText: '✍️ Ketik Nomor Registrasi (JMB-XXXXX) atau 16 Digit NIK',
        screenDescription: 'Form Pencarian Lacak > Kolom Input Nomor Registrasi / NIK',
        voiceScript: 'Langkah kedua, ketikkan Nomor Registrasi surat Anda, misalnya JMB-2026-00001, atau cukup masukkan 16 digit NIK e-KTP Anda.',
        mascotTip: 'Lupa nomor registrasi? Jangan khawatir, cukup masukkan NIK e-KTP Anda!',
        screenType: 'lacak_input',
      },
      {
        stepNumber: 3,
        title: 'Tekan Tombol "Cari Status"',
        actionText: '🔍 Tekan tombol biru "Cari Status Permohonan"',
        screenDescription: 'Form Pencarian > Tombol Cari Status',
        voiceScript: 'Langkah ketiga, tekan tombol Cari Status Permohonan untuk melihat hasil penelusuran.',
        mascotTip: 'Tekan tombol Cari atau tekan tombol Enter di keyboard Anda.',
        screenType: 'lacak_input',
      },
      {
        stepNumber: 4,
        title: 'Pantau Status & Ambil Surat',
        actionText: '📋 Lihat timeline status: Menunggu > Proses > Disetujui',
        screenDescription: 'Kartu Hasil Lacak > Riwayat & Catatan Operator',
        voiceScript: 'Langkah keempat, periksa statusnya. Jika status telah Disetujui, surat Anda telah dicetak, ditandatangani basah Kepala Desa, dan siap diambil di kantor desa.',
        mascotTip: 'Jika ada catatan "Perlu Perbaikan", silakan perbaiki foto berkas sesuai arahan operator.',
        screenType: 'lacak_result',
      },
    ],
  },
  pengaduan: {
    id: 'pengaduan',
    title: 'Panduan Layanan Pengaduan & Aspirasi Warga',
    subtitle: 'Sampaikan laporan jalan rusak, lampu jalan, irigasi, atau pelayanan desa secara langsung',
    steps: [
      {
        stepNumber: 1,
        title: 'Buka Menu Pengaduan Warga',
        actionText: '👆 Klik menu "Pengaduan" di bagian navigasi',
        screenDescription: 'Navigasi Website > Menu Pengaduan Warga (/pengaduan)',
        voiceScript: 'Pemerintah Desa Jombe sangat terbuka terhadap aspirasi warga. Langkah pertama, klik menu Pengaduan di bagian navigasi.',
        mascotTip: 'Setiap warga berhak menyampaikan aspirasi untuk kemajuan desa kita!',
        screenType: 'menu_layanan',
      },
      {
        stepNumber: 2,
        title: 'Pilih Kategori & Tuliskan Laporan',
        actionText: '✍️ Pilih Kategori Aduan & Tuliskan Detail Lokasi Dusun',
        screenDescription: 'Formulir Pengaduan > Pilihan Kategori & Deskripsi',
        voiceScript: 'Langkah kedua, pilih kategori laporan seperti Infrastruktur atau Pertanian, lalu ceritakan permasalahan dan lokasinya secara jelas.',
        mascotTip: 'Sebutkan nama dusun tempat kejadian agar petugas dapat langsung menuju lokasi.',
        screenType: 'pengaduan_form',
      },
      {
        stepNumber: 3,
        title: 'Unggah Foto Bukti Kejadian',
        actionText: '📸 Klik tombol "Unggah Foto Bukti" (Jalan/Lampu/Irigasi)',
        screenDescription: 'Formulir Pengaduan > Upload Bukti Foto',
        voiceScript: 'Langkah ketiga, lampirkan foto dokumentasi kondisi di lapangan agar aduan Anda dapat diprioritaskan oleh perangkat desa.',
        mascotTip: 'Foto bukti fisik mempermudah aparat desa meninjau langsung ke lapangan.',
        screenType: 'upload_berkas',
      },
      {
        stepNumber: 4,
        title: 'Kirim Aduan & Simpan Nomor Tiket',
        actionText: '🚀 Tekan tombol "Kirim Pengaduan" & Catat Nomor Tiket PGD',
        screenDescription: 'Pengaduan Terkirim > Nomor Tiket PGD-XXXXX',
        voiceScript: 'Langkah terakhir, tekan Kirim Pengaduan. Anda akan memperoleh Nomor Tiket aduan berawalan PGD untuk memantau tindak lanjut aparat desa.',
        mascotTip: 'Aparatur Desa Jombe akan segera meninjau dan menindaklanjuti laporan Anda.',
        screenType: 'kirim_sukses',
      },
    ],
  },
  login: {
    id: 'login',
    title: 'Panduan Masuk Mandiri Berbasis NIK',
    subtitle: 'Akses dashboard warga tanpa repot menghafal password rumit',
    steps: [
      {
        stepNumber: 1,
        title: 'Klik Tombol Masuk / Login',
        actionText: '👆 Klik tombol "Masuk" di pojok kanan atas layar',
        screenDescription: 'Navigasi Atas > Tombol Masuk / Akun Warga',
        voiceScript: 'Untuk membuka akun mandiri warga, langkah pertama klik tombol Masuk di pojok kanan atas layar.',
        mascotTip: 'Tombol Masuk selalu tersedia di bagian kanan atas seluruh halaman website.',
        screenType: 'menu_layanan',
      },
      {
        stepNumber: 2,
        title: 'Ketik 16 Digit NIK e-KTP Anda',
        actionText: '✍️ Masukkan 16 Digit NIK Anda ke dalam kolom',
        screenDescription: 'Halaman Login Warga > Input 16 Digit NIK',
        voiceScript: 'Langkah kedua, masukkan 16 digit NIK Anda sesuai e-KTP asli. Anda tidak perlu mengingat password yang rumit.',
        mascotTip: 'Hanya butuh NIK 16 digit, sistem langsung mengenali akun Anda dengan aman.',
        screenType: 'login_nik',
      },
      {
        stepNumber: 3,
        title: 'Tekan Tombol "Masuk ke Sistem"',
        actionText: '🚀 Tekan tombol hijau "Masuk Sekarang"',
        screenDescription: 'Halaman Login > Tombol Masuk Sekarang',
        voiceScript: 'Langkah ketiga, tekan tombol Masuk Sekarang. Anda akan langsung diarahkan ke Dashboard Warga.',
        mascotTip: 'Tekan Masuk Sekarang untuk melihat riwayat surat dan profil Anda.',
        screenType: 'login_nik',
      },
      {
        stepNumber: 4,
        title: 'Kelola Seluruh Surat di Dashboard',
        actionText: '📊 Buka riwayat surat & status aduan di Dashboard Warga',
        screenDescription: 'Dashboard Warga (/dashboard) > Riwayat Pengajuan',
        voiceScript: 'Selesai! Di Dashboard Warga, Anda dapat memantau seluruh riwayat surat permohonan dan tiket pengaduan yang pernah Anda ajukan.',
        mascotTip: 'Semua berkas yang Anda ajukan tersimpan rapi dan aman di dashboard Anda!',
        screenType: 'kirim_sukses',
      },
    ],
  },
};

interface InteractiveTutorialModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTutorialId?: string;
}

export default function InteractiveTutorialModal({
  isOpen,
  onClose,
  initialTutorialId = 'sku',
}: InteractiveTutorialModalProps) {
  const [selectedTutorialId, setSelectedTutorialId] = useState<string>(initialTutorialId);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);

  const activeTutorial = TUTORIAL_DATA[selectedTutorialId] || TUTORIAL_DATA['sku'];
  const totalSteps = activeTutorial.steps.length;
  const currentStep = activeTutorial.steps[currentStepIndex] || activeTutorial.steps[0];

  // Speech synthesis voice over engine
  const speakCurrentStep = (text: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window) || isMuted) {
      setIsSpeaking(false);
      return;
    }

    try {
      window.speechSynthesis.cancel(); // cancel prior utterances
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.95; // clear, comfortable pace
      utterance.pitch = 1.0;
      utterance.lang = 'id-ID';

      // Pick Indonesian voice if available
      const voices = window.speechSynthesis.getVoices();
      const idVoice = voices.find(
        (v) => v.lang.includes('id') || v.lang.includes('ID') || v.name.toLowerCase().includes('indonesia')
      );
      if (idVoice) utterance.voice = idVoice;

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      window.speechSynthesis.speak(utterance);
    } catch (e) {
      setIsSpeaking(false);
    }
  };

  // Sync tutorial selection changes
  useEffect(() => {
    if (initialTutorialId && TUTORIAL_DATA[initialTutorialId]) {
      setSelectedTutorialId(initialTutorialId);
      setCurrentStepIndex(0);
    }
  }, [initialTutorialId]);

  // Handle voice over playback when step or play state changes
  useEffect(() => {
    if (isOpen && currentStep) {
      if (isPlaying && !isMuted) {
        speakCurrentStep(currentStep.voiceScript);
      } else {
        if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
          window.speechSynthesis.cancel();
        }
        setIsSpeaking(false);
      }
    }

    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [isOpen, selectedTutorialId, currentStepIndex, isPlaying, isMuted]);

  // Clean up speech synthesis on close
  const handleClose = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
    onClose();
  };

  const handleNextStep = () => {
    if (currentStepIndex < totalSteps - 1) {
      setCurrentStepIndex((prev) => prev + 1);
    } else {
      // Loop or pause at end
      setIsPlaying(false);
    }
  };

  const handlePrevStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
    }
  };

  const handleReplayVoice = () => {
    speakCurrentStep(currentStep.voiceScript);
  };

  const toggleMute = () => {
    if (!isMuted) {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      setIsSpeaking(false);
      setIsMuted(true);
    } else {
      setIsMuted(false);
      speakCurrentStep(currentStep.voiceScript);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Top Header Bar */}
        <div className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-teal-900 text-white px-5 py-3.5 flex items-center justify-between shadow-md">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-400 text-emerald-950 flex items-center justify-center font-black shadow-sm">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm sm:text-base font-extrabold leading-tight">
                  Video Tutorial & Panduan Interaktif
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-400 text-emerald-950 uppercase tracking-wider">
                  Dipandu Maskot
                </span>
              </div>
              <p className="text-[11px] text-emerald-200 leading-tight">
                Simulasi langkah demi langkah disertai instruksi visual & suara resmi Desa Jombe
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-emerald-100 hover:text-white transition-colors"
            title="Tutup Tutorial"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tutorial Category Switcher Bar */}
        <div className="bg-emerald-950/95 border-b border-emerald-800/80 px-4 py-2 flex items-center gap-2 overflow-x-auto scrollbar-none">
          <span className="text-[11px] font-bold text-emerald-300 shrink-0 mr-1">Pilih Tutorial:</span>
          {Object.values(TUTORIAL_DATA).map((tut) => (
            <button
              key={tut.id}
              onClick={() => {
                setSelectedTutorialId(tut.id);
                setCurrentStepIndex(0);
                setIsPlaying(true);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 ${
                selectedTutorialId === tut.id
                  ? 'bg-amber-400 text-emerald-950 shadow-md scale-102'
                  : 'bg-emerald-900/60 text-emerald-200 hover:bg-emerald-800 hover:text-white border border-emerald-700/50'
              }`}
            >
              {tut.id === 'sku' && <FileText className="w-3.5 h-3.5" />}
              {tut.id === 'lacak' && <Search className="w-3.5 h-3.5" />}
              {tut.id === 'pengaduan' && <MessageSquare className="w-3.5 h-3.5" />}
              {tut.id === 'login' && <UserCheck className="w-3.5 h-3.5" />}
              <span>{tut.title.replace('Panduan ', '')}</span>
            </button>
          ))}
        </div>

        {/* Main Content: Video Screen + Mascot Sidebar */}
        <div className="flex-1 overflow-y-auto grid grid-cols-1 lg:grid-cols-12 bg-slate-900">
          {/* Simulated Video & Screen Walkthrough (7 cols) */}
          <div className="lg:col-span-8 p-4 sm:p-5 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-slate-800 bg-slate-950">
            {/* Simulated Browser Frame */}
            <div className="relative w-full rounded-2xl overflow-hidden border border-slate-700 bg-slate-900 shadow-2xl flex flex-col h-[320px] sm:h-[350px]">
              {/* Browser Mockup Top Bar */}
              <div className="bg-slate-800 px-3 py-2 border-b border-slate-700 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                </div>
                <div className="px-3 py-1 rounded-md bg-slate-900 text-[10px] text-slate-300 font-mono border border-slate-700 flex items-center gap-1.5">
                  <span className="text-emerald-400">https://</span>
                  <span>lenteradesajombe.biz.id{selectedTutorialId === 'lacak' ? '/lacak' : selectedTutorialId === 'pengaduan' ? '/pengaduan' : selectedTutorialId === 'login' ? '/login' : '/layanan'}</span>
                </div>
                <div className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  LIVE DEMO
                </div>
              </div>

              {/* Screen Mockup Content */}
              <div className="relative flex-1 p-4 bg-gradient-to-br from-slate-900 via-slate-850 to-emerald-950/40 flex flex-col justify-center items-center text-center overflow-hidden">
                {/* Visual Step Badge */}
                <div className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-emerald-950/80 border border-emerald-500/30 text-[10px] font-bold text-emerald-300 flex items-center gap-1.5 shadow-sm">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                  {currentStep.screenDescription}
                </div>

                {/* Step Content Preview Graphics */}
                {currentStep.screenType === 'menu_layanan' && (
                  <div className="w-full max-w-md space-y-3">
                    <div className="p-3 bg-slate-800/90 rounded-xl border border-slate-700 text-left">
                      <div className="text-[11px] font-bold text-slate-300 mb-2">Navigasi Website Lentera Desa:</div>
                      <div className="flex flex-wrap gap-2">
                        <span className="px-2.5 py-1 bg-slate-700/60 rounded-md text-[10px] text-slate-400">Beranda</span>
                        <div className="relative">
                          <span className="px-3 py-1 bg-emerald-600 text-white font-bold rounded-md text-[11px] ring-4 ring-emerald-500/40 shadow-lg inline-block">
                            Layanan Surat ▾
                          </span>
                          {/* Pulsing Touch Indicator */}
                          <div className="absolute -top-3 -right-3 flex items-center justify-center">
                            <span className="w-6 h-6 rounded-full bg-amber-400/80 animate-ping absolute" />
                            <span className="w-5 h-5 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center text-[10px] font-black shadow-md z-10">
                              👆
                            </span>
                          </div>
                        </div>
                        <span className="px-2.5 py-1 bg-slate-700/60 rounded-md text-[10px] text-slate-400">Lacak Status</span>
                        <span className="px-2.5 py-1 bg-slate-700/60 rounded-md text-[10px] text-slate-400">Profil Desa</span>
                      </div>
                    </div>
                  </div>
                )}

                {currentStep.screenType === 'form_surat' && (
                  <div className="w-full max-w-sm space-y-2 text-left">
                    <div className="p-3 bg-slate-800/90 rounded-xl border border-slate-700">
                      <div className="text-[11px] font-bold text-white mb-2">Formulir Permohonan Surat:</div>
                      <div className="space-y-2">
                        <div>
                          <label className="text-[10px] text-slate-400 block mb-0.5">Nomor Induk Kependudukan (NIK 16 Digit)</label>
                          <div className="relative">
                            <input
                              readOnly
                              value="7304051208990001"
                              className="w-full px-2.5 py-1.5 bg-slate-900 border-2 border-emerald-500 text-white rounded-lg text-xs font-mono ring-4 ring-emerald-500/30"
                            />
                            <div className="absolute right-2 top-2 text-[10px] font-bold text-amber-400 flex items-center gap-1">
                              <span>✍️ Ketik NIK</span>
                            </div>
                          </div>
                        </div>
                        <div>
                          <label className="text-[10px] text-slate-400 block mb-0.5">Nama Pemohon & Dusun</label>
                          <input readOnly value="Warga Desa Jombe - Dusun Jombe Selatan" className="w-full px-2.5 py-1.5 bg-slate-900/60 border border-slate-700 text-slate-300 rounded-lg text-xs" />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {currentStep.screenType === 'upload_berkas' && (
                  <div className="w-full max-w-sm space-y-2.5 text-left">
                    <div className="p-3 bg-slate-800/90 rounded-xl border border-slate-700">
                      <div className="text-[11px] font-bold text-white mb-2">Lampiran Dokumen Persyaratan:</div>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="p-2.5 rounded-lg border-2 border-dashed border-emerald-500 bg-emerald-950/30 text-center relative">
                          <div className="text-[10px] font-bold text-emerald-300">Foto e-KTP Asli</div>
                          <span className="text-[9px] text-slate-400">Kamera / Galeri</span>
                          <div className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center text-[10px] font-black">
                            ✓
                          </div>
                        </div>
                        <div className="p-2.5 rounded-lg border-2 border-dashed border-emerald-500 bg-emerald-950/30 text-center relative">
                          <div className="text-[10px] font-bold text-emerald-300">Kartu Keluarga (KK)</div>
                          <span className="text-[9px] text-slate-400">Kamera / Galeri</span>
                          <div className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center text-[10px] font-black">
                            ✓
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {currentStep.screenType === 'kirim_sukses' && (
                  <div className="w-full max-w-sm p-4 bg-emerald-950/80 rounded-2xl border-2 border-emerald-500/70 text-center space-y-2 shadow-xl">
                    <div className="w-10 h-10 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center mx-auto shadow-md font-black">
                      ✓
                    </div>
                    <div className="text-xs font-black text-white">Permohonan Berhasil Dikirim!</div>
                    <div className="px-3 py-1.5 rounded-xl bg-slate-900 border border-emerald-500/40 text-[11px] font-mono text-amber-300 inline-block font-bold">
                      No. Registrasi: JMB-2026-00001
                    </div>
                    <p className="text-[10px] text-emerald-200">
                      Berkas otomatis masuk ke antrean operator desa untuk diverifikasi.
                    </p>
                  </div>
                )}

                {currentStep.screenType === 'ttd_basah' && (
                  <div className="w-full max-w-sm p-3.5 bg-slate-800/90 rounded-2xl border border-emerald-500/40 text-left space-y-2">
                    <div className="flex items-center gap-2 text-[11px] font-bold text-amber-300">
                      <ShieldCheck className="w-4 h-4 text-amber-400" />
                      Legalitas Fisik Surat Resmi
                    </div>
                    <div className="p-2.5 bg-white text-slate-900 rounded-lg text-[10px] space-y-1 shadow-inner font-serif">
                      <div className="text-center font-bold border-b pb-1 text-[11px]">
                        PEMERINTAH KABUPATEN JENEPONTO<br />KANTOR DESA JOMBE
                      </div>
                      <div className="pt-1 text-[9px] text-slate-600">Surat Keterangan Resmi Kependudukan</div>
                      <div className="pt-2 flex justify-end">
                        <div className="text-center">
                          <div className="text-[8px]">Kepala Desa Jombe</div>
                          <div className="font-bold text-[9px] text-blue-900 underline mt-2">JUSMAEDY, S.Pd</div>
                          <div className="text-[7px] text-slate-500">(Tanda Tangan & Cap Stempel Basah)</div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {currentStep.screenType === 'lacak_input' && (
                  <div className="w-full max-w-sm p-3 bg-slate-800 rounded-xl border border-slate-700 text-left space-y-2">
                    <div className="text-[11px] font-bold text-white">Masukkan No. Registrasi / NIK:</div>
                    <div className="flex gap-1.5">
                      <input
                        readOnly
                        value="JMB-2026-00001"
                        className="flex-1 px-2.5 py-1.5 bg-slate-900 border-2 border-emerald-500 text-white rounded-lg text-xs font-mono ring-4 ring-emerald-500/30"
                      />
                      <button className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shadow-md flex items-center gap-1">
                        <Search className="w-3 h-3" />
                        Cari
                      </button>
                    </div>
                  </div>
                )}

                {currentStep.screenType === 'lacak_result' && (
                  <div className="w-full max-w-sm p-3 bg-slate-800 rounded-xl border border-slate-700 text-left space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-white">Status Permohonan</span>
                      <span className="px-2 py-0.5 bg-emerald-500 text-slate-950 font-black rounded text-[10px]">
                        DISETUJUI / SELESAI
                      </span>
                    </div>
                    <div className="text-[10px] text-slate-300">
                      Surat resmi telah dicetak dan ditandatangani basah oleh Kepala Desa Jombe. Siap diambil di kantor desa.
                    </div>
                  </div>
                )}

                {currentStep.screenType === 'pengaduan_form' && (
                  <div className="w-full max-w-sm p-3 bg-slate-800 rounded-xl border border-slate-700 text-left space-y-2">
                    <div className="text-[11px] font-bold text-white">Formulir Aspirasi & Pengaduan Warga</div>
                    <input readOnly value="Jalan berlubang di Dusun Jombe Selatan" className="w-full px-2.5 py-1 bg-slate-900 border border-slate-700 text-white rounded text-xs" />
                    <textarea readOnly rows={2} value="Mohon perbaikan jalan poros dusun demi kelancaran pengangkutan hasil panen jagung warga." className="w-full px-2.5 py-1 bg-slate-900 border border-slate-700 text-white rounded text-[11px]" />
                  </div>
                )}

                {currentStep.screenType === 'login_nik' && (
                  <div className="w-full max-w-sm p-4 bg-slate-800 rounded-xl border border-slate-700 text-left space-y-2.5">
                    <div className="text-center font-bold text-white text-xs">Masuk Akun Warga Desa Jombe</div>
                    <div className="space-y-1">
                      <label className="text-[10px] text-slate-400">16 Digit NIK e-KTP</label>
                      <input readOnly value="7304051208990001" className="w-full px-3 py-2 bg-slate-900 border-2 border-emerald-500 text-white rounded-lg text-xs font-mono ring-4 ring-emerald-500/30" />
                    </div>
                    <button className="w-full py-2 bg-emerald-600 text-white rounded-lg text-xs font-bold shadow-md">
                      Masuk ke Dashboard Warga
                    </button>
                  </div>
                )}

                {/* Highlighted Action Badge (Apa yang ditekan) */}
                <div className="absolute bottom-3 inset-x-3 sm:inset-x-6 p-2 rounded-xl bg-amber-400 text-emerald-950 font-black text-[11px] shadow-lg flex items-center justify-center gap-2 border border-amber-300 animate-pulse">
                  <MousePointerClick className="w-4 h-4 text-emerald-950 shrink-0" />
                  <span className="truncate">{currentStep.actionText}</span>
                </div>
              </div>
            </div>

            {/* Video Controls Bar */}
            <div className="mt-3.5 p-3 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-2.5">
              {/* Step counter & Play/Pause */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className={`p-2 rounded-xl font-bold transition-all flex items-center gap-1 text-xs ${
                    isPlaying
                      ? 'bg-amber-400 text-emerald-950 shadow-md hover:bg-amber-300'
                      : 'bg-emerald-700 text-white hover:bg-emerald-600'
                  }`}
                  title={isPlaying ? 'Jeda Video' : 'Putar Video'}
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  <span>{isPlaying ? 'Jeda' : 'Putar'}</span>
                </button>

                <button
                  onClick={toggleMute}
                  className={`p-2 rounded-xl border text-xs font-bold transition-colors flex items-center gap-1 ${
                    !isMuted
                      ? 'bg-emerald-900/60 text-emerald-300 border-emerald-700 hover:bg-emerald-800'
                      : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
                  }`}
                  title={isMuted ? 'Nyalakan Suara Voice Over' : 'Matikan Suara Voice Over'}
                >
                  {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
                  <span>{isMuted ? 'Mute' : 'Voice Over'}</span>
                </button>

                <button
                  onClick={handleReplayVoice}
                  className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white border border-slate-700 text-xs transition-colors"
                  title="Ulangi Suara Langkah Ini"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>

              {/* Step Pagination Buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrevStep}
                  disabled={currentStepIndex === 0}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-white border border-slate-700"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                <div className="text-xs font-bold text-slate-300">
                  Langkah <span className="text-amber-400">{currentStepIndex + 1}</span> dari {totalSteps}
                </div>

                <button
                  onClick={handleNextStep}
                  disabled={currentStepIndex === totalSteps - 1}
                  className="p-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-600 disabled:opacity-40 text-white border border-emerald-600"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Mascot Narration Sidebar (4 cols) */}
          <div className="lg:col-span-4 p-4 sm:p-5 flex flex-col justify-between bg-gradient-to-b from-emerald-950 via-slate-900 to-emerald-950 border-t lg:border-t-0 text-white">
            {/* Mascot Identity Card */}
            <div>
              <div className="flex items-center gap-3 p-2.5 rounded-2xl bg-emerald-900/40 border border-emerald-500/30 mb-3.5 shadow-sm">
                <div className="relative w-12 h-12 rounded-xl overflow-hidden border border-amber-400/50 shadow-md bg-emerald-900 shrink-0">
                  <Image
                    src="/images/mascot-desa-jombe.png"
                    alt="Daeng Jombe - Maskot Pelayanan Desa"
                    width={48}
                    height={48}
                    className="object-cover"
                  />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-black text-white">Daeng Jombe</span>
                    <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-amber-400 text-emerald-950">
                      Maskot Resmi
                    </span>
                  </div>
                  <div className="text-[10px] text-emerald-300">Pemandu Digital Pelayanan Desa</div>
                </div>
              </div>

              {/* Mascot Live Speech Bubble */}
              <div className="relative p-3.5 rounded-2xl bg-white text-slate-900 shadow-xl border-2 border-emerald-400/40 mb-3 space-y-2">
                <div className="flex items-center justify-between border-b border-slate-100 pb-1.5">
                  <span className="text-[10px] font-extrabold text-emerald-800 uppercase tracking-wide flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-amber-500" />
                    Penjelasan Maskot
                  </span>
                  {isSpeaking && (
                    <span className="flex items-center gap-1 text-[9px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-ping" />
                      Bersuara...
                    </span>
                  )}
                </div>

                <p className="text-xs leading-relaxed text-slate-800 font-medium">
                  "{currentStep.voiceScript}"
                </p>

                {/* Mascot Tip Box */}
                <div className="p-2 rounded-xl bg-amber-50 border border-amber-200 text-[10.5px] text-amber-900 flex items-start gap-1.5">
                  <span className="text-xs">💡</span>
                  <span>{currentStep.mascotTip}</span>
                </div>
              </div>

              {/* Steps Progress Timeline List */}
              <div className="space-y-1.5 max-h-[160px] overflow-y-auto pr-1">
                {activeTutorial.steps.map((st, idx) => (
                  <button
                    key={st.stepNumber}
                    onClick={() => {
                      setCurrentStepIndex(idx);
                      setIsPlaying(true);
                    }}
                    className={`w-full text-left px-2.5 py-1.5 rounded-xl text-[11px] font-semibold transition-all flex items-center gap-2 border ${
                      currentStepIndex === idx
                        ? 'bg-amber-400 text-emerald-950 font-black border-amber-300 shadow-sm'
                        : 'bg-slate-900/60 text-slate-300 border-slate-800 hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    <span
                      className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold ${
                        currentStepIndex === idx ? 'bg-emerald-950 text-white' : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {st.stepNumber}
                    </span>
                    <span className="truncate">{st.title}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Mascot Full Character Visual Footer */}
            <div className="pt-3 border-t border-emerald-900/60 mt-3 flex items-center justify-between">
              <div className="flex items-center gap-2 text-[11px] text-emerald-300">
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                <span>Pelayanan Cepat, Transparan & 100% Gratis</span>
              </div>
              <button
                onClick={handleClose}
                className="px-3 py-1.5 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-bold shadow-md transition-colors"
              >
                Tutup Panduan
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
