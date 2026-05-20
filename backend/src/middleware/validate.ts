/**
 * Input Validation Middleware
 * Reusable validators for common input patterns.
 */

import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';

/**
 * Validates request body against a Zod schema.
 * Returns 400 with details on validation failure.
 */
export function validateBody(schema: z.ZodSchema) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      res.status(400).json({
        success: false,
        error: 'Validation Error',
        details: result.error.issues,
      });
      return;
    }
    req.body = result.data;
    next();
  };
}

/**
 * Validates request query parameters against a Zod schema.
 */
export function validateQuery(schema: z.ZodSchema) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.query);
    if (!result.success) {
      res.status(400).json({
        success: false,
        error: 'Invalid query parameters',
        details: result.error.issues,
      });
      return;
    }
    // Attach parsed values — keep original req.query type intact
    (req as any).validatedQuery = result.data;
    next();
  };
}

/**
 * Validates that route params match expected patterns.
 */
export function validateParams(schema: z.ZodSchema) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.params);
    if (!result.success) {
      res.status(400).json({
        success: false,
        error: 'Invalid route parameters',
        details: result.error.issues,
      });
      return;
    }
    next();
  };
}

// ─── Common Schemas ─────────────────────────────────────────────────────────

/** UUID param validation */
export const uuidParam = z.object({
  id: z.string().uuid('Invalid ID format'),
});

export const userIdParam = z.object({
  userId: z.string().uuid('Invalid user ID format'),
});

/** Water quality reading — bounded numeric inputs */
export const waterQualityReadingSchema = z.object({
  temperature: z.number().min(-10).max(60).optional(),
  dissolvedOxygen: z.number().min(0).max(30).optional(),
  ph: z.number().min(0).max(14).optional(),
  salinity: z.number().min(0).max(60).optional(),
  alkalinity: z.number().min(0).max(1000).optional(),
  ammonia: z.number().min(0).max(20).optional(),
  nitrite: z.number().min(0).max(20).optional(),
  turbidity: z.number().min(0).max(5000).optional(),
  notes: z.string().max(2000).optional(),
}).refine(
  (data) => Object.values(data).some(v => v !== undefined),
  { message: 'At least one measurement is required' }
);

/** Market price — validated numeric ranges */
export const marketPriceSchema = z.object({
  speciesId: z.string().uuid(),
  speciesName: z.string().min(1).max(200),
  marketName: z.string().min(1).max(200),
  stateCode: z.string().min(2).max(4),
  price: z.number().min(1).max(100000),
  grade: z.string().max(50).optional(),
  date: z.string().datetime(),
  source: z.string().max(100).optional(),
  volume: z.number().min(0).max(1000000).optional(),
});

/** File upload URI — image only */
export const imageUriSchema = z.string()
  .min(5)
  .max(2048)
  .refine(
    (uri) => /\.(jpg|jpeg|png|webp|gif)(\?.*)?$/i.test(uri) || uri.startsWith('data:image/'),
    { message: 'Only image files are allowed (jpg, png, webp, gif)' }
  );

/** Pagination query params */
export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(200).default(50),
});
