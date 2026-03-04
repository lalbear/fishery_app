import { query, closePool } from './src/db';

async function seedBrackishModel() {
    try {
        console.log('Seeding BRACKISH_POND economic model...');

        const brackishModel = {
            model_name: "Brackish Water Pond - Shrimp/Coastal Fishes",
            system_type: "BRACKISH_POND",
            applicable_species: ["Litopenaeus vannamei", "Macrobrachium rosenbergii"],
            capital_expenditure: {
                land_preparation_inr_per_hectare: 35000,
                pond_construction_inr_per_hectare: 350000,
                equipment_costs: {
                    aerator_paddlewheel: 25000,
                    pumping_system: 45000,
                    linings_hdpe: 150000,
                    water_testing_kit: 7500
                },
                initial_stocking_cost_inr: 60000,
                contingency_percent: 15
            },
            operational_expenditure: {
                feed_cost_inr_per_kg_fish: 65,
                electricity_cost_inr_per_month: 12000,
                labor_cost_inr_per_month: 10000,
                medicine_cost_inr_per_cycle: 25000,
                miscellaneous_percent: 8
            },
            revenue_projections: {
                expected_yield_kg_per_hectare: { min: 5000, max: 10000 },
                market_price_inr_per_kg: { min: 250, max: 450 },
                harvest_cycles_per_year: 2
            },
            benefit_cost_ratio: { min: 1.4, max: 1.9 },
            break_even_months: { min: 12, max: 18 },
            pmmsy_subsidy_applicable: true,
            unit_cost_ceiling_inr: 700000
        };

        await query(`
      INSERT INTO knowledge_nodes (id, parent_id, node_type, data) 
      VALUES ($1, $2, $3, $4)
      ON CONFLICT (id) DO UPDATE SET data = EXCLUDED.data
    `, [
            '66666666-6666-6666-6666-666666666664',
            '00000000-0000-0000-0000-000000000001',
            'ECONOMIC_MODEL',
            JSON.stringify(brackishModel)
        ]);

        console.log('BRACKISH_POND seeded successfully.');
        await closePool();
    } catch (error) {
        console.error('Error seeding data:', error);
    }
}

seedBrackishModel();
