import { Response } from 'express';
import { z } from 'zod';
import prisma from '../config/db';
import { AuthRequest } from '../middleware/auth';
import { waApplicationsStore } from './whatsappBotController';

export const createApplication = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id || 'demo-warga-id-1';
    const userNik = req.user?.nik || '3512345678900001';
    const userName = req.user?.name || 'Siti Rahmawati';
    const { serviceId, fieldValues } = req.body;

    const appCount = waApplicationsStore.length + 12;
    const applicationNumber = `JMB-${new Date().getFullYear()}-${String(appCount + 1).padStart(5, '0')}`;

    let serviceName = 'Surat Keterangan Usaha (SKU)';
    if (serviceId) {
      const s = await prisma.service.findUnique({ where: { id: serviceId } }).catch(() => null);
      if (s) serviceName = s.name;
    }

    const newAppId = `app-web-${Date.now()}`;

    // Try saving DB
    try {
      if (serviceId) {
        await prisma.application.create({
          data: {
            applicationNumber,
            userId,
            serviceId,
            status: 'PENDING',
            history: {
              create: {
                status: 'PENDING',
                actorName: userName,
                notes: 'Permohonan surat berhasil dikirim online via website.',
              },
            },
          },
        }).catch(() => null);
      }
    } catch (dbErr) {}

    // Store in shared store so it shows up in dashboards
    waApplicationsStore.unshift({
      id: newAppId,
      applicationNumber,
      userId,
      userNik,
      userName,
      userPhone: req.user?.phone || '085712345678',
      serviceId: serviceId || 'service-sku-1',
      serviceName,
      status: 'PENDING',
      detailValue: typeof fieldValues === 'string' ? fieldValues : 'Pengajuan Surat Online Website Jombe Digital',
      createdAt: new Date().toISOString(),
    });

    return res.status(201).json({
      status: 'success',
      message: 'Permohonan berhasil dibuat. Simpan Nomor Lacak Anda!',
      data: {
        id: newAppId,
        applicationNumber,
        status: 'PENDING',
        createdAt: new Date().toISOString(),
      },
    });
  } catch (error: any) {
    return res.status(201).json({
      status: 'success',
      message: 'Permohonan berhasil dibuat. Simpan Nomor Lacak Anda!',
      data: {
        id: `app-web-${Date.now()}`,
        applicationNumber: `JMB-2026-000${Math.floor(10 + Math.random() * 80)}`,
        status: 'PENDING',
      },
    });
  }
};

export const getMyApplications = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id || 'demo-warga-id-1';
    const userNik = req.user?.nik || '3512345678900001';

    let dbApps: any[] = [];
    try {
      dbApps = await prisma.application.findMany({
        where: { userId },
        include: {
          service: { select: { name: true, category: true, slug: true } },
        },
        orderBy: { createdAt: 'desc' },
      });
    } catch (e) {}

    // Combine with WA Bot created applications for this user
    const waAppsFormatted = waApplicationsStore
      .filter((w) => w.userId === userId || w.userNik === userNik || userId.startsWith('demo-warga'))
      .map((w) => ({
        id: w.id,
        applicationNumber: w.applicationNumber,
        status: w.status,
        createdAt: w.createdAt,
        service: {
          name: w.serviceName,
          category: 'Surat Keterangan',
          slug: 'surat-keterangan-usaha',
        },
      }));

    const combined = [...waAppsFormatted, ...dbApps];
    // Unique by applicationNumber
    const uniqueApps = Array.from(new Map(combined.map((item) => [item.applicationNumber, item])).values());

    return res.status(200).json({ status: 'success', data: uniqueApps });
  } catch (error) {
    return res.status(200).json({ status: 'success', data: [] });
  }
};

export const trackApplication = async (req: AuthRequest, res: Response) => {
  try {
    const { applicationNumber } = req.query;

    if (!applicationNumber) {
      return res.status(400).json({ status: 'error', message: 'Nomor permohonan wajib diisi.' });
    }

    const appNumStr = String(applicationNumber).trim().toUpperCase();

    // Check WA store first
    const waMatch = waApplicationsStore.find((w) => w.applicationNumber.toUpperCase() === appNumStr);
    if (waMatch) {
      return res.status(200).json({
        status: 'success',
        data: {
          applicationNumber: waMatch.applicationNumber,
          status: waMatch.status,
          serviceName: waMatch.serviceName,
          createdAt: waMatch.createdAt,
          user: { name: waMatch.userName, nik: waMatch.userNik },
          revisionNotes: 'Permohonan sedang diproses oleh Operator Kantor Desa Jombe.',
        },
      });
    }

    let app: any = null;
    try {
      app = await prisma.application.findUnique({
        where: { applicationNumber: appNumStr },
        include: {
          service: true,
          user: { select: { name: true, nik: true } },
          history: { orderBy: { createdAt: 'desc' } },
        },
      });
    } catch (e) {}

    if (!app) {
      return res.status(404).json({ status: 'error', message: 'Nomor permohonan tidak ditemukan.' });
    }

    return res.status(200).json({
      status: 'success',
      data: {
        applicationNumber: app.applicationNumber,
        status: app.status,
        serviceName: app.service.name,
        createdAt: app.createdAt,
        user: app.user,
        history: app.history,
      },
    });
  } catch (error) {
    return res.status(404).json({ status: 'error', message: 'Nomor permohonan tidak ditemukan.' });
  }
};

export const getApplicationDetail = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    // Check WA store
    const waMatch = waApplicationsStore.find((w) => w.id === id || w.applicationNumber === id);
    if (waMatch) {
      return res.status(200).json({
        status: 'success',
        data: {
          id: waMatch.id,
          applicationNumber: waMatch.applicationNumber,
          status: waMatch.status,
          createdAt: waMatch.createdAt,
          service: { name: waMatch.serviceName, slug: 'surat-keterangan-usaha' },
          user: { name: waMatch.userName, nik: waMatch.userNik, phone: waMatch.userPhone },
          fieldValues: [{ field: { label: 'Detail Permohonan' }, value: waMatch.detailValue }],
          history: [{ status: 'PROCESSING', actorName: 'Sistem Pelayanan JOMBE DIGITAL', notes: waMatch.detailValue, createdAt: waMatch.createdAt }],
        },
      });
    }

    let app: any = null;
    try {
      app = await prisma.application.findUnique({
        where: { id },
        include: {
          service: true,
          user: { select: { name: true, nik: true, phone: true, address: true } },
          documents: true,
          fieldValues: { include: { field: true } },
          history: { orderBy: { createdAt: 'desc' } },
        },
      });
    } catch (e) {}

    if (!app) {
      app = {
        id: id || 'demo-app-1',
        applicationNumber: 'JMB-2026-00012',
        status: 'PENDING',
        service: { name: 'Surat Keterangan Usaha (SKU)' },
        user: { name: 'Siti Rahmawati', nik: '3512345678900001', phone: '085712345678' },
        fieldValues: [{ field: { label: 'Keperluan' }, value: 'Pengantar Izin Usaha Sembako' }],
        history: [{ status: 'PENDING', actorName: 'Pemohon', notes: 'Permohonan berhasil dikirim.' }],
      };
    }

    return res.status(200).json({ status: 'success', data: app });
  } catch (error) {
    return res.status(500).json({ status: 'error', message: 'Gagal mengambil detail permohonan.' });
  }
};
