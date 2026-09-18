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
  ZoomIn,
  Mic,
  Maximize2,
} from 'lucide-react';

export interface TutorialStep {
  stepNumber: number;
  title: string;
  actionText: string; // Apa yang ditekan / diklik
  targetLabel: string;
  zoomTarget: 'nav_layanan' | 'card_sku' | 'input_nik' | 'upload_area' | 'btn_submit' | 'search_lacak' | 'result_lacak' | 'form_aduan' | 'login_btn' | 'ttd_area';
  screenDescription: string;
  voiceScript: string;
  mascotTip: string;
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
    subtitle: 'Simulasi kursor dan zoom otomatis menunjukkan cara mengajukan SKU secara online',
    steps: [
      {
        stepNumber: 1,
        title: 'Buka Menu Katalog Layanan',
        actionText: '👆 Kursor mengarah dan menekan menu "Layanan" di navigasi atas',
        targetLabel: 'Menu Navigasi "Layanan"',
        zoomTarget: 'nav_layanan',
        screenDescription: 'Halaman Beranda > Navigasi Utama Website',
        voiceScript: 'Tabe\' warga Desa Jombe! Saya Daeng Jombe. Langkah pertama, perhatikan kursor yang bergerak menuju menu Layanan di navigasi atas. Silakan klik menu ini untuk melihat seluruh katalog surat.',
        mascotTip: 'Klik menu "Layanan" di navigasi atas untuk membuka daftar lengkap 9 surat desa.',
      },
      {
        stepNumber: 2,
        title: 'Pilih Surat Keterangan Usaha (SKU)',
        actionText: '👆 Kursor menekan kartu "Surat Keterangan Usaha (SKU)"',
        targetLabel: 'Kartu Layanan SKU',
        zoomTarget: 'card_sku',
        screenDescription: 'Katalog Layanan > Pilihan Surat Keterangan Usaha',
        voiceScript: 'Langkah kedua, lihat kursor menzoom ke kartu Surat Keterangan Usaha. Tekan kartu ini untuk membuka formulir pendaftaran legalitas usaha Anda. Layanan ini 100% gratis.',
        mascotTip: 'Surat Keterangan Usaha diproses cepat 1 hari kerja untuk syarat modal usaha dan perbankan.',
      },
      {
        stepNumber: 3,
        title: 'Ketik 16 Digit NIK e-KTP',
        actionText: '✍️ Kursor menzoom kolom NIK lalu mengetik 16 Digit NIK pemohon',
        targetLabel: 'Kolom Input NIK 16 Digit',
        zoomTarget: 'input_nik',
        screenDescription: 'Formulir Permohonan SKU > Kolom Identitas NIK',
        voiceScript: 'Langkah ketiga, kursor menyorot kolom NIK. Masukkan 16 digit NIK e-KTP Anda dengan benar, data dusun dan nama Anda akan terhubung otomatis.',
        mascotTip: 'Cukup masukkan 16 digit NIK sesuai e-KTP asli warga Desa Jombe.',
      },
      {
        stepNumber: 4,
        title: 'Unggah Foto KTP, KK, & Usaha',
        actionText: '📎 Kursor menekan kotak "Unggah Berkas" untuk upload foto dokumen',
        targetLabel: 'Kotak Lampiran Foto Berkas',
        zoomTarget: 'upload_area',
        screenDescription: 'Lampiran Berkas > Foto e-KTP, KK & Foto Usaha',
        voiceScript: 'Langkah keempat, kursor mengklik area unggah berkas. Lampirkan foto e-KTP asli, Kartu Keluarga, dan foto tempat usaha Anda di Desa Jombe dengan pencahayaan terang.',
        mascotTip: 'Pastikan foto dokumen tidak buram agar operator dapat langsung memverifikasi berkas Anda.',
      },
      {
        stepNumber: 5,
        title: 'Tekan Tombol Kirim Permohonan',
        actionText: '🚀 Kursor menekan tombol hijau "Kirim Permohonan"',
        targetLabel: 'Tombol Hijau "Kirim Permohonan"',
        zoomTarget: 'btn_submit',
        screenDescription: 'Akhir Formulir > Tombol Kirim Permohonan',
        voiceScript: 'Langkah kelima, perhatikan kursor menekan tombol hijau Kirim Permohonan. Anda akan menerima Nomor Registrasi berawalan JMB untuk memantau status surat Anda.',
        mascotTip: 'Simpan nomor registrasi JMB Anda untuk melacak posisi antrean surat.',
      },
      {
        stepNumber: 6,
        title: 'Cetak & Tanda Tangan Basah Kepala Desa',
        actionText: '🏛️ Surat dicetak fisik & dibubuhi Tanda Tangan Basah Kades JUSMAEDY, S.Pd',
        targetLabel: 'Lembar Resmi Ber-TTD Basah & Stempel',
        zoomTarget: 'ttd_area',
        screenDescription: 'Verifikasi Kantor Desa > Tanda Tangan Basah & Stempel',
        voiceScript: 'Langkah terakhir, operator mencetak surat berkop resmi Pemkab Jeneponto. Surat fisik ditandatangani basah oleh Kepala Desa Jombe, Bapak JUSMAEDY, S.Pd, dan dibubuhi cap stempel kantor desa.',
        mascotTip: 'Surat resmi sah setelah ditandatangani basah oleh Kepala Desa dan distempel cap basah.',
      },
    ],
  },
  lacak: {
    id: 'lacak',
    title: 'Panduan Melacak Status Permohonan Surat',
    subtitle: 'Lihat simulasi kursor mencari nomor registrasi dan memeriksa status surat',
    steps: [
      {
        stepNumber: 1,
        title: 'Buka Halaman Lacak Surat',
        actionText: '👆 Kursor menekan menu "Lacak Permohonan" di navigasi atas',
        targetLabel: 'Menu "Lacak Permohonan"',
        zoomTarget: 'nav_layanan',
        screenDescription: 'Navigasi Atas > Menu Lacak Surat (/lacak)',
        voiceScript: 'Tabe\' warga Desa Jombe! Untuk memantau status surat tanpa perlu ke kantor desa, langkah pertama kursor mengklik menu Lacak Permohonan.',
        mascotTip: 'Fitur lacak surat terbuka 24 jam untuk transparansi penuh.',
      },
      {
        stepNumber: 2,
        title: 'Ketik Nomor Registrasi / NIK',
        actionText: '✍️ Kursor menzoom kolom pencarian dan mengetik nomor JMB-2026-00001',
        targetLabel: 'Kolom Input Nomor Registrasi / NIK',
        zoomTarget: 'search_lacak',
        screenDescription: 'Pencarian Lacak > Kolom Input Registrasi',
        voiceScript: 'Langkah kedua, kursor menzoom ke kolom pencarian. Masukkan nomor registrasi JMB Anda, atau cukup masukkan 16 digit NIK Anda.',
        mascotTip: 'Lupa nomor registrasi? Cukup masukkan 16 digit NIK e-KTP Anda.',
      },
      {
        stepNumber: 3,
        title: 'Tekan Tombol "Cari Status"',
        actionText: '🔍 Kursor menekan tombol biru "Cari Status"',
        targetLabel: 'Tombol "Cari Status"',
        zoomTarget: 'search_lacak',
        screenDescription: 'Pencarian Lacak > Tombol Eksekusi Cari',
        voiceScript: 'Langkah ketiga, kursor menekan tombol biru Cari Status untuk memunculkan riwayat berkas.',
        mascotTip: 'Tekan tombol Cari Status untuk melihat timeline permohonan.',
      },
      {
        stepNumber: 4,
        title: 'Periksa Status & Pengambilan Berkas',
        actionText: '📋 Kursor menzoom kartu status: "DISETUJUI / SELESAI"',
        targetLabel: 'Kartu Status Permohonan',
        zoomTarget: 'result_lacak',
        screenDescription: 'Hasil Lacak > Status Disetujui & Catatan Pengambilan',
        voiceScript: 'Langkah keempat, lihat statusnya. Jika sudah Disetujui, berkas fisik telah ditandatangani basah Kepala Desa dan siap diambil di kantor desa.',
        mascotTip: 'Jika ada catatan perbaikan, segera perbaiki foto dokumen sesuai instruksi operator.',
      },
    ],
  },
  pengaduan: {
    id: 'pengaduan',
    title: 'Panduan Layanan Pengaduan Warga',
    subtitle: 'Simulasi kursor melaporkan jalan rusak, lampu jalan, dan fasilitas desa',
    steps: [
      {
        stepNumber: 1,
        title: 'Buka Menu Pengaduan',
        actionText: '👆 Kursor menekan menu "Pengaduan" di bagian atas',
        targetLabel: 'Menu Navigasi "Pengaduan"',
        zoomTarget: 'nav_layanan',
        screenDescription: 'Navigasi Website > Menu Pengaduan Warga (/pengaduan)',
        voiceScript: 'Pemerintah Desa Jombe selalu siap mendengar aspirasi warga. Langkah pertama, kursor mengklik menu Pengaduan di bagian navigasi.',
        mascotTip: 'Sampaikan aspirasi Anda demi kemajuan pembangunan Desa Jombe.',
      },
      {
        stepNumber: 2,
        title: 'Pilih Kategori & Tulis Laporan',
        actionText: '✍️ Kursor menzoom form aduan dan mengetik lokasi serta masalah',
        targetLabel: 'Form Isian Pengaduan Warga',
        zoomTarget: 'form_aduan',
        screenDescription: 'Formulir Pengaduan > Kategori & Uraian Masalah',
        voiceScript: 'Langkah kedua, kursor menzoom ke formulir aduan. Pilih kategori seperti Infrastruktur atau Pertanian, lalu sebutkan nama dusun dan masalahnya secara jelas.',
        mascotTip: 'Tuliskan dusun lokasi kejadian agar petugas aparat desa dapat langsung meluncur.',
      },
      {
        stepNumber: 3,
        title: 'Unggah Foto Bukti & Kirim',
        actionText: '📸 Kursor menekan tombol "Unggah Foto Bukti" & "Kirim Laporan"',
        targetLabel: 'Tombol Kirim Pengaduan Warga',
        zoomTarget: 'btn_submit',
        screenDescription: 'Formulir Pengaduan > Bukti Foto & Tombol Kirim',
        voiceScript: 'Langkah ketiga, kursor mengunggah foto bukti fisik dan menekan tombol Kirim Pengaduan. Anda akan memperoleh nomor tiket PGD untuk memantau tindak lanjut aparat.',
        mascotTip: 'Simpan nomor tiket PGD Anda untuk memantau penyelesaian laporan.',
      },
    ],
  },
  login: {
    id: 'login',
    title: 'Panduan Masuk Akun Berbasis NIK',
    subtitle: 'Simulasi kursor masuk ke dashboard warga hanya dengan 16 digit NIK',
    steps: [
      {
        stepNumber: 1,
        title: 'Klik Tombol Masuk',
        actionText: '👆 Kursor menekan tombol "Masuk" di pojok kanan atas',
        targetLabel: 'Tombol "Masuk" Navigasi',
        zoomTarget: 'login_btn',
        screenDescription: 'Navigasi Atas > Tombol Masuk / Akun Warga',
        voiceScript: 'Untuk membuka dashboard warga, perhatikan kursor yang bergerak ke pojok kanan atas dan menekan tombol Masuk.',
        mascotTip: 'Tidak perlu password, sistem Lentera Desa menggunakan autentikasi NIK praktis.',
      },
      {
        stepNumber: 2,
        title: 'Ketik NIK & Buka Dashboard',
        actionText: '✍️ Kursor menzoom kolom NIK lalu menekan "Masuk Sekarang"',
        targetLabel: 'Kolom NIK & Tombol Masuk Sekarang',
        zoomTarget: 'input_nik',
        screenDescription: 'Halaman Login > Input NIK & Dashboard Warga',
        voiceScript: 'Langkah kedua, kursor menzoom ke kolom NIK, memasukkan 16 digit NIK Anda, dan menekan Masuk Sekarang. Anda langsung tiba di dashboard pribadi Anda!',
        mascotTip: 'Di dashboard, seluruh riwayat surat dan pengaduan Anda tersimpan aman.',
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

  // Motion cursor and zoom states
  // Phases: 'approaching' (gliding from far) -> 'zooming' (camera zooms in) -> 'clicking' (cursor presses, ripple, audio click) -> 'settled'
  const [animationPhase, setAnimationPhase] = useState<'approaching' | 'zooming' | 'clicking' | 'settled'>('approaching');
  const [cursorPosition, setCursorPosition] = useState<{ x: number; y: number }>({ x: 180, y: 160 });
  const [isClicked, setIsClicked] = useState<boolean>(false);

  const activeTutorial = TUTORIAL_DATA[selectedTutorialId] || TUTORIAL_DATA['sku'];
  const totalSteps = activeTutorial.steps.length;
  const currentStep = activeTutorial.steps[currentStepIndex] || activeTutorial.steps[0];

  // Realistic UI click sound using Web Audio API
  const playClickSound = () => {
    try {
      if (typeof window === 'undefined') return;
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;
      const ctx = new AudioContextClass();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(1200, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(180, ctx.currentTime + 0.04);

      gain.gain.setValueAtTime(0.25, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.04);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.05);
    } catch (e) {}
  };

  // High-tech zoom chime
  const playZoomChime = () => {
    try {
      if (typeof window === 'undefined') return;
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;
      const ctx = new AudioContextClass();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.08); // A5

      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.12);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.13);
    } catch (e) {}
  };

  // Natural Male Voice Over Engine
  const speakCurrentStep = (text: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window) || isMuted) {
      setIsSpeaking(false);
      return;
    }

    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);

      // Search specifically for Indonesian male voices
      const voices = window.speechSynthesis.getVoices();
      const idVoices = voices.filter(
        (v) => v.lang.toLowerCase().includes('id') || v.lang.toLowerCase().includes('in_id')
      );

      const maleIdVoice = idVoices.find((v) => {
        const n = v.name.toLowerCase();
        return n.includes('male') || n.includes('pria') || n.includes('ardi') || n.includes('idris') || n.includes('andika');
      });

      if (maleIdVoice) {
        utterance.voice = maleIdVoice;
      } else if (idVoices.length > 0) {
        utterance.voice = idVoices[0];
      } else {
        // Fallback male voice
        const fallbackMale = voices.find((v) => v.name.toLowerCase().includes('male') || v.name.toLowerCase().includes('david'));
        if (fallbackMale) utterance.voice = fallbackMale;
      }

      // Tune to natural, warm, polite male pitch & deliberate cadence
      utterance.pitch = 0.82; // Distinct natural male baritone
      utterance.rate = 0.94; // Calm, polite Indonesian pacing
      utterance.volume = 1.0;

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      window.speechSynthesis.speak(utterance);
    } catch (e) {
      setIsSpeaking(false);
    }
  };

  // Run cursor glide & zoom sequence when step changes
  useEffect(() => {
    if (!isOpen) return;

    // Reset cursor to far-away start position
    setAnimationPhase('approaching');
    setIsClicked(false);
    setCursorPosition({ x: 220, y: 180 }); // Far distance

    // Phase 1: Gliding towards target
    const t1 = setTimeout(() => {
      setCursorPosition({ x: 0, y: 0 }); // Reaches target
    }, 200);

    // Phase 2: Zoom camera in on target element
    const t2 = setTimeout(() => {
      setAnimationPhase('zooming');
      playZoomChime();
    }, 1200);

    // Phase 3: Click and ripple pulse
    const t3 = setTimeout(() => {
      setAnimationPhase('clicking');
      setIsClicked(true);
      playClickSound();
    }, 2100);

    // Phase 4: Settle in place
    const t4 = setTimeout(() => {
      setAnimationPhase('settled');
    }, 2700);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, [isOpen, selectedTutorialId, currentStepIndex]);

  // Voice over sync
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
      setIsPlaying(false);
    }
  };

  const handlePrevStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
    }
  };

  const handleReplay = () => {
    // Replay animation & speech
    setAnimationPhase('approaching');
    setIsClicked(false);
    setCursorPosition({ x: 220, y: 180 });

    setTimeout(() => setCursorPosition({ x: 0, y: 0 }), 150);
    setTimeout(() => {
      setAnimationPhase('zooming');
      playZoomChime();
    }, 1100);
    setTimeout(() => {
      setAnimationPhase('clicking');
      setIsClicked(true);
      playClickSound();
    }, 2000);
    setTimeout(() => setAnimationPhase('settled'), 2600);

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl bg-slate-900 rounded-3xl shadow-2xl border border-slate-700 overflow-hidden flex flex-col max-h-[94vh]">
        {/* Top Header Bar */}
        <div className="bg-gradient-to-r from-emerald-900 via-emerald-850 to-teal-950 text-white px-4 sm:px-6 py-3.5 flex items-center justify-between shadow-md border-b border-emerald-700/60">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-amber-400 text-emerald-950 flex items-center justify-center font-black shadow-md">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xs sm:text-sm font-extrabold leading-tight text-white">
                  Video Tutorial Interaktif & Kursor Animasi
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-amber-400 text-emerald-950 uppercase tracking-wider">
                  Suara Pria & Maskot Berdiri
                </span>
              </div>
              <p className="text-[10.5px] text-emerald-200">
                Dilengkapi kursor meluncur, zoom otomatis ke tombol, suara Daeng Jombe & maskot berdiri
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

        {/* Tutorial Selector Tabs */}
        <div className="bg-emerald-950 border-b border-emerald-800/80 px-4 py-2 flex items-center gap-2 overflow-x-auto scrollbar-none">
          <span className="text-[11px] font-bold text-emerald-300 shrink-0">Pilih Topik:</span>
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

        {/* Main Body: Video Player on Left (7 cols) + Full Standing Mascot on Right (5 cols) */}
        <div className="flex-1 overflow-y-auto grid grid-cols-1 lg:grid-cols-12 bg-slate-950">
          {/* Video Player Canvas (7-8 cols) */}
          <div className="lg:col-span-8 p-3 sm:p-5 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-slate-800">
            {/* Simulated Browser Frame with Zoom Effect */}
            <div className="relative w-full rounded-2xl overflow-hidden border-2 border-slate-700 bg-slate-900 shadow-2xl flex flex-col h-[340px] sm:h-[380px]">
              {/* Browser Header Bar */}
              <div className="bg-slate-800 px-3.5 py-2 border-b border-slate-700 flex items-center justify-between z-20">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                </div>
                <div className="px-3 py-1 rounded-lg bg-slate-900 text-[10px] text-slate-300 font-mono border border-slate-700 flex items-center gap-1.5">
                  <span className="text-emerald-400 font-bold">https://</span>
                  <span>lenteradesajombe.biz.id{selectedTutorialId === 'lacak' ? '/lacak' : selectedTutorialId === 'pengaduan' ? '/pengaduan' : selectedTutorialId === 'login' ? '/login' : '/layanan'}</span>
                </div>
                <div className="flex items-center gap-2">
                  {animationPhase === 'zooming' || animationPhase === 'clicking' ? (
                    <span className="px-2 py-0.5 rounded text-[9px] font-black bg-amber-400 text-slate-950 flex items-center gap-1 animate-pulse">
                      <ZoomIn className="w-3 h-3" /> ZOOM FOCUS
                    </span>
                  ) : (
                    <span className="text-[9px] text-emerald-400 font-bold flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                      SIMULASI AKTIF
                    </span>
                  )}
                </div>
              </div>

              {/* Dynamic Zoomable Canvas Area */}
              <div className="relative flex-1 bg-gradient-to-br from-slate-900 via-slate-850 to-emerald-950/30 overflow-hidden flex items-center justify-center p-4">
                {/* Target Container with Dynamic Zoom Camera Scale */}
                <div
                  className={`w-full max-w-md transition-all duration-700 ease-out transform ${
                    animationPhase === 'zooming' || animationPhase === 'clicking'
                      ? 'scale-125 sm:scale-135 shadow-2xl ring-4 ring-amber-400/40 rounded-2xl'
                      : 'scale-100'
                  }`}
                >
                  {/* Step 1: Navigasi Layanan */}
                  {currentStep.zoomTarget === 'nav_layanan' && (
                    <div className="p-3.5 bg-slate-800/95 rounded-2xl border border-slate-700 shadow-xl text-left space-y-2.5">
                      <div className="text-[10px] font-bold text-slate-400">Navigasi Lentera Desa Jombe:</div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="px-2.5 py-1 bg-slate-700/60 rounded-lg text-[10px] text-slate-400">Beranda</span>
                        {/* Target Button */}
                        <div className="relative">
                          <button
                            className={`px-3.5 py-1.5 rounded-xl font-black text-xs transition-all flex items-center gap-1 ${
                              isClicked
                                ? 'bg-amber-400 text-emerald-950 scale-95 ring-4 ring-amber-300 shadow-lg'
                                : 'bg-emerald-600 text-white shadow-md'
                            }`}
                          >
                            <span>Layanan Surat</span>
                            <span>▾</span>
                          </button>
                          {/* Animated Ripple Shockwave on Click */}
                          {isClicked && (
                            <span className="absolute inset-0 rounded-xl bg-amber-400/80 animate-ping pointer-events-none" />
                          )}
                        </div>
                        <span className="px-2.5 py-1 bg-slate-700/60 rounded-lg text-[10px] text-slate-400">Lacak</span>
                        <span className="px-2.5 py-1 bg-slate-700/60 rounded-lg text-[10px] text-slate-400">Pengaduan</span>
                      </div>
                    </div>
                  )}

                  {/* Step 2: Kartu SKU */}
                  {currentStep.zoomTarget === 'card_sku' && (
                    <div className="p-4 bg-slate-800/95 rounded-2xl border-2 border-emerald-500 shadow-2xl text-left space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-white">Surat Keterangan Usaha (SKU)</span>
                        <span className="px-2 py-0.5 bg-emerald-500 text-slate-950 font-black rounded-md text-[9px]">
                          1 Hari Kerja
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-300">
                        Untuk legalitas usaha dagang/warung, syarat pengajuan KUR bank & bantuan UMKM.
                      </p>
                      <div className="pt-2 flex justify-end">
                        <button
                          className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${
                            isClicked
                              ? 'bg-amber-400 text-emerald-950 ring-4 ring-amber-300 scale-95 shadow-lg'
                              : 'bg-emerald-600 text-white shadow-md'
                          }`}
                        >
                          Pilih Layanan Ini ➔
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Step 3: Kolom NIK */}
                  {currentStep.zoomTarget === 'input_nik' && (
                    <div className="p-4 bg-slate-800/95 rounded-2xl border border-slate-700 shadow-2xl text-left space-y-2.5">
                      <div className="text-xs font-bold text-white">Masukkan Data e-KTP Pemohon:</div>
                      <div>
                        <label className="text-[10px] text-slate-400 block mb-1">16 Digit NIK e-KTP</label>
                        <div className="relative">
                          <input
                            readOnly
                            value="7304051208990001"
                            className={`w-full px-3 py-2 bg-slate-900 border-2 rounded-xl text-xs font-mono font-bold text-white transition-all ${
                              isClicked ? 'border-amber-400 ring-4 ring-amber-400/40 bg-slate-850' : 'border-emerald-500'
                            }`}
                          />
                          {isClicked && (
                            <span className="absolute right-2.5 top-2.5 px-1.5 py-0.5 rounded bg-emerald-500 text-slate-950 text-[9px] font-black">
                              TERVALIDASI ✓
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Step 4: Upload Foto */}
                  {currentStep.zoomTarget === 'upload_area' && (
                    <div className="p-3.5 bg-slate-800/95 rounded-2xl border border-slate-700 shadow-2xl text-left space-y-2">
                      <div className="text-xs font-bold text-white">Lampiran Foto Dokumen:</div>
                      <div className="grid grid-cols-2 gap-2">
                        <div
                          className={`p-3 rounded-xl border-2 border-dashed text-center transition-all ${
                            isClicked ? 'border-amber-400 bg-amber-400/10' : 'border-emerald-500 bg-emerald-950/20'
                          }`}
                        >
                          <div className="text-[10px] font-black text-white">Foto KTP Asli</div>
                          <span className="text-[8px] text-emerald-400 font-bold">Terunggah ✓</span>
                        </div>
                        <div className="p-3 rounded-xl border-2 border-dashed border-emerald-500/70 bg-emerald-950/20 text-center">
                          <div className="text-[10px] font-black text-white">Kartu Keluarga</div>
                          <span className="text-[8px] text-emerald-400 font-bold">Terunggah ✓</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Step 5: Tombol Kirim */}
                  {currentStep.zoomTarget === 'btn_submit' && (
                    <div className="p-4 bg-slate-800/95 rounded-2xl border border-slate-700 shadow-2xl text-center space-y-2.5">
                      <div className="text-xs font-bold text-slate-300">Konfirmasi Kelengkapan Berkas:</div>
                      <button
                        className={`w-full py-2.5 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 shadow-xl ${
                          isClicked
                            ? 'bg-amber-400 text-emerald-950 ring-4 ring-amber-300 scale-95'
                            : 'bg-emerald-600 text-white'
                        }`}
                      >
                        <span>🚀 Kirim Permohonan Sekarang</span>
                      </button>
                      {isClicked && (
                        <div className="text-[10px] font-bold text-emerald-400">
                          Berhasil Dikirim! No. Reg: JMB-2026-00001
                        </div>
                      )}
                    </div>
                  )}

                  {/* Step 6: TTD Basah */}
                  {currentStep.zoomTarget === 'ttd_area' && (
                    <div className="p-4 bg-white text-slate-900 rounded-2xl border-2 border-amber-400 shadow-2xl text-left space-y-2 font-serif">
                      <div className="text-center font-bold text-[11px] border-b border-slate-300 pb-1">
                        PEMERINTAH KABUPATEN JENEPONTO<br />KANTOR DESA JOMBE
                      </div>
                      <div className="pt-2 flex justify-end">
                        <div className="text-center">
                          <div className="text-[8.5px]">Kepala Desa Jombe,</div>
                          <div className="font-bold text-[10px] text-blue-900 underline mt-3">JUSMAEDY, S.Pd</div>
                          <div className="text-[7.5px] text-slate-600">(Tanda Tangan Basah & Cap Stempel)</div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Lacak Search */}
                  {currentStep.zoomTarget === 'search_lacak' && (
                    <div className="p-4 bg-slate-800/95 rounded-2xl border border-slate-700 shadow-2xl text-left space-y-2">
                      <div className="text-xs font-bold text-white">Lacak Berkas Surat:</div>
                      <div className="flex gap-2">
                        <input readOnly value="JMB-2026-00001" className="flex-1 px-3 py-1.5 bg-slate-900 border-2 border-emerald-500 rounded-xl text-xs font-mono text-white" />
                        <button
                          className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
                            isClicked ? 'bg-amber-400 text-slate-950 ring-4 ring-amber-300' : 'bg-emerald-600 text-white'
                          }`}
                        >
                          Cari
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Lacak Result */}
                  {currentStep.zoomTarget === 'result_lacak' && (
                    <div className="p-4 bg-slate-800/95 rounded-2xl border-2 border-emerald-500 shadow-2xl text-left space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-white">Status Permohonan</span>
                        <span className="px-2.5 py-0.5 rounded bg-emerald-500 text-slate-950 font-black text-[10px]">
                          DISETUJUI / SELESAI
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-300">
                        Surat fisik telah dicetak & ditandatangani basah oleh Kades JUSMAEDY, S.Pd. Siap diambil di kantor desa.
                      </p>
                    </div>
                  )}

                  {/* Form Aduan */}
                  {currentStep.zoomTarget === 'form_aduan' && (
                    <div className="p-3.5 bg-slate-800/95 rounded-2xl border border-slate-700 shadow-2xl text-left space-y-2">
                      <div className="text-xs font-bold text-white">Aspirasi & Pengaduan Warga</div>
                      <input readOnly value="Jalan berlubang di Dusun Jombe Selatan" className="w-full px-2.5 py-1 bg-slate-900 border border-slate-700 rounded text-xs text-white" />
                    </div>
                  )}

                  {/* Login Btn */}
                  {currentStep.zoomTarget === 'login_btn' && (
                    <div className="p-4 bg-slate-800/95 rounded-2xl border border-slate-700 shadow-2xl text-center space-y-2">
                      <button
                        className={`px-5 py-2.5 rounded-xl text-xs font-black transition-all ${
                          isClicked ? 'bg-amber-400 text-slate-950 ring-4 ring-amber-300 scale-95' : 'bg-emerald-600 text-white'
                        }`}
                      >
                        Masuk ke Dashboard Warga
                      </button>
                    </div>
                  )}
                </div>

                {/* Animated Flying Cursor Arrow (Menekan dari jauh kemudian zoom) */}
                <div
                  className="absolute pointer-events-none z-30 transition-all duration-700 ease-out"
                  style={{
                    transform: `translate(${cursorPosition.x}px, ${cursorPosition.y}px)`,
                  }}
                >
                  <div className="relative">
                    {/* Realistic Cursor Arrow SVG */}
                    <svg
                      className={`w-7 h-7 filter drop-shadow-2xl transition-transform ${
                        isClicked ? 'scale-75 translate-x-1 translate-y-1' : 'scale-100'
                      }`}
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M3 3L10.07 19.97L12.58 12.58L19.97 10.07L3 3Z"
                        fill="#F59E0B"
                        stroke="#78350F"
                        strokeWidth="2"
                        strokeLinejoin="round"
                      />
                    </svg>

                    {/* Touch Ripple Ring when Clicking */}
                    {isClicked && (
                      <span className="absolute -top-3 -left-3 w-10 h-10 rounded-full border-4 border-amber-400 animate-ping" />
                    )}

                    {/* Floating Label on Cursor */}
                    <span className="absolute left-6 top-4 whitespace-nowrap px-2 py-0.5 rounded-md bg-amber-400 text-emerald-950 font-black text-[9px] shadow-lg border border-amber-300">
                      KLIK!
                    </span>
                  </div>
                </div>

                {/* Bottom Callout: Apa yang ditekan */}
                <div className="absolute bottom-3 inset-x-3 sm:inset-x-6 p-2 rounded-xl bg-amber-400 text-emerald-950 font-black text-[11px] shadow-xl flex items-center justify-center gap-2 border-2 border-amber-300 z-20">
                  <MousePointerClick className="w-4 h-4 text-emerald-950 shrink-0" />
                  <span className="truncate">{currentStep.actionText}</span>
                </div>
              </div>
            </div>

            {/* Video Controls Bar */}
            <div className="mt-3 p-3 rounded-2xl bg-slate-900 border border-slate-800 flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className={`px-3 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 text-xs ${
                    isPlaying
                      ? 'bg-amber-400 text-emerald-950 shadow-md hover:bg-amber-300'
                      : 'bg-emerald-700 text-white hover:bg-emerald-600'
                  }`}
                  title={isPlaying ? 'Jeda Video' : 'Putar Video'}
                >
                  {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                  <span>{isPlaying ? 'Jeda' : 'Putar'}</span>
                </button>

                <button
                  onClick={toggleMute}
                  className={`px-2.5 py-1.5 rounded-xl border text-xs font-bold transition-colors flex items-center gap-1.5 ${
                    !isMuted
                      ? 'bg-emerald-900/60 text-emerald-300 border-emerald-700 hover:bg-emerald-800'
                      : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
                  }`}
                  title={isMuted ? 'Nyalakan Suara Voice Over Pria' : 'Matikan Suara'}
                >
                  {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 text-emerald-400" />}
                  <span>{isMuted ? 'Mute' : 'Suara Pria'}</span>
                </button>

                <button
                  onClick={handleReplay}
                  className="px-2.5 py-1.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white border border-slate-700 text-xs transition-colors flex items-center gap-1"
                  title="Ulangi Animasi & Suara"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Ulangi</span>
                </button>
              </div>

              {/* Step counter */}
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

          {/* Right Column: Full Standing Mascot "Daeng Jombe" (4-5 cols) */}
          <div className="lg:col-span-4 p-4 sm:p-5 flex flex-col justify-between bg-gradient-to-b from-emerald-950 via-slate-900 to-emerald-950 border-t lg:border-t-0 text-white relative">
            {/* Mascot Identity Badge */}
            <div>
              <div className="flex items-center justify-between pb-2 mb-3 border-b border-emerald-800/80">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-xs font-black text-white">Daeng Jombe (Maskot Resmi)</span>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-amber-400 text-emerald-950">
                  Pemandu Suara Pria
                </span>
              </div>

              {/* Live Speech Bubble anchored above character */}
              <div className="relative p-3.5 rounded-2xl bg-white text-slate-900 shadow-2xl border-2 border-emerald-400 mb-3 space-y-1.5">
                <div className="flex items-center justify-between border-b border-slate-100 pb-1">
                  <span className="text-[10px] font-extrabold text-emerald-900 uppercase tracking-wide flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-amber-500" />
                    Penjelasan Daeng Jombe:
                  </span>
                  {isSpeaking && (
                    <span className="flex items-center gap-1 text-[9px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-ping" />
                      Sedang Bersuara...
                    </span>
                  )}
                </div>

                <p className="text-[11.5px] leading-relaxed text-slate-800 font-semibold">
                  "{currentStep.voiceScript}"
                </p>

                <div className="pt-1 text-[10px] text-amber-900 bg-amber-50 rounded-lg p-1.5 border border-amber-200 flex items-start gap-1">
                  <span>💡</span>
                  <span>{currentStep.mascotTip}</span>
                </div>
              </div>

              {/* Full Standing Mascot Stage (Wujud Berdiri & Berbicara) */}
              <div className="relative w-full h-[250px] sm:h-[280px] rounded-2xl overflow-hidden bg-gradient-to-t from-emerald-900/60 to-transparent flex items-end justify-center border border-emerald-700/40 shadow-inner group">
                {/* Full standing mascot image */}
                <div className="relative w-[210px] h-[260px] sm:h-[275px] transition-transform duration-300 group-hover:scale-105">
                  <Image
                    src="/images/mascot-desa-jombe.png"
                    alt="Daeng Jombe - Wujud Berdiri Maskot Desa"
                    fill
                    className="object-contain object-bottom drop-shadow-2xl"
                    priority
                  />
                </div>

                {/* Animated sound wave bars when mascot is speaking */}
                {isSpeaking && (
                  <div className="absolute top-3 right-3 px-2.5 py-1 rounded-xl bg-emerald-950/90 border border-emerald-400 text-[9px] font-black text-emerald-300 flex items-center gap-1 shadow-lg">
                    <span className="w-1 h-3 bg-emerald-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                    <span className="w-1 h-4 bg-amber-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                    <span className="w-1 h-2 bg-emerald-400 rounded-full animate-bounce" />
                    <span className="ml-1">SUARA MASKOT</span>
                  </div>
                )}

                {/* Pedestal Shadow */}
                <div className="absolute bottom-1 w-36 h-3 bg-black/40 rounded-full blur-xs" />
              </div>
            </div>

            {/* Bottom Footer Info */}
            <div className="pt-2 border-t border-emerald-900/60 flex items-center justify-between mt-2">
              <div className="text-[10px] text-emerald-300 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                <span>Pelayanan Ramah & 100% Gratis</span>
              </div>
              <button
                onClick={handleClose}
                className="px-3 py-1.5 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-bold transition-colors shadow-md"
              >
                Selesai
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
