/**
 * Sync API Routes
 * Offline-first data synchronization using WatermelonDB sync protocol
 */

import { Router } from 'express';
import { query } from '../db';
import { logger } from '../utils/logger';

const router = Router();

/**
 * GET /api/v1/sync/changes
 * Pull changes from server since a given timestamp.
 * Returns data in WatermelonDB synchronize() pull format.
 */
router.get('/changes', async (req, res, next) => {
  try {
    const { userId, since } = req.query;

    if (!userId || !since) {
      return res.status(400).json({
        success: false,
        error: 'userId and since parameters are required'
      });
    }

    const sinceDate = new Date(since as string);

    // Pull updated knowledge_nodes (species data, economic models etc.)
    const speciesResult = await query(`
      SELECT id, parent_id, node_type, data, created_at, updated_at
      FROM knowledge_nodes
      WHERE updated_at > $1
      ORDER BY updated_at ASC
    `, [sinceDate]);

    // Pull updated market prices
    const marketResult = await query(`
      SELECT id, species_id, species_name, market_name, state_code,
             price_inr_per_kg, grade, date, source, created_at
      FROM market_prices
      WHERE created_at > $1
      ORDER BY created_at ASC
    `, [sinceDate]);

    // Pull user's pond updates (safe: ignore if ponds table has no user_id column yet)
    let pondRows: any[] = [];
    try {
      const pondsResult = await query(`
        SELECT id, name, area_hectares, water_source_type, system_type,
               species_id, stocking_date, status,
               ST_Y(location::geometry) AS latitude,
               ST_X(location::geometry) AS longitude,
               created_at, updated_at
        FROM ponds
        WHERE user_id = $1 AND updated_at > $2
        ORDER BY updated_at ASC
      `, [userId, sinceDate]);
      pondRows = pondsResult.rows;
    } catch (_) { }

    let waterQualityRows: any[] = [];
    try {
      const waterQualityResult = await query(`
        SELECT id, pond_id, timestamp, temperature, dissolved_oxygen, ph,
               salinity, alkalinity, ammonia, nitrite, turbidity, created_at
        FROM water_quality_logs
        WHERE user_id = $1 AND created_at > $2
        ORDER BY created_at ASC
      `, [userId, sinceDate]);
      waterQualityRows = waterQualityResult.rows;
    } catch (_) { }

    // Format into WatermelonDB pull format
    const changes: Record<string, { created: any[], updated: any[], deleted: string[] }> = {
      knowledge_nodes: {
        created: [],
        updated: speciesResult.rows.map(row => ({
          id: row.id,
          node_id: row.id,
          parent_id: row.parent_id || null,
          node_type: row.node_type,
          data: typeof row.data === 'string' ? row.data : JSON.stringify(row.data),
          created_at: Math.floor(new Date(row.created_at).getTime() / 1000),
          updated_at: Math.floor(new Date(row.updated_at).getTime() / 1000),
        })),
        deleted: [],
      },
      market_prices: {
        created: [],
        updated: marketResult.rows.map(row => ({
          id: row.id,
          price_id: row.id,
          species_name: row.species_name,
          market_name: row.market_name,
          state_code: row.state_code,
          price_inr_per_kg: parseFloat(row.price_inr_per_kg),
          grade: row.grade || '',
          date: Math.floor(new Date(row.date).getTime() / 1000),
          source: row.source,
          created_at: Math.floor(new Date(row.created_at).getTime() / 1000),
        })),
        deleted: [],
      },
      ponds: {
        created: [],
        updated: pondRows.map(row => ({
          id: row.id,
          pond_id: row.id,
          name: row.name,
          area_hectares: parseFloat(row.area_hectares),
          water_source_type: row.water_source_type || '',
          system_type: row.system_type || '',
          species_id: row.species_id || '',
          stocking_date: row.stocking_date
            ? Math.floor(new Date(row.stocking_date).getTime() / 1000)
            : null,
          status: row.status || 'ACTIVE',
          latitude: row.latitude || 0,
          longitude: row.longitude || 0,
          sync_status: 'SYNCED',
          created_at: Math.floor(new Date(row.created_at).getTime() / 1000),
          updated_at: Math.floor(new Date(row.updated_at).getTime() / 1000),
        })),
        deleted: [],
      },
      water_quality_logs: {
        created: [],
        updated: waterQualityRows.map(row => ({
          id: row.id,
          log_id: row.id,
          pond_id: row.pond_id,
          timestamp: Math.floor(new Date(row.timestamp).getTime() / 1000),
          temperature: row.temperature != null ? parseFloat(row.temperature) : null,
          dissolved_oxygen: row.dissolved_oxygen != null ? parseFloat(row.dissolved_oxygen) : null,
          ph: row.ph != null ? parseFloat(row.ph) : null,
          salinity: row.salinity != null ? parseFloat(row.salinity) : null,
          alkalinity: row.alkalinity != null ? parseFloat(row.alkalinity) : null,
          ammonia: row.ammonia != null ? parseFloat(row.ammonia) : null,
          nitrite: row.nitrite != null ? parseFloat(row.nitrite) : null,
          turbidity: row.turbidity != null ? parseFloat(row.turbidity) : null,
          alerts: JSON.stringify([]),
          sync_status: 'SYNCED',
          created_at: Math.floor(new Date(row.created_at).getTime() / 1000),
        })),
        deleted: [],
      }
    };

    logger.info('Sync pull changes', {
      userId,
      since: sinceDate.toISOString(),
      knowledgeNodes: speciesResult.rows.length,
      marketPrices: marketResult.rows.length,
      ponds: pondRows.length,
      waterQualityLogs: waterQualityRows.length,
    });

    res.json({
      success: true,
      data: {
        changes,
        timestamp: new Date().toISOString(),
      }
    });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/v1/sync
 * Push local changes to server (ponds, water quality logs).
 * Accepts WatermelonDB synchronize() push format.
 */
router.post('/', async (req, res, next) => {
  try {
    const { userId, changes } = req.body;

    if (!userId) {
      return res.status(400).json({ success: false, error: 'userId is required' });
    }

    const conflicts: any[] = [];
    let pushedCount = 0;

    // Process pond changes
    if (changes?.ponds) {
      const pondChanges = [...(changes.ponds.created || []), ...(changes.ponds.updated || [])];
      for (const pond of pondChanges) {
        try {
          await query(`
            INSERT INTO ponds (id, user_id, name, area_hectares, water_source_type,
                               system_type, species_id, stocking_date, status, location,
                               created_at, updated_at)
            VALUES (
              $1, $2, $3, $4, $5, $6, $7, $8, $9,
              CASE
                WHEN $10::double precision IS NOT NULL AND $11::double precision IS NOT NULL
                  THEN ST_SetSRID(ST_MakePoint($11, $10), 4326)::geography
                ELSE NULL
              END,
              NOW(), NOW()
            )
            ON CONFLICT (id) DO UPDATE SET
              name = EXCLUDED.name,
              area_hectares = EXCLUDED.area_hectares,
              water_source_type = EXCLUDED.water_source_type,
              system_type = EXCLUDED.system_type,
              species_id = EXCLUDED.species_id,
              stocking_date = EXCLUDED.stocking_date,
              status = EXCLUDED.status,
              location = EXCLUDED.location,
              updated_at = NOW()
          `, [
            pond.id, userId, pond.name, pond.area_hectares,
            pond.water_source_type || '', pond.system_type || '',
            pond.species_id || null, pond.stocking_date ? new Date(pond.stocking_date * 1000) : null,
            pond.status || 'ACTIVE', pond.latitude || null, pond.longitude || null
          ]);
          pushedCount++;
        } catch (err: any) {
          conflicts.push({ table: 'ponds', id: pond.id, error: err.message });
        }
      }
    }

    // Process water quality log changes
    if (changes?.water_quality_logs) {
      const logChanges = [...(changes.water_quality_logs.created || []), ...(changes.water_quality_logs.updated || [])];
      for (const log of logChanges) {
        try {
          await query(`
            INSERT INTO water_quality_logs (
              id, user_id, pond_id, timestamp, temperature, dissolved_oxygen,
              ph, salinity, alkalinity, ammonia, nitrite, turbidity, created_at
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, NOW())
            ON CONFLICT (id) DO UPDATE SET
              timestamp = EXCLUDED.timestamp,
              temperature = EXCLUDED.temperature,
              dissolved_oxygen = EXCLUDED.dissolved_oxygen,
              ph = EXCLUDED.ph,
              salinity = EXCLUDED.salinity,
              alkalinity = EXCLUDED.alkalinity,
              ammonia = EXCLUDED.ammonia,
              nitrite = EXCLUDED.nitrite,
              turbidity = EXCLUDED.turbidity
          `, [
            log.id,
            userId,
            log.pond_id,
            log.timestamp ? new Date(log.timestamp * 1000) : new Date(),
            log.temperature ?? null,
            log.dissolved_oxygen ?? null,
            log.ph ?? null,
            log.salinity ?? null,
            log.alkalinity ?? null,
            log.ammonia ?? null,
            log.nitrite ?? null,
            log.turbidity ?? null
          ]);
          pushedCount++;
        } catch (err: any) {
          conflicts.push({ table: 'water_quality_logs', id: log.id, error: err.message });
        }
      }
    }

    logger.info('Sync push complete', { userId, pushed: pushedCount, conflicts: conflicts.length });

    res.json({
      success: true,
      data: {
        pushed: pushedCount,
        conflicts,
        serverTimestamp: new Date().toISOString(),
      }
    });
  } catch (error) {
    next(error);
  }
});

export { router as syncRouter };
