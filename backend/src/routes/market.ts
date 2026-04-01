/**
 * Market Data API Routes
 * Handles market prices and commodity information
 */

import { Router } from 'express';
import { query } from '../db';
import { logger } from '../utils/logger';

const router = Router();

/**
 * GET /api/v1/market/prices
 * Get current market prices
 */
router.get('/prices', async (req, res, next) => {
  try {
    const { species, state, limit = '50' } = req.query;
    
    let sql = `
      SELECT * FROM market_price_latest
      WHERE 1=1
    `;
    const params: any[] = [];
    
    if (species) {
      sql += ` AND species_name ILIKE $${params.length + 1}`;
      params.push(`%${species}%`);
    }
    
    if (state) {
      sql += ` AND state_code = $${params.length + 1}`;
      params.push(state.toString().toUpperCase());
    }
    
    sql += ` ORDER BY date DESC LIMIT $${params.length + 1}`;
    params.push(parseInt(limit as string, 10));
    
    const result = await query(sql, params);
    
    res.json({
      success: true,
      count: result.rowCount,
      data: result.rows
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/v1/market/prices/:speciesId
 * Get prices for specific species
 */
router.get('/prices/species/:speciesId', async (req, res, next) => {
  try {
    const { speciesId } = req.params;
    const rawDays = Number.parseInt(String(req.query.days ?? '30'), 10);
    const days = Number.isFinite(rawDays) ? rawDays : NaN;

    if (!Number.isInteger(days) || days < 1 || days > 365) {
      return res.status(400).json({
        success: false,
        error: 'days must be an integer between 1 and 365'
      });
    }
    
    const result = await query(`
      SELECT * FROM market_prices
      WHERE species_id = $1
      AND date >= CURRENT_DATE - ($2 * INTERVAL '1 day')
      ORDER BY date DESC
    `, [speciesId, days]);
    
    res.json({
      success: true,
      count: result.rowCount,
      data: result.rows
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/v1/market/trends
 * Get market trends
 */
router.get('/trends', async (req, res, next) => {
  try {
    const result = await query(`
      SELECT 
        species_id,
        species_name,
        AVG(price_inr_per_kg) as avg_price,
        MIN(price_inr_per_kg) as min_price,
        MAX(price_inr_per_kg) as max_price,
        COUNT(*) as price_points
      FROM market_prices
      WHERE date >= CURRENT_DATE - INTERVAL '30 days'
      GROUP BY species_id, species_name
      ORDER BY avg_price DESC
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
 * POST /api/v1/market/prices
 * Add new market price (admin/ingestion)
 */
router.post('/prices', async (req, res, next) => {
  try {
    const { speciesId, speciesName, marketName, stateCode, price, grade, date, source, volume } = req.body;
    
    const result = await query(`
      INSERT INTO market_prices 
      (species_id, species_name, market_name, state_code, price_inr_per_kg, grade, date, source, volume_kg)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *
    `, [speciesId, speciesName, marketName, stateCode, price, grade, date, source || 'MANUAL_ENTRY', volume]);
    
    res.status(201).json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    next(error);
  }
});

export { router as marketRouter };
