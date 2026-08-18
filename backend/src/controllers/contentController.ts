import { Request, Response } from 'express';
import prisma from '../config/db';
import { waApplicationsStore } from './whatsappBotController';
import { PersistentDatabase, NewsRecord, AnnouncementRecord } from '../utils/persistentDb';
import { AuthRequest } from '../middleware/auth';

const defaultProfile = {
  id: 'default',
  name: 'Desa Jombe',
  address: 'Jl. Raya Desa Jombe No. 01, Kec. Jombang, Kab. Jombang, Jawa Timur 61419',
  phone: '0812-3456-7890',
  email: 'pemdes@jombe.desa.id',
  vision: 'Terwujudnya Desa Jombe yang Mandiri, Sejahtera, Transparan, dan Berkelanjutan Berbasis Pelayanan Digital.',
  mission: '1. Meningkatkan kualitas pelayanan publik secara cepat dan transparan.\n2. Mengembangkan sarana dan prasarana infrastruktur desa yang merata.\n3. Memajukan ekonomi kerakyatan melalui digitalisasi UMKM desa.',
};

const defaultStats = {
  id: 'default',
  totalPopulation: 3850,
  totalFamily: 1120,
  malePopulation: 1920,
  femalePopulation: 1930,
  totalDusun: 4,
  totalRw: 8,
  totalRt: 18,
  availableServices: 3,
  completedApplications: 142,
  totalApplications: 154,
};

export const getVillageProfile = async (req: Request, res: Response) => {
  try {
    let profile: any = null;
    let stats: any = null;

    try {
      profile = await prisma.villageProfile.findUnique({ where: { id: 'default' } });
      stats = await prisma.villageStatistic.findUnique({ where: { id: 'default' } });
    } catch (e) {}

    const completedFromStore = waApplicationsStore.filter((w) => w.status === 'COMPLETED').length;
    const totalFromStore = waApplicationsStore.length;

    return res.status(200).json({
      status: 'success',
      data: {
        profile: profile || defaultProfile,
        stats: {
          ...(stats || defaultStats),
          availableServices: 3,
          completedApplications: (stats?.completedApplications || 142) + completedFromStore,
          totalApplications: (stats?.totalApplications || 154) + totalFromStore,
        },
      },
    });
  } catch (error) {
    return res.status(200).json({
      status: 'success',
      data: {
        profile: defaultProfile,
        stats: defaultStats,
      },
    });
  }
};

export const getNewsList = async (req: Request, res: Response) => {
  try {
    const { category, search } = req.query;
    const allNews = PersistentDatabase.loadNews();

    let filtered = allNews;
    if (category) {
      filtered = filtered.filter((n) => n.category.toLowerCase() === String(category).toLowerCase());
    }
    if (search) {
      const q = String(search).toLowerCase();
      filtered = filtered.filter((n) => n.title.toLowerCase().includes(q) || n.content.toLowerCase().includes(q));
    }

    return res.status(200).json({ status: 'success', data: filtered });
  } catch (error) {
    return res.status(200).json({ status: 'success', data: [] });
  }
};

export const getNewsBySlug = async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;
    const allNews = PersistentDatabase.loadNews();
    const item = allNews.find((n) => n.slug === slug || n.id === slug);

    if (!item) {
      return res.status(404).json({ status: 'error', message: 'Berita tidak ditemukan.' });
    }

    item.views = (item.views || 0) + 1;
    PersistentDatabase.saveNews(allNews);

    return res.status(200).json({ status: 'success', data: item });
  } catch (error) {
    return res.status(500).json({ status: 'error', message: 'Gagal memuat berita.' });
  }
};

export const createNews = async (req: AuthRequest, res: Response) => {
  try {
    const { title, category, content, excerpt, imageUrl } = req.body;

    if (!title || !content) {
      return res.status(400).json({ status: 'error', message: 'Judul dan isi berita wajib diisi.' });
    }

    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '') + '-' + Date.now().toString().slice(-4);

    const newRecord: NewsRecord = {
      id: `news-${Date.now()}`,
      slug,
      title,
      category: category || 'Pemerintahan',
      content,
      excerpt: excerpt || content.slice(0, 120) + '...',
      imageUrl: imageUrl || undefined,
      views: 1,
      createdAt: new Date().toISOString(),
      author: { name: req.user?.name || 'Humas Pemdes Jombe' },
    };

    PersistentDatabase.addNews(newRecord);

    try {
      await prisma.news.create({
        data: {
          title,
          slug,
          category: category || 'Pemerintahan',
          content,
          excerpt: newRecord.excerpt,
          imageUrl: imageUrl || null,
          authorId: req.user?.id || 'demo-operator-id-9',
          isPublished: true,
        },
      }).catch(() => null);
    } catch (e) {}

    return res.status(201).json({
      status: 'success',
      message: 'Berita desa berhasil dipublikasikan!',
      data: newRecord,
    });
  } catch (error: any) {
    return res.status(500).json({ status: 'error', message: 'Gagal membuat berita: ' + error.message });
  }
};

export const deleteNews = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    PersistentDatabase.deleteNews(id);

    try {
      await prisma.news.delete({ where: { id } }).catch(() => null);
    } catch (e) {}

    return res.status(200).json({ status: 'success', message: 'Berita berhasil dihapus.' });
  } catch (error) {
    return res.status(500).json({ status: 'error', message: 'Gagal menghapus berita.' });
  }
};

export const getAnnouncements = async (req: Request, res: Response) => {
  try {
    const list = PersistentDatabase.loadAnnouncements();
    return res.status(200).json({ status: 'success', data: list });
  } catch (error) {
    return res.status(200).json({ status: 'success', data: [] });
  }
};

export const createAnnouncement = async (req: AuthRequest, res: Response) => {
  try {
    const { title, content } = req.body;

    if (!title || !content) {
      return res.status(400).json({ status: 'error', message: 'Judul dan isi pengumuman wajib diisi.' });
    }

    const newAnn: AnnouncementRecord = {
      id: `ann-${Date.now()}`,
      title,
      content,
      createdAt: new Date().toISOString(),
    };

    PersistentDatabase.addAnnouncement(newAnn);

    return res.status(201).json({
      status: 'success',
      message: 'Pengumuman baru berhasil diterbitkan!',
      data: newAnn,
    });
  } catch (error) {
    return res.status(500).json({ status: 'error', message: 'Gagal membuat pengumuman.' });
  }
};

export const deleteAnnouncement = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    PersistentDatabase.deleteAnnouncement(id);
    return res.status(200).json({ status: 'success', message: 'Pengumuman berhasil dihapus.' });
  } catch (error) {
    return res.status(500).json({ status: 'error', message: 'Gagal menghapus pengumuman.' });
  }
};

export const getAgendas = async (req: Request, res: Response) => {
  return res.status(200).json({
    status: 'success',
    data: [
      {
        id: 'agenda-1',
        title: 'Posyandu Balita & Lansia Dusun Krajan',
        location: 'Balai Dusun Jombe Krajan',
        eventDate: new Date(Date.now() + 86400000 * 3).toISOString(),
      },
    ],
  });
};
