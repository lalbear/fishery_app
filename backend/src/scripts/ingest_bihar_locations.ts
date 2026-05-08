/**
 * Bihar Location Hierarchy Ingestion Script
 * ==========================================
 * Ingests district → block → panchayat rows from a local tab-separated file.
 *
 * Usage:
 *   npx ts-node src/scripts/ingest_bihar_locations.ts
 *   npx ts-node src/scripts/ingest_bihar_locations.ts --dry-run
 *   npx ts-node src/scripts/ingest_bihar_locations.ts --file ../fully_covered_pacs_state_wise_07-05-26_09_57.xls
 */

import { Pool } from 'pg';
import * as dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config();

const DRY_RUN = process.argv.includes('--dry-run');
const STATE_CODE = 'BR';
const FILE_FLAG_INDEX = process.argv.findIndex((arg) => arg === '--file');
const INPUT_FILE_ARG = FILE_FLAG_INDEX >= 0 && process.argv[FILE_FLAG_INDEX + 1]
  ? process.argv[FILE_FLAG_INDEX + 1]
  : '';

function resolveInputFilePath(): string {
  if (INPUT_FILE_ARG) {
    return path.isAbsolute(INPUT_FILE_ARG)
      ? INPUT_FILE_ARG
      : path.resolve(process.cwd(), INPUT_FILE_ARG);
  }

  const candidates = [
    path.resolve(process.cwd(), 'fully_covered_pacs_state_wise_07-05-26_09_57.xls'),
    path.resolve(process.cwd(), '../fully_covered_pacs_state_wise_07-05-26_09_57.xls'),
    path.resolve(__dirname, '../../../fully_covered_pacs_state_wise_07-05-26_09_57.xls'),
  ];
  const found = candidates.find((candidate) => fs.existsSync(candidate));
  if (!found) {
    throw new Error(`Input file not found. Checked:\n${candidates.join('\n')}`);
  }
  return found;
}

// ─── Canonical Bihar districts (all 38, as of 2024) ──────────────────────────
// Source: https://en.wikipedia.org/wiki/List_of_districts_of_Bihar
// Format: [canonicalName, lgdCode]
const BIHAR_DISTRICTS: [string, string][] = [
  ['Araria',         '202'], ['Arwal',           '603'], ['Aurangabad',     '204'],
  ['Banka',          '228'], ['Begusarai',        '206'], ['Bhagalpur',      '207'],
  ['Bhojpur',        '208'], ['Buxar',            '209'], ['Darbhanga',      '210'],
  ['East Champaran', '211'], ['Gaya',             '212'], ['Gopalganj',      '213'],
  ['Jamui',          '229'], ['Jehanabad',        '230'], ['Kaimur',         '214'],
  ['Katihar',        '215'], ['Khagaria',         '231'], ['Kishanganj',     '216'],
  ['Lakhisarai',     '232'], ['Madhepura',        '233'], ['Madhubani',      '218'],
  ['Munger',         '219'], ['Muzaffarpur',      '220'], ['Nalanda',        '221'],
  ['Nawada',         '222'], ['Patna',            '223'], ['Purnia',         '224'],
  ['Rohtas',         '225'], ['Saharsa',          '234'], ['Samastipur',     '226'],
  ['Saran',          '227'], ['Sheikhpura',       '235'], ['Sheohar',        '236'],
  ['Sitamarhi',      '237'], ['Siwan',            '238'], ['Supaul',         '239'],
  ['Vaishali',       '240'], ['West Champaran',   '201'],
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Convert free-text name to a stable ASCII slug */
function toSlug(raw: string): string {
  return raw
    .toUpperCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')   // strip diacritics
    .replace(/[^A-Z0-9 ]/g, ' ')      // non-ASCII → space
    .replace(/\s+/g, '-')              // spaces → hyphen
    .replace(/-+/g, '-')               // collapse hyphens
    .replace(/^-|-$/g, '');            // trim edges
}

/** district code: BR-PATNA */
function districtCode(districtName: string): string {
  return `${STATE_CODE}-${toSlug(districtName)}`;
}

/** block code: BR-PATNA-PHULWARI */
function blockCode(districtName: string, blockName: string): string {
  return `${districtCode(districtName)}-${toSlug(blockName)}`;
}

/** panchayat code: BR-PATNA-PHULWARI-NAUBATPUR */
function panchayatCode(districtName: string, blockName: string, panchName: string): string {
  return `${blockCode(districtName, blockName)}-${toSlug(panchName)}`;
}

// ─── Row types ────────────────────────────────────────────────────────────────

interface BlockRow {
  districtName: string;
  blockName: string;
  panchayats: string[];
}

function parsePacsFile(filePath: string): BlockRow[] {
  const raw = fs.readFileSync(filePath, 'utf-8');
  const lines = raw.split(/\r?\n/).filter((line) => line.trim().length > 0);
  if (lines.length < 2) {
    throw new Error(`Input file has no data rows: ${filePath}`);
  }

  const header = lines[0].split('\t').map((cell) => cell.trim().toLowerCase());
  const stateIdx = header.findIndex((h) => h.includes('state'));
  const districtIdx = header.findIndex((h) => h.includes('district'));
  const blockIdx = header.findIndex((h) => h.includes('block'));
  const panchayatIdx = header.findIndex((h) => h.includes('gram panchayat') || h.includes('panchayat'));

  if (districtIdx < 0 || blockIdx < 0 || panchayatIdx < 0) {
    throw new Error('Header missing required columns: District, Block, Gram Panchayat');
  }

  const map = new Map<string, BlockRow>();
  for (const line of lines.slice(1)) {
    const cells = line.split('\t').map((cell) => cell.trim());
    const state = stateIdx >= 0 ? (cells[stateIdx] || '') : 'BIHAR';
    if (state.toUpperCase() !== 'BIHAR') continue;

    const districtName = cells[districtIdx] || '';
    const blockName = cells[blockIdx] || '';
    const panchayatName = cells[panchayatIdx] || '';
    if (!districtName || !blockName || !panchayatName) continue;

    const key = `${toSlug(districtName)}|${toSlug(blockName)}`;
    const existing = map.get(key);
    if (existing) {
      existing.panchayats.push(panchayatName);
    } else {
      map.set(key, { districtName, blockName, panchayats: [panchayatName] });
    }
  }

  return Array.from(map.values());
}

// ─── DB Upsert logic ─────────────────────────────────────────────────────────

async function upsertDistricts(pool: Pool, dryRun: boolean): Promise<Map<string, boolean>> {
  const known = new Map<string, boolean>(); // canonicalName → exists
  const districtNames = BIHAR_DISTRICTS.map(([n]) => n);

  if (dryRun) {
    console.log(`[dry-run] Would upsert ${districtNames.length} districts`);
    districtNames.forEach(n => known.set(n, true));
    return known;
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    for (const [name, lgd] of BIHAR_DISTRICTS) {
      const code = districtCode(name);
      await client.query(`
        INSERT INTO loc_districts (code, state_code, name, name_raw, lgd_code)
        VALUES ($1, $2, $3, $4, $5)
        ON CONFLICT (code) DO UPDATE SET
          name     = EXCLUDED.name,
          name_raw = EXCLUDED.name_raw,
          lgd_code = EXCLUDED.lgd_code
      `, [code, STATE_CODE, name, name, lgd]);
      known.set(name, true);
    }
    await client.query('COMMIT');
    console.log(`[db] Upserted ${BIHAR_DISTRICTS.length} districts`);
  } catch (e) {
    await client.query('ROLLBACK');
    throw e;
  } finally {
    client.release();
  }
  return known;
}

async function upsertBlocksAndPanchayats(
  pool: Pool,
  rows: BlockRow[],
  knownDistricts: Map<string, boolean>,
  dryRun: boolean,
): Promise<{ upserted: number; rejected: number }> {
  let upserted = 0;
  let rejected = 0;
  const rejects: string[] = [];

  // Resolve district canonical name from raw scraped name
  const DISTRICT_MAPPINGS: Record<string, string> = {
    'PURBI-CHAMPARAN': 'East Champaran',
    'PASHCHIMI-CHAMPARAN': 'West Champaran',
    'PASHCHIM-CHAMPARAN': 'West Champaran',
    'EAST-CHAMPARAN': 'East Champaran',
    'WEST-CHAMPARAN': 'West Champaran',
    'KAIMUR-BHABUA': 'Kaimur',
  };

  function resolveDistrict(rawName: string): string | null {
    const slug = toSlug(rawName);
    if (DISTRICT_MAPPINGS[slug]) return DISTRICT_MAPPINGS[slug];

    for (const [canon] of BIHAR_DISTRICTS) {
      if (toSlug(canon) === slug) return canon;
    }
    // Fuzzy: check if slug is contained
    for (const [canon] of BIHAR_DISTRICTS) {
      if (toSlug(canon).includes(slug) || slug.includes(toSlug(canon))) return canon;
    }
    return null;
  }

  if (dryRun) {
    for (const row of rows) {
      const canon = resolveDistrict(row.districtName);
      if (!canon) {
        rejects.push(`UNKNOWN_DISTRICT: "${row.districtName}" (block: ${row.blockName})`);
        rejected++;
        continue;
      }
      upserted += 1 + row.panchayats.length; // 1 block + N panchayats
    }
    if (rejects.length > 0) {
      console.error('[dry-run] Rejects:');
      rejects.forEach(r => console.error('  ✗', r));
    }
    console.log(`[dry-run] Would upsert ~${upserted} blocks+panchayats, reject ${rejected}`);
    return { upserted, rejected };
  }

  const client = await pool.connect();
  try {
    for (const row of rows) {
      const canon = resolveDistrict(row.districtName);
      if (!canon) {
        const msg = `UNKNOWN_DISTRICT: "${row.districtName}" (block: ${row.blockName})`;
        console.error('[reject]', msg);
        rejects.push(msg);
        rejected++;
        continue;
      }

      const bCode = blockCode(canon, row.blockName);
      const dCode = districtCode(canon);

      await client.query('BEGIN');
      try {
        // Upsert block
        await client.query(`
          INSERT INTO loc_blocks (code, district_code, name, name_raw)
          VALUES ($1, $2, $3, $4)
          ON CONFLICT (code) DO UPDATE SET
            name     = EXCLUDED.name,
            name_raw = EXCLUDED.name_raw
        `, [bCode, dCode, row.blockName.trim(), row.blockName.trim()]);
        upserted++;

        // Upsert panchayats
        for (const panch of row.panchayats) {
          const cleaned = panch.trim();
          if (!cleaned) continue;
          const pCode = panchayatCode(canon, row.blockName, cleaned);
          await client.query(`
            INSERT INTO loc_panchayats (code, block_code, name, name_raw)
            VALUES ($1, $2, $3, $4)
            ON CONFLICT (code) DO UPDATE SET
              name     = EXCLUDED.name,
              name_raw = EXCLUDED.name_raw
          `, [pCode, bCode, cleaned, cleaned]);
          upserted++;
        }

        await client.query('COMMIT');
      } catch (rowErr: any) {
        await client.query('ROLLBACK');
        const msg = `ROW_ERROR: block "${row.blockName}" in "${canon}": ${rowErr.message}`;
        console.error('[reject]', msg);
        rejects.push(msg);
        rejected++;
      }
    }
  } finally {
    client.release();
  }

  if (rejects.length > 0) {
    console.error('\n[ingestion] Rejected rows:');
    rejects.forEach(r => console.error('  ✗', r));
  }

  return { upserted, rejected };
}

async function logRun(
  pool: Pool,
  sourceUrl: string,
  upserted: number,
  rejected: number,
  dryRun: boolean,
  notes?: string,
) {
  if (dryRun) return;
  await pool.query(`
    INSERT INTO loc_source_runs (state_code, source_url, rows_upserted, rows_rejected, dry_run, notes)
    VALUES ($1, $2, $3, $4, $5, $6)
  `, [STATE_CODE, sourceUrl, upserted, rejected, dryRun, notes || null]);
}

// ─── Main ────────────────────────────────────────────────────────────────────

async function main() {
  const pool = new Pool({
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    user: process.env.DB_USER || 'fishinggod',
    password: process.env.DB_PASSWORD || 'aquaculture2024',
    database: process.env.DB_NAME || 'fishing_god',
    ssl: process.env.DB_HOST === 'localhost' ? false : undefined,
  });

  console.log(`\n${'='.repeat(60)}`);
  console.log(`Bihar Location Ingestion  ${DRY_RUN ? '[DRY RUN]' : '[LIVE]'}`);
  console.log(`${'='.repeat(60)}\n`);

  try {
    // 1. Upsert state row (idempotent, defined in migration too)
    if (!DRY_RUN) {
      await pool.query(`
        INSERT INTO loc_states (code, name, name_raw, lgd_code)
        VALUES ('BR', 'Bihar', 'Bihar', '10')
        ON CONFLICT (code) DO NOTHING
      `);
    }

    // 2. Upsert all 38 Bihar districts (from authoritative hard-coded list)
    const knownDistricts = await upsertDistricts(pool, DRY_RUN);

    // 3. Parse blocks + panchayats from provided local file
    const resolvedFile = resolveInputFilePath();
    console.log(`[file] Using source: ${resolvedFile}`);
    const rows = parsePacsFile(resolvedFile);
    console.log(`[file] Parsed ${rows.length} district+block groups`);

    if (rows.length === 0) {
      console.warn('[ingestion] No rows to process. Exiting.');
      return;
    }

    // 4. Upsert blocks + panchayats
    const { upserted, rejected } = await upsertBlocksAndPanchayats(
      pool, rows, knownDistricts, DRY_RUN
    );

    // 5. Log run metadata
    await logRun(pool, resolvedFile, upserted, rejected, DRY_RUN);

    // 6. Summary
    console.log('\n--- Summary ---');
    console.log(`Districts : ${BIHAR_DISTRICTS.length}`);
    console.log(`Blocks+GPs: ${upserted} upserted, ${rejected} rejected`);
    console.log(`Mode      : ${DRY_RUN ? 'DRY RUN (no DB changes)' : 'LIVE'}`);
    console.log('Done.\n');

  } finally {
    await pool.end();
  }
}

main().catch(err => {
  console.error('[FATAL]', err);
  process.exit(1);
});
