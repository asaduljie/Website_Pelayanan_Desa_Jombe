import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { Request, Response, NextFunction } from 'express';
import { validateMagicBytes } from '../utils/fileSignature';

// Ensure private uploads directory exists
const uploadDir = path.join(__dirname, '../../uploads/private');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `DOC-${uniqueSuffix}${ext}`);
  },
});

const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Format file tidak diizinkan. Hanya file PDF, JPG, JPEG, dan PNG yang diperbolehkan.'));
  }
};

export const uploadMiddleware = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // Limit 5MB per file
  },
  fileFilter: fileFilter,
});

/**
 * Middleware verification to check Binary Magic Bytes after file upload
 */
export const verifyUploadedFileSignature = (req: Request, res: Response, next: NextFunction) => {
  const files = req.files as Express.Multer.File[] | { [fieldname: string]: Express.Multer.File[] } | undefined;
  const singleFile = req.file;

  const fileList: Express.Multer.File[] = [];
  if (singleFile) fileList.push(singleFile);
  if (Array.isArray(files)) {
    fileList.push(...files);
  } else if (files && typeof files === 'object') {
    Object.values(files).forEach((arr) => fileList.push(...arr));
  }

  for (const f of fileList) {
    const isValidSignature = validateMagicBytes(f.path);
    if (!isValidSignature) {
      // Delete malicious file immediately
      fs.unlinkSync(f.path);
      return res.status(400).json({
        status: 'error',
        message: `PERINGATAN KEAMANAN: File ${f.originalname} terdeteksi memiliki struktur file yang tidak sah/berbahaya. Upload dibatalkan.`,
      });
    }
  }

  next();
};
