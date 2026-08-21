import React from 'react';
import Link from 'next/link';
import { Building2, Phone, Mail, MapPin, MessageSquare, ShieldCheck, Heart } from 'lucide-react';

export default function Footer() {
  const operatorWa = process.env.NEXT_PUBLIC_OPERATOR_WA || '6281234567890';
  const waUrl = `https://wa.me/${operatorWa}?text=Halo%20Operator%20Desa%20Jombe%2C%20saya%20ingin%20menanyakan%20pelayanan%20desa.`;

  return (
    <footer className="bg-jombe-950 text-white pt-16 pb-8 border-t border-jombe-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-jombe-900">
          {/* Brand Info */}
          <div className="md:col-span-1 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-800 to-amber-600 text-amber-200 flex items-center justify-center shadow-lg border border-amber-400/30 font-black text-xs">
                LD
              </div>
              <div>
                <span className="text-lg font-heading font-black tracking-tight text-white block">LENTERA DESA</span>
                <span className="text-[10px] text-emerald-300 uppercase tracking-widest block font-bold">Pelayanan Desa Jombe</span>
              </div>
            </div>
            <p className="text-xs text-gray-300 leading-relaxed">
              Platform pelayanan administrasi digital resmi Pemerintah Desa Jombe, Kecamatan Jombang. Lebih mudah, cepat, transparan, dan dapat diakses 24 jam.
            </p>
            <div className="pt-2">
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white shadow transition-all"
              >
                <MessageSquare className="w-4 h-4" />
                Hubungi WA Operator
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-bold text-jombe-300 uppercase tracking-wider mb-4">Layanan Populer</h4>
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
            <h4 className="text-sm font-bold text-jombe-300 uppercase tracking-wider mb-4">Menu Pintas</h4>
            <ul className="space-y-2.5 text-xs text-gray-300">
              <li>
                <Link href="/" className="hover:text-white transition-colors">Beranda</Link>
              </li>
              <li>
                <Link href="/profil" className="hover:text-white transition-colors">Profil & Sejarah Desa</Link>
              </li>
              <li>
                <Link href="/layanan" className="hover:text-white transition-colors">Semua Layanan Surat</Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-white transition-colors">Masuk / Daftar Akun</Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-sm font-bold text-jombe-300 uppercase tracking-wider mb-4">Kantor Desa Jombe</h4>
            <ul className="space-y-3 text-xs text-gray-300">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-jombe-400 shrink-0 mt-0.5" />
                <span>Jl. Raya Desa Jombe No. 01, Kecamatan Jombang, Kabupaten Jombang, Jawa Timur 61419</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-jombe-400 shrink-0" />
                <span>(0321) 888-999 / WA: +62 812-3456-7890</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-jombe-400 shrink-0" />
                <span>pelayanan@jombe.desa.id</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-400">
          <p>© {new Date().getFullYear()} Pemerintah Desa Jombe. Seluruh hak cipta dilindungi.</p>
          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-1 text-jombe-400 font-semibold">
              <ShieldCheck className="w-4 h-4" /> Enkripsi SSL & Data Aman
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
