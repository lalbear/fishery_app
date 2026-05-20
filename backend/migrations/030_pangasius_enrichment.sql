-- ============================================================================
-- Migration 030: Pangasius species enrichment + 4 Pangasius-specific diseases
--
-- Source: Official Bihar Fisheries / ICAR Pangasius cultivation manual
--
-- Changes:
--   1. Enrich Pangasius species node with detailed biological parameters,
--      breeding guide, water quality requirements, and farming systems
--      from the official manual (RAS, Biofloc, Traditional Pond, Cages).
--   2. Update the Pangasius economic model with corrected yield/price data
--      matching Bihar/UP inland farming reality.
--   3. Add 4 Pangasius-specific diseases:
--      a. Bacillary Necrosis (Edwardsiella ictaluri)
--      b. Red Spot Disease (Aeromonas hydrophila)
--      c. White Spot Disease / Ich (Ichthyophthirius multifiliis) — Pangasius variant
--      d. Fungal Infection (Saprolegnia) — Pangasius fry/fingerling variant
-- ============================================================================

-- ─────────────────────────────────────────────────────────────────────────────
-- 1. Enrich Pangasius species node with full manual data
-- ─────────────────────────────────────────────────────────────────────────────
UPDATE knowledge_nodes
SET data = data || $pangasius_data$
{
  "scientific_name": "Pangasianodon hypophthalmus",
  "common_names": {
    "en": "Pangasius / Basa / Pangas",
    "hi": "पंगास / बासा"
  },
  "category": "CATFISH",
  "description": "Pangasius (Pangas) is a scaleless freshwater catfish native to Vietnam's Mekong River delta. Introduced to India via Bangladesh in 1995–96, it is now the third most farmed freshwater fish globally. It is an air-breathing fish — its swim bladder and skin act as respiratory organs, allowing it to survive in low-DO water. Andhra Pradesh leads Indian production. It reaches 1 kg in just 5–6 months, making it the fastest-growing commercial fish in Bihar and UP.",
  "biological_parameters": {
    "temperature_celsius": {"min": 26.0, "max": 30.0},
    "dissolved_oxygen_mg_l": {"min": 5.0, "max": null},
    "ph_range": {"min": 6.5, "max": 7.5},
    "salinity_tolerance_ppt": {"min": 0.0, "max": 2.0},
    "total_alkalinity_ppm": {"min": 40, "max": 200},
    "ammonia_tolerance_mg_l": {"max": 0.5}
  },
  "economic_parameters": {
    "feed_conversion_ratio": {"min": 1.5, "max": 1.8},
    "expected_yield_mt_per_acre": {"min": 4.0, "max": 8.0},
    "market_price_per_kg_inr": {"min": 130.0, "max": 200.0},
    "survival_rate_percent": {"min": 80.0, "max": 90.0}
  },
  "culture_period_months": {"min": 5, "max": 8},
  "crops_per_year": {"min": 1, "max": 2},
  "optimal_systems": ["TRADITIONAL_POND", "BIOFLOC", "RAS", "CAGE"],
  "notes": "Harvest before October — highly sensitive to cold; water below 15°C causes distress, feeding stops, and weight loss. Must be prevented from escaping into natural rivers (ecological threat).",
  "breeding_guide": {
    "overview": "Pangasius breeding is done artificially through hormone injection (Ovaprim or Ovatide). Females mature in their 3rd year; males in their 2nd year. Eggs hatch in 22–24 hours. Spawn are cannibalistic — adequate zooplankton and powder feed are essential in nursery ponds.",
    "steps": [
      "Select broodfish: females (3rd year, ripe belly) and males (2nd year). Inject females with Ovaprim at 0.3–0.5 ml/kg; males at 0.1–0.2 ml/kg.",
      "Keep males and females separate for 8–12 hours after injection.",
      "Strip eggs from females and mix with milt using a bird feather. Sprinkle water to activate sperm. 1 ml milt is sufficient for 10 lakh eggs.",
      "Incubate eggs in hatchery tanks: DO > 5 ppm, pH ~7.5. Avoid excess iron or chlorine — both ruin hatching.",
      "Eggs hatch in 22–24 hours. Yolk sac absorbed in the next 24 hours.",
      "Transfer spawn to nursery pond (dried, predator-free). Stock at 400–500 spawn per sq. meter.",
      "Maintain zooplankton and supplement with artificial powder feed to prevent cannibalism.",
      "After 4 weeks: 0.8–1.0 g. After 2 more months: 15–20 g fingerlings ready for grow-out."
    ],
    "timeline": "Injection → 8–12 hrs → Stripping → 22–24 hrs → Hatching → 24 hrs → Yolk absorbed → 4 weeks → 1g → 2 months → 15–20g fingerling",
    "beginner_tip": "As a grow-out farmer, buy 15–20g fingerlings from a licensed hatchery. Prepare your pond with lime (200 kg/acre), let plankton bloom for 7–10 days, then stock. Use 28–30% protein floating pellets — never wet/soaked feed."
  },
  "farming_systems": {
    "traditional_pond_monoculture": {
      "pond_size_acres": {"min": 0.5, "max": 1.0},
      "water_depth_m": {"min": 1.5, "max": 2.0},
      "stocking_density_per_ha": {"min": 20000, "max": 25000},
      "fingerling_size_g": {"min": 10, "max": 15},
      "yield_tons_per_ha": {"min": 15, "max": 20},
      "culture_months": {"min": 7, "max": 8}
    },
    "traditional_pond_polyculture": {
      "stocking_density_per_ha": {"min": 10000, "max": 12000},
      "yield_tons_per_ha": {"min": 10, "max": 12}
    },
    "ras": {
      "tank_volume_litres": 90000,
      "fingerlings_per_cage": 1500,
      "cages_per_tank": 3,
      "survival_rate_percent": 80,
      "harvest_weight_g": 450,
      "culture_months": {"min": 5, "max": 6}
    },
    "biofloc": {
      "tank_volume_litres": 10000,
      "stocking_per_tank": {"min": 1200, "max": 1500},
      "note": "Pangasius thrives in Biofloc — it actively consumes protein-rich flocs, reducing commercial feed costs."
    }
  },
  "feeding_guide": {
    "feed_type": "Floating pellets (dry only — never wet/soaked feed)",
    "small_fish_5_30g": {"protein_percent": 32, "body_weight_percent_daily": {"min": 5, "max": 7}},
    "grow_out_100g_1kg": {"protein_percent": {"min": 24, "max": 28}, "body_weight_percent_daily": {"min": 1, "max": 5}},
    "feeding_frequency_per_day": {"min": 4, "max": 5}
  },
  "winter_warning": "Pangasius is highly sensitive to cold. If water temperature drops below 15°C, fish enter distress, stop eating, and lose weight. Harvest by October before winter sets in.",
  "image_url": "https://commons.wikimedia.org/wiki/Special:FilePath/Pangasianodon_hypophthalmus.jpg",
  "youtube_links": [
    {
      "search_query": "pangasius basa fish farming india bihar up",
      "title": "Pangasius Farming in Bihar and UP",
      "hint": "Complete guide to growing Pangasius in North Indian ponds"
    },
    {
      "search_query": "pangasius biofloc tank farming india",
      "title": "Pangasius in Biofloc — High Density Farming",
      "hint": "How to grow Pangasius in 10,000-litre biofloc tanks"
    },
    {
      "search_query": "pangasius RAS recirculating aquaculture india",
      "title": "Pangasius in RAS — Indoor Tank Farming",
      "hint": "Intensive RAS production of Pangasius in India"
    }
  ]
}
$pangasius_data$::jsonb
WHERE node_type = 'SPECIES'
  AND data->>'scientific_name' = 'Pangasianodon hypophthalmus';

-- ─────────────────────────────────────────────────────────────────────────────
-- 2. Update Pangasius economic model with corrected Bihar/UP data
-- ─────────────────────────────────────────────────────────────────────────────
UPDATE knowledge_nodes
SET data = jsonb_set(
  jsonb_set(
    jsonb_set(
      data,
      '{revenue_projections,expected_yield_kg_per_hectare}',
      '{"min": 10000, "max": 20000}'::jsonb
    ),
    '{revenue_projections,market_price_inr_per_kg}',
    '{"min": 130, "max": 200}'::jsonb
  ),
  '{notes}',
  '"Monoculture: 20,000–25,000/ha → 15–20 MT/ha in 7–8 months. Polyculture: 10,000–12,000/ha → 10–12 MT/ha. Harvest before October — cold below 15°C causes distress. Source: Bihar Fisheries / ICAR manual."'::jsonb
)
WHERE node_type = 'ECONOMIC_MODEL'
  AND data->>'target_species' = 'Pangasianodon hypophthalmus';

-- ─────────────────────────────────────────────────────────────────────────────
-- 3. Add 4 Pangasius-specific diseases
-- ─────────────────────────────────────────────────────────────────────────────

INSERT INTO diseases (
    slug, name, category, affected_species, symptoms, causes, prevention, treatment,
    severity, mortality_rate, seasonality, water_conditions
) VALUES

-- ─── Disease 1: Bacillary Necrosis ───────────────────────────────────────────
(
    'pangasius-bacillary-necrosis',
    'Bacillary Necrosis (Pangasius)',
    'BACTERIAL',
    ARRAY['Pangasius', 'Pangasianodon hypophthalmus'],
    ARRAY[
      'Gills and skin turn yellow',
      'Small white spots appear on the spleen, liver, and kidneys (visible on dissection)',
      'Fish become lethargic and stop feeding',
      'Rapid mortality in cold weather or after sudden temperature drops'
    ],
    ARRAY[
      'Highly fatal bacterial infection caused by Edwardsiella ictaluri',
      'Triggered mainly when water temperature drops rapidly (especially below 20°C)',
      'Stress from poor water quality, overcrowding, or transport',
      'Contaminated water or infected seed stock'
    ],
    ARRAY[
      'Harvest Pangasius before October to avoid cold-weather outbreaks',
      'Maintain water temperature above 22°C — use aeration to prevent stratification',
      'Never stock Pangasius in ponds with a history of this disease without full disinfection',
      'Source fingerlings only from certified, disease-free hatcheries',
      'Apply lime regularly to maintain stable pH and reduce bacterial load'
    ],
    ARRAY[
      'Mix Oxytetracycline or Sulfonamide antibiotics with artificial feed for 1–2 weeks',
      'Improve water quality immediately — increase aeration and reduce stocking density',
      'Apply Potassium Permanganate (2–4 mg/L) as a pond disinfectant',
      'Consult a fisheries doctor before starting antibiotic treatment'
    ],
    'HIGH',
    70.00,
    ARRAY['winter', 'pre-winter'],
    '{"temperatureRange":{"min":10,"max":22}}'::jsonb
),

-- ─── Disease 2: Red Spot Disease (Pangasius) ─────────────────────────────────
(
    'pangasius-red-spot',
    'Red Spot Disease (Pangasius)',
    'BACTERIAL',
    ARRAY['Pangasius', 'Pangasianodon hypophthalmus'],
    ARRAY[
      'Bleeding (hemorrhage) around the mouth and bases of the fins',
      'Abdomen swells up and turns red',
      'Skin ulcers and open wounds on the body',
      'Fish become sluggish and swim near the surface'
    ],
    ARRAY[
      'Bacterial infection caused by Aeromonas hydrophila and Aeromonas sobria',
      'Stress during transport or sudden temperature changes weakens immunity',
      'Poor water quality — high ammonia, low DO, or pH fluctuations',
      'Injuries from netting or handling that allow bacteria to enter'
    ],
    ARRAY[
      'Acclimatize fingerlings properly before stocking — never release directly from transport bags',
      'Maintain stable water quality: DO > 5 ppm, ammonia < 0.5 ppm, pH 6.5–7.5',
      'Disinfect nets and equipment between uses',
      'Avoid rough handling during harvest and grading',
      'Apply lime (200 kg/acre) before stocking to reduce bacterial load'
    ],
    ARRAY[
      'Mix antibiotics (Oxytetracycline or Amoxicillin) with feed for 7–10 days under veterinary guidance',
      'Improve water quality immediately — partial water exchange (20–30%) if ammonia is high',
      'Apply Potassium Permanganate (2–4 mg/L) as a pond disinfectant',
      'Reduce feeding during treatment to lower organic load'
    ],
    'HIGH',
    40.00,
    ARRAY['monsoon', 'pre-monsoon', 'post-monsoon'],
    '{"ammoniaLevel":{"max":0.5},"dissolvedOxygen":{"min":5}}'::jsonb
),

-- ─── Disease 3: White Spot Disease / Ich (Pangasius fry/fingerling) ──────────
(
    'pangasius-white-spot-ich',
    'White Spot Disease / Ich (Pangasius)',
    'PARASITIC',
    ARRAY['Pangasius', 'Pangasianodon hypophthalmus', 'Pangasius fry', 'Pangasius fingerlings'],
    ARRAY[
      'Small white spots (1–2 mm) appear on the skin and gills',
      'Fish become highly lethargic and stop feeding',
      'Excessive mucus production on the body surface',
      'Fish rub against pond walls or substrate (flashing behavior)',
      'Gill damage causes breathing difficulty in severe cases'
    ],
    ARRAY[
      'Protozoan parasite infection caused by Ichthyophthirius multifiliis',
      'Commonly seen in fry and fingerlings — young fish are most vulnerable',
      'Triggered by temperature stress, overcrowding, or poor water quality',
      'Introduced through infected seed stock or contaminated water'
    ],
    ARRAY[
      'Source fingerlings only from certified, disease-free hatcheries',
      'Quarantine new stock for 7–10 days before introducing to main pond',
      'Maintain stable water temperature — avoid sudden drops',
      'Keep stocking density within recommended limits',
      'Apply lime regularly to maintain pH and reduce parasite load'
    ],
    ARRAY[
      'Use 10–15 ppm Potassium Permanganate as a water disinfectant — apply in the morning',
      'Repeat treatment every 3 days for 2–3 cycles until spots disappear',
      'Increase water temperature slightly (if possible) to speed up parasite life cycle and treatment effectiveness',
      'Improve aeration and water quality during treatment'
    ],
    'MEDIUM',
    25.00,
    ARRAY['winter', 'spring', 'post-monsoon'],
    '{"temperatureRange":{"min":15,"max":25}}'::jsonb
),

-- ─── Disease 4: Fungal Infection (Pangasius fry/fingerling) ──────────────────
(
    'pangasius-fungal-infection',
    'Fungal Infection (Pangasius Fry/Fingerling)',
    'FUNGAL',
    ARRAY['Pangasius', 'Pangasianodon hypophthalmus', 'Pangasius fry', 'Pangasius fingerlings'],
    ARRAY[
      'Loss of physical balance and swimming difficulties (fish swim sideways or upside down)',
      'White or grey cotton-wool-like fungal growth on wounds or injured areas',
      'Skin lesions and tissue damage at the site of injury',
      'Reduced feeding and lethargy',
      'High mortality in fry and fingerlings if untreated'
    ],
    ARRAY[
      'Primarily affects fry and fingerlings when injuries from transport become infected by fungal hyphae (Saprolegnia spp.)',
      'Rough handling during transport, grading, or stocking causes skin abrasions',
      'Cold water stress weakens immunity and promotes fungal growth',
      'Poor water quality with high organic load encourages fungal proliferation'
    ],
    ARRAY[
      'Handle fingerlings gently during transport and stocking — minimize physical injury',
      'Disinfect fingerlings before stocking: dip in 10% Potassium Permanganate solution for 30–40 seconds',
      'Maintain water temperature above 22°C — cold water promotes fungal growth',
      'Remove dead fish immediately to prevent spread',
      'Apply lime to maintain pH and reduce organic load in nursery ponds'
    ],
    ARRAY[
      'Dip affected fish in 10% Potassium Permanganate solution for 30–40 seconds before releasing into clean water',
      'Apply Malachite Green (0.1 mg/L) to the pond as a fungicide — use with caution and follow withdrawal periods',
      'Treat pond with salt (NaCl) at 3–5 kg per 1000 litres to create an osmotic barrier against fungal spread',
      'Improve water quality and increase aeration during treatment'
    ],
    'MEDIUM',
    30.00,
    ARRAY['winter', 'post-monsoon'],
    '{"temperatureRange":{"min":15,"max":25}}'::jsonb
)

ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    category = EXCLUDED.category,
    affected_species = EXCLUDED.affected_species,
    symptoms = EXCLUDED.symptoms,
    causes = EXCLUDED.causes,
    prevention = EXCLUDED.prevention,
    treatment = EXCLUDED.treatment,
    severity = EXCLUDED.severity,
    mortality_rate = EXCLUDED.mortality_rate,
    seasonality = EXCLUDED.seasonality,
    water_conditions = EXCLUDED.water_conditions;
