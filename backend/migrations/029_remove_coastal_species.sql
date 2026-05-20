-- ============================================================================
-- Migration 029: Remove coastal/marine species not cultivable in Bihar/UP
--
-- Removed species:
--   1. Penaeus monodon (Black Tiger Shrimp) — strictly coastal/maritime;
--      not commercially farmed in inland Bihar or UP. All inland saline
--      shrimp farming in UP uses L. vannamei exclusively.
--   2. Etroplus suratensis (Pearlspot / Karimeen) — coastal estuarine fish
--      native to southern India; cannot survive North Indian winters;
--      no seed hatcheries exist in Bihar/UP.
--
-- The Brackish Pond economic model's applicable_species list is updated to
-- remove Penaeus monodon. The model itself remains for Vannamei (UP inland
-- saline groundwater farming).
--
-- The RAS species list in the app code is updated separately to replace
-- Pearlspot with Pabda (Ompok pabda), which is a high-value freshwater
-- catfish native to the Gangetic plains and well-suited for RAS.
-- ============================================================================

-- 1. Remove Black Tiger Shrimp species node
DELETE FROM knowledge_nodes
WHERE node_type = 'SPECIES'
  AND data->>'scientific_name' = 'Penaeus monodon';

-- 2. Remove Black Tiger Shrimp economic model
DELETE FROM knowledge_nodes
WHERE node_type = 'ECONOMIC_MODEL'
  AND data->>'target_species' = 'Penaeus monodon';

-- 3. Remove Pearlspot species node
DELETE FROM knowledge_nodes
WHERE node_type = 'SPECIES'
  AND data->>'scientific_name' = 'Etroplus suratensis';

-- 4. Update the Brackish Pond generic model to remove Penaeus monodon
--    from its applicable_species list (keep only Vannamei)
UPDATE knowledge_nodes
SET data = jsonb_set(
  data,
  '{applicable_species}',
  '["Litopenaeus vannamei"]'::jsonb
)
WHERE node_type = 'ECONOMIC_MODEL'
  AND data->>'system_type' = 'BRACKISH_POND'
  AND data->'applicable_species' @> '["Penaeus monodon"]'::jsonb;

-- 5. Remove Penaeus monodon from the KnowledgeRulesService species terms
--    (handled in application code — no DB action needed here)

-- Verification queries (commented out — run manually to confirm)
-- SELECT data->>'scientific_name', node_type FROM knowledge_nodes
-- WHERE data->>'scientific_name' IN ('Penaeus monodon', 'Etroplus suratensis');
-- Expected: 0 rows
