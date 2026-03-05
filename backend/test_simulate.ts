import { EconomicsSimulatorService } from './src/services/EconomicsSimulatorService';
import { RiskTolerance, FarmerCategory } from './src/types';
import { closePool } from './src/db';

async function test() {
    try {
        console.log("Testing Penaeus monodon specifically...");
        const output = await EconomicsSimulatorService.simulate({
            landSizeHectares: 1,
            waterSourceSalinityUsCm: 25000,
            availableCapitalInr: 3000000,
            riskTolerance: RiskTolerance.MEDIUM,
            farmerCategory: FarmerCategory.GENERAL,
            stateCode: 'WB',
            districtCode: 'Hooghly',
            preferredSpecies: ['Penaeus monodon']
        });

        console.log("Recommended System:", output.recommendedSystem);
        console.log("Total CAPEX:", output.totalCapitalExpenditureInr);
        console.log("Subsidized CAPEX (Effective):", output.subsidizedCapitalExpenditureInr);
        console.log("Subsidy Amount:", output.subsidyAmountInr);
        console.log("Projected Gross Revenue:", output.projectedGrossRevenueInr);
        console.log("Projected Net Profit:", output.projectedNetProfitInr);
        console.log("Benefit Cost Ratio:", output.benefitCostRatio);
        console.log("Break-even Timeline (Months):", output.breakevenTimelineMonths);

    } catch (error: any) {
        console.error('Simulation Failed:', error.message);
    } finally {
        await closePool();
    }
}

test();
