import { Request, Response, NextFunction } from 'express';

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('[Unhandled Server Error]:', err);

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Terjadi masalah pada server. Silakan coba beberapa saat lagi.';

  res.status(statusCode).json({
    status: 'error',
    message: message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};
