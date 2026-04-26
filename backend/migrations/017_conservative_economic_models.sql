-- ============================================================================
-- Migration 017: Conservative economic model calibration
--
-- Problems fixed:
--   1. Biofloc yield was 37,500–50,000 kg/ha — 3–4× higher than Indian reality
--   2. RAS yield was 100,000–150,000 kg/ha — unreachable for small Indian farms
--   3. Pangasius display yield was 25–30 MT/acre — Vietnamese cage yield, not Indian pond
--   4. Tilapia display yield was 15–20 MT/acre — intensive Israel benchmark, not Indian biofloc
--   5. No Brackish Pond economic model existed — Vannamei fell back to carp model
--   6. Feed costs in Biofloc (Rs 40) and RAS (Rs 35) per kg fish were too low
--
-- Sources used for corrections:
--   • MPEDA/NFDB production statistics 2022-23 (Indian average shrimp pond 3–5 MT/acre)
--   • CIBA biofloc trial reports: Tilapia 8–12 MT/hectare in managed systems
--   • CIFE RAS feasibility study: 25–40 MT/hectare for Pangasius RAS at commercial scale
--   • ICAR-CIFA major carp pond culture benchmarks: 3–5 MT/hectare traditional
-- ============================================================================

-- ============================================================================
-- 1. Fix Biofloc economic model
--    Old yield: 37,500–50,000 kg/ha (~15–20 MT/acre) — Israeli intensive benchmark
--    New yield: 12,000–18,000 kg/ha (~5–7 MT/acre) — achievable Indian managed biofloc
--    Old feed cost: Rs 40/kg fish — too low for biofloc specialty feed
--    New feed cost: Rs 58/kg fish (FCR 1.25 × Rs 46/kg feed) — conservative
-- ============================================================================
UPDATE knowledge_nodes
SET data = jsonb_set(
  jsonb_set(
    data,
    '{revenue_projections,expected_yield_kg_per_hectare}',
    '{"min": 12000, "max": 18000}'::jsonb
  ),
  '{operational_expenditure,feed_cost_inr_per_kg_fish}',
  '58'::jsonb
)
WHERE node_type = 'ECONOMIC_MODEL'
  AND data->>'system_type' = 'BIOFLOC';

-- ============================================================================
-- 2. Fix RAS economic model
--    Old yield: 100,000–150,000 kg/ha — pilot-plant figures, not farm-level
--    New yield: 25,000–40,000 kg/ha — achievable for Pangasius in Indian RAS
--    Old feed cost: Rs 35/kg fish — must use premium RAS feed (Rs 60–80/kg feed)
--    New feed cost: Rs 90/kg fish (FCR 1.4 × Rs 65/kg feed) — conservative RAS
-- ============================================================================
UPDATE knowledge_nodes
SET data = jsonb_set(
  jsonb_set(
    data,
    '{revenue_projections,expected_yield_kg_per_hectare}',
    '{"min": 25000, "max": 40000}'::jsonb
  ),
  '{operational_expenditure,feed_cost_inr_per_kg_fish}',
  '90'::jsonb
)
WHERE node_type = 'ECONOMIC_MODEL'
  AND data->>'system_type' = 'RAS';

-- ============================================================================
-- 3. Fix Pangasius species display yield
--    Old: 25–30 MT/acre (Vietnamese Mekong floating cage — irrelevant in India)
--    New: 4–8 MT/acre (Indian RAS/intensive biofloc, realistic for new farmers)
-- ============================================================================
UPDATE knowledge_nodes
SET data = jsonb_set(
  data,
  '{economic_parameters,expected_yield_mt_per_acre}',
  '{"min": 4.0, "max": 8.0}'::jsonb
)
WHERE node_type = 'SPECIES'
  AND data->>'scientific_name' = 'Pangasianodon hypophthalmus';

-- ============================================================================
-- 4. Fix Tilapia species display yield
--    Old: 15–20 MT/acre (intensive Israeli/Asian benchmark)
--    New: 4–7 MT/acre (achievable Indian biofloc for first-cycle farmers)
-- ============================================================================
UPDATE knowledge_nodes
SET data = jsonb_set(
  data,
  '{economic_parameters,expected_yield_mt_per_acre}',
  '{"min": 4.0, "max": 7.0}'::jsonb
)
WHERE node_type = 'SPECIES'
  AND data->>'scientific_name' = 'Oreochromis niloticus';

-- ============================================================================
-- 5. Add Brackish Pond economic model (was missing — Vannamei was using carp model)
--    Yield 3,000–5,000 kg/ha reflects Indian semi-intensive shrimp pond norms
--    (MPEDA 2022-23: India national average ~3.2 MT/ha for L. vannamei pond culture)
-- ============================================================================
INSERT INTO knowledge_nodes (node_type, data) VALUES (
  'ECONOMIC_MODEL',
  '{
    "model_name": "Semi-Intensive Brackish Pond - Marine Shrimp",
    "system_type": "BRACKISH_POND",
    "target_species": null,
    "applicable_species": ["Litopenaeus vannamei", "Penaeus monodon"],
    "capital_expenditure": {
      "land_preparation_inr_per_hectare": 40000,
      "pond_construction_inr_per_hectare": 320000,
      "initial_stocking_cost_inr": 80000,
      "contingency_percent": 15
    },
    "operational_expenditure": {
      "feed_cost_inr_per_kg_fish": 90,
      "electricity_cost_inr_per_month": 6000,
      "labor_cost_inr_per_month": 9000,
      "medicine_cost_inr_per_cycle": 30000,
      "miscellaneous_percent": 10
    },
    "revenue_projections": {
      "expected_yield_kg_per_hectare": {"min": 3000, "max": 5000},
      "market_price_inr_per_kg": {"min": 300, "max": 420},
      "harvest_cycles_per_year": 2
    },
    "culture_period_months": {"min": 4, "max": 5},
    "benefit_cost_ratio": {"min": 1.30, "max": 1.70},
    "break_even_months": {"min": 14, "max": 20},
    "pmmsy_subsidy_applicable": true,
    "unit_cost_ceiling_inr": 600000
  }'::jsonb
);

-- ============================================================================
-- 6. Fix Traditional Pond market price upper bound
--    Old max: Rs 180/kg — uncommon at farm gate; most carps sell Rs 120–150/kg
--    New max: Rs 160/kg — more representative of farm-gate reality
-- ============================================================================
UPDATE knowledge_nodes
SET data = jsonb_set(
  data,
  '{revenue_projections,market_price_inr_per_kg}',
  '{"min": 120, "max": 160}'::jsonb
)
WHERE node_type = 'ECONOMIC_MODEL'
  AND data->>'system_type' = 'TRADITIONAL_POND';
