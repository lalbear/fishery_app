import { Router } from 'express';
import { z } from 'zod';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { query } from '../db';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_for_development';

const signupSchema = z.object({
    phone: z.string().min(10),
    password: z.string().min(6),
    name: z.string().min(2),
    farmerCategory: z.enum(['GENERAL', 'WOMEN', 'SC', 'ST']).default('GENERAL'),
    stateCode: z.string().length(2),
    districtCode: z.string().max(50).optional().default(''),
});

const loginSchema = z.object({
    phone: z.string().min(10),
    password: z.string().min(6),
});

async function ensureAuthRuntimeSchema(): Promise<void> {
    await query(`
        ALTER TABLE users
        ADD COLUMN IF NOT EXISTS password_hash VARCHAR(255)
    `);

    await query(`
        ALTER TABLE users
        ALTER COLUMN district_code DROP NOT NULL
    `);

    await query(`
        ALTER TABLE users
        ALTER COLUMN state_code TYPE VARCHAR(100)
    `);
}

// SIGNUP
router.post('/signup', async (req, res) => {
    try {
        await ensureAuthRuntimeSchema();
        const data = signupSchema.parse(req.body);

        // Check existing
        const existing = await query('SELECT id FROM users WHERE phone_number = $1', [data.phone]);
        if (existing.rowCount && existing.rowCount > 0) {
            return res.status(400).json({ success: false, error: 'Phone number already registered' });
        }

        const hashed = await bcrypt.hash(data.password, 10);

        const result = await query(`
      INSERT INTO users (phone_number, password_hash, name, farmer_category, state_code, district_code)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING
        id,
        phone_number AS phone,
        name,
        farmer_category AS "farmerCategory",
        state_code AS "stateCode",
        district_code AS "districtCode"
    `, [data.phone, hashed, data.name, data.farmerCategory, data.stateCode, data.districtCode]);

        const user = result.rows[0];
        const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '30d' });

        res.json({ success: true, token, user });
    } catch (error: any) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ success: false, error: 'Validation Error', details: error.issues });
        }
        console.error('Signup error', error);
        res.status(500).json({
            success: false,
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal Server Error'
        });
    }
});

// LOGIN
router.post('/login', async (req, res) => {
    try {
        await ensureAuthRuntimeSchema();
        const data = loginSchema.parse(req.body);

        const result = await query(`
      SELECT
        id,
        phone_number AS phone,
        password_hash,
        name,
        farmer_category AS "farmerCategory",
        state_code AS "stateCode",
        district_code AS "districtCode"
      FROM users
      WHERE phone_number = $1
    `, [data.phone]);
        const user = result.rows[0];

        if (!user) {
            return res.status(401).json({ success: false, error: 'Invalid phone or password' });
        }

        const valid = await bcrypt.compare(data.password, user.password_hash);
        if (!valid) {
            return res.status(401).json({ success: false, error: 'Invalid phone or password' });
        }

        delete user.password_hash;
        const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '30d' });

        res.json({ success: true, token, user });
    } catch (error: any) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ success: false, error: 'Validation Error', details: error.issues });
        }
        res.status(500).json({
            success: false,
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal Server Error'
        });
    }
});

export { router as authRouter };
