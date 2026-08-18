import { Request, Response } from 'express';
import prisma from '../config/db';

export const handleAiQuery = async (req: Request, res: Response) => {
  try {
    const prompt = req.body.prompt || req.body.message || req.body.query || '';

    if (!prompt || String(prompt).trim().length === 0) {
      return res.status(400).json({ status: 'error', message: 'Pertanyaan tidak boleh kosong.' });
    }

    const lower = String(prompt).toLowerCase();

    // Query active services for contextual matching
    let services: any[] = [];
    try {
      services = await prisma.service.findMany({
        where: { isActive: true },
        select: { id: true, name: true, slug: true, description: true, requirements: true, estimatedDays: true },
      });
    } catch (e) {}

    let matchedService: any = null;
    for (const s of services) {
      if (lower.includes(s.name.toLowerCase()) || (s.slug && lower.includes(s.slug.replace(/-/g, ' ')))) {
        matchedService = s;
        break;
      }
    }

    let answer = '';
    let actionButton: any = null;

    if (matchedService) {
      answer = `Informasi Pelayanan ${matchedService.name}:\n\nKeterangan: ${matchedService.description || 'Layanan administrasi resmi Desa Jombe.'}\n\nPersyaratan Dokumen:\n${matchedService.requirements || 'e-KTP dan Kartu Keluarga (KK)'}\n\nEstimasi Waktu Pemrosesan: ${matchedService.estimatedDays || 1} Hari Kerja.\n\nSilakan klik tombol di bawah untuk mengisi formulir pengajuan secara online:`;
      actionButton = {
        label: `Ajukan ${matchedService.name}`,
        url: `/layanan/${matchedService.slug}`,
      };
    } else if (lower.includes('usaha') || lower.includes('sku') || lower.includes('dagang')) {
      answer = `Untuk keperluan administrasi dan perizinan usaha, silakan mengajukan Surat Keterangan Usaha (SKU). Dokumen persyaratan yang perlu disiapkan adalah e-KTP dan foto tempat atau aktivitas usaha Anda.`;
      actionButton = { label: 'Ajukan Surat Keterangan Usaha (SKU)', url: `/layanan/surat-keterangan-usaha` };
    } else if (lower.includes('domisili') || lower.includes('tinggal')) {
      answer = `Untuk permohonan Surat Keterangan Domisili / Tempat Tinggal, Anda dapat melampirkan e-KTP dan Kartu Keluarga (KK) pemohon yang bertempat tinggal di wilayah Desa Jombe.`;
      actionButton = { label: 'Ajukan Surat Domisili', url: `/layanan/surat-keterangan-domisili` };
    } else if (lower.includes('sktm') || lower.includes('tidak mampu') || lower.includes('beasiswa') || lower.includes('bantuan')) {
      answer = `Surat Keterangan Tidak Mampu (SKTM) dipergunakan untuk keperluan beasiswa pendidikan, bantuan biaya pengobatan, maupun program bantuan sosial pemerintah. Waktu pemrosesan 1 hari kerja.`;
      actionButton = { label: 'Ajukan SKTM', url: `/layanan/surat-keterangan-tidak-mampu` };
    } else if (lower.includes('status') || lower.includes('lacak') || lower.includes('cek')) {
      answer = `Anda dapat memantau perkembangan permohonan surat secara langsung melalui menu Cek Status Permohonan di Halaman Utama dengan memasukkan Nomor Registrasi (contoh: JMB-2026-00012) atau melalui menu Permohonan Saya di Dashboard.`;
      actionButton = { label: 'Lihat Status Permohonan', url: '/dashboard' };
    } else if (lower.includes('kantor') || lower.includes('jam') || lower.includes('buka') || lower.includes('lokasi') || lower.includes('alamat')) {
      answer = `Kantor Pemerintah Desa Jombe beralamat di Jalan Raya Desa Jombe No. 01, Kecamatan Jombang, Kabupaten Jombang.\n\nJam Pelayanan Kantor:\nSenin s.d. Jumat pukul 08.00 - 15.00 WIB.\nPelayanan digital online melalui website dan WhatsApp beroperasi 24 jam.`;
    } else {
      answer = `Selamat datang di Pusat Informasi Pelayanan Pemerintah Desa Jombe. Layanan ini siap membantu Anda memberikan informasi mengenai persyaratan surat, tata cara pengajuan berkas, dan penelusuran status permohonan.\n\nContoh informasi yang dapat Anda tanyakan:\n- Apa persyaratan membuat Surat Keterangan Usaha (SKU)?\n- Bagaimana cara mengajukan Surat Domisili?\n- Berapa lama proses pembuatan SKTM?\n- Di mana alamat kantor desa dan jam pelayanannya?`;
    }

    return res.status(200).json({
      status: 'success',
      data: {
        reply: answer,
        actionButton: actionButton,
      },
    });
  } catch (error) {
    return res.status(200).json({
      status: 'success',
      data: {
        reply: 'Selamat datang di Pusat Informasi Pelayanan Pemerintah Desa Jombe. Silakan tanyakan informasi persyaratan administrasi surat yang Anda butuhkan.',
        actionButton: { label: 'Katalog Layanan Surat', url: '/layanan' },
      },
    });
  }
};
