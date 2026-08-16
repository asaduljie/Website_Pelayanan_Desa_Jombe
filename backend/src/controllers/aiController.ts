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

    // Default intelligent responses grounded in official Desa Jombe data
    let answer = '';
    let actionButton: any = null;

    if (matchedService) {
      answer = `Untuk layanan *${matchedService.name}*:\n\n📌 *Deskripsi*: ${matchedService.description || '-'}\n📋 *Persyaratan*:\n${matchedService.requirements || 'KTP & KK'}\n⏱️ *Estimasi Pemrosesan*: ~${matchedService.estimatedDays} Hari Kerja.\n\nAnda dapat langsung mengisi formulir pengajuannya di bawah ini:`;
      actionButton = {
        label: `Ajukan ${matchedService.name}`,
        url: `/layanan/${matchedService.slug}`,
      };
    } else if (lower.includes('usaha') || lower.includes('sku') || lower.includes('dagang')) {
      answer = `Untuk mengurus perizinan/keterangan usaha, Anda dapat mengajukan *Surat Keterangan Usaha (SKU)*. Syaratnya cukup melampirkan KTP dan Kartu Keluarga.`;
      actionButton = { label: 'Ajukan Surat Keterangan Usaha', url: `/layanan/surat-keterangan-usaha` };
    } else if (lower.includes('domisili') || lower.includes('tinggal')) {
      answer = `Untuk Surat Keterangan Domisili / Tempat Tinggal, Anda dapat mengisi formulir pengajuan online dan melampirkan fotokopi KTP/KK.`;
      actionButton = { label: 'Ajukan Surat Domisili', url: `/layanan/surat-keterangan-domisili` };
    } else if (lower.includes('sktm') || lower.includes('tidak mampu') || lower.includes('beasiswa') || lower.includes('bantuan')) {
      answer = `Surat Keterangan Tidak Mampu (SKTM) dipergunakan untuk beasiswa, bantuan berobat, atau bantuan sosial. Estimasi pembuatan 1 hari kerja.`;
      actionButton = { label: 'Ajukan SKTM', url: `/layanan/surat-keterangan-tidak-mampu` };
    } else if (lower.includes('status') || lower.includes('lacak') || lower.includes('cek')) {
      answer = `Anda dapat mengecek status permohonan secara langsung di Halaman Utama (Cek Status Permohonan) dengan memasukkan Nomor Permohonan contoh: *JMB-2026-00012*, atau melalui Dashboard Akun Anda.`;
      actionButton = { label: 'Cek Permohonan Saya', url: '/dashboard' };
    } else if (lower.includes('kantor') || lower.includes('jam') || lower.includes('buka') || lower.includes('lokasi')) {
      answer = `Kantor Desa Jombe berlokasi di Jl. Raya Desa Jombe No. 01, Kecamatan Jombang. Jam Pelayanan Tatap Muka: Senin - Jumat pukul 08.00 - 15.00 WIB. Pelayanan Digital Online 24 Jam.`;
    } else {
      answer = `Saya adalah AI Assistant Desa Jombe. Saya dapat membantu Anda mencari persyaratan surat administrasi desa, cara mengajukan permohonan, melacak status surat, hingga lokasi kantor desa.\n\nContoh pertanyaan:\n- "Apa syarat membuat Surat Keterangan Usaha?"\n- "Bagaimana cara membuat Surat Domisili?"\n- "Di mana lokasi kantor desa?"`;
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
        reply: 'Halo! Saya AI Assistant Desa Jombe. Silakan tanyakan persyaratan surat atau layanan yang Anda butuhkan.',
        actionButton: { label: 'Lihat Semua Layanan', url: '/layanan' },
      },
    });
  }
};
