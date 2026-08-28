import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://lenteradesajombe.biz.id';
  const currentDate = new Date().toISOString();

  // Public searchable routes
  const routes = [
    '',
    '/layanan',
    '/layanan/surat-keterangan-usaha',
    '/layanan/surat-keterangan-domisili',
    '/layanan/surat-keterangan-tidak-mampu',
    '/layanan/surat-keterangan-kelakuan-baik',
    '/layanan/surat-keterangan-kematian',
    '/layanan/surat-keterangan-belum-menikah',
    '/berita',
    '/profil',
    '/pengaduan',
    '/login',
    '/register',
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: currentDate,
    changeFrequency: route === '' || route === '/berita' ? 'daily' : 'weekly',
    priority: route === '' ? 1.0 : route.startsWith('/layanan') ? 0.9 : 0.8,
  }));
}
