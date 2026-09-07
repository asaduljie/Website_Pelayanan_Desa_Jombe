import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Building2, Phone, Mail, MapPin, Search, ShieldCheck, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-white pt-16 pb-8 border-t border-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-slate-900">
          {/* Brand Info */}
          <div className="md:col-span-1 space-y-4">
            <div className="flex items-center gap-3">
              <Image
                src="/logo_jeneponto.png"
                alt="Logo Kabupaten Jeneponto"
                width={42}
                height={42}
                className="shrink-0 drop-shadow-sm"
              />
              <div>
                <span className="text-lg font-heading font-black tracking-tight text-white block">LENTERA DESA</span>
                <span className="text-[10px] text-emerald-400 uppercase tracking-widest block font-bold">Pelayanan Desa Jombe</span>
              </div>
            </div>
            <p className="text-xs text-gray-300 leading-relaxed">
              Platform pelayanan administrasi digital mandiri Pemerintah Desa Jombe, Kecamatan Turatea, Kabupaten Jeneponto, Sulawesi Selatan. Cepat, transparan, dan dapat diakses 24 jam tanpa perlu mendaftar akun.
            </p>
            <div className="pt-2">
              <Link
                href="/lacak"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-emerald-800 hover:bg-emerald-700 text-white shadow transition-all"
              >
                <Search className="w-3.5 h-3.5" />
                Lacak Dokumen Surat
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-bold text-emerald-400 uppercase tracking-wider mb-4">Layanan Populer</h4>
            <ul className="space-y-2.5 text-xs text-gray-300">
              <li>
                <Link href="/layanan/surat-keterangan-usaha" className="hover:text-white transition-colors">Surat Keterangan Usaha (SKU)</Link>
              </li>
              <li>
                <Link href="/layanan/surat-keterangan-domisili" className="hover:text-white transition-colors">Surat Keterangan Domisili</Link>
              </li>
              <li>
                <Link href="/layanan/surat-keterangan-tidak-mampu" className="hover:text-white transition-colors">Surat Keterangan Tidak Mampu (SKTM)</Link>
              </li>
              <li>
                <Link href="/pengaduan" className="hover:text-white transition-colors">Layanan Pengaduan Warga</Link>
              </li>
            </ul>
          </div>

          {/* Menu Pintas */}
          <div>
            <h4 className="text-sm font-bold text-emerald-400 uppercase tracking-wider mb-4">Informasi Desa</h4>
            <ul className="space-y-2.5 text-xs text-gray-300">
              <li>
                <Link href="/" className="hover:text-white transition-colors">Beranda</Link>
              </li>
              <li>
                <Link href="/profil" className="hover:text-white transition-colors">Profil & Data Riil Penduduk</Link>
              </li>
              <li>
                <Link href="/layanan" className="hover:text-white transition-colors">Katalog Layanan Surat</Link>
              </li>
              <li>
                <Link href="/lacak" className="hover:text-white transition-colors">Lacak Permohonan</Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-white transition-colors flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-400" /> Portal Petugas Desa
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-sm font-bold text-emerald-400 uppercase tracking-wider mb-4">Kantor Desa Jombe</h4>
            <ul className="space-y-3 text-xs text-gray-300">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Kantor Desa Jombe, Kec. Turatea, Kab. Jeneponto, Sulawesi Selatan 92351</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Jam Pelayanan: Senin - Jumat (08.00 - 15.30 WITA)</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>pelayanan@jombe.desa.id</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-400">
          <p>© {new Date().getFullYear()} Pemerintah Desa Jombe. Dikembangkan untuk kemudahan pelayanan masyarakat.</p>
          <div className="flex items-center gap-1 text-[11px] text-gray-500">
            <span>Kabupaten Jeneponto, Sulawesi Selatan</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
