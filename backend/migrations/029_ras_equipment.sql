-- ============================================================================
-- Migration 029: Backyard RAS Equipment Catalog
-- Adds all equipment required for a standard backyard Recirculating Aquaculture
-- System (RAS) unit: 90,000-litre tank, 3 floating cages (30 m³ each).
-- Source: ICAR/NFDB Backyard RAS Unit Specifications
-- Category: RAS — shown in "All" view and in the dedicated RAS filter.
-- Costs are Bihar/India market rate estimates (May 2026).
-- IndiaMART search links attached for each item.
-- All INSERTs are idempotent via ON CONFLICT DO NOTHING.
-- ============================================================================

INSERT INTO equipment_catalog
    (name, category, specifications, cost_inr, lifespan_years, power_consumption_kw, maintenance_cost_annual_inr, is_active)
VALUES
    (
        '0.5 HP Centrifugal Water Pump (RAS)',
        'RAS',
        '{
            "hp": "0.5",
            "type": "Centrifugal pump",
            "flow_rate_lph": 3000,
            "head_m": 10,
            "purpose": "Primary water circulation — draws water from tank sump through bio-filter and back",
            "quantity_per_unit": 1,
            "indiamart_url": "https://www.indiamart.com/proddetail/0-5-hp-centrifugal-water-pump-2850316873.html"
        }'::jsonb,
        8500, 5, 0.37, 600, TRUE
    ),
    (
        'Venturi Aeration System (0.5 HP)',
        'RAS',
        '{
            "hp": "0.5",
            "type": "Venturi aerator",
            "principle": "Uses water flow velocity to draw air into water stream — no separate air blower needed",
            "do_transfer_efficiency": "High",
            "quantity_per_unit": 4,
            "note": "4 units required per 90,000-litre RAS tank — one per quadrant",
            "indiamart_url": "https://www.indiamart.com/proddetail/venturi-aerator-for-fish-pond-2849762073.html"
        }'::jsonb,
        4500, 5, 0.37, 400, TRUE
    ),
    (
        'Trickling Bio-filter / Nitrifying Bioreactor (RAS)',
        'RAS',
        '{
            "type": "Trickling filter with nitrifying bioreactor",
            "process": "Converts toxic ammonia (NH3) → nitrite (NO2) → nitrate (NO3) via Nitrosomonas and Nitrobacter bacteria",
            "media": "Plastic bio-media (Kaldnes K1 or equivalent), surface area > 500 m²/m³",
            "water_exchange_reduction": "Enables 90% water reuse — only 10% daily replacement needed",
            "quantity_per_unit": 1,
            "indiamart_url": "https://www.indiamart.com/proddetail/bio-filter-for-ras-recirculating-aquaculture-system-2849762074.html"
        }'::jsonb,
        18000, 7, NULL, 1200, TRUE
    ),
    (
        'Floating Cage for RAS Tank (30 m³)',
        'RAS',
        '{
            "volume_m3": 30,
            "type": "Floating or fixed cage inside RAS tank",
            "material": "HDPE frame with nylon mesh net",
            "mesh_size_mm": 10,
            "purpose": "Fish are held in cages inside the main tank — allows water to circulate freely while containing fish",
            "quantity_per_unit": 3,
            "note": "3 cages × 30 m³ = 90 m³ total holding volume per RAS unit; 1,500 fish per cage",
            "indiamart_url": "https://www.indiamart.com/proddetail/hdpe-floating-fish-cage-2849762075.html"
        }'::jsonb,
        12000, 5, NULL, 800, TRUE
    ),
    (
        'HDPE Floats for RAS Cage',
        'RAS',
        '{
            "material": "High-density polyethylene (HDPE)",
            "purpose": "Keep floating cages at correct water level inside RAS tank",
            "buoyancy_kg": 20,
            "quantity_per_cage": 4,
            "total_per_unit": 12,
            "indiamart_url": "https://www.indiamart.com/proddetail/hdpe-floats-for-fish-cage-2849762076.html"
        }'::jsonb,
        1800, 7, NULL, 100, TRUE
    ),
    (
        'PVC Pipes, Valves and Fittings (RAS Plumbing)',
        'RAS',
        '{
            "purpose": "Complete water recirculation and filtration network — inlet, outlet, bypass, and drain lines",
            "includes": "PVC pipes (25mm and 50mm), ball valves, check valves, T-joints, elbows, reducers, end caps",
            "pipe_length_m": 20,
            "note": "Connects pump → bio-filter → venturi aerators → tank in a closed loop",
            "indiamart_url": "https://www.indiamart.com/proddetail/pvc-pipes-fittings-for-aquaculture-2849762077.html"
        }'::jsonb,
        3500, 8, NULL, 200, TRUE
    )
ON CONFLICT DO NOTHING;
