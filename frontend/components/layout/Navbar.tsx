'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import {
  Menu,
  X,
  LayoutDashboard,
  FileText,
  MessageSquare,
  Newspaper,
  Compass,
  Search,
  LogOut,
  User,
  UserPlus,
  UserCheck,
  Edit3
} from 'lucide-react';
import ProfileModal from './ProfileModal';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
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
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          isScrolled
            ? 'bg-white/95 backdrop-blur-md shadow-sm py-2.5 border-b border-slate-200/80'
            : 'bg-white/90 backdrop-blur-sm py-3.5 border-b border-slate-200/60'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4">
            {/* Brand Logo & Village Identification */}
            <Link href="/" className="flex items-center gap-3 group shrink-0">
              <div className="relative w-10 h-10 flex items-center justify-center">
                <Image
                  src="/logo_jeneponto.png"
                  alt="Lambang Kabupaten Jeneponto"
                  width={38}
                  height={38}
                  className="object-contain drop-shadow-xs transition-transform group-hover:scale-105"
                  priority
                />
              </div>
              <div className="flex flex-col">
                <div className="flex items-baseline gap-1.5">
                  <span className="text-lg sm:text-xl font-heading font-black tracking-tight text-slate-900 group-hover:text-emerald-950 transition-colors">
                    Lentera<span className="text-emerald-800">Desa</span>
                  </span>
                </div>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0"></span>
                  <span className="text-[9.5px] uppercase font-bold tracking-wider text-emerald-800 leading-none truncate max-w-[200px] sm:max-w-none">
                    Desa Jombe, Kec. Turatea, Kab. Jeneponto
                  </span>
                </div>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-1">
              <Link
                href="/"
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  pathname === '/'
                    ? 'text-emerald-900 bg-emerald-50 font-bold border border-emerald-100 shadow-2xs'
                    : 'text-slate-600 hover:text-emerald-900 hover:bg-slate-50'
                }`}
              >
                Beranda
              </Link>
              <Link
                href="/profil"
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  pathname === '/profil'
                    ? 'text-emerald-900 bg-emerald-50 font-bold border border-emerald-100 shadow-2xs'
                    : 'text-slate-600 hover:text-emerald-900 hover:bg-slate-50'
                }`}
              >
                <Compass className="w-3.5 h-3.5 text-emerald-700" />
                Profil Desa
              </Link>
              <Link
                href="/layanan"
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  pathname.startsWith('/layanan')
                    ? 'text-emerald-900 bg-emerald-50 font-bold border border-emerald-100 shadow-2xs'
                    : 'text-slate-600 hover:text-emerald-900 hover:bg-slate-50'
                }`}
              >
                <FileText className="w-3.5 h-3.5 text-emerald-700" />
                Layanan Surat
              </Link>
              <Link
                href="/lacak"
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  pathname === '/lacak'
                    ? 'text-emerald-900 bg-emerald-50 font-bold border border-emerald-100 shadow-2xs'
                    : 'text-slate-600 hover:text-emerald-900 hover:bg-slate-50'
                }`}
              >
                <Search className="w-3.5 h-3.5 text-emerald-700" />
                Lacak Surat
              </Link>
              <Link
                href="/pengaduan"
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  pathname === '/pengaduan'
                    ? 'text-emerald-900 bg-emerald-50 font-bold border border-emerald-100 shadow-2xs'
                    : 'text-slate-600 hover:text-emerald-900 hover:bg-slate-50'
                }`}
              >
                <MessageSquare className="w-3.5 h-3.5 text-emerald-700" />
                Pengaduan Warga
              </Link>
              <Link
                href="/berita"
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  pathname.startsWith('/berita')
                    ? 'text-emerald-900 bg-emerald-50 font-bold border border-emerald-100 shadow-2xs'
                    : 'text-slate-600 hover:text-emerald-900 hover:bg-slate-50'
                }`}
              >
                <Newspaper className="w-3.5 h-3.5 text-emerald-700" />
                Berita
              </Link>
            </nav>

            {/* Desktop User Account Actions */}
            <div className="hidden md:flex items-center gap-2 shrink-0">
              {user ? (
                <div className="flex items-center gap-2">
                  {user.role === 'OPERATOR' || user.role === 'ADMIN' ? (
                    <Link
                      href="/operator"
                      className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-amber-100 text-amber-950 border border-amber-300 hover:bg-amber-200 flex items-center gap-1.5 transition-all shadow-2xs"
                    >
                      <LayoutDashboard className="w-3.5 h-3.5 text-amber-800" />
                      <span>Panel Operator</span>
                    </Link>
                  ) : (
                    <Link
                      href="/dashboard"
                      className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-emerald-50 text-emerald-900 border border-emerald-200 hover:bg-emerald-100/80 flex items-center gap-1.5 transition-all shadow-2xs"
                    >
                      <FileText className="w-3.5 h-3.5 text-emerald-700" />
                      <span>Permohonan Saya</span>
                    </Link>
                  )}

                  {/* Clickable User / Citizen Profile Badge */}
                  <button
                    onClick={() => setIsProfileModalOpen(true)}
                    title="Klik untuk Edit Profil Akun Warga"
                    className="flex items-center gap-2 bg-slate-100/90 hover:bg-emerald-50 hover:border-emerald-300 border border-slate-200/80 px-2.5 py-1.5 rounded-xl text-xs transition-all text-left cursor-pointer group shadow-2xs"
                  >
                    <div className="w-6 h-6 rounded-lg bg-emerald-800 text-white flex items-center justify-center font-bold text-[10px] shadow-xs group-hover:scale-105 transition-transform">
                      {user.name?.charAt(0)?.toUpperCase() || 'W'}
                    </div>
                    <div className="flex flex-col">
                      <div className="flex items-center gap-1">
                        <span className="font-bold text-slate-800 group-hover:text-emerald-900 max-w-[110px] truncate leading-tight">
                          {user.name?.split(' ')[0]}
                        </span>
                        <Edit3 className="w-3 h-3 text-slate-400 group-hover:text-emerald-700 transition-colors" />
                      </div>
                      <span className="text-[9px] text-slate-500 group-hover:text-emerald-700/80 leading-none">
                        Edit Profil
                      </span>
                    </div>
                  </button>

                  {/* Logout Button */}
                  <button
                    onClick={handleLogout}
                    title="Keluar Akun"
                    className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors border border-transparent hover:border-rose-100"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link
                    href="/login"
                    className="px-3.5 py-1.5 text-xs font-bold text-slate-700 hover:text-emerald-950 hover:bg-slate-100/80 rounded-xl transition-all flex items-center gap-1.5 border border-slate-200"
                  >
                    <User className="w-3.5 h-3.5 text-slate-500" />
                    <span>Masuk</span>
                  </Link>
                  <Link
                    href="/register"
                    className="px-3.5 py-1.5 text-xs font-bold text-white bg-emerald-800 hover:bg-emerald-900 rounded-xl shadow-xs transition-all flex items-center gap-1.5"
                  >
                    <UserPlus className="w-3.5 h-3.5" />
                    <span>Daftar Warga</span>
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Hamburger Button */}
            <div className="flex items-center gap-2 md:hidden">
              {user && (
                <button
                  onClick={() => setIsProfileModalOpen(true)}
                  className="flex items-center gap-1 bg-emerald-50 text-emerald-900 border border-emerald-200 px-2.5 py-1 rounded-xl text-xs font-bold"
                >
                  <UserCheck className="w-3.5 h-3.5" />
                  <span className="max-w-[70px] truncate">{user.name?.split(' ')[0]}</span>
                </button>
              )}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-xl text-slate-700 hover:bg-slate-100 transition-colors border border-slate-200"
                aria-label="Menu Navigasi"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Drawer Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-b border-slate-200 shadow-xl px-4 pt-3 pb-6 space-y-3 animate-in slide-in-from-top-2 duration-200">
            <nav className="space-y-1 text-xs font-medium">
              <Link
                href="/"
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-3.5 py-2 rounded-xl ${
                  pathname === '/' ? 'text-emerald-900 bg-emerald-50 font-bold' : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                Beranda
              </Link>
              <Link
                href="/profil"
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-3.5 py-2 rounded-xl flex items-center gap-2 ${
                  pathname === '/profil' ? 'text-emerald-900 bg-emerald-50 font-bold' : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <Compass className="w-4 h-4 text-emerald-700" />
                Profil Desa Jombe
              </Link>
              <Link
                href="/layanan"
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-3.5 py-2 rounded-xl flex items-center gap-2 ${
                  pathname.startsWith('/layanan') ? 'text-emerald-900 bg-emerald-50 font-bold' : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <FileText className="w-4 h-4 text-emerald-700" />
                Layanan Surat
              </Link>
              <Link
                href="/lacak"
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-3.5 py-2 rounded-xl flex items-center gap-2 ${
                  pathname === '/lacak' ? 'text-emerald-900 bg-emerald-50 font-bold' : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <Search className="w-4 h-4 text-emerald-700" />
                Lacak Surat & Berkas
              </Link>
              <Link
                href="/pengaduan"
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-3.5 py-2 rounded-xl flex items-center gap-2 ${
                  pathname === '/pengaduan' ? 'text-emerald-900 bg-emerald-50 font-bold' : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <MessageSquare className="w-4 h-4 text-emerald-700" />
                Pengaduan Warga
              </Link>
              <Link
                href="/berita"
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-3.5 py-2 rounded-xl flex items-center gap-2 ${
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
                  <div
                    onClick={() => {
                      setMobileMenuOpen(false);
                      setIsProfileModalOpen(true);
                    }}
                    className="p-3 bg-emerald-50/70 border border-emerald-200/80 rounded-2xl flex items-center justify-between cursor-pointer hover:bg-emerald-100/70 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-emerald-800 text-white flex items-center justify-center font-bold text-xs">
                        {user.name?.charAt(0)?.toUpperCase() || 'W'}
                      </div>
                      <div>
                        <span className="font-bold text-slate-900 block text-xs">{user.name}</span>
                        <span className="text-[10px] text-slate-500 font-mono">NIK: {user.nik}</span>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-800 bg-white px-2 py-1 rounded-lg border border-emerald-200">
                      Edit Profil
                    </span>
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
                    className="w-full text-center py-2 px-4 text-rose-700 text-xs font-bold hover:bg-rose-50 rounded-xl transition-colors"
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

      {/* Edit Profile Modal */}
      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        currentUser={user}
        onProfileUpdated={(updated) => setUser(updated)}
      />
    </>
  );
}
