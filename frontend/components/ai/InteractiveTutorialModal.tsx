'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import {
  X,
  Play,
  Pause,
  RotateCcw,
  ChevronRight,
  ChevronLeft,
  FileText,
  Search,
  Lock,
  CheckCircle2,
  Send,
  UploadCloud,
} from 'lucide-react';

export interface TutorialStep {
  stepNumber: number;
  title: string;
  targetId: string;
  instruction: string;
  typewriterText?: string;
  typewriterText2?: string;
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
        targetId: 'nav_layanan',
        instruction: 'Langkah 1: Klik menu "Layanan Surat" pada navigasi atas untuk membuka katalog layanan.',
      },
      {
        stepNumber: 2,
        title: 'Pilih Surat Usaha (SKU)',
        targetId: 'card_sku',
        instruction: 'Langkah 2: Pilih kartu "Surat Keterangan Usaha (SKU)" lalu klik "Ajukan Surat".',
      },
      {
        stepNumber: 3,
        title: 'Ketik 16 Digit NIK',
        targetId: 'input_nik',
        typewriterText: '7304051208990001',
        instruction: 'Langkah 3: Masukkan 16 digit NIK e-KTP pemohon pada kolom yang tersedia.',
      },
      {
        stepNumber: 4,
        title: 'Unggah Foto Dokumen',
        targetId: 'upload_area',
        instruction: 'Langkah 4: Lampirkan foto e-KTP asli dan dokumen pendukung usaha.',
      },
      {
        stepNumber: 5,
        title: 'Kirim Permohonan',
        targetId: 'btn_submit',
        instruction: 'Langkah 5: Tekan tombol hijau "Kirim Permohonan Surat Sekarang" untuk mendapatkan nomor registrasi.',
      },
      {
        stepNumber: 6,
        title: 'Tanda Tangan Basah Kades',
        targetId: 'ttd_area',
        instruction: 'Langkah 6: Surat resmi dicetak fisik dan ditandatangani basah oleh Kepala Desa Jombe beserta stempel cap.',
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
        targetId: 'nav_lacak',
        instruction: 'Langkah 1: Klik menu "Lacak Surat" pada navigasi atas website.',
      },
      {
        stepNumber: 2,
        title: 'Ketik Nomor Registrasi / NIK',
        targetId: 'search_lacak',
        typewriterText: 'JMB-2026-00001',
        instruction: 'Langkah 2: Masukkan nomor registrasi surat permohonan Anda, lalu tekan tombol Lacak.',
      },
      {
        stepNumber: 3,
        title: 'Periksa Status Surat',
        targetId: 'result_lacak',
        instruction: 'Langkah 3: Status surat terpantau transparan. Jika Disetujui, berkas fisik siap diambil di kantor desa.',
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
        targetId: 'nav_pengaduan',
        instruction: 'Langkah 1: Klik menu "Pengaduan" pada navigasi atas untuk menyampaikan laporan warga.',
      },
      {
        stepNumber: 2,
        title: 'Tuliskan Laporan',
        targetId: 'form_aduan',
        typewriterText: 'Jalan berlubang di poros Dusun Jombe Selatan',
        typewriterText2: 'Mohon bantuan perbaikan jalan sebelum musim hujan agar pengangkutan hasil tani lancar.',
        instruction: 'Langkah 2: Isi judul dan rincian masalah pengaduan Anda secara jelas.',
      },
      {
        stepNumber: 3,
        title: 'Kirim Laporan',
        targetId: 'btn_aduan',
        instruction: 'Langkah 3: Tekan "Kirim Pengaduan" untuk memperoleh nomor tiket resmi tindak lanjut.',
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
        targetId: 'nav_login',
        instruction: 'Langkah 1: Klik tombol "Masuk" di pojok kanan atas website.',
      },
      {
        stepNumber: 2,
        title: 'Ketik NIK 16 Digit',
        targetId: 'form_login',
        typewriterText: '7304051208990001',
        instruction: 'Langkah 2: Masukkan 16 digit NIK Anda lalu klik "Masuk Sekarang" untuk mengakses dashboard warga.',
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

  // Dynamic Cursor Coordinates & Interaction States
  const canvasRef = useRef<HTMLDivElement>(null);
  const [cursorPos, setCursorPos] = useState<{ x: number; y: number }>({ x: 300, y: 300 });
  const [cursorVisible, setCursorVisible] = useState<boolean>(false);
  const [isClicked, setIsClicked] = useState<boolean>(false);

  // Typewriter Engine
  const [typedText, setTypedText] = useState<string>('');
  const [typedText2, setTypedText2] = useState<string>('');
  const [isTypingDone, setIsTypingDone] = useState<boolean>(false);

  const activeTutorial = TUTORIAL_DATA[selectedTutorialId] || TUTORIAL_DATA['sku'];
  const totalSteps = activeTutorial.steps.length;
  const currentStep = activeTutorial.steps[currentStepIndex] || activeTutorial.steps[0];

  // Subtle natural mouse click sound effect (Web Audio API)
  const playClickSound = useCallback(() => {
    try {
      if (typeof window === 'undefined') return;
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;
      const ctx = new AudioContextClass();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(950, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(140, ctx.currentTime + 0.035);

      gain.gain.setValueAtTime(0.18, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.035);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.04);
    } catch (e) {}
  }, []);

  // Calculate coordinates of active target element inside canvas
  const updateCursorToTarget = useCallback(() => {
    if (!canvasRef.current) return;
    const target = canvasRef.current.querySelector('#active-target');
    if (target) {
      const cRect = canvasRef.current.getBoundingClientRect();
      const tRect = target.getBoundingClientRect();
      // Point accurately to target center / button center
      const x = tRect.left - cRect.left + Math.min(30, tRect.width * 0.45);
      const y = tRect.top - cRect.top + Math.min(24, tRect.height * 0.5);
      setCursorPos({ x, y });
    }
  }, []);

  // Run cursor animation, typewriter, and auto-progression sequence
  useEffect(() => {
    if (!isOpen) return;

    // Reset interaction states for this step
    setIsClicked(false);
    setTypedText('');
    setTypedText2('');
    setIsTypingDone(false);

    // Initial cursor placement slightly away so it visibly glides into position
    if (canvasRef.current) {
      const cRect = canvasRef.current.getBoundingClientRect();
      setCursorPos((prev) => ({
        x: Math.min(cRect.width - 60, prev.x + (prev.x > cRect.width / 2 ? -140 : 140)),
        y: Math.min(cRect.height - 60, prev.y + 90),
      }));
      setCursorVisible(true);
    }

    // 1. Move cursor to target element
    const moveTimer = setTimeout(() => {
      updateCursorToTarget();
    }, 120);

    // Re-verify position once layout settles
    const alignTimer = setTimeout(() => {
      updateCursorToTarget();
    }, 450);

    // 2. Click action
    const clickTimer = setTimeout(() => {
      setIsClicked(true);
      playClickSound();
    }, 850);

    // 3. Typewriter animation (if step contains text input)
    let typeInterval: NodeJS.Timeout | null = null;
    let typeInterval2: NodeJS.Timeout | null = null;

    const startTypeTimer = setTimeout(() => {
      if (currentStep.typewriterText) {
        const fullText1 = currentStep.typewriterText;
        let idx1 = 0;

        typeInterval = setInterval(() => {
          idx1++;
          setTypedText(fullText1.slice(0, idx1));
          if (idx1 >= fullText1.length) {
            if (typeInterval) clearInterval(typeInterval);

            // Handle second input if exists (e.g. description)
            if (currentStep.typewriterText2) {
              const fullText2 = currentStep.typewriterText2;
              let idx2 = 0;
              typeInterval2 = setInterval(() => {
                idx2++;
                setTypedText2(fullText2.slice(0, idx2));
                if (idx2 >= fullText2.length) {
                  if (typeInterval2) clearInterval(typeInterval2);
                  setIsTypingDone(true);
                }
              }, 30);
            } else {
              setIsTypingDone(true);
            }
          }
        }, 45);
      } else {
        setIsTypingDone(true);
      }
    }, 1050);

    // 4. Auto advance to next step if playing
    let advanceTimer: NodeJS.Timeout | null = null;
    if (isPlaying) {
      const stepDuration = currentStep.typewriterText ? 4600 : 3400;
      advanceTimer = setTimeout(() => {
        setCurrentStepIndex((prev) => {
          if (prev < totalSteps - 1) {
            return prev + 1;
          } else {
            setIsPlaying(false);
            return prev;
          }
        });
      }, stepDuration);
    }

    return () => {
      clearTimeout(moveTimer);
      clearTimeout(alignTimer);
      clearTimeout(clickTimer);
      clearTimeout(startTypeTimer);
      if (typeInterval) clearInterval(typeInterval);
      if (typeInterval2) clearInterval(typeInterval2);
      if (advanceTimer) clearTimeout(advanceTimer);
    };
  }, [isOpen, selectedTutorialId, currentStepIndex, isPlaying, totalSteps, currentStep, playClickSound, updateCursorToTarget]);

  // Window resize handler to maintain accurate cursor alignment
  useEffect(() => {
    const handleResize = () => {
      updateCursorToTarget();
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [updateCursorToTarget]);

  const handleClose = () => {
    setIsPlaying(false);
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
    setIsClicked(false);
    setTypedText('');
    setTypedText2('');
    setIsTypingDone(false);

    if (canvasRef.current) {
      const cRect = canvasRef.current.getBoundingClientRect();
      setCursorPos({ x: cRect.width * 0.8, y: cRect.height * 0.8 });
    }

    setTimeout(() => updateCursorToTarget(), 150);
    setTimeout(() => {
      setIsClicked(true);
      playClickSound();
    }, 850);
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
              Tutorial Interaktif Website Lentera Desa
            </h2>
          </div>

          {/* Tab Selector */}
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

        {/* Mobile Topic Switcher */}
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

        {/* Large, Spacious Video Simulation Canvas */}
        <div className="flex-1 bg-slate-950 p-2 sm:p-4 overflow-hidden flex flex-col justify-between">
          <div
            ref={canvasRef}
            className="relative w-full flex-1 rounded-2xl overflow-hidden border border-slate-700 bg-white shadow-2xl flex flex-col select-none"
          >
            {/* Real Website Header (Matching Navbar.tsx 1:1) */}
            <div className="bg-white px-5 py-3 border-b border-slate-200 flex items-center justify-between z-20 shadow-xs shrink-0">
              {/* Brand Logo */}
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

                {/* Nav Layanan */}
                <div className="relative">
                  <span
                    id={currentStep.targetId === 'nav_layanan' ? 'active-target' : undefined}
                    className={`px-3.5 py-1.5 rounded-xl transition-all flex items-center gap-1 font-bold ${
                      currentStep.targetId === 'nav_layanan'
                        ? isClicked
                          ? 'bg-emerald-700 text-white ring-4 ring-emerald-300 shadow-md scale-95'
                          : 'bg-emerald-800 text-white ring-2 ring-emerald-500 shadow-sm'
                        : 'text-slate-600'
                    }`}
                  >
                    <span>Layanan Surat</span>
                  </span>
                  {currentStep.targetId === 'nav_layanan' && isClicked && (
                    <span className="absolute inset-0 rounded-xl bg-emerald-400/80 animate-ping pointer-events-none" />
                  )}
                </div>

                {/* Nav Lacak */}
                <div className="relative">
                  <span
                    id={currentStep.targetId === 'nav_lacak' ? 'active-target' : undefined}
                    className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1 ${
                      currentStep.targetId === 'nav_lacak'
                        ? isClicked
                          ? 'bg-emerald-700 text-white font-bold ring-4 ring-emerald-300 scale-95 shadow-md'
                          : 'bg-emerald-800 text-white font-bold ring-2 ring-emerald-500 shadow-sm'
                        : 'text-slate-600'
                    }`}
                  >
                    <span>Lacak Surat</span>
                  </span>
                  {currentStep.targetId === 'nav_lacak' && isClicked && (
                    <span className="absolute inset-0 rounded-xl bg-emerald-400/80 animate-ping pointer-events-none" />
                  )}
                </div>

                {/* Nav Pengaduan */}
                <div className="relative hidden sm:block">
                  <span
                    id={currentStep.targetId === 'nav_pengaduan' ? 'active-target' : undefined}
                    className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1 ${
                      currentStep.targetId === 'nav_pengaduan'
                        ? isClicked
                          ? 'bg-emerald-700 text-white font-bold ring-4 ring-emerald-300 scale-95 shadow-md'
                          : 'bg-emerald-800 text-white font-bold ring-2 ring-emerald-500 shadow-sm'
                        : 'text-slate-600'
                    }`}
                  >
                    <span>Pengaduan</span>
                  </span>
                  {currentStep.targetId === 'nav_pengaduan' && isClicked && (
                    <span className="absolute inset-0 rounded-xl bg-emerald-400/80 animate-ping pointer-events-none" />
                  )}
                </div>

                {/* Nav Login */}
                <div className="relative ml-1">
                  <span
                    id={currentStep.targetId === 'nav_login' ? 'active-target' : undefined}
                    className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 shadow-xs ${
                      currentStep.targetId === 'nav_login'
                        ? isClicked
                          ? 'bg-emerald-700 text-white ring-4 ring-emerald-300 scale-95'
                          : 'bg-emerald-800 text-white ring-2 ring-emerald-500'
                        : 'bg-emerald-800 text-white'
                    }`}
                  >
                    <span>Masuk</span>
                  </span>
                  {currentStep.targetId === 'nav_login' && isClicked && (
                    <span className="absolute inset-0 rounded-xl bg-emerald-400/80 animate-ping pointer-events-none" />
                  )}
                </div>
              </div>
            </div>

            {/* Real Web Body */}
            <div className="relative flex-1 bg-slate-50 overflow-hidden flex items-center justify-center p-4 sm:p-8">
              <div className="w-full max-w-2xl transition-all duration-500">
                {/* Step 1: Real Website Hero Banner */}
                {currentStep.targetId === 'nav_layanan' && (
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
                {currentStep.targetId === 'card_sku' && (
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
                          <span className="text-xs text-slate-500">Legalitas Usaha & Syarat Pengajuan Modal</span>
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
                        id="active-target"
                        className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                          isClicked
                            ? 'bg-emerald-700 text-white ring-4 ring-emerald-300 scale-95 shadow-md'
                            : 'bg-emerald-800 text-white shadow-sm'
                        }`}
                      >
                        Ajukan Surat ➔
                      </button>
                    </div>
                  </div>
                )}

                {/* Step 3: Real Form Input NIK (With Automatic Typewriter Effect) */}
                {currentStep.targetId === 'input_nik' && (
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
                          <div
                            id="active-target"
                            className={`w-full px-4 py-2.5 rounded-xl text-xs font-mono font-bold flex items-center transition-all ${
                              isTypingDone
                                ? 'bg-emerald-50 border-2 border-emerald-600 ring-4 ring-emerald-200 text-slate-900'
                                : isClicked
                                ? 'bg-white border-2 border-emerald-500 ring-2 ring-emerald-200 text-slate-900'
                                : 'bg-slate-50 border border-slate-300 text-slate-400'
                            }`}
                          >
                            <span>{typedText || (isClicked ? '' : 'Ketik 16 Digit NIK...')}</span>
                            {!isTypingDone && isClicked && (
                              <span className="inline-block w-0.5 h-4 bg-emerald-700 ml-0.5 animate-pulse" />
                            )}
                          </div>
                          {isTypingDone && (
                            <span className="absolute right-3 top-2.5 px-2 py-0.5 rounded-md bg-emerald-600 text-white text-[10px] font-black animate-in fade-in zoom-in-90">
                              NIK TERVERIFIKASI ✓
                            </span>
                          )}
                        </div>
                      </div>
                      <div>
                        <label className="text-xs font-bold text-slate-700 block mb-1.5">Nama Lengkap Pemohon</label>
                        <div className="w-full px-4 py-2 bg-slate-100 border border-slate-200 rounded-xl text-xs text-slate-700 font-medium">
                          {isTypingDone ? 'Warga Desa Jombe (Dusun Jombe Selatan)' : '-'}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 4: Real Upload Area */}
                {currentStep.targetId === 'upload_area' && (
                  <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xl text-left space-y-3.5">
                    <h4 className="text-sm font-black text-slate-900">Lampiran Dokumen Persyaratan</h4>
                    <div className="grid grid-cols-2 gap-3.5">
                      <div
                        id="active-target"
                        className={`p-4 rounded-xl border-2 border-dashed text-center transition-all ${
                          isClicked ? 'border-emerald-600 bg-emerald-50 scale-95 shadow-md' : 'border-emerald-400 bg-emerald-50/40'
                        }`}
                      >
                        <UploadCloud className="w-6 h-6 text-emerald-700 mx-auto mb-1" />
                        <div className="text-xs font-black text-slate-900">Foto e-KTP Asli</div>
                        <span className="text-[10px] text-emerald-800 font-bold">
                          {isClicked ? 'ktp_asli.jpg (✓ Terunggah)' : 'Klik untuk mengunggah'}
                        </span>
                      </div>
                      <div className="p-4 rounded-xl border-2 border-dashed border-emerald-400 bg-emerald-50/40 text-center">
                        <UploadCloud className="w-6 h-6 text-emerald-700 mx-auto mb-1" />
                        <div className="text-xs font-black text-slate-900">Kartu Keluarga (KK)</div>
                        <span className="text-[10px] text-emerald-800 font-bold">
                          {isClicked ? 'kk_asli.jpg (✓ Terunggah)' : 'Menunggu unggahan'}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 5: Real Submit Button */}
                {currentStep.targetId === 'btn_submit' && (
                  <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xl text-center space-y-3.5">
                    <div className="text-xs text-slate-600 flex items-center justify-center gap-1.5">
                      <Lock className="w-4 h-4 text-emerald-700" />
                      <span>Data kependudukan Anda aman & dilindungi Pemerintah Desa Jombe</span>
                    </div>
                    <button
                      id="active-target"
                      className={`w-full py-3.5 rounded-xl text-xs sm:text-sm font-black transition-all flex items-center justify-center gap-2 shadow-lg ${
                        isClicked
                          ? 'bg-emerald-700 text-white ring-4 ring-emerald-300 scale-95'
                          : 'bg-emerald-800 text-white'
                      }`}
                    >
                      <Send className="w-4 h-4" />
                      <span>Kirim Permohonan Surat Sekarang</span>
                    </button>
                    {isClicked && (
                      <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-black text-emerald-900 animate-in fade-in">
                        Permohonan Berhasil Dikirim! No. Registrasi: JMB-2026-00001
                      </div>
                    )}
                  </div>
                )}

                {/* Step 6: Real Physical Wet Signature Document */}
                {currentStep.targetId === 'ttd_area' && (
                  <div
                    id="active-target"
                    className="p-6 sm:p-8 bg-white rounded-2xl border border-slate-200 shadow-xl text-left space-y-3 font-serif text-slate-900"
                  >
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
                      Menerangkan bahwa pemohon adalah benar warga Desa Jombe yang memiliki usaha produktif di Dusun Jombe Selatan.
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

                {/* Lacak Search Real Form (With Automatic Typewriter Effect) */}
                {currentStep.targetId === 'search_lacak' && (
                  <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xl text-left space-y-3.5">
                    <h4 className="text-sm font-black text-slate-900">Lacak Status Permohonan Surat</h4>
                    <div className="flex gap-2.5">
                      <div
                        id="active-target"
                        className={`flex-1 px-4 py-2.5 rounded-xl text-xs font-mono font-bold flex items-center transition-all ${
                          isTypingDone
                            ? 'bg-emerald-50 border-2 border-emerald-600 ring-4 ring-emerald-200 text-slate-900'
                            : isClicked
                            ? 'bg-white border-2 border-emerald-500 ring-2 ring-emerald-200 text-slate-900'
                            : 'bg-slate-50 border border-slate-300 text-slate-400'
                        }`}
                      >
                        <span>{typedText || (isClicked ? '' : 'Masukkan No. Registrasi / NIK...')}</span>
                        {!isTypingDone && isClicked && (
                          <span className="inline-block w-0.5 h-4 bg-emerald-700 ml-0.5 animate-pulse" />
                        )}
                      </div>
                      <button
                        className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                          isTypingDone ? 'bg-emerald-700 text-white ring-4 ring-emerald-300' : 'bg-emerald-800 text-white'
                        }`}
                      >
                        Lacak
                      </button>
                    </div>
                  </div>
                )}

                {/* Lacak Result Real Card */}
                {currentStep.targetId === 'result_lacak' && (
                  <div
                    id="active-target"
                    className="p-6 bg-white rounded-2xl border-2 border-emerald-600 shadow-xl text-left space-y-3"
                  >
                    <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                      <span className="text-xs font-black text-slate-900">No. Registrasi: JMB-2026-00001</span>
                      <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 font-black text-xs">
                        DISETUJUI / SELESAI
                      </span>
                    </div>
                    <div className="text-xs text-slate-600 leading-relaxed">
                      Surat Keterangan Usaha (SKU) telah selesai diverifikasi, dicetak, dan ditandatangani basah oleh Kepala Desa Jombe.
                    </div>
                    <div className="text-xs font-bold text-emerald-800 bg-emerald-50 p-2.5 rounded-xl flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                      <span>Berkas fisik resmi siap diambil di Kantor Desa Jombe pada jam kerja (08.00 - 15.00 WITA).</span>
                    </div>
                  </div>
                )}

                {/* Real Pengaduan Form (With Automatic Typewriter Effect) */}
                {currentStep.targetId === 'form_aduan' && (
                  <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xl text-left space-y-3">
                    <h4 className="text-sm font-black text-slate-900">Formulir Pengaduan & Aspirasi Warga</h4>
                    <div className="space-y-2.5">
                      <div>
                        <label className="text-xs font-bold text-slate-700 block mb-1">Judul Laporan</label>
                        <div
                          id="active-target"
                          className={`w-full px-3.5 py-2 rounded-xl text-xs font-medium flex items-center transition-all ${
                            isClicked
                              ? 'bg-white border-2 border-emerald-600 ring-2 ring-emerald-200 text-slate-900'
                              : 'bg-slate-50 border border-slate-300 text-slate-400'
                          }`}
                        >
                          <span>{typedText || (isClicked ? '' : 'Tuliskan pokok permasalahan...')}</span>
                          {!isTypingDone && isClicked && !typedText2 && (
                            <span className="inline-block w-0.5 h-4 bg-emerald-700 ml-0.5 animate-pulse" />
                          )}
                        </div>
                      </div>
                      <div>
                        <label className="text-xs font-bold text-slate-700 block mb-1">Rincian Pengaduan</label>
                        <div className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-slate-50 border border-slate-300 text-slate-800 min-h-[56px] flex items-start">
                          <span>{typedText2 || (typedText ? 'Mengetik rincian...' : 'Jelaskan lokasi dusun dan detail kejadian...')}</span>
                          {typedText && !isTypingDone && (
                            <span className="inline-block w-0.5 h-4 bg-emerald-700 ml-0.5 animate-pulse" />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Real Pengaduan Submit */}
                {currentStep.targetId === 'btn_aduan' && (
                  <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xl text-center space-y-3">
                    <button
                      id="active-target"
                      className={`w-full py-3 rounded-xl text-xs font-black transition-all ${
                        isClicked ? 'bg-emerald-700 text-white ring-4 ring-emerald-300 scale-95' : 'bg-emerald-800 text-white'
                      }`}
                    >
                      Kirim Laporan Pengaduan
                    </button>
                    {isClicked && (
                      <div className="text-xs font-black text-emerald-800 animate-in fade-in">
                        Laporan Terkirim! Nomor Tiket: PGD-2026-00042
                      </div>
                    )}
                  </div>
                )}

                {/* Real Login Form (With Automatic Typewriter Effect) */}
                {currentStep.targetId === 'form_login' && (
                  <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xl text-left space-y-3.5">
                    <div className="text-center font-black text-slate-900 text-sm">
                      Masuk ke Sistem Lentera Desa
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">16 Digit NIK e-KTP</label>
                      <div
                        id="active-target"
                        className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-mono font-bold flex items-center transition-all ${
                          isTypingDone
                            ? 'bg-emerald-50 border-2 border-emerald-600 ring-4 ring-emerald-200 text-slate-900'
                            : isClicked
                            ? 'bg-white border-2 border-emerald-500 ring-2 ring-emerald-200 text-slate-900'
                            : 'bg-slate-50 border border-slate-300 text-slate-400'
                        }`}
                      >
                        <span>{typedText || (isClicked ? '' : 'Ketik 16 digit NIK...')}</span>
                        {!isTypingDone && isClicked && (
                          <span className="inline-block w-0.5 h-4 bg-emerald-700 ml-0.5 animate-pulse" />
                        )}
                      </div>
                    </div>
                    <button
                      className={`w-full py-3 rounded-xl text-xs font-black transition-all ${
                        isTypingDone ? 'bg-emerald-700 text-white ring-4 ring-emerald-300 scale-95' : 'bg-emerald-800 text-white'
                      }`}
                    >
                      Masuk Sekarang
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Dynamic Smooth Glide Cursor Arrow */}
            <div
              className={`absolute top-0 left-0 pointer-events-none z-40 transition-all duration-700 ease-out ${
                cursorVisible ? 'opacity-100' : 'opacity-0'
              }`}
              style={{
                transform: `translate3d(${cursorPos.x - 3}px, ${cursorPos.y - 3}px, 0)`,
              }}
            >
              <div className="relative">
                <svg
                  className={`w-7 h-7 filter drop-shadow-lg transition-transform duration-150 ${
                    isClicked ? 'scale-75 translate-x-0.5 translate-y-0.5' : 'scale-100'
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
                {/* Visual Click Pulse Wave */}
                {isClicked && (
                  <span className="absolute -top-3 -left-3 w-10 h-10 rounded-full border-2 border-emerald-400 bg-emerald-400/20 animate-ping pointer-events-none" />
                )}
              </div>
            </div>
          </div>

          {/* Minimalist Subtitle & Video Player Controls (Tanpa Voice Over / Mute) */}
          <div className="mt-3 p-3 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
            {/* Play/Pause, Replay & Clean Subtitle */}
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
                onClick={handleReplay}
                className="p-2 sm:px-2.5 sm:py-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white border border-slate-700 text-xs transition-colors shrink-0"
                title="Ulangi Animasi Langkah Ini"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              {/* Subtitle Instruction */}
              <div className="flex-1 text-xs text-slate-200 font-medium line-clamp-2 pl-2 border-l border-slate-800">
                {currentStep.instruction}
              </div>
            </div>

            {/* Navigation Next / Prev */}
            <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
              <button
                onClick={handlePrevStep}
                disabled={currentStepIndex === 0}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-white text-xs border border-slate-700 flex items-center gap-1 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Sebelumnya</span>
              </button>

              <span className="text-xs font-bold text-slate-300 px-1 font-mono">
                {currentStepIndex + 1} / {totalSteps}
              </span>

              <button
                onClick={handleNextStep}
                disabled={currentStepIndex === totalSteps - 1}
                className="px-3.5 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-600 disabled:opacity-40 text-white text-xs font-bold border border-emerald-600 flex items-center gap-1 transition-colors"
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
