import { Router } from 'express';
import { z } from 'zod';
import { query } from '../db';

const router = Router();

const filtersSchema = z.object({
  recordType: z.string().optional(),
  stateCode: z.string().optional(),
  regionGroup: z.string().optional(),
  projectType: z.string().optional(),
  bucket: z.string().optional(),
  activeForCalculator: z.enum(['true', 'false']).optional(),
  activeForKnowledgebase: z.enum(['true', 'false']).optional(),
  warningIfUsed: z.enum(['true', 'false']).optional(),
});

router.get('/rules', async (req, res, next) => {
  try {
    const filters = filtersSchema.parse(req.query);
    const clauses: string[] = [];
    const params: unknown[] = [];

    if (filters.recordType) {
      params.push(filters.recordType);
      clauses.push(`record_type = $${params.length}`);
    }

    if (filters.stateCode) {
      params.push(filters.stateCode.toUpperCase());
      clauses.push(`state_code = $${params.length}`);
    }

    if (filters.regionGroup) {
      params.push(filters.regionGroup.toUpperCase());
      clauses.push(`region_group = $${params.length}`);
    }

    if (filters.projectType) {
      params.push(filters.projectType.toUpperCase());
      clauses.push(`project_types ? $${params.length}`);
    }

    if (filters.bucket) {
      params.push(filters.bucket);
      clauses.push(`bucket = $${params.length}`);
    }

    if (filters.activeForCalculator) {
      params.push(filters.activeForCalculator === 'true');
      clauses.push(`active_for_calculator = $${params.length}`);
    }

    if (filters.activeForKnowledgebase) {
      params.push(filters.activeForKnowledgebase === 'true');
      clauses.push(`active_for_knowledgebase = $${params.length}`);
    }

    if (filters.warningIfUsed) {
      params.push(filters.warningIfUsed === 'true');
      clauses.push(`warning_if_used = $${params.length}`);
    }

    const whereClause = clauses.length ? `WHERE ${clauses.join(' AND ')}` : '';
    const result = await query(
      `
        SELECT *
        FROM knowledge_rules
        ${whereClause}
        ORDER BY record_type, metric_name, id_slug
      `,
      params
    );

    res.json({
      success: true,
      count: result.rowCount,
      data: result.rows,
    });
  } catch (error) {
    next(error);
  }
});

router.get('/rules/:idSlug', async (req, res, next) => {
  try {
    const result = await query(
      `
        SELECT *
        FROM knowledge_rules
        WHERE id_slug = $1
      `,
      [req.params.idSlug]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({
        success: false,
        error: 'Knowledge rule not found',
      });
    }

    res.json({
      success: true,
      data: result.rows[0],
    });
  } catch (error) {
    next(error);
  }
});

export { router as knowledgeRouter };
