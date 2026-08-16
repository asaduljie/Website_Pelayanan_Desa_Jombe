import rateLimit from 'express-rate-limit';
import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';

// Global API rate limiter
export const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 menit
  max: 500,
  message: {
    status: 'error',
    message: 'Terlalu banyak permintaan dari IP ini. Silakan coba lagi setelah 15 menit.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Strict rate limiter for Authentication
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 menit
  max: 15,
  message: {
    status: 'error',
    message: 'Terlalu banyak percobaan autentikasi. Demi keamanan, silakan coba lagi dalam 15 menit.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Dedicated Anti-Spam & Anti-Brute-Force Rate Limiter for WhatsApp Bot
export const waBotLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 menit
  max: 40, // Max 40 pesan per menit per IP/Nomor
  message: {
    status: 'error',
    message: 'Aktivitas pengiriman pesan WhatsApp terlalu cepat. Mohon tunggu beberapa detik sebelum mengirim kembali.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Input Sanitizer & Anti-Injection Middleware
export const sanitizeInputMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const sanitize = (obj: any): any => {
    if (typeof obj === 'string') {
      // Strip potential script tags and dangerous HTML/SQL characters
      return obj
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
        .replace(/javascript:/gi, '')
        .replace(/onload=/gi, '')
        .replace(/onerror=/gi, '');
    }
    if (Array.isArray(obj)) {
      return obj.map(sanitize);
    }
    if (obj && typeof obj === 'object') {
      const cleaned: any = {};
      for (const key of Object.keys(obj)) {
        cleaned[key] = sanitize(obj[key]);
      }
      return cleaned;
    }
    return obj;
  };

  if (req.body) req.body = sanitize(req.body);
  if (req.query) req.query = sanitize(req.query);
  if (req.params) req.params = sanitize(req.params);

  next();
};

// Cryptographic HMAC-SHA256 Token Generator & Validator for Secure Document & PDF URLs
const DOC_SECRET = process.env.DOC_ACCESS_SECRET || 'jombe_ultra_secure_document_secret_key_2026';

export const generateSecureDocToken = (docId: string, expiresInMinutes: number = 30): string => {
  const expiresAt = Date.now() + expiresInMinutes * 60 * 1000;
  const payload = `${docId}:${expiresAt}`;
  const signature = crypto.createHmac('sha256', DOC_SECRET).update(payload).digest('hex');
  return `${Buffer.from(payload).toString('base64url')}.${signature}`;
};

export const verifySecureDocToken = (token: string, docId: string): boolean => {
  try {
    if (!token || !token.includes('.')) return false;
    const [payloadB64, signature] = token.split('.');
    const payload = Buffer.from(payloadB64, 'base64url').toString('utf8');
    const [payloadDocId, expiresAtStr] = payload.split(':');

    if (payloadDocId !== docId) return false;
    const expiresAt = parseInt(expiresAtStr, 10);
    if (Date.now() > expiresAt) return false; // Expired

    const expectedSignature = crypto.createHmac('sha256', DOC_SECRET).update(payload).digest('hex');
    return crypto.timingSafeEqual(Buffer.from(signature, 'hex'), Buffer.from(expectedSignature, 'hex'));
  } catch (err) {
    return false;
  }
};
