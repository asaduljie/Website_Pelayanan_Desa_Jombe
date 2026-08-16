'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Landmark, User, LogOut, Menu, X, Bell, LayoutDashboard, FileText, MessageSquare, HelpCircle } from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);

    if (typeof window !== 'undefined') {
      const storedUser = localStorage.getItem('jombe_user');
      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch (e) {}
      }
    }

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('jombe_token');
    localStorage.removeItem('jombe_user');
    setUser(null);
    router.push('/login');
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-md shadow-sm py-3 border-b border-slate-200/80'
          : 'bg-white/80 backdrop-blur-sm py-4 border-b border-slate-200/60'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-900 to-emerald-700 text-white flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
              <Landmark className="w-5 h-5 text-emerald-200" />
            </div>
            <div>
              <span className="text-lg font-extrabold tracking-tight text-slate-900 block leading-tight">
                JOMBE DIGITAL
              </span>
              <span className="text-[10px] uppercase font-semibold tracking-wider text-emerald-800 block">
                Pemerintah Desa Jombe
              </span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            <Link
              href="/"
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors ${
                pathname === '/' ? 'text-emerald-900 bg-emerald-50' : 'text-slate-600 hover:text-emerald-800 hover:bg-slate-50'
              }`}
            >
              Beranda
            </Link>
            <Link
              href="/layanan"
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors ${
                pathname.startsWith('/layanan') ? 'text-emerald-900 bg-emerald-50' : 'text-slate-600 hover:text-emerald-800 hover:bg-slate-50'
              }`}
            >
              Layanan Surat
            </Link>
            <Link
              href="/profil"
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors ${
                pathname === '/profil' ? 'text-emerald-900 bg-emerald-50' : 'text-slate-600 hover:text-emerald-800 hover:bg-slate-50'
              }`}
            >
              Profil Wilayah
            </Link>
            <Link
              href="/pengaduan"
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors ${
                pathname === '/pengaduan' ? 'text-emerald-900 bg-emerald-50' : 'text-slate-600 hover:text-emerald-800 hover:bg-slate-50'
              }`}
            >
              Pengaduan Warga
            </Link>
            <Link
              href="/wa-bot"
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5 text-emerald-800 bg-emerald-50/80 hover:bg-emerald-100/70 border border-emerald-200/80`}
            >
              <MessageSquare className="w-3.5 h-3.5 text-emerald-700" />
              Layanan WhatsApp
            </Link>
          </nav>

          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-3">
                {user.role === 'OPERATOR' || user.role === 'ADMIN' ? (
                  <Link
                    href="/operator"
                    className="px-3.5 py-2 rounded-xl text-xs font-bold bg-amber-50 text-amber-900 border border-amber-200 hover:bg-amber-100 flex items-center gap-1.5 transition-all"
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    Panel Operator
                  </Link>
                ) : (
                  <Link
                    href="/dashboard"
                    className="px-3.5 py-2 rounded-xl text-xs font-bold bg-emerald-50 text-emerald-900 border border-emerald-200 hover:bg-emerald-100 flex items-center gap-1.5 transition-all"
                  >
                    <FileText className="w-4 h-4" />
                    Permohonan Saya
                  </Link>
                )}

                <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
                  <div className="text-right">
                    <span className="text-xs font-bold text-slate-900 block leading-tight">{user.name}</span>
                    <span className="text-[10px] text-slate-500 uppercase block font-semibold">{user.role}</span>
                  </div>
                  <button
                    onClick={handleLogout}
                    title="Keluar"
                    className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className="px-4 py-2 text-xs font-bold text-emerald-900 hover:bg-emerald-50 rounded-xl transition-colors"
                >
                  Masuk Akun
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-2 text-xs font-bold text-white bg-emerald-800 hover:bg-emerald-900 rounded-xl shadow-xs transition-all"
                >
                  Daftar Warga
                </Link>
              </div>
            )}
          </div>

          <div className="md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-700 hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
