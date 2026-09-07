'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Menu,
  X,
  LayoutDashboard,
  FileText,
  MessageSquare,
  Newspaper,
  ShieldCheck,
  Compass,
  Search,
  LogOut,
  User,
  UserPlus
} from 'lucide-react';

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

    const syncUser = () => {
      if (typeof window !== 'undefined') {
        const storedUser = localStorage.getItem('jombe_user');
        if (storedUser) {
          try {
            setUser(JSON.parse(storedUser));
          } catch (e) {
            setUser(null);
          }
        } else {
          setUser(null);
        }
      }
    };

    syncUser();

    window.addEventListener('storage', syncUser);
    window.addEventListener('jombe-auth-changed', syncUser);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('storage', syncUser);
      window.removeEventListener('jombe-auth-changed', syncUser);
    };
  }, [pathname]);

  const handleLogout = () => {
    localStorage.removeItem('jombe_token');
    localStorage.removeItem('jombe_user');
    setUser(null);
    window.dispatchEvent(new Event('jombe-auth-changed'));
    router.push('/');
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-md shadow-sm py-3 border-b border-slate-200/80'
          : 'bg-white/85 backdrop-blur-sm py-4 border-b border-slate-200/60'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Brand Logo & Name */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div>
              <span className="text-xl sm:text-2xl font-heading font-black tracking-tight text-slate-900 block leading-none group-hover:text-emerald-950 transition-colors">
                <span className="text-emerald-950">Lentera</span>{' '}
                <span className="bg-gradient-to-r from-emerald-800 to-amber-600 bg-clip-text text-transparent">
                  Desa
                </span>
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-800 block mt-1 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                Desa Jombe, Kec. Turatea, Kab. Jeneponto
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            <Link
              href="/"
              className={`px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${
                pathname === '/' ? 'text-emerald-900 bg-emerald-50 font-bold' : 'text-slate-600 hover:text-emerald-800 hover:bg-slate-50'
              }`}
            >
              Beranda
            </Link>
            <Link
              href="/profil"
              className={`px-3 py-2 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1 ${
                pathname === '/profil' ? 'text-emerald-900 bg-emerald-50 font-bold' : 'text-slate-600 hover:text-emerald-800 hover:bg-slate-50'
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              Profil Desa
            </Link>
            <Link
              href="/layanan"
              className={`px-3 py-2 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1 ${
                pathname.startsWith('/layanan') ? 'text-emerald-900 bg-emerald-50 font-bold' : 'text-slate-600 hover:text-emerald-800 hover:bg-slate-50'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              Layanan Surat
            </Link>
            <Link
              href="/lacak"
              className={`px-3 py-2 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1 ${
                pathname === '/lacak' ? 'text-emerald-900 bg-emerald-50 font-bold' : 'text-slate-600 hover:text-emerald-800 hover:bg-slate-50'
              }`}
            >
              <Search className="w-3.5 h-3.5" />
              Lacak Surat
            </Link>
            <Link
              href="/pengaduan"
              className={`px-3 py-2 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1 ${
                pathname === '/pengaduan' ? 'text-emerald-900 bg-emerald-50 font-bold' : 'text-slate-600 hover:text-emerald-800 hover:bg-slate-50'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              Pengaduan Warga
            </Link>
            <Link
              href="/berita"
              className={`px-3 py-2 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1 ${
                pathname.startsWith('/berita') ? 'text-emerald-900 bg-emerald-50 font-bold' : 'text-slate-600 hover:text-emerald-800 hover:bg-slate-50'
              }`}
            >
              <Newspaper className="w-3.5 h-3.5" />
              Berita
            </Link>
          </nav>

          {/* Desktop User Account Actions */}
          <div className="hidden md:flex items-center gap-2">
            {user ? (
              <div className="flex items-center gap-2.5">
                {user.role === 'OPERATOR' || user.role === 'ADMIN' ? (
                  <Link
                    href="/operator"
                    className="px-3.5 py-2 rounded-xl text-xs font-bold bg-amber-100 text-amber-950 border border-amber-300 hover:bg-amber-200 flex items-center gap-1.5 transition-all shadow-2xs"
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    <span>Panel Operator</span>
                  </Link>
                ) : (
                  <Link
                    href="/dashboard"
                    className="px-3.5 py-2 rounded-xl text-xs font-bold bg-emerald-50 text-emerald-900 border border-emerald-200 hover:bg-emerald-100 flex items-center gap-1.5 transition-all shadow-2xs"
                  >
                    <FileText className="w-4 h-4" />
                    <span>Permohonan Saya</span>
                  </Link>
                )}

                <div className="flex items-center gap-2 bg-slate-100 px-3 py-1.5 rounded-xl text-xs">
                  <div className="w-6 h-6 rounded-full bg-emerald-800 text-white flex items-center justify-center font-bold text-[10px]">
                    {user.name?.charAt(0)?.toUpperCase() || 'W'}
                  </div>
                  <span className="font-bold text-slate-800 max-w-[100px] truncate">{user.name?.split(' ')[0]}</span>
                </div>

                <button
                  onClick={handleLogout}
                  title="Keluar Akun"
                  className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className="px-3.5 py-2 text-xs font-bold text-slate-700 hover:text-emerald-900 hover:bg-slate-100 rounded-xl transition-all flex items-center gap-1.5 border border-slate-200"
                >
                  <User className="w-3.5 h-3.5 text-slate-600" />
                  <span>Masuk</span>
                </Link>
                <Link
                  href="/register"
                  className="px-3.5 py-2 text-xs font-bold text-white bg-emerald-800 hover:bg-emerald-900 rounded-xl shadow-xs transition-all flex items-center gap-1.5"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Daftar Warga</span>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Hamburger Button */}
          <div className="md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-700 hover:bg-slate-100 transition-colors"
              aria-label="Menu Navigasi"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 shadow-xl px-4 pt-3 pb-6 space-y-3 animate-in slide-in-from-top-2 duration-200">
          <nav className="space-y-1 text-sm font-medium">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-3.5 py-2.5 rounded-xl ${
                pathname === '/' ? 'text-emerald-900 bg-emerald-50 font-bold' : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              Beranda
            </Link>
            <Link
              href="/profil"
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-3.5 py-2.5 rounded-xl flex items-center gap-2 ${
                pathname === '/profil' ? 'text-emerald-900 bg-emerald-50 font-bold' : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              <Compass className="w-4 h-4 text-emerald-700" />
              Profil Desa Jombe
            </Link>
            <Link
              href="/layanan"
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-3.5 py-2.5 rounded-xl flex items-center gap-2 ${
                pathname.startsWith('/layanan') ? 'text-emerald-900 bg-emerald-50 font-bold' : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              <FileText className="w-4 h-4 text-emerald-700" />
              Layanan Surat
            </Link>
            <Link
              href="/lacak"
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-3.5 py-2.5 rounded-xl flex items-center gap-2 ${
                pathname === '/lacak' ? 'text-emerald-900 bg-emerald-50 font-bold' : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              <Search className="w-4 h-4 text-emerald-700" />
              Lacak Surat & Berkas
            </Link>
            <Link
              href="/pengaduan"
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-3.5 py-2.5 rounded-xl flex items-center gap-2 ${
                pathname === '/pengaduan' ? 'text-emerald-900 bg-emerald-50 font-bold' : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              <MessageSquare className="w-4 h-4 text-emerald-700" />
              Pengaduan Warga
            </Link>
            <Link
              href="/berita"
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-3.5 py-2.5 rounded-xl flex items-center gap-2 ${
                pathname.startsWith('/berita') ? 'text-emerald-900 bg-emerald-50 font-bold' : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              <Newspaper className="w-4 h-4 text-emerald-700" />
              Berita & Informasi
            </Link>
          </nav>

          <div className="pt-3 border-t border-slate-100">
            {user ? (
              <div className="space-y-2">
                <div className="p-3 bg-slate-50 rounded-2xl flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-emerald-800 text-white flex items-center justify-center font-bold text-xs">
                    {user.name?.charAt(0)?.toUpperCase() || 'W'}
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 block text-xs">{user.name}</span>
                    <span className="text-[10px] text-slate-500 font-mono">NIK: {user.nik}</span>
                  </div>
                </div>

                {user.role === 'OPERATOR' || user.role === 'ADMIN' ? (
                  <Link
                    href="/operator"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block text-center py-2.5 px-4 bg-amber-500 text-amber-950 font-bold text-xs rounded-xl shadow-xs"
                  >
                    Panel Operator Desa
                  </Link>
                ) : (
                  <Link
                    href="/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block text-center py-2.5 px-4 bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-xs"
                  >
                    Permohonan Saya
                  </Link>
                )}
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleLogout();
                  }}
                  className="w-full text-center py-2 px-4 text-rose-700 text-xs font-bold hover:bg-rose-50 rounded-xl"
                >
                  Keluar Akun
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-center py-2.5 text-xs font-bold text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-xl"
                >
                  Masuk
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-center py-2.5 text-xs font-bold text-white bg-emerald-800 hover:bg-emerald-900 rounded-xl"
                >
                  Daftar Warga
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
