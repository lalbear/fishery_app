import { query, closePool } from '../db';
import { logger } from '../utils/logger';
import fs from 'fs';
import path from 'path';

async function runMigration() {
    const migrationPath = path.join(__dirname, '../../migrations/007_equipment_images_remaining.sql');
    const sql = fs.readFileSync(migrationPath, 'utf8');

    logger.info('Applying remaining equipment images migration...');

    try {
        await query(sql);
        logger.info('Remaining equipment images updated successfully!');
    } catch (error) {
        logger.error('Migration failed:', error);
        process.exit(1);
    } finally {
        await closePool();
    }
}

runMigration();
