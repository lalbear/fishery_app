import { query, closePool } from '../db';
import { logger } from '../utils/logger';
import { CultivationSystem } from '../types';

async function seedEconomics() {
    logger.info('Starting exact species-specific economics seeding...');

    try {
        // Clear previous economic models to avoid duplicates during reseeding
        await query(`DELETE FROM knowledge_nodes WHERE node_type = 'ECONOMIC_MODEL'`);

        // 1. Rohu (Labeo rohita)
        await query(`
        INSERT INTO knowledge_nodes (node_type, data)
        VALUES ('ECONOMIC_MODEL', $1::jsonb)
        `, [
            JSON.stringify({
                model_name: "Rohu Semi-Intensive Model (1 Hectare)",
                system_type: CultivationSystem.TRADITIONAL_POND,
                target_species: "Labeo rohita",
                capital_expenditure: {
                    land_preparation_inr_per_hectare: 15000,
                    pond_construction_inr_per_hectare: 35000,
                    equipment_costs: {
                        "Aerator": 25000,
                        "Nets": 10000
                    },
                    initial_stocking_cost_inr: 30000,
                    contingency_percent: 5
                },
                operational_expenditure: {
                    feed_cost_inr_per_kg_fish: 40,
                    electricity_cost_inr_per_month: 2500,
                    labor_cost_inr_per_month: 6000,
                    medicine_cost_inr_per_cycle: 20000,
                    miscellaneous_percent: 5
                },
                revenue_projections: {
                    expected_yield_kg_per_hectare: { min: 5000, max: 7000 },
                    market_price_inr_per_kg: { min: 90, max: 110 },
                    harvest_cycles_per_year: 2
                },
                benefit_cost_ratio: { min: 1.30, max: 1.50 },
                break_even_months: { min: 6, max: 8 },
                pmmsy_subsidy_applicable: true
            })
        ]);

        // 2. Catla (Catla catla)
        await query(`
        INSERT INTO knowledge_nodes (node_type, data)
        VALUES ('ECONOMIC_MODEL', $1::jsonb)
        `, [
            JSON.stringify({
                model_name: "Catla Semi-Intensive Model (1 Hectare)",
                system_type: CultivationSystem.TRADITIONAL_POND,
                target_species: "Catla catla",
                capital_expenditure: {
                    land_preparation_inr_per_hectare: 20000,
                    pond_construction_inr_per_hectare: 40000,
                    equipment_costs: {
                        "Aerator": 25000,
                        "Nets": 15000
                    },
                    initial_stocking_cost_inr: 40000,
                    contingency_percent: 5
                },
                operational_expenditure: {
                    feed_cost_inr_per_kg_fish: 45,
                    electricity_cost_inr_per_month: 3000,
                    labor_cost_inr_per_month: 6000,
                    medicine_cost_inr_per_cycle: 25000,
                    miscellaneous_percent: 5
                },
                revenue_projections: {
                    expected_yield_kg_per_hectare: { min: 4000, max: 5000 },
                    market_price_inr_per_kg: { min: 140, max: 160 },
                    harvest_cycles_per_year: 1
                },
                benefit_cost_ratio: { min: 1.40, max: 1.70 },
                break_even_months: { min: 8, max: 12 },
                pmmsy_subsidy_applicable: true
            })
        ]);

        // 3. Mrigal (Cirrhinus mrigala)
        await query(`
        INSERT INTO knowledge_nodes (node_type, data)
        VALUES ('ECONOMIC_MODEL', $1::jsonb)
        `, [
            JSON.stringify({
                model_name: "Mrigal Traditional Model (1 Hectare)",
                system_type: CultivationSystem.TRADITIONAL_POND,
                target_species: "Cirrhinus mrigala",
                capital_expenditure: {
                    land_preparation_inr_per_hectare: 10000,
                    pond_construction_inr_per_hectare: 20000,
                    equipment_costs: {
                        "Nets": 10000
                    },
                    initial_stocking_cost_inr: 20000,
                    contingency_percent: 5
                },
                operational_expenditure: {
                    feed_cost_inr_per_kg_fish: 35,
                    electricity_cost_inr_per_month: 1500,
                    labor_cost_inr_per_month: 4000,
                    medicine_cost_inr_per_cycle: 15000,
                    miscellaneous_percent: 5
                },
                revenue_projections: {
                    expected_yield_kg_per_hectare: { min: 3000, max: 5000 },
                    market_price_inr_per_kg: { min: 90, max: 110 },
                    harvest_cycles_per_year: 1
                },
                benefit_cost_ratio: { min: 1.10, max: 1.30 },
                break_even_months: { min: 10, max: 12 },
                pmmsy_subsidy_applicable: true
            })
        ]);

        // 4. Vannamei Shrimp (Litopenaeus vannamei)
        await query(`
        INSERT INTO knowledge_nodes (node_type, data)
        VALUES ('ECONOMIC_MODEL', $1::jsonb)
        `, [
            JSON.stringify({
                model_name: "Vannamei Intensive Model (1 Hectare)",
                system_type: CultivationSystem.BRACKISH_POND,
                target_species: "Litopenaeus vannamei",
                capital_expenditure: {
                    land_preparation_inr_per_hectare: 20000,
                    pond_construction_inr_per_hectare: 80000,
                    equipment_costs: {
                        "Aerators (Heavy)": 150000,
                        "Bio-secure Fencing": 50000
                    },
                    initial_stocking_cost_inr: 250000,
                    contingency_percent: 10
                },
                operational_expenditure: {
                    feed_cost_inr_per_kg_fish: 105,
                    electricity_cost_inr_per_month: 15000,
                    labor_cost_inr_per_month: 20000,
                    medicine_cost_inr_per_cycle: 100000,
                    miscellaneous_percent: 10
                },
                revenue_projections: {
                    expected_yield_kg_per_hectare: { min: 4000, max: 6000 },
                    market_price_inr_per_kg: { min: 380, max: 420 },
                    harvest_cycles_per_year: 2
                },
                benefit_cost_ratio: { min: 1.5, max: 2.2 },
                break_even_months: { min: 4, max: 5 },
                pmmsy_subsidy_applicable: true
            })
        ]);

        // 5. Black Tiger Shrimp (Penaeus monodon)
        await query(`
        INSERT INTO knowledge_nodes (node_type, data)
        VALUES ('ECONOMIC_MODEL', $1::jsonb)
        `, [
            JSON.stringify({
                model_name: "Black Tiger Shrimp Model (1 Hectare)",
                system_type: CultivationSystem.BRACKISH_POND,
                target_species: "Penaeus monodon",
                capital_expenditure: {
                    land_preparation_inr_per_hectare: 25000,
                    pond_construction_inr_per_hectare: 90000,
                    equipment_costs: {
                        "Aerators (Heavy)": 150000,
                        "Bio-secure Fencing": 60000
                    },
                    initial_stocking_cost_inr: 60000,
                    contingency_percent: 10
                },
                operational_expenditure: {
                    feed_cost_inr_per_kg_fish: 120, // Premium feed
                    electricity_cost_inr_per_month: 18000,
                    labor_cost_inr_per_month: 25000,
                    medicine_cost_inr_per_cycle: 150000,
                    miscellaneous_percent: 10
                },
                revenue_projections: {
                    expected_yield_kg_per_hectare: { min: 3000, max: 4000 },
                    market_price_inr_per_kg: { min: 450, max: 550 },
                    harvest_cycles_per_year: 2
                },
                benefit_cost_ratio: { min: 1.4, max: 1.9 },
                break_even_months: { min: 5, max: 6 },
                pmmsy_subsidy_applicable: true
            })
        ]);

        // 6. Pangasius
        await query(`
        INSERT INTO knowledge_nodes (node_type, data)
        VALUES ('ECONOMIC_MODEL', $1::jsonb)
        `, [
            JSON.stringify({
                model_name: "Pangasius Intensive Model (1 Hectare)",
                system_type: CultivationSystem.TRADITIONAL_POND,
                target_species: "Pangasianodon hypophthalmus",
                capital_expenditure: {
                    land_preparation_inr_per_hectare: 15000,
                    pond_construction_inr_per_hectare: 40000,
                    equipment_costs: {
                        "Nets and Harvesting gear": 20000
                    },
                    initial_stocking_cost_inr: 75000,
                    contingency_percent: 5
                },
                operational_expenditure: {
                    feed_cost_inr_per_kg_fish: 40,
                    electricity_cost_inr_per_month: 1000,
                    labor_cost_inr_per_month: 6000,
                    medicine_cost_inr_per_cycle: 25000,
                    miscellaneous_percent: 5
                },
                revenue_projections: {
                    expected_yield_kg_per_hectare: { min: 10000, max: 15000 },
                    market_price_inr_per_kg: { min: 160, max: 190 }, // Using 175 Rs/kg from excel
                    harvest_cycles_per_year: 1
                },
                benefit_cost_ratio: { min: 1.3, max: 1.6 },
                break_even_months: { min: 6, max: 8 },
                pmmsy_subsidy_applicable: true
            })
        ]);

        // 7. Tilapia (Mono-sex)
        await query(`
        INSERT INTO knowledge_nodes (node_type, data)
        VALUES ('ECONOMIC_MODEL', $1::jsonb)
        `, [
            JSON.stringify({
                model_name: "Tilapia Semi-Intensive Model (1 Hectare)",
                system_type: CultivationSystem.BIOFLOC,
                target_species: "Oreochromis niloticus",
                capital_expenditure: {
                    land_preparation_inr_per_hectare: 15000,
                    pond_construction_inr_per_hectare: 50000,
                    equipment_costs: {
                        "Aerators": 50000,
                        "Water monitors": 10000
                    },
                    initial_stocking_cost_inr: 100000,
                    contingency_percent: 8
                },
                operational_expenditure: {
                    feed_cost_inr_per_kg_fish: 50,
                    electricity_cost_inr_per_month: 8000,
                    labor_cost_inr_per_month: 8000,
                    medicine_cost_inr_per_cycle: 50000,
                    miscellaneous_percent: 8
                },
                revenue_projections: {
                    expected_yield_kg_per_hectare: { min: 5000, max: 8000 },
                    market_price_inr_per_kg: { min: 150, max: 170 }, // Using ~160 Rs/kg from excel
                    harvest_cycles_per_year: 2
                },
                benefit_cost_ratio: { min: 1.4, max: 1.8 },
                break_even_months: { min: 5, max: 7 },
                pmmsy_subsidy_applicable: true
            })
        ]);

        logger.info('Species economics models successfully seeded!');
    } catch (error) {
        logger.error('Failed to run seed_economics:', error);
        process.exit(1);
    } finally {
        await closePool();
    }
}

// Call if executed directly
if (require.main === module) {
    seedEconomics();
}
