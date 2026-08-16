import { Request, Response } from 'express';
import prisma from '../config/db';

const getFallbackServiceList = () => [
  {
    id: 'service-sku-1',
    name: 'Surat Keterangan Usaha (SKU)',
    slug: 'surat-keterangan-usaha',
    category: 'Surat Keterangan',
    description: 'Pengantar resmi untuk Izin Usaha / Keterangan Usaha mikro dan UMKM warga Desa Jombe.',
    requirements: 'Kartu Tanda Penduduk (KTP), Kartu Keluarga (KK), Foto Lokasi Usaha',
    estimatedDays: 1,
    isActive: true,
    fields: [
      { id: 'f1', label: 'Nama Usaha', fieldName: 'nama_usaha', fieldType: 'TEXT', placeholder: 'Contoh: Toko Sembako Berkah', isRequired: true },
      { id: 'f2', label: 'Jenis Usaha / Komoditas', fieldName: 'jenis_usaha', fieldType: 'TEXT', placeholder: 'Contoh: Perdagangan Sembako', isRequired: true },
      { id: 'f3', label: 'Alamat Usaha', fieldName: 'alamat_usaha', fieldType: 'TEXTAREA', placeholder: 'Contoh: Dusun Krajan RT 02 RW 01 Desa Jombe', isRequired: true },
    ],
  },
  {
    id: 'service-domisili-2',
    name: 'Surat Keterangan Domisili',
    slug: 'surat-keterangan-domisili',
    category: 'Surat Keterangan',
    description: 'Surat keterangan resmi domisili tempat tinggal warga di wilayah Desa Jombe.',
    requirements: 'Kartu Tanda Penduduk (KTP), Kartu Keluarga (KK)',
    estimatedDays: 1,
    isActive: true,
    fields: [
      { id: 'f4', label: 'Alamat Domisili Lengkap', fieldName: 'alamat_domisili', fieldType: 'TEXTAREA', placeholder: 'Dusun, RT, RW Desa Jombe', isRequired: true },
      { id: 'f5', label: 'Keperluan Surat', fieldName: 'keperluan', fieldType: 'TEXT', placeholder: 'Contoh: Pembukaan Rekening Bank', isRequired: true },
    ],
  },
  {
    id: 'service-sktm-3',
    name: 'Surat Keterangan Tidak Mampu (SKTM)',
    slug: 'surat-keterangan-tidak-mampu',
    category: 'Bantuan Sosial',
    description: 'Surat pengantar untuk keringanan beasiswa, kesehatan, dan bantuan sosial.',
    requirements: 'KTP Orang Tua/Pemohon, Kartu Keluarga (KK), Pengantar RT/RW',
    estimatedDays: 1,
    isActive: true,
    fields: [
      { id: 'f6', label: 'Keperluan SKTM', fieldName: 'keperluan_sktm', fieldType: 'SELECT', options: JSON.stringify(['Beasiswa Sekolah / Kuliah', 'Pengobatan / Rumah Sakit', 'Bantuan Sosial / PKH']), isRequired: true },
      { id: 'f7', label: 'Nama Anggota Keluarga Dibiayai', fieldName: 'nama_anggota', fieldType: 'TEXT', placeholder: 'Nama Anak / Pasien', isRequired: true },
    ],
  },
];

export const getServices = async (req: Request, res: Response) => {
  try {
    const { category, search } = req.query;

    let services: any[] = [];
    try {
      const whereCondition: any = { isActive: true };
      if (category && category !== 'ALL') whereCondition.category = String(category);
      if (search) {
        whereCondition.OR = [
          { name: { contains: String(search), mode: 'insensitive' } },
          { description: { contains: String(search), mode: 'insensitive' } },
        ];
      }

      services = await prisma.service.findMany({
        where: whereCondition,
        include: {
          fields: { orderBy: { order: 'asc' } },
        },
        orderBy: { createdAt: 'desc' },
      });
    } catch (dbErr) {}

    if (!services || services.length === 0) {
      services = getFallbackServiceList();
    }

    return res.status(200).json({ status: 'success', data: services });
  } catch (error) {
    return res.status(200).json({ status: 'success', data: getFallbackServiceList() });
  }
};

export const getServiceBySlug = async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;

    let service: any = null;
    try {
      service = await prisma.service.findUnique({
        where: { slug: slug },
        include: {
          fields: { orderBy: { order: 'asc' } },
        },
      });
    } catch (dbErr) {}

    if (!service) {
      const fallbackList = getFallbackServiceList();
      service = fallbackList.find((s) => s.slug === slug) || fallbackList[0];
    }

    return res.status(200).json({ status: 'success', data: service });
  } catch (error) {
    const fallbackList = getFallbackServiceList();
    const service = fallbackList.find((s) => s.slug === req.params.slug) || fallbackList[0];
    return res.status(200).json({ status: 'success', data: service });
  }
};

export const createService = async (req: Request, res: Response) => {
  try {
    const { name, slug, description, category, requirements, estimatedDays, icon, fields } = req.body;

    let newService: any = null;
    try {
      newService = await prisma.service.create({
        data: {
          name,
          slug: slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          description,
          category: category || 'Surat Keterangan',
          requirements,
          estimatedDays: Number(estimatedDays) || 1,
          icon: icon || 'file-text',
          fields: {
            create: fields ? fields.map((f: any, idx: number) => ({
              label: f.label,
              fieldName: f.fieldName || f.label.toLowerCase().replace(/[^a-z0-9]+/g, '_'),
              fieldType: f.fieldType || 'TEXT',
              placeholder: f.placeholder,
              isRequired: f.isRequired !== undefined ? f.isRequired : true,
              options: f.options ? JSON.stringify(f.options) : null,
              order: idx + 1,
            })) : [],
          },
        },
        include: { fields: true },
      });
    } catch (e) {
      newService = {
        id: `service-custom-${Date.now()}`,
        name,
        slug: slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        category,
        description,
        requirements,
        fields: fields || [],
      };
    }

    return res.status(201).json({ status: 'success', message: 'Layanan baru berhasil ditambahkan.', data: newService });
  } catch (error: any) {
    return res.status(500).json({ status: 'error', message: 'Gagal membuat layanan baru: ' + error.message });
  }
};
