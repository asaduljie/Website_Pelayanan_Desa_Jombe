import { Response } from 'express';
import prisma from '../config/db';
import { AuthRequest } from '../middleware/auth';
import { waApplicationsStore, sendNotificationToCitizenWhatsApp, SERVICE_PHOTO_REQUIREMENTS } from './whatsappBotController';
import { PersistentDatabase } from '../utils/persistentDb';

export const getOperatorDashboardStats = async (req: AuthRequest, res: Response) => {
  try {
    const allApps = PersistentDatabase.loadApplications();

    const pendingCount = allApps.filter((w) => w.status === 'PENDING').length;
    const processingCount = allApps.filter((w) => w.status === 'PROCESSING').length;
    const revisionCount = allApps.filter((w) => w.status === 'NEED_REVISION').length;
    const completedCount = allApps.filter((w) => w.status === 'COMPLETED').length;
    const totalCount = allApps.length;

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

    const allApps = PersistentDatabase.loadApplications();

    // Map persistent applications with full photo and citizen details
    const waAppsMapped = allApps.map((w) => {
      const serviceSlug = w.serviceSlug || 'surat-keterangan-usaha';
      const defaultReqs = SERVICE_PHOTO_REQUIREMENTS[serviceSlug] || ['Foto e-KTP Asli Pemohon', 'Foto Dokumen Pendukung'];

      const photos = w.uploadedPhotos && w.uploadedPhotos.length > 0
        ? w.uploadedPhotos
        : defaultReqs.map((title) => ({
            title,
            type: title.toLowerCase().includes('ktp') ? 'KTP' : title.toLowerCase().includes('usaha') ? 'USAHA' : 'KK',
          }));

      return {
        id: w.id,
        applicationNumber: w.applicationNumber,
        status: w.status,
        createdAt: w.createdAt,
        letterNumber: w.letterNumber || `503/470/${Math.floor(100 + Math.random() * 900)}/DS-JMB/2026`,
        letterContent: w.letterContent || `Menerangkan bahwa ${w.userName} adalah warga Desa Jombe dengan keterangan: ${w.detailValue}`,
        uploadedPhotos: photos,
        service: {
          id: w.serviceId,
          name: w.serviceName,
          category: 'Surat Keterangan',
          slug: serviceSlug,
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
      };
    });

    let filtered = waAppsMapped;
    if (status && status !== 'ALL') {
      filtered = waAppsMapped.filter((c) => c.status === status);
    }
    if (search) {
      const s = String(search).toLowerCase();
      filtered = filtered.filter(
        (c) =>
          c.applicationNumber.toLowerCase().includes(s) ||
          c.user?.name.toLowerCase().includes(s) ||
          c.user?.nik.toLowerCase().includes(s)
      );
    }

    return res.status(200).json({ status: 'success', data: filtered });
  } catch (error) {
    return res.status(500).json({ status: 'error', message: 'Gagal mengambil permohonan operator.' });
  }
};

/**
 * Approve and Send Letter to Citizen WhatsApp
 */
export const approveAndSendLetter = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { letterNumber, letterContent } = req.body;

    let targetAppNumber = '';
    let targetPhone = '6281299887766';
    let targetServiceName = 'Surat Keterangan Usaha (SKU)';
    let officialLetterNum = letterNumber || `503/470/${Math.floor(100 + Math.random() * 900)}/DS-JMB/2026`;

    // 1. Update in Persistent Database
    const updated = PersistentDatabase.updateApplication(id, {
      status: 'COMPLETED',
      letterNumber: officialLetterNum,
      letterContent: letterContent || undefined,
    });

    if (updated) {
      targetAppNumber = updated.applicationNumber;
      targetPhone = updated.userPhone || '6281299887766';
      targetServiceName = updated.serviceName;
      officialLetterNum = updated.letterNumber;
    }

    // 2. Try DB Update
    try {
      await prisma.application.update({
        where: { id },
        data: {
          status: 'COMPLETED',
          history: {
            create: {
              status: 'COMPLETED',
              actorName: `Operator (${req.user?.name || 'Operator'})`,
              notes: `Surat resmi disetujui (Nomor: ${officialLetterNum}) dan dikirimkan otomatis ke WhatsApp warga.`,
            },
          },
        },
      }).catch(() => null);
    } catch (e) {}

    const pdfUrl = `http://localhost:5000/api/operator/pdf/${id}`;

    // 3. Send Notification to Citizen's WhatsApp
    sendNotificationToCitizenWhatsApp(
      targetPhone,
      targetAppNumber || 'JMB-2026-00012',
      targetServiceName,
      officialLetterNum,
      pdfUrl
    );

    return res.status(200).json({
      status: 'success',
      message: `Surat resmi disetujui dan notifikasi beserta PDF berhasil dikirim ke WhatsApp warga (${targetPhone})!`,
      data: {
        applicationNumber: targetAppNumber,
        letterNumber: officialLetterNum,
        pdfUrl: pdfUrl,
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

    const updated = PersistentDatabase.updateApplication(id, {
      status,
      detailValue: revisionNotes ? `Catatan: ${revisionNotes}` : undefined,
    });

    try {
      await prisma.application.update({
        where: { id },
        data: {
          status,
          revisionNotes: revisionNotes || null,
          history: {
            create: {
              status,
              actorName: req.user!.name,
              notes: revisionNotes || `Status diperbarui menjadi ${status} oleh operator.`,
            },
          },
        },
      }).catch(() => null);
    } catch (e) {}

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

    const count = PersistentDatabase.loadApplications().length + 15;
    const applicationNumber = `JMB-${new Date().getFullYear()}-${String(count + 1).padStart(5, '0')}`;
    const newAppId = `app-assisted-${Date.now()}`;
    const letterNumber = `503/470/${Math.floor(100 + Math.random() * 900)}/DS-JMB/${new Date().getFullYear()}`;

    const newRecord: any = {
      id: newAppId,
      applicationNumber,
      userId: `user-${Date.now()}`,
      userNik: citizenNik,
      userName: citizenName,
      userPhone: citizenPhone || '081234567890',
      serviceId,
      serviceName: 'Surat Keterangan Usaha (SKU)',
      serviceSlug: 'surat-keterangan-usaha',
      status: 'PENDING',
      detailValue: notes || 'Permohonan dibuatkan oleh Operator',
      uploadedPhotos: [
        { title: 'Foto e-KTP Asli Pemohon', type: 'KTP' },
        { title: 'Foto Tempat / Kegiatan Usaha', type: 'USAHA' },
      ],
      letterNumber,
      letterContent: `Menerangkan bahwa ${citizenName} adalah benar warga Desa Jombe dengan keterangan: ${notes || '-'}`,
      createdAt: new Date().toISOString(),
    };

    PersistentDatabase.addApplication(newRecord);

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
    return res.status(200).json({
      status: 'success',
      message: 'Seluruh berkas permohonan berhasil dikosongkan.',
    });
  } catch (error) {
    return res.status(500).json({ status: 'error', message: 'Gagal mengosongkan berkas.' });
  }
};

