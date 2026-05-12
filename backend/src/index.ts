/**
 * Fishing God Backend - Express Application Entry Point
 */

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';

import { logger } from './utils/logger';
import { checkConnection } from './db';

// Import routes
import { economicsRouter } from './routes/economics';
import { geoRouter } from './routes/geography';
import { speciesRouter } from './routes/species';
import { syncRouter } from './routes/sync';
import { marketRouter } from './routes/market';
import { waterQualityRouter } from './routes/waterQuality';
import { authRouter } from './routes/auth';
import { knowledgeRouter } from './routes/knowledge';
import { diseasesRouter } from './routes/diseases';
import { doctorsRouter } from './routes/doctors';
import { appointmentsRouter } from './routes/appointments';
import { locationsRouter } from './routes/locations';
import { treatmentsRouter } from './routes/treatments';
import { labReportsRouter } from './routes/labReports';

// Load environment variables
dotenv.config();

const app = express();
const PORT = parseInt(process.env.PORT || '3000', 10);
const HOST = process.env.HOST || '0.0.0.0';

app.use((req, res, next) => {
  const startedAt = Date.now();

  logger.info('HTTP request started', {
    method: req.method,
    path: req.originalUrl,
    ip: req.ip,
  });

  res.on('finish', () => {
    logger.info('HTTP request completed', {
      method: req.method,
      path: req.originalUrl,
      statusCode: res.statusCode,
      durationMs: Date.now() - startedAt,
    });
  });

  next();
});

// Security middleware
app.use(helmet());
// CORS: allow mobile app (no origin header) + explicit web origins.
// Native mobile apps don't send Origin headers, so '*' is safe for them.
// Restricting to specific origins only matters for browser clients.
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:19006',
  'http://10.0.2.2:3000',
  ...(process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : []),
];
app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, curl, Postman)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    // In dev, allow all; in prod, block unknown web origins
    if (process.env.NODE_ENV !== 'production') return callback(null, true);
    callback(new Error(`CORS: origin ${origin} not allowed`));
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));

// Rate limiting — generous limits for a mobile app whose users may share
// a NAT IP.  Catalog reads are cheap; auth/write calls get a tighter cap.
const readLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000, // 1 000 catalog/data reads per 15 min per IP
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, error: 'Too many requests. Please wait a moment and try again.' },
});
const writeLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200, // tighter cap for mutations / sync
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, error: 'Too many requests. Please wait a moment and try again.' },
});
// Auth-specific limiter: strict brute-force protection.
// 20 attempts per 15 minutes per IP (prevents password guessing at scale).
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, error: 'Too many login attempts. Please wait 15 minutes and try again.' },
  skipSuccessfulRequests: true, // only count failed/non-2xx responses toward the cap
});

// Apply per-route-type limiters instead of a single global cap
app.use('/api/v1/auth', authLimiter as any); // strict brute-force guard
app.use('/api/v1/sync', writeLimiter as any);
app.use('/api/v1/water-quality', writeLimiter as any);
app.use(readLimiter as any); // everything else (species, market, geo, economics, equipment)

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/health', async (req, res) => {
  const dbConnected = await checkConnection();
  res.status(dbConnected ? 200 : 503).json({
    status: dbConnected ? 'healthy' : 'unhealthy',
    timestamp: new Date().toISOString(),
    database: dbConnected ? 'connected' : 'disconnected',
    version: '1.0.0'
  });
});

// API routes
app.use('/api/v1/economics', economicsRouter);
app.use('/api/v1/geo', geoRouter);
app.use('/api/v1/species', speciesRouter);
app.use('/api/v1/sync', syncRouter);
app.use('/api/v1/market', marketRouter);
app.use('/api/v1/water-quality', waterQualityRouter);
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/knowledge', knowledgeRouter);
app.use('/api/v1/diseases', diseasesRouter);
app.use('/api/v1/doctors', doctorsRouter);
app.use('/api/v1/appointments', appointmentsRouter);
app.use('/api/v1/treatments', treatmentsRouter);
app.use('/api/v1/lab-reports', labReportsRouter);
app.use('/api/v1/locations', locationsRouter);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    name: 'Fishing God API',
    version: '1.0.0',
    description: 'Aquaculture Intelligence Platform for Indian Subcontinent',
    endpoints: {
      health: '/health',
      economics: '/api/v1/economics',
      geography: '/api/v1/geo',
      species: '/api/v1/species',
      sync: '/api/v1/sync',
      market: '/api/v1/market'
    }
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.method} ${req.path} not found`
  });
});

// Error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  logger.error('Express error', { error: err.message, stack: err.stack });
  res.status(err.status || 500).json({
    error: err.name || 'Internal Server Error',
    message: process.env.NODE_ENV === 'production'
      ? 'An unexpected error occurred'
      : err.message
  });
});

async function startServer() {
  const dbConnected = await checkConnection();

  if (!dbConnected) {
    logger.error('Startup aborted because PostgreSQL is unavailable', {
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432', 10),
      database: process.env.DB_NAME || 'fishing_god',
      user: process.env.DB_USER || 'fishinggod',
    });
    process.exit(1);
    return;
  }

  app.listen(PORT, HOST, () => {
    logger.info(`Fishing God API server running on http://${HOST}:${PORT}`);
  });
}

// Start server only when executed directly so tests can import the app safely.
if (require.main === module) {
  void startServer();
}

// Graceful shutdown
process.on('SIGTERM', async () => {
  logger.info('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', async () => {
  logger.info('SIGINT received, shutting down gracefully');
  process.exit(0);
});

export default app;
