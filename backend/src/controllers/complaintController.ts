import { Response, Request } from 'express';
import prisma from '../config/db';
import { AuthRequest } from '../middleware/auth';
import { PersistentDatabase, ComplaintRecord } from '../utils/persistentDb';
import { verifyCaptchaToken } from './captchaController';

const generateComplaintTicket = (): string => {
  const year = new Date().getFullYear();
  const count = PersistentDatabase.loadComplaints().length;
  return `PGD-${year}-${String(count + 1).padStart(5, '0')}`;
};

export const createComplaint = async (req: AuthRequest, res: Response) => {
  try {
    const {
      title,
      category,
      description,
      location,
      nik: bodyNik,
      name: bodyName,
      phone: bodyPhone,
      captchaToken,
      captchaAnswer,
    } = req.body;
    const photoFile = req.file;

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

    if (!title || !category || !description) {
      return res.status(400).json({ status: 'error', message: 'Judul, Kategori, dan Deskripsi pengaduan wajib diisi.' });
    }

    const userNik = String(bodyNik || req.user?.nik || '7304011234560001').replace(/\D/g, '');
    const userName = String(bodyName || req.user?.name || 'Warga Desa Jombe').trim();
    const userPhone = String(bodyPhone || (req.user as any)?.phone || '-').trim();
    const userId = req.user?.id || `warga-${userNik}`;

    const resolvedPhotoUrl = req.body.photoUrl || (photoFile ? photoFile.path.replace(/\\/g, '/') : undefined);
    const ticketNumber = generateComplaintTicket();

    const newRecord: ComplaintRecord = {
      id: `complaint-${Date.now()}`,
      ticketNumber,
      userId,
      userNik,
      userName,
      userPhone,
      title,
      category,
      description,
      location: location || 'Desa Jombe',
      photoUrl: resolvedPhotoUrl,
      status: 'SUBMITTED',
      createdAt: new Date().toISOString(),
    };

    PersistentDatabase.addComplaint(newRecord);

    try {
      await prisma.complaint.create({
        data: {
          ticketNumber,
          userId,
          title,
          category,
          description,
          location: location || 'Desa Jombe',
          photoUrl: photoFile ? photoFile.path : null,
          status: 'SUBMITTED',
          history: {
            create: {
              status: 'SUBMITTED',
              actorName: userName,
              notes: 'Laporan pengaduan berhasil dikirim mandiri via website.',
            },
          },
        },
      }).catch(() => null);
    } catch (e) {}

    return res.status(201).json({
      status: 'success',
      message: 'Pengaduan Anda telah dikirim dan akan ditindaklanjuti oleh Pemerintah Desa Jombe.',
      data: newRecord,
    });
  } catch (error: any) {
    return res.status(500).json({ status: 'error', message: 'Gagal mengirim pengaduan: ' + error.message });
  }
};

export const getComplaints = async (req: AuthRequest, res: Response) => {
  try {
    const all = await PersistentDatabase.loadComplaintsAsync();
    // Publik / Warga dapat melihat daftar pengaduan (transparansi publik) atau disaring jika ada login
    let result = all;
    if (req.user && req.user.role === 'MASYARAKAT') {
      result = all.filter((c) => c.userId === req.user?.id || c.userNik === req.user?.nik);
    }

    return res.status(200).json({ status: 'success', data: result });
  } catch (error) {
    return res.status(500).json({ status: 'error', message: 'Gagal mengambil daftar pengaduan.' });
  }
};

export const updateComplaintStatus = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { status, adminResponse, assignedOfficer, officerPhone } = req.body;

    if (!req.user || req.user.role === 'MASYARAKAT') {
      return res.status(403).json({ status: 'error', message: 'Akses ditolak.' });
    }

    const updated = PersistentDatabase.updateComplaint(id, {
      status,
      adminResponse,
      assignedOfficer,
      officerPhone,
    });

    try {
      await prisma.complaint.update({
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
      }).catch(() => null);
    } catch (e) {}

    return res.status(200).json({
      status: 'success',
      message: 'Status pengaduan berhasil diperbarui oleh operator.',
      data: updated,
    });
  } catch (error) {
    return res.status(500).json({ status: 'error', message: 'Gagal memperbarui status pengaduan.' });
  }
};

export const deleteComplaint = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    PersistentDatabase.deleteComplaint(id);
    try {
      await prisma.complaint.delete({ where: { id } }).catch(() => null);
    } catch (e) {}

    return res.status(200).json({
      status: 'success',
      message: 'Laporan pengaduan berhasil dihapus.',
    });
  } catch (error) {
    return res.status(500).json({ status: 'error', message: 'Gagal menghapus pengaduan.' });
  }
};
