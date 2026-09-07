import { Response } from 'express';
import prisma from '../config/db';
import { AuthRequest } from '../middleware/auth';
import { PersistentDatabase } from '../utils/persistentDb';
import { realtimeEvents } from '../services/realtimeEvents';

export const getOperatorDashboardStats = async (req: AuthRequest, res: Response) => {
  try {
    const [pendingCount, processingCount, revisionCount, completedCount, totalCount] = await Promise.all([
      prisma.application.count({ where: { status: 'PENDING' } }).catch(() => 0),
      prisma.application.count({ where: { status: 'PROCESSING' } }).catch(() => 0),
      prisma.application.count({ where: { status: 'NEED_REVISION' } }).catch(() => 0),
      prisma.application.count({ where: { status: 'COMPLETED' } }).catch(() => 0),
      prisma.application.count().catch(() => 0),
    ]);

    return res.status(200).json({
      status: 'success',
      data: {
        pending: pendingCount,
        processing: processingCount,
        needRevision: revisionCount,
        completed: completedCount,
        total: totalCount,
      },
    });
  } catch (error) {
    return res.status(500).json({ status: 'error', message: 'Gagal mengambil statistik operator.' });
  }
};

export const getOperatorApplications = async (req: AuthRequest, res: Response) => {
  try {
    const { status, search } = req.query;

    const whereClause: any = {};
    if (status && status !== 'ALL') {
      whereClause.status = status;
    }
    if (search) {
      const s = String(search).trim();
      whereClause.OR = [
        { applicationNumber: { contains: s, mode: 'insensitive' } },
        { user: { name: { contains: s, mode: 'insensitive' } } },
        { user: { nik: { contains: s } } },
      ];
    }

    const dbApps = await prisma.application.findMany({
      where: whereClause,
      include: {
        user: true,
        service: true,
        documents: true,
        fieldValues: { include: { field: true } },
        history: { orderBy: { createdAt: 'desc' } },
      },
      orderBy: { createdAt: 'desc' },
    }).catch(() => []);

    // Also check persistent DB for any fallback items
    const persistentList = await PersistentDatabase.loadApplicationsAsync();
    const appMap = new Map<string, any>();

    for (const dbApp of dbApps) {
      const serviceSlug = dbApp.service?.slug || 'surat-keterangan-usaha';
      const photos = [
        { title: 'Foto e-KTP Asli Pemohon', type: 'KTP' },
        { title: 'Foto Kartu Keluarga (KK)', type: 'KK' },
      ];

      appMap.set(dbApp.id, {
        id: dbApp.id,
        applicationNumber: dbApp.applicationNumber,
        status: dbApp.status,
        createdAt: dbApp.createdAt.toISOString ? dbApp.createdAt.toISOString() : dbApp.createdAt,
        letterNumber: `503/470/${Math.floor(100 + Math.random() * 900)}/DS-JMB/${new Date().getFullYear()}`,
        letterContent: `Menerangkan bahwa ${dbApp.user?.name || 'Warga'} adalah benar penduduk Desa Jombe Kecamatan Turatea Kabupaten Jeneponto.`,
        uploadedPhotos: photos,
        service: {
          id: dbApp.service?.id || 'service-sku-1',
          name: dbApp.service?.name || 'Surat Keterangan Usaha (SKU)',
          category: dbApp.service?.category || 'Surat Keterangan',
          slug: serviceSlug,
        },
        user: {
          id: dbApp.user?.id || dbApp.userId,
          name: dbApp.user?.name || 'Warga Desa',
          nik: dbApp.user?.nik || '-',
          phone: dbApp.user?.phone || '-',
          address: dbApp.user?.address || 'Desa Jombe, Kec. Turatea',
        },
        documents: dbApp.documents || [],
        fieldValues: dbApp.fieldValues || [],
      });
    }

    for (const w of persistentList) {
      if (!appMap.has(w.id)) {
        appMap.set(w.id, {
          id: w.id,
          applicationNumber: w.applicationNumber,
          status: w.status,
          createdAt: w.createdAt,
          letterNumber: w.letterNumber || `503/470/${Math.floor(100 + Math.random() * 900)}/DS-JMB/2026`,
          letterContent: w.letterContent || `Menerangkan bahwa ${w.userName} adalah warga Desa Jombe dengan keterangan: ${w.detailValue}`,
          uploadedPhotos: w.uploadedPhotos || [
            { title: 'Foto e-KTP Asli Pemohon', type: 'KTP' },
            { title: 'Foto Kartu Keluarga (KK)', type: 'KK' },
          ],
          service: {
            id: w.serviceId,
            name: w.serviceName,
            category: 'Surat Keterangan',
            slug: w.serviceSlug || 'surat-keterangan-usaha',
          },
          user: {
            id: w.userId,
            name: w.userName,
            nik: w.userNik,
            phone: w.userPhone,
            address: 'Desa Jombe',
          },
          documents: [],
          fieldValues: [
            { field: { label: 'Rincian Keterangan' }, value: w.detailValue },
          ],
        });
      }
    }

    let results = Array.from(appMap.values());
    if (status && status !== 'ALL') {
      results = results.filter((c) => c.status === status);
    }
    if (search) {
      const s = String(search).toLowerCase();
      results = results.filter(
        (c) =>
          c.applicationNumber?.toLowerCase().includes(s) ||
          c.user?.name?.toLowerCase().includes(s) ||
          c.user?.nik?.toLowerCase().includes(s)
      );
    }

    return res.status(200).json({ status: 'success', data: results });
  } catch (error) {
    return res.status(500).json({ status: 'error', message: 'Gagal mengambil permohonan operator.' });
  }
};

/**
 * Approve Application & Issue Official Letter PDF
 */
export const approveAndSendLetter = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { letterNumber, letterContent } = req.body;

    const currentYear = new Date().getFullYear();
    const officialLetterNum = letterNumber || `503/470/${Math.floor(100 + Math.random() * 900)}/DS-JMB/${currentYear}`;

    // 1. Update in Prisma Supabase DB
    let appDb = await prisma.application.update({
      where: { id },
      data: {
        status: 'COMPLETED',
        history: {
          create: {
            status: 'COMPLETED',
            actorName: `Operator (${req.user?.name || 'Operator'})`,
            notes: `Surat resmi disetujui & diterbitkan (Nomor: ${officialLetterNum}) oleh Kepala Desa Jombe.`,
          },
        },
      },
      include: { user: true, service: true },
    }).catch(async () => {
      return await prisma.application.findUnique({
        where: { id },
        include: { user: true, service: true },
      });
    });

    // 2. Update Persistent Store as well
    const updated = PersistentDatabase.updateApplication(id, {
      status: 'COMPLETED',
      letterNumber: officialLetterNum,
      letterContent: letterContent || undefined,
    });
    realtimeEvents.publish('application.changed', { action: 'updated', applicationId: id });

    const host = req.get('host') || 'lentera-desa-backend.vercel.app';
    const protocol = host.includes('localhost') ? req.protocol : 'https';
    const pdfUrl = `${protocol}://${host}/api/operator/pdf/${id}`;

    const targetAppNumber = appDb?.applicationNumber || updated?.applicationNumber || id;
    const citizenName = appDb?.user?.name || updated?.userName || 'Warga Desa Jombe';
    const serviceName = appDb?.service?.name || updated?.serviceName || 'Surat Keterangan';

    return res.status(200).json({
      status: 'success',
      message: `Surat resmi berhasil disetujui dan diterbitkan (Nomor: ${officialLetterNum})! Dokumen PDF telah siap dicetak dan diunduh.`,
      data: {
        applicationNumber: targetAppNumber,
        letterNumber: officialLetterNum,
        pdfUrl: pdfUrl,
        citizenName,
        serviceName,
      },
    });
  } catch (error: any) {
    return res.status(500).json({ status: 'error', message: 'Gagal menyetujui surat: ' + error.message });
  }
};

export const updateApplicationStatus = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { status, revisionNotes } = req.body;

    if (!status) {
      return res.status(400).json({ status: 'error', message: 'Status baru wajib diisi.' });
    }

    try {
      await prisma.application.update({
        where: { id },
        data: {
          status,
          revisionNotes: revisionNotes || null,
          history: {
            create: {
              status,
              actorName: req.user?.name || 'Operator',
              notes: revisionNotes || `Status diperbarui menjadi ${status} oleh operator.`,
            },
          },
        },
      }).catch(() => null);
    } catch (e) {}

    const updated = PersistentDatabase.updateApplication(id, {
      status,
      detailValue: revisionNotes ? `Catatan: ${revisionNotes}` : undefined,
    });
    realtimeEvents.publish('application.changed', { action: 'updated', applicationId: id });

    return res.status(200).json({
      status: 'success',
      message: `Status permohonan diperbarui menjadi ${status}.`,
      data: updated,
    });
  } catch (error) {
    return res.status(500).json({ status: 'error', message: 'Gagal memperbarui status permohonan.' });
  }
};

export const createApplicationForCitizen = async (req: AuthRequest, res: Response) => {
  try {
    const { citizenNik, citizenName, citizenPhone, serviceId, notes } = req.body;

    if (!citizenNik || !citizenName || !serviceId) {
      return res.status(400).json({ status: 'error', message: 'NIK, Nama, dan Jenis Layanan wajib diisi.' });
    }

    const cleanNik = String(citizenNik).replace(/\D/g, '');
    let citizen = await prisma.user.findUnique({ where: { nik: cleanNik } }).catch(() => null);
    if (!citizen) {
      citizen = await prisma.user.create({
        data: {
          nik: cleanNik,
          name: citizenName,
          phone: citizenPhone || '-',
          address: 'Desa Jombe',
          role: 'MASYARAKAT',
          password: 'PUBLIC_NO_PASSWORD',
        },
      }).catch(async () => {
        return await prisma.user.findUnique({ where: { nik: cleanNik } });
      });
    }

    const totalApps = await prisma.application.count().catch(() => 0);
    const applicationNumber = `JMB-${new Date().getFullYear()}-${String(totalApps + 1).padStart(5, '0')}`;

    const createdApp = await prisma.application.create({
      data: {
        applicationNumber,
        userId: citizen?.id || `user-${cleanNik}`,
        serviceId,
        status: 'PENDING',
        history: {
          create: {
            status: 'PENDING',
            actorName: `Operator (${req.user?.name || 'Petugas'})`,
            notes: `Permohonan dibuatkan oleh Operator: ${notes || '-'}`,
          },
        },
      },
      include: { service: true, user: true },
    }).catch(() => null);

    const actualId = createdApp?.id || `app-assisted-${Date.now()}`;

    const newRecord: any = {
      id: actualId,
      applicationNumber,
      userId: citizen?.id || `user-${Date.now()}`,
      userNik: cleanNik,
      userName: citizenName,
      userPhone: citizenPhone || '-',
      serviceId,
      serviceName: createdApp?.service?.name || 'Surat Keterangan Usaha (SKU)',
      serviceSlug: createdApp?.service?.slug || 'surat-keterangan-usaha',
      status: 'PENDING',
      detailValue: notes || 'Permohonan dibuatkan oleh Operator',
      uploadedPhotos: [
        { title: 'Foto e-KTP Asli Pemohon', type: 'KTP' },
        { title: 'Foto Kartu Keluarga (KK)', type: 'KK' },
      ],
      createdAt: new Date().toISOString(),
    };

    PersistentDatabase.addApplication(newRecord);
    realtimeEvents.publish('application.changed', { action: 'created', source: 'operator', applicationId: actualId });

    return res.status(201).json({
      status: 'success',
      message: `Permohonan bantuan berhasil dibuatkan! Nomor Lacak: ${applicationNumber}`,
      data: newRecord,
    });
  } catch (error) {
    return res.status(500).json({ status: 'error', message: 'Gagal membuatkan permohonan warga.' });
  }
};

export const deleteOperatorApplication = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    PersistentDatabase.deleteApplication(id);
    realtimeEvents.publish('application.changed', { action: 'deleted', applicationId: id });
    try {
      await prisma.application.delete({ where: { id } }).catch(() => null);
    } catch (e) {}

    return res.status(200).json({
      status: 'success',
      message: 'Berkas permohonan berhasil dihapus.',
    });
  } catch (error) {
    return res.status(500).json({ status: 'error', message: 'Gagal menghapus berkas permohonan.' });
  }
};

export const clearAllOperatorApplications = async (req: AuthRequest, res: Response) => {
  try {
    PersistentDatabase.clearApplications();
    try {
      await prisma.application.deleteMany({}).catch(() => null);
    } catch (e) {}
    realtimeEvents.publish('application.changed', { action: 'cleared' });
    return res.status(200).json({
      status: 'success',
      message: 'Seluruh berkas permohonan berhasil dikosongkan.',
    });
  } catch (error) {
    return res.status(500).json({ status: 'error', message: 'Gagal mengosongkan berkas.' });
  }
};

