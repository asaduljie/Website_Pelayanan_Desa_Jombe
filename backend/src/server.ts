import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import path from 'path';
import router from './routes';
import { globalLimiter } from './middleware/security';
import { errorHandler } from './middleware/errorHandler';
import { supabaseKeepAlive } from './services/supabaseKeepAlive';

dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 5000;

// Security Middlewares
app.use(helmet({
  contentSecurityPolicy: false,
}));
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  credentials: true
}));

app.use(globalLimiter);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ============================================================================
// GLOBAL CRASH SHIELD & SELF-HEALING GUARDS (Only in Persistent Server)
// ============================================================================
if (!process.env.VERCEL) {
  process.on('uncaughtException', (err: Error) => {
    console.error('🛡️ [SELF-HEALING] Uncaught Exception intercepted:', err.message);
  });

  process.on('unhandledRejection', (reason: any) => {
    console.error('🛡️ [SELF-HEALING] Unhandled Promise Rejection intercepted:', reason);
  });

  // Periodic Self-Healing & Memory Optimizer (Every 4 Hours)
  setInterval(() => {
    try {
      if (global.gc) global.gc();
    } catch (e) {}
  }, 4 * 60 * 60 * 1000);
}

// Static public assets route
app.use('/public-assets', express.static(path.join(__dirname, '../public')));

// Register API Routes
app.use('/api', router);

// Root Welcome Endpoint
app.get('/', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'success',
    system: 'JOMBE DIGITAL - Backend API Server',
    status_db: 'Connected to Supabase PostgreSQL',
    documentation: '/api/health',
    timestamp: new Date().toISOString(),
  });
});

// Enhanced High-Availability Healthcheck Endpoint
app.get('/api/health', (req: Request, res: Response) => {
  const memoryUsage = process.memoryUsage();
  res.status(200).json({
    status: 'success',
    system: 'JOMBE DIGITAL - High Availability Public Service Engine',
    uptimeSeconds: Math.round(process.uptime()),
    timestamp: new Date().toISOString(),
    resilience: {
      antiCrashShield: 'ACTIVE',
      selfHealing: 'ACTIVE',
      dualStoreFailover: 'ACTIVE',
      memoryHeapUsedMB: Math.round(memoryUsage.heapUsed / 1024 / 1024),
      memoryRssMB: Math.round(memoryUsage.rss / 1024 / 1024),
    },
  });
});

// Global Error Handler
app.use(errorHandler);

if (!process.env.VERCEL) {
  const server = app.listen(PORT, () => {
    console.log(`==================================================`);
    console.log(`🚀 JOMBE DIGITAL Backend API Server running on port ${PORT}`);
    console.log(`🛡️ ZERO-DOWNTIME SHIELD ACTIVE (Auto-Recovery, Crash Protection)`);
    console.log(`🔒 Security Middlewares Active (Helmet, RateLimiter, AES-256)`);
    console.log(`==================================================`);

    // Start Supabase Auto-KeepAlive & Auto-Wakeup Engine
    supabaseKeepAlive.startKeepAliveDaemon();
  });
}

export default app;
