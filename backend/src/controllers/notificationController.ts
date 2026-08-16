import { Response } from 'express';
import prisma from '../config/db';
import { AuthRequest } from '../middleware/auth';

export const getMyNotifications = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ status: 'error', message: 'Autentikasi diperlukan.' });
    }

    const notifications = await prisma.notification.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });

    const unreadCount = await prisma.notification.count({
      where: { userId: req.user.id, read: false },
    });

    return res.status(200).json({
      status: 'success',
      data: { unreadCount, notifications },
    });
  } catch (error) {
    return res.status(500).json({ status: 'error', message: 'Gagal mengambil notifikasi.' });
  }
};

export const markNotificationAsRead = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    if (!req.user) {
      return res.status(401).json({ status: 'error', message: 'Autentikasi diperlukan.' });
    }

    await prisma.notification.updateMany({
      where: { id: id, userId: req.user.id },
      data: { read: true },
    });

    return res.status(200).json({ status: 'success', message: 'Notifikasi ditandai telah dibaca.' });
  } catch (error) {
    return res.status(500).json({ status: 'error', message: 'Gagal memperbarui status notifikasi.' });
  }
};
