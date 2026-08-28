'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Landmark, User, LogOut, Menu, X, Bell, LayoutDashboard, FileText, MessageSquare, HelpCircle, Newspaper, Info } from 'lucide-react';

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
          {/* Brand Logo & Name */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div>
              <span className="text-xl sm:text-2xl font-heading font-black tracking-tight text-slate-900 block leading-none group-hover:text-emerald-950 transition-colors">
                <span className="text-emerald-950">Lentera</span> <span className="bg-gradient-to-r from-emerald-800 to-amber-600 bg-clip-text text-transparent">Desa</span>
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
              href="/berita"
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors ${
                pathname.startsWith('/berita') ? 'text-emerald-900 bg-emerald-50' : 'text-slate-600 hover:text-emerald-800 hover:bg-slate-50'
              }`}
            >
              Berita & Informasi
            </Link>
            <Link
              href="/pengaduan"
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors ${
                pathname === '/pengaduan' ? 'text-emerald-900 bg-emerald-50' : 'text-slate-600 hover:text-emerald-800 hover:bg-slate-50'
              }`}
            >
              Pengaduan Warga
            </Link>
            <a
              href="https://wa.me/6285151199485?text=Halo%20Bot%20Pelayanan%20Desa%20Jombe%2C%20saya%20ingin%20mengajukan%20permohonan%20surat."
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5 text-emerald-800 bg-emerald-50/80 hover:bg-emerald-100/70 border border-emerald-200/80 shadow-xs"
            >
              <MessageSquare className="w-3.5 h-3.5 text-emerald-700" />
              Layanan WhatsApp
            </a>
          </nav>

          {/* Desktop User Account Actions */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-2.5">
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

                {/* Profil Pengguna Nav Link dengan Foto & Role */}
                <Link
                  href="/profil"
                  className={`px-3 py-1.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2.5 border shadow-2xs ${
                    pathname === '/profil'
                      ? 'bg-emerald-900 text-white border-emerald-700 shadow-sm'
                      : 'bg-white text-slate-800 hover:bg-emerald-50/50 hover:border-emerald-200 border-slate-200'
                  }`}
                  title="Lihat Profil Pengguna"
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-extrabold shadow-inner shrink-0 ${
                    pathname === '/profil'
                      ? 'bg-emerald-600 text-white border-2 border-emerald-300'
                      : user.role === 'OPERATOR' || user.role === 'ADMIN'
                      ? 'bg-amber-100 text-amber-900 border-2 border-amber-300'
                      : 'bg-emerald-100 text-emerald-900 border-2 border-emerald-300'
                  }`}>
                    {user.name?.charAt(0)?.toUpperCase() || 'W'}
                  </div>
                  <div className="text-left leading-tight">
                    <span className="block text-xs font-extrabold max-w-[110px] truncate">
                      {user.name?.split(' ')[0] || 'Pengguna'}
                    </span>
                    <span className={`text-[9px] font-black uppercase tracking-wider block ${
                      pathname === '/profil'
                        ? 'text-emerald-200'
                        : user.role === 'OPERATOR' || user.role === 'ADMIN'
                        ? 'text-amber-800'
                        : 'text-emerald-800'
                    }`}>
                      {user.role === 'OPERATOR' ? 'Operator' : user.role === 'ADMIN' ? 'Admin' : 'Warga'}
                    </span>
                  </div>
                </Link>

                <button
                  onClick={handleLogout}
                  title="Keluar"
                  className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
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
              href="/layanan"
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-3.5 py-2.5 rounded-xl ${
                pathname.startsWith('/layanan') ? 'text-emerald-900 bg-emerald-50 font-bold' : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              Layanan Surat
            </Link>
            <Link
              href="/berita"
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-3.5 py-2.5 rounded-xl ${
                pathname.startsWith('/berita') ? 'text-emerald-900 bg-emerald-50 font-bold' : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              Berita & Informasi
            </Link>
            <Link
              href="/pengaduan"
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-3.5 py-2.5 rounded-xl ${
                pathname === '/pengaduan' ? 'text-emerald-900 bg-emerald-50 font-bold' : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              Pengaduan Warga
            </Link>
            <a
              href="https://wa.me/6285151199485?text=Halo%20Bot%20Pelayanan%20Desa%20Jombe%2C%20saya%20ingin%20mengajukan%20permohonan%20surat."
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3.5 py-2.5 rounded-xl text-emerald-800 bg-emerald-50/80 font-bold border border-emerald-200/80 flex items-center gap-2"
            >
              <MessageSquare className="w-4 h-4 text-emerald-700" />
              Layanan WhatsApp (0851-5119-9485)
            </a>
          </nav>

          <div className="pt-3 border-t border-slate-100">
            {user ? (
              <div className="space-y-2">
                <Link
                  href="/profil"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 p-3 bg-emerald-50/80 rounded-2xl border border-emerald-200 text-emerald-950 shadow-2xs"
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-extrabold text-sm shadow-sm shrink-0 ${
                    user.role === 'OPERATOR' || user.role === 'ADMIN'
                      ? 'bg-amber-500 text-amber-950 border-2 border-amber-300'
                      : 'bg-emerald-800 text-white border-2 border-emerald-400'
                  }`}>
                    {user.name?.charAt(0)?.toUpperCase() || 'W'}
                  </div>
                  <div className="flex-1">
                    <span className="text-xs font-extrabold block text-slate-900">{user.name}</span>
                    <span className="text-[10px] text-emerald-800 font-bold uppercase tracking-wider block">
                      Peran: {user.role === 'OPERATOR' ? 'Operator Desa' : user.role === 'ADMIN' ? 'Administrator' : 'Warga Desa'}
                    </span>
                  </div>
                </Link>

                {user.role === 'OPERATOR' || user.role === 'ADMIN' ? (
                  <Link
                    href="/operator"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block text-center py-2.5 px-4 bg-amber-500 text-amber-950 font-bold text-xs rounded-xl"
                  >
                    Panel Operator
                  </Link>
                ) : (
                  <Link
                    href="/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block text-center py-2.5 px-4 bg-emerald-800 text-white font-bold text-xs rounded-xl"
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
                  className="text-center py-2.5 text-xs font-bold text-emerald-900 bg-emerald-50 rounded-xl"
                >
                  Masuk
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center py-2.5 text-xs font-bold text-white bg-emerald-800 rounded-xl"
                >
                  Daftar
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
