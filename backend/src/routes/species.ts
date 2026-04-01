/**
 * Species API Routes
 * Handles species data and knowledge graph queries
 */

import { Router } from 'express';
import { query, buildTreeQuery } from '../db';
import { logger } from '../utils/logger';

const router = Router();

/**
 * GET /api/v1/species
 * Get all species
 */
router.get('/', async (req, res, next) => {
  try {
    const result = await query(`
      SELECT id, data, created_at, updated_at
      FROM knowledge_nodes
      WHERE node_type = 'SPECIES'
      ORDER BY data->>'scientific_name'
    `);
    
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
 * GET /api/v1/species/search?q=query
 * Search species by name
 */
router.get('/search', async (req, res, next) => {
  try {
    const { q } = req.query;
    
    if (!q || typeof q !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'Query parameter "q" is required'
      });
    }
    
    const result = await query(`
      SELECT id, data, created_at
      FROM knowledge_nodes
      WHERE node_type = 'SPECIES'
      AND (
        data->>'scientific_name' ILIKE $1
        OR data->'common_names'->>'en' ILIKE $1
        OR data->'common_names'->>'hi' ILIKE $1
      )
    `, [`%${q}%`]);
    
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
 * GET /api/v1/species/:id/tree
 * Get knowledge tree for a species
 */
router.get('/:id/tree', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { sql, params } = buildTreeQuery(id);
    const result = await query(sql, params);
    
    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/v1/species/category/:category
 * Get species by category
 */
router.get('/category/:category', async (req, res, next) => {
  try {
    const { category } = req.params;
    const result = await query(`
      SELECT id, data, created_at
      FROM knowledge_nodes
      WHERE node_type = 'SPECIES'
      AND data->>'category' = $1
    `, [category.toUpperCase()]);
    
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
 * GET /api/v1/species/:id
 * Get species by ID
 */
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await query(`
      SELECT id, data, created_at, updated_at
      FROM knowledge_nodes
      WHERE id = $1 AND node_type = 'SPECIES'
    `, [id]);
    
    if (result.rowCount === 0) {
      return res.status(404).json({
        success: false,
        error: 'Species not found'
      });
    }
    
    res.json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    next(error);
  }
});

export { router as speciesRouter };
