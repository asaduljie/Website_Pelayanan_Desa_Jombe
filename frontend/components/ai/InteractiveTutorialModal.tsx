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
  FileText,
  Search,
  MessageSquare,
  UserCheck,
  Lock,
} from 'lucide-react';

export interface TutorialStep {
  stepNumber: number;
  title: string;
  zoomTarget: 'nav_layanan' | 'card_sku' | 'input_nik' | 'upload_area' | 'btn_submit' | 'ttd_area' | 'nav_lacak' | 'search_lacak' | 'result_lacak' | 'nav_pengaduan' | 'form_aduan' | 'btn_aduan' | 'nav_login' | 'form_login';
  voiceScript: string;
}

export interface TutorialConfig {
  id: string;
  title: string;
  steps: TutorialStep[];
}

export const TUTORIAL_DATA: Record<string, TutorialConfig> = {
  sku: {
    id: 'sku',
    title: 'Surat Keterangan Usaha (SKU)',
    steps: [
      {
        stepNumber: 1,
        title: 'Pilih Menu Layanan',
        zoomTarget: 'nav_layanan',
        voiceScript: 'Langkah pertama, klik menu Layanan pada navigasi atas untuk membuka katalog surat.',
      },
      {
        stepNumber: 2,
        title: 'Pilih Surat Usaha (SKU)',
        zoomTarget: 'card_sku',
        voiceScript: 'Langkah kedua, pilih kartu Surat Keterangan Usaha. Layanan ini gratis dan diproses dalam satu hari kerja.',
      },
      {
        stepNumber: 3,
        title: 'Ketik 16 Digit NIK',
        zoomTarget: 'input_nik',
        voiceScript: 'Langkah ketiga, masukkan enam belas digit NIK e-KTP Anda pada kolom yang ditunjukkan.',
      },
      {
        stepNumber: 4,
        title: 'Unggah Foto Dokumen',
        zoomTarget: 'upload_area',
        voiceScript: 'Langkah keempat, lampirkan foto e-KTP asli, Kartu Keluarga, dan foto tempat usaha Anda.',
      },
      {
        stepNumber: 5,
        title: 'Kirim Permohonan',
        zoomTarget: 'btn_submit',
        voiceScript: 'Langkah kelima, tekan tombol hijau Kirim Permohonan. Anda akan menerima nomor registrasi surat Anda.',
      },
      {
        stepNumber: 6,
        title: 'Tanda Tangan Basah Kades',
        zoomTarget: 'ttd_area',
        voiceScript: 'Langkah keenam, surat dicetak resmi dan ditandatangani basah oleh Kepala Desa Jombe serta distempel cap kantor desa.',
      },
    ],
  },
  lacak: {
    id: 'lacak',
    title: 'Lacak Surat',
    steps: [
      {
        stepNumber: 1,
        title: 'Menu Lacak Surat',
        zoomTarget: 'nav_lacak',
        voiceScript: 'Untuk mengecek proses surat Anda, klik menu Lacak Surat pada navigasi atas.',
      },
      {
        stepNumber: 2,
        title: 'Ketik Nomor Registrasi / NIK',
        zoomTarget: 'search_lacak',
        voiceScript: 'Langkah kedua, masukkan nomor registrasi surat atau enam belas digit NIK e-KTP Anda, lalu tekan Cari.',
      },
      {
        stepNumber: 3,
        title: 'Periksa Status Surat',
        zoomTarget: 'result_lacak',
        voiceScript: 'Langkah ketiga, jika status telah Disetujui, berkas fisik resmi siap Anda ambil di kantor desa.',
      },
    ],
  },
  pengaduan: {
    id: 'pengaduan',
    title: 'Pengaduan Warga',
    steps: [
      {
        stepNumber: 1,
        title: 'Menu Pengaduan',
        zoomTarget: 'nav_pengaduan',
        voiceScript: 'Untuk menyampaikan laporan atau usulan warga, klik menu Pengaduan pada navigasi atas.',
      },
      {
        stepNumber: 2,
        title: 'Tuliskan Laporan',
        zoomTarget: 'form_aduan',
        voiceScript: 'Langkah kedua, pilih kategori pengaduan, lalu sebutkan nama dusun dan masalah yang dilaporkan secara jelas.',
      },
      {
        stepNumber: 3,
        title: 'Kirim Laporan',
        zoomTarget: 'btn_aduan',
        voiceScript: 'Langkah ketiga, tekan Kirim Pengaduan. Anda akan memperoleh nomor tiket aduan untuk memantau penyelesaian laporan.',
      },
    ],
  },
  login: {
    id: 'login',
    title: 'Masuk Akun NIK',
    steps: [
      {
        stepNumber: 1,
        title: 'Klik Tombol Masuk',
        zoomTarget: 'nav_login',
        voiceScript: 'Untuk masuk ke dashboard warga, klik tombol Masuk di pojok kanan atas.',
      },
      {
        stepNumber: 2,
        title: 'Ketik NIK 16 Digit',
        zoomTarget: 'form_login',
        voiceScript: 'Langkah kedua, masukkan enam belas digit NIK Anda lalu tekan Masuk Sekarang. Anda langsung tiba di dashboard pribadi.',
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
  const [cursorPosition, setCursorPosition] = useState<{ x: number; y: number }>({ x: 260, y: 190 });
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

      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.04);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.05);
    } catch (e) {}
  };

  // Female Indonesian Voice Over Engine
  const speakIndonesianFemale = (text: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window) || isMuted) {
      setIsSpeaking(false);
      return;
    }

    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'id-ID';

      const voices = window.speechSynthesis.getVoices();

      // Look for Indonesian female voices
      const femaleIdVoice = voices.find(
        (v) =>
          (v.lang.toLowerCase().includes('id') || v.name.toLowerCase().includes('indonesia')) &&
          (v.name.toLowerCase().includes('female') ||
            v.name.toLowerCase().includes('wanita') ||
            v.name.toLowerCase().includes('perempuan') ||
            v.name.toLowerCase().includes('gadis') ||
            v.name.toLowerCase().includes('putri') ||
            v.name.toLowerCase().includes('siti') ||
            v.name.toLowerCase().includes('google bahasa indonesia') ||
            !v.name.toLowerCase().includes('male'))
      );

      const idVoice =
        femaleIdVoice ||
        voices.find(
          (v) => v.lang.toLowerCase().includes('id') || v.name.toLowerCase().includes('indonesia')
        );

      if (idVoice) {
        utterance.voice = idVoice;
      }

      // Pleasant, clear female pitch & cadence
      utterance.rate = 0.95;
      utterance.pitch = 1.08;
      utterance.volume = 1.0;

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      window.speechSynthesis.speak(utterance);
    } catch (e) {
      setIsSpeaking(false);
    }
  };

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
    }, 1100);

    const t3 = setTimeout(() => {
      setAnimationPhase('clicking');
      setIsClicked(true);
      playClickSound();
    }, 1900);

    const t4 = setTimeout(() => {
      setAnimationPhase('settled');
    }, 2500);

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
        speakIndonesianFemale(currentStep.voiceScript);
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

    speakIndonesianFemale(currentStep.voiceScript);
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
      speakIndonesianFemale(currentStep.voiceScript);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-[96vw] max-w-6xl bg-slate-900 rounded-3xl shadow-2xl border border-slate-700 overflow-hidden flex flex-col h-[90vh] max-h-[92vh]">
        {/* Minimalist Top Header */}
        <div className="bg-emerald-950 text-white px-5 py-3 flex items-center justify-between border-b border-emerald-800/80 shrink-0">
          <div className="flex items-center gap-2.5">
            <Image
              src="/logo_jeneponto.png"
              alt="Logo Jeneponto"
              width={26}
              height={26}
              className="object-contain"
            />
            <h2 className="text-sm font-bold text-white tracking-wide">
              Tutorial Website Lentera Desa
            </h2>
          </div>

          {/* Minimalist Tab Selector */}
          <div className="hidden sm:flex items-center gap-1.5">
            {Object.values(TUTORIAL_DATA).map((tut) => (
              <button
                key={tut.id}
                onClick={() => {
                  setSelectedTutorialId(tut.id);
                  setCurrentStepIndex(0);
                  setIsPlaying(true);
                }}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                  selectedTutorialId === tut.id
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'text-emerald-300 hover:text-white hover:bg-emerald-900/60'
                }`}
              >
                {tut.title}
              </button>
            ))}
          </div>

          <button
            onClick={handleClose}
            className="p-1.5 rounded-lg text-emerald-200 hover:text-white hover:bg-white/10 transition-colors"
            title="Tutup Tutorial"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mobile Topic Switcher Bar */}
        <div className="sm:hidden bg-emerald-950/90 border-b border-emerald-800/60 px-3 py-1.5 flex items-center gap-1.5 overflow-x-auto scrollbar-none shrink-0">
          {Object.values(TUTORIAL_DATA).map((tut) => (
            <button
              key={tut.id}
              onClick={() => {
                setSelectedTutorialId(tut.id);
                setCurrentStepIndex(0);
                setIsPlaying(true);
              }}
              className={`px-2.5 py-1 rounded-md text-[11px] font-semibold whitespace-nowrap transition-all ${
                selectedTutorialId === tut.id
                  ? 'bg-emerald-700 text-white'
                  : 'text-emerald-300 hover:text-white'
              }`}
            >
              {tut.title}
            </button>
          ))}
        </div>

        {/* Large, Spacious Video Viewport */}
        <div className="flex-1 bg-slate-950 p-2 sm:p-4 overflow-hidden flex flex-col justify-between">
          <div className="relative w-full flex-1 rounded-2xl overflow-hidden border border-slate-700 bg-white shadow-2xl flex flex-col">
            {/* Real Website Header (Matching Navbar.tsx 1:1) */}
            <div className="bg-white px-5 py-3 border-b border-slate-200 flex items-center justify-between z-20 shadow-xs shrink-0">
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
                    <span className="text-sm sm:text-base font-black tracking-tight text-slate-900">
                      Lentera<span className="text-emerald-800">Desa</span>
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-[9px] uppercase font-bold tracking-wider text-emerald-800 leading-none">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span>Desa Jombe, Kec. Turatea, Kab. Jeneponto</span>
                  </div>
                </div>
              </div>

              {/* Navigation Items */}
              <div className="flex items-center gap-1 sm:gap-2 text-xs font-semibold">
                <span className="px-3 py-1.5 text-slate-600 rounded-lg hidden sm:inline">Beranda</span>
                <span className="px-3 py-1.5 text-slate-600 rounded-lg hidden md:inline">Profil Desa</span>

                {/* Nav Layanan Target */}
                <div className="relative">
                  <span
                    className={`px-3.5 py-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1 font-bold ${
                      currentStep.zoomTarget === 'nav_layanan'
                        ? isClicked
                          ? 'bg-emerald-700 text-white ring-4 ring-emerald-300 shadow-md scale-95'
                          : 'bg-emerald-800 text-white ring-2 ring-emerald-600 shadow-sm'
                        : 'text-slate-600 hover:text-emerald-900 hover:bg-slate-50'
                    }`}
                  >
                    <span>Layanan Surat</span>
                  </span>
                  {currentStep.zoomTarget === 'nav_layanan' && isClicked && (
                    <span className="absolute inset-0 rounded-xl bg-emerald-400/80 animate-ping pointer-events-none" />
                  )}
                </div>

                {/* Nav Lacak Target */}
                <div className="relative">
                  <span
                    className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1 ${
                      currentStep.zoomTarget === 'nav_lacak'
                        ? isClicked
                          ? 'bg-emerald-700 text-white font-bold ring-4 ring-emerald-300 scale-95 shadow-md'
                          : 'bg-emerald-800 text-white font-bold ring-2 ring-emerald-600 shadow-sm'
                        : 'text-slate-600 hover:text-emerald-900 hover:bg-slate-50'
                    }`}
                  >
                    <span>Lacak Surat</span>
                  </span>
                  {currentStep.zoomTarget === 'nav_lacak' && isClicked && (
                    <span className="absolute inset-0 rounded-xl bg-emerald-400/80 animate-ping pointer-events-none" />
                  )}
                </div>

                {/* Nav Pengaduan Target */}
                <div className="relative hidden sm:block">
                  <span
                    className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1 ${
                      currentStep.zoomTarget === 'nav_pengaduan'
                        ? isClicked
                          ? 'bg-emerald-700 text-white font-bold ring-4 ring-emerald-300 scale-95 shadow-md'
                          : 'bg-emerald-800 text-white font-bold ring-2 ring-emerald-600 shadow-sm'
                        : 'text-slate-600 hover:text-emerald-900 hover:bg-slate-50'
                    }`}
                  >
                    <span>Pengaduan</span>
                  </span>
                  {currentStep.zoomTarget === 'nav_pengaduan' && isClicked && (
                    <span className="absolute inset-0 rounded-xl bg-emerald-400/80 animate-ping pointer-events-none" />
                  )}
                </div>

                {/* Nav Login Target */}
                <div className="relative ml-1">
                  <span
                    className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 shadow-xs ${
                      currentStep.zoomTarget === 'nav_login'
                        ? isClicked
                          ? 'bg-emerald-700 text-white ring-4 ring-emerald-300 scale-95'
                          : 'bg-emerald-800 text-white ring-2 ring-emerald-600'
                        : 'bg-emerald-800 hover:bg-emerald-900 text-white'
                    }`}
                  >
                    <span>Masuk</span>
                  </span>
                  {currentStep.zoomTarget === 'nav_login' && isClicked && (
                    <span className="absolute inset-0 rounded-xl bg-emerald-400/80 animate-ping pointer-events-none" />
                  )}
                </div>
              </div>
            </div>

            {/* Real Web Body with Smooth Zoom Transform */}
            <div className="relative flex-1 bg-slate-50 overflow-hidden flex items-center justify-center p-4 sm:p-8">
              <div
                className={`w-full max-w-2xl transition-all duration-700 ease-out transform ${
                  animationPhase === 'zooming' || animationPhase === 'clicking'
                    ? 'scale-115 sm:scale-120 shadow-xl rounded-2xl'
                    : 'scale-100'
                }`}
              >
                {/* Step 1: Real Website Hero Banner */}
                {currentStep.zoomTarget === 'nav_layanan' && (
                  <div className="p-6 sm:p-8 bg-gradient-to-br from-emerald-900 to-teal-950 text-white rounded-2xl shadow-xl text-center space-y-3.5">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-emerald-700/60 text-emerald-200 border border-emerald-500/30">
                      Sistem Pelayanan Mandiri Desa Jombe
                    </span>
                    <h3 className="text-lg sm:text-xl font-black leading-snug text-white">
                      Layanan Surat Administrasi Desa Jombe<br />Mudah, Cepat & 100% Bebas Pungli
                    </h3>
                    <div className="max-w-md mx-auto flex items-center gap-2 p-2 bg-white rounded-xl shadow-md">
                      <Search className="w-4 h-4 text-slate-400 ml-2" />
                      <input
                        readOnly
                        placeholder="Cari layanan surat keterangan..."
                        className="flex-1 text-xs text-slate-800 bg-transparent focus:outline-none"
                      />
                      <span className="px-3.5 py-1.5 bg-emerald-800 text-white text-xs font-bold rounded-lg">
                        Cari
                      </span>
                    </div>
                  </div>
                )}

                {/* Step 2: Real SKU Service Card */}
                {currentStep.zoomTarget === 'card_sku' && (
                  <div className="p-6 bg-white rounded-2xl border-2 border-emerald-600 shadow-xl text-left space-y-3.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center border border-emerald-200">
                          <FileText className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="text-sm font-black text-slate-900">
                            Surat Keterangan Usaha (SKU)
                          </h4>
                          <span className="text-xs text-slate-500">Legalitas Usaha & Syarat KUR Bank</span>
                        </div>
                      </div>
                      <span className="px-3 py-1 rounded-full text-xs font-black bg-emerald-100 text-emerald-900 border border-emerald-300">
                        GRATIS
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Menerangkan secara sah bahwa pemohon memiliki dan mengelola usaha produktif di wilayah Desa Jombe.
                    </p>
                    <div className="pt-2 flex items-center justify-between border-t border-slate-100">
                      <span className="text-xs text-slate-500 font-medium">Estimasi: 1 Hari Kerja</span>
                      <button
                        className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                          isClicked
                            ? 'bg-emerald-700 text-white ring-4 ring-emerald-300 scale-95 shadow-md'
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
                  <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xl text-left space-y-3.5">
                    <div className="border-b border-slate-100 pb-2.5 flex items-center justify-between">
                      <h4 className="text-sm font-black text-slate-900">Formulir Permohonan SKU</h4>
                      <span className="text-xs font-bold text-emerald-800">Langkah 1 dari 2</span>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <label className="text-xs font-bold text-slate-700 block mb-1.5">
                          Nomor Induk Kependudukan (NIK 16 Digit) <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <input
                            readOnly
                            value="7304051208990001"
                            className={`w-full px-4 py-2.5 rounded-xl text-xs font-mono font-bold text-slate-900 transition-all ${
                              isClicked
                                ? 'bg-emerald-50 border-2 border-emerald-600 ring-4 ring-emerald-200'
                                : 'bg-slate-50 border border-slate-300'
                            }`}
                          />
                          {isClicked && (
                            <span className="absolute right-3 top-2.5 px-2 py-0.5 rounded-md bg-emerald-600 text-white text-[10px] font-black">
                              NIK TERVERIFIKASI ✓
                            </span>
                          )}
                        </div>
                      </div>
                      <div>
                        <label className="text-xs font-bold text-slate-700 block mb-1.5">Nama Lengkap Pemohon</label>
                        <input readOnly value="Warga Desa Jombe (Dusun Jombe Selatan)" className="w-full px-4 py-2 bg-slate-100 border border-slate-200 rounded-xl text-xs text-slate-700" />
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 4: Real Upload Area */}
                {currentStep.zoomTarget === 'upload_area' && (
                  <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xl text-left space-y-3.5">
                    <h4 className="text-sm font-black text-slate-900">Lampiran Dokumen Persyaratan</h4>
                    <div className="grid grid-cols-2 gap-3.5">
                      <div
                        className={`p-4 rounded-xl border-2 border-dashed text-center transition-all ${
                          isClicked ? 'border-emerald-600 bg-emerald-50' : 'border-emerald-400 bg-emerald-50/40'
                        }`}
                      >
                        <div className="text-xs font-black text-slate-900">Foto e-KTP Asli</div>
                        <span className="text-[10px] text-emerald-800 font-bold">ktp_asli.jpg (✓ Terunggah)</span>
                      </div>
                      <div className="p-4 rounded-xl border-2 border-dashed border-emerald-400 bg-emerald-50/40 text-center">
                        <div className="text-xs font-black text-slate-900">Kartu Keluarga (KK)</div>
                        <span className="text-[10px] text-emerald-800 font-bold">kk_asli.jpg (✓ Terunggah)</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 5: Real Submit Button */}
                {currentStep.zoomTarget === 'btn_submit' && (
                  <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xl text-center space-y-3.5">
                    <div className="text-xs text-slate-600 flex items-center justify-center gap-1.5">
                      <Lock className="w-4 h-4 text-emerald-700" />
                      <span>Data kependudukan Anda aman & dilindungi Pemerintah Desa Jombe</span>
                    </div>
                    <button
                      className={`w-full py-3.5 rounded-xl text-xs sm:text-sm font-black transition-all flex items-center justify-center gap-2 shadow-lg ${
                        isClicked
                          ? 'bg-emerald-700 text-white ring-4 ring-emerald-300 scale-95'
                          : 'bg-emerald-800 hover:bg-emerald-900 text-white'
                      }`}
                    >
                      <span>🚀 Kirim Permohonan Surat Sekarang</span>
                    </button>
                    {isClicked && (
                      <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-black text-emerald-900 animate-in fade-in">
                        Permohonan Berhasil Dikirim! No. Registrasi: JMB-2026-00001
                      </div>
                    )}
                  </div>
                )}

                {/* Step 6: Real Physical Wet Signature Document */}
                {currentStep.zoomTarget === 'ttd_area' && (
                  <div className="p-6 sm:p-8 bg-white rounded-2xl border border-slate-200 shadow-xl text-left space-y-3 font-serif text-slate-900">
                    <div className="text-center font-bold text-xs sm:text-sm border-b-2 border-slate-900 pb-2 leading-tight">
                      PEMERINTAH KABUPATEN JENEPONTO<br />
                      KECAMATAN TURATEA<br />
                      <span className="font-black text-sm">KANTOR KEPALA DESA JOMBE</span><br />
                      <span className="text-[9px] font-sans text-slate-600 font-normal">Alamat: Jalan Poros Dusun Jombe Selatan, Kode Pos 92351</span>
                    </div>
                    <div className="text-center py-1">
                      <div className="font-bold underline text-xs">SURAT KETERANGAN USAHA</div>
                      <div className="text-[9px] font-sans">Nomor: 510 / 042 / DJ / III / 2026</div>
                    </div>
                    <div className="text-xs font-sans text-slate-700 leading-relaxed">
                      Menerangkan bahwa pemohon adalah benar warga Desa Jombe yang memiliki usaha mikro di Dusun Jombe Selatan.
                    </div>
                    <div className="pt-3 flex justify-end">
                      <div className="text-center relative pr-4">
                        <div className="text-[9px] font-sans">Kepala Desa Jombe,</div>
                        <div className="font-bold text-xs text-blue-900 underline mt-3 tracking-wide">
                          JUSMAEDY, S.Pd
                        </div>
                        <div className="text-[8px] font-sans text-slate-500">
                          (Ditandatangani Basah & Distempel Cap Kantor Desa)
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Lacak Search Real Form */}
                {currentStep.zoomTarget === 'search_lacak' && (
                  <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xl text-left space-y-3.5">
                    <h4 className="text-sm font-black text-slate-900">Lacak Status Permohonan Surat</h4>
                    <div className="flex gap-2.5">
                      <input
                        readOnly
                        value="JMB-2026-00001"
                        className={`flex-1 px-4 py-2.5 rounded-xl text-xs font-mono font-bold transition-all ${
                          isClicked ? 'bg-emerald-50 border-2 border-emerald-600 ring-4 ring-emerald-200' : 'bg-slate-50 border border-slate-300'
                        }`}
                      />
                      <button
                        className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                          isClicked ? 'bg-emerald-700 text-white ring-4 ring-emerald-300' : 'bg-emerald-800 text-white'
                        }`}
                      >
                        Lacak
                      </button>
                    </div>
                  </div>
                )}

                {/* Lacak Result Real Card */}
                {currentStep.zoomTarget === 'result_lacak' && (
                  <div className="p-6 bg-white rounded-2xl border-2 border-emerald-600 shadow-xl text-left space-y-3">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                      <span className="text-xs font-black text-slate-900">No. Registrasi: JMB-2026-00001</span>
                      <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 font-black text-xs">
                        DISETUJUI / SELESAI
                      </span>
                    </div>
                    <div className="text-xs text-slate-600 leading-relaxed">
                      Surat Keterangan Usaha (SKU) telah selesai diverifikasi, dicetak, dan ditandatangani basah oleh Kepala Desa Jombe.
                    </div>
                    <div className="text-xs font-bold text-emerald-800 bg-emerald-50 p-2.5 rounded-xl">
                      📍 Berkas fisik resmi siap diambil di Kantor Desa Jombe pada jam kerja (08.00 - 15.00 WITA).
                    </div>
                  </div>
                )}

                {/* Real Pengaduan Form */}
                {currentStep.zoomTarget === 'form_aduan' && (
                  <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xl text-left space-y-3">
                    <h4 className="text-sm font-black text-slate-900">Formulir Pengaduan & Aspirasi Warga</h4>
                    <div className="space-y-2">
                      <input readOnly value="Jalan berlubang di poros Dusun Jombe Selatan" className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800 font-medium" />
                      <textarea readOnly rows={2} value="Mohon perbaikan jalan rusak sebelum musim hujan agar pengangkutan panen jagung lancar." className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-700" />
                    </div>
                  </div>
                )}

                {/* Real Pengaduan Submit */}
                {currentStep.zoomTarget === 'btn_aduan' && (
                  <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xl text-center space-y-3">
                    <button
                      className={`w-full py-3 rounded-xl text-xs font-black transition-all ${
                        isClicked ? 'bg-emerald-700 text-white ring-4 ring-emerald-300 scale-95' : 'bg-emerald-800 text-white'
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
                  <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xl text-left space-y-3.5">
                    <div className="text-center font-black text-slate-900 text-sm">
                      Masuk ke Sistem Lentera Desa
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">16 Digit NIK e-KTP</label>
                      <input readOnly value="7304051208990001" className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono font-bold" />
                    </div>
                    <button
                      className={`w-full py-3 rounded-xl text-xs font-black transition-all ${
                        isClicked ? 'bg-emerald-700 text-white ring-4 ring-emerald-300 scale-95' : 'bg-emerald-800 text-white'
                      }`}
                    >
                      Masuk Sekarang
                    </button>
                  </div>
                )}
              </div>

              {/* Clean Animated Cursor Arrow (Tanpa Teks / Label Kuning) */}
              <div
                className="absolute pointer-events-none z-30 transition-all duration-700 ease-out"
                style={{
                  transform: `translate(${cursorPosition.x}px, ${cursorPosition.y}px)`,
                }}
              >
                <div className="relative">
                  <svg
                    className={`w-7 h-7 filter drop-shadow-lg transition-transform ${
                      isClicked ? 'scale-80 translate-x-0.5 translate-y-0.5' : 'scale-100'
                    }`}
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M3 3L10.07 19.97L12.58 12.58L19.97 10.07L3 3Z"
                      fill="#047857"
                      stroke="#FFFFFF"
                      strokeWidth="2"
                      strokeLinejoin="round"
                    />
                  </svg>
                  {isClicked && (
                    <span className="absolute -top-3 -left-3 w-10 h-10 rounded-full border-4 border-emerald-400 animate-ping" />
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Minimalist Subtitle & Player Control Bar */}
          <div className="mt-3 p-3 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
            {/* Play/Pause & Subtitle */}
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className={`p-2 sm:px-3 sm:py-2 rounded-xl font-bold transition-all flex items-center gap-1.5 text-xs shrink-0 ${
                  isPlaying
                    ? 'bg-emerald-700 text-white hover:bg-emerald-600'
                    : 'bg-emerald-600 text-white hover:bg-emerald-500'
                }`}
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                <span className="hidden sm:inline">{isPlaying ? 'Jeda' : 'Putar'}</span>
              </button>

              <button
                onClick={toggleMute}
                className={`p-2 sm:px-2.5 sm:py-2 rounded-xl border text-xs font-semibold transition-colors flex items-center gap-1.5 shrink-0 ${
                  !isMuted
                    ? 'bg-emerald-900/60 text-emerald-300 border-emerald-700 hover:bg-emerald-800'
                    : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
                }`}
                title={isMuted ? 'Nyalakan Suara' : 'Matikan Suara'}
              >
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
                <span className="hidden sm:inline">{isMuted ? 'Mute' : 'Suara'}</span>
              </button>

              <button
                onClick={handleReplay}
                className="p-2 sm:px-2.5 sm:py-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white border border-slate-700 text-xs transition-colors shrink-0"
                title="Ulangi Langkah Ini"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              {/* Clean Subtitle Text */}
              <div className="flex-1 text-xs text-slate-200 line-clamp-2 pl-2 border-l border-slate-800">
                "{currentStep.voiceScript}"
              </div>
            </div>

            {/* Navigation Buttons */}
            <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
              <button
                onClick={handlePrevStep}
                disabled={currentStepIndex === 0}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-white text-xs border border-slate-700 flex items-center gap-1"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Sebelumnya</span>
              </button>

              <span className="text-xs font-bold text-slate-300 px-1">
                {currentStepIndex + 1} / {totalSteps}
              </span>

              <button
                onClick={handleNextStep}
                disabled={currentStepIndex === totalSteps - 1}
                className="px-3.5 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-600 disabled:opacity-40 text-white text-xs font-bold border border-emerald-600 flex items-center gap-1"
              >
                <span>Selanjutnya</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
