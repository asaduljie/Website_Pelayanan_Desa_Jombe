import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import AiChatModal from '@/components/ai/AiChatModal';

export const metadata: Metadata = {
  title: 'JOMBE DIGITAL - Pelayanan Desa Jombe dalam Genggaman',
  description: 'Platform resmi pelayanan administrasi desa digital Desa Jombe, Kecamatan Jombang. Pengajuan surat online, tracking status real-time, dan pengaduan masyarakat.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1 pt-20">
          {children}
        </main>
        <Footer />
        <AiChatModal />
      </body>
    </html>
  );
}
