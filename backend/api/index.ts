import { Request, Response } from 'express';

export default async function handler(req: any, res: any) {
  try {
    const serverModule = await import('../src/server');
    const app = serverModule.default;
    return app(req, res);
  } catch (error: any) {
    console.error('🛡️ [VERCEL SERVERLESS BOOT ERROR]:', error);
    return res.status(500).json({
      status: 'error',
      system: 'JOMBE DIGITAL - Serverless Boot Error Diagnostic',
      message: error?.message || 'Unknown Serverless Error',
      stack: error?.stack || String(error),
      instructions: 'Please verify DATABASE_URL in Vercel Environment Variables.',
    });
  }
}
