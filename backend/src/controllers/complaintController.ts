import { Response } from 'express';
import prisma from '../config/db';
import { AuthRequest } from '../middleware/auth';

const generateComplaintTicket = async (): Promise<string> => {
  const year = new Date().getFullYear();
  const count = await prisma.complaint.count();
  return `PGD-${year}-${String(count + 1).padStart(5, '0')}`;
};

export const createComplaint = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ status: 'error', message: 'Autentikasi diperlukan.' });
    }

    const { title, category, description, location } = req.body;
    const photoFile = req.file;

    if (!title || !category || !description) {
      return res.status(400).json({ status: 'error', message: 'Judul, Kategori, dan Deskripsi pengaduan wajib diisi.' });
    }

    const ticketNumber = await generateComplaintTicket();

    const newComplaint = await prisma.complaint.create({
      data: {
        ticketNumber,
        userId: req.user.id,
        title,
        category,
        description,
        location: location || 'Desa Jombe',
        photoUrl: photoFile ? photoFile.path : null,
        status: 'SUBMITTED',
        history: {
          create: {
            status: 'SUBMITTED',
            actorName: req.user.name,
            notes: 'Laporan pengaduan berhasil dikirim warga.',
          },
        },
      },
      include: { history: true },
    });

    return res.status(201).json({
      status: 'success',
      message: 'Pengaduan Anda telah dikirim dan akan ditindaklanjuti oleh perangkat desa.',
      data: newComplaint,
    });
  } catch (error) {
    return res.status(500).json({ status: 'error', message: 'Gagal mengirim pengaduan.' });
  }
};

export const getComplaints = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ status: 'error', message: 'Autentikasi diperlukan.' });
    }

    const whereCondition: any = {};
    if (req.user.role === 'MASYARAKAT') {
      whereCondition.userId = req.user.id;
    }

    const complaints = await prisma.complaint.findMany({
      where: whereCondition,
      include: {
        user: { select: { name: true, phone: true } },
        history: { orderBy: { createdAt: 'asc' } },
      },
      orderBy: { createdAt: 'desc' },
    });

    return res.status(200).json({ status: 'success', data: complaints });
  } catch (error) {
    return res.status(500).json({ status: 'error', message: 'Gagal mengambil daftar pengaduan.' });
  }
};

export const updateComplaintStatus = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { status, adminResponse } = req.body;

    if (!req.user || req.user.role === 'MASYARAKAT') {
      return res.status(403).json({ status: 'error', message: 'Akses ditolak.' });
    }

    const updated = await prisma.complaint.update({
      where: { id: id },
      data: {
        status: status,
        adminResponse: adminResponse,
        history: {
          create: {
            status: status,
            actorName: `Operator (${req.user.name})`,
            notes: adminResponse || `Status pengaduan diubah menjadi ${status}`,
          },
        },
      },
      include: { history: true },
    });

    return res.status(200).json({
      status: 'success',
      message: 'Status pengaduan berhasil diperbarui.',
      data: updated,
    });
  } catch (error) {
    return res.status(500).json({ status: 'error', message: 'Gagal memperbarui status pengaduan.' });
  }
};
