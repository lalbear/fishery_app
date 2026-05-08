/**
 * Bihar Location Data Quality Report
 * ====================================
 * Checks for: duplicate names/codes, orphan references, missing parents,
 * unusual count anomalies, and routing coverage.
 *
 * Usage:
 *   npx ts-node src/scripts/verify_bihar_locations.ts
 */

import { Pool } from 'pg';
import * as dotenv from 'dotenv';
dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL?.includes('localhost') ? false : { rejectUnauthorized: false },
});

let pass = 0;
let fail = 0;

function ok(msg: string) {
  console.log(`  ✅  ${msg}`);
  pass++;
}
function warn(msg: string, rows?: any[]) {
  console.warn(`  ⚠️   ${msg}`);
  if (rows?.length) rows.forEach(r => console.warn('      ', JSON.stringify(r)));
  fail++;
}

async function check(label: string, sql: string, params: any[] = [], expectZero = true) {
  const { rows } = await pool.query(sql, params);
  if (expectZero) {
    if (rows.length === 0) ok(label);
    else warn(label + ` (${rows.length} issues)`, rows.slice(0, 5));
  } else {
    ok(`${label}: ${rows[0]?.count ?? rows.length} rows`);
  }
}

async function main() {
  console.log('\n══════════════════════════════════════════════');
  console.log('  Bihar Location Hierarchy — Quality Report');
  console.log('══════════════════════════════════════════════\n');

  // ── 1. Row counts ──────────────────────────────────────────────────────────
  console.log('【1】 Row counts');
  await check('Bihar state exists', `SELECT 1 FROM loc_states WHERE code='BR'`, [], false);

  const counts = await pool.query(`
    SELECT
      (SELECT COUNT(*) FROM loc_districts  WHERE state_code='BR') AS districts,
      (SELECT COUNT(*) FROM loc_blocks     WHERE district_code LIKE 'BR-%') AS blocks,
      (SELECT COUNT(*) FROM loc_panchayats WHERE block_code LIKE 'BR-%') AS panchayats
  `);
  const c = counts.rows[0];
  console.log(`     Districts: ${c.districts} | Blocks: ${c.blocks} | Panchayats: ${c.panchayats}`);

  if (Number(c.districts) < 30) warn('Expected ≥ 30 districts for Bihar, got ' + c.districts);
  else ok('District count ≥ 30');

  // ── 2. Duplicate code check ────────────────────────────────────────────────
  console.log('\n【2】 Duplicate codes');
  await check('No duplicate district codes', `
    SELECT code, COUNT(*) FROM loc_districts GROUP BY code HAVING COUNT(*) > 1
  `);
  await check('No duplicate block codes', `
    SELECT code, COUNT(*) FROM loc_blocks GROUP BY code HAVING COUNT(*) > 1
  `);
  await check('No duplicate panchayat codes', `
    SELECT code, COUNT(*) FROM loc_panchayats GROUP BY code HAVING COUNT(*) > 1
  `);

  // ── 3. Duplicate names within same parent ─────────────────────────────────
  console.log('\n【3】 Duplicate names within same parent');
  await check('No two districts with same name in Bihar', `
    SELECT state_code, name, COUNT(*) FROM loc_districts
    WHERE state_code='BR' GROUP BY state_code, name HAVING COUNT(*) > 1
  `);
  await check('No two blocks with same name in same district', `
    SELECT district_code, name, COUNT(*) FROM loc_blocks
    WHERE district_code LIKE 'BR-%' GROUP BY district_code, name HAVING COUNT(*) > 1
  `);
  await check('No two panchayats with same name in same block', `
    SELECT block_code, name, COUNT(*) FROM loc_panchayats
    WHERE block_code LIKE 'BR-%' GROUP BY block_code, name HAVING COUNT(*) > 1
  `);

  // ── 4. Orphan / broken references ─────────────────────────────────────────
  console.log('\n【4】 Orphan / broken FK references');
  await check('No blocks with missing parent district', `
    SELECT b.code FROM loc_blocks b
    LEFT JOIN loc_districts d ON d.code = b.district_code
    WHERE d.code IS NULL AND b.district_code LIKE 'BR-%'
  `);
  await check('No panchayats with missing parent block', `
    SELECT p.code FROM loc_panchayats p
    LEFT JOIN loc_blocks b ON b.code = p.block_code
    WHERE b.code IS NULL AND p.block_code LIKE 'BR-%'
  `);

  // ── 5. Empty name / blank slug ─────────────────────────────────────────────
  console.log('\n【5】 Blank / empty names');
  await check('No districts with empty name', `
    SELECT code FROM loc_districts WHERE state_code='BR' AND (name IS NULL OR trim(name)='')
  `);
  await check('No blocks with empty name', `
    SELECT code FROM loc_blocks WHERE district_code LIKE 'BR-%' AND (name IS NULL OR trim(name)='')
  `);
  await check('No panchayats with empty name', `
    SELECT code FROM loc_panchayats WHERE block_code LIKE 'BR-%' AND (name IS NULL OR trim(name)='')
  `);

  // ── 6. Anomalously small blocks/districts ─────────────────────────────────
  console.log('\n【6】 Count anomalies');
  const { rows: distAnom } = await pool.query(`
    SELECT d.name, COUNT(b.code) AS block_count
    FROM loc_districts d
    LEFT JOIN loc_blocks b ON b.district_code = d.code
    WHERE d.state_code = 'BR'
    GROUP BY d.name
    HAVING COUNT(b.code) < 3 AND COUNT(b.code) > 0
    ORDER BY block_count
  `);
  if (distAnom.length === 0) ok('All districts have ≥ 3 blocks (or 0 — not yet loaded)');
  else warn(`Districts with fewer than 3 blocks: ${distAnom.length}`, distAnom);

  const { rows: blockAnom } = await pool.query(`
    SELECT b.name, d.name AS district, COUNT(p.code) AS gp_count
    FROM loc_blocks b
    JOIN loc_districts d ON d.code = b.district_code
    LEFT JOIN loc_panchayats p ON p.block_code = b.code
    WHERE b.district_code LIKE 'BR-%'
    GROUP BY b.name, d.name
    HAVING COUNT(p.code) = 0
    ORDER BY d.name
  `);
  if (blockAnom.length === 0) ok('All blocks have at least 1 panchayat');
  else warn(`Blocks with 0 panchayats: ${blockAnom.length}`, blockAnom.slice(0, 5));

  // ── 7. Code format validation ─────────────────────────────────────────────
  console.log('\n【7】 Code format (must start with BR-)');
  await check('All district codes start with BR-', `
    SELECT code FROM loc_districts WHERE state_code='BR' AND code NOT LIKE 'BR-%'
  `);
  await check('All block codes start with BR-', `
    SELECT code FROM loc_blocks WHERE district_code LIKE 'BR-%' AND code NOT LIKE 'BR-%'
  `);
  await check('All panchayat codes start with BR-', `
    SELECT code FROM loc_panchayats WHERE block_code LIKE 'BR-%' AND code NOT LIKE 'BR-%'
  `);

  // ── 8. Doctor routing coverage ────────────────────────────────────────────
  console.log('\n【8】 Doctor routing coverage');
  const { rows: doctorPanchs } = await pool.query(`
    SELECT unnest(assigned_panchayats) AS panchayat_code FROM doctors WHERE is_active = true
  `);
  const assignedCodes = new Set(doctorPanchs.map((r: any) => r.panchayat_code));

  const { rows: allPanchs } = await pool.query(`
    SELECT code FROM loc_panchayats WHERE block_code LIKE 'BR-%'
  `);
  const covered = allPanchs.filter((r: any) => assignedCodes.has(r.code)).length;
  const total   = allPanchs.length;
  if (total === 0) {
    console.log('     ℹ️  No panchayats loaded yet — routing coverage check skipped.');
  } else {
    const pct = ((covered / total) * 100).toFixed(1);
    console.log(`     Covered: ${covered}/${total} panchayats (${pct}%)`);
    if (covered < total * 0.5) warn('Less than 50% panchayats have an assigned doctor');
    else ok(`Doctor coverage: ${pct}%`);
  }

  // ── 9. Source run log ─────────────────────────────────────────────────────
  console.log('\n【9】 Ingestion run history');
  const { rows: runs } = await pool.query(`
    SELECT run_at, rows_upserted, rows_rejected, dry_run, source_url
    FROM loc_source_runs
    WHERE state_code = 'BR'
    ORDER BY run_at DESC
    LIMIT 5
  `);
  if (runs.length === 0) console.log('     ℹ️  No ingestion runs recorded yet.');
  else runs.forEach(r =>
    console.log(`     ${r.run_at.toISOString().slice(0, 16)} | ✅ ${r.rows_upserted} | ✗ ${r.rows_rejected} | dry=${r.dry_run}`)
  );

  // ── Final summary ─────────────────────────────────────────────────────────
  console.log('\n══════════════════════════════════════════════');
  console.log(`  PASS: ${pass}   FAIL/WARN: ${fail}`);
  console.log('══════════════════════════════════════════════\n');

  await pool.end();
  process.exit(fail > 0 ? 1 : 0);
}

main().catch(err => {
  console.error('[FATAL]', err);
  process.exit(1);
});
