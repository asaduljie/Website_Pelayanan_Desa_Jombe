import { Request, Response } from 'express';
import prisma from '../config/db';
import { AuthRequest } from '../middleware/auth';
import { PersistentDatabase } from '../utils/persistentDb';
import { realtimeEvents } from '../services/realtimeEvents';
import { verifyCaptchaToken } from './captchaController';

export const createApplication = async (req: AuthRequest, res: Response) => {
  try {
    const {
      serviceId,
      serviceName: customServiceName,
      serviceSlug,
      fieldValues,
      uploadedPhotos,
      nik: bodyNik,
      name: bodyName,
      phone: bodyPhone,
      address: bodyAddress,
      captchaToken,
      captchaAnswer,
    } = req.body;

    // 1. Verifikasi Captcha Anti-Bot
    if (captchaToken || captchaAnswer !== undefined) {
      const isCaptchaValid = verifyCaptchaToken(captchaToken, captchaAnswer);
      if (!isCaptchaValid) {
        return res.status(400).json({
          status: 'error',
          message: 'Kode verifikasi keamanan (Captcha) salah atau telah kedaluwarsa. Silakan coba lagi.',
        });
      }
    }

    // 2. Validasi NIK (Wajib 16 Digit)
    const userNik = String(bodyNik || req.user?.nik || '').replace(/\D/g, '');
    if (!userNik || userNik.length !== 16) {
      return res.status(400).json({
        status: 'error',
        message: 'Nomor Induk Kependudukan (NIK) wajib berjumlah tepat 16 digit angka sesuai e-KTP.',
      });
    }

    const userName = String(bodyName || req.user?.name || 'Warga Desa Jombe').trim();
    const userPhone = String(bodyPhone || (req.user as any)?.phone || '-').trim();
    const userAddress = String(bodyAddress || (req.user as any)?.address || 'Desa Jombe, Kec. Turatea').trim();

    // 3. Cari / Buat User di Supabase DB
    let citizen = await prisma.user.findUnique({ where: { nik: userNik } }).catch(() => null);
    if (!citizen) {
      citizen = await prisma.user.create({
        data: {
          nik: userNik,
          name: userName,
          phone: userPhone,
          address: userAddress,
          role: 'MASYARAKAT',
          password: 'PUBLIC_NO_PASSWORD',
        },
      }).catch(async () => {
        return await prisma.user.findUnique({ where: { nik: userNik } });
      });
    } else {
      // Update data terbaru jika ada perubahan
      citizen = await prisma.user.update({
        where: { id: citizen.id },
        data: {
          name: userName || citizen.name,
          phone: userPhone !== '-' ? userPhone : citizen.phone,
          address: userAddress || citizen.address,
        },
      }).catch(() => citizen);
    }

    const userId = citizen?.id || req.user?.id || `warga-${userNik}`;

    // 4. Resolve Service
    let resolvedService = serviceSlug
      ? await prisma.service.findUnique({ where: { slug: serviceSlug } }).catch(() => null)
      : serviceId
      ? await prisma.service.findUnique({ where: { id: serviceId } }).catch(() => null)
      : null;

    if (!resolvedService) {
      resolvedService = await prisma.service.findFirst().catch(() => null);
    }

    const serviceName = customServiceName || resolvedService?.name || 'Surat Keterangan Usaha (SKU)';
    const sId = resolvedService?.id || 'service-sku-1';
    const sSlug = serviceSlug || resolvedService?.slug || 'surat-keterangan-usaha';

    // 5. Generate Application Number
    const totalApps = await prisma.application.count().catch(() => 0);
    const applicationNumber = `JMB-${new Date().getFullYear()}-${String(totalApps + 1).padStart(5, '0')}`;
    const newAppId = `app-web-${Date.now()}`;
    const defaultLetterNumber = `503/470/${Math.floor(100 + Math.random() * 900)}/DS-JMB/${new Date().getFullYear()}`;

    // 6. Simpan ke Supabase PostgreSQL
    let createdDbApp: any = null;
    if (citizen && resolvedService) {
      try {
        createdDbApp = await prisma.application.create({
          data: {
            applicationNumber,
            userId: citizen.id,
            serviceId: resolvedService.id,
            status: 'PENDING',
            history: {
              create: {
                status: 'PENDING',
                actorName: userName,
                notes: 'Permohonan surat diajukan mandiri via portal website Desa Jombe.',
              },
            },
          },
          include: {
            service: true,
            user: true,
          },
        });
      } catch (dbErr) {
        console.error('Error creating app in prisma:', dbErr);
      }
    }

    const actualId = createdDbApp?.id || newAppId;

    // 7. Simpan Record Lengkap ke PersistentDatabase
    const appRecord = {
      id: actualId,
      applicationNumber,
      userId: citizen?.id || userId,
      userNik,
      userName,
      userPhone,
      serviceId: sId,
      serviceName,
      serviceSlug: sSlug,
      status: 'PENDING' as const,
      detailValue: typeof fieldValues === 'string' ? fieldValues : `Alamat: ${userAddress}. Keterangan: Pengajuan Surat Mandiri Portal Website Desa Jombe`,
      uploadedPhotos: Array.isArray(uploadedPhotos) && uploadedPhotos.length > 0 ? uploadedPhotos : [
        { title: 'Foto e-KTP Asli Pemohon', type: 'KTP' },
        { title: 'Foto Kartu Keluarga (KK)', type: 'KK' },
      ],
      letterNumber: defaultLetterNumber,
      letterContent: `Menerangkan dengan sebenarnya bahwa ${userName} (NIK: ${userNik}, Alamat: ${userAddress}) adalah benar warga Desa Jombe yang bersangkutan.`,
      createdAt: new Date().toISOString(),
    };

    await PersistentDatabase.addApplicationAsync(appRecord);
    realtimeEvents.publish('application.changed', { action: 'created', source: 'website', applicationId: actualId });

    return res.status(201).json({
      status: 'success',
      message: 'Permohonan surat berhasil dikirim! Simpan Nomor Registrasi Anda untuk melacak status.',
      data: {
        id: actualId,
        applicationNumber,
        serviceName,
        userName,
        userNik,
        status: 'PENDING',
        createdAt: new Date().toISOString(),
      },
    });
  } catch (error: any) {
    console.error('Create application error:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Gagal mengirim permohonan surat: ' + error.message,
    });
  }
};

export const getMyApplications = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id || '';
    const userNik = req.user?.nik || '';

    const host = req.get('host') || 'lentera-desa-backend.vercel.app';
    const protocol = host.includes('localhost') ? req.protocol : 'https';

    // 1. Ambil dari Supabase DB
    const dbApps = await prisma.application.findMany({
      where: {
        OR: [
          ...(userNik ? [{ user: { nik: userNik } }] : []),
          ...(userId ? [{ userId }] : []),
        ],
      },
      include: { service: true, user: true },
      orderBy: { createdAt: 'desc' },
    }).catch(() => []);

    // 2. Ambil dari PersistentDatabase
    const persistentList = await PersistentDatabase.loadApplicationsAsync();

    const mergedMap = new Map<string, any>();

    // DB apps first
    for (const app of dbApps) {
      mergedMap.set(app.id, {
        id: app.id,
        applicationNumber: app.applicationNumber,
        status: app.status,
        createdAt: app.createdAt.toISOString ? app.createdAt.toISOString() : app.createdAt,
        letterNumber: null,
        pdfUrl: app.status === 'COMPLETED' ? `${protocol}://${host}/api/operator/pdf/${app.id}` : null,
        service: {
          name: app.service?.name || 'Surat Keterangan',
          category: app.service?.category || 'Surat Keterangan',
          slug: app.service?.slug || 'surat-keterangan-usaha',
        },
      });
    }

    // Overlay persistent apps
    for (const w of persistentList) {
      if ((userNik && w.userNik === userNik) || (userId && w.userId === userId) || (!userNik && !userId)) {
        mergedMap.set(w.id, {
          id: w.id,
          applicationNumber: w.applicationNumber,
          status: w.status,
          createdAt: w.createdAt,
          letterNumber: w.letterNumber,
          pdfUrl: w.status === 'COMPLETED' ? `${protocol}://${host}/api/operator/pdf/${w.id}` : null,
          service: {
            name: w.serviceName,
            category: 'Surat Keterangan',
            slug: w.serviceSlug || 'surat-keterangan-usaha',
          },
        });
      }
    }

    const userApps = Array.from(mergedMap.values()).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    return res.status(200).json({ status: 'success', data: userApps });
  } catch (error) {
    return res.status(200).json({ status: 'success', data: [] });
  }
};

export const trackApplication = async (req: any, res: Response) => {
  try {
    const query = String(req.query.applicationNumber || req.query.nik || req.query.regNo || req.query.query || '').trim();
    if (!query) {
      return res.status(400).json({ status: 'error', message: 'Masukkan Nomor Registrasi Surat atau NIK untuk melacak.' });
    }

    const upperQuery = query.toUpperCase();
    const cleanDigits = query.replace(/\D/g, '');

    const host = req.get('host') || 'lentera-desa-backend.vercel.app';
    const protocol = host.includes('localhost') ? req.protocol : 'https';

    // 1. Query Supabase Prisma
    let dbApps: any[] = [];
    try {
      dbApps = await prisma.application.findMany({
        where: {
          OR: [
            { applicationNumber: { contains: upperQuery, mode: 'insensitive' } },
            ...(cleanDigits && cleanDigits.length >= 6 ? [{ user: { nik: { contains: cleanDigits } } }] : []),
          ],
        },
        include: {
          service: true,
          user: { select: { name: true, nik: true } },
          history: { orderBy: { createdAt: 'desc' } },
        },
        orderBy: { createdAt: 'desc' },
        take: 10,
      });
    } catch (e) {}

    // 2. Query PersistentDatabase
    const persistentList = await PersistentDatabase.loadApplicationsAsync();
    const persistentMatches = persistentList.filter((w) => {
      if (w.applicationNumber && w.applicationNumber.toUpperCase().includes(upperQuery)) return true;
      if (cleanDigits && cleanDigits.length >= 6 && w.userNik && w.userNik.includes(cleanDigits)) return true;
      return false;
    });

    const resultMap = new Map<string, any>();

    for (const app of dbApps) {
      resultMap.set(app.id, {
        id: app.id,
        applicationNumber: app.applicationNumber,
        status: app.status,
        serviceName: app.service?.name || 'Surat Keterangan',
        createdAt: app.createdAt.toISOString ? app.createdAt.toISOString() : app.createdAt,
        user: app.user,
        pdfUrl: app.status === 'COMPLETED' ? `${protocol}://${host}/api/operator/pdf/${app.id}` : null,
        revisionNotes:
          app.status === 'COMPLETED'
            ? 'Surat resmi telah disetujui & ditandatangani Kepala Desa Jombe.'
            : app.status === 'NEED_REVISION'
            ? app.revisionNotes || 'Memerlukan perbaikan dokumen lampiran.'
            : 'Permohonan sedang dalam antrean pemeriksaan oleh Operator Kantor Desa Jombe.',
      });
    }

    for (const match of persistentMatches) {
      resultMap.set(match.id, {
        id: match.id,
        applicationNumber: match.applicationNumber,
        status: match.status,
        serviceName: match.serviceName,
        createdAt: match.createdAt,
        user: { name: match.userName, nik: match.userNik },
        letterNumber: match.letterNumber,
        pdfUrl: match.status === 'COMPLETED' ? `${protocol}://${host}/api/operator/pdf/${match.id}` : null,
        revisionNotes:
          match.status === 'COMPLETED'
            ? 'Surat resmi telah disetujui & ditandatangani Kepala Desa Jombe.'
            : match.status === 'NEED_REVISION'
            ? match.detailValue || 'Memerlukan perbaikan dokumen lampiran.'
            : 'Permohonan sedang dalam antrean pemeriksaan oleh Operator Kantor Desa Jombe.',
      });
    }

    const allResults = Array.from(resultMap.values()).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    if (allResults.length > 0) {
      return res.status(200).json({
        status: 'success',
        data: allResults[0],
        allMatches: allResults,
      });
    }

    return res.status(404).json({
      status: 'error',
      message: `Permohonan dengan nomor registrasi / NIK "${query}" tidak ditemukan. Pastikan data yang dimasukkan sudah benar.`,
    });
  } catch (error: any) {
    return res.status(500).json({ status: 'error', message: 'Gagal melacak permohonan.' });
  }
};

export const getApplicationDetail = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const host = req.get('host') || 'lentera-desa-backend.vercel.app';
    const protocol = host.includes('localhost') ? req.protocol : 'https';

    // 1. Try DB
    let app = await prisma.application.findUnique({
      where: { id },
      include: {
        service: true,
        user: { select: { name: true, nik: true, phone: true, address: true } },
        documents: true,
        fieldValues: { include: { field: true } },
        history: { orderBy: { createdAt: 'desc' } },
      },
    }).catch(() => null);

    if (app) {
      return res.status(200).json({
        status: 'success',
        data: {
          ...app,
          pdfUrl: app.status === 'COMPLETED' ? `${protocol}://${host}/api/operator/pdf/${app.id}` : null,
        },
      });
    }

    // 2. Try Persistent Store
    const persistentList = await PersistentDatabase.loadApplicationsAsync();
    const match = persistentList.find((w) => w.id === id || w.applicationNumber === id);
    if (match) {
      return res.status(200).json({
        status: 'success',
        data: {
          id: match.id,
          applicationNumber: match.applicationNumber,
          status: match.status,
          createdAt: match.createdAt,
          service: { name: match.serviceName, slug: match.serviceSlug || 'surat-keterangan-usaha' },
          user: { name: match.userName, nik: match.userNik, phone: match.userPhone },
          fieldValues: [{ field: { label: 'Detail Permohonan' }, value: match.detailValue }],
          pdfUrl: match.status === 'COMPLETED' ? `${protocol}://${host}/api/operator/pdf/${match.id}` : null,
          history: [{ status: match.status, actorName: 'Sistem Pelayanan JOMBE DIGITAL', notes: match.detailValue, createdAt: match.createdAt }],
        },
      });
    }

    return res.status(404).json({ status: 'error', message: 'Permohonan tidak ditemukan.' });
  } catch (error) {
    return res.status(500).json({ status: 'error', message: 'Gagal mengambil detail permohonan.' });
  }
};
