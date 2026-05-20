/**
 * Audit Logging Middleware
 * Logs sensitive operations for security monitoring and compliance.
 * Records: who did what, when, from where, and the outcome.
 */

import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';

export type AuditAction =
  | 'AUTH_LOGIN_SUCCESS'
  | 'AUTH_LOGIN_FAILED'
  | 'AUTH_SIGNUP'
  | 'AUTH_TOKEN_EXPIRED'
  | 'PROFILE_UPDATE'
  | 'APPOINTMENT_STATUS_CHANGE'
  | 'APPOINTMENT_CREATED'
  | 'TREATMENT_CREATED'
  | 'LAB_REPORT_CREATED'
  | 'MARKET_PRICE_ADDED'
  | 'SYNC_PUSH'
  | 'SYNC_PULL'
  | 'DOCTOR_MAPPING_CHANGED'
  | 'WATER_QUALITY_READING';

interface AuditEntry {
  action: AuditAction;
  userId?: string;
  ip?: string;
  userAgent?: string;
  resource?: string;
  resourceId?: string;
  details?: Record<string, unknown>;
  outcome: 'success' | 'failure';
  timestamp: string;
}

/**
 * Emits a structured audit log entry.
 * In production, these should be piped to a durable log store
 * (CloudWatch, Datadog, ELK, etc.) for retention and alerting.
 */
export function auditLog(entry: Omit<AuditEntry, 'timestamp'>): void {
  const fullEntry: AuditEntry = {
    ...entry,
    timestamp: new Date().toISOString(),
  };

  // Use a dedicated audit channel at 'warn' level so it can be
  // filtered/routed independently from application debug logs.
  logger.warn('[AUDIT]', fullEntry);
}

/**
 * Express middleware that attaches audit helpers to the request.
 * Route handlers can call `req.audit(...)` to emit audit events
 * with the request context (IP, user-agent, auth) pre-filled.
 */
declare global {
  namespace Express {
    interface Request {
      audit: (action: AuditAction, details?: {
        outcome?: 'success' | 'failure';
        resource?: string;
        resourceId?: string;
        extra?: Record<string, unknown>;
      }) => void;
    }
  }
}

export function auditMiddleware(req: Request, res: Response, next: NextFunction): void {
  req.audit = (action, details) => {
    auditLog({
      action,
      userId: req.auth?.userId,
      ip: req.ip || req.socket.remoteAddress,
      userAgent: req.headers['user-agent']?.slice(0, 200),
      resource: details?.resource,
      resourceId: details?.resourceId,
      details: details?.extra,
      outcome: details?.outcome || 'success',
    });
  };
  next();
}

/**
 * Middleware factory: automatically audit all requests to a route group.
 * Logs the action on response finish so the status code is available.
 */
export function autoAudit(action: AuditAction, resource: string) {
  return (req: Request, res: Response, next: NextFunction): void => {
    res.on('finish', () => {
      const outcome = res.statusCode < 400 ? 'success' : 'failure';
      auditLog({
        action,
        userId: req.auth?.userId,
        ip: req.ip || req.socket.remoteAddress,
        userAgent: req.headers['user-agent']?.slice(0, 200),
        resource,
        resourceId: req.params.id || req.params.userId,
        outcome,
      });
    });
    next();
  };
}
