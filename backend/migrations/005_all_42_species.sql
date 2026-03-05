-- Migration to add all 42 species from India_Aquaculture_Species_Parameters.xlsx

DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM knowledge_nodes WHERE id = '11111111-1111-1111-1111-111111111111') THEN
        UPDATE knowledge_nodes
        SET data = data || '{"scientific_name": "Labeo rohita", "common_names": {"en": "Rohu"}, "category": "INDIAN_MAJOR_CARP", "biological_parameters": {"temperature_celsius": {"min": 25.0, "max": 35.0}, "dissolved_oxygen_mg_l": {"min": 5.0, "max": null}, "ph_range": {"min": 7.0, "max": 8.5}, "salinity_tolerance_ppt": {"min": 0.0, "max": 4.0}}, "economic_parameters": {"feed_conversion_ratio": {"min": 1.5, "max": 2.0}, "expected_yield_mt_per_acre": {"min": 4.0, "max": 7.0}, "market_price_per_kg_inr": {"min": 80.0, "max": 120.0}, "survival_rate_percent": {"min": 85.0, "max": 90.0}}, "culture_period_months": {"min": 6.0, "max": 10.0}, "crops_per_year": {"min": 2.0, "max": null}, "notes": "Thrives 28\u201332\u00b0C; survives up to 10 ppt short-term; pH <6 lethal; ICAR-CIFA", "optimal_systems": ["POND", "BIOFLOC"]}'::jsonb
        WHERE id = '11111111-1111-1111-1111-111111111111';
    ELSE
        INSERT INTO knowledge_nodes (id, parent_id, node_type, data)
        VALUES ('11111111-1111-1111-1111-111111111111', '00000000-0000-0000-0000-000000000001', 'SPECIES', '{"scientific_name": "Labeo rohita", "common_names": {"en": "Rohu"}, "category": "INDIAN_MAJOR_CARP", "biological_parameters": {"temperature_celsius": {"min": 25.0, "max": 35.0}, "dissolved_oxygen_mg_l": {"min": 5.0, "max": null}, "ph_range": {"min": 7.0, "max": 8.5}, "salinity_tolerance_ppt": {"min": 0.0, "max": 4.0}}, "economic_parameters": {"feed_conversion_ratio": {"min": 1.5, "max": 2.0}, "expected_yield_mt_per_acre": {"min": 4.0, "max": 7.0}, "market_price_per_kg_inr": {"min": 80.0, "max": 120.0}, "survival_rate_percent": {"min": 85.0, "max": 90.0}}, "culture_period_months": {"min": 6.0, "max": 10.0}, "crops_per_year": {"min": 2.0, "max": null}, "notes": "Thrives 28\u201332\u00b0C; survives up to 10 ppt short-term; pH <6 lethal; ICAR-CIFA", "optimal_systems": ["POND", "BIOFLOC"]}'::jsonb);
    END IF;
END $$;


DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM knowledge_nodes WHERE id = '11111111-1111-1111-1111-111111111112') THEN
        UPDATE knowledge_nodes
        SET data = data || '{"scientific_name": "Catla catla", "common_names": {"en": "Catla / Bhakura"}, "category": "INDIAN_MAJOR_CARP", "biological_parameters": {"temperature_celsius": {"min": 25.0, "max": 32.0}, "dissolved_oxygen_mg_l": {"min": 5.0, "max": null}, "ph_range": {"min": 6.5, "max": 8.5}, "salinity_tolerance_ppt": {"min": 0.0, "max": 2.0}}, "economic_parameters": {"feed_conversion_ratio": {"min": 1.35, "max": 1.74}, "expected_yield_mt_per_acre": {"min": 3.0, "max": 5.0}, "market_price_per_kg_inr": {"min": 130.0, "max": 190.0}, "survival_rate_percent": {"min": 70.0, "max": 85.0}}, "culture_period_months": {"min": 8.0, "max": 12.0}, "crops_per_year": {"min": 1.0, "max": null}, "notes": "Most sensitive to pH among 3 major carps; surface feeder; salinity >5 ppt causes mortality", "optimal_systems": ["TRADITIONAL_POND", "BIOFLOC"]}'::jsonb
        WHERE id = '11111111-1111-1111-1111-111111111112';
    ELSE
        INSERT INTO knowledge_nodes (id, parent_id, node_type, data)
        VALUES ('11111111-1111-1111-1111-111111111112', '00000000-0000-0000-0000-000000000001', 'SPECIES', '{"scientific_name": "Catla catla", "common_names": {"en": "Catla / Bhakura"}, "category": "INDIAN_MAJOR_CARP", "biological_parameters": {"temperature_celsius": {"min": 25.0, "max": 32.0}, "dissolved_oxygen_mg_l": {"min": 5.0, "max": null}, "ph_range": {"min": 6.5, "max": 8.5}, "salinity_tolerance_ppt": {"min": 0.0, "max": 2.0}}, "economic_parameters": {"feed_conversion_ratio": {"min": 1.35, "max": 1.74}, "expected_yield_mt_per_acre": {"min": 3.0, "max": 5.0}, "market_price_per_kg_inr": {"min": 130.0, "max": 190.0}, "survival_rate_percent": {"min": 70.0, "max": 85.0}}, "culture_period_months": {"min": 8.0, "max": 12.0}, "crops_per_year": {"min": 1.0, "max": null}, "notes": "Most sensitive to pH among 3 major carps; surface feeder; salinity >5 ppt causes mortality", "optimal_systems": ["TRADITIONAL_POND", "BIOFLOC"]}'::jsonb);
    END IF;
END $$;


DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM knowledge_nodes WHERE id = '11111111-1111-1111-1111-111111111113') THEN
        UPDATE knowledge_nodes
        SET data = data || '{"scientific_name": "Cirrhinus mrigala", "common_names": {"en": "Mrigal / White Carp"}, "category": "INDIAN_MAJOR_CARP", "biological_parameters": {"temperature_celsius": {"min": 20.0, "max": 35.0}, "dissolved_oxygen_mg_l": {"min": 4.0, "max": null}, "ph_range": {"min": 6.5, "max": 8.5}, "salinity_tolerance_ppt": {"min": 0.0, "max": 4.0}}, "economic_parameters": {"feed_conversion_ratio": {"min": 1.6, "max": 2.2}, "expected_yield_mt_per_acre": {"min": 2.0, "max": 4.0}, "market_price_per_kg_inr": {"min": 80.0, "max": 110.0}, "survival_rate_percent": {"min": 78.0, "max": 85.0}}, "culture_period_months": {"min": 10.0, "max": 12.0}, "crops_per_year": {"min": 1.0, "max": null}, "notes": "Bottom feeder; most salinity-tolerant of 3 major carps; tolerates up to 4 ppt without growth loss", "optimal_systems": ["POLYCULTURE_POND"]}'::jsonb
        WHERE id = '11111111-1111-1111-1111-111111111113';
    ELSE
        INSERT INTO knowledge_nodes (id, parent_id, node_type, data)
        VALUES ('11111111-1111-1111-1111-111111111113', '00000000-0000-0000-0000-000000000001', 'SPECIES', '{"scientific_name": "Cirrhinus mrigala", "common_names": {"en": "Mrigal / White Carp"}, "category": "INDIAN_MAJOR_CARP", "biological_parameters": {"temperature_celsius": {"min": 20.0, "max": 35.0}, "dissolved_oxygen_mg_l": {"min": 4.0, "max": null}, "ph_range": {"min": 6.5, "max": 8.5}, "salinity_tolerance_ppt": {"min": 0.0, "max": 4.0}}, "economic_parameters": {"feed_conversion_ratio": {"min": 1.6, "max": 2.2}, "expected_yield_mt_per_acre": {"min": 2.0, "max": 4.0}, "market_price_per_kg_inr": {"min": 80.0, "max": 110.0}, "survival_rate_percent": {"min": 78.0, "max": 85.0}}, "culture_period_months": {"min": 10.0, "max": 12.0}, "crops_per_year": {"min": 1.0, "max": null}, "notes": "Bottom feeder; most salinity-tolerant of 3 major carps; tolerates up to 4 ppt without growth loss", "optimal_systems": ["POLYCULTURE_POND"]}'::jsonb);
    END IF;
END $$;


DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM knowledge_nodes WHERE id = '44444444-4444-4444-4444-444444444444') THEN
        UPDATE knowledge_nodes
        SET data = data || '{"scientific_name": "Macrobrachium rosenbergii", "common_names": {"en": "Scampi / Giant FW Prawn"}, "category": "INDIAN_MAJOR_CARP", "biological_parameters": {"temperature_celsius": {"min": 26.0, "max": 31.0}, "dissolved_oxygen_mg_l": {"min": 4.0, "max": null}, "ph_range": {"min": 7.0, "max": 8.5}, "salinity_tolerance_ppt": {"min": 0.0, "max": 2.0}}, "economic_parameters": {"feed_conversion_ratio": {"min": 1.5, "max": 2.0}, "expected_yield_mt_per_acre": {"min": 1.5, "max": 3.0}, "market_price_per_kg_inr": {"min": 250.0, "max": 400.0}, "survival_rate_percent": {"min": 65.0, "max": 75.0}}, "culture_period_months": {"min": 8.0, "max": 12.0}, "crops_per_year": {"min": 1.0, "max": 2.0}, "notes": "Larvae require slight brackish (12 ppt) for 30\u201340 days; grow-out in freshwater; Bihar NFDB approved", "optimal_systems": ["POND", "BIOFLOC"]}'::jsonb
        WHERE id = '44444444-4444-4444-4444-444444444444';
    ELSE
        INSERT INTO knowledge_nodes (id, parent_id, node_type, data)
        VALUES ('44444444-4444-4444-4444-444444444444', '00000000-0000-0000-0000-000000000001', 'SPECIES', '{"scientific_name": "Macrobrachium rosenbergii", "common_names": {"en": "Scampi / Giant FW Prawn"}, "category": "INDIAN_MAJOR_CARP", "biological_parameters": {"temperature_celsius": {"min": 26.0, "max": 31.0}, "dissolved_oxygen_mg_l": {"min": 4.0, "max": null}, "ph_range": {"min": 7.0, "max": 8.5}, "salinity_tolerance_ppt": {"min": 0.0, "max": 2.0}}, "economic_parameters": {"feed_conversion_ratio": {"min": 1.5, "max": 2.0}, "expected_yield_mt_per_acre": {"min": 1.5, "max": 3.0}, "market_price_per_kg_inr": {"min": 250.0, "max": 400.0}, "survival_rate_percent": {"min": 65.0, "max": 75.0}}, "culture_period_months": {"min": 8.0, "max": 12.0}, "crops_per_year": {"min": 1.0, "max": 2.0}, "notes": "Larvae require slight brackish (12 ppt) for 30\u201340 days; grow-out in freshwater; Bihar NFDB approved", "optimal_systems": ["POND", "BIOFLOC"]}'::jsonb);
    END IF;
END $$;


DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM knowledge_nodes WHERE id = 'ba054eac-4432-4275-b0f8-b0f4b51fb97c') THEN
        UPDATE knowledge_nodes
        SET data = data || '{"scientific_name": "Labeo calbasu", "common_names": {"en": "Kalbasu / Orangefin Labeo"}, "category": "MINOR_CARP", "biological_parameters": {"temperature_celsius": {"min": 22.0, "max": 32.0}, "dissolved_oxygen_mg_l": {"min": 4.0, "max": null}, "ph_range": {"min": 6.5, "max": 8.5}, "salinity_tolerance_ppt": {"min": 0.0, "max": 3.0}}, "economic_parameters": {"feed_conversion_ratio": {"min": 1.8, "max": 2.5}, "expected_yield_mt_per_acre": {"min": 1.0, "max": 3.0}, "market_price_per_kg_inr": {"min": 70.0, "max": 100.0}, "survival_rate_percent": {"min": 75.0, "max": 80.0}}, "culture_period_months": {"min": 10.0, "max": 12.0}, "crops_per_year": {"min": 1.0, "max": null}, "notes": "Bottom\u2013mid feeder; grown with major carps; tolerates mild turbidity; Bihar, WB", "optimal_systems": ["POLYCULTURE_POND"]}'::jsonb
        WHERE id = 'ba054eac-4432-4275-b0f8-b0f4b51fb97c';
    ELSE
        INSERT INTO knowledge_nodes (id, parent_id, node_type, data)
        VALUES ('ba054eac-4432-4275-b0f8-b0f4b51fb97c', '00000000-0000-0000-0000-000000000001', 'SPECIES', '{"scientific_name": "Labeo calbasu", "common_names": {"en": "Kalbasu / Orangefin Labeo"}, "category": "MINOR_CARP", "biological_parameters": {"temperature_celsius": {"min": 22.0, "max": 32.0}, "dissolved_oxygen_mg_l": {"min": 4.0, "max": null}, "ph_range": {"min": 6.5, "max": 8.5}, "salinity_tolerance_ppt": {"min": 0.0, "max": 3.0}}, "economic_parameters": {"feed_conversion_ratio": {"min": 1.8, "max": 2.5}, "expected_yield_mt_per_acre": {"min": 1.0, "max": 3.0}, "market_price_per_kg_inr": {"min": 70.0, "max": 100.0}, "survival_rate_percent": {"min": 75.0, "max": 80.0}}, "culture_period_months": {"min": 10.0, "max": 12.0}, "crops_per_year": {"min": 1.0, "max": null}, "notes": "Bottom\u2013mid feeder; grown with major carps; tolerates mild turbidity; Bihar, WB", "optimal_systems": ["POLYCULTURE_POND"]}'::jsonb);
    END IF;
END $$;


DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM knowledge_nodes WHERE id = '046faaa1-e583-4b30-9882-62a02d88f38b') THEN
        UPDATE knowledge_nodes
        SET data = data || '{"scientific_name": "Cirrhinus reba", "common_names": {"en": "Reba Carp"}, "category": "MINOR_CARP", "biological_parameters": {"temperature_celsius": {"min": 22.0, "max": 33.0}, "dissolved_oxygen_mg_l": {"min": 4.0, "max": null}, "ph_range": {"min": 6.5, "max": 8.5}, "salinity_tolerance_ppt": {"min": 0.0, "max": 3.0}}, "economic_parameters": {"feed_conversion_ratio": {"min": 1.8, "max": 2.5}, "expected_yield_mt_per_acre": {"min": 1.0, "max": 2.0}, "market_price_per_kg_inr": {"min": 60.0, "max": 90.0}, "survival_rate_percent": {"min": 75.0, "max": 80.0}}, "culture_period_months": {"min": 10.0, "max": 12.0}, "crops_per_year": {"min": 1.0, "max": null}, "notes": "Minor carp; warm water species; used to fill ecological niche in composite carp culture", "optimal_systems": ["POLYCULTURE_POND"]}'::jsonb
        WHERE id = '046faaa1-e583-4b30-9882-62a02d88f38b';
    ELSE
        INSERT INTO knowledge_nodes (id, parent_id, node_type, data)
        VALUES ('046faaa1-e583-4b30-9882-62a02d88f38b', '00000000-0000-0000-0000-000000000001', 'SPECIES', '{"scientific_name": "Cirrhinus reba", "common_names": {"en": "Reba Carp"}, "category": "MINOR_CARP", "biological_parameters": {"temperature_celsius": {"min": 22.0, "max": 33.0}, "dissolved_oxygen_mg_l": {"min": 4.0, "max": null}, "ph_range": {"min": 6.5, "max": 8.5}, "salinity_tolerance_ppt": {"min": 0.0, "max": 3.0}}, "economic_parameters": {"feed_conversion_ratio": {"min": 1.8, "max": 2.5}, "expected_yield_mt_per_acre": {"min": 1.0, "max": 2.0}, "market_price_per_kg_inr": {"min": 60.0, "max": 90.0}, "survival_rate_percent": {"min": 75.0, "max": 80.0}}, "culture_period_months": {"min": 10.0, "max": 12.0}, "crops_per_year": {"min": 1.0, "max": null}, "notes": "Minor carp; warm water species; used to fill ecological niche in composite carp culture", "optimal_systems": ["POLYCULTURE_POND"]}'::jsonb);
    END IF;
END $$;


DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM knowledge_nodes WHERE id = 'cc3f6638-75bd-4216-b042-105986c9dd1f') THEN
        UPDATE knowledge_nodes
        SET data = data || '{"scientific_name": "Labeo bata", "common_names": {"en": "Bata Labeo"}, "category": "MINOR_CARP", "biological_parameters": {"temperature_celsius": {"min": 22.0, "max": 32.0}, "dissolved_oxygen_mg_l": {"min": 4.0, "max": null}, "ph_range": {"min": 6.5, "max": 8.5}, "salinity_tolerance_ppt": {"min": 0.0, "max": 3.0}}, "economic_parameters": {"feed_conversion_ratio": {"min": 1.8, "max": 2.5}, "expected_yield_mt_per_acre": {"min": 1.0, "max": 2.0}, "market_price_per_kg_inr": {"min": 60.0, "max": 90.0}, "survival_rate_percent": {"min": 75.0, "max": 80.0}}, "culture_period_months": {"min": 10.0, "max": 12.0}, "crops_per_year": {"min": 1.0, "max": null}, "notes": "Mid-water feeder; common in composite carp ponds of Bihar, WB, Assam", "optimal_systems": ["POLYCULTURE_POND"]}'::jsonb
        WHERE id = 'cc3f6638-75bd-4216-b042-105986c9dd1f';
    ELSE
        INSERT INTO knowledge_nodes (id, parent_id, node_type, data)
        VALUES ('cc3f6638-75bd-4216-b042-105986c9dd1f', '00000000-0000-0000-0000-000000000001', 'SPECIES', '{"scientific_name": "Labeo bata", "common_names": {"en": "Bata Labeo"}, "category": "MINOR_CARP", "biological_parameters": {"temperature_celsius": {"min": 22.0, "max": 32.0}, "dissolved_oxygen_mg_l": {"min": 4.0, "max": null}, "ph_range": {"min": 6.5, "max": 8.5}, "salinity_tolerance_ppt": {"min": 0.0, "max": 3.0}}, "economic_parameters": {"feed_conversion_ratio": {"min": 1.8, "max": 2.5}, "expected_yield_mt_per_acre": {"min": 1.0, "max": 2.0}, "market_price_per_kg_inr": {"min": 60.0, "max": 90.0}, "survival_rate_percent": {"min": 75.0, "max": 80.0}}, "culture_period_months": {"min": 10.0, "max": 12.0}, "crops_per_year": {"min": 1.0, "max": null}, "notes": "Mid-water feeder; common in composite carp ponds of Bihar, WB, Assam", "optimal_systems": ["POLYCULTURE_POND"]}'::jsonb);
    END IF;
END $$;


DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM knowledge_nodes WHERE id = 'b891399f-bb72-4c91-b362-dd1a4e5e5aad') THEN
        UPDATE knowledge_nodes
        SET data = data || '{"scientific_name": "Puntius sarana", "common_names": {"en": "Olive Barb / Sar Barb"}, "category": "MINOR_CARP", "biological_parameters": {"temperature_celsius": {"min": 22.0, "max": 30.0}, "dissolved_oxygen_mg_l": {"min": 4.0, "max": null}, "ph_range": {"min": 6.5, "max": 8.0}, "salinity_tolerance_ppt": {"min": 0.0, "max": 2.0}}, "economic_parameters": {"feed_conversion_ratio": {"min": 1.5, "max": 2.0}, "expected_yield_mt_per_acre": {"min": 0.5, "max": 1.5}, "market_price_per_kg_inr": {"min": 60.0, "max": 100.0}, "survival_rate_percent": {"min": 70.0, "max": 78.0}}, "culture_period_months": {"min": 8.0, "max": 10.0}, "crops_per_year": {"min": 1.0, "max": 2.0}, "notes": "Hardy, fast-growing minor carp; used as diversification species in ICAR trials", "optimal_systems": ["POLYCULTURE_POND"]}'::jsonb
        WHERE id = 'b891399f-bb72-4c91-b362-dd1a4e5e5aad';
    ELSE
        INSERT INTO knowledge_nodes (id, parent_id, node_type, data)
        VALUES ('b891399f-bb72-4c91-b362-dd1a4e5e5aad', '00000000-0000-0000-0000-000000000001', 'SPECIES', '{"scientific_name": "Puntius sarana", "common_names": {"en": "Olive Barb / Sar Barb"}, "category": "MINOR_CARP", "biological_parameters": {"temperature_celsius": {"min": 22.0, "max": 30.0}, "dissolved_oxygen_mg_l": {"min": 4.0, "max": null}, "ph_range": {"min": 6.5, "max": 8.0}, "salinity_tolerance_ppt": {"min": 0.0, "max": 2.0}}, "economic_parameters": {"feed_conversion_ratio": {"min": 1.5, "max": 2.0}, "expected_yield_mt_per_acre": {"min": 0.5, "max": 1.5}, "market_price_per_kg_inr": {"min": 60.0, "max": 100.0}, "survival_rate_percent": {"min": 70.0, "max": 78.0}}, "culture_period_months": {"min": 8.0, "max": 10.0}, "crops_per_year": {"min": 1.0, "max": 2.0}, "notes": "Hardy, fast-growing minor carp; used as diversification species in ICAR trials", "optimal_systems": ["POLYCULTURE_POND"]}'::jsonb);
    END IF;
END $$;


DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM knowledge_nodes WHERE id = 'ac5f49ff-dd73-480b-a4c9-7f8459a7ede0') THEN
        UPDATE knowledge_nodes
        SET data = data || '{"scientific_name": "Macrobrachium malcolmsonii", "common_names": {"en": "Monsoon River Prawn"}, "category": "MINOR_CARP", "biological_parameters": {"temperature_celsius": {"min": 25.0, "max": 31.0}, "dissolved_oxygen_mg_l": {"min": 4.0, "max": null}, "ph_range": {"min": 7.0, "max": 8.5}, "salinity_tolerance_ppt": {"min": 0.0, "max": 5.0}}, "economic_parameters": {"feed_conversion_ratio": {"min": 1.8, "max": 2.5}, "expected_yield_mt_per_acre": {"min": 0.8, "max": 1.5}, "market_price_per_kg_inr": {"min": 200.0, "max": 350.0}, "survival_rate_percent": {"min": 60.0, "max": 70.0}}, "culture_period_months": {"min": 8.0, "max": 10.0}, "crops_per_year": {"min": 1.0, "max": null}, "notes": "Second important freshwater prawn; larvae tolerate brackish; slower than M. rosenbergii", "optimal_systems": ["FRESHWATER_POND"]}'::jsonb
        WHERE id = 'ac5f49ff-dd73-480b-a4c9-7f8459a7ede0';
    ELSE
        INSERT INTO knowledge_nodes (id, parent_id, node_type, data)
        VALUES ('ac5f49ff-dd73-480b-a4c9-7f8459a7ede0', '00000000-0000-0000-0000-000000000001', 'SPECIES', '{"scientific_name": "Macrobrachium malcolmsonii", "common_names": {"en": "Monsoon River Prawn"}, "category": "MINOR_CARP", "biological_parameters": {"temperature_celsius": {"min": 25.0, "max": 31.0}, "dissolved_oxygen_mg_l": {"min": 4.0, "max": null}, "ph_range": {"min": 7.0, "max": 8.5}, "salinity_tolerance_ppt": {"min": 0.0, "max": 5.0}}, "economic_parameters": {"feed_conversion_ratio": {"min": 1.8, "max": 2.5}, "expected_yield_mt_per_acre": {"min": 0.8, "max": 1.5}, "market_price_per_kg_inr": {"min": 200.0, "max": 350.0}, "survival_rate_percent": {"min": 60.0, "max": 70.0}}, "culture_period_months": {"min": 8.0, "max": 10.0}, "crops_per_year": {"min": 1.0, "max": null}, "notes": "Second important freshwater prawn; larvae tolerate brackish; slower than M. rosenbergii", "optimal_systems": ["FRESHWATER_POND"]}'::jsonb);
    END IF;
END $$;


DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM knowledge_nodes WHERE id = '2c08a522-330e-40e2-ae4c-7d065686684c') THEN
        UPDATE knowledge_nodes
        SET data = data || '{"scientific_name": "Clarias magur / Clarias batrachus", "common_names": {"en": "Walking Catfish / Magur"}, "category": "CATFISH", "biological_parameters": {"temperature_celsius": {"min": 20.0, "max": 32.0}, "dissolved_oxygen_mg_l": {"min": 2.0, "max": null}, "ph_range": {"min": 6.5, "max": 8.0}, "salinity_tolerance_ppt": {"min": 0.0, "max": 3.0}}, "economic_parameters": {"feed_conversion_ratio": {"min": 1.2, "max": 1.8}, "expected_yield_mt_per_acre": {"min": 5.0, "max": 10.0}, "market_price_per_kg_inr": {"min": 150.0, "max": 250.0}, "survival_rate_percent": {"min": 85.0, "max": 92.0}}, "culture_period_months": {"min": 5.0, "max": 8.0}, "crops_per_year": {"min": 2.0, "max": 3.0}, "notes": "Air-breathing; survives drought; high medicinal value; dense stocking possible; banned in some states", "optimal_systems": ["POND", "BIOFLOC", "RAS"]}'::jsonb
        WHERE id = '2c08a522-330e-40e2-ae4c-7d065686684c';
    ELSE
        INSERT INTO knowledge_nodes (id, parent_id, node_type, data)
        VALUES ('2c08a522-330e-40e2-ae4c-7d065686684c', '00000000-0000-0000-0000-000000000001', 'SPECIES', '{"scientific_name": "Clarias magur / Clarias batrachus", "common_names": {"en": "Walking Catfish / Magur"}, "category": "CATFISH", "biological_parameters": {"temperature_celsius": {"min": 20.0, "max": 32.0}, "dissolved_oxygen_mg_l": {"min": 2.0, "max": null}, "ph_range": {"min": 6.5, "max": 8.0}, "salinity_tolerance_ppt": {"min": 0.0, "max": 3.0}}, "economic_parameters": {"feed_conversion_ratio": {"min": 1.2, "max": 1.8}, "expected_yield_mt_per_acre": {"min": 5.0, "max": 10.0}, "market_price_per_kg_inr": {"min": 150.0, "max": 250.0}, "survival_rate_percent": {"min": 85.0, "max": 92.0}}, "culture_period_months": {"min": 5.0, "max": 8.0}, "crops_per_year": {"min": 2.0, "max": 3.0}, "notes": "Air-breathing; survives drought; high medicinal value; dense stocking possible; banned in some states", "optimal_systems": ["POND", "BIOFLOC", "RAS"]}'::jsonb);
    END IF;
END $$;


DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM knowledge_nodes WHERE id = '45d55b13-449f-4d7a-8b86-16f2f65071a8') THEN
        UPDATE knowledge_nodes
        SET data = data || '{"scientific_name": "Heteropneustes fossilis", "common_names": {"en": "Stinging Catfish / Singhi"}, "category": "CATFISH", "biological_parameters": {"temperature_celsius": {"min": 20.0, "max": 32.0}, "dissolved_oxygen_mg_l": {"min": 2.0, "max": null}, "ph_range": {"min": 6.5, "max": 8.0}, "salinity_tolerance_ppt": {"min": 0.0, "max": 3.0}}, "economic_parameters": {"feed_conversion_ratio": {"min": 1.2, "max": 1.8}, "expected_yield_mt_per_acre": {"min": 3.0, "max": 7.0}, "market_price_per_kg_inr": {"min": 180.0, "max": 300.0}, "survival_rate_percent": {"min": 82.0, "max": 90.0}}, "culture_period_months": {"min": 5.0, "max": 8.0}, "crops_per_year": {"min": 2.0, "max": 3.0}, "notes": "Air-breathing; prized in Bihar, Bengal for medicinal use; very high demand; sting can cause injury", "optimal_systems": ["POND", "BIOFLOC"]}'::jsonb
        WHERE id = '45d55b13-449f-4d7a-8b86-16f2f65071a8';
    ELSE
        INSERT INTO knowledge_nodes (id, parent_id, node_type, data)
        VALUES ('45d55b13-449f-4d7a-8b86-16f2f65071a8', '00000000-0000-0000-0000-000000000001', 'SPECIES', '{"scientific_name": "Heteropneustes fossilis", "common_names": {"en": "Stinging Catfish / Singhi"}, "category": "CATFISH", "biological_parameters": {"temperature_celsius": {"min": 20.0, "max": 32.0}, "dissolved_oxygen_mg_l": {"min": 2.0, "max": null}, "ph_range": {"min": 6.5, "max": 8.0}, "salinity_tolerance_ppt": {"min": 0.0, "max": 3.0}}, "economic_parameters": {"feed_conversion_ratio": {"min": 1.2, "max": 1.8}, "expected_yield_mt_per_acre": {"min": 3.0, "max": 7.0}, "market_price_per_kg_inr": {"min": 180.0, "max": 300.0}, "survival_rate_percent": {"min": 82.0, "max": 90.0}}, "culture_period_months": {"min": 5.0, "max": 8.0}, "crops_per_year": {"min": 2.0, "max": 3.0}, "notes": "Air-breathing; prized in Bihar, Bengal for medicinal use; very high demand; sting can cause injury", "optimal_systems": ["POND", "BIOFLOC"]}'::jsonb);
    END IF;
END $$;


DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM knowledge_nodes WHERE id = '49dd8cec-7221-4b55-8cd8-3bafd51c70e9') THEN
        UPDATE knowledge_nodes
        SET data = data || '{"scientific_name": "Mystus seenghala (Sperata seenghala)", "common_names": {"en": "Giant River Catfish / Seenghala"}, "category": "CATFISH", "biological_parameters": {"temperature_celsius": {"min": 22.0, "max": 32.0}, "dissolved_oxygen_mg_l": {"min": 4.0, "max": null}, "ph_range": {"min": 6.5, "max": 8.5}, "salinity_tolerance_ppt": {"min": 0.0, "max": 2.0}}, "economic_parameters": {"feed_conversion_ratio": {"min": 1.8, "max": 2.5}, "expected_yield_mt_per_acre": {"min": 2.0, "max": 5.0}, "market_price_per_kg_inr": {"min": 150.0, "max": 250.0}, "survival_rate_percent": {"min": 65.0, "max": 75.0}}, "culture_period_months": {"min": 8.0, "max": 12.0}, "crops_per_year": {"min": 1.0, "max": null}, "notes": "Large predatory catfish; culture gaining interest; high local market price; ICAR-CIFA research", "optimal_systems": ["POND"]}'::jsonb
        WHERE id = '49dd8cec-7221-4b55-8cd8-3bafd51c70e9';
    ELSE
        INSERT INTO knowledge_nodes (id, parent_id, node_type, data)
        VALUES ('49dd8cec-7221-4b55-8cd8-3bafd51c70e9', '00000000-0000-0000-0000-000000000001', 'SPECIES', '{"scientific_name": "Mystus seenghala (Sperata seenghala)", "common_names": {"en": "Giant River Catfish / Seenghala"}, "category": "CATFISH", "biological_parameters": {"temperature_celsius": {"min": 22.0, "max": 32.0}, "dissolved_oxygen_mg_l": {"min": 4.0, "max": null}, "ph_range": {"min": 6.5, "max": 8.5}, "salinity_tolerance_ppt": {"min": 0.0, "max": 2.0}}, "economic_parameters": {"feed_conversion_ratio": {"min": 1.8, "max": 2.5}, "expected_yield_mt_per_acre": {"min": 2.0, "max": 5.0}, "market_price_per_kg_inr": {"min": 150.0, "max": 250.0}, "survival_rate_percent": {"min": 65.0, "max": 75.0}}, "culture_period_months": {"min": 8.0, "max": 12.0}, "crops_per_year": {"min": 1.0, "max": null}, "notes": "Large predatory catfish; culture gaining interest; high local market price; ICAR-CIFA research", "optimal_systems": ["POND"]}'::jsonb);
    END IF;
END $$;


DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM knowledge_nodes WHERE id = '732ac9be-4083-493f-827f-48940add9bb4') THEN
        UPDATE knowledge_nodes
        SET data = data || '{"scientific_name": "Ompok pabda", "common_names": {"en": "Pabda / Butter Catfish"}, "category": "CATFISH", "biological_parameters": {"temperature_celsius": {"min": 22.0, "max": 30.0}, "dissolved_oxygen_mg_l": {"min": 3.0, "max": null}, "ph_range": {"min": 6.5, "max": 8.0}, "salinity_tolerance_ppt": {"min": 0.0, "max": 2.0}}, "economic_parameters": {"feed_conversion_ratio": {"min": 1.5, "max": 2.0}, "expected_yield_mt_per_acre": {"min": 2.0, "max": 5.0}, "market_price_per_kg_inr": {"min": 200.0, "max": 400.0}, "survival_rate_percent": {"min": 75.0, "max": 85.0}}, "culture_period_months": {"min": 5.0, "max": 7.0}, "crops_per_year": {"min": 2.0, "max": null}, "notes": "High-value small catfish; prized Bengali delicacy; 40\u2013100g harvest weight; threatened in wild", "optimal_systems": ["POND", "BIOFLOC"]}'::jsonb
        WHERE id = '732ac9be-4083-493f-827f-48940add9bb4';
    ELSE
        INSERT INTO knowledge_nodes (id, parent_id, node_type, data)
        VALUES ('732ac9be-4083-493f-827f-48940add9bb4', '00000000-0000-0000-0000-000000000001', 'SPECIES', '{"scientific_name": "Ompok pabda", "common_names": {"en": "Pabda / Butter Catfish"}, "category": "CATFISH", "biological_parameters": {"temperature_celsius": {"min": 22.0, "max": 30.0}, "dissolved_oxygen_mg_l": {"min": 3.0, "max": null}, "ph_range": {"min": 6.5, "max": 8.0}, "salinity_tolerance_ppt": {"min": 0.0, "max": 2.0}}, "economic_parameters": {"feed_conversion_ratio": {"min": 1.5, "max": 2.0}, "expected_yield_mt_per_acre": {"min": 2.0, "max": 5.0}, "market_price_per_kg_inr": {"min": 200.0, "max": 400.0}, "survival_rate_percent": {"min": 75.0, "max": 85.0}}, "culture_period_months": {"min": 5.0, "max": 7.0}, "crops_per_year": {"min": 2.0, "max": null}, "notes": "High-value small catfish; prized Bengali delicacy; 40\u2013100g harvest weight; threatened in wild", "optimal_systems": ["POND", "BIOFLOC"]}'::jsonb);
    END IF;
END $$;


DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM knowledge_nodes WHERE id = '22222222-2222-2222-2222-222222222222') THEN
        UPDATE knowledge_nodes
        SET data = data || '{"scientific_name": "Pangasionodon hypophthalmus", "common_names": {"en": "Pangasius / Basa"}, "category": "CATFISH", "biological_parameters": {"temperature_celsius": {"min": 25.0, "max": 32.0}, "dissolved_oxygen_mg_l": {"min": 3.0, "max": null}, "ph_range": {"min": 6.5, "max": 8.0}, "salinity_tolerance_ppt": {"min": 0.0, "max": 3.0}}, "economic_parameters": {"feed_conversion_ratio": {"min": 1.5, "max": 1.8}, "expected_yield_mt_per_acre": {"min": 10.0, "max": 15.0}, "market_price_per_kg_inr": {"min": 130.0, "max": 200.0}, "survival_rate_percent": {"min": 82.0, "max": 90.0}}, "culture_period_months": {"min": 6.0, "max": 10.0}, "crops_per_year": {"min": 1.0, "max": 2.0}, "notes": "FCR 1.5\u20131.8; excellent growth; 800g\u20131kg in 8 months; MPEDA 152,599 MT in 2023-24", "optimal_systems": ["INTENSIVE_POND", "CAGE"]}'::jsonb
        WHERE id = '22222222-2222-2222-2222-222222222222';
    ELSE
        INSERT INTO knowledge_nodes (id, parent_id, node_type, data)
        VALUES ('22222222-2222-2222-2222-222222222222', '00000000-0000-0000-0000-000000000001', 'SPECIES', '{"scientific_name": "Pangasionodon hypophthalmus", "common_names": {"en": "Pangasius / Basa"}, "category": "CATFISH", "biological_parameters": {"temperature_celsius": {"min": 25.0, "max": 32.0}, "dissolved_oxygen_mg_l": {"min": 3.0, "max": null}, "ph_range": {"min": 6.5, "max": 8.0}, "salinity_tolerance_ppt": {"min": 0.0, "max": 3.0}}, "economic_parameters": {"feed_conversion_ratio": {"min": 1.5, "max": 1.8}, "expected_yield_mt_per_acre": {"min": 10.0, "max": 15.0}, "market_price_per_kg_inr": {"min": 130.0, "max": 200.0}, "survival_rate_percent": {"min": 82.0, "max": 90.0}}, "culture_period_months": {"min": 6.0, "max": 10.0}, "crops_per_year": {"min": 1.0, "max": 2.0}, "notes": "FCR 1.5\u20131.8; excellent growth; 800g\u20131kg in 8 months; MPEDA 152,599 MT in 2023-24", "optimal_systems": ["INTENSIVE_POND", "CAGE"]}'::jsonb);
    END IF;
END $$;


DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM knowledge_nodes WHERE id = 'f623d2e6-c765-4c9a-a8b1-8f3a7a095ad7') THEN
        UPDATE knowledge_nodes
        SET data = data || '{"scientific_name": "Mystus tengara", "common_names": {"en": "Tengra Catfish"}, "category": "CATFISH", "biological_parameters": {"temperature_celsius": {"min": 22.0, "max": 30.0}, "dissolved_oxygen_mg_l": {"min": 3.0, "max": null}, "ph_range": {"min": 6.5, "max": 8.0}, "salinity_tolerance_ppt": {"min": 0.0, "max": 2.0}}, "economic_parameters": {"feed_conversion_ratio": {"min": 1.5, "max": 2.2}, "expected_yield_mt_per_acre": {"min": 1.0, "max": 3.0}, "market_price_per_kg_inr": {"min": 120.0, "max": 200.0}, "survival_rate_percent": {"min": 70.0, "max": 80.0}}, "culture_period_months": {"min": 5.0, "max": 7.0}, "crops_per_year": {"min": 2.0, "max": null}, "notes": "Small-sized catfish; extremely popular in Bengal, Bihar kitchens; culture interest growing", "optimal_systems": ["POND", "BIOFLOC"]}'::jsonb
        WHERE id = 'f623d2e6-c765-4c9a-a8b1-8f3a7a095ad7';
    ELSE
        INSERT INTO knowledge_nodes (id, parent_id, node_type, data)
        VALUES ('f623d2e6-c765-4c9a-a8b1-8f3a7a095ad7', '00000000-0000-0000-0000-000000000001', 'SPECIES', '{"scientific_name": "Mystus tengara", "common_names": {"en": "Tengra Catfish"}, "category": "CATFISH", "biological_parameters": {"temperature_celsius": {"min": 22.0, "max": 30.0}, "dissolved_oxygen_mg_l": {"min": 3.0, "max": null}, "ph_range": {"min": 6.5, "max": 8.0}, "salinity_tolerance_ppt": {"min": 0.0, "max": 2.0}}, "economic_parameters": {"feed_conversion_ratio": {"min": 1.5, "max": 2.2}, "expected_yield_mt_per_acre": {"min": 1.0, "max": 3.0}, "market_price_per_kg_inr": {"min": 120.0, "max": 200.0}, "survival_rate_percent": {"min": 70.0, "max": 80.0}}, "culture_period_months": {"min": 5.0, "max": 7.0}, "crops_per_year": {"min": 2.0, "max": null}, "notes": "Small-sized catfish; extremely popular in Bengal, Bihar kitchens; culture interest growing", "optimal_systems": ["POND", "BIOFLOC"]}'::jsonb);
    END IF;
END $$;


DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM knowledge_nodes WHERE id = 'b31039d0-6403-4764-920f-20e0d841fe00') THEN
        UPDATE knowledge_nodes
        SET data = data || '{"scientific_name": "Channa striata", "common_names": {"en": "Striped Murrel / Saal"}, "category": "MURREL_/_SNAKEHEAD", "biological_parameters": {"temperature_celsius": {"min": 22.0, "max": 35.0}, "dissolved_oxygen_mg_l": {"min": 2.0, "max": null}, "ph_range": {"min": 6.0, "max": 8.5}, "salinity_tolerance_ppt": {"min": 0.0, "max": 3.0}}, "economic_parameters": {"feed_conversion_ratio": {"min": 1.5, "max": 2.5}, "expected_yield_mt_per_acre": {"min": 4.0, "max": 8.0}, "market_price_per_kg_inr": {"min": 200.0, "max": 350.0}, "survival_rate_percent": {"min": 75.0, "max": 85.0}}, "culture_period_months": {"min": 6.0, "max": 10.0}, "crops_per_year": {"min": 1.0, "max": 2.0}, "notes": "Air-breathing; highly drought-tolerant; NFDB promotes culture; high-value in South India", "optimal_systems": ["POND", "BIOFLOC"]}'::jsonb
        WHERE id = 'b31039d0-6403-4764-920f-20e0d841fe00';
    ELSE
        INSERT INTO knowledge_nodes (id, parent_id, node_type, data)
        VALUES ('b31039d0-6403-4764-920f-20e0d841fe00', '00000000-0000-0000-0000-000000000001', 'SPECIES', '{"scientific_name": "Channa striata", "common_names": {"en": "Striped Murrel / Saal"}, "category": "MURREL_/_SNAKEHEAD", "biological_parameters": {"temperature_celsius": {"min": 22.0, "max": 35.0}, "dissolved_oxygen_mg_l": {"min": 2.0, "max": null}, "ph_range": {"min": 6.0, "max": 8.5}, "salinity_tolerance_ppt": {"min": 0.0, "max": 3.0}}, "economic_parameters": {"feed_conversion_ratio": {"min": 1.5, "max": 2.5}, "expected_yield_mt_per_acre": {"min": 4.0, "max": 8.0}, "market_price_per_kg_inr": {"min": 200.0, "max": 350.0}, "survival_rate_percent": {"min": 75.0, "max": 85.0}}, "culture_period_months": {"min": 6.0, "max": 10.0}, "crops_per_year": {"min": 1.0, "max": 2.0}, "notes": "Air-breathing; highly drought-tolerant; NFDB promotes culture; high-value in South India", "optimal_systems": ["POND", "BIOFLOC"]}'::jsonb);
    END IF;
END $$;


DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM knowledge_nodes WHERE id = '027dde50-77fc-4d6f-b34f-b524208e986e') THEN
        UPDATE knowledge_nodes
        SET data = data || '{"scientific_name": "Channa marulius", "common_names": {"en": "Giant Murrel / Great Snakehead"}, "category": "MURREL_/_SNAKEHEAD", "biological_parameters": {"temperature_celsius": {"min": 22.0, "max": 34.0}, "dissolved_oxygen_mg_l": {"min": 2.0, "max": null}, "ph_range": {"min": 6.0, "max": 8.0}, "salinity_tolerance_ppt": {"min": 0.0, "max": 2.0}}, "economic_parameters": {"feed_conversion_ratio": {"min": 2.0, "max": 3.0}, "expected_yield_mt_per_acre": {"min": 3.0, "max": 5.0}, "market_price_per_kg_inr": {"min": 250.0, "max": 500.0}, "survival_rate_percent": {"min": 65.0, "max": 75.0}}, "culture_period_months": {"min": 10.0, "max": 12.0}, "crops_per_year": {"min": 1.0, "max": null}, "notes": "Largest murrel species; can reach 2 kg+; predatory; premium price; limited large-scale culture", "optimal_systems": ["POND"]}'::jsonb
        WHERE id = '027dde50-77fc-4d6f-b34f-b524208e986e';
    ELSE
        INSERT INTO knowledge_nodes (id, parent_id, node_type, data)
        VALUES ('027dde50-77fc-4d6f-b34f-b524208e986e', '00000000-0000-0000-0000-000000000001', 'SPECIES', '{"scientific_name": "Channa marulius", "common_names": {"en": "Giant Murrel / Great Snakehead"}, "category": "MURREL_/_SNAKEHEAD", "biological_parameters": {"temperature_celsius": {"min": 22.0, "max": 34.0}, "dissolved_oxygen_mg_l": {"min": 2.0, "max": null}, "ph_range": {"min": 6.0, "max": 8.0}, "salinity_tolerance_ppt": {"min": 0.0, "max": 2.0}}, "economic_parameters": {"feed_conversion_ratio": {"min": 2.0, "max": 3.0}, "expected_yield_mt_per_acre": {"min": 3.0, "max": 5.0}, "market_price_per_kg_inr": {"min": 250.0, "max": 500.0}, "survival_rate_percent": {"min": 65.0, "max": 75.0}}, "culture_period_months": {"min": 10.0, "max": 12.0}, "crops_per_year": {"min": 1.0, "max": null}, "notes": "Largest murrel species; can reach 2 kg+; predatory; premium price; limited large-scale culture", "optimal_systems": ["POND"]}'::jsonb);
    END IF;
END $$;


DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM knowledge_nodes WHERE id = 'c31ca408-85cf-42fe-8ce9-b01a3fb3cebb') THEN
        UPDATE knowledge_nodes
        SET data = data || '{"scientific_name": "Channa punctata", "common_names": {"en": "Spotted Snakehead"}, "category": "MURREL_/_SNAKEHEAD", "biological_parameters": {"temperature_celsius": {"min": 20.0, "max": 35.0}, "dissolved_oxygen_mg_l": {"min": 2.0, "max": null}, "ph_range": {"min": 6.0, "max": 8.5}, "salinity_tolerance_ppt": {"min": 0.0, "max": 3.0}}, "economic_parameters": {"feed_conversion_ratio": {"min": 1.5, "max": 2.5}, "expected_yield_mt_per_acre": {"min": 2.0, "max": 4.0}, "market_price_per_kg_inr": {"min": 150.0, "max": 280.0}, "survival_rate_percent": {"min": 72.0, "max": 82.0}}, "culture_period_months": {"min": 5.0, "max": 8.0}, "crops_per_year": {"min": 2.0, "max": null}, "notes": "Hardy; air-breathing; fast growth to 160g in 8 months; good for paddy-cum-fish culture", "optimal_systems": ["POND", "BIOFLOC"]}'::jsonb
        WHERE id = 'c31ca408-85cf-42fe-8ce9-b01a3fb3cebb';
    ELSE
        INSERT INTO knowledge_nodes (id, parent_id, node_type, data)
        VALUES ('c31ca408-85cf-42fe-8ce9-b01a3fb3cebb', '00000000-0000-0000-0000-000000000001', 'SPECIES', '{"scientific_name": "Channa punctata", "common_names": {"en": "Spotted Snakehead"}, "category": "MURREL_/_SNAKEHEAD", "biological_parameters": {"temperature_celsius": {"min": 20.0, "max": 35.0}, "dissolved_oxygen_mg_l": {"min": 2.0, "max": null}, "ph_range": {"min": 6.0, "max": 8.5}, "salinity_tolerance_ppt": {"min": 0.0, "max": 3.0}}, "economic_parameters": {"feed_conversion_ratio": {"min": 1.5, "max": 2.5}, "expected_yield_mt_per_acre": {"min": 2.0, "max": 4.0}, "market_price_per_kg_inr": {"min": 150.0, "max": 280.0}, "survival_rate_percent": {"min": 72.0, "max": 82.0}}, "culture_period_months": {"min": 5.0, "max": 8.0}, "crops_per_year": {"min": 2.0, "max": null}, "notes": "Hardy; air-breathing; fast growth to 160g in 8 months; good for paddy-cum-fish culture", "optimal_systems": ["POND", "BIOFLOC"]}'::jsonb);
    END IF;
END $$;


DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM knowledge_nodes WHERE id = 'bcd65b41-e496-4ba5-bc62-e003d301dcd3') THEN
        UPDATE knowledge_nodes
        SET data = data || '{"scientific_name": "Cyprinus carpio", "common_names": {"en": "Common Carp"}, "category": "EXOTIC_CARP", "biological_parameters": {"temperature_celsius": {"min": 15.0, "max": 30.0}, "dissolved_oxygen_mg_l": {"min": 4.0, "max": null}, "ph_range": {"min": 6.5, "max": 9.0}, "salinity_tolerance_ppt": {"min": 0.0, "max": 5.0}}, "economic_parameters": {"feed_conversion_ratio": {"min": 1.5, "max": 2.2}, "expected_yield_mt_per_acre": {"min": 3.0, "max": 6.0}, "market_price_per_kg_inr": {"min": 80.0, "max": 130.0}, "survival_rate_percent": {"min": 75.0, "max": 85.0}}, "culture_period_months": {"min": 6.0, "max": 10.0}, "crops_per_year": {"min": 2.0, "max": null}, "notes": "Wide temp tolerance; adaptable; 3 varieties: Scale, Mirror, Leather; introduced from China", "optimal_systems": ["POND", "BIOFLOC", "RAS"]}'::jsonb
        WHERE id = 'bcd65b41-e496-4ba5-bc62-e003d301dcd3';
    ELSE
        INSERT INTO knowledge_nodes (id, parent_id, node_type, data)
        VALUES ('bcd65b41-e496-4ba5-bc62-e003d301dcd3', '00000000-0000-0000-0000-000000000001', 'SPECIES', '{"scientific_name": "Cyprinus carpio", "common_names": {"en": "Common Carp"}, "category": "EXOTIC_CARP", "biological_parameters": {"temperature_celsius": {"min": 15.0, "max": 30.0}, "dissolved_oxygen_mg_l": {"min": 4.0, "max": null}, "ph_range": {"min": 6.5, "max": 9.0}, "salinity_tolerance_ppt": {"min": 0.0, "max": 5.0}}, "economic_parameters": {"feed_conversion_ratio": {"min": 1.5, "max": 2.2}, "expected_yield_mt_per_acre": {"min": 3.0, "max": 6.0}, "market_price_per_kg_inr": {"min": 80.0, "max": 130.0}, "survival_rate_percent": {"min": 75.0, "max": 85.0}}, "culture_period_months": {"min": 6.0, "max": 10.0}, "crops_per_year": {"min": 2.0, "max": null}, "notes": "Wide temp tolerance; adaptable; 3 varieties: Scale, Mirror, Leather; introduced from China", "optimal_systems": ["POND", "BIOFLOC", "RAS"]}'::jsonb);
    END IF;
END $$;


DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM knowledge_nodes WHERE id = '1e48f4ab-2e30-4a60-b49b-3cfdab0ea7f2') THEN
        UPDATE knowledge_nodes
        SET data = data || '{"scientific_name": "Hypophthalmichthys molitrix", "common_names": {"en": "Silver Carp"}, "category": "EXOTIC_CARP", "biological_parameters": {"temperature_celsius": {"min": 18.0, "max": 32.0}, "dissolved_oxygen_mg_l": {"min": 4.0, "max": null}, "ph_range": {"min": 6.5, "max": 8.5}, "salinity_tolerance_ppt": {"min": 0.0, "max": 3.0}}, "economic_parameters": {"feed_conversion_ratio": {"min": 1.5, "max": 2.0}, "expected_yield_mt_per_acre": {"min": 3.0, "max": 6.0}, "market_price_per_kg_inr": {"min": 60.0, "max": 90.0}, "survival_rate_percent": {"min": 78.0, "max": 85.0}}, "culture_period_months": {"min": 8.0, "max": 12.0}, "crops_per_year": {"min": 1.0, "max": null}, "notes": "Filter feeder; surface feeder; reduces algal bloom; essential in 5-species polyculture; HK origin", "optimal_systems": ["POLYCULTURE_POND"]}'::jsonb
        WHERE id = '1e48f4ab-2e30-4a60-b49b-3cfdab0ea7f2';
    ELSE
        INSERT INTO knowledge_nodes (id, parent_id, node_type, data)
        VALUES ('1e48f4ab-2e30-4a60-b49b-3cfdab0ea7f2', '00000000-0000-0000-0000-000000000001', 'SPECIES', '{"scientific_name": "Hypophthalmichthys molitrix", "common_names": {"en": "Silver Carp"}, "category": "EXOTIC_CARP", "biological_parameters": {"temperature_celsius": {"min": 18.0, "max": 32.0}, "dissolved_oxygen_mg_l": {"min": 4.0, "max": null}, "ph_range": {"min": 6.5, "max": 8.5}, "salinity_tolerance_ppt": {"min": 0.0, "max": 3.0}}, "economic_parameters": {"feed_conversion_ratio": {"min": 1.5, "max": 2.0}, "expected_yield_mt_per_acre": {"min": 3.0, "max": 6.0}, "market_price_per_kg_inr": {"min": 60.0, "max": 90.0}, "survival_rate_percent": {"min": 78.0, "max": 85.0}}, "culture_period_months": {"min": 8.0, "max": 12.0}, "crops_per_year": {"min": 1.0, "max": null}, "notes": "Filter feeder; surface feeder; reduces algal bloom; essential in 5-species polyculture; HK origin", "optimal_systems": ["POLYCULTURE_POND"]}'::jsonb);
    END IF;
END $$;


DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM knowledge_nodes WHERE id = '456ae84f-d913-4215-bbf3-c64df00bde06') THEN
        UPDATE knowledge_nodes
        SET data = data || '{"scientific_name": "Aristichthys nobilis", "common_names": {"en": "Bighead Carp"}, "category": "EXOTIC_CARP", "biological_parameters": {"temperature_celsius": {"min": 18.0, "max": 32.0}, "dissolved_oxygen_mg_l": {"min": 4.0, "max": null}, "ph_range": {"min": 6.5, "max": 8.5}, "salinity_tolerance_ppt": {"min": 0.0, "max": 3.0}}, "economic_parameters": {"feed_conversion_ratio": {"min": 1.5, "max": 2.0}, "expected_yield_mt_per_acre": {"min": 2.0, "max": 4.0}, "market_price_per_kg_inr": {"min": 60.0, "max": 90.0}, "survival_rate_percent": {"min": 78.0, "max": 85.0}}, "culture_period_months": {"min": 8.0, "max": 12.0}, "crops_per_year": {"min": 1.0, "max": null}, "notes": "Zooplankton filter feeder; complements Silver Carp in polyculture; mid-water niche", "optimal_systems": ["POLYCULTURE_POND"]}'::jsonb
        WHERE id = '456ae84f-d913-4215-bbf3-c64df00bde06';
    ELSE
        INSERT INTO knowledge_nodes (id, parent_id, node_type, data)
        VALUES ('456ae84f-d913-4215-bbf3-c64df00bde06', '00000000-0000-0000-0000-000000000001', 'SPECIES', '{"scientific_name": "Aristichthys nobilis", "common_names": {"en": "Bighead Carp"}, "category": "EXOTIC_CARP", "biological_parameters": {"temperature_celsius": {"min": 18.0, "max": 32.0}, "dissolved_oxygen_mg_l": {"min": 4.0, "max": null}, "ph_range": {"min": 6.5, "max": 8.5}, "salinity_tolerance_ppt": {"min": 0.0, "max": 3.0}}, "economic_parameters": {"feed_conversion_ratio": {"min": 1.5, "max": 2.0}, "expected_yield_mt_per_acre": {"min": 2.0, "max": 4.0}, "market_price_per_kg_inr": {"min": 60.0, "max": 90.0}, "survival_rate_percent": {"min": 78.0, "max": 85.0}}, "culture_period_months": {"min": 8.0, "max": 12.0}, "crops_per_year": {"min": 1.0, "max": null}, "notes": "Zooplankton filter feeder; complements Silver Carp in polyculture; mid-water niche", "optimal_systems": ["POLYCULTURE_POND"]}'::jsonb);
    END IF;
END $$;


DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM knowledge_nodes WHERE id = '8759f405-2ab3-42d8-a5dd-fab00c5fe012') THEN
        UPDATE knowledge_nodes
        SET data = data || '{"scientific_name": "Ctenopharyngodon idella", "common_names": {"en": "Grass Carp"}, "category": "EXOTIC_CARP", "biological_parameters": {"temperature_celsius": {"min": 15.0, "max": 30.0}, "dissolved_oxygen_mg_l": {"min": 4.0, "max": null}, "ph_range": {"min": 6.5, "max": 8.5}, "salinity_tolerance_ppt": {"min": 0.0, "max": 5.0}}, "economic_parameters": {"feed_conversion_ratio": {"min": 2.0, "max": 3.0}, "expected_yield_mt_per_acre": {"min": 2.0, "max": 4.0}, "market_price_per_kg_inr": {"min": 70.0, "max": 100.0}, "survival_rate_percent": {"min": 78.0, "max": 85.0}}, "culture_period_months": {"min": 8.0, "max": 12.0}, "crops_per_year": {"min": 1.0, "max": null}, "notes": "Herbivore; weed biocontrol; macrophyte feeder; wide temp tolerance; introduced from China", "optimal_systems": ["POLYCULTURE_POND", "RESERVOIR"]}'::jsonb
        WHERE id = '8759f405-2ab3-42d8-a5dd-fab00c5fe012';
    ELSE
        INSERT INTO knowledge_nodes (id, parent_id, node_type, data)
        VALUES ('8759f405-2ab3-42d8-a5dd-fab00c5fe012', '00000000-0000-0000-0000-000000000001', 'SPECIES', '{"scientific_name": "Ctenopharyngodon idella", "common_names": {"en": "Grass Carp"}, "category": "EXOTIC_CARP", "biological_parameters": {"temperature_celsius": {"min": 15.0, "max": 30.0}, "dissolved_oxygen_mg_l": {"min": 4.0, "max": null}, "ph_range": {"min": 6.5, "max": 8.5}, "salinity_tolerance_ppt": {"min": 0.0, "max": 5.0}}, "economic_parameters": {"feed_conversion_ratio": {"min": 2.0, "max": 3.0}, "expected_yield_mt_per_acre": {"min": 2.0, "max": 4.0}, "market_price_per_kg_inr": {"min": 70.0, "max": 100.0}, "survival_rate_percent": {"min": 78.0, "max": 85.0}}, "culture_period_months": {"min": 8.0, "max": 12.0}, "crops_per_year": {"min": 1.0, "max": null}, "notes": "Herbivore; weed biocontrol; macrophyte feeder; wide temp tolerance; introduced from China", "optimal_systems": ["POLYCULTURE_POND", "RESERVOIR"]}'::jsonb);
    END IF;
END $$;


DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM knowledge_nodes WHERE id = '55555555-5555-5555-5555-555555555555') THEN
        UPDATE knowledge_nodes
        SET data = data || '{"scientific_name": "Oreochromis niloticus", "common_names": {"en": "GIFT Tilapia / Nile Tilapia"}, "category": "EXOTIC_CARP", "biological_parameters": {"temperature_celsius": {"min": 20.0, "max": 35.0}, "dissolved_oxygen_mg_l": {"min": 4.0, "max": null}, "ph_range": {"min": 6.5, "max": 8.5}, "salinity_tolerance_ppt": {"min": 0.0, "max": 10.0}}, "economic_parameters": {"feed_conversion_ratio": {"min": 1.6, "max": 2.2}, "expected_yield_mt_per_acre": {"min": 4.0, "max": 8.0}, "market_price_per_kg_inr": {"min": 120.0, "max": 200.0}, "survival_rate_percent": {"min": 82.0, "max": 90.0}}, "culture_period_months": {"min": 4.0, "max": 6.0}, "crops_per_year": {"min": 2.0, "max": 3.0}, "notes": "Optimal 28\u201330\u00b0C; tolerates brackish up to 10 ppt; monosex required; TiPV disease risk 2023", "optimal_systems": ["POND", "BIOFLOC", "CAGE"]}'::jsonb
        WHERE id = '55555555-5555-5555-5555-555555555555';
    ELSE
        INSERT INTO knowledge_nodes (id, parent_id, node_type, data)
        VALUES ('55555555-5555-5555-5555-555555555555', '00000000-0000-0000-0000-000000000001', 'SPECIES', '{"scientific_name": "Oreochromis niloticus", "common_names": {"en": "GIFT Tilapia / Nile Tilapia"}, "category": "EXOTIC_CARP", "biological_parameters": {"temperature_celsius": {"min": 20.0, "max": 35.0}, "dissolved_oxygen_mg_l": {"min": 4.0, "max": null}, "ph_range": {"min": 6.5, "max": 8.5}, "salinity_tolerance_ppt": {"min": 0.0, "max": 10.0}}, "economic_parameters": {"feed_conversion_ratio": {"min": 1.6, "max": 2.2}, "expected_yield_mt_per_acre": {"min": 4.0, "max": 8.0}, "market_price_per_kg_inr": {"min": 120.0, "max": 200.0}, "survival_rate_percent": {"min": 82.0, "max": 90.0}}, "culture_period_months": {"min": 4.0, "max": 6.0}, "crops_per_year": {"min": 2.0, "max": 3.0}, "notes": "Optimal 28\u201330\u00b0C; tolerates brackish up to 10 ppt; monosex required; TiPV disease risk 2023", "optimal_systems": ["POND", "BIOFLOC", "CAGE"]}'::jsonb);
    END IF;
END $$;


DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM knowledge_nodes WHERE id = '7f9df14c-8749-44da-816b-424f232d1087') THEN
        UPDATE knowledge_nodes
        SET data = data || '{"scientific_name": "Litopenaeus vannamei", "common_names": {"en": "Vannamei / White-leg Shrimp"}, "category": "SHRIMP_/_PRAWN", "biological_parameters": {"temperature_celsius": {"min": 23.0, "max": 30.0}, "dissolved_oxygen_mg_l": {"min": 5.0, "max": null}, "ph_range": {"min": 7.5, "max": 8.5}, "salinity_tolerance_ppt": {"min": 5.0, "max": 30.0}}, "economic_parameters": {"feed_conversion_ratio": {"min": 1.2, "max": 1.6}, "expected_yield_mt_per_acre": {"min": 4.0, "max": 8.0}, "market_price_per_kg_inr": {"min": 350.0, "max": 500.0}, "survival_rate_percent": {"min": 70.0, "max": 80.0}}, "culture_period_months": {"min": 4.0, "max": 5.0}, "crops_per_year": {"min": 2.0, "max": 3.0}, "notes": "Optimal 27\u201328\u00b0C; isosmotic at 10\u201315 ppt; SPF seeds; CAA license; India #1 export shrimp", "optimal_systems": ["BRACKISH_POND_(HDPE)", "BIOFLOC"]}'::jsonb
        WHERE id = '7f9df14c-8749-44da-816b-424f232d1087';
    ELSE
        INSERT INTO knowledge_nodes (id, parent_id, node_type, data)
        VALUES ('7f9df14c-8749-44da-816b-424f232d1087', '00000000-0000-0000-0000-000000000001', 'SPECIES', '{"scientific_name": "Litopenaeus vannamei", "common_names": {"en": "Vannamei / White-leg Shrimp"}, "category": "SHRIMP_/_PRAWN", "biological_parameters": {"temperature_celsius": {"min": 23.0, "max": 30.0}, "dissolved_oxygen_mg_l": {"min": 5.0, "max": null}, "ph_range": {"min": 7.5, "max": 8.5}, "salinity_tolerance_ppt": {"min": 5.0, "max": 30.0}}, "economic_parameters": {"feed_conversion_ratio": {"min": 1.2, "max": 1.6}, "expected_yield_mt_per_acre": {"min": 4.0, "max": 8.0}, "market_price_per_kg_inr": {"min": 350.0, "max": 500.0}, "survival_rate_percent": {"min": 70.0, "max": 80.0}}, "culture_period_months": {"min": 4.0, "max": 5.0}, "crops_per_year": {"min": 2.0, "max": 3.0}, "notes": "Optimal 27\u201328\u00b0C; isosmotic at 10\u201315 ppt; SPF seeds; CAA license; India #1 export shrimp", "optimal_systems": ["BRACKISH_POND_(HDPE)", "BIOFLOC"]}'::jsonb);
    END IF;
END $$;


DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM knowledge_nodes WHERE id = '33333333-3333-3333-3333-333333333334') THEN
        UPDATE knowledge_nodes
        SET data = data || '{"scientific_name": "Penaeus monodon", "common_names": {"en": "Black Tiger Shrimp / Bagda"}, "category": "SHRIMP_/_PRAWN", "biological_parameters": {"temperature_celsius": {"min": 25.0, "max": 32.0}, "dissolved_oxygen_mg_l": {"min": 5.0, "max": null}, "ph_range": {"min": 7.5, "max": 8.5}, "salinity_tolerance_ppt": {"min": 10.0, "max": 30.0}}, "economic_parameters": {"feed_conversion_ratio": {"min": 1.5, "max": 2.0}, "expected_yield_mt_per_acre": {"min": 3.0, "max": 5.0}, "market_price_per_kg_inr": {"min": 400.0, "max": 700.0}, "survival_rate_percent": {"min": 60.0, "max": 72.0}}, "culture_period_months": {"min": 4.0, "max": 6.0}, "crops_per_year": {"min": 2.0, "max": null}, "notes": "Requires higher salinity than vannamei; less disease-resistant; premium export price; CAA required", "optimal_systems": ["BRACKISH_POND", "SEMI-INTENSIVE"]}'::jsonb
        WHERE id = '33333333-3333-3333-3333-333333333334';
    ELSE
        INSERT INTO knowledge_nodes (id, parent_id, node_type, data)
        VALUES ('33333333-3333-3333-3333-333333333334', '00000000-0000-0000-0000-000000000001', 'SPECIES', '{"scientific_name": "Penaeus monodon", "common_names": {"en": "Black Tiger Shrimp / Bagda"}, "category": "SHRIMP_/_PRAWN", "biological_parameters": {"temperature_celsius": {"min": 25.0, "max": 32.0}, "dissolved_oxygen_mg_l": {"min": 5.0, "max": null}, "ph_range": {"min": 7.5, "max": 8.5}, "salinity_tolerance_ppt": {"min": 10.0, "max": 30.0}}, "economic_parameters": {"feed_conversion_ratio": {"min": 1.5, "max": 2.0}, "expected_yield_mt_per_acre": {"min": 3.0, "max": 5.0}, "market_price_per_kg_inr": {"min": 400.0, "max": 700.0}, "survival_rate_percent": {"min": 60.0, "max": 72.0}}, "culture_period_months": {"min": 4.0, "max": 6.0}, "crops_per_year": {"min": 2.0, "max": null}, "notes": "Requires higher salinity than vannamei; less disease-resistant; premium export price; CAA required", "optimal_systems": ["BRACKISH_POND", "SEMI-INTENSIVE"]}'::jsonb);
    END IF;
END $$;


DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM knowledge_nodes WHERE id = '08601d85-00aa-4f5d-bb7a-af81bbcdd2e0') THEN
        UPDATE knowledge_nodes
        SET data = data || '{"scientific_name": "Penaeus indicus", "common_names": {"en": "Indian White Prawn"}, "category": "SHRIMP_/_PRAWN", "biological_parameters": {"temperature_celsius": {"min": 22.0, "max": 32.0}, "dissolved_oxygen_mg_l": {"min": 4.0, "max": null}, "ph_range": {"min": 7.5, "max": 8.5}, "salinity_tolerance_ppt": {"min": 5.0, "max": 25.0}}, "economic_parameters": {"feed_conversion_ratio": {"min": 1.6, "max": 2.2}, "expected_yield_mt_per_acre": {"min": 1.0, "max": 3.0}, "market_price_per_kg_inr": {"min": 200.0, "max": 350.0}, "survival_rate_percent": {"min": 60.0, "max": 72.0}}, "culture_period_months": {"min": 4.0, "max": 6.0}, "crops_per_year": {"min": 2.0, "max": null}, "notes": "Indigenous prawn; important in Kerala, Karnataka, TN coastal ponds; capture + culture", "optimal_systems": ["BRACKISH_POND"]}'::jsonb
        WHERE id = '08601d85-00aa-4f5d-bb7a-af81bbcdd2e0';
    ELSE
        INSERT INTO knowledge_nodes (id, parent_id, node_type, data)
        VALUES ('08601d85-00aa-4f5d-bb7a-af81bbcdd2e0', '00000000-0000-0000-0000-000000000001', 'SPECIES', '{"scientific_name": "Penaeus indicus", "common_names": {"en": "Indian White Prawn"}, "category": "SHRIMP_/_PRAWN", "biological_parameters": {"temperature_celsius": {"min": 22.0, "max": 32.0}, "dissolved_oxygen_mg_l": {"min": 4.0, "max": null}, "ph_range": {"min": 7.5, "max": 8.5}, "salinity_tolerance_ppt": {"min": 5.0, "max": 25.0}}, "economic_parameters": {"feed_conversion_ratio": {"min": 1.6, "max": 2.2}, "expected_yield_mt_per_acre": {"min": 1.0, "max": 3.0}, "market_price_per_kg_inr": {"min": 200.0, "max": 350.0}, "survival_rate_percent": {"min": 60.0, "max": 72.0}}, "culture_period_months": {"min": 4.0, "max": 6.0}, "crops_per_year": {"min": 2.0, "max": null}, "notes": "Indigenous prawn; important in Kerala, Karnataka, TN coastal ponds; capture + culture", "optimal_systems": ["BRACKISH_POND"]}'::jsonb);
    END IF;
END $$;


DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM knowledge_nodes WHERE id = 'cfedc734-fc6c-4f93-be0b-04e3c4b3e4f5') THEN
        UPDATE knowledge_nodes
        SET data = data || '{"scientific_name": "Metapenaeus dobsoni", "common_names": {"en": "Kadal / Speckled Shrimp"}, "category": "SHRIMP_/_PRAWN", "biological_parameters": {"temperature_celsius": {"min": 22.0, "max": 32.0}, "dissolved_oxygen_mg_l": {"min": 4.0, "max": null}, "ph_range": {"min": 7.0, "max": 8.5}, "salinity_tolerance_ppt": {"min": 5.0, "max": 20.0}}, "economic_parameters": {"feed_conversion_ratio": {"min": 1.8, "max": 2.5}, "expected_yield_mt_per_acre": {"min": 0.5, "max": 2.0}, "market_price_per_kg_inr": {"min": 150.0, "max": 250.0}, "survival_rate_percent": {"min": 55.0, "max": 65.0}}, "culture_period_months": {"min": 4.0, "max": 5.0}, "crops_per_year": {"min": 2.0, "max": null}, "notes": "Backwater species; Kerala, Karnataka; combined capture-based aquaculture; smaller harvest size", "optimal_systems": ["BRACKISH_POND", "ESTUARY"]}'::jsonb
        WHERE id = 'cfedc734-fc6c-4f93-be0b-04e3c4b3e4f5';
    ELSE
        INSERT INTO knowledge_nodes (id, parent_id, node_type, data)
        VALUES ('cfedc734-fc6c-4f93-be0b-04e3c4b3e4f5', '00000000-0000-0000-0000-000000000001', 'SPECIES', '{"scientific_name": "Metapenaeus dobsoni", "common_names": {"en": "Kadal / Speckled Shrimp"}, "category": "SHRIMP_/_PRAWN", "biological_parameters": {"temperature_celsius": {"min": 22.0, "max": 32.0}, "dissolved_oxygen_mg_l": {"min": 4.0, "max": null}, "ph_range": {"min": 7.0, "max": 8.5}, "salinity_tolerance_ppt": {"min": 5.0, "max": 20.0}}, "economic_parameters": {"feed_conversion_ratio": {"min": 1.8, "max": 2.5}, "expected_yield_mt_per_acre": {"min": 0.5, "max": 2.0}, "market_price_per_kg_inr": {"min": 150.0, "max": 250.0}, "survival_rate_percent": {"min": 55.0, "max": 65.0}}, "culture_period_months": {"min": 4.0, "max": 5.0}, "crops_per_year": {"min": 2.0, "max": null}, "notes": "Backwater species; Kerala, Karnataka; combined capture-based aquaculture; smaller harvest size", "optimal_systems": ["BRACKISH_POND", "ESTUARY"]}'::jsonb);
    END IF;
END $$;


DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM knowledge_nodes WHERE id = '41b54a1a-87af-47cb-8492-f91b1412f495') THEN
        UPDATE knowledge_nodes
        SET data = data || '{"scientific_name": "Lates calcarifer", "common_names": {"en": "Barramundi / Bhetki / Sea Bass"}, "category": "BRACKISH_/_COASTAL", "biological_parameters": {"temperature_celsius": {"min": 22.0, "max": 32.0}, "dissolved_oxygen_mg_l": {"min": 5.0, "max": null}, "ph_range": {"min": 7.0, "max": 8.5}, "salinity_tolerance_ppt": {"min": 0.0, "max": 35.0}}, "economic_parameters": {"feed_conversion_ratio": {"min": 1.2, "max": 1.8}, "expected_yield_mt_per_acre": {"min": 5.0, "max": 10.0}, "market_price_per_kg_inr": {"min": 300.0, "max": 600.0}, "survival_rate_percent": {"min": 70.0, "max": 82.0}}, "culture_period_months": {"min": 8.0, "max": 12.0}, "crops_per_year": {"min": 1.0, "max": null}, "notes": "Euryhaline; wide salinity range; grows 500g in 6 months; premium fish; AP, WB, Kerala cages", "optimal_systems": ["CAGE", "BRACKISH_POND", "RAS"]}'::jsonb
        WHERE id = '41b54a1a-87af-47cb-8492-f91b1412f495';
    ELSE
        INSERT INTO knowledge_nodes (id, parent_id, node_type, data)
        VALUES ('41b54a1a-87af-47cb-8492-f91b1412f495', '00000000-0000-0000-0000-000000000001', 'SPECIES', '{"scientific_name": "Lates calcarifer", "common_names": {"en": "Barramundi / Bhetki / Sea Bass"}, "category": "BRACKISH_/_COASTAL", "biological_parameters": {"temperature_celsius": {"min": 22.0, "max": 32.0}, "dissolved_oxygen_mg_l": {"min": 5.0, "max": null}, "ph_range": {"min": 7.0, "max": 8.5}, "salinity_tolerance_ppt": {"min": 0.0, "max": 35.0}}, "economic_parameters": {"feed_conversion_ratio": {"min": 1.2, "max": 1.8}, "expected_yield_mt_per_acre": {"min": 5.0, "max": 10.0}, "market_price_per_kg_inr": {"min": 300.0, "max": 600.0}, "survival_rate_percent": {"min": 70.0, "max": 82.0}}, "culture_period_months": {"min": 8.0, "max": 12.0}, "crops_per_year": {"min": 1.0, "max": null}, "notes": "Euryhaline; wide salinity range; grows 500g in 6 months; premium fish; AP, WB, Kerala cages", "optimal_systems": ["CAGE", "BRACKISH_POND", "RAS"]}'::jsonb);
    END IF;
END $$;


DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM knowledge_nodes WHERE id = '09fbe25c-674b-4a4c-b883-3b9ca3319e0d') THEN
        UPDATE knowledge_nodes
        SET data = data || '{"scientific_name": "Chanos chanos", "common_names": {"en": "Milkfish / Bangus"}, "category": "BRACKISH_/_COASTAL", "biological_parameters": {"temperature_celsius": {"min": 20.0, "max": 33.0}, "dissolved_oxygen_mg_l": {"min": 4.0, "max": null}, "ph_range": {"min": 6.5, "max": 8.5}, "salinity_tolerance_ppt": {"min": 0.0, "max": 35.0}}, "economic_parameters": {"feed_conversion_ratio": {"min": 1.5, "max": 2.0}, "expected_yield_mt_per_acre": {"min": 2.0, "max": 5.0}, "market_price_per_kg_inr": {"min": 150.0, "max": 250.0}, "survival_rate_percent": {"min": 72.0, "max": 80.0}}, "culture_period_months": {"min": 6.0, "max": 8.0}, "crops_per_year": {"min": 1.0, "max": 2.0}, "notes": "Euryhaline; filter feeds on algae; traditional brackishwater culture in Kerala, TN; Bangus (PH name)", "optimal_systems": ["BRACKISH_POND", "COASTAL"]}'::jsonb
        WHERE id = '09fbe25c-674b-4a4c-b883-3b9ca3319e0d';
    ELSE
        INSERT INTO knowledge_nodes (id, parent_id, node_type, data)
        VALUES ('09fbe25c-674b-4a4c-b883-3b9ca3319e0d', '00000000-0000-0000-0000-000000000001', 'SPECIES', '{"scientific_name": "Chanos chanos", "common_names": {"en": "Milkfish / Bangus"}, "category": "BRACKISH_/_COASTAL", "biological_parameters": {"temperature_celsius": {"min": 20.0, "max": 33.0}, "dissolved_oxygen_mg_l": {"min": 4.0, "max": null}, "ph_range": {"min": 6.5, "max": 8.5}, "salinity_tolerance_ppt": {"min": 0.0, "max": 35.0}}, "economic_parameters": {"feed_conversion_ratio": {"min": 1.5, "max": 2.0}, "expected_yield_mt_per_acre": {"min": 2.0, "max": 5.0}, "market_price_per_kg_inr": {"min": 150.0, "max": 250.0}, "survival_rate_percent": {"min": 72.0, "max": 80.0}}, "culture_period_months": {"min": 6.0, "max": 8.0}, "crops_per_year": {"min": 1.0, "max": 2.0}, "notes": "Euryhaline; filter feeds on algae; traditional brackishwater culture in Kerala, TN; Bangus (PH name)", "optimal_systems": ["BRACKISH_POND", "COASTAL"]}'::jsonb);
    END IF;
END $$;


DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM knowledge_nodes WHERE id = 'c3c37a8c-5c8b-47e8-aee2-17ce3496dea1') THEN
        UPDATE knowledge_nodes
        SET data = data || '{"scientific_name": "Etroplus suratensis", "common_names": {"en": "Pearl Spot / Karimeen"}, "category": "BRACKISH_/_COASTAL", "biological_parameters": {"temperature_celsius": {"min": 22.0, "max": 32.0}, "dissolved_oxygen_mg_l": {"min": 4.0, "max": null}, "ph_range": {"min": 7.0, "max": 8.5}, "salinity_tolerance_ppt": {"min": 0.0, "max": 25.0}}, "economic_parameters": {"feed_conversion_ratio": {"min": 1.5, "max": 2.2}, "expected_yield_mt_per_acre": {"min": 2.0, "max": 4.0}, "market_price_per_kg_inr": {"min": 350.0, "max": 600.0}, "survival_rate_percent": {"min": 70.0, "max": 80.0}}, "culture_period_months": {"min": 6.0, "max": 9.0}, "crops_per_year": {"min": 1.0, "max": 2.0}, "notes": "Kerala state fish; highest local market price; thrives in backwaters; Kuttanad region culture", "optimal_systems": ["BRACKISH_POND", "BACKWATER_CAGE"]}'::jsonb
        WHERE id = 'c3c37a8c-5c8b-47e8-aee2-17ce3496dea1';
    ELSE
        INSERT INTO knowledge_nodes (id, parent_id, node_type, data)
        VALUES ('c3c37a8c-5c8b-47e8-aee2-17ce3496dea1', '00000000-0000-0000-0000-000000000001', 'SPECIES', '{"scientific_name": "Etroplus suratensis", "common_names": {"en": "Pearl Spot / Karimeen"}, "category": "BRACKISH_/_COASTAL", "biological_parameters": {"temperature_celsius": {"min": 22.0, "max": 32.0}, "dissolved_oxygen_mg_l": {"min": 4.0, "max": null}, "ph_range": {"min": 7.0, "max": 8.5}, "salinity_tolerance_ppt": {"min": 0.0, "max": 25.0}}, "economic_parameters": {"feed_conversion_ratio": {"min": 1.5, "max": 2.2}, "expected_yield_mt_per_acre": {"min": 2.0, "max": 4.0}, "market_price_per_kg_inr": {"min": 350.0, "max": 600.0}, "survival_rate_percent": {"min": 70.0, "max": 80.0}}, "culture_period_months": {"min": 6.0, "max": 9.0}, "crops_per_year": {"min": 1.0, "max": 2.0}, "notes": "Kerala state fish; highest local market price; thrives in backwaters; Kuttanad region culture", "optimal_systems": ["BRACKISH_POND", "BACKWATER_CAGE"]}'::jsonb);
    END IF;
END $$;


DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM knowledge_nodes WHERE id = 'cec90a2d-2cf7-41bb-8736-8821e04f6f64') THEN
        UPDATE knowledge_nodes
        SET data = data || '{"scientific_name": "Mugil cephalus", "common_names": {"en": "Flathead Grey Mullet"}, "category": "BRACKISH_/_COASTAL", "biological_parameters": {"temperature_celsius": {"min": 8.0, "max": 35.0}, "dissolved_oxygen_mg_l": {"min": 4.0, "max": null}, "ph_range": {"min": 7.0, "max": 8.5}, "salinity_tolerance_ppt": {"min": 0.0, "max": 35.0}}, "economic_parameters": {"feed_conversion_ratio": {"min": 1.5, "max": 2.5}, "expected_yield_mt_per_acre": {"min": 1.0, "max": 3.0}, "market_price_per_kg_inr": {"min": 100.0, "max": 200.0}, "survival_rate_percent": {"min": 68.0, "max": 78.0}}, "culture_period_months": {"min": 6.0, "max": 8.0}, "crops_per_year": {"min": 1.0, "max": 2.0}, "notes": "Extremely wide salinity and temperature range; herbivore; grown in coastal ponds AP, TN", "optimal_systems": ["BRACKISH_POND", "ESTUARINE"]}'::jsonb
        WHERE id = 'cec90a2d-2cf7-41bb-8736-8821e04f6f64';
    ELSE
        INSERT INTO knowledge_nodes (id, parent_id, node_type, data)
        VALUES ('cec90a2d-2cf7-41bb-8736-8821e04f6f64', '00000000-0000-0000-0000-000000000001', 'SPECIES', '{"scientific_name": "Mugil cephalus", "common_names": {"en": "Flathead Grey Mullet"}, "category": "BRACKISH_/_COASTAL", "biological_parameters": {"temperature_celsius": {"min": 8.0, "max": 35.0}, "dissolved_oxygen_mg_l": {"min": 4.0, "max": null}, "ph_range": {"min": 7.0, "max": 8.5}, "salinity_tolerance_ppt": {"min": 0.0, "max": 35.0}}, "economic_parameters": {"feed_conversion_ratio": {"min": 1.5, "max": 2.5}, "expected_yield_mt_per_acre": {"min": 1.0, "max": 3.0}, "market_price_per_kg_inr": {"min": 100.0, "max": 200.0}, "survival_rate_percent": {"min": 68.0, "max": 78.0}}, "culture_period_months": {"min": 6.0, "max": 8.0}, "crops_per_year": {"min": 1.0, "max": 2.0}, "notes": "Extremely wide salinity and temperature range; herbivore; grown in coastal ponds AP, TN", "optimal_systems": ["BRACKISH_POND", "ESTUARINE"]}'::jsonb);
    END IF;
END $$;


DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM knowledge_nodes WHERE id = '0d65064a-df01-4b2e-8630-ad63a31119f1') THEN
        UPDATE knowledge_nodes
        SET data = data || '{"scientific_name": "Scylla serrata", "common_names": {"en": "Mud Crab / Green Crab"}, "category": "BRACKISH_/_COASTAL", "biological_parameters": {"temperature_celsius": {"min": 22.0, "max": 32.0}, "dissolved_oxygen_mg_l": {"min": 4.0, "max": null}, "ph_range": {"min": 7.5, "max": 8.5}, "salinity_tolerance_ppt": {"min": 5.0, "max": 30.0}}, "economic_parameters": {"feed_conversion_ratio": {"min": 3.0, "max": 5.0}, "expected_yield_mt_per_acre": {"min": 0.5, "max": 1.5}, "market_price_per_kg_inr": {"min": 600.0, "max": 1200.0}, "survival_rate_percent": {"min": 50.0, "max": 65.0}}, "culture_period_months": {"min": 4.0, "max": 6.0}, "crops_per_year": {"min": 2.0, "max": null}, "notes": "High FCR due to carnivore diet; premium export price; fattening culture popular in WB, AP, Kerala", "optimal_systems": ["BRACKISH_POND", "MANGROVE"]}'::jsonb
        WHERE id = '0d65064a-df01-4b2e-8630-ad63a31119f1';
    ELSE
        INSERT INTO knowledge_nodes (id, parent_id, node_type, data)
        VALUES ('0d65064a-df01-4b2e-8630-ad63a31119f1', '00000000-0000-0000-0000-000000000001', 'SPECIES', '{"scientific_name": "Scylla serrata", "common_names": {"en": "Mud Crab / Green Crab"}, "category": "BRACKISH_/_COASTAL", "biological_parameters": {"temperature_celsius": {"min": 22.0, "max": 32.0}, "dissolved_oxygen_mg_l": {"min": 4.0, "max": null}, "ph_range": {"min": 7.5, "max": 8.5}, "salinity_tolerance_ppt": {"min": 5.0, "max": 30.0}}, "economic_parameters": {"feed_conversion_ratio": {"min": 3.0, "max": 5.0}, "expected_yield_mt_per_acre": {"min": 0.5, "max": 1.5}, "market_price_per_kg_inr": {"min": 600.0, "max": 1200.0}, "survival_rate_percent": {"min": 50.0, "max": 65.0}}, "culture_period_months": {"min": 4.0, "max": 6.0}, "crops_per_year": {"min": 2.0, "max": null}, "notes": "High FCR due to carnivore diet; premium export price; fattening culture popular in WB, AP, Kerala", "optimal_systems": ["BRACKISH_POND", "MANGROVE"]}'::jsonb);
    END IF;
END $$;


DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM knowledge_nodes WHERE id = '81c6074e-fb81-46f0-bd63-27bd5f2143e5') THEN
        UPDATE knowledge_nodes
        SET data = data || '{"scientific_name": "Anabas testudineus", "common_names": {"en": "Climbing Perch / Koi"}, "category": "AIR-BREATHING_FISH", "biological_parameters": {"temperature_celsius": {"min": 20.0, "max": 35.0}, "dissolved_oxygen_mg_l": {"min": 1.0, "max": null}, "ph_range": {"min": 6.0, "max": 8.5}, "salinity_tolerance_ppt": {"min": 0.0, "max": 5.0}}, "economic_parameters": {"feed_conversion_ratio": {"min": 1.2, "max": 1.8}, "expected_yield_mt_per_acre": {"min": 3.0, "max": 8.0}, "market_price_per_kg_inr": {"min": 200.0, "max": 400.0}, "survival_rate_percent": {"min": 78.0, "max": 88.0}}, "culture_period_months": {"min": 4.0, "max": 6.0}, "crops_per_year": {"min": 2.0, "max": 3.0}, "notes": "Survives near-zero DO; can climb out of water; very dense stocking possible; Bihar, Bengal, Assam", "optimal_systems": ["POND", "BIOFLOC", "SMALL_TANKS"]}'::jsonb
        WHERE id = '81c6074e-fb81-46f0-bd63-27bd5f2143e5';
    ELSE
        INSERT INTO knowledge_nodes (id, parent_id, node_type, data)
        VALUES ('81c6074e-fb81-46f0-bd63-27bd5f2143e5', '00000000-0000-0000-0000-000000000001', 'SPECIES', '{"scientific_name": "Anabas testudineus", "common_names": {"en": "Climbing Perch / Koi"}, "category": "AIR-BREATHING_FISH", "biological_parameters": {"temperature_celsius": {"min": 20.0, "max": 35.0}, "dissolved_oxygen_mg_l": {"min": 1.0, "max": null}, "ph_range": {"min": 6.0, "max": 8.5}, "salinity_tolerance_ppt": {"min": 0.0, "max": 5.0}}, "economic_parameters": {"feed_conversion_ratio": {"min": 1.2, "max": 1.8}, "expected_yield_mt_per_acre": {"min": 3.0, "max": 8.0}, "market_price_per_kg_inr": {"min": 200.0, "max": 400.0}, "survival_rate_percent": {"min": 78.0, "max": 88.0}}, "culture_period_months": {"min": 4.0, "max": 6.0}, "crops_per_year": {"min": 2.0, "max": 3.0}, "notes": "Survives near-zero DO; can climb out of water; very dense stocking possible; Bihar, Bengal, Assam", "optimal_systems": ["POND", "BIOFLOC", "SMALL_TANKS"]}'::jsonb);
    END IF;
END $$;


DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM knowledge_nodes WHERE id = '1ba918ef-88b0-45ca-a0b4-16a0fb9ef082') THEN
        UPDATE knowledge_nodes
        SET data = data || '{"scientific_name": "Wallago attu", "common_names": {"en": "Wallago / Indian Sareng Catfish"}, "category": "AIR-BREATHING_FISH", "biological_parameters": {"temperature_celsius": {"min": 20.0, "max": 33.0}, "dissolved_oxygen_mg_l": {"min": 3.0, "max": null}, "ph_range": {"min": 6.5, "max": 8.0}, "salinity_tolerance_ppt": {"min": 0.0, "max": 2.0}}, "economic_parameters": {"feed_conversion_ratio": {"min": 3.0, "max": 5.0}, "expected_yield_mt_per_acre": {"min": 2.0, "max": 4.0}, "market_price_per_kg_inr": {"min": 200.0, "max": 400.0}, "survival_rate_percent": {"min": 60.0, "max": 70.0}}, "culture_period_months": {"min": 10.0, "max": 14.0}, "crops_per_year": {"min": 1.0, "max": null}, "notes": "Predatory; requires live/wet feed; can reach 50+ kg in wild; culture limited; high-value", "optimal_systems": ["LARGE_POND"]}'::jsonb
        WHERE id = '1ba918ef-88b0-45ca-a0b4-16a0fb9ef082';
    ELSE
        INSERT INTO knowledge_nodes (id, parent_id, node_type, data)
        VALUES ('1ba918ef-88b0-45ca-a0b4-16a0fb9ef082', '00000000-0000-0000-0000-000000000001', 'SPECIES', '{"scientific_name": "Wallago attu", "common_names": {"en": "Wallago / Indian Sareng Catfish"}, "category": "AIR-BREATHING_FISH", "biological_parameters": {"temperature_celsius": {"min": 20.0, "max": 33.0}, "dissolved_oxygen_mg_l": {"min": 3.0, "max": null}, "ph_range": {"min": 6.5, "max": 8.0}, "salinity_tolerance_ppt": {"min": 0.0, "max": 2.0}}, "economic_parameters": {"feed_conversion_ratio": {"min": 3.0, "max": 5.0}, "expected_yield_mt_per_acre": {"min": 2.0, "max": 4.0}, "market_price_per_kg_inr": {"min": 200.0, "max": 400.0}, "survival_rate_percent": {"min": 60.0, "max": 70.0}}, "culture_period_months": {"min": 10.0, "max": 14.0}, "crops_per_year": {"min": 1.0, "max": null}, "notes": "Predatory; requires live/wet feed; can reach 50+ kg in wild; culture limited; high-value", "optimal_systems": ["LARGE_POND"]}'::jsonb);
    END IF;
END $$;


DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM knowledge_nodes WHERE id = 'ff6e398d-12ea-42e2-b79e-1e524c37986e') THEN
        UPDATE knowledge_nodes
        SET data = data || '{"scientific_name": "Monopterus cuchia", "common_names": {"en": "Cuchia / Indian Swamp Eel"}, "category": "AIR-BREATHING_FISH", "biological_parameters": {"temperature_celsius": {"min": 22.0, "max": 33.0}, "dissolved_oxygen_mg_l": {"min": 1.0, "max": null}, "ph_range": {"min": 6.0, "max": 8.0}, "salinity_tolerance_ppt": {"min": 0.0, "max": 3.0}}, "economic_parameters": {"feed_conversion_ratio": {"min": 2.0, "max": 3.0}, "expected_yield_mt_per_acre": {"min": 2.0, "max": 5.0}, "market_price_per_kg_inr": {"min": 300.0, "max": 600.0}, "survival_rate_percent": {"min": 70.0, "max": 80.0}}, "culture_period_months": {"min": 8.0, "max": 12.0}, "crops_per_year": {"min": 1.0, "max": null}, "notes": "Air-breathing; burrowing; muddy pond culture; gaining interest; high price in NE India, Bengal", "optimal_systems": ["MUD_POND", "BIOFLOC"]}'::jsonb
        WHERE id = 'ff6e398d-12ea-42e2-b79e-1e524c37986e';
    ELSE
        INSERT INTO knowledge_nodes (id, parent_id, node_type, data)
        VALUES ('ff6e398d-12ea-42e2-b79e-1e524c37986e', '00000000-0000-0000-0000-000000000001', 'SPECIES', '{"scientific_name": "Monopterus cuchia", "common_names": {"en": "Cuchia / Indian Swamp Eel"}, "category": "AIR-BREATHING_FISH", "biological_parameters": {"temperature_celsius": {"min": 22.0, "max": 33.0}, "dissolved_oxygen_mg_l": {"min": 1.0, "max": null}, "ph_range": {"min": 6.0, "max": 8.0}, "salinity_tolerance_ppt": {"min": 0.0, "max": 3.0}}, "economic_parameters": {"feed_conversion_ratio": {"min": 2.0, "max": 3.0}, "expected_yield_mt_per_acre": {"min": 2.0, "max": 5.0}, "market_price_per_kg_inr": {"min": 300.0, "max": 600.0}, "survival_rate_percent": {"min": 70.0, "max": 80.0}}, "culture_period_months": {"min": 8.0, "max": 12.0}, "crops_per_year": {"min": 1.0, "max": null}, "notes": "Air-breathing; burrowing; muddy pond culture; gaining interest; high price in NE India, Bengal", "optimal_systems": ["MUD_POND", "BIOFLOC"]}'::jsonb);
    END IF;
END $$;


DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM knowledge_nodes WHERE id = '936427b2-ab19-4b64-a2c7-61ffbd9f92d9') THEN
        UPDATE knowledge_nodes
        SET data = data || '{"scientific_name": "Oncorhynchus mykiss", "common_names": {"en": "Rainbow Trout"}, "category": "COLD_WATER", "biological_parameters": {"temperature_celsius": {"min": 10.0, "max": 18.0}, "dissolved_oxygen_mg_l": {"min": 7.0, "max": null}, "ph_range": {"min": 6.5, "max": 8.0}, "salinity_tolerance_ppt": {"min": 0.0, "max": 2.0}}, "economic_parameters": {"feed_conversion_ratio": {"min": 1.2, "max": 1.6}, "expected_yield_mt_per_acre": {"min": 20.0, "max": 40.0}, "market_price_per_kg_inr": {"min": 500.0, "max": 900.0}, "survival_rate_percent": {"min": 70.0, "max": 82.0}}, "culture_period_months": {"min": 10.0, "max": 14.0}, "crops_per_year": {"min": 1.0, "max": null}, "notes": "Optimal 12\u201316\u00b0C; DO must stay >7 mg/L; J&K, HP, Uttarakhand, Sikkim, Arunachal Pradesh", "optimal_systems": ["RAS", "RACEWAYS", "HILL_STREAMS"]}'::jsonb
        WHERE id = '936427b2-ab19-4b64-a2c7-61ffbd9f92d9';
    ELSE
        INSERT INTO knowledge_nodes (id, parent_id, node_type, data)
        VALUES ('936427b2-ab19-4b64-a2c7-61ffbd9f92d9', '00000000-0000-0000-0000-000000000001', 'SPECIES', '{"scientific_name": "Oncorhynchus mykiss", "common_names": {"en": "Rainbow Trout"}, "category": "COLD_WATER", "biological_parameters": {"temperature_celsius": {"min": 10.0, "max": 18.0}, "dissolved_oxygen_mg_l": {"min": 7.0, "max": null}, "ph_range": {"min": 6.5, "max": 8.0}, "salinity_tolerance_ppt": {"min": 0.0, "max": 2.0}}, "economic_parameters": {"feed_conversion_ratio": {"min": 1.2, "max": 1.6}, "expected_yield_mt_per_acre": {"min": 20.0, "max": 40.0}, "market_price_per_kg_inr": {"min": 500.0, "max": 900.0}, "survival_rate_percent": {"min": 70.0, "max": 82.0}}, "culture_period_months": {"min": 10.0, "max": 14.0}, "crops_per_year": {"min": 1.0, "max": null}, "notes": "Optimal 12\u201316\u00b0C; DO must stay >7 mg/L; J&K, HP, Uttarakhand, Sikkim, Arunachal Pradesh", "optimal_systems": ["RAS", "RACEWAYS", "HILL_STREAMS"]}'::jsonb);
    END IF;
END $$;


DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM knowledge_nodes WHERE id = '0f4a3a6b-93e4-44a6-9710-754413e5e8da') THEN
        UPDATE knowledge_nodes
        SET data = data || '{"scientific_name": "Salmo trutta fario", "common_names": {"en": "Brown Trout"}, "category": "COLD_WATER", "biological_parameters": {"temperature_celsius": {"min": 8.0, "max": 18.0}, "dissolved_oxygen_mg_l": {"min": 7.0, "max": null}, "ph_range": {"min": 6.5, "max": 8.0}, "salinity_tolerance_ppt": {"min": 0.0, "max": 2.0}}, "economic_parameters": {"feed_conversion_ratio": {"min": 1.3, "max": 1.8}, "expected_yield_mt_per_acre": {"min": 10.0, "max": 25.0}, "market_price_per_kg_inr": {"min": 500.0, "max": 900.0}, "survival_rate_percent": {"min": 65.0, "max": 75.0}}, "culture_period_months": {"min": 12.0, "max": 18.0}, "crops_per_year": {"min": 1.0, "max": null}, "notes": "More tolerant of warmer water than Rainbow Trout; J&K, Himachal Pradesh; introduced", "optimal_systems": ["RACEWAYS", "HILL_STREAMS"]}'::jsonb
        WHERE id = '0f4a3a6b-93e4-44a6-9710-754413e5e8da';
    ELSE
        INSERT INTO knowledge_nodes (id, parent_id, node_type, data)
        VALUES ('0f4a3a6b-93e4-44a6-9710-754413e5e8da', '00000000-0000-0000-0000-000000000001', 'SPECIES', '{"scientific_name": "Salmo trutta fario", "common_names": {"en": "Brown Trout"}, "category": "COLD_WATER", "biological_parameters": {"temperature_celsius": {"min": 8.0, "max": 18.0}, "dissolved_oxygen_mg_l": {"min": 7.0, "max": null}, "ph_range": {"min": 6.5, "max": 8.0}, "salinity_tolerance_ppt": {"min": 0.0, "max": 2.0}}, "economic_parameters": {"feed_conversion_ratio": {"min": 1.3, "max": 1.8}, "expected_yield_mt_per_acre": {"min": 10.0, "max": 25.0}, "market_price_per_kg_inr": {"min": 500.0, "max": 900.0}, "survival_rate_percent": {"min": 65.0, "max": 75.0}}, "culture_period_months": {"min": 12.0, "max": 18.0}, "crops_per_year": {"min": 1.0, "max": null}, "notes": "More tolerant of warmer water than Rainbow Trout; J&K, Himachal Pradesh; introduced", "optimal_systems": ["RACEWAYS", "HILL_STREAMS"]}'::jsonb);
    END IF;
END $$;


DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM knowledge_nodes WHERE id = 'e8738828-4503-49d3-a903-8d48ca32b02b') THEN
        UPDATE knowledge_nodes
        SET data = data || '{"scientific_name": "Tor tor", "common_names": {"en": "Mahseer / Golden Mahseer"}, "category": "COLD_WATER", "biological_parameters": {"temperature_celsius": {"min": 14.0, "max": 26.0}, "dissolved_oxygen_mg_l": {"min": 6.0, "max": null}, "ph_range": {"min": 6.5, "max": 8.0}, "salinity_tolerance_ppt": {"min": 0.0, "max": 1.0}}, "economic_parameters": {"feed_conversion_ratio": {"min": 2.0, "max": 3.5}, "expected_yield_mt_per_acre": {"min": 1.0, "max": 3.0}, "market_price_per_kg_inr": {"min": 500.0, "max": 1500.0}, "survival_rate_percent": {"min": 60.0, "max": 72.0}}, "culture_period_months": {"min": 12.0, "max": 18.0}, "crops_per_year": {"min": 1.0, "max": null}, "notes": "State fish of Uttarakhand; conservation aquaculture focus; slow-growing; pristine water required", "optimal_systems": ["RACEWAYS", "CONSERVATION_PONDS"]}'::jsonb
        WHERE id = 'e8738828-4503-49d3-a903-8d48ca32b02b';
    ELSE
        INSERT INTO knowledge_nodes (id, parent_id, node_type, data)
        VALUES ('e8738828-4503-49d3-a903-8d48ca32b02b', '00000000-0000-0000-0000-000000000001', 'SPECIES', '{"scientific_name": "Tor tor", "common_names": {"en": "Mahseer / Golden Mahseer"}, "category": "COLD_WATER", "biological_parameters": {"temperature_celsius": {"min": 14.0, "max": 26.0}, "dissolved_oxygen_mg_l": {"min": 6.0, "max": null}, "ph_range": {"min": 6.5, "max": 8.0}, "salinity_tolerance_ppt": {"min": 0.0, "max": 1.0}}, "economic_parameters": {"feed_conversion_ratio": {"min": 2.0, "max": 3.5}, "expected_yield_mt_per_acre": {"min": 1.0, "max": 3.0}, "market_price_per_kg_inr": {"min": 500.0, "max": 1500.0}, "survival_rate_percent": {"min": 60.0, "max": 72.0}}, "culture_period_months": {"min": 12.0, "max": 18.0}, "crops_per_year": {"min": 1.0, "max": null}, "notes": "State fish of Uttarakhand; conservation aquaculture focus; slow-growing; pristine water required", "optimal_systems": ["RACEWAYS", "CONSERVATION_PONDS"]}'::jsonb);
    END IF;
END $$;


DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM knowledge_nodes WHERE id = 'e83c28cc-efd4-4b8b-b52a-1f28915480d5') THEN
        UPDATE knowledge_nodes
        SET data = data || '{"scientific_name": "Epinephelus spp.", "common_names": {"en": "Grouper"}, "category": "MARINE_/_ESTUARINE", "biological_parameters": {"temperature_celsius": {"min": 22.0, "max": 32.0}, "dissolved_oxygen_mg_l": {"min": 5.0, "max": null}, "ph_range": {"min": 7.8, "max": 8.5}, "salinity_tolerance_ppt": {"min": 20.0, "max": 35.0}}, "economic_parameters": {"feed_conversion_ratio": {"min": 1.5, "max": 2.5}, "expected_yield_mt_per_acre": {"min": 5.0, "max": 15.0}, "market_price_per_kg_inr": {"min": 600.0, "max": 1500.0}, "survival_rate_percent": {"min": 65.0, "max": 78.0}}, "culture_period_months": {"min": 10.0, "max": 14.0}, "crops_per_year": {"min": 1.0, "max": null}, "notes": "Premium export species; CMFRI Kochi breeds; AP, Kerala, TN marine cages; slow-growing", "optimal_systems": ["MARINE_CAGE", "LAND-BASED_RAS"]}'::jsonb
        WHERE id = 'e83c28cc-efd4-4b8b-b52a-1f28915480d5';
    ELSE
        INSERT INTO knowledge_nodes (id, parent_id, node_type, data)
        VALUES ('e83c28cc-efd4-4b8b-b52a-1f28915480d5', '00000000-0000-0000-0000-000000000001', 'SPECIES', '{"scientific_name": "Epinephelus spp.", "common_names": {"en": "Grouper"}, "category": "MARINE_/_ESTUARINE", "biological_parameters": {"temperature_celsius": {"min": 22.0, "max": 32.0}, "dissolved_oxygen_mg_l": {"min": 5.0, "max": null}, "ph_range": {"min": 7.8, "max": 8.5}, "salinity_tolerance_ppt": {"min": 20.0, "max": 35.0}}, "economic_parameters": {"feed_conversion_ratio": {"min": 1.5, "max": 2.5}, "expected_yield_mt_per_acre": {"min": 5.0, "max": 15.0}, "market_price_per_kg_inr": {"min": 600.0, "max": 1500.0}, "survival_rate_percent": {"min": 65.0, "max": 78.0}}, "culture_period_months": {"min": 10.0, "max": 14.0}, "crops_per_year": {"min": 1.0, "max": null}, "notes": "Premium export species; CMFRI Kochi breeds; AP, Kerala, TN marine cages; slow-growing", "optimal_systems": ["MARINE_CAGE", "LAND-BASED_RAS"]}'::jsonb);
    END IF;
END $$;


DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM knowledge_nodes WHERE id = 'a9e64436-30ca-45c2-916d-0d6206f09db2') THEN
        UPDATE knowledge_nodes
        SET data = data || '{"scientific_name": "Rachycentron canadum", "common_names": {"en": "Cobia"}, "category": "MARINE_/_ESTUARINE", "biological_parameters": {"temperature_celsius": {"min": 20.0, "max": 32.0}, "dissolved_oxygen_mg_l": {"min": 5.0, "max": null}, "ph_range": {"min": 7.8, "max": 8.5}, "salinity_tolerance_ppt": {"min": 15.0, "max": 35.0}}, "economic_parameters": {"feed_conversion_ratio": {"min": 1.5, "max": 2.0}, "expected_yield_mt_per_acre": {"min": 10.0, "max": 20.0}, "market_price_per_kg_inr": {"min": 400.0, "max": 700.0}, "survival_rate_percent": {"min": 68.0, "max": 78.0}}, "culture_period_months": {"min": 8.0, "max": 12.0}, "crops_per_year": {"min": 1.0, "max": null}, "notes": "Fast-growing marine fish; CMFRI hatchery success; 4\u20135 kg in 12 months; AP coast cages", "optimal_systems": ["MARINE_CAGE"]}'::jsonb
        WHERE id = 'a9e64436-30ca-45c2-916d-0d6206f09db2';
    ELSE
        INSERT INTO knowledge_nodes (id, parent_id, node_type, data)
        VALUES ('a9e64436-30ca-45c2-916d-0d6206f09db2', '00000000-0000-0000-0000-000000000001', 'SPECIES', '{"scientific_name": "Rachycentron canadum", "common_names": {"en": "Cobia"}, "category": "MARINE_/_ESTUARINE", "biological_parameters": {"temperature_celsius": {"min": 20.0, "max": 32.0}, "dissolved_oxygen_mg_l": {"min": 5.0, "max": null}, "ph_range": {"min": 7.8, "max": 8.5}, "salinity_tolerance_ppt": {"min": 15.0, "max": 35.0}}, "economic_parameters": {"feed_conversion_ratio": {"min": 1.5, "max": 2.0}, "expected_yield_mt_per_acre": {"min": 10.0, "max": 20.0}, "market_price_per_kg_inr": {"min": 400.0, "max": 700.0}, "survival_rate_percent": {"min": 68.0, "max": 78.0}}, "culture_period_months": {"min": 8.0, "max": 12.0}, "crops_per_year": {"min": 1.0, "max": null}, "notes": "Fast-growing marine fish; CMFRI hatchery success; 4\u20135 kg in 12 months; AP coast cages", "optimal_systems": ["MARINE_CAGE"]}'::jsonb);
    END IF;
END $$;


DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM knowledge_nodes WHERE id = 'bfa77a08-8a1f-4637-b891-4d0f5651ad68') THEN
        UPDATE knowledge_nodes
        SET data = data || '{"scientific_name": "Lutjanus argentimaculatus", "common_names": {"en": "Mangrove Red Snapper"}, "category": "MARINE_/_ESTUARINE", "biological_parameters": {"temperature_celsius": {"min": 22.0, "max": 32.0}, "dissolved_oxygen_mg_l": {"min": 5.0, "max": null}, "ph_range": {"min": 7.5, "max": 8.5}, "salinity_tolerance_ppt": {"min": 5.0, "max": 32.0}}, "economic_parameters": {"feed_conversion_ratio": {"min": 1.5, "max": 2.0}, "expected_yield_mt_per_acre": {"min": 5.0, "max": 10.0}, "market_price_per_kg_inr": {"min": 400.0, "max": 800.0}, "survival_rate_percent": {"min": 65.0, "max": 75.0}}, "culture_period_months": {"min": 10.0, "max": 14.0}, "crops_per_year": {"min": 1.0, "max": null}, "notes": "Euryhaline; estuarine\u2013marine; cage culture AP, TN, Kerala; Chempalli in Malayalam", "optimal_systems": ["ESTUARINE_CAGE", "BRACKISH_POND"]}'::jsonb
        WHERE id = 'bfa77a08-8a1f-4637-b891-4d0f5651ad68';
    ELSE
        INSERT INTO knowledge_nodes (id, parent_id, node_type, data)
        VALUES ('bfa77a08-8a1f-4637-b891-4d0f5651ad68', '00000000-0000-0000-0000-000000000001', 'SPECIES', '{"scientific_name": "Lutjanus argentimaculatus", "common_names": {"en": "Mangrove Red Snapper"}, "category": "MARINE_/_ESTUARINE", "biological_parameters": {"temperature_celsius": {"min": 22.0, "max": 32.0}, "dissolved_oxygen_mg_l": {"min": 5.0, "max": null}, "ph_range": {"min": 7.5, "max": 8.5}, "salinity_tolerance_ppt": {"min": 5.0, "max": 32.0}}, "economic_parameters": {"feed_conversion_ratio": {"min": 1.5, "max": 2.0}, "expected_yield_mt_per_acre": {"min": 5.0, "max": 10.0}, "market_price_per_kg_inr": {"min": 400.0, "max": 800.0}, "survival_rate_percent": {"min": 65.0, "max": 75.0}}, "culture_period_months": {"min": 10.0, "max": 14.0}, "crops_per_year": {"min": 1.0, "max": null}, "notes": "Euryhaline; estuarine\u2013marine; cage culture AP, TN, Kerala; Chempalli in Malayalam", "optimal_systems": ["ESTUARINE_CAGE", "BRACKISH_POND"]}'::jsonb);
    END IF;
END $$;


DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM knowledge_nodes WHERE id = 'e4f13f28-d296-49b4-8209-34ca5872a12e') THEN
        UPDATE knowledge_nodes
        SET data = data || '{"scientific_name": "Acanthopagrus berda", "common_names": {"en": "Picnic Seabream / Black Porgy"}, "category": "MARINE_/_ESTUARINE", "biological_parameters": {"temperature_celsius": {"min": 18.0, "max": 32.0}, "dissolved_oxygen_mg_l": {"min": 5.0, "max": null}, "ph_range": {"min": 7.5, "max": 8.5}, "salinity_tolerance_ppt": {"min": 5.0, "max": 30.0}}, "economic_parameters": {"feed_conversion_ratio": {"min": 1.8, "max": 2.5}, "expected_yield_mt_per_acre": {"min": 3.0, "max": 6.0}, "market_price_per_kg_inr": {"min": 300.0, "max": 500.0}, "survival_rate_percent": {"min": 65.0, "max": 75.0}}, "culture_period_months": {"min": 8.0, "max": 12.0}, "crops_per_year": {"min": 1.0, "max": null}, "notes": "CMFRI research species; coastal AP, Karnataka, Kerala; brackish-marine tolerance", "optimal_systems": ["COASTAL_CAGE", "BRACKISH_POND"]}'::jsonb
        WHERE id = 'e4f13f28-d296-49b4-8209-34ca5872a12e';
    ELSE
        INSERT INTO knowledge_nodes (id, parent_id, node_type, data)
        VALUES ('e4f13f28-d296-49b4-8209-34ca5872a12e', '00000000-0000-0000-0000-000000000001', 'SPECIES', '{"scientific_name": "Acanthopagrus berda", "common_names": {"en": "Picnic Seabream / Black Porgy"}, "category": "MARINE_/_ESTUARINE", "biological_parameters": {"temperature_celsius": {"min": 18.0, "max": 32.0}, "dissolved_oxygen_mg_l": {"min": 5.0, "max": null}, "ph_range": {"min": 7.5, "max": 8.5}, "salinity_tolerance_ppt": {"min": 5.0, "max": 30.0}}, "economic_parameters": {"feed_conversion_ratio": {"min": 1.8, "max": 2.5}, "expected_yield_mt_per_acre": {"min": 3.0, "max": 6.0}, "market_price_per_kg_inr": {"min": 300.0, "max": 500.0}, "survival_rate_percent": {"min": 65.0, "max": 75.0}}, "culture_period_months": {"min": 8.0, "max": 12.0}, "crops_per_year": {"min": 1.0, "max": null}, "notes": "CMFRI research species; coastal AP, Karnataka, Kerala; brackish-marine tolerance", "optimal_systems": ["COASTAL_CAGE", "BRACKISH_POND"]}'::jsonb);
    END IF;
END $$;
