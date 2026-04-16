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
app.use(cors({
  origin: process.env.NODE_ENV === 'production'
    ? ['https://fishinggod.app', 'https://*.fishinggod.app']
    : '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use(limiter as any);

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
