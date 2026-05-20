-- ============================================================================
-- Migration 031: Add 22 new species from research.pdf
--
-- Source: "Analysis of Aquatic Species Diversification and Aquaculture
--          Dynamics in Bihar and Uttar Pradesh" (ICAR-NBFGR / CIFRI)
--
-- Species added (all verified as Bihar/UP relevant, no duplicates):
--   MINOR CARPS (2):   Labeo gonius, Labeo dero
--   CATFISH (7):       Ompok bimaculatus, Sperata aor, Mystus vittatus,
--                      Mystus cavasius, Rita rita, Pangasius pangasius,
--                      Channa gachua
--   HIGH-VALUE FOOD (3): Chitala chitala, Notopterus notopterus,
--                         Mastacembelus armatus
--   ORNAMENTAL (7):    Xenentodon cancila, Puntius sophore, Puntius conchonius,
--                      Parambassis ranga, Colisa fasciatus, Trichogaster lalius,
--                      Botia lohachata
--   CRUSTACEANS (3):   Macrobrachium lamarrei, Macrobrachium dayanum,
--                      Sartoriana spinigera
-- ============================================================================

-- ─── 1. Labeo gonius — Kursi / Kurhi (Minor Carp) ────────────────────────────
INSERT INTO knowledge_nodes (parent_id, node_type, data)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  'SPECIES',
  '{
    "scientific_name": "Labeo gonius",
    "common_names": {"en": "Gonius Labeo / Kursi", "hi": "कुर्सी / कुर्ही"},
    "category": "MINOR_CARP",
    "description": "Labeo gonius (Kursi or Kurhi) is a minor carp native to the Ganga basin, widely distributed across Bihar and UP river systems. It is a mid-water column feeder that thrives in composite carp polyculture ponds alongside Indian Major Carps. It is valued for its hardiness and ability to utilize the middle ecological niche in ponds, complementing surface-feeding Catla and bottom-feeding Mrigal.",
    "biological_parameters": {
      "temperature_celsius": {"min": 22.0, "max": 32.0},
      "dissolved_oxygen_mg_l": {"min": 4.0, "max": null},
      "ph_range": {"min": 6.5, "max": 8.5},
      "salinity_tolerance_ppt": {"min": 0.0, "max": 3.0}
    },
    "economic_parameters": {
      "feed_conversion_ratio": {"min": 1.8, "max": 2.5},
      "expected_yield_mt_per_acre": {"min": 0.8, "max": 2.0},
      "market_price_per_kg_inr": {"min": 60.0, "max": 100.0},
      "survival_rate_percent": {"min": 75.0, "max": 82.0}
    },
    "culture_period_months": {"min": 10, "max": 12},
    "crops_per_year": {"min": 1, "max": null},
    "optimal_systems": ["POLYCULTURE_POND"],
    "culture_status": "Minor Carp Polyculture",
    "feeding_niche": "Mid-water column feeder — phytoplankton and organic detritus",
    "notes": "Native Gangetic minor carp; used to fill mid-water niche in composite carp culture; hardy and tolerant of mild turbidity; Bihar and UP river systems. Source: ICAR-NBFGR Bihar/UP species catalog."
  }'::jsonb
)
ON CONFLICT DO NOTHING;

-- ─── 2. Labeo dero — Arangi (Minor Carp) ─────────────────────────────────────
INSERT INTO knowledge_nodes (parent_id, node_type, data)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  'SPECIES',
  '{
    "scientific_name": "Labeo dero",
    "common_names": {"en": "Dero Labeo / Arangi", "hi": "अरंगी"},
    "category": "MINOR_CARP",
    "description": "Labeo dero (Arangi) is a native minor carp found in the rivers and floodplain wetlands of Bihar and UP. It is primarily a capture fishery species but is being trialed in semi-culture systems. It occupies the mid-water column and feeds on algae and organic matter. Its hardiness in turbid, low-oxygen floodplain environments makes it a candidate for integrated wetland aquaculture.",
    "biological_parameters": {
      "temperature_celsius": {"min": 22.0, "max": 32.0},
      "dissolved_oxygen_mg_l": {"min": 3.5, "max": null},
      "ph_range": {"min": 6.5, "max": 8.5},
      "salinity_tolerance_ppt": {"min": 0.0, "max": 2.0}
    },
    "economic_parameters": {
      "feed_conversion_ratio": {"min": 2.0, "max": 2.8},
      "expected_yield_mt_per_acre": {"min": 0.5, "max": 1.5},
      "market_price_per_kg_inr": {"min": 50.0, "max": 90.0},
      "survival_rate_percent": {"min": 70.0, "max": 80.0}
    },
    "culture_period_months": {"min": 10, "max": 12},
    "crops_per_year": {"min": 1, "max": null},
    "optimal_systems": ["POLYCULTURE_POND", "WETLAND_INTEGRATED"],
    "culture_status": "Capture / Semi-Culture",
    "notes": "Native Gangetic minor carp; primarily capture fishery; semi-culture trials ongoing; tolerates floodplain turbidity; Bihar and UP rivers. Source: ICAR-NBFGR Bihar/UP species catalog."
  }'::jsonb
)
ON CONFLICT DO NOTHING;

-- ─── 3. Ompok bimaculatus — Pabda / Palwa (High-Value Catfish) ───────────────
INSERT INTO knowledge_nodes (parent_id, node_type, data)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  'SPECIES',
  '{
    "scientific_name": "Ompok bimaculatus",
    "common_names": {"en": "Two-spot Glass Catfish / Pabda", "hi": "पाबदा / पलवा"},
    "category": "CATFISH",
    "description": "Ompok bimaculatus (Pabda or Palwa) is a high-value freshwater catfish closely related to Ompok pabda. It is native to the Ganga basin and is prized as a delicacy in Bihar, UP, and West Bengal. It is a nocturnal predator that feeds on small invertebrates and fish fry. Culture is gaining interest due to its premium market price, though seed availability from hatcheries remains a constraint. It thrives in ponds with good water quality and moderate stocking density.",
    "biological_parameters": {
      "temperature_celsius": {"min": 22.0, "max": 30.0},
      "dissolved_oxygen_mg_l": {"min": 3.0, "max": null},
      "ph_range": {"min": 6.5, "max": 8.0},
      "salinity_tolerance_ppt": {"min": 0.0, "max": 2.0}
    },
    "economic_parameters": {
      "feed_conversion_ratio": {"min": 1.5, "max": 2.2},
      "expected_yield_mt_per_acre": {"min": 1.5, "max": 4.0},
      "market_price_per_kg_inr": {"min": 200.0, "max": 450.0},
      "survival_rate_percent": {"min": 70.0, "max": 82.0}
    },
    "culture_period_months": {"min": 5, "max": 8},
    "crops_per_year": {"min": 1, "max": 2},
    "optimal_systems": ["POND", "BIOFLOC"],
    "culture_status": "High-Value Culture",
    "notes": "High-value catfish; premium delicacy in Bihar/UP/Bengal; nocturnal predator; seed availability from hatcheries is the main constraint; gaining interest among progressive farmers. Source: ICAR-NBFGR Bihar/UP species catalog."
  }'::jsonb
)
ON CONFLICT DO NOTHING;

-- ─── 4. Sperata aor — Dariai Tengar (Major Food Catfish) ─────────────────────
INSERT INTO knowledge_nodes (parent_id, node_type, data)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  'SPECIES',
  '{
    "scientific_name": "Sperata aor",
    "common_names": {"en": "Long-whiskered Catfish / Aor", "hi": "दरियाई टेंगर / आओर"},
    "category": "CATFISH",
    "description": "Sperata aor (Dariai Tengar or Aor) is a large predatory catfish native to the Ganga and Brahmaputra river systems. It is one of the most commercially important large catfishes in Bihar and UP, commanding a high market price due to its excellent flesh quality. It is primarily a capture fishery species from major rivers, but culture trials are underway. It is a nocturnal predator that feeds on fish, crustaceans, and organic matter.",
    "biological_parameters": {
      "temperature_celsius": {"min": 22.0, "max": 32.0},
      "dissolved_oxygen_mg_l": {"min": 4.0, "max": null},
      "ph_range": {"min": 6.5, "max": 8.5},
      "salinity_tolerance_ppt": {"min": 0.0, "max": 2.0}
    },
    "economic_parameters": {
      "feed_conversion_ratio": {"min": 1.8, "max": 2.8},
      "expected_yield_mt_per_acre": {"min": 1.5, "max": 4.0},
      "market_price_per_kg_inr": {"min": 150.0, "max": 280.0},
      "survival_rate_percent": {"min": 65.0, "max": 75.0}
    },
    "culture_period_months": {"min": 10, "max": 14},
    "crops_per_year": {"min": 1, "max": null},
    "optimal_systems": ["POND", "RIVERINE_CAPTURE"],
    "culture_status": "Major Food Fish — Capture / Culture Trial",
    "notes": "Large predatory catfish; major food fish in Bihar/UP rivers; high market value; culture trials ongoing at ICAR-CIFA; related to Sperata seenghala. Source: ICAR-NBFGR Bihar/UP species catalog."
  }'::jsonb
)
ON CONFLICT DO NOTHING;

-- ─── 5. Mystus vittatus — Tengra (Ornamental / Food Catfish) ─────────────────
INSERT INTO knowledge_nodes (parent_id, node_type, data)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  'SPECIES',
  '{
    "scientific_name": "Mystus vittatus",
    "common_names": {"en": "Striped Dwarf Catfish / Tengra", "hi": "टेंगरा"},
    "category": "CATFISH",
    "description": "Mystus vittatus (Tengra) is a small, striped freshwater catfish widely distributed across the Ganga basin in Bihar and UP. It is both a food fish and an ornamental species. As a food fish, it is prized for its delicate flavor and is commonly sold in local markets. As an ornamental species, its distinctive horizontal stripes make it attractive for aquarium trade. It is hardy and adapts well to pond conditions.",
    "biological_parameters": {
      "temperature_celsius": {"min": 20.0, "max": 30.0},
      "dissolved_oxygen_mg_l": {"min": 3.0, "max": null},
      "ph_range": {"min": 6.5, "max": 8.0},
      "salinity_tolerance_ppt": {"min": 0.0, "max": 2.0}
    },
    "economic_parameters": {
      "feed_conversion_ratio": {"min": 1.5, "max": 2.0},
      "expected_yield_mt_per_acre": {"min": 0.5, "max": 1.5},
      "market_price_per_kg_inr": {"min": 80.0, "max": 150.0},
      "survival_rate_percent": {"min": 75.0, "max": 85.0}
    },
    "culture_period_months": {"min": 6, "max": 9},
    "crops_per_year": {"min": 1, "max": 2},
    "optimal_systems": ["POND", "ORNAMENTAL_TANK"],
    "culture_status": "Ornamental / Food",
    "ornamental_potential": "Moderate — distinctive horizontal stripes; suitable for community aquariums",
    "notes": "Small striped catfish; dual-use as food and ornamental; widely distributed in Bihar/UP rivers and ponds; hardy and adaptable. Source: ICAR-NBFGR Bihar/UP species catalog."
  }'::jsonb
)
ON CONFLICT DO NOTHING;

-- ─── 6. Mystus cavasius — Sutahwa Tengar (Capture / Food) ────────────────────
INSERT INTO knowledge_nodes (parent_id, node_type, data)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  'SPECIES',
  '{
    "scientific_name": "Mystus cavasius",
    "common_names": {"en": "Gangetic Mystus / Sutahwa Tengar", "hi": "सुताहवा टेंगर"},
    "category": "CATFISH",
    "description": "Mystus cavasius (Sutahwa Tengar) is a medium-sized freshwater catfish native to the Ganga and Brahmaputra river systems. It is an important food fish in Bihar and UP, commonly caught in rivers, canals, and floodplain wetlands. It is a bottom-dwelling omnivore that feeds on invertebrates, small fish, and organic detritus. While primarily a capture fishery species, it is being considered for integrated pond culture.",
    "biological_parameters": {
      "temperature_celsius": {"min": 22.0, "max": 32.0},
      "dissolved_oxygen_mg_l": {"min": 3.5, "max": null},
      "ph_range": {"min": 6.5, "max": 8.5},
      "salinity_tolerance_ppt": {"min": 0.0, "max": 2.0}
    },
    "economic_parameters": {
      "feed_conversion_ratio": {"min": 1.8, "max": 2.5},
      "expected_yield_mt_per_acre": {"min": 0.8, "max": 2.0},
      "market_price_per_kg_inr": {"min": 80.0, "max": 160.0},
      "survival_rate_percent": {"min": 70.0, "max": 80.0}
    },
    "culture_period_months": {"min": 8, "max": 12},
    "crops_per_year": {"min": 1, "max": null},
    "optimal_systems": ["POND", "WETLAND_INTEGRATED"],
    "culture_status": "Capture / Food",
    "notes": "Medium catfish; important food fish in Bihar/UP rivers and wetlands; bottom-dwelling omnivore; capture fishery with integrated pond culture potential. Source: ICAR-NBFGR Bihar/UP species catalog."
  }'::jsonb
)
ON CONFLICT DO NOTHING;

-- ─── 7. Rita rita — Rita (Capture / Food) ────────────────────────────────────
INSERT INTO knowledge_nodes (parent_id, node_type, data)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  'SPECIES',
  '{
    "scientific_name": "Rita rita",
    "common_names": {"en": "Rita Catfish / Rita", "hi": "रीता"},
    "category": "CATFISH",
    "description": "Rita rita (Rita) is a medium-to-large freshwater catfish native to the Ganga and Indus river systems. It is an important food fish in Bihar and UP, particularly prized in local markets for its firm, flavorful flesh. It is a bottom-dwelling predator that feeds on fish, crustaceans, and mollusks. It is primarily a capture fishery species from major rivers, with limited culture trials. Its high market value makes it a candidate for future aquaculture development.",
    "biological_parameters": {
      "temperature_celsius": {"min": 22.0, "max": 32.0},
      "dissolved_oxygen_mg_l": {"min": 4.0, "max": null},
      "ph_range": {"min": 6.5, "max": 8.5},
      "salinity_tolerance_ppt": {"min": 0.0, "max": 2.0}
    },
    "economic_parameters": {
      "feed_conversion_ratio": {"min": 2.0, "max": 3.0},
      "expected_yield_mt_per_acre": {"min": 1.0, "max": 3.0},
      "market_price_per_kg_inr": {"min": 120.0, "max": 220.0},
      "survival_rate_percent": {"min": 65.0, "max": 75.0}
    },
    "culture_period_months": {"min": 10, "max": 14},
    "crops_per_year": {"min": 1, "max": null},
    "optimal_systems": ["POND", "RIVERINE_CAPTURE"],
    "culture_status": "Capture / Food",
    "notes": "Medium-large predatory catfish; important food fish in Bihar/UP rivers; high local market value; primarily capture fishery; future aquaculture candidate. Source: ICAR-NBFGR Bihar/UP species catalog."
  }'::jsonb
)
ON CONFLICT DO NOTHING;

-- ─── 8. Pangasius pangasius — Jalkapoor (Riverine / Rare Culture) ─────────────
INSERT INTO knowledge_nodes (parent_id, node_type, data)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  'SPECIES',
  '{
    "scientific_name": "Pangasius pangasius",
    "common_names": {"en": "Yellowtail Catfish / Jalkapoor", "hi": "जलकपूर"},
    "category": "CATFISH",
    "description": "Pangasius pangasius (Jalkapoor) is the native Indian pangasius, distinct from the commercially farmed Pangasianodon hypophthalmus (Basa). It is found in the major rivers of Bihar and UP including the Ganga, Gandak, and Kosi. It is a large, fast-growing catfish that can reach 3–4 kg. Unlike its exotic cousin, it is primarily a riverine capture species with rare culture attempts. It is valued as a food fish in local markets.",
    "biological_parameters": {
      "temperature_celsius": {"min": 24.0, "max": 32.0},
      "dissolved_oxygen_mg_l": {"min": 4.0, "max": null},
      "ph_range": {"min": 6.5, "max": 8.0},
      "salinity_tolerance_ppt": {"min": 0.0, "max": 2.0}
    },
    "economic_parameters": {
      "feed_conversion_ratio": {"min": 1.8, "max": 2.5},
      "expected_yield_mt_per_acre": {"min": 1.5, "max": 4.0},
      "market_price_per_kg_inr": {"min": 100.0, "max": 180.0},
      "survival_rate_percent": {"min": 65.0, "max": 75.0}
    },
    "culture_period_months": {"min": 10, "max": 14},
    "crops_per_year": {"min": 1, "max": null},
    "optimal_systems": ["POND", "RIVERINE_CAPTURE"],
    "culture_status": "Riverine / Rare Culture",
    "notes": "Native Indian pangasius; distinct from farmed Basa (P. hypophthalmus); found in Ganga, Gandak, Kosi rivers; primarily capture fishery; rare culture attempts. Source: ICAR-NBFGR Bihar/UP species catalog."
  }'::jsonb
)
ON CONFLICT DO NOTHING;

-- ─── 9. Channa gachua — Chengai (Ornamental / Food) ─────────────────────────
INSERT INTO knowledge_nodes (parent_id, node_type, data)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  'SPECIES',
  '{
    "scientific_name": "Channa gachua",
    "common_names": {"en": "Dwarf Snakehead / Chengai", "hi": "चेंगाई"},
    "category": "MURREL",
    "description": "Channa gachua (Chengai) is a small, colorful snakehead fish native to the rivers and wetlands of Bihar and UP. Unlike its larger relatives (Channa striata, Channa marulius), it is a dwarf species reaching only 20–30 cm. It is both a food fish in rural areas and an ornamental species valued in the aquarium trade for its striking coloration and hardiness. It is an air-breathing fish that can survive in low-oxygen, shallow water bodies.",
    "biological_parameters": {
      "temperature_celsius": {"min": 20.0, "max": 30.0},
      "dissolved_oxygen_mg_l": {"min": 2.0, "max": null},
      "ph_range": {"min": 6.0, "max": 8.0},
      "salinity_tolerance_ppt": {"min": 0.0, "max": 2.0}
    },
    "economic_parameters": {
      "feed_conversion_ratio": {"min": 1.5, "max": 2.2},
      "expected_yield_mt_per_acre": {"min": 0.3, "max": 1.0},
      "market_price_per_kg_inr": {"min": 100.0, "max": 200.0},
      "survival_rate_percent": {"min": 75.0, "max": 85.0}
    },
    "culture_period_months": {"min": 6, "max": 10},
    "crops_per_year": {"min": 1, "max": 2},
    "optimal_systems": ["POND", "ORNAMENTAL_TANK", "WETLAND_INTEGRATED"],
    "culture_status": "Ornamental / Food",
    "ornamental_potential": "High — striking coloration; hardy; popular in aquarium hobby",
    "notes": "Dwarf snakehead; air-breathing; dual-use food and ornamental; native to Bihar/UP wetlands; survives low-oxygen conditions; ornamental export potential. Source: ICAR-NBFGR Bihar/UP species catalog."
  }'::jsonb
)
ON CONFLICT DO NOTHING;

-- ─── 10. Chitala chitala — Moy / Chital (High-Value Food) ────────────────────
INSERT INTO knowledge_nodes (parent_id, node_type, data)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  'SPECIES',
  '{
    "scientific_name": "Chitala chitala",
    "common_names": {"en": "Clown Knifefish / Chital / Moy", "hi": "चीतल / मोय"},
    "category": "FEATHERBACK",
    "description": "Chitala chitala (Chital or Moy) is a large, distinctive freshwater fish native to the Ganga basin. It is one of the most prized food fish in Bihar and UP, commanding a very high market price due to its excellent flavor and cultural significance. It has a characteristic humped back and spotted pattern. It is primarily a capture fishery species from major rivers and floodplain lakes, but its high value is driving interest in culture. It is also valued as an ornamental species in large aquariums.",
    "biological_parameters": {
      "temperature_celsius": {"min": 24.0, "max": 32.0},
      "dissolved_oxygen_mg_l": {"min": 4.0, "max": null},
      "ph_range": {"min": 6.5, "max": 8.0},
      "salinity_tolerance_ppt": {"min": 0.0, "max": 2.0}
    },
    "economic_parameters": {
      "feed_conversion_ratio": {"min": 2.0, "max": 3.0},
      "expected_yield_mt_per_acre": {"min": 1.0, "max": 3.0},
      "market_price_per_kg_inr": {"min": 200.0, "max": 400.0},
      "survival_rate_percent": {"min": 65.0, "max": 75.0}
    },
    "culture_period_months": {"min": 12, "max": 18},
    "crops_per_year": {"min": 1, "max": null},
    "optimal_systems": ["POND", "RIVERINE_CAPTURE"],
    "culture_status": "High-Value Food",
    "ornamental_potential": "High — distinctive spotted pattern; popular in large aquariums",
    "notes": "Highly prized food fish in Bihar/UP; very high market value; primarily capture from Ganga and floodplain lakes; culture interest growing; also ornamental. Source: ICAR-NBFGR Bihar/UP species catalog."
  }'::jsonb
)
ON CONFLICT DO NOTHING;

-- ─── 11. Notopterus notopterus — Patra / Pholui (Food / Ornamental) ──────────
INSERT INTO knowledge_nodes (parent_id, node_type, data)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  'SPECIES',
  '{
    "scientific_name": "Notopterus notopterus",
    "common_names": {"en": "Bronze Featherback / Patra", "hi": "पत्रा / फोलुई"},
    "category": "FEATHERBACK",
    "description": "Notopterus notopterus (Patra or Pholui) is the Bronze Featherback, a distinctive freshwater fish native to the Ganga basin. It has a characteristic elongated, laterally compressed body with a long anal fin. It is found in rivers, floodplain lakes, and wetlands across Bihar and UP. It is both a food fish and an ornamental species. As a food fish, it is consumed locally. As an ornamental, its unusual shape and bronze coloration make it a novelty in aquariums.",
    "biological_parameters": {
      "temperature_celsius": {"min": 22.0, "max": 30.0},
      "dissolved_oxygen_mg_l": {"min": 3.0, "max": null},
      "ph_range": {"min": 6.5, "max": 8.0},
      "salinity_tolerance_ppt": {"min": 0.0, "max": 2.0}
    },
    "economic_parameters": {
      "feed_conversion_ratio": {"min": 2.0, "max": 3.0},
      "expected_yield_mt_per_acre": {"min": 0.5, "max": 1.5},
      "market_price_per_kg_inr": {"min": 80.0, "max": 160.0},
      "survival_rate_percent": {"min": 65.0, "max": 75.0}
    },
    "culture_period_months": {"min": 10, "max": 14},
    "crops_per_year": {"min": 1, "max": null},
    "optimal_systems": ["POND", "ORNAMENTAL_TANK"],
    "culture_status": "Food / Ornamental",
    "ornamental_potential": "Moderate — novelty shape; bronze coloration; suitable for large aquariums",
    "notes": "Bronze Featherback; distinctive elongated body; food and ornamental fish; found in Bihar/UP rivers and floodplain lakes; novelty ornamental value. Source: ICAR-NBFGR Bihar/UP species catalog."
  }'::jsonb
)
ON CONFLICT DO NOTHING;

-- ─── 12. Mastacembelus armatus — Baam / Mar-eel (High-Value Food) ─────────────
INSERT INTO knowledge_nodes (parent_id, node_type, data)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  'SPECIES',
  '{
    "scientific_name": "Mastacembelus armatus",
    "common_names": {"en": "Tire Track Eel / Baam / Mar-eel", "hi": "बाम / मार-ईल"},
    "category": "SPINY_EEL",
    "description": "Mastacembelus armatus (Baam or Mar-eel) is a large spiny eel native to the rivers and wetlands of Bihar and UP. It is one of the most commercially valuable freshwater fish in the region, commanding a very high market price. It is prized for its delicate, boneless flesh and is considered a delicacy. It is a nocturnal burrowing predator that feeds on worms, small fish, and invertebrates. It is also highly valued in the export ornamental fish trade due to its striking tire-track pattern.",
    "biological_parameters": {
      "temperature_celsius": {"min": 22.0, "max": 30.0},
      "dissolved_oxygen_mg_l": {"min": 3.0, "max": null},
      "ph_range": {"min": 6.5, "max": 8.0},
      "salinity_tolerance_ppt": {"min": 0.0, "max": 2.0}
    },
    "economic_parameters": {
      "feed_conversion_ratio": {"min": 2.0, "max": 3.0},
      "expected_yield_mt_per_acre": {"min": 0.5, "max": 2.0},
      "market_price_per_kg_inr": {"min": 300.0, "max": 600.0},
      "survival_rate_percent": {"min": 65.0, "max": 78.0}
    },
    "culture_period_months": {"min": 12, "max": 18},
    "crops_per_year": {"min": 1, "max": null},
    "optimal_systems": ["POND", "ORNAMENTAL_TANK"],
    "culture_status": "High-Value Food",
    "ornamental_potential": "High — striking tire-track pattern; high export value in ornamental trade",
    "notes": "Large spiny eel; very high market value (Rs 300–600/kg); prized delicacy in Bihar/UP; nocturnal burrowing predator; also high ornamental export value. Source: ICAR-NBFGR Bihar/UP species catalog."
  }'::jsonb
)
ON CONFLICT DO NOTHING;

-- ─── 13. Xenentodon cancila — Kauwa / Garfish (Ornamental) ───────────────────
INSERT INTO knowledge_nodes (parent_id, node_type, data)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  'SPECIES',
  '{
    "scientific_name": "Xenentodon cancila",
    "common_names": {"en": "Indian Garfish / Kauwa", "hi": "कौवा / गारफिश"},
    "category": "ORNAMENTAL",
    "description": "Xenentodon cancila (Kauwa or Indian Garfish) is a slender, needle-shaped freshwater fish native to the rivers and wetlands of Bihar and UP. It is a surface-dwelling predator with a long, beak-like jaw. It is primarily valued as an ornamental fish due to its distinctive needle-like shape and active swimming behavior. It is found in the Ganga, Gandak, and Kosi river systems. Research on its biological indices (length-weight relationship) has been conducted in Bihar, confirming its fitness for controlled environments.",
    "biological_parameters": {
      "temperature_celsius": {"min": 22.0, "max": 30.0},
      "dissolved_oxygen_mg_l": {"min": 4.0, "max": null},
      "ph_range": {"min": 6.5, "max": 8.0},
      "salinity_tolerance_ppt": {"min": 0.0, "max": 2.0}
    },
    "economic_parameters": {
      "feed_conversion_ratio": {"min": 2.0, "max": 3.0},
      "expected_yield_mt_per_acre": {"min": 0.2, "max": 0.8},
      "market_price_per_kg_inr": {"min": 100.0, "max": 250.0},
      "survival_rate_percent": {"min": 65.0, "max": 78.0}
    },
    "culture_period_months": {"min": 8, "max": 12},
    "crops_per_year": {"min": 1, "max": 2},
    "optimal_systems": ["ORNAMENTAL_TANK", "POND"],
    "culture_status": "Ornamental",
    "ornamental_potential": "Moderate — distinctive needle shape; active surface swimmer; suitable for large aquariums",
    "notes": "Indian Garfish; needle-shaped surface predator; ornamental value; found in Bihar/UP rivers; biological indices studied by ICAR for aquaculture fitness. Source: ICAR-NBFGR Bihar/UP species catalog."
  }'::jsonb
)
ON CONFLICT DO NOTHING;

-- ─── 14. Puntius sophore — Sidhari / Pothia (Ornamental / Food) ──────────────
INSERT INTO knowledge_nodes (parent_id, node_type, data)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  'SPECIES',
  '{
    "scientific_name": "Puntius sophore",
    "common_names": {"en": "Spot-fin Swamp Barb / Pothia", "hi": "सिधारी / पोथिया"},
    "category": "ORNAMENTAL",
    "description": "Puntius sophore (Sidhari or Pothia) is a small, active barb native to the rivers and wetlands of Bihar and UP. It is both a food fish and an ornamental species. ICAR research has identified it as highly robust with strong allometric growth patterns (regression coefficient b = 2.7–3.9), making it a strong candidate for low-input rural aquaculture. As an ornamental, it is active and suitable for community aquariums. It is widely distributed across the Ganga basin.",
    "biological_parameters": {
      "temperature_celsius": {"min": 20.0, "max": 30.0},
      "dissolved_oxygen_mg_l": {"min": 3.0, "max": null},
      "ph_range": {"min": 6.5, "max": 8.0},
      "salinity_tolerance_ppt": {"min": 0.0, "max": 2.0}
    },
    "economic_parameters": {
      "feed_conversion_ratio": {"min": 1.5, "max": 2.0},
      "expected_yield_mt_per_acre": {"min": 0.3, "max": 1.0},
      "market_price_per_kg_inr": {"min": 60.0, "max": 120.0},
      "survival_rate_percent": {"min": 75.0, "max": 85.0}
    },
    "culture_period_months": {"min": 6, "max": 9},
    "crops_per_year": {"min": 2, "max": null},
    "optimal_systems": ["POND", "ORNAMENTAL_TANK"],
    "culture_status": "Ornamental / Food",
    "ornamental_potential": "Moderate — active swimmer; suitable for community aquariums",
    "notes": "Highly robust barb; ICAR-identified candidate for low-input rural aquaculture; strong allometric growth (b=2.7–3.9); dual-use food and ornamental; widely distributed in Bihar/UP. Source: ICAR-NBFGR Bihar/UP species catalog."
  }'::jsonb
)
ON CONFLICT DO NOTHING;

-- ─── 15. Puntius conchonius — Lal Pothia / Rosy Barb (Ornamental) ────────────
INSERT INTO knowledge_nodes (parent_id, node_type, data)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  'SPECIES',
  '{
    "scientific_name": "Puntius conchonius",
    "common_names": {"en": "Rosy Barb / Lal Pothia", "hi": "लाल पोथिया"},
    "category": "ORNAMENTAL",
    "description": "Puntius conchonius (Lal Pothia or Rosy Barb) is one of the most popular ornamental fish native to Bihar and UP. Males display a brilliant rosy-red coloration, especially during breeding season, making them highly attractive for the aquarium trade. It is found in the rivers and floodplain wetlands of North Bihar, particularly in West Champaran, East Champaran, Sitamarhi, and Madhubani. It is hardy, adaptable, and easy to breed in captivity, making it ideal for ornamental fish farming.",
    "biological_parameters": {
      "temperature_celsius": {"min": 18.0, "max": 28.0},
      "dissolved_oxygen_mg_l": {"min": 3.0, "max": null},
      "ph_range": {"min": 6.5, "max": 8.0},
      "salinity_tolerance_ppt": {"min": 0.0, "max": 1.5}
    },
    "economic_parameters": {
      "feed_conversion_ratio": {"min": 1.2, "max": 1.8},
      "expected_yield_mt_per_acre": {"min": 0.1, "max": 0.5},
      "market_price_per_kg_inr": {"min": 200.0, "max": 500.0},
      "survival_rate_percent": {"min": 80.0, "max": 90.0}
    },
    "culture_period_months": {"min": 4, "max": 6},
    "crops_per_year": {"min": 2, "max": 3},
    "optimal_systems": ["ORNAMENTAL_TANK", "POND"],
    "culture_status": "Ornamental",
    "ornamental_potential": "High — brilliant rosy-red coloration in males; hardy; vibrant; easy to breed",
    "notes": "Popular ornamental barb; brilliant rosy-red coloration; native to North Bihar wetlands (Champaran, Sitamarhi, Madhubani); hardy and easy to breed; high domestic and export ornamental value. Source: ICAR-CIFRI Freshwater Ornamental Fish of Bihar."
  }'::jsonb
)
ON CONFLICT DO NOTHING;

-- ─── 16. Parambassis ranga — Indian Glass Fish / Chana (Ornamental) ──────────
INSERT INTO knowledge_nodes (parent_id, node_type, data)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  'SPECIES',
  '{
    "scientific_name": "Parambassis ranga",
    "common_names": {"en": "Indian Glass Fish / Chana", "hi": "चाना / ग्लासफिश"},
    "category": "ORNAMENTAL",
    "description": "Parambassis ranga (Indian Glass Fish or Chana) is a small, translucent freshwater fish native to the rivers and wetlands of Bihar and UP. Its completely transparent body, through which internal organs are visible, makes it one of the most distinctive and sought-after ornamental fish in the aquarium trade. It is found in the floodplain lakes and rivers of North Bihar. It is a schooling fish that thrives in groups. Bihar has significant potential for its commercial ornamental production.",
    "biological_parameters": {
      "temperature_celsius": {"min": 20.0, "max": 30.0},
      "dissolved_oxygen_mg_l": {"min": 3.5, "max": null},
      "ph_range": {"min": 6.5, "max": 8.0},
      "salinity_tolerance_ppt": {"min": 0.0, "max": 2.0}
    },
    "economic_parameters": {
      "feed_conversion_ratio": {"min": 1.2, "max": 1.8},
      "expected_yield_mt_per_acre": {"min": 0.05, "max": 0.3},
      "market_price_per_kg_inr": {"min": 300.0, "max": 800.0},
      "survival_rate_percent": {"min": 75.0, "max": 88.0}
    },
    "culture_period_months": {"min": 4, "max": 6},
    "crops_per_year": {"min": 2, "max": 3},
    "optimal_systems": ["ORNAMENTAL_TANK"],
    "culture_status": "Ornamental",
    "ornamental_potential": "High — completely translucent body; unique appearance; high domestic and export demand",
    "notes": "Indian Glass Fish; completely transparent body; highly sought ornamental; native to North Bihar floodplain lakes; schooling fish; high export ornamental value. Source: ICAR-CIFRI Freshwater Ornamental Fish of Bihar."
  }'::jsonb
)
ON CONFLICT DO NOTHING;

-- ─── 17. Colisa fasciatus — Banded Gourami / Khonjhva (Ornamental) ───────────
INSERT INTO knowledge_nodes (parent_id, node_type, data)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  'SPECIES',
  '{
    "scientific_name": "Colisa fasciatus",
    "common_names": {"en": "Banded Gourami / Khonjhva", "hi": "खोंझवा / खोस्ती"},
    "category": "ORNAMENTAL",
    "description": "Colisa fasciatus (Banded Gourami or Khonjhva) is a colorful freshwater gourami native to the rivers and wetlands of Bihar and UP. It displays striking vertical bands of blue and orange-red coloration, making it highly attractive for the aquarium trade. It is found in the floodplain lakes and slow-moving rivers of North Bihar. It is an air-breathing labyrinth fish that can survive in low-oxygen water. Bihar has significant potential for its commercial ornamental production for both domestic and export markets.",
    "biological_parameters": {
      "temperature_celsius": {"min": 22.0, "max": 30.0},
      "dissolved_oxygen_mg_l": {"min": 2.0, "max": null},
      "ph_range": {"min": 6.5, "max": 8.0},
      "salinity_tolerance_ppt": {"min": 0.0, "max": 1.5}
    },
    "economic_parameters": {
      "feed_conversion_ratio": {"min": 1.2, "max": 1.8},
      "expected_yield_mt_per_acre": {"min": 0.05, "max": 0.3},
      "market_price_per_kg_inr": {"min": 250.0, "max": 600.0},
      "survival_rate_percent": {"min": 78.0, "max": 88.0}
    },
    "culture_period_months": {"min": 4, "max": 6},
    "crops_per_year": {"min": 2, "max": 3},
    "optimal_systems": ["ORNAMENTAL_TANK"],
    "culture_status": "Ornamental",
    "ornamental_potential": "High — colorful bands; air-breathing; hardy; domestic and export ornamental value",
    "notes": "Banded Gourami; striking blue and orange-red bands; air-breathing labyrinth fish; native to North Bihar wetlands; high ornamental value for domestic and export markets. Source: ICAR-CIFRI Freshwater Ornamental Fish of Bihar."
  }'::jsonb
)
ON CONFLICT DO NOTHING;

-- ─── 18. Trichogaster lalius — Dwarf Gourami (Ornamental / Export) ───────────
INSERT INTO knowledge_nodes (parent_id, node_type, data)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  'SPECIES',
  '{
    "scientific_name": "Trichogaster lalius",
    "common_names": {"en": "Dwarf Gourami", "hi": "ड्वार्फ गौरामी"},
    "category": "ORNAMENTAL",
    "description": "Trichogaster lalius (Dwarf Gourami) is one of the most popular ornamental fish in the global aquarium trade, and it is native to the rivers and wetlands of Bihar and UP. Males display brilliant red-orange and blue vertical stripes, making them among the most colorful freshwater fish in the world. It is found in the floodplain lakes and slow-moving rivers of North Bihar. It is an air-breathing labyrinth fish. Bihar has very high potential for its commercial production for export, as it commands premium prices in international ornamental fish markets.",
    "biological_parameters": {
      "temperature_celsius": {"min": 22.0, "max": 30.0},
      "dissolved_oxygen_mg_l": {"min": 2.0, "max": null},
      "ph_range": {"min": 6.5, "max": 8.0},
      "salinity_tolerance_ppt": {"min": 0.0, "max": 1.5}
    },
    "economic_parameters": {
      "feed_conversion_ratio": {"min": 1.0, "max": 1.5},
      "expected_yield_mt_per_acre": {"min": 0.05, "max": 0.2},
      "market_price_per_kg_inr": {"min": 500.0, "max": 2000.0},
      "survival_rate_percent": {"min": 78.0, "max": 90.0}
    },
    "culture_period_months": {"min": 3, "max": 5},
    "crops_per_year": {"min": 2, "max": 4},
    "optimal_systems": ["ORNAMENTAL_TANK"],
    "culture_status": "Ornamental (Export)",
    "ornamental_potential": "Very High — globally popular; brilliant coloration; premium export value; native to Bihar/UP",
    "notes": "Globally popular ornamental fish; brilliant red-orange and blue stripes; native to North Bihar wetlands; very high export value; air-breathing labyrinth fish; Bihar has significant commercial production potential. Source: ICAR-CIFRI Freshwater Ornamental Fish of Bihar."
  }'::jsonb
)
ON CONFLICT DO NOTHING;

-- ─── 19. Botia lohachata — Reticulated Loach / Hara Baghi (Ornamental) ───────
INSERT INTO knowledge_nodes (parent_id, node_type, data)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  'SPECIES',
  '{
    "scientific_name": "Botia lohachata",
    "common_names": {"en": "Reticulated Loach / Hara Baghi", "hi": "हरा बाघी"},
    "category": "ORNAMENTAL",
    "description": "Botia lohachata (Hara Baghi or Reticulated Loach) is a striking ornamental loach native to the rivers and wetlands of Bihar and UP. It displays a distinctive reticulated (net-like) black and white pattern on its body, making it highly attractive for the aquarium trade. It is a bottom-dwelling, social fish that thrives in groups. It is found in the Ganga, Gandak, and Kosi river systems. Bihar has significant potential for its commercial ornamental production.",
    "biological_parameters": {
      "temperature_celsius": {"min": 20.0, "max": 28.0},
      "dissolved_oxygen_mg_l": {"min": 4.0, "max": null},
      "ph_range": {"min": 6.5, "max": 8.0},
      "salinity_tolerance_ppt": {"min": 0.0, "max": 1.0}
    },
    "economic_parameters": {
      "feed_conversion_ratio": {"min": 1.2, "max": 1.8},
      "expected_yield_mt_per_acre": {"min": 0.05, "max": 0.2},
      "market_price_per_kg_inr": {"min": 300.0, "max": 800.0},
      "survival_rate_percent": {"min": 75.0, "max": 88.0}
    },
    "culture_period_months": {"min": 5, "max": 8},
    "crops_per_year": {"min": 2, "max": 3},
    "optimal_systems": ["ORNAMENTAL_TANK"],
    "culture_status": "Ornamental",
    "ornamental_potential": "High — distinctive reticulated pattern; social bottom-dweller; popular in aquarium hobby",
    "notes": "Reticulated Loach; distinctive black-and-white net pattern; social bottom-dweller; native to Bihar/UP rivers; high ornamental value; found in Ganga, Gandak, Kosi systems. Source: ICAR-CIFRI Freshwater Ornamental Fish of Bihar."
  }'::jsonb
)
ON CONFLICT DO NOTHING;

-- ─── 20. Macrobrachium lamarrei — Kuncho / Chhota Jhinga (Indigenous Prawn) ──
INSERT INTO knowledge_nodes (parent_id, node_type, data)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  'SPECIES',
  '{
    "scientific_name": "Macrobrachium lamarrei",
    "common_names": {"en": "Kuncho Prawn / Small Freshwater Prawn", "hi": "छोटा झींगा / कुंचो"},
    "category": "PRAWN",
    "description": "Macrobrachium lamarrei (Kuncho or Chhota Jhinga) is a small indigenous freshwater prawn native to the rivers and wetlands of Bihar and UP. Unlike the commercially farmed Giant Freshwater Prawn (M. rosenbergii), it does not require a brackish water phase for larval development, making it highly suitable for landlocked inland states. It is considered an untapped resource with significant potential for rural aquaculture. It is rich in micronutrients and can support the nutritional security of rural populations.",
    "biological_parameters": {
      "temperature_celsius": {"min": 24.0, "max": 30.0},
      "dissolved_oxygen_mg_l": {"min": 3.5, "max": null},
      "ph_range": {"min": 7.0, "max": 8.5},
      "salinity_tolerance_ppt": {"min": 0.0, "max": 1.0}
    },
    "economic_parameters": {
      "feed_conversion_ratio": {"min": 1.5, "max": 2.2},
      "expected_yield_mt_per_acre": {"min": 0.3, "max": 1.0},
      "market_price_per_kg_inr": {"min": 150.0, "max": 300.0},
      "survival_rate_percent": {"min": 70.0, "max": 82.0}
    },
    "culture_period_months": {"min": 6, "max": 8},
    "crops_per_year": {"min": 1, "max": 2},
    "optimal_systems": ["POND", "WETLAND_INTEGRATED"],
    "culture_status": "Indigenous / Local Trade",
    "notes": "Small indigenous freshwater prawn; no brackish water phase needed for larvae — ideal for landlocked Bihar/UP; untapped resource; rich in micronutrients; supports rural nutritional security. Source: ICAR-NBFGR Bihar/UP species catalog."
  }'::jsonb
)
ON CONFLICT DO NOTHING;

-- ─── 21. Macrobrachium dayanum — River Prawn / Jhinga (Riverine Prawn) ────────
INSERT INTO knowledge_nodes (parent_id, node_type, data)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  'SPECIES',
  '{
    "scientific_name": "Macrobrachium dayanum",
    "common_names": {"en": "Day''s River Prawn / Jhinga", "hi": "झींगा"},
    "category": "PRAWN",
    "description": "Macrobrachium dayanum (Jhinga) is a medium-sized indigenous freshwater prawn native to the rivers of Bihar and UP. It is found in the Ganga, Gandak, Kosi, and Bagmati river systems. Like M. lamarrei, it does not require a brackish water phase for larval development, making it suitable for inland freshwater culture. It is currently collected from the wild and sold in local markets. It is considered an untapped resource with potential for pond culture and polyculture with carps.",
    "biological_parameters": {
      "temperature_celsius": {"min": 24.0, "max": 31.0},
      "dissolved_oxygen_mg_l": {"min": 4.0, "max": null},
      "ph_range": {"min": 7.0, "max": 8.5},
      "salinity_tolerance_ppt": {"min": 0.0, "max": 1.5}
    },
    "economic_parameters": {
      "feed_conversion_ratio": {"min": 1.8, "max": 2.5},
      "expected_yield_mt_per_acre": {"min": 0.3, "max": 1.0},
      "market_price_per_kg_inr": {"min": 180.0, "max": 350.0},
      "survival_rate_percent": {"min": 65.0, "max": 78.0}
    },
    "culture_period_months": {"min": 6, "max": 9},
    "crops_per_year": {"min": 1, "max": 2},
    "optimal_systems": ["POND", "WETLAND_INTEGRATED"],
    "culture_status": "Wild Collection / Potential Culture",
    "notes": "Medium indigenous river prawn; no brackish water phase needed; found in Ganga, Gandak, Kosi rivers; wild collection currently; untapped culture potential; suitable for polyculture with carps. Source: ICAR-NBFGR Bihar/UP species catalog."
  }'::jsonb
)
ON CONFLICT DO NOTHING;

-- ─── 22. Sartoriana spinigera — Freshwater Crab / Kekra (Wetland Capture) ────
INSERT INTO knowledge_nodes (parent_id, node_type, data)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  'SPECIES',
  '{
    "scientific_name": "Sartoriana spinigera",
    "common_names": {"en": "Freshwater Crab / Kekra", "hi": "केकड़ा / केकरा"},
    "category": "CRAB",
    "description": "Sartoriana spinigera (Kekra) is one of the most commonly found and consumed freshwater crabs in the wetlands of Bihar. It is an integral part of the aquatic ecosystem in the Ganga basin and is widely consumed locally. Bihar has 15 recorded freshwater crab species, and Sartoriana spinigera is among the most prominent. While large-scale commercial crab farming is not yet established, crab fattening — holding soft-shelled crabs for a few weeks until they reach marketable hardness — is a recognized strategy to increase profitability from wetland capture.",
    "biological_parameters": {
      "temperature_celsius": {"min": 20.0, "max": 30.0},
      "dissolved_oxygen_mg_l": {"min": 3.0, "max": null},
      "ph_range": {"min": 6.5, "max": 8.5},
      "salinity_tolerance_ppt": {"min": 0.0, "max": 1.0}
    },
    "economic_parameters": {
      "feed_conversion_ratio": {"min": 2.0, "max": 3.0},
      "expected_yield_mt_per_acre": {"min": 0.1, "max": 0.5},
      "market_price_per_kg_inr": {"min": 100.0, "max": 250.0},
      "survival_rate_percent": {"min": 65.0, "max": 78.0}
    },
    "culture_period_months": {"min": 2, "max": 4},
    "crops_per_year": {"min": 2, "max": 3},
    "optimal_systems": ["WETLAND_INTEGRATED", "POND"],
    "culture_status": "Wetland Capture / Fattening",
    "notes": "Most common freshwater crab in Bihar wetlands; widely consumed locally; crab fattening (soft-shell to hard-shell) is a viable income strategy; 15 crab species recorded in Bihar. Source: ICAR-NBFGR Bihar/UP species catalog."
  }'::jsonb
)
ON CONFLICT DO NOTHING;
