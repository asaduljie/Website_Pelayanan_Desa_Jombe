'use client';

import React, { useState } from 'react';
import {
  Layers,
  Palette,
  Layout,
  Smartphone,
  Monitor,
  ShieldCheck,
  Building2,
  Search,
  Store,
  Home as HomeIcon,
  HeartHandshake,
  MessageSquare,
  Bot,
  FileText,
  CheckCircle2,
  ChevronRight,
  Download,
  Copy,
  Check,
} from 'lucide-react';

export default function FigmaPresentationPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'tokens' | 'web-frames' | 'mobile-frames' | 'flows'>('overview');
  const [copied, setCopied] = useState(false);

  const copyDesignTokens = () => {
    const tokens = {
      name: "JOMBE DIGITAL Design System",
      colors: {
        primary: "#15803D",
        primaryDark: "#14532D",
        accentCream: "#FEF3C7",
        background: "#FCFBF7",
        textDark: "#052E16",
        pending: { bg: "#FEF3C7", text: "#78350F" },
        verified: { bg: "#DBEAFE", text: "#1E40AF" },
        completed: { bg: "#DCFCE7", text: "#166534" },
      },
      typography: {
        fontFamily: "Inter, Plus Jakarta Sans",
        h1: "48px Bold",
        h2: "30px ExtraBold",
        h3: "18px Bold",
        body: "14px Regular",
        code: "JetBrains Mono 14px",
      },
      radius: {
        card: "16px",
        button: "12px",
        badge: "9999px",
      }
    };
    navigator.clipboard.writeText(JSON.stringify(tokens, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#1e1e1e] text-white flex flex-col font-sans">
      {/* Top Figma Header Toolbar */}
      <header className="h-14 bg-[#2c2c2c] border-b border-[#3c3c3c] px-6 flex items-center justify-between shadow-md shrink-0">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            {/* Figma Icon Simulation */}
            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-purple-500 via-pink-500 to-amber-400 flex items-center justify-center font-bold text-xs">
              F
            </div>
            <span className="font-extrabold text-sm tracking-tight">JOMBE DIGITAL — Figma Portfolio Prototype</span>
          </div>
          <span className="px-2.5 py-0.5 rounded-full bg-[#3c3c3c] text-[10px] text-gray-300 font-semibold border border-[#4c4c4c]">
            Interactive Canvas Specs
          </span>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1 bg-[#1e1e1e] p-1 rounded-xl border border-[#3c3c3c]">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'overview' ? 'bg-[#3c3c3c] text-white' : 'text-gray-400 hover:text-white'
            }`}
          >
            Overview & Persona
          </button>
          <button
            onClick={() => setActiveTab('tokens')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'tokens' ? 'bg-[#3c3c3c] text-white' : 'text-gray-400 hover:text-white'
            }`}
          >
            Design Tokens
          </button>
          <button
            onClick={() => setActiveTab('web-frames')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'web-frames' ? 'bg-[#3c3c3c] text-white' : 'text-gray-400 hover:text-white'
            }`}
          >
            Web Canvas (1440px)
          </button>
          <button
            onClick={() => setActiveTab('mobile-frames')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'mobile-frames' ? 'bg-[#3c3c3c] text-white' : 'text-gray-400 hover:text-white'
            }`}
          >
            Mobile App (Android)
          </button>
        </div>

        <button
          onClick={copyDesignTokens}
          className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm"
        >
          {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
          {copied ? 'Tokens Copied!' : 'Copy Figma JSON'}
        </button>
      </header>

      {/* Main Figma Workspace Canvas */}
      <main className="flex-1 bg-[#121212] overflow-y-auto p-6 sm:p-10">
        {/* OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-200">
            <div className="bg-[#2c2c2c] border border-[#3c3c3c] rounded-3xl p-8 space-y-4">
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">Figma Presentation Slide 1</span>
              <h1 className="text-3xl font-extrabold">Executive Summary — Sistem Pelayanan Digital Desa Jombe</h1>
              <p className="text-xs text-gray-300 leading-relaxed max-w-3xl">
                JOMBE DIGITAL diciptakan untuk mentransformasi pelayanan administrasi desa dari cara konvensional (mengantre & formulir kertas) menjadi platform terpadu Web & Android real-time dengan proteksi keamanan data penduduk kelas dunia.
              </p>
            </div>

            {/* Persona Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-[#2c2c2c] p-6 rounded-2xl border border-[#3c3c3c] space-y-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-900/60 text-emerald-300 flex items-center justify-center font-bold">
                  👩‍💻
                </div>
                <h3 className="text-base font-bold text-white">Warga Mandiri</h3>
                <p className="text-xs text-gray-400 leading-relaxed">
                  Ingin mengajukan SKU / Surat Domisili langsung dari HP/Laptop tanpa mengantre di kantor desa.
                </p>
                <span className="text-[11px] text-emerald-400 font-semibold block pt-2 border-t border-[#3c3c3c]">
                  ✓ Solusi: Web & App Dynamic Form
                </span>
              </div>

              <div className="bg-[#2c2c2c] p-6 rounded-2xl border border-[#3c3c3c] space-y-3">
                <div className="w-10 h-10 rounded-xl bg-amber-900/60 text-amber-300 flex items-center justify-center font-bold">
                  👴
                </div>
                <h3 className="text-base font-bold text-white">Warga Awam (Plan B WA)</h3>
                <p className="text-xs text-gray-400 leading-relaxed">
                  Lansia / warga yang kurang mahir teknologi, butuh jalur pelayanan fleksibel via WhatsApp.
                </p>
                <span className="text-[11px] text-amber-400 font-semibold block pt-2 border-t border-[#3c3c3c]">
                  ✓ Solusi: Assisted WA Input Operator
                </span>
              </div>

              <div className="bg-[#2c2c2c] p-6 rounded-2xl border border-[#3c3c3c] space-y-3">
                <div className="w-10 h-10 rounded-xl bg-blue-900/60 text-blue-300 flex items-center justify-center font-bold">
                  👔
                </div>
                <h3 className="text-base font-bold text-white">Operator Desa</h3>
                <p className="text-xs text-gray-400 leading-relaxed">
                  Memeriksa kelengkapan berkas KTP/KK, memverifikasi status, dan menerbitkan surat PDF resmi.
                </p>
                <span className="text-[11px] text-blue-400 font-semibold block pt-2 border-t border-[#3c3c3c]">
                  ✓ Solusi: Operator Verifier Dashboard
                </span>
              </div>
            </div>
          </div>
        )}

        {/* TOKENS TAB */}
        {activeTab === 'tokens' && (
          <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-200">
            <div className="bg-[#2c2c2c] border border-[#3c3c3c] rounded-3xl p-8 space-y-4">
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">Figma Design System Tokens</span>
              <h2 className="text-2xl font-extrabold">Color Palette & Typography Specs</h2>
              <p className="text-xs text-gray-300">Spesifikasi token warna dan tipografi resmi yang digunakan di Figma Canvas JOMBE DIGITAL.</p>
            </div>

            {/* Color Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-[#15803D] p-5 rounded-2xl space-y-2 text-white shadow-lg">
                <span className="text-xs font-bold block">Primary Green</span>
                <span className="text-xs font-mono opacity-90 block">#15803D</span>
                <span className="text-[10px] block opacity-75">Hijau Utama Desa</span>
              </div>
              <div className="bg-[#14532D] p-5 rounded-2xl space-y-2 text-white shadow-lg">
                <span className="text-xs font-bold block">Primary Dark</span>
                <span className="text-xs font-mono opacity-90 block">#14532D</span>
                <span className="text-[10px] block opacity-75">Header & Footer</span>
              </div>
              <div className="bg-[#FEF3C7] p-5 rounded-2xl space-y-2 text-amber-950 shadow-lg">
                <span className="text-xs font-bold block">Accent Warm Cream</span>
                <span className="text-xs font-mono opacity-90 block">#FEF3C7</span>
                <span className="text-[10px] block opacity-75">Badges & Accents</span>
              </div>
              <div className="bg-[#FCFBF7] p-5 rounded-2xl space-y-2 text-gray-900 shadow-lg">
                <span className="text-xs font-bold block">Canvas Off-White</span>
                <span className="text-xs font-mono opacity-90 block">#FCFBF7</span>
                <span className="text-[10px] block opacity-75">Background Web</span>
              </div>
            </div>
          </div>
        )}

        {/* WEB CANVAS FRAMES TAB */}
        {activeTab === 'web-frames' && (
          <div className="max-w-6xl mx-auto space-y-10 animate-in fade-in duration-200">
            {/* Mockup Desktop Frame 1: Homepage */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-gray-400">
                <span className="font-mono font-bold text-emerald-400">Frame 1: Homepage (1440 x 1024)</span>
                <span>Desktop Layout</span>
              </div>
              <div className="bg-[#FCFBF7] text-gray-900 rounded-3xl p-8 border-4 border-[#3c3c3c] shadow-2xl space-y-8">
                {/* Hero Header Mockup */}
                <div className="bg-gradient-to-r from-[#14532D] to-[#15803D] text-white p-8 rounded-2xl space-y-4 text-center">
                  <span className="text-xs bg-white/20 px-3 py-1 rounded-full font-semibold">Pelayanan Digital Desa Jombe</span>
                  <h1 className="text-2xl font-extrabold">Selamat Datang di Desa Jombe</h1>
                  <p className="text-xs text-emerald-100 max-w-md mx-auto">Akses pelayanan desa dengan mudah, cepat, dan transparan.</p>
                  <div className="pt-2 flex justify-center gap-2">
                    <span className="px-4 py-2 bg-emerald-500 text-white rounded-xl text-xs font-bold">Ajukan Layanan</span>
                    <span className="px-4 py-2 bg-white/20 text-white rounded-xl text-xs font-medium">Jelajahi Desa</span>
                  </div>
                </div>

                {/* Tracking Widget Mockup */}
                <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-md space-y-3">
                  <h3 className="text-sm font-bold text-gray-900">Cek Status Permohonan Surat</h3>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      readOnly
                      value="JMB-2026-00012"
                      className="flex-1 px-3 py-2 text-xs border border-gray-300 rounded-xl bg-gray-50 font-mono font-bold"
                    />
                    <button className="px-4 py-2 bg-jombe-800 text-white rounded-xl text-xs font-bold">Lacak</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* MOBILE FRAMES TAB */}
        {activeTab === 'mobile-frames' && (
          <div className="max-w-4xl mx-auto flex justify-center gap-8 animate-in fade-in duration-200">
            {/* Mobile Screen Mockup Frame */}
            <div className="w-[340px] h-[640px] bg-[#FCFBF7] text-gray-900 rounded-[40px] border-8 border-[#3c3c3c] shadow-2xl overflow-hidden flex flex-col">
              {/* Status Bar */}
              <div className="bg-[#15803D] text-white px-6 pt-3 pb-2 flex justify-between items-center text-[10px]">
                <span className="font-mono">09:41</span>
                <span>📶 🔋</span>
              </div>
              {/* App Bar */}
              <div className="bg-[#15803D] text-white px-4 py-3 flex items-center gap-2">
                <Building2 className="w-5 h-5" />
                <div>
                  <span className="text-xs font-bold block">JOMBE DIGITAL</span>
                  <span className="text-[9px] text-emerald-200 block">Halo, Siti Rahmawati</span>
                </div>
              </div>
              {/* Body */}
              <div className="p-4 flex-1 space-y-4 overflow-y-auto">
                <div className="bg-white p-3 rounded-xl border border-gray-200 flex items-center gap-2 text-xs text-gray-400">
                  <Search className="w-4 h-4" /> Cari layanan...
                </div>
                <div className="grid grid-cols-4 gap-2 text-center text-[10px]">
                  <div className="bg-amber-100 p-2 rounded-xl text-amber-900 font-bold">Surat</div>
                  <div className="bg-blue-100 p-2 rounded-xl text-blue-900 font-bold">Admin</div>
                  <div className="bg-emerald-100 p-2 rounded-xl text-emerald-900 font-bold">Bantuan</div>
                  <div className="bg-purple-100 p-2 rounded-xl text-purple-900 font-bold">Pengaduan</div>
                </div>
                <div className="bg-white p-3 rounded-xl border border-gray-200 space-y-1">
                  <span className="text-[10px] font-bold text-gray-400">Permohonan Terbaru</span>
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-gray-800">Surat Keterangan Usaha</span>
                    <span className="text-[9px] px-2 py-0.5 bg-emerald-100 text-emerald-800 font-bold rounded-full">SELESAI</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
