import { Router } from 'express';
import { z } from 'zod';
import { query } from '../db';

const router = Router();

const createSchema = z.object({
  appointmentId: z.string().uuid(),
  reportType: z.string().min(2),
  fileUrl: z.string().url(),
  resultSummary: z.string().optional(),
});

router.get('/:appointmentId', async (req, res, next) => {
  try {
    const result = await query(`
      SELECT *
      FROM lab_reports
      WHERE appointment_id = $1
      ORDER BY created_at DESC
    `, [req.params.appointmentId]);

    res.json({ success: true, count: result.rowCount, data: result.rows });
  } catch (error) {
    next(error);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const payload = createSchema.parse(req.body);
    const result = await query(`
      INSERT INTO lab_reports (appointment_id, report_type, file_url, result_summary)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `, [payload.appointmentId, payload.reportType, payload.fileUrl, payload.resultSummary || null]);

    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (error) {
    next(error);
  }
});

export { router as labReportsRouter };
