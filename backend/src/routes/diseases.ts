import { Router } from 'express';
import { z } from 'zod';
import { query } from '../db';

const router = Router();

const filtersSchema = z.object({
  category: z.enum(['BACTERIAL', 'VIRAL', 'PARASITIC', 'FUNGAL', 'NUTRITIONAL', 'ENVIRONMENTAL']).optional(),
  species: z.string().optional(),
  symptom: z.string().optional(),
  severity: z.enum(['LOW', 'MEDIUM', 'HIGH']).optional(),
  q: z.string().optional(),
});

const suggestSchema = z.object({
  symptoms: z.array(z.string()).min(1),
  species: z.string().optional(),
  waterQuality: z.object({
    dissolvedOxygen: z.number().optional(),
    ph: z.number().optional(),
    ammonia: z.number().optional(),
    temperature: z.number().optional(),
  }).optional(),
});

router.get('/', async (req, res, next) => {
  try {
    const filters = filtersSchema.parse(req.query);
    const clauses: string[] = [];
    const params: unknown[] = [];

    if (filters.category) {
      params.push(filters.category);
      clauses.push(`category = $${params.length}`);
    }
    if (filters.severity) {
      params.push(filters.severity);
      clauses.push(`severity = $${params.length}`);
    }
    if (filters.species) {
      params.push(filters.species);
      clauses.push(`$${params.length} = ANY(affected_species)`);
    }
    if (filters.symptom) {
      params.push(`%${filters.symptom.toLowerCase()}%`);
      clauses.push(`EXISTS (SELECT 1 FROM unnest(symptoms) s WHERE lower(s) LIKE $${params.length})`);
    }
    if (filters.q) {
      params.push(`%${filters.q.toLowerCase()}%`);
      clauses.push(`(lower(name) LIKE $${params.length} OR EXISTS (SELECT 1 FROM unnest(symptoms) s WHERE lower(s) LIKE $${params.length}))`);
    }

    const where = clauses.length ? `WHERE ${clauses.join(' AND ')}` : '';
    const result = await query(`
      SELECT *
      FROM diseases
      ${where}
      ORDER BY
        CASE severity WHEN 'HIGH' THEN 1 WHEN 'MEDIUM' THEN 2 ELSE 3 END,
        name
    `, params);

    res.json({ success: true, count: result.rowCount, data: result.rows });
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const result = await query(`SELECT * FROM diseases WHERE id = $1`, [req.params.id]);
    if (result.rowCount === 0) {
      return res.status(404).json({ success: false, error: 'Disease not found' });
    }
    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    next(error);
  }
});

router.post('/suggest', async (req, res, next) => {
  try {
    const payload = suggestSchema.parse(req.body);
    const normalizedSymptoms = payload.symptoms.map((s) => s.trim().toLowerCase()).filter(Boolean);

    const all = await query(`SELECT * FROM diseases ORDER BY name`);
    const ranked = all.rows
      .map((row) => {
        const rowSymptoms = (row.symptoms || []).map((s: string) => String(s).toLowerCase());
        const symptomScore = normalizedSymptoms.reduce((sum, symptom) => (
          rowSymptoms.some((s: string) => s.includes(symptom) || symptom.includes(s)) ? sum + 1 : sum
        ), 0);
        const speciesScore = payload.species && (row.affected_species || []).includes(payload.species) ? 1 : 0;
        const riskBump = (() => {
          if (!payload.waterQuality) return 0;
          const { dissolvedOxygen, ammonia, ph } = payload.waterQuality;
          if (row.category === 'ENVIRONMENTAL') {
            if (dissolvedOxygen != null && dissolvedOxygen < 4) return 2;
            if (ammonia != null && ammonia > 0.1) return 2;
            if (ph != null && (ph < 6.5 || ph > 8.5)) return 1;
          }
          return 0;
        })();
        const total = symptomScore * 3 + speciesScore * 2 + riskBump;
        return { ...row, match_score: total };
      })
      .filter((row) => row.match_score > 0)
      .sort((a, b) => b.match_score - a.match_score)
      .slice(0, 5);

    const urgency = ranked.some((r) => r.severity === 'HIGH') ? 'CRITICAL' : ranked.length ? 'WARNING' : 'LOW';
    res.json({
      success: true,
      data: {
        urgency,
        recommendations: ranked,
        advisory: urgency === 'CRITICAL'
          ? 'High mortality risk possible. Book doctor consultation immediately.'
          : urgency === 'WARNING'
            ? 'Potential disease risk detected. Monitor closely and consult doctor.'
            : 'No strong disease match. Continue monitoring.',
      },
    });
  } catch (error) {
    next(error);
  }
});

export { router as diseasesRouter };
