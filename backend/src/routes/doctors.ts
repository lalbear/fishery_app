import { Router } from 'express';
import { z } from 'zod';
import { query } from '../db';

const router = Router();

const mappingSchema = z.object({
  farmerId: z.string().uuid(),
  doctorId: z.string().uuid(),
  panchayatId: z.string().min(2),
});

router.get('/', async (req, res, next) => {
  try {
    const { panchayatId } = req.query;
    if (typeof panchayatId === 'string' && panchayatId.trim().length > 0) {
      const result = await query(`
        SELECT
          id,
          user_id,
          name,
          phone,
          district_code,
          district_name,
          block_code,
          block_name,
          panchayat_code,
          panchayat_name,
          assigned_panchayats,
          specialization[1] AS specialization,
          availability_schedule,
          is_active,
          created_at,
          updated_at
        FROM doctors
        WHERE is_active = true
          AND $1 = ANY(assigned_panchayats)
        ORDER BY name
      `, [panchayatId.trim()]);
      return res.json({ success: true, count: result.rowCount, data: result.rows });
    }

    const result = await query(`
      SELECT
        id,
        user_id,
        name,
        phone,
        district_code,
        district_name,
        block_code,
        block_name,
        panchayat_code,
        panchayat_name,
        assigned_panchayats,
        specialization[1] AS specialization,
        availability_schedule,
        is_active,
        created_at,
        updated_at
      FROM doctors
      WHERE is_active = true
      ORDER BY name
    `);
    res.json({ success: true, count: result.rowCount, data: result.rows });
  } catch (error) {
    next(error);
  }
});

router.get('/by-user/:userId', async (req, res, next) => {
  try {
    const result = await query(`
      SELECT
        id,
        user_id,
        name,
        phone,
        district_code,
        district_name,
        block_code,
        block_name,
        panchayat_code,
        panchayat_name,
        assigned_panchayats,
        specialization,
        availability_schedule,
        is_active,
        created_at,
        updated_at
      FROM doctors
      WHERE user_id = $1
      LIMIT 1
    `, [req.params.userId]);

    if ((result.rowCount ?? 0) === 0) {
      return res.status(404).json({ success: false, error: 'Doctor profile not found for this user' });
    }

    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    next(error);
  }
});

router.get('/mapping/:farmerId', async (req, res, next) => {
  try {
    const result = await query(`
      SELECT m.*, d.name AS doctor_name, d.phone AS doctor_phone
      FROM farmer_doctor_mappings m
      JOIN doctors d ON d.id = m.doctor_id
      WHERE m.farmer_id = $1
      LIMIT 1
    `, [req.params.farmerId]);

    if (result.rowCount === 0) {
      return res.status(404).json({ success: false, error: 'No mapping found for farmer' });
    }

    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    next(error);
  }
});

router.post('/mapping', async (req, res, next) => {
  try {
    const payload = mappingSchema.parse(req.body);
    const result = await query(`
      INSERT INTO farmer_doctor_mappings (farmer_id, doctor_id, panchayat_id)
      VALUES ($1, $2, $3)
      ON CONFLICT (farmer_id) DO UPDATE SET
        doctor_id = EXCLUDED.doctor_id,
        panchayat_id = EXCLUDED.panchayat_id
      RETURNING *
    `, [payload.farmerId, payload.doctorId, payload.panchayatId]);

    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /doctors/route?panchayatCode=BR-...
 * Returns the single active doctor assigned to this panchayat.
 * Falls back to block-level search if no exact match.
 * Returns null if no doctor is assigned yet.
 */
router.get('/route', async (req, res, next) => {
  try {
    const { panchayatCode } = req.query;
    if (!panchayatCode || typeof panchayatCode !== 'string' || panchayatCode.trim().length === 0) {
      return res.status(400).json({ success: false, error: 'panchayatCode is required' });
    }

    const code = panchayatCode.trim();

    // 1. Exact panchayat match
    let result = await query(
      `SELECT
          id,
          user_id,
          name,
          phone,
          district_code,
          district_name,
          block_code,
          block_name,
          panchayat_code,
          panchayat_name,
          assigned_panchayats,
          specialization[1] AS specialization,
          availability_schedule,
          is_active,
          created_at,
          updated_at
        FROM doctors
        WHERE is_active = true AND $1 = ANY(assigned_panchayats)
        LIMIT 1`,
      [code]
    );

    if ((result.rowCount ?? 0) === 0) {
      // 2. Block-level fallback: find block_code from hierarchy, then match any panchayat in same block
      const locResult = await query(
        `SELECT block_code FROM loc_panchayats WHERE code = $1`,
        [code]
      );

      if ((locResult.rowCount ?? 0) > 0) {
        const bc: string = locResult.rows[0].block_code;
        result = await query(
          `SELECT
             id,
             user_id,
             name,
             phone,
             district_code,
             district_name,
             block_code,
             block_name,
             panchayat_code,
             panchayat_name,
             assigned_panchayats,
             specialization[1] AS specialization,
             availability_schedule,
             is_active,
             created_at,
             updated_at
           FROM doctors
           WHERE is_active = true
             AND EXISTS (
               SELECT 1 FROM unnest(assigned_panchayats) ap WHERE ap LIKE $1
             )
           LIMIT 1`,
          [`${bc}-%`]
        );
      }
    }

    if ((result.rowCount ?? 0) === 0) {
      return res.json({
        success: true,
        data: null,
        message: 'No doctor has been assigned to this panchayat yet.',
      });
    }

    res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    next(err);
  }
});

export { router as doctorsRouter };
