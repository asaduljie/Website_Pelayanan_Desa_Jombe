import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import AiChatModal from '@/components/ai/AiChatModal';

export const metadata: Metadata = {
  title: 'Lentera Desa - Pelayanan Digital Desa Jombe',
  description: 'Platform resmi pelayanan administrasi desa digital Desa Jombe, Kecamatan Turatea, Kabupaten Jeneponto, Provinsi Sulawesi Selatan. Pengajuan surat online, tracking status real-time, dan pengaduan masyarakat.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Ignore third-party Chrome Extension runtime errors from polluting dev overlay
              if (typeof window !== 'undefined') {
                window.addEventListener('error', function(e) {
                  if (e.filename && e.filename.includes('chrome-extension://')) {
                    e.stopImmediatePropagation();
                    e.preventDefault();
                  }
                }, true);
              }
            `,
          }}
        />
      </head>
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
