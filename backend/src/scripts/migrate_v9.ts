import { query, closePool } from '../db';
import { logger } from '../utils/logger';
import fs from 'fs';
import path from 'path';

async function runMigration() {
    const migrationPath = path.join(__dirname, '../../migrations/010_clear_broken_images.sql');
    const sql = fs.readFileSync(migrationPath, 'utf8');

    logger.info('Clearing broken image URLs...');
    try {
        await query(sql);
        logger.info('Done! App will now cleanly show category icons as fallbacks.');
    } catch (error) {
        logger.error('Migration failed:', error);
        process.exit(1);
    } finally {
        await closePool();
    }
}

runMigration();
