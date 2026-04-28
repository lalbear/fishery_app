import { Router } from 'express';
import { z } from 'zod';
import { query } from '../db';

const router = Router();

const upsertSchema = z.object({
  appointmentId: z.string().uuid(),
  diseaseId: z.string().uuid().optional(),
  medicines: z.array(
    z.object({
      name: z.string().min(2),
      dosage: z.string().min(1),
      duration: z.string().min(1),
    })
  ).default([]),
  notes: z.string().optional(),
});

router.get('/:appointmentId', async (req, res, next) => {
  try {
    const result = await query(`
      SELECT t.*, d.name AS disease_name
      FROM treatments t
      LEFT JOIN diseases d ON d.id = t.disease_id
      WHERE t.appointment_id = $1
      LIMIT 1
    `, [req.params.appointmentId]);

    if (result.rowCount === 0) {
      return res.status(404).json({ success: false, error: 'Treatment not found' });
    }

    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    next(error);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const payload = upsertSchema.parse(req.body);
    const result = await query(`
      INSERT INTO treatments (appointment_id, disease_id, medicines, notes)
      VALUES ($1, $2, $3::jsonb, $4)
      ON CONFLICT (appointment_id) DO UPDATE SET
        disease_id = EXCLUDED.disease_id,
        medicines = EXCLUDED.medicines,
        notes = EXCLUDED.notes,
        updated_at = NOW()
      RETURNING *
    `, [
      payload.appointmentId,
      payload.diseaseId || null,
      JSON.stringify(payload.medicines),
      payload.notes || null,
    ]);

    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (error) {
    next(error);
  }
});

export { router as treatmentsRouter };
