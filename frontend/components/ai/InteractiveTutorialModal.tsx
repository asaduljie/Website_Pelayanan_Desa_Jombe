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
  MousePointerClick,
  CheckCircle2,
  FileText,
  Search,
  MessageSquare,
  ShieldCheck,
  UserCheck,
  ZoomIn,
  Compass,
  FileCheck,
  Lock,
} from 'lucide-react';

export interface TutorialStep {
  stepNumber: number;
  title: string;
  actionText: string;
  zoomTarget: 'nav_layanan' | 'card_sku' | 'input_nik' | 'upload_area' | 'btn_submit' | 'ttd_area' | 'nav_lacak' | 'search_lacak' | 'result_lacak' | 'nav_pengaduan' | 'form_aduan' | 'btn_aduan' | 'nav_login' | 'form_login';
  voiceScript: string;
  explanation: string;
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
    title: 'Tutorial Pengajuan Surat Keterangan Usaha (SKU)',
    subtitle: 'Panduan video langkah demi langkah mengajukan surat usaha di website Lentera Desa',
    steps: [
      {
        stepNumber: 1,
        title: 'Klik Menu "Layanan" di Navigasi Atas',
        actionText: 'Kursor bergerak menuju menu "Layanan" pada navigasi atas dan menekannya',
        zoomTarget: 'nav_layanan',
        voiceScript: 'Selamat datang di website Lentera Desa Jombe. Langkah pertama, perhatikan kursor yang bergerak menuju menu Layanan di navigasi atas. Silakan klik menu Layanan.',
        explanation: 'Menu "Layanan" membuka seluruh katalog 9 surat keterangan administrasi desa.',
      },
      {
        stepNumber: 2,
        title: 'Pilih Kartu "Surat Keterangan Usaha (SKU)"',
        actionText: 'Kursor menzoom dan mengklik kartu layanan "Surat Keterangan Usaha (SKU)"',
        zoomTarget: 'card_sku',
        voiceScript: 'Langkah kedua, kamera menzoom kartu Surat Keterangan Usaha atau SKU. Tekan tombol Ajukan Surat pada kartu ini. Layanan ini 100% gratis.',
        explanation: 'Pilih kartu SKU untuk membuka formulir permohonan legalitas usaha dagang/kios/toko.',
      },
      {
        stepNumber: 3,
        title: 'Masukkan 16 Digit NIK e-KTP Pemohon',
        actionText: 'Kursor menzoom kolom NIK lalu mengetik 16 Digit NIK pemohon',
        zoomTarget: 'input_nik',
        voiceScript: 'Langkah ketiga, kursor menzoom ke kolom NIK. Masukkan enam belas digit NIK e-KTP Anda dengan benar. Data nama dan dusun Anda akan terisi secara otomatis.',
        explanation: 'Cukup masukkan 16 digit NIK e-KTP yang valid bagi warga Desa Jombe.',
      },
      {
        stepNumber: 4,
        title: 'Unggah Foto KTP, KK, & Bukti Usaha',
        actionText: 'Kursor menekan tombol pilih berkas untuk mengunggah foto KTP, KK, dan usaha',
        zoomTarget: 'upload_area',
        voiceScript: 'Langkah keempat, kursor menekan area unggah berkas. Lampirkan foto e-KTP asli, Kartu Keluarga, dan foto tempat usaha Anda dengan jelas dan tidak buram.',
        explanation: 'Unggah foto dokumen asli dengan kamera ponsel untuk memudahkan verifikasi operator.',
      },
      {
        stepNumber: 5,
        title: 'Tekan Tombol "Kirim Permohonan"',
        actionText: 'Kursor menekan tombol hijau "Kirim Permohonan Sekarang"',
        zoomTarget: 'btn_submit',
        voiceScript: 'Langkah kelima, perhatikan kursor menekan tombol hijau Kirim Permohonan. Anda akan menerima nomor registrasi berawalan JMB untuk memantau proses surat Anda.',
        explanation: 'Setelah dikirim, permohonan Anda langsung masuk antrean pemeriksaan operator kantor desa.',
      },
      {
        stepNumber: 6,
        title: 'Cetak Fisik & Tanda Tangan Basah Kepala Desa',
        actionText: 'Dokumen dicetak dan ditandatangani basah oleh Kepala Desa Jombe (JUSMAEDY, S.Pd)',
        zoomTarget: 'ttd_area',
        voiceScript: 'Langkah keenam, operator mencetak surat berkop resmi Pemerintah Kabupaten Jeneponto. Surat fisik ditandatangani basah oleh Kepala Desa Jombe, Bapak Jusmaedy, serta dibubuhi cap stempel kantor desa. Surat sah siap Anda ambil di kantor desa.',
        explanation: 'Surat resmi berkekuatan hukum penuh setelah ditandatangani basah dan distempel kantor desa.',
      },
    ],
  },
  lacak: {
    id: 'lacak',
    title: 'Tutorial Melacak Status Permohonan Surat',
    subtitle: 'Panduan memantau proses berkas surat Anda secara transparan dari rumah',
    steps: [
      {
        stepNumber: 1,
        title: 'Klik Menu "Lacak Surat" di Navigasi',
        actionText: 'Kursor mengarah dan menekan menu "Lacak Surat" di navigasi atas',
        zoomTarget: 'nav_lacak',
        voiceScript: 'Untuk mengecek status surat Anda, langkah pertama perhatikan kursor yang mengklik menu Lacak Surat di navigasi atas website.',
        explanation: 'Halaman Lacak Surat (/lacak) dapat diakses 24 jam nonstop setiap hari.',
      },
      {
        stepNumber: 2,
        title: 'Masukkan Nomor Registrasi / NIK Anda',
        actionText: 'Kursor menzoom kolom pencarian dan mengetikkan nomor registrasi JMB',
        zoomTarget: 'search_lacak',
        voiceScript: 'Langkah kedua, kursor menzoom ke kolom pencarian. Masukkan nomor registrasi surat Anda, misalnya JMB-2026-00001, atau cukup masukkan enam belas digit NIK e-KTP Anda.',
        explanation: 'Jika lupa nomor registrasi, Anda dapat langsung mengetikkan 16 digit NIK e-KTP.',
      },
      {
        stepNumber: 3,
        title: 'Periksa Status Surat (Disetujui & Siap Ambil)',
        actionText: 'Kursor menzoom kartu status: "DISETUJUI / SELESAI"',
        zoomTarget: 'result_lacak',
        voiceScript: 'Langkah ketiga, lihat hasil pelacakan. Jika status telah Disetujui, berkas fisik surat resmi telah ditandatangani basah oleh Kepala Desa dan siap diambil di kantor desa.',
        explanation: 'Status permohonan transparan: Menunggu Verifikasi, Sedang Diproses, hingga Selesai.',
      },
    ],
  },
  pengaduan: {
    id: 'pengaduan',
    title: 'Tutorial Layanan Pengaduan & Aspirasi Warga',
    subtitle: 'Panduan melaporkan jalan berlubang, lampu penerangan jalan, atau irigasi sawah',
    steps: [
      {
        stepNumber: 1,
        title: 'Klik Menu "Pengaduan" di Navigasi',
        actionText: 'Kursor menekan menu "Pengaduan" di bagian navigasi atas',
        zoomTarget: 'nav_pengaduan',
        voiceScript: 'Pemerintah Desa Jombe membuka ruang aspirasi bagi seluruh warga. Langkah pertama, perhatikan kursor mengklik menu Pengaduan pada navigasi atas.',
        explanation: 'Menu Pengaduan (/pengaduan) menampung seluruh aspirasi pembangunan dan pelayanan warga.',
      },
      {
        stepNumber: 2,
        title: 'Isi Kategori & Uraian Pengaduan',
        actionText: 'Kursor menzoom formulir dan mengetik nama dusun serta masalah kejadian',
        zoomTarget: 'form_aduan',
        voiceScript: 'Langkah kedua, kursor menzoom ke formulir aduan. Pilih kategori seperti Infrastruktur atau Pertanian, lalu tuliskan nama dusun dan permasalahan secara jelas.',
        explanation: 'Sebutkan nama dusun lokasi kejadian agar aparat desa dapat segera meninjau ke lapangan.',
      },
      {
        stepNumber: 3,
        title: 'Kirim Pengaduan & Catat Nomor Tiket',
        actionText: 'Kursor menekan tombol "Kirim Pengaduan" dan menerima Nomor Tiket PGD',
        zoomTarget: 'btn_aduan',
        voiceScript: 'Langkah ketiga, kursor menekan tombol Kirim Pengaduan. Anda akan memperoleh nomor tiket aduan berawalan PGD untuk memantau tindak lanjut aparat desa.',
        explanation: 'Nomor Tiket PGD-XXXXX dapat digunakan untuk memantau perkembangan penyelesaian laporan.',
      },
    ],
  },
  login: {
    id: 'login',
    title: 'Tutorial Masuk Akun Warga Berbasis NIK',
    subtitle: 'Panduan masuk ke dashboard warga tanpa perlu menghafal password rumit',
    steps: [
      {
        stepNumber: 1,
        title: 'Klik Tombol "Masuk" di Pojok Kanan Atas',
        actionText: 'Kursor bergerak ke pojok kanan atas dan menekan tombol hijau "Masuk"',
        zoomTarget: 'nav_login',
        voiceScript: 'Untuk membuka dashboard pribadi warga, langkah pertama perhatikan kursor bergerak ke pojok kanan atas dan menekan tombol Masuk.',
        explanation: 'Tombol Masuk selalu tersedia di bagian kanan atas seluruh halaman website.',
      },
      {
        stepNumber: 2,
        title: 'Masukkan 16 Digit NIK e-KTP Anda',
        actionText: 'Kursor menzoom kolom NIK dan menekan tombol "Masuk Sekarang"',
        zoomTarget: 'form_login',
        voiceScript: 'Langkah kedua, kursor menzoom ke kolom NIK, memasukkan enam belas digit NIK e-KTP Anda, lalu menekan Masuk Sekarang. Anda langsung tiba di dashboard pribadi Anda tanpa perlu password rumit.',
        explanation: 'Sistem Lentera Desa menggunakan autentikasi NIK praktis yang aman dan mudah.',
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
  const [animationPhase, setAnimationPhase] = useState<'approaching' | 'zooming' | 'clicking' | 'settled'>('approaching');
  const [cursorPosition, setCursorPosition] = useState<{ x: number; y: number }>({ x: 220, y: 160 });
  const [isClicked, setIsClicked] = useState<boolean>(false);

  const activeTutorial = TUTORIAL_DATA[selectedTutorialId] || TUTORIAL_DATA['sku'];
  const totalSteps = activeTutorial.steps.length;
  const currentStep = activeTutorial.steps[currentStepIndex] || activeTutorial.steps[0];

  // Authentic mouse click sound effect using Web Audio API
  const playClickSound = () => {
    try {
      if (typeof window === 'undefined') return;
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;
      const ctx = new AudioContextClass();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(1000, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(160, ctx.currentTime + 0.04);

      gain.gain.setValueAtTime(0.25, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.04);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.05);
    } catch (e) {}
  };

  // Pure Indonesian Voice Over Engine
  const speakIndonesian = (text: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window) || isMuted) {
      setIsSpeaking(false);
      return;
    }

    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);

      // Explicitly set language to Indonesian
      utterance.lang = 'id-ID';

      // Find authentic Indonesian voice
      const voices = window.speechSynthesis.getVoices();
      const idVoice = voices.find(
        (v) =>
          v.lang.toLowerCase() === 'id-id' ||
          v.lang.toLowerCase() === 'id_id' ||
          v.lang.toLowerCase().startsWith('id') ||
          v.name.toLowerCase().includes('indonesia') ||
          v.name.toLowerCase().includes('bahasa')
      );

      if (idVoice) {
        utterance.voice = idVoice;
      }

      // Natural, clear, polite Indonesian cadence
      utterance.rate = 0.94;
      utterance.pitch = 1.0;
      utterance.volume = 1.0;

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      window.speechSynthesis.speak(utterance);
    } catch (e) {
      setIsSpeaking(false);
    }
  };

  // Handle voices changing in browser
  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      const handleVoices = () => {
        window.speechSynthesis.getVoices();
      };
      window.speechSynthesis.onvoiceschanged = handleVoices;
      return () => {
        window.speechSynthesis.onvoiceschanged = null;
      };
    }
  }, []);

  // Run cursor glide & zoom sequence when step changes
  useEffect(() => {
    if (!isOpen) return;

    setAnimationPhase('approaching');
    setIsClicked(false);
    setCursorPosition({ x: 260, y: 190 });

    const t1 = setTimeout(() => {
      setCursorPosition({ x: 0, y: 0 });
    }, 180);

    const t2 = setTimeout(() => {
      setAnimationPhase('zooming');
    }, 1200);

    const t3 = setTimeout(() => {
      setAnimationPhase('clicking');
      setIsClicked(true);
      playClickSound();
    }, 2000);

    const t4 = setTimeout(() => {
      setAnimationPhase('settled');
    }, 2600);

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
        speakIndonesian(currentStep.voiceScript);
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
    setAnimationPhase('approaching');
    setIsClicked(false);
    setCursorPosition({ x: 260, y: 190 });

    setTimeout(() => setCursorPosition({ x: 0, y: 0 }), 150);
    setTimeout(() => setAnimationPhase('zooming'), 1100);
    setTimeout(() => {
      setAnimationPhase('clicking');
      setIsClicked(true);
      playClickSound();
    }, 1900);
    setTimeout(() => setAnimationPhase('settled'), 2500);

    speakIndonesian(currentStep.voiceScript);
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
      speakIndonesian(currentStep.voiceScript);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl bg-slate-900 rounded-3xl shadow-2xl border border-slate-700 overflow-hidden flex flex-col max-h-[95vh]">
        {/* Top Header */}
        <div className="bg-gradient-to-r from-emerald-900 via-emerald-850 to-teal-950 text-white px-5 py-3.5 flex items-center justify-between border-b border-emerald-700/60 shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white p-1 flex items-center justify-center shadow-md">
              <Image
                src="/logo_jeneponto.png"
                alt="Logo Jeneponto"
                width={30}
                height={30}
                className="object-contain"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-black tracking-tight text-white">
                  Video Tutorial Website Lentera Desa
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-amber-400 text-emerald-950 uppercase">
                  Voice Over Indonesia
                </span>
              </div>
              <p className="text-[10.5px] text-emerald-200">
                Simulasi kursor interaktif dan zoom otomatis sesuai tampilan asli website Desa Jombe
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

        {/* Tutorial Category Switcher */}
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
              <span>{tut.title.replace('Tutorial ', '')}</span>
            </button>
          ))}
        </div>

        {/* Video Screen Viewport (Identical to Actual Lentera Desa Website) */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-4 bg-slate-950 flex flex-col justify-between">
          <div className="relative w-full rounded-2xl overflow-hidden border-2 border-slate-700 bg-white shadow-2xl flex flex-col h-[380px] sm:h-[420px]">
            {/* Real Website Header (Matching Navbar.tsx 1:1) */}
            <div className="bg-white px-4 py-2.5 border-b border-slate-200 flex items-center justify-between z-20 shadow-xs">
              {/* Brand Logo & Identification */}
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 relative flex items-center justify-center">
                  <Image
                    src="/logo_jeneponto.png"
                    alt="Logo Jeneponto"
                    width={28}
                    height={28}
                    className="object-contain"
                  />
                </div>
                <div className="flex flex-col">
                  <div className="flex items-baseline gap-1">
                    <span className="text-sm font-black tracking-tight text-slate-900">
                      Lentera<span className="text-emerald-800">Desa</span>
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-[8.5px] uppercase font-bold tracking-wider text-emerald-800 leading-none">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span>Desa Jombe, Kec. Turatea, Kab. Jeneponto</span>
                  </div>
                </div>
              </div>

              {/* Navigation Items */}
              <div className="flex items-center gap-1 sm:gap-1.5 text-[11px] font-semibold">
                <span className="px-2.5 py-1 text-slate-600 rounded-lg hidden sm:inline">Beranda</span>
                <span className="px-2.5 py-1 text-slate-600 rounded-lg hidden md:inline">Profil Desa</span>

                {/* Nav Layanan Target */}
                <div className="relative">
                  <span
                    className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1 font-bold ${
                      currentStep.zoomTarget === 'nav_layanan'
                        ? isClicked
                          ? 'bg-amber-400 text-emerald-950 ring-4 ring-amber-300 shadow-md scale-95'
                          : 'bg-emerald-800 text-white ring-2 ring-emerald-600 shadow-sm'
                        : 'text-slate-600 hover:text-emerald-900 hover:bg-slate-50'
                    }`}
                  >
                    <span>Layanan Surat</span>
                  </span>
                  {currentStep.zoomTarget === 'nav_layanan' && isClicked && (
                    <span className="absolute inset-0 rounded-xl bg-amber-400/80 animate-ping pointer-events-none" />
                  )}
                </div>

                {/* Nav Lacak Target */}
                <div className="relative">
                  <span
                    className={`px-2.5 py-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1 ${
                      currentStep.zoomTarget === 'nav_lacak'
                        ? isClicked
                          ? 'bg-amber-400 text-emerald-950 font-bold ring-4 ring-amber-300 scale-95 shadow-md'
                          : 'bg-emerald-800 text-white font-bold ring-2 ring-emerald-600 shadow-sm'
                        : 'text-slate-600 hover:text-emerald-900 hover:bg-slate-50'
                    }`}
                  >
                    <span>Lacak Surat</span>
                  </span>
                  {currentStep.zoomTarget === 'nav_lacak' && isClicked && (
                    <span className="absolute inset-0 rounded-xl bg-amber-400/80 animate-ping pointer-events-none" />
                  )}
                </div>

                {/* Nav Pengaduan Target */}
                <div className="relative hidden sm:block">
                  <span
                    className={`px-2.5 py-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1 ${
                      currentStep.zoomTarget === 'nav_pengaduan'
                        ? isClicked
                          ? 'bg-amber-400 text-emerald-950 font-bold ring-4 ring-amber-300 scale-95 shadow-md'
                          : 'bg-emerald-800 text-white font-bold ring-2 ring-emerald-600 shadow-sm'
                        : 'text-slate-600 hover:text-emerald-900 hover:bg-slate-50'
                    }`}
                  >
                    <span>Pengaduan</span>
                  </span>
                  {currentStep.zoomTarget === 'nav_pengaduan' && isClicked && (
                    <span className="absolute inset-0 rounded-xl bg-amber-400/80 animate-ping pointer-events-none" />
                  )}
                </div>

                {/* Nav Login Target */}
                <div className="relative ml-1">
                  <span
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 shadow-xs ${
                      currentStep.zoomTarget === 'nav_login'
                        ? isClicked
                          ? 'bg-amber-400 text-emerald-950 ring-4 ring-amber-300 scale-95'
                          : 'bg-emerald-800 text-white ring-2 ring-emerald-600'
                        : 'bg-emerald-800 hover:bg-emerald-900 text-white'
                    }`}
                  >
                    <span>Masuk</span>
                  </span>
                  {currentStep.zoomTarget === 'nav_login' && isClicked && (
                    <span className="absolute inset-0 rounded-xl bg-amber-400/80 animate-ping pointer-events-none" />
                  )}
                </div>
              </div>
            </div>

            {/* Real Web Body with Zoom Camera Transform */}
            <div className="relative flex-1 bg-slate-50 overflow-hidden flex items-center justify-center p-3 sm:p-5">
              <div
                className={`w-full max-w-xl transition-all duration-700 ease-out transform ${
                  animationPhase === 'zooming' || animationPhase === 'clicking'
                    ? 'scale-125 sm:scale-135 shadow-2xl rounded-2xl'
                    : 'scale-100'
                }`}
              >
                {/* Step 1: Real Website Hero Banner */}
                {currentStep.zoomTarget === 'nav_layanan' && (
                  <div className="p-5 bg-gradient-to-br from-emerald-900 to-teal-950 text-white rounded-2xl shadow-xl text-center space-y-3">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold bg-emerald-700/60 text-emerald-200 border border-emerald-500/30">
                      Sistem Pelayanan Mandiri Desa Jombe
                    </span>
                    <h3 className="text-base sm:text-lg font-black leading-snug text-white">
                      Layanan Surat Administrasi Desa Jombe<br />Mudah, Cepat & 100% Bebas Pungli
                    </h3>
                    <div className="max-w-md mx-auto flex items-center gap-2 p-1.5 bg-white rounded-xl shadow-md">
                      <Search className="w-4 h-4 text-slate-400 ml-2" />
                      <input
                        readOnly
                        placeholder="Cari layanan surat keterangan..."
                        className="flex-1 text-xs text-slate-800 bg-transparent focus:outline-none"
                      />
                      <span className="px-3 py-1.5 bg-emerald-800 text-white text-[10px] font-bold rounded-lg">
                        Cari
                      </span>
                    </div>
                  </div>
                )}

                {/* Step 2: Real SKU Service Card */}
                {currentStep.zoomTarget === 'card_sku' && (
                  <div className="p-4 sm:p-5 bg-white rounded-2xl border-2 border-emerald-600 shadow-xl text-left space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center border border-emerald-200">
                          <FileText className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="text-xs sm:text-sm font-black text-slate-900">
                            Surat Keterangan Usaha (SKU)
                          </h4>
                          <span className="text-[10px] text-slate-500">Legalitas Usaha & Syarat KUR Bank</span>
                        </div>
                      </div>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-900 border border-emerald-300">
                        GRATIS
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 leading-relaxed">
                      Menerangkan secara sah bahwa warga menjalankan usaha mikro/warung di wilayah Desa Jombe.
                    </p>
                    <div className="pt-1 flex items-center justify-between border-t border-slate-100">
                      <span className="text-[10px] text-slate-500 font-medium">Estimasi: 1 Hari Kerja</span>
                      <button
                        className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${
                          isClicked
                            ? 'bg-amber-400 text-emerald-950 ring-4 ring-amber-300 scale-95 shadow-md'
                            : 'bg-emerald-800 hover:bg-emerald-900 text-white shadow-sm'
                        }`}
                      >
                        Ajukan Surat ➔
                      </button>
                    </div>
                  </div>
                )}

                {/* Step 3: Real Form Input NIK */}
                {currentStep.zoomTarget === 'input_nik' && (
                  <div className="p-4 sm:p-5 bg-white rounded-2xl border border-slate-200 shadow-xl text-left space-y-3">
                    <div className="border-b border-slate-100 pb-2 flex items-center justify-between">
                      <h4 className="text-xs sm:text-sm font-black text-slate-900">Formulir Permohonan SKU</h4>
                      <span className="text-[10px] font-bold text-emerald-800">Langkah 1 dari 2</span>
                    </div>
                    <div className="space-y-2">
                      <div>
                        <label className="text-[10px] font-bold text-slate-700 block mb-1">
                          Nomor Induk Kependudukan (NIK 16 Digit) <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <input
                            readOnly
                            value="7304051208990001"
                            className={`w-full px-3.5 py-2 rounded-xl text-xs font-mono font-bold text-slate-900 transition-all ${
                              isClicked
                                ? 'bg-amber-50 border-2 border-amber-400 ring-4 ring-amber-200'
                                : 'bg-slate-50 border border-slate-300'
                            }`}
                          />
                          {isClicked && (
                            <span className="absolute right-2.5 top-2 px-2 py-0.5 rounded-md bg-emerald-600 text-white text-[9px] font-black">
                              NIK TERVERIFIKASI ✓
                            </span>
                          )}
                        </div>
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-slate-700 block mb-1">Nama Pemohon</label>
                        <input readOnly value="Warga Desa Jombe (Dusun Jombe Selatan)" className="w-full px-3 py-1.5 bg-slate-100 border border-slate-200 rounded-xl text-xs text-slate-700" />
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 4: Real Upload Area */}
                {currentStep.zoomTarget === 'upload_area' && (
                  <div className="p-4 sm:p-5 bg-white rounded-2xl border border-slate-200 shadow-xl text-left space-y-3">
                    <h4 className="text-xs sm:text-sm font-black text-slate-900">Lampiran Foto Dokumen Asli</h4>
                    <div className="grid grid-cols-2 gap-3">
                      <div
                        className={`p-3.5 rounded-xl border-2 border-dashed text-center transition-all ${
                          isClicked ? 'border-amber-400 bg-amber-50/70' : 'border-emerald-500 bg-emerald-50/40'
                        }`}
                      >
                        <div className="text-[10.5px] font-black text-slate-900">Foto e-KTP Asli</div>
                        <span className="text-[9px] text-emerald-800 font-bold">ktp_pemohon.jpg (✓)</span>
                      </div>
                      <div className="p-3.5 rounded-xl border-2 border-dashed border-emerald-500 bg-emerald-50/40 text-center">
                        <div className="text-[10.5px] font-black text-slate-900">Kartu Keluarga (KK)</div>
                        <span className="text-[9px] text-emerald-800 font-bold">kartu_keluarga.jpg (✓)</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 5: Real Submit Button */}
                {currentStep.zoomTarget === 'btn_submit' && (
                  <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xl text-center space-y-3">
                    <div className="text-xs text-slate-600 flex items-center justify-center gap-1">
                      <Lock className="w-3.5 h-3.5 text-emerald-700" />
                      <span>Data kependudukan Anda aman & dilindungi Pemerintah Desa Jombe</span>
                    </div>
                    <button
                      className={`w-full py-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 shadow-lg ${
                        isClicked
                          ? 'bg-amber-400 text-emerald-950 ring-4 ring-amber-300 scale-95'
                          : 'bg-emerald-800 hover:bg-emerald-900 text-white'
                      }`}
                    >
                      <span>🚀 Kirim Permohonan Surat Sekarang</span>
                    </button>
                    {isClicked && (
                      <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-black text-emerald-900 animate-in fade-in">
                        Permohonan Berhasil! Nomor Registrasi: JMB-2026-00001
                      </div>
                    )}
                  </div>
                )}

                {/* Step 6: Real Physical Wet Signature Document */}
                {currentStep.zoomTarget === 'ttd_area' && (
                  <div className="p-4 sm:p-6 bg-white rounded-2xl border-2 border-amber-400 shadow-2xl text-left space-y-2 font-serif text-slate-900">
                    <div className="text-center font-bold text-[11px] border-b-2 border-slate-900 pb-1.5 leading-tight">
                      PEMERINTAH KABUPATEN JENEPONTO<br />
                      KECAMATAN TURATEA<br />
                      <span className="text-xs font-black">KANTOR KEPALA DESA JOMBE</span><br />
                      <span className="text-[8px] font-sans text-slate-600 font-normal">Alamat: Jalan Poros Dusun Jombe Selatan, Kode Pos 92351</span>
                    </div>
                    <div className="text-center py-1">
                      <div className="font-bold underline text-[11px]">SURAT KETERANGAN USAHA</div>
                      <div className="text-[8.5px] font-sans">Nomor: 510 / 042 / DJ / III / 2026</div>
                    </div>
                    <div className="text-[9.5px] font-sans text-slate-700 leading-normal">
                      Menerangkan bahwa pemohon adalah benar warga Desa Jombe yang memiliki usaha mikro di Dusun Jombe Selatan.
                    </div>
                    <div className="pt-2 flex justify-end">
                      <div className="text-center relative pr-4">
                        <div className="text-[8.5px] font-sans">Kepala Desa Jombe,</div>
                        {/* Blue Wet Signature Simulation */}
                        <div className="font-bold text-[11px] text-blue-900 underline mt-3 tracking-wide">
                          JUSMAEDY, S.Pd
                        </div>
                        <div className="text-[7.5px] font-sans text-slate-500">
                          (Ditandatangani Basah & Distempel Cap Kantor Desa)
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Lacak Search Real Form */}
                {currentStep.zoomTarget === 'search_lacak' && (
                  <div className="p-4 sm:p-5 bg-white rounded-2xl border border-slate-200 shadow-xl text-left space-y-3">
                    <h4 className="text-xs sm:text-sm font-black text-slate-900">Lacak Status Permohonan Surat</h4>
                    <div className="flex gap-2">
                      <input
                        readOnly
                        value="JMB-2026-00001"
                        className={`flex-1 px-3.5 py-2 rounded-xl text-xs font-mono font-bold transition-all ${
                          isClicked ? 'bg-amber-50 border-2 border-amber-400 ring-4 ring-amber-200' : 'bg-slate-50 border border-slate-300'
                        }`}
                      />
                      <button
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                          isClicked ? 'bg-amber-400 text-emerald-950 ring-4 ring-amber-300' : 'bg-emerald-800 text-white'
                        }`}
                      >
                        Lacak
                      </button>
                    </div>
                  </div>
                )}

                {/* Lacak Result Real Card */}
                {currentStep.zoomTarget === 'result_lacak' && (
                  <div className="p-4 sm:p-5 bg-white rounded-2xl border-2 border-emerald-600 shadow-xl text-left space-y-2.5">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                      <span className="text-xs font-black text-slate-900">No. Registrasi: JMB-2026-00001</span>
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 font-black text-[10px]">
                        DISETUJUI / SELESAI
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-600">
                      Surat Keterangan Usaha (SKU) telah selesai diverifikasi, dicetak, dan ditandatangani basah oleh Kepala Desa Jombe.
                    </div>
                    <div className="text-[10px] font-bold text-emerald-800 bg-emerald-50 p-2 rounded-lg">
                      📍 Silakan ambil berkas fisik di Kantor Desa Jombe pada jam kerja (08.00 - 15.00 WITA).
                    </div>
                  </div>
                )}

                {/* Real Pengaduan Form */}
                {currentStep.zoomTarget === 'form_aduan' && (
                  <div className="p-4 sm:p-5 bg-white rounded-2xl border border-slate-200 shadow-xl text-left space-y-2.5">
                    <h4 className="text-xs sm:text-sm font-black text-slate-900">Formulir Pengaduan & Aspirasi Warga</h4>
                    <div className="space-y-1.5">
                      <input readOnly value="Jalan berlubang di poros Dusun Jombe Selatan" className="w-full px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800 font-medium" />
                      <textarea readOnly rows={2} value="Mohon perbaikan jalan rusak sebelum musim hujan agar pengangkutan panen jagung lancar." className="w-full px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-xl text-[11px] text-slate-700" />
                    </div>
                  </div>
                )}

                {/* Real Pengaduan Submit */}
                {currentStep.zoomTarget === 'btn_aduan' && (
                  <div className="p-4 sm:p-5 bg-white rounded-2xl border border-slate-200 shadow-xl text-center space-y-2.5">
                    <button
                      className={`w-full py-2.5 rounded-xl text-xs font-black transition-all ${
                        isClicked ? 'bg-amber-400 text-emerald-950 ring-4 ring-amber-300 scale-95' : 'bg-emerald-800 text-white'
                      }`}
                    >
                      Kirim Laporan Pengaduan
                    </button>
                    {isClicked && (
                      <div className="text-xs font-black text-emerald-800">
                        Laporan Terkirim! Nomor Tiket: PGD-2026-00042
                      </div>
                    )}
                  </div>
                )}

                {/* Real Login Form */}
                {currentStep.zoomTarget === 'form_login' && (
                  <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xl text-left space-y-3">
                    <div className="text-center font-black text-slate-900 text-xs sm:text-sm">
                      Masuk ke Sistem Lentera Desa
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-700 block mb-1">16 Digit NIK e-KTP</label>
                      <input readOnly value="7304051208990001" className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono font-bold" />
                    </div>
                    <button
                      className={`w-full py-2.5 rounded-xl text-xs font-black transition-all ${
                        isClicked ? 'bg-amber-400 text-emerald-950 ring-4 ring-amber-300 scale-95' : 'bg-emerald-800 text-white'
                      }`}
                    >
                      Masuk Sekarang
                    </button>
                  </div>
                )}
              </div>

              {/* Animated Gliding Cursor Arrow */}
              <div
                className="absolute pointer-events-none z-30 transition-all duration-700 ease-out"
                style={{
                  transform: `translate(${cursorPosition.x}px, ${cursorPosition.y}px)`,
                }}
              >
                <div className="relative">
                  <svg
                    className={`w-7 h-7 filter drop-shadow-xl transition-transform ${
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
                  {isClicked && (
                    <span className="absolute -top-3 -left-3 w-10 h-10 rounded-full border-4 border-amber-400 animate-ping" />
                  )}
                  <span className="absolute left-6 top-4 whitespace-nowrap px-2 py-0.5 rounded-md bg-amber-400 text-emerald-950 font-black text-[9px] shadow-lg border border-amber-300">
                    KLIK
                  </span>
                </div>
              </div>

              {/* Bottom Action Callout Banner */}
              <div className="absolute bottom-3 inset-x-4 p-2.5 rounded-xl bg-amber-400 text-emerald-950 font-black text-xs shadow-xl flex items-center justify-center gap-2 border-2 border-amber-300 z-20">
                <MousePointerClick className="w-4 h-4 text-emerald-950 shrink-0" />
                <span className="truncate">{currentStep.actionText}</span>
              </div>
            </div>
          </div>

          {/* Subtitle & Narration Box (Indonesian Voice Over) */}
          <div className="mt-3 p-3.5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="flex h-2 w-2 relative">
                  {isSpeaking && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />}
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </span>
                <span className="text-xs font-extrabold text-emerald-300">
                  Narator Suara Bahasa Indonesia:
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={toggleMute}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors flex items-center gap-1 border ${
                    !isMuted
                      ? 'bg-emerald-900/80 text-emerald-300 border-emerald-700 hover:bg-emerald-800'
                      : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
                  }`}
                >
                  {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 text-emerald-400" />}
                  <span>{isMuted ? 'Mute' : 'Suara Aktif'}</span>
                </button>
                <button
                  onClick={handleReplay}
                  className="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 hover:text-white border border-slate-700 text-xs transition-colors flex items-center gap-1"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Ulangi</span>
                </button>
              </div>
            </div>

            {/* Subtitle Text */}
            <p className="text-xs sm:text-sm text-white font-medium leading-relaxed bg-slate-950/80 p-3 rounded-xl border border-slate-800">
              "{currentStep.voiceScript}"
            </p>
          </div>

          {/* Timeline & Playback Navigation Controls */}
          <div className="mt-3 p-3 rounded-2xl bg-slate-900 border border-slate-800 flex flex-wrap items-center justify-between gap-2.5">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className={`px-3.5 py-2 rounded-xl font-bold transition-all flex items-center gap-1.5 text-xs ${
                  isPlaying
                    ? 'bg-amber-400 text-emerald-950 shadow-md hover:bg-amber-300'
                    : 'bg-emerald-700 text-white hover:bg-emerald-600'
                }`}
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                <span>{isPlaying ? 'Jeda' : 'Putar Video'}</span>
              </button>

              <div className="text-xs font-bold text-slate-300 ml-2">
                Langkah <span className="text-amber-400">{currentStepIndex + 1}</span> dari {totalSteps}:{' '}
                <span className="text-white font-normal">{currentStep.title}</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handlePrevStep}
                disabled={currentStepIndex === 0}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-white text-xs border border-slate-700 flex items-center gap-1"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Sebelumnya</span>
              </button>

              <button
                onClick={handleNextStep}
                disabled={currentStepIndex === totalSteps - 1}
                className="px-3.5 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-600 disabled:opacity-40 text-white text-xs font-bold border border-emerald-600 flex items-center gap-1"
              >
                <span>Selanjutnya</span>
                <ChevronRight className="w-4 h-4" />
              </button>

              <button
                onClick={handleClose}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs border border-slate-700 ml-2"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
