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
        SELECT *
        FROM doctors
        WHERE is_active = true
          AND $1 = ANY(assigned_panchayats)
        ORDER BY name
      `, [panchayatId.trim()]);
      return res.json({ success: true, count: result.rowCount, data: result.rows });
    }

    const result = await query(`
      SELECT *
      FROM doctors
      WHERE is_active = true
      ORDER BY name
    `);
    res.json({ success: true, count: result.rowCount, data: result.rows });
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

export { router as doctorsRouter };
