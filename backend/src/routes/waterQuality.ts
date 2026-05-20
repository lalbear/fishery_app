/**
 * Water Quality API Routes
 * CRUD for water quality readings with authentication.
 */

import { Router } from 'express';
import { z } from 'zod';
import { query } from '../db';
import { logger } from '../utils/logger';
import { requireAuth } from '../middleware/auth';
import { validateBody, waterQualityReadingSchema } from '../middleware/validate';

const router = Router();

// All water quality routes require authentication
router.use(requireAuth);

const readingSchema = z.object({
    temperature: z.number().min(-10).max(60).optional(),
    dissolvedOxygen: z.number().min(0).max(30).optional(),
    ph: z.number().min(0).max(14).optional(),
    salinity: z.number().min(0).max(60).optional(),
    ammonia: z.number().min(0).max(20).optional(),
    nitrite: z.number().min(0).max(20).optional(),
    turbidity: z.number().min(0).max(5000).optional(),
    notes: z.string().max(2000).optional(),
}).refine(
    (data) => {
        const { notes, ...measurements } = data;
        return Object.values(measurements).some(v => v !== undefined);
    },
    { message: 'At least one measurement is required' }
);

/**
 * POST /api/v1/water-quality/readings
 * Store a new water quality reading
 */
router.post('/readings', async (req, res, next) => {
    try {
        const validated = readingSchema.parse(req.body);
        const userId = req.auth!.userId;

        const result = await query<{ id: string; created_at: string }>(`
      INSERT INTO water_quality_readings
        (user_id, temperature, dissolved_oxygen, ph, salinity, ammonia, nitrite, turbidity, notes, recorded_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW())
      RETURNING id, recorded_at AS created_at
    `, [
            userId,
            validated.temperature ?? null,
            validated.dissolvedOxygen ?? null,
            validated.ph ?? null,
            validated.salinity ?? null,
            validated.ammonia ?? null,
            validated.nitrite ?? null,
            validated.turbidity ?? null,
            validated.notes ?? null,
        ]);

        logger.info('Water quality reading saved', { id: result.rows[0]?.id, userId });

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
 * Get recent readings for the authenticated user (last 30 days, paginated)
 */
router.get('/readings', async (req, res, next) => {
    try {
        const userId = req.auth!.userId;
        const limit = Math.min(parseInt(req.query.limit as string || '50', 10), 200);
        const offset = parseInt(req.query.offset as string || '0', 10);

        const result = await query(`
      SELECT id, temperature, dissolved_oxygen, ph, salinity, ammonia, notes, recorded_at
      FROM water_quality_readings
      WHERE user_id = $1
        AND recorded_at >= NOW() - INTERVAL '30 days'
      ORDER BY recorded_at DESC
      LIMIT $2 OFFSET $3
    `, [userId, limit, offset]);

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
