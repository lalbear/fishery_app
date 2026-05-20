import { Router } from 'express';
import { z } from 'zod';
import { query, transaction } from '../db';
import { requireAuth } from '../middleware/auth';
import { imageUriSchema } from '../middleware/validate';

const router = Router();

// All appointment routes require authentication
router.use(requireAuth);

const createSchema = z.object({
  farmerId: z.string().uuid(),
  doctorId: z.string().uuid(),
  pondId: z.string().uuid().optional(),
  issueDescription: z.string().min(5).max(2000),
  suspectedDiseaseId: z.string().uuid().optional(),
  scheduledDate: z.string().datetime(),
  consultationType: z.enum(['VISIT', 'CALL']),
  emergencyFlag: z.boolean().optional().default(false),
  photoUri: imageUriSchema.optional(),
});

const visitReportSchema = z.object({
  diagnosis: z.string().min(2).max(500),
  treatmentPlan: z.string().min(2).max(1000),
  notes: z.string().max(2000).optional().default(''),
  followUpRequired: z.boolean().optional().default(false),
  followUpDate: z.string().datetime().optional(),
  completionChecklist: z.object({
    pondInspected: z.boolean(),
    fishObserved: z.boolean(),
    farmerCounseled: z.boolean(),
  }),
});

const updateStatusSchema = z.object({
  status: z.enum(['REQUESTED', 'APPROVED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED']),
  paymentStatus: z.enum(['PENDING', 'PARTIAL', 'PAID']).optional(),
  report: visitReportSchema.optional(),
});

const noteSchema = z.object({
  authorName: z.string().min(2).max(120),
  text: z.string().min(1).max(2000),
});

async function fetchAppointmentById(appointmentId: string) {
  const appointmentResult = await query(`
      SELECT
        a.*,
        d.name AS doctor_name,
        d.phone AS doctor_phone,
        d.block_name AS doctor_block_name,
        d.panchayat_name AS doctor_panchayat_name,
        d.specialization AS doctor_specialization,
        u.name AS farmer_name,
        u.phone_number AS farmer_phone,
        p.name AS pond_name,
        p.area_hectares,
        p.water_source_type,
        ST_Y((p.location::geometry)) AS latitude,
        ST_X((p.location::geometry)) AS longitude,
        pd.name AS pond_district_name,
        pb.name AS pond_block_name,
        pp.name AS pond_panchayat_name,
        dz.name AS suspected_disease_name,
        pay.total_amount,
        pay.farmer_contribution,
        pay.govt_contribution,
        pay.status AS payment_record_status,
        latest_wq.temperature AS latest_temperature,
        latest_wq.dissolved_oxygen AS latest_dissolved_oxygen,
        latest_wq.ph AS latest_ph,
        latest_wq.ammonia AS latest_ammonia,
        latest_wq.timestamp AS latest_water_quality_at
      FROM appointments a
      JOIN doctors d ON d.id = a.doctor_id
      JOIN users u ON u.id = a.farmer_id
      LEFT JOIN ponds p ON p.id = a.pond_id
      LEFT JOIN loc_districts pd ON pd.code = p.district_code
      LEFT JOIN loc_blocks pb ON pb.code = p.block_code
      LEFT JOIN loc_panchayats pp ON pp.code = p.panchayat_code
      LEFT JOIN diseases dz ON dz.id = a.suspected_disease_id
      LEFT JOIN appointment_payments pay ON pay.appointment_id = a.id
      LEFT JOIN LATERAL (
        SELECT
          wq.temperature,
          wq.dissolved_oxygen,
          wq.ph,
          wq.ammonia,
          wq.timestamp
        FROM water_quality_logs wq
        WHERE wq.pond_id = a.pond_id
        ORDER BY wq.timestamp DESC
        LIMIT 1
      ) latest_wq ON true
      WHERE a.id = $1
      LIMIT 1
  `, [appointmentId]);

  if ((appointmentResult.rowCount ?? 0) === 0) {
    return null;
  }

  const notesResult = await query(`
      SELECT
        id,
        author_name AS author,
        note_text AS text,
        created_at AS timestamp
      FROM appointment_notes
      WHERE appointment_id = $1
      ORDER BY created_at DESC
  `, [appointmentId]);

  return {
    ...appointmentResult.rows[0],
    note_history: notesResult.rows,
  };
}

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
        d.block_name AS doctor_block_name,
        d.panchayat_name AS doctor_panchayat_name,
        d.specialization AS doctor_specialization,
        u.name AS farmer_name,
        u.phone_number AS farmer_phone,
        p.name AS pond_name,
        p.area_hectares,
        p.water_source_type,
        ST_Y((p.location::geometry)) AS latitude,
        ST_X((p.location::geometry)) AS longitude,
        pd.name AS pond_district_name,
        pb.name AS pond_block_name,
        pp.name AS pond_panchayat_name,
        dz.name AS suspected_disease_name,
        pay.total_amount,
        pay.farmer_contribution,
        pay.govt_contribution,
        pay.status AS payment_record_status,
        latest_wq.temperature AS latest_temperature,
        latest_wq.dissolved_oxygen AS latest_dissolved_oxygen,
        latest_wq.ph AS latest_ph,
        latest_wq.ammonia AS latest_ammonia,
        latest_wq.timestamp AS latest_water_quality_at
      FROM appointments a
      JOIN doctors d ON d.id = a.doctor_id
      JOIN users u ON u.id = a.farmer_id
      LEFT JOIN ponds p ON p.id = a.pond_id
      LEFT JOIN loc_districts pd ON pd.code = p.district_code
      LEFT JOIN loc_blocks pb ON pb.code = p.block_code
      LEFT JOIN loc_panchayats pp ON pp.code = p.panchayat_code
      LEFT JOIN diseases dz ON dz.id = a.suspected_disease_id
      LEFT JOIN appointment_payments pay ON pay.appointment_id = a.id
      LEFT JOIN LATERAL (
        SELECT
          wq.temperature,
          wq.dissolved_oxygen,
          wq.ph,
          wq.ammonia,
          wq.timestamp
        FROM water_quality_logs wq
        WHERE wq.pond_id = a.pond_id
        ORDER BY wq.timestamp DESC
        LIMIT 1
      ) latest_wq ON true
      ${where}
      ORDER BY a.scheduled_date DESC, a.created_at DESC
    `, params);

    res.json({ success: true, count: result.rowCount, data: result.rows });
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const appointment = await fetchAppointmentById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ success: false, error: 'Appointment not found' });
    }

    res.json({ success: true, data: appointment });
  } catch (error) {
    next(error);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const payload = createSchema.parse(req.body);
    const created = await transaction(async (client) => {
      const images = payload.photoUri ? [payload.photoUri] : [];
      const appt = await client.query(`
        INSERT INTO appointments (
          farmer_id, doctor_id, pond_id, issue_description, suspected_disease_id,
          status, scheduled_date, consultation_type, payment_status, emergency_flag, farmer_images
        )
        VALUES ($1, $2, $3, $4, $5, 'REQUESTED', $6, $7, 'PENDING', $8, $9::text[])
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
        images,
      ]);

      const appointmentId = appt.rows[0].id;
      await client.query(`
        INSERT INTO appointment_payments (
          appointment_id, total_amount, farmer_contribution, govt_contribution, status
        )
        VALUES ($1, 300, 200, 100, 'PENDING')
      `, [appointmentId]);

      await client.query(`
        INSERT INTO appointment_notes (appointment_id, author_name, note_text)
        VALUES ($1, 'system', 'Appointment created and assigned to doctor queue.')
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

router.post('/:id/notes', async (req, res, next) => {
  try {
    const payload = noteSchema.parse(req.body);
    const result = await query(`
      INSERT INTO appointment_notes (appointment_id, author_name, note_text)
      VALUES ($1, $2, $3)
      RETURNING
        id,
        author_name AS author,
        note_text AS text,
        created_at AS timestamp
    `, [req.params.id, payload.authorName, payload.text.trim()]);

    res.status(201).json({ success: true, data: result.rows[0] });
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
            accepted_at = CASE
              WHEN $2 = 'APPROVED' AND accepted_at IS NULL THEN NOW()
              ELSE accepted_at
            END,
            started_at = CASE
              WHEN $2 = 'IN_PROGRESS' AND started_at IS NULL THEN NOW()
              ELSE started_at
            END,
            completed_at = CASE
              WHEN $2 = 'COMPLETED' THEN NOW()
              ELSE completed_at
            END,
            visit_diagnosis = COALESCE($4, visit_diagnosis),
            visit_treatment_plan = COALESCE($5, visit_treatment_plan),
            visit_notes = COALESCE($6, visit_notes),
            follow_up_required = COALESCE($7, follow_up_required),
            follow_up_date = COALESCE($8, follow_up_date),
            completion_checklist = COALESCE($9::jsonb, completion_checklist),
            updated_at = NOW()
        WHERE id = $1
        RETURNING *
      `, [
        req.params.id,
        payload.status,
        payload.paymentStatus || null,
        payload.report?.diagnosis || null,
        payload.report?.treatmentPlan || null,
        payload.report?.notes || null,
        typeof payload.report?.followUpRequired === 'boolean' ? payload.report.followUpRequired : null,
        payload.report?.followUpDate || null,
        payload.report?.completionChecklist ? JSON.stringify(payload.report.completionChecklist) : null,
      ]);

      if ((updated.rowCount ?? 0) === 0) {
        return null;
      }

      if (payload.paymentStatus) {
        await client.query(`
          UPDATE appointment_payments
          SET status = $2, updated_at = NOW()
          WHERE appointment_id = $1
        `, [req.params.id, payload.paymentStatus]);
      }

      const noteText =
        payload.status === 'APPROVED'
          ? 'Doctor acknowledged the booking.'
          : payload.status === 'IN_PROGRESS'
          ? 'Doctor marked the field visit as in progress.'
          : payload.status === 'COMPLETED'
          ? 'Doctor completed the appointment and submitted the visit report.'
          : payload.status === 'CANCELLED'
          ? 'Appointment was cancelled.'
          : 'Appointment status updated.';

      await client.query(`
        INSERT INTO appointment_notes (appointment_id, author_name, note_text)
        VALUES ($1, 'system', $2)
      `, [req.params.id, noteText]);

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
