import { Router } from 'express';
import { z } from 'zod';
import { query, transaction } from '../db';

const router = Router();

const createSchema = z.object({
  farmerId: z.string().uuid(),
  doctorId: z.string().uuid(),
  pondId: z.string().uuid().optional(),
  issueDescription: z.string().min(5),
  suspectedDiseaseId: z.string().uuid().optional(),
  scheduledDate: z.string().datetime(),
  consultationType: z.enum(['VISIT', 'CALL']),
  emergencyFlag: z.boolean().optional().default(false),
});

const updateStatusSchema = z.object({
  status: z.enum(['REQUESTED', 'APPROVED', 'COMPLETED', 'CANCELLED']),
  paymentStatus: z.enum(['PENDING', 'PARTIAL', 'PAID']).optional(),
});

router.get('/', async (req, res, next) => {
  try {
    const { farmerId, doctorId, status } = req.query;
    const clauses: string[] = [];
    const params: unknown[] = [];

    if (typeof farmerId === 'string') {
      params.push(farmerId);
      clauses.push(`a.farmer_id = $${params.length}`);
    }
    if (typeof doctorId === 'string') {
      params.push(doctorId);
      clauses.push(`a.doctor_id = $${params.length}`);
    }
    if (typeof status === 'string') {
      params.push(status);
      clauses.push(`a.status = $${params.length}`);
    }

    const where = clauses.length ? `WHERE ${clauses.join(' AND ')}` : '';
    const result = await query(`
      SELECT
        a.*,
        d.name AS doctor_name,
        d.phone AS doctor_phone,
        p.name AS pond_name,
        dz.name AS suspected_disease_name,
        pay.total_amount,
        pay.farmer_contribution,
        pay.govt_contribution,
        pay.status AS payment_record_status
      FROM appointments a
      JOIN doctors d ON d.id = a.doctor_id
      LEFT JOIN ponds p ON p.id = a.pond_id
      LEFT JOIN diseases dz ON dz.id = a.suspected_disease_id
      LEFT JOIN appointment_payments pay ON pay.appointment_id = a.id
      ${where}
      ORDER BY a.scheduled_date DESC
    `, params);

    res.json({ success: true, count: result.rowCount, data: result.rows });
  } catch (error) {
    next(error);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const payload = createSchema.parse(req.body);
    const created = await transaction(async (client) => {
      const appt = await client.query(`
        INSERT INTO appointments (
          farmer_id, doctor_id, pond_id, issue_description, suspected_disease_id,
          status, scheduled_date, consultation_type, payment_status, emergency_flag
        )
        VALUES ($1, $2, $3, $4, $5, 'REQUESTED', $6, $7, 'PENDING', $8)
        RETURNING *
      `, [
        payload.farmerId,
        payload.doctorId,
        payload.pondId || null,
        payload.issueDescription,
        payload.suspectedDiseaseId || null,
        payload.scheduledDate,
        payload.consultationType,
        payload.emergencyFlag,
      ]);

      const appointmentId = appt.rows[0].id;
      await client.query(`
        INSERT INTO appointment_payments (
          appointment_id, total_amount, farmer_contribution, govt_contribution, status
        )
        VALUES ($1, 300, 200, 100, 'PENDING')
      `, [appointmentId]);

      return appt.rows[0];
    });

    res.status(201).json({
      success: true,
      data: created,
      advisory: payload.emergencyFlag
        ? 'Emergency request marked. Doctor should be contacted immediately.'
        : 'Appointment created successfully.',
    });
  } catch (error) {
    next(error);
  }
});

router.patch('/:id/status', async (req, res, next) => {
  try {
    const payload = updateStatusSchema.parse(req.body);
    const result = await transaction(async (client) => {
      const updated = await client.query(`
        UPDATE appointments
        SET status = $2,
            payment_status = COALESCE($3, payment_status),
            updated_at = NOW()
        WHERE id = $1
        RETURNING *
      `, [req.params.id, payload.status, payload.paymentStatus || null]);

      if (updated.rowCount === 0) {
        return null;
      }

      if (payload.paymentStatus) {
        await client.query(`
          UPDATE appointment_payments
          SET status = $2, updated_at = NOW()
          WHERE appointment_id = $1
        `, [req.params.id, payload.paymentStatus]);
      }

      return updated.rows[0];
    });

    if (!result) {
      return res.status(404).json({ success: false, error: 'Appointment not found' });
    }

    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
});

export { router as appointmentsRouter };
