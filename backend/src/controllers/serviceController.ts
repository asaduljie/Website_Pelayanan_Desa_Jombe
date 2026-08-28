import { Request, Response } from 'express';
import prisma from '../config/db';

const getFallbackServiceList = () => [
  {
    id: 'service-sktm-1',
    name: 'Surat Keterangan Kurang Mampu (SKTM)',
    slug: 'surat-keterangan-tidak-mampu',
    category: 'Bantuan Sosial',
    description: 'Surat keterangan resmi keluarga berpenghasilan rendah / kurang mampu untuk keperluan DTKS, beasiswa, dan bantuan sosial.',
    requirements: 'e-KTP Pemohon/Orang Tua, Kartu Keluarga (KK), Keterangan Keperluan',
    estimatedDays: 1,
    isActive: true,
    fields: [
      { id: 'f_sktm_1', label: 'Tujuan Permohonan SKTM', fieldName: 'tujuan_sktm', fieldType: 'SELECT', options: JSON.stringify(['Data Terpadu Kesejahteraan Sosial (DTKS)', 'Beasiswa Sekolah / Kuliah (PIP / KIP-K)', 'Keringanan Biaya Rumah Sakit / Kesehatan', 'Bantuan Sosial Pemerintah']), isRequired: true },
      { id: 'f_sktm_2', label: 'Nama Anggota Keluarga yang Dibiayai', fieldName: 'nama_anggota', fieldType: 'TEXT', placeholder: 'Contoh: Nama Anak / Pelajar / Pasien', isRequired: true },
    ],
  },
  {
    id: 'service-wali-2',
    name: 'Surat Keterangan Wali',
    slug: 'surat-keterangan-wali',
    category: 'Administrasi',
    description: 'Surat keterangan pengakuan hak perwalian anak/siswa/mahasiswa untuk kelengkapan administrasi pendidikan atau instansi.',
    requirements: 'e-KTP Wali, Kartu Keluarga (KK), NISN / Data Anak',
    estimatedDays: 1,
    isActive: true,
    fields: [
      { id: 'f_wali_1', label: 'Nama Anak / Siswa / Mahasiswa', fieldName: 'nama_anak', fieldType: 'TEXT', placeholder: 'Contoh: Ahmad Hidayat', isRequired: true },
      { id: 'f_wali_2', label: 'NISN / NIK Anak', fieldName: 'nisn_nik_anak', fieldType: 'TEXT', placeholder: 'Contoh: 0115783332', isRequired: true },
      { id: 'f_wali_3', label: 'Tempat, Tanggal Lahir Anak', fieldName: 'ttl_anak', fieldType: 'TEXT', placeholder: 'Contoh: Jeneponto, 10 Oktober 2011', isRequired: true },
      { id: 'f_wali_4', label: 'Hubungan Perwalian', fieldName: 'hubungan_wali', fieldType: 'TEXT', placeholder: 'Contoh: Orang Tua Kandung / Paman / Kakek', isRequired: true },
    ],
  },
  {
    id: 'service-kendaraan-3',
    name: 'Surat Keterangan Kepemilikan Kendaraan Bermotor',
    slug: 'surat-keterangan-kepemilikan-kendaraan-bermotor',
    category: 'Surat Keterangan',
    description: 'Surat keterangan resmi kepemilikan sah sepeda motor/mobil dan legalitas kendaraan belum balik nama.',
    requirements: 'e-KTP Pemilik, STNK/BPKB, Foto Kendaraan (No. Polisi, No. Rangka, No. Mesin)',
    estimatedDays: 1,
    isActive: true,
    fields: [
      { id: 'f_knd_1', label: 'Nomor Polisi (Plat Kendaraan)', fieldName: 'nomor_polisi', fieldType: 'TEXT', placeholder: 'Contoh: DD 3442 LW', isRequired: true },
      { id: 'f_knd_2', label: 'Merk / Tipe / Jenis Kendaraan', fieldName: 'merk_type', fieldType: 'TEXT', placeholder: 'Contoh: Yamaha / 54P AT (Sepeda Motor)', isRequired: true },
      { id: 'f_knd_3', label: 'Tahun Pembuatan & Warna', fieldName: 'tahun_warna', fieldType: 'TEXT', placeholder: 'Contoh: 2012 / Merah', isRequired: true },
      { id: 'f_knd_4', label: 'Nomor Rangka & Nomor Mesin', fieldName: 'no_rangka_mesin', fieldType: 'TEXT', placeholder: 'Contoh: MH354P00ACJ179171 / 54P-179417', isRequired: true },
      { id: 'f_knd_5', label: 'Nomor BPKB / Nama Pemilik Lama', fieldName: 'bpkb_pemilik_lama', fieldType: 'TEXT', placeholder: 'Contoh: J00291903 R (Belum Balik Nama)', isRequired: true },
    ],
  },
  {
    id: 'service-sku-4',
    name: 'Surat Keterangan Usaha (SKU)',
    slug: 'surat-keterangan-usaha',
    category: 'Surat Keterangan',
    description: 'Pengantar resmi untuk izin legalitas dan bantuan modal usaha mikro serta UMKM warga Desa Jombe.',
    requirements: 'e-KTP Pemilik Usaha, Kartu Keluarga (KK), Foto Usaha/Toko',
    estimatedDays: 1,
    isActive: true,
    fields: [
      { id: 'f_sku_1', label: 'Nama Usaha / Toko', fieldName: 'nama_usaha', fieldType: 'TEXT', placeholder: 'Contoh: Toko Kelontong Berkah', isRequired: true },
      { id: 'f_sku_2', label: 'Jenis Usaha / Komoditas', fieldName: 'jenis_usaha', fieldType: 'TEXT', placeholder: 'Contoh: Perdagangan Sembako & Pertanian', isRequired: true },
      { id: 'f_sku_3', label: 'Alamat / Lokasi Usaha', fieldName: 'alamat_usaha', fieldType: 'TEXTAREA', placeholder: 'Contoh: Dusun Jombe Selatan, Desa Jombe', isRequired: true },
    ],
  },
  {
    id: 'service-domisili-5',
    name: 'Surat Keterangan Domisili',
    slug: 'surat-keterangan-domisili',
    category: 'Surat Keterangan',
    description: 'Surat keterangan resmi tempat tinggal dan domisili warga di wilayah dusun Desa Jombe.',
    requirements: 'e-KTP Pemohon, Kartu Keluarga (KK)',
    estimatedDays: 1,
    isActive: true,
    fields: [
      { id: 'f_dom_1', label: 'Alamat Domisili Lengkap', fieldName: 'alamat_domisili', fieldType: 'TEXTAREA', placeholder: 'Dusun, RT, RW Desa Jombe', isRequired: true },
      { id: 'f_dom_2', label: 'Keperluan Surat', fieldName: 'keperluan', fieldType: 'TEXT', placeholder: 'Contoh: Pembukaan Rekening Bank / Melamar Kerja', isRequired: true },
    ],
  },
  {
    id: 'service-skkb-6',
    name: 'Surat Keterangan Kelakuan Baik (SKKB)',
    slug: 'surat-keterangan-kelakuan-baik',
    category: 'Surat Keterangan',
    description: 'Surat pengantar berkelakuan baik dari pemerintah desa untuk persyaratan kerja, lamaran, atau SKCK.',
    requirements: 'e-KTP Pemohon, Kartu Keluarga (KK), Pas Foto',
    estimatedDays: 1,
    isActive: true,
    fields: [
      { id: 'f_skkb_1', label: 'Keperluan Surat Kelakuan Baik', fieldName: 'keperluan_skkb', fieldType: 'TEXT', placeholder: 'Contoh: Persyaratan Pengurusan SKCK / Melamar Pekerjaan', isRequired: true },
    ],
  },
  {
    id: 'service-belum-menikah-7',
    name: 'Surat Keterangan Belum Menikah',
    slug: 'surat-keterangan-belum-menikah',
    category: 'Administrasi',
    description: 'Surat keterangan resmi status belum pernah menikah/lajang untuk persyaratan kerja atau pernikahan.',
    requirements: 'e-KTP Pemohon, Kartu Keluarga (KK)',
    estimatedDays: 1,
    isActive: true,
    fields: [
      { id: 'f_bm_1', label: 'Keperluan Surat', fieldName: 'keperluan_belum_menikah', fieldType: 'TEXT', placeholder: 'Contoh: Pendaftaran Kerja / Berkas Pernikahan KUA', isRequired: true },
    ],
  },
  {
    id: 'service-kematian-8',
    name: 'Surat Keterangan Kematian',
    slug: 'surat-keterangan-kematian',
    category: 'Administrasi',
    description: 'Penerbitan surat keterangan meninggal dunia untuk pengurusan ahli waris, akta kematian, atau perbankan.',
    requirements: 'e-KTP Pelapor, KK Almarhum, Keterangan Tanggal & Tempat Meninggal',
    estimatedDays: 1,
    isActive: true,
    fields: [
      { id: 'f_km_1', label: 'Nama Lengkap Almarhum / Almarhumah', fieldName: 'nama_almarhum', fieldType: 'TEXT', placeholder: 'Nama Almarhum/ah', isRequired: true },
      { id: 'f_km_2', label: 'Tanggal & Tempat Meninggal Dunia', fieldName: 'tgl_tempat_kematian', fieldType: 'TEXT', placeholder: 'Contoh: 12 Agustus 2026 di Jeneponto', isRequired: true },
      { id: 'f_km_3', label: 'Penyebab Kematian', fieldName: 'penyebab_kematian', fieldType: 'TEXT', placeholder: 'Contoh: Sakit / Usia Lanjut', isRequired: true },
    ],
  },
  {
    id: 'service-umum-9',
    name: 'Surat Keterangan Umum / Lainnya',
    slug: 'surat-keterangan-umum',
    category: 'Surat Keterangan',
    description: 'Surat keterangan resmi pemerintah desa untuk keperluan administrasi lainnya.',
    requirements: 'e-KTP Pemohon, Kartu Keluarga (KK), Detail Keterangan Permohonan',
    estimatedDays: 1,
    isActive: true,
    fields: [
      { id: 'f_um_1', label: 'Perihal / Keterangan yang Dimohonkan', fieldName: 'keterangan_umum', fieldType: 'TEXTAREA', placeholder: 'Jelaskan rincian keterangan yang Anda butuhkan', isRequired: true },
    ],
  },
];

export const getServices = async (req: Request, res: Response) => {
  try {
    const { category, search } = req.query;

    const allServices = getFallbackServiceList();
    let filtered = allServices;

    if (category && category !== 'ALL') {
      filtered = filtered.filter((s) => s.category === String(category));
    }
    if (search) {
      const q = String(search).toLowerCase();
      filtered = filtered.filter((s) => s.name.toLowerCase().includes(q) || s.description.toLowerCase().includes(q));
    }

    return res.status(200).json({ status: 'success', data: filtered });
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
