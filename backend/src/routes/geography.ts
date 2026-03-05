/**
 * Geography API Routes
 * Handles geospatial suitability analysis
 */

import { Router } from 'express';
import { z } from 'zod';
import { GeoSuitabilityService } from '../services/GeoSuitabilityService';
import { logger } from '../utils/logger';

const router = Router();

// Validation schema for suitability request
const suitabilitySchema = z.object({
  latitude: z.number().min(6).max(37),
  longitude: z.number().min(68).max(98),
  stateCode: z.string().length(2),
  districtCode: z.string().min(2).max(50),
  waterSourceType: z.enum(['BOREWELL', 'OPEN_WELL', 'CANAL', 'RIVER', 'TANK']),
  measuredSalinityUsCm: z.number().min(0).optional()
});

/**
 * POST /api/v1/geo/suitability
 * Analyze geographic suitability for aquaculture
 */
router.post('/suitability', async (req, res, next) => {
  try {
    const validated = suitabilitySchema.parse(req.body);

    // Validate coordinates are within India
    if (!GeoSuitabilityService.validateCoordinates(validated.latitude, validated.longitude)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid coordinates',
        message: 'Coordinates must be within Indian boundaries'
      });
    }

    logger.info('Geographic suitability analysis', {
      lat: validated.latitude,
      lng: validated.longitude,
      state: validated.stateCode
    });

    const result = await GeoSuitabilityService.analyzeSuitability({
      latitude: validated.latitude,
      longitude: validated.longitude,
      stateCode: validated.stateCode,
      districtCode: validated.districtCode,
      waterSourceType: validated.waterSourceType,
      measuredSalinityUsCm: validated.measuredSalinityUsCm
    });

    res.json({
      success: true,
      data: result
    });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: 'Validation Error',
        message: 'Coordinates must be within Indian boundaries or data is invalid.',
        details: error.issues
      });
    } else if (error.errors) {
      return res.status(400).json({
        success: false,
        error: 'Validation Error',
        details: error.errors
      });
    } else {
      next(error);
    }
  }
});

/**
 * GET /api/v1/geo/zones
 * Get all geographic zones
 */
router.get('/zones', async (req, res, next) => {
  try {
    const { query } = await import('../db');
    const result = await query(`
      SELECT * FROM geographic_zones
      ORDER BY state_code, zone_name
    `);

    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/v1/geo/zones/:stateCode
 * Get zones for a specific state
 */
router.get('/zones/:stateCode', async (req, res, next) => {
  try {
    const { stateCode } = req.params;
    const { query } = await import('../db');

    const result = await query(`
      SELECT * FROM geographic_zones
      WHERE state_code = $1
      ORDER BY zone_name
    `, [stateCode.toUpperCase()]);

    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    next(error);
  }
});

export { router as geoRouter };