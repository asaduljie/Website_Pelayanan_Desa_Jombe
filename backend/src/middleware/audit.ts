import { Response, NextFunction } from 'express';
import { AuthRequest } from './auth';
import prisma from '../config/db';

export const logAuditTrail = (action: string) => {
  return async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.id || null;
      const role = req.user?.role || 'GUEST';
      const ipAddress = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || '';
      const userAgent = req.headers['user-agent'] || '';

      await prisma.auditLog.create({
        data: {
          userId: userId,
          role: role,
          action: action,
          details: JSON.stringify({
            url: req.originalUrl,
            method: req.method,
            params: req.params,
            query: req.query,
          }),
          ipAddress: String(ipAddress),
          userAgent: userAgent,
        },
      });
    } catch (error) {
      console.error('[Audit Log Error]: Failed to write audit trail record:', error);
    }

    next();
  };
};
