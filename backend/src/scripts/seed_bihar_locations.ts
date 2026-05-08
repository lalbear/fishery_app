/**
 * Bihar Location Hierarchy Seeder
 *
 * Reads the government-sourced TSV (distributed as .xls) and upserts
 * districts → blocks → panchayats into the loc_* tables.
 *
 * Usage:
 *   npx ts-node src/scripts/seed_bihar_locations.ts [/path/to/file.xls] [--dry-run]
 *
 * Env:
 *   LOCATION_DATA_FILE  — path to the TSV/XLS file (overrides argv[2])
 *   DATABASE_URL        — Postgres connection string
 */

import fs from 'fs';
import path from 'path';
import readline from 'readline';
import { pool } from '../db';
import { logger } from '../utils/logger';

const STATE_CODE = 'BR';
const SOURCE_URL = 'https://cooperatives.gov.in/en/nscd-key-performance/gp-pacs-details/10';

function slugify(s: string): string {
  return s
    .trim()
    .toUpperCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^A-Z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function districtCode(districtName: string): string {
  return `${STATE_CODE}-${slugify(districtName)}`;
}

function blockCode(districtName: string, blockName: string): string {
  return `${districtCode(districtName)}-${slugify(blockName)}`;
}

function panchayatCode(districtName: string, blockName: string, panchayatName: string): string {
  return `${blockCode(districtName, blockName)}-${slugify(panchayatName)}`;
}

type Row = {
  district: string;
  block: string;
  panchayat: string;
};

async function parseTSV(filePath: string): Promise<Row[]> {
  const rows: Row[] = [];
  const fileStream = fs.createReadStream(filePath);
  const rl = readline.createInterface({ input: fileStream, crlfDelay: Infinity });

  let lineNumber = 0;
  for await (const line of rl) {
    lineNumber++;
    if (lineNumber === 1) continue; // header

    const parts = line.split('\t').map((p) => p.trim());
    if (parts.length < 5) continue;

    const [, , district, block, panchayat] = parts;
    if (!district || !block || !panchayat) continue;

    rows.push({ district, block, panchayat });
  }

  return rows;
}

async function seed(filePath: string, dryRun: boolean): Promise<void> {
  logger.info(`Seeding Bihar locations from: ${filePath} [dry-run=${dryRun}]`);

  const rows = await parseTSV(filePath);
  logger.info(`Parsed ${rows.length} rows`);

  // Deduplicate
  const districts = new Map<string, string>(); // code → name
  const blocks = new Map<string, { districtCode: string; name: string }>();
  const panchayats = new Map<string, { blockCode: string; name: string }>();

  const rejected: { row: Row; reason: string }[] = [];

  for (const row of rows) {
    const dc = districtCode(row.district);
    const bc = blockCode(row.district, row.block);
    const pc = panchayatCode(row.district, row.block, row.panchayat);

    if (dc.length > 24) {
      rejected.push({ row, reason: `district code too long: ${dc}` });
      continue;
    }
    if (bc.length > 40) {
      rejected.push({ row, reason: `block code too long: ${bc}` });
      continue;
    }
    if (pc.length > 80) {
      rejected.push({ row, reason: `panchayat code too long: ${pc}` });
      continue;
    }

    if (!districts.has(dc)) districts.set(dc, row.district);
    if (!blocks.has(bc)) blocks.set(bc, { districtCode: dc, name: row.block });
    if (!panchayats.has(pc)) panchayats.set(pc, { blockCode: bc, name: row.panchayat });
  }

  logger.info(
    `Unique entities — districts: ${districts.size}, blocks: ${blocks.size}, panchayats: ${panchayats.size}, rejected: ${rejected.length}`
  );

  if (rejected.length > 0) {
    logger.warn('Rejected rows:', rejected);
  }

  if (dryRun) {
    logger.info('DRY RUN — no database writes performed.');
    return;
  }

  const client = await pool.connect();
  let upserted = 0;
  let errored = 0;

  try {
    await client.query('BEGIN');

    // Upsert districts
    for (const [code, nameRaw] of districts) {
      const canonical = nameRaw.trim().replace(/\s+/g, ' ');
      await client.query(
        `INSERT INTO loc_districts (code, state_code, name, name_raw)
         VALUES ($1, $2, $3, $4)
         ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, name_raw = EXCLUDED.name_raw`,
        [code, STATE_CODE, canonical, nameRaw]
      );
      upserted++;
    }

    // Upsert blocks
    for (const [code, { districtCode: dc, name: nameRaw }] of blocks) {
      const canonical = nameRaw.trim().replace(/\s+/g, ' ');
      await client.query(
        `INSERT INTO loc_blocks (code, district_code, name, name_raw)
         VALUES ($1, $2, $3, $4)
         ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, name_raw = EXCLUDED.name_raw`,
        [code, dc, canonical, nameRaw]
      );
      upserted++;
    }

    // Upsert panchayats
    for (const [code, { blockCode: bc, name: nameRaw }] of panchayats) {
      const canonical = nameRaw.trim().replace(/\s+/g, ' ');
      await client.query(
        `INSERT INTO loc_panchayats (code, block_code, name, name_raw)
         VALUES ($1, $2, $3, $4)
         ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, name_raw = EXCLUDED.name_raw`,
        [code, bc, canonical, nameRaw]
      );
      upserted++;
    }

    // Audit record
    await client.query(
      `INSERT INTO loc_source_runs (state_code, source_url, rows_upserted, rows_rejected, dry_run)
       VALUES ($1, $2, $3, $4, false)`,
      [STATE_CODE, SOURCE_URL, upserted, rejected.length]
    );

    await client.query('COMMIT');
    logger.info(`Done. Upserted ${upserted} rows.`);
  } catch (err) {
    await client.query('ROLLBACK');
    logger.error('Seed failed:', err);
    errored++;
    throw err;
  } finally {
    client.release();
    await pool.end();
  }

  if (errored > 0) process.exit(1);
}

async function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes('--dry-run');
  const filePath =
    process.env.LOCATION_DATA_FILE ||
    args.find((a) => !a.startsWith('--')) ||
    path.resolve(__dirname, '../../../fully_covered_pacs_state_wise_07-05-26_09_57.xls');

  if (!fs.existsSync(filePath)) {
    logger.error(`Data file not found: ${filePath}`);
    logger.error(
      'Pass the path as an argument or set LOCATION_DATA_FILE env var.\n' +
      'Example: npx ts-node src/scripts/seed_bihar_locations.ts /path/to/file.xls'
    );
    process.exit(1);
  }

  await seed(filePath, dryRun);
}

if (require.main === module) {
  main().catch((err) => {
    logger.error('Seed script crashed:', err);
    process.exit(1);
  });
}
