/**
 * Water Quality API Routes
 * Simple CRUD without user auth (device-level, offline-first friendly)
 */

import { Router } from 'express';
import { z } from 'zod';
import { query } from '../db';
import { logger } from '../utils/logger';

const router = Router();

const readingSchema = z.object({
    temperature: z.number().min(0).max(50).optional(),
    dissolvedOxygen: z.number().min(0).max(25).optional(),
    ph: z.number().min(0).max(14).optional(),
    salinity: z.number().min(0).optional(),
    ammonia: z.number().min(0).optional(),
    notes: z.string().max(500).optional(),
    deviceId: z.string().default('mobile-app'),
});

/**
 * POST /api/v1/water-quality/readings
 * Store a new water quality reading (no auth required – device-level)
 */
router.post('/readings', async (req, res, next) => {
    try {
        const validated = readingSchema.parse(req.body);

        const result = await query<{ id: string; created_at: string }>(`
      INSERT INTO water_quality_readings
        (device_id, temperature, dissolved_oxygen, ph, salinity, ammonia, notes, recorded_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())
      RETURNING id, recorded_at AS created_at
    `, [
            validated.deviceId,
            validated.temperature ?? null,
            validated.dissolvedOxygen ?? null,
            validated.ph ?? null,
            validated.salinity ?? null,
            validated.ammonia ?? null,
            validated.notes ?? null,
        ]);

        logger.info('Water quality reading saved', { id: result.rows[0]?.id });

        res.status(201).json({
            success: true,
            data: result.rows[0],
        });
    } catch (error: any) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ success: false, error: 'Validation Error', details: error.issues });
        }
        next(error);
    }
});

/**
 * GET /api/v1/water-quality/readings
 * Get recent readings (last 30 days)
 */
router.get('/readings', async (req, res, next) => {
    try {
        const { deviceId = 'mobile-app', limit = '50' } = req.query;

        const result = await query(`
      SELECT id, device_id, temperature, dissolved_oxygen, ph, salinity, ammonia, notes, recorded_at
      FROM water_quality_readings
      WHERE device_id = $1
        AND recorded_at >= NOW() - INTERVAL '30 days'
      ORDER BY recorded_at DESC
      LIMIT $2
    `, [deviceId, parseInt(limit as string, 10)]);

        res.json({
            success: true,
            count: result.rowCount,
            data: result.rows,
        });
    } catch (error) {
        next(error);
    }
});

export { router as waterQualityRouter };
