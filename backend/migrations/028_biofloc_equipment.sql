-- ============================================================================
-- Migration 028: Biofloc Equipment Catalog
-- Adds all 21 standard items required for a 10,000-litre Biofloc tank unit.
-- Source: Bihar Government Biofloc Technology Guidelines
-- Category: BIOFLOC — shown in "All" view and in the dedicated Biofloc filter.
-- Costs are Bihar/India market rate estimates (May 2026).
-- Fix #17: Use a unique index on (name, category) so ON CONFLICT DO NOTHING
-- actually prevents duplicate rows on re-run.
-- ============================================================================

-- Ensure the unique index exists before inserting (idempotent)
CREATE UNIQUE INDEX IF NOT EXISTS idx_equipment_catalog_name_category
    ON equipment_catalog (name, category);

INSERT INTO equipment_catalog
    (name, category, specifications, cost_inr, lifespan_years, power_consumption_kw, maintenance_cost_annual_inr, is_active)
VALUES
    (
        'Biofloc Tarpaulin Tank (10,000 L)',
        'BIOFLOC',
        '{"volume_litres": 10000, "material": "650 GSM tarpaulin", "shape": "Circular", "support": "Iron mesh frame", "diameter_m": 3.6, "depth_m": 1.0}'::jsonb,
        4500, 3, NULL, 300, TRUE
    ),
    (
        'Iron Mesh Frame for Biofloc Tank',
        'BIOFLOC',
        '{"compatible_tank": "10,000 L circular tarpaulin", "material": "Galvanised iron mesh", "purpose": "Structural support for tarpaulin tank walls"}'::jsonb,
        2000, 5, NULL, 200, TRUE
    ),
    (
        'Air Blower (0.5 HP) for Biofloc',
        'BIOFLOC',
        '{"hp": "0.5", "type": "Regenerative blower", "operation": "24/7 continuous", "air_flow_lpm": 80, "note": "Must run continuously — connect to inverter backup"}'::jsonb,
        3500, 4, 0.37, 400, TRUE
    ),
    (
        'Air Stones for Biofloc Tank (Set of 10)',
        'BIOFLOC',
        '{"quantity": 10, "material": "Ceramic/mineral", "purpose": "Distribute aeration evenly across tank floor", "replacement_interval_months": 6}'::jsonb,
        400, 1, NULL, 200, TRUE
    ),
    (
        'Oxygen / Air Distribution Pipes',
        'BIOFLOC',
        '{"material": "Flexible PVC tubing", "purpose": "Connect blower to air stones throughout tank", "length_m": 10}'::jsonb,
        600, 2, NULL, 100, TRUE
    ),
    (
        'PVC Pipes and Fittings (Biofloc)',
        'BIOFLOC',
        '{"purpose": "Inlet, outlet, and drainage plumbing for biofloc tank", "includes": "Elbows, T-joints, valves, end caps"}'::jsonb,
        500, 5, NULL, 50, TRUE
    ),
    (
        'Inverter for 24/7 Aeration Backup',
        'BIOFLOC',
        '{"purpose": "Power backup for air blower during electricity outage", "capacity_va": 600, "note": "Non-negotiable — power failure without inverter causes total fish mortality within hours"}'::jsonb,
        3000, 5, NULL, 300, TRUE
    ),
    (
        'Battery for Inverter (Biofloc)',
        'BIOFLOC',
        '{"type": "Lead-acid tubular", "capacity_ah": 100, "compatible_with": "600 VA inverter", "backup_hours": 4}'::jsonb,
        2500, 3, NULL, 200, TRUE
    ),
    (
        'Ammonia Test Kit (Biofloc)',
        'BIOFLOC',
        '{"parameter": "Ammonia (NH3/NH4+)", "range_ppm": "0–8", "tests_per_kit": 50, "target_range": "0.25–0.5 ppm", "action": "Add molasses if ammonia exceeds 0.5 ppm"}'::jsonb,
        400, 1, NULL, 0, TRUE
    ),
    (
        'Nitrite Test Kit (Biofloc)',
        'BIOFLOC',
        '{"parameter": "Nitrite (NO2)", "range_ppm": "0–5", "tests_per_kit": 50, "target_range": "below 0.5 ppm"}'::jsonb,
        300, 1, NULL, 0, TRUE
    ),
    (
        'Nitrate Test Kit (Biofloc)',
        'BIOFLOC',
        '{"parameter": "Nitrate (NO3)", "range_ppm": "0–50", "tests_per_kit": 50, "target_range": "below 0.5 ppm"}'::jsonb,
        300, 1, NULL, 0, TRUE
    ),
    (
        'pH Test Kit (Biofloc)',
        'BIOFLOC',
        '{"parameter": "pH", "range": "6–9", "tests_per_kit": 100, "target_range": "7–8", "action": "Add calcium carbonate if pH drops below 7"}'::jsonb,
        200, 1, NULL, 0, TRUE
    ),
    (
        'Alkalinity Test Kit (Biofloc)',
        'BIOFLOC',
        '{"parameter": "Total Alkalinity", "range_ppm": "0–300", "tests_per_kit": 50, "target_range": "120–200 ppm"}'::jsonb,
        200, 1, NULL, 0, TRUE
    ),
    (
        'Dissolved Oxygen (DO) Test Kit (Biofloc)',
        'BIOFLOC',
        '{"parameter": "Dissolved Oxygen", "range_ppm": "0–20", "tests_per_kit": 50, "target_range": "above 6.0 ppm", "note": "Check every morning — low DO is the first sign of aeration failure"}'::jsonb,
        1500, 2, NULL, 0, TRUE
    ),
    (
        'Liquid Probiotics for Biofloc',
        'BIOFLOC',
        '{"purpose": "Seed and maintain heterotrophic bacterial community in floc", "application": "1,200 ml per tank at startup; 400 ml/month ongoing", "contains": "Bacillus spp., Lactobacillus spp."}'::jsonb,
        240, 1, NULL, 0, TRUE
    ),
    (
        'Calcium Carbonate (CaCO3) for Biofloc',
        'BIOFLOC',
        '{"purpose": "Maintain alkalinity and buffer pH in biofloc system", "application": "600 g per tank per cycle at startup", "form": "Powder"}'::jsonb,
        30, 1, NULL, 0, TRUE
    ),
    (
        'Molasses (Carbon Source for Biofloc)',
        'BIOFLOC',
        '{"purpose": "Carbon source to feed heterotrophic bacteria and control ammonia", "application": "1.5 L per tank at startup; 200 ml/month ongoing; add extra when ammonia exceeds 0.5 ppm", "type": "Sugarcane molasses"}'::jsonb,
        45, 1, NULL, 0, TRUE
    ),
    (
        'Raw Salt for Biofloc Water Preparation',
        'BIOFLOC',
        '{"purpose": "Water preparation at tank startup — raises TDS to 1,400–1,800 ppm", "application": "17 kg per 10,000-litre tank per cycle", "type": "Non-iodised raw salt"}'::jsonb,
        170, 1, NULL, 0, TRUE
    ),
    (
        'Imhoff Cone (Floc Volume Measurement)',
        'BIOFLOC',
        '{"purpose": "Measure floc volume (FV) in ml/L — target 15–20 ml/L for healthy biofloc", "material": "Transparent plastic or glass", "volume_ml": 1000, "note": "Unique to biofloc — not used in other systems"}'::jsonb,
        350, 3, NULL, 0, TRUE
    ),
    (
        'Thermometer (Biofloc Water)',
        'BIOFLOC',
        '{"purpose": "Monitor water temperature daily", "range_celsius": "0–50", "type": "Digital or glass", "target_range": "20–35°C"}'::jsonb,
        200, 2, NULL, 0, TRUE
    ),
    (
        'Hand Net for Biofloc Tank',
        'BIOFLOC',
        '{"purpose": "Sampling, removing dead fish, and partial harvest from biofloc tank", "mesh_size_mm": 5, "handle_length_cm": 60, "material": "Nylon mesh with aluminium frame"}'::jsonb,
        150, 2, NULL, 50, TRUE
    )
ON CONFLICT (name, category) DO NOTHING;
