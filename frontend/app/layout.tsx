import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import AiChatModal from '@/components/ai/AiChatModal';

export const metadata: Metadata = {
  metadataBase: new URL('https://lenteradesajombe.biz.id'),
  title: {
    default: 'Lentera Desa - Pelayanan Digital Desa Jombe',
    template: '%s | Lentera Desa Jombe',
  },
  description: 'Platform resmi pelayanan administrasi desa digital Desa Jombe, Kecamatan Turatea, Kabupaten Jeneponto, Provinsi Sulawesi Selatan. Pengajuan surat online 24 jam, tracking status real-time, dan pengaduan masyarakat.',
  keywords: [
    'Desa Jombe',
    'Lentera Desa',
    'Pelayanan Desa Jombe',
    'lenteradesajombe.biz.id',
    'Kecamatan Turatea',
    'Kabupaten Jeneponto',
    'Surat Keterangan Usaha Jombe',
    'Surat Domisili Desa Jombe',
    'Pengaduan Warga Desa Jombe',
    'Sulawesi Selatan',
  ],
  authors: [{ name: 'Pemerintah Desa Jombe & Tim KKN' }],
  creator: 'Pemerintah Desa Jombe',
  publisher: 'Pemerintah Desa Jombe',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: 'Lentera Desa - Pelayanan Digital Desa Jombe',
    description: 'Layanan administrasi dan surat desa online resmi Desa Jombe, Kec. Turatea, Kab. Jeneponto, Sulawesi Selatan.',
    url: 'https://lenteradesajombe.biz.id',
    siteName: 'Lentera Desa Jombe',
    locale: 'id_ID',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Lentera Desa - Pelayanan Digital Desa Jombe',
    description: 'Layanan administrasi dan surat desa online resmi Desa Jombe, Kec. Turatea, Kab. Jeneponto, Sulawesi Selatan.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || '',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <head>
        {/* Schema.org Structured Data for Google Rich Results */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'GovernmentOrganization',
              name: 'Pemerintah Desa Jombe',
              alternateName: 'Lentera Desa Jombe',
              url: 'https://lentera-desa.vercel.app',
              address: {
                '@type': 'PostalAddress',
                streetAddress: 'Kantor Desa Jombe',
                addressLocality: 'Kecamatan Turatea',
                addressRegion: 'Kabupaten Jeneponto, Sulawesi Selatan',
                postalCode: '92351',
                addressCountry: 'ID',
              },
              contactPoint: {
                '@type': 'ContactPoint',
                telephone: '+62-812-3456-7890',
                contactType: 'Pelayanan Masyarakat',
                availableLanguage: ['Indonesian'],
              },
            }),
          }}
        />
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
