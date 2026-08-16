import { Response } from 'express';
import path from 'path';
import fs from 'fs';
import jwt from 'jsonwebtoken';
import { AuthRequest } from '../middleware/auth';

/**
 * Generate Temporary Signed Token for private document viewing (Valid for 5 minutes)
 */
export const getDocumentAccessToken = async (req: AuthRequest, res: Response) => {
  try {
    const { documentId, documentPath } = req.body;

    if (!req.user) {
      return res.status(401).json({ status: 'error', message: 'Autentikasi diperlukan.' });
    }

    const secret = process.env.JWT_SECRET || 'jombe_digital_secure_jwt_secret_key_2026_super_encrypted';
    const signedToken = jwt.sign(
      {
        userId: req.user.id,
        role: req.user.role,
        documentId: documentId,
        filePath: documentPath,
      },
      secret,
      { expiresIn: '5m' } // 5 minutes expiration
    );

    return res.status(200).json({
      status: 'success',
      data: {
        token: signedToken,
        streamUrl: `/api/documents/stream?token=${signedToken}`,
        expiresIn: '5m',
      },
    });
  } catch (error) {
    return res.status(500).json({ status: 'error', message: 'Gagal membuat token akses dokumen.' });
  }
};

/**
 * Secure Private Stream Gateway (Serves binary document stream only if signed token is valid)
 */
export const streamPrivateDocument = async (req: AuthRequest, res: Response) => {
  try {
    const { token } = req.query;

    if (!token) {
      return res.status(401).json({ status: 'error', message: 'Token akses dokumen tidak ditemukan.' });
    }

    const secret = process.env.JWT_SECRET || 'jombe_digital_secure_jwt_secret_key_2026_super_encrypted';
    let decoded: any;
    try {
      decoded = jwt.verify(String(token), secret);
    } catch (e) {
      return res.status(403).json({ status: 'error', message: 'Token akses dokumen telah kedaluwarsa atau tidak sah.' });
    }

    const filePath = decoded.filePath;
    if (!filePath || !fs.existsSync(filePath)) {
      return res.status(404).json({ status: 'error', message: 'Berkas dokumen tidak ditemukan di server.' });
    }

    const ext = path.extname(filePath).toLowerCase();
    let contentType = 'application/octet-stream';
    if (ext === '.pdf') contentType = 'application/pdf';
    if (ext === '.jpg' || ext === '.jpeg') contentType = 'image/jpeg';
    if (ext === '.png') contentType = 'image/png';

    res.setHeader('Content-Type', contentType);
    res.setHeader('Content-Disposition', 'inline');
    res.setHeader('Cache-Control', 'private, no-cache, no-store, must-revalidate');

    const readStream = fs.createReadStream(filePath);
    readStream.pipe(res);
  } catch (error) {
    return res.status(500).json({ status: 'error', message: 'Gagal menyajikan dokumen privat.' });
  }
};
