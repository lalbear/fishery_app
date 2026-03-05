import { query, closePool } from '../db';
import { logger } from '../utils/logger';
import fs from 'fs';
import path from 'path';

async function runMigration() {
    const migrationPath = path.join(__dirname, '../../migrations/008_equipment_images_final.sql');
    const sql = fs.readFileSync(migrationPath, 'utf8');

    logger.info('Applying final equipment images migration...');

    try {
        await query(sql);
        logger.info('Final equipment images updated successfully!');
    } catch (error) {
        logger.error('Migration failed:', error);
        process.exit(1);
    } finally {
        await closePool();
    }
}

runMigration();
