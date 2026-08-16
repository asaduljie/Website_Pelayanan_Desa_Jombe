import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { Role } from '@prisma/client';
import prisma from '../config/db';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    nik: string;
    role: Role;
    name: string;
  };
}

export const authenticateToken = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ status: 'error', message: 'Akses ditolak. Token autentikasi tidak ditemukan.' });
  }

  try {
    const secret = process.env.JWT_SECRET || 'jombe_digital_secure_jwt_secret_key_2026_super_encrypted';
    const decoded = jwt.verify(token, secret) as any;
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ status: 'error', message: 'Token tidak valid atau telah kedaluwarsa.' });
  }
};

export const authorizeRoles = (...roles: Role[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ status: 'error', message: 'Autentikasi diperlukan.' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        status: 'error',
        message: 'Anda tidak memiliki hak akses / izin untuk mengakses resource ini.',
      });
    }

    next();
  };
};

/**
 * BOLA (Broken Object Level Authorization) Protection Middleware
 * Ensures a citizen can ONLY access their own application or documents.
 */
export const verifyApplicationOwnership = async (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({ status: 'error', message: 'Autentikasi diperlukan.' });
  }

  // Operator and Admin can access any application
  if (req.user.role === Role.ADMIN || req.user.role === Role.OPERATOR) {
    return next();
  }

  const applicationId = req.params.id || req.params.applicationId || req.body.applicationId;
  if (!applicationId) {
    return res.status(400).json({ status: 'error', message: 'ID Permohonan wajib disertakan.' });
  }

  try {
    const application = await prisma.application.findUnique({
      where: { id: applicationId },
      select: { userId: true },
    });

    if (!application) {
      return res.status(404).json({ status: 'error', message: 'Permohonan tidak ditemukan.' });
    }

    if (application.userId !== req.user.id) {
      return res.status(403).json({
        status: 'error',
        message: 'PERINGATAN KEAMANAN: Anda tidak berhak mengakses permohonan milik warga lain.',
      });
    }

    next();
  } catch (error) {
    return res.status(500).json({ status: 'error', message: 'Gagal melakukan verifikasi otorisasi data.' });
  }
};
