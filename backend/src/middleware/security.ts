/**
 * Security Middleware
 * HTTPS enforcement, input sanitization, and Content Security Policy.
 */

import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';

/**
 * Enforces HTTPS in production.
 * Checks the X-Forwarded-Proto header (set by reverse proxies like Render, Heroku, AWS ALB).
 * Redirects HTTP requests to HTTPS with a 301 permanent redirect.
 */
export function enforceHttps(req: Request, res: Response, next: NextFunction): void {
  if (process.env.NODE_ENV !== 'production') {
    next();
    return;
  }

  // Most PaaS providers set this header
  const proto = req.headers['x-forwarded-proto'];
  if (proto && proto !== 'https') {
    const secureUrl = `https://${req.hostname}${req.originalUrl}`;
    res.redirect(301, secureUrl);
    return;
  }

  // Set HSTS header — tell browsers to always use HTTPS for 1 year
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
  next();
}

/**
 * Sanitizes string values in request body to prevent stored XSS.
 * Strips HTML tags and dangerous characters from all string fields.
 * Does NOT modify fields that are expected to contain special chars (passwords).
 */
const SKIP_SANITIZE_FIELDS = new Set(['password', 'password_hash', 'token', 'photoUri', 'fileUrl', 'shop_url']);

function stripHtmlTags(input: string): string {
  // Remove HTML tags
  let sanitized = input.replace(/<[^>]*>/g, '');
  // Remove javascript: protocol
  sanitized = sanitized.replace(/javascript\s*:/gi, '');
  // Remove on* event handlers (onerror, onclick, etc.)
  sanitized = sanitized.replace(/on\w+\s*=/gi, '');
  return sanitized;
}

function sanitizeValue(key: string, value: unknown): unknown {
  if (typeof value === 'string' && !SKIP_SANITIZE_FIELDS.has(key)) {
    return stripHtmlTags(value);
  }
  if (Array.isArray(value)) {
    return value.map((item, i) => sanitizeValue(String(i), item));
  }
  if (value !== null && typeof value === 'object') {
    return sanitizeObject(value as Record<string, unknown>);
  }
  return value;
}

function sanitizeObject(obj: Record<string, unknown>): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(obj)) {
    result[key] = sanitizeValue(key, value);
  }
  return result;
}

/**
 * Middleware that sanitizes all string fields in the request body.
 * Apply AFTER body parsing but BEFORE route handlers.
 */
export function sanitizeInput(req: Request, res: Response, next: NextFunction): void {
  if (req.body && typeof req.body === 'object') {
    req.body = sanitizeObject(req.body);
  }
  next();
}

/**
 * Security headers beyond what Helmet provides by default.
 * Adds Permissions-Policy and tightens referrer.
 */
export function additionalSecurityHeaders(req: Request, res: Response, next: NextFunction): void {
  // Restrict browser features the app doesn't need
  res.setHeader('Permissions-Policy', [
    'camera=()',
    'microphone=()',
    'geolocation=(self)',
    'payment=()',
    'usb=()',
    'magnetometer=()',
    'gyroscope=()',
  ].join(', '));

  // Don't leak the full URL in referrer headers
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');

  // Prevent MIME-type sniffing
  res.setHeader('X-Content-Type-Options', 'nosniff');

  // Prevent embedding in frames (clickjacking protection)
  res.setHeader('X-Frame-Options', 'DENY');

  next();
}
