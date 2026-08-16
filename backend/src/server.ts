import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import path from 'path';
import router from './routes';
import { globalLimiter } from './middleware/security';
import { errorHandler } from './middleware/errorHandler';

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

// Static public assets route
app.use('/public-assets', express.static(path.join(__dirname, '../public')));

// Register API Routes
app.use('/api', router);

// Healthcheck Endpoint
app.get('/api/health', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'success',
    message: 'Sistem Pelayanan Digital Desa Jombe - Backend API Active',
    timestamp: new Date().toISOString(),
    system: 'JOMBE DIGITAL v1.0.0'
  });
});

// Global Error Handler
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`==================================================`);
  console.log(`🚀 JOMBE DIGITAL Backend API Server running on port ${PORT}`);
  console.log(`🔒 Security Middlewares Active (Helmet, RateLimiter, AES-256)`);
  console.log(`==================================================`);
});

export default app;
