/**
 * Economics Simulator Service
 * Calculates financial projections, ROI, and viability for aquaculture projects
 * Implements PMMSY subsidy integration and sensitivity analysis
 */

import { v4 as uuidv4 } from 'uuid';
import {
  EconomicsSimulatorInput,
  EconomicsSimulatorOutput,
  SpeciesRecommendation,
  RiskAnalysisProfile,
  RiskFactor,
  MonthlyCashFlow,
  SensitivityAnalysis,
  CultivationSystem,
  FarmerCategory,
  RiskTolerance,
  WaterType,
  SpeciesData,
  EconomicData
} from '../types';
import { PMMSYSubsidyService } from './PMMSYSubsidyService';
import { query } from '../db';
import { logger } from '../utils/logger';

// Equipment cost constants from environment
const EQUIPMENT_COSTS = {
  AERATOR_18W: parseInt(process.env.AERATOR_18W_INR || '1600'),
  VORTEX_BLOWER_550W: parseInt(process.env.VORTEX_BLOWER_550W_INR || '13500'),
  BIOFLOC_TARPAULIN_650GSM: parseInt(process.env.BIOFLOC_TARPAULIN_650GSM_INR || '31000'),
  RAS_PUMP_1HP: parseInt(process.env.RAS_PUMP_1HP_INR || '8500'),
  UV_STERILIZER_40W: parseInt(process.env.UV_STERILIZER_40W_INR || '12000')
};

// Salinity thresholds (μS/cm)
const SALINITY_THRESHOLDS = {
  FRESHWATER_MAX: 1000,
  BRACKISH_MIN: 1000,
  BRACKISH_MAX: 3000,
  SALINE_MIN: 3000
};

export class EconomicsSimulatorService {
  /**
   * Main simulation entry point
   * Calculates complete economics model based on input parameters
   */
  static async simulate(input: EconomicsSimulatorInput): Promise<EconomicsSimulatorOutput> {
    logger.info('Starting economics simulation', {
      landSize: input.landSizeHectares,
      salinity: input.waterSourceSalinityUsCm
    });

    const recommendationId = uuidv4();

    // Step 1: Determine water classification
    const waterType = this.classifyWater(input.waterSourceSalinityUsCm);

    // Step 2: Filter eligible species based on salinity
    const eligibleSpecies = await this.getEligibleSpecies(waterType, input.preferredSpecies);

    // Step 3: Determine optimal cultivation system (scaled per hectare - Bug 4 fix)
    const recommendedSystem = this.determineOptimalSystem(
      waterType,
      input.riskTolerance,
      input.availableCapitalInr / input.landSizeHectares
    );

    // Step 4: Get economic model for recommended system
    const economicModel = await this.getEconomicModel(recommendedSystem, input.preferredSpecies);

    // Step 5: Calculate CAPEX with equipment costs
    const totalCapex = this.calculateTotalCapex(
      economicModel,
      input.landSizeHectares,
      recommendedSystem
    );

    // Step 6: Apply PMMSY subsidy (pass land area - Bug 3 fix)
    const { effectiveCapex, subsidyAmount } = PMMSYSubsidyService.calculateEffectiveCapex(
      totalCapex,
      input.farmerCategory,
      this.mapSystemToProjectType(recommendedSystem, waterType),
      input.landSizeHectares
    );

    // Step 7: Calculate OPEX (Includes Feed - Bug 5 fix)
    const { monthlyOpex, totalOpexPerCycle, totalFeedCost } = this.calculateOpexWithFeed(
      economicModel,
      input.landSizeHectares,
      (economicModel as any).culture_period_months?.max || 12
    );

    // Step 8: Calculate revenue projections
    const { projectedRevenue, expectedYield } = this.calculateRevenue(
      eligibleSpecies,
      economicModel,
      input.landSizeHectares
    );

    const cultureMonths = (economicModel as any).culture_period_months?.max || 12;

    // Step 10: Generate species recommendations with scores
    const speciesRecommendations = this.generateSpeciesRecommendations(
      eligibleSpecies,
      input,
      economicModel,
      expectedYield
    );

    // Step 11: Base main summary metrics on the best recommendation (Bug FIX)
    const bestRec = speciesRecommendations[0];
    const finalRevenue = bestRec ? bestRec.expectedRevenueInr : projectedRevenue;

    // Calculate final metrics based on the best species performance
    const finalNetProfit = finalRevenue - totalOpexPerCycle - effectiveCapex;
    const finalTotalInvestment = effectiveCapex + totalOpexPerCycle;
    const finalBcr = finalTotalInvestment > 0 ? (finalRevenue / finalTotalInvestment) : 0;

    const finalBreakEvenMonths = this.calculateBreakEven(
      effectiveCapex,
      monthlyOpex,
      finalRevenue,
      cultureMonths
    );

    // Step 12: Build risk analysis profile
    const riskProfile = this.buildRiskAnalysis(
      input,
      waterType,
      recommendedSystem,
      speciesRecommendations
    );

    // Step 13: Generate monthly cash flow
    const monthlyCashFlow = this.generateCashFlow(
      effectiveCapex,
      monthlyOpex,
      finalRevenue,
      finalBreakEvenMonths,
      cultureMonths
    );

    // Step 14: Perform sensitivity analysis
    const sensitivityAnalysis = this.performSensitivityAnalysis(
      effectiveCapex,
      totalOpexPerCycle,
      finalRevenue,
      monthlyCashFlow,
      finalBreakEvenMonths
    );

    return {
      recommendationId,
      recommendedSpecies: speciesRecommendations,
      recommendedSystem,
      projectedGrossRevenueInr: Math.round(finalRevenue),
      projectedNetProfitInr: Math.round(finalNetProfit),
      breakevenTimelineMonths: Math.round(finalBreakEvenMonths),
      totalCapitalExpenditureInr: Math.round(totalCapex),
      subsidizedCapitalExpenditureInr: Math.round(effectiveCapex),
      subsidyAmountInr: Math.round(subsidyAmount),
      benefitCostRatio: Math.round(finalBcr * 100) / 100,
      riskAnalysisProfile: riskProfile,
      monthlyCashFlow,
      sensitivityAnalysis
    };
  }

  private static classifyWater(salinityUsCm: number): WaterType {
    if (salinityUsCm <= SALINITY_THRESHOLDS.FRESHWATER_MAX) {
      return WaterType.FRESHWATER;
    } else if (salinityUsCm <= SALINITY_THRESHOLDS.BRACKISH_MAX) {
      return WaterType.BRACKISH;
    } else {
      return WaterType.SALINE;
    }
  }

  private static async getEligibleSpecies(
    waterType: WaterType,
    preferredSpecies?: string[]
  ): Promise<SpeciesData[]> {
    let queryText = `
      SELECT data FROM knowledge_nodes 
      WHERE node_type = 'SPECIES'
    `;

    if (waterType === WaterType.BRACKISH || waterType === WaterType.SALINE) {
      queryText += `
        AND (
          (data->'biological_parameters'->'salinity_tolerance_ppt'->>'max')::numeric > 5
          OR data->>'scientific_name' LIKE '%vannamei%'
          OR data->>'scientific_name' LIKE '%Macrobrachium%'
        )
      `;
    }

    if (preferredSpecies && preferredSpecies.length > 0) {
      const speciesList = preferredSpecies.map(s => `'${s}'`).join(',');
      queryText += ` AND data->>'scientific_name' IN (${speciesList})`;
    }

    const result = await query<{ data: SpeciesData }>(queryText);
    return result.rows.map(r => r.data);
  }

  private static determineOptimalSystem(
    waterType: WaterType,
    riskTolerance: RiskTolerance,
    capitalPerHectare: number
  ): CultivationSystem {
    if (waterType === WaterType.SALINE || waterType === WaterType.BRACKISH) {
      return CultivationSystem.BRACKISH_POND;
    }

    if (capitalPerHectare < 150000) {
      return CultivationSystem.TRADITIONAL_POND;
    }

    if (riskTolerance === RiskTolerance.HIGH && capitalPerHectare > 1500000) {
      return CultivationSystem.RAS;
    }

    if (capitalPerHectare > 600000) {
      return CultivationSystem.BIOFLOC;
    }

    return CultivationSystem.TRADITIONAL_POND;
  }

  private static async getEconomicModel(
    system: CultivationSystem,
    preferredSpecies?: string[]
  ): Promise<EconomicData> {

    // First try: Find an exact species match for the given system
    if (preferredSpecies && preferredSpecies.length > 0) {
      for (const species of preferredSpecies) {
        const exactMatch = await query<{ data: EconomicData }>(`
          SELECT data FROM knowledge_nodes 
          WHERE node_type = 'ECONOMIC_MODEL' 
          AND data->>'system_type' = $1
          AND data->>'target_species' = $2
          LIMIT 1
        `, [system, species]);

        if (exactMatch.rows.length > 0) {
          logger.info(`Loaded exact economic model for species: ${species} using system: ${system}`);
          return exactMatch.rows[0].data;
        }
      }
    }

    // Second try: Find ANY model matching the target species regardless of system (if strongly preferred)
    if (preferredSpecies && preferredSpecies.length > 0) {
      for (const species of preferredSpecies) {
        const speciesMatch = await query<{ data: EconomicData }>(`
            SELECT data FROM knowledge_nodes 
            WHERE node_type = 'ECONOMIC_MODEL' 
            AND data->>'target_species' = $1
            LIMIT 1
          `, [species]);

        if (speciesMatch.rows.length > 0) {
          logger.info(`Loaded specific economic model for species: ${species} (ignoring preferred system)`);
          return speciesMatch.rows[0].data;
        }
      }
    }

    // Third try: Find a generic model for the target system without a specific species
    const result = await query<{ data: EconomicData }>(`
      SELECT data FROM knowledge_nodes 
      WHERE node_type = 'ECONOMIC_MODEL' 
      AND data->>'system_type' = $1
      AND data->>'target_species' IS NULL
      LIMIT 1
    `, [system]);

    if (result.rows.length > 0) {
      logger.info(`Loaded generic economic model for system: ${system}`);
      return result.rows[0].data;
    }

    // Fallback if nothing else works
    logger.warn(`No economic model found for system: ${system} or preferred species. Falling back to TRADITIONAL_POND.`);
    const fallback = await query<{ data: EconomicData }>(`
      SELECT data FROM knowledge_nodes 
      WHERE node_type = 'ECONOMIC_MODEL' 
      AND data->>'system_type' = 'TRADITIONAL_POND'
      LIMIT 1
    `);

    if (fallback.rows.length === 0) {
      throw new Error(`Critical: No economic models found in database.`);
    }
    return fallback.rows[0].data;
  }

  private static calculateTotalCapex(
    model: EconomicData,
    landSizeHectares: number,
    system: CultivationSystem
  ): number {
    const capex = model.capital_expenditure;
    let total = 0;

    total += (capex.land_preparation_inr_per_hectare || 0) * landSizeHectares;
    total += (capex.pond_construction_inr_per_hectare || 0) * landSizeHectares;

    if (system === CultivationSystem.BIOFLOC) {
      const tanksNeeded = Math.ceil(landSizeHectares / 0.1);
      total += tanksNeeded * EQUIPMENT_COSTS.BIOFLOC_TARPAULIN_650GSM;
      total += tanksNeeded * EQUIPMENT_COSTS.VORTEX_BLOWER_550W;
    } else if (system === CultivationSystem.TRADITIONAL_POND || system === CultivationSystem.BRACKISH_POND) {
      const aeratorsNeeded = Math.ceil(landSizeHectares / 0.5);
      total += aeratorsNeeded * EQUIPMENT_COSTS.AERATOR_18W;
    } else if (system === CultivationSystem.RAS) {
      total += (EQUIPMENT_COSTS.RAS_PUMP_1HP * 4) * landSizeHectares;
      total += (EQUIPMENT_COSTS.UV_STERILIZER_40W * 2) * landSizeHectares;
    }

    total += (capex.initial_stocking_cost_inr || 0) * landSizeHectares;
    total += total * ((capex.contingency_percent || 0) / 100);

    return total;
  }

  private static mapSystemToProjectType(
    system: CultivationSystem,
    waterType: WaterType
  ): 'FRESHWATER' | 'BRACKISH' | 'RAS' | 'INTEGRATED' {
    if (system === CultivationSystem.RAS) return 'RAS';
    if (waterType === WaterType.BRACKISH || waterType === WaterType.SALINE || system === CultivationSystem.BRACKISH_POND) return 'BRACKISH';
    return 'FRESHWATER';
  }

  private static calculateOpexWithFeed(
    model: EconomicData,
    landSizeHectares: number,
    months: number
  ): { monthlyOpex: number; totalOpexPerCycle: number; totalFeedCost: number } {
    const opex = model.operational_expenditure;
    const revenue = model.revenue_projections;

    // Average expected yield for calculations
    const avgYieldKg = ((revenue.expected_yield_kg_per_hectare.min + revenue.expected_yield_kg_per_hectare.max) / 2) * landSizeHectares;

    // Feed logic: 50% - 70% of cost is usually feed. 
    // We use the feed_cost_inr_per_kg_fish metric.
    const totalFeedCost = avgYieldKg * (opex.feed_cost_inr_per_kg_fish || 45);

    const laborElectricityMonthly = (
      (opex.electricity_cost_inr_per_month || 0) +
      (opex.labor_cost_inr_per_month || 0)
    ) * landSizeHectares;

    const totalMedicine = (opex.medicine_cost_inr_per_cycle || 0) * landSizeHectares;

    const subTotal = (laborElectricityMonthly * months) + totalFeedCost + totalMedicine;
    const totalOpexPerCycle = subTotal + (subTotal * ((opex.miscellaneous_percent || 0) / 100));

    // Monthly average including feed amortized
    const monthlyOpex = totalOpexPerCycle / months;

    return { monthlyOpex, totalOpexPerCycle, totalFeedCost };
  }

  private static calculateRevenue(
    species: SpeciesData[],
    model: EconomicData,
    landSizeHectares: number
  ): { projectedRevenue: number; expectedYield: number } {
    const revenue = model.revenue_projections;
    const avgYield = (revenue.expected_yield_kg_per_hectare.min +
      revenue.expected_yield_kg_per_hectare.max) / 2;
    const avgPrice = (revenue.market_price_inr_per_kg.min +
      revenue.market_price_inr_per_kg.max) / 2;

    const totalYield = avgYield * landSizeHectares;
    const totalRevenue = totalYield * avgPrice;

    return { projectedRevenue: totalRevenue, expectedYield: totalYield };
  }

  private static calculateBreakEven(
    effectiveCapex: number,
    monthlyOpex: number,
    projectedRevenue: number,
    cultureMonths: number
  ): number {
    // Correct logic: Payback usually happens in cycles.
    // Fixed recovery = Single cycle revenue - single cycle opex
    const profitPerCycle = projectedRevenue - (monthlyOpex * cultureMonths);

    if (profitPerCycle <= 0) return 999; // Never breaks even

    const cyclesToRecover = effectiveCapex / profitPerCycle;
    return Math.ceil(cyclesToRecover * cultureMonths);
  }

  private static generateSpeciesRecommendations(
    species: SpeciesData[],
    input: EconomicsSimulatorInput,
    model: EconomicData,
    expectedYield: number
  ): SpeciesRecommendation[] {
    return species.map(s => {
      const avgFcr = (s.economic_parameters.feed_conversion_ratio.min +
        s.economic_parameters.feed_conversion_ratio.max) / 2;
      const avgPrice = (s.economic_parameters.market_price_per_kg_inr.min +
        s.economic_parameters.market_price_per_kg_inr.max) / 2;

      let score = 70;

      if (input.availableCapitalInr > 500000) score += 10;
      else if (input.availableCapitalInr < 100000) score -= 10;

      if (input.riskTolerance === RiskTolerance.HIGH && avgFcr < 1.5) score += 10;
      if (input.riskTolerance === RiskTolerance.LOW && avgFcr < 1.5) score += 15;

      const yieldScore = Math.min(20, (expectedYield / 1000));
      score += yieldScore;

      const speciesYield = expectedYield * (s.economic_parameters.survival_rate_percent.max / 100);
      const speciesRevenue = speciesYield * avgPrice;

      return {
        speciesId: s.scientific_name,
        commonName: s.common_names.en,
        scientificName: s.scientific_name,
        compatibilityScore: Math.min(100, Math.round(score)),
        expectedYieldKg: Math.round(speciesYield),
        expectedRevenueInr: Math.round(speciesRevenue),
        compatibilityReasons: [
          `Optimal temperature range: ${s.biological_parameters.temperature_celsius.min}°C - ${s.biological_parameters.temperature_celsius.max}°C`,
          `Feed Conversion Ratio: ${avgFcr}`,
          `Expected survival rate: ${s.economic_parameters.survival_rate_percent.max}%`
        ]
      };
    }).sort((a, b) => b.compatibilityScore - a.compatibilityScore);
  }

  private static buildRiskAnalysis(
    input: EconomicsSimulatorInput,
    waterType: WaterType,
    system: CultivationSystem,
    speciesRecs: SpeciesRecommendation[]
  ): RiskAnalysisProfile {
    const riskFactors: RiskFactor[] = [];
    let overallRisk = input.riskTolerance;

    if (waterType === WaterType.SALINE) {
      riskFactors.push({
        category: 'Water Quality',
        probability: 0.3,
        impact: 0.8,
        description: 'High salinity limits species options'
      });
    }

    if (input.availableCapitalInr < 100000) {
      riskFactors.push({
        category: 'Financial',
        probability: 0.4,
        impact: 0.6,
        description: 'Limited capital may constrain emergency responses'
      });
    }

    if (system === CultivationSystem.RAS) {
      riskFactors.push({
        category: 'Technical',
        probability: 0.35,
        impact: 0.9,
        description: 'RAS requires continuous power and technical expertise'
      });
      overallRisk = RiskTolerance.HIGH;
    }

    if (system === CultivationSystem.BIOFLOC) {
      riskFactors.push({
        category: 'Operational',
        probability: 0.25,
        impact: 0.5,
        description: 'Biofloc requires consistent aeration and monitoring'
      });
    }

    return {
      overallRisk,
      riskFactors,
      mitigationStrategies: this.getMitigationStrategies(riskFactors),
      mortalityRiskPercent: 15,
      marketPriceVolatility: 0.15
    };
  }

  private static getMitigationStrategies(risks: RiskFactor[]): string[] {
    const strategies: string[] = [];
    const riskCategories = new Set(risks.map(r => r.category));

    if (riskCategories.has('Water Quality')) {
      strategies.push('Install water quality monitoring system');
      strategies.push('Maintain emergency water exchange capability');
    }

    if (riskCategories.has('Financial')) {
      strategies.push('Apply for PMMSY subsidy to reduce capital burden');
      strategies.push('Consider cooperative farming to share costs');
    }

    if (riskCategories.has('Technical')) {
      strategies.push('Arrange backup power supply (generator)');
      strategies.push('Receive training on system management');
    }

    if (riskCategories.has('Operational')) {
      strategies.push('Implement daily monitoring protocol');
      strategies.push('Maintain relationship with technical expert');
    }

    return strategies;
  }

  private static generateCashFlow(
    capex: number,
    monthlyOpex: number,
    projectedRevenue: number,
    breakEvenMonths: number,
    cultureMonths: number
  ): MonthlyCashFlow[] {
    const cashFlow: MonthlyCashFlow[] = [];
    let cumulativeCashFlow = -capex;

    for (let month = 1; month <= cultureMonths; month++) {
      const revenue = month === cultureMonths ? projectedRevenue : 0;
      const staticExpenses = month === 1 ? capex : monthlyOpex;
      const netCashFlow = revenue - staticExpenses;
      cumulativeCashFlow += netCashFlow;

      cashFlow.push({
        month,
        revenue: Math.round(revenue),
        expenses: Math.round(staticExpenses),
        netCashFlow: Math.round(netCashFlow),
        cumulativeCashFlow: Math.round(cumulativeCashFlow)
      });
    }

    return cashFlow;
  }

  private static performSensitivityAnalysis(
    capex: number,
    opex: number,
    revenue: number,
    cashFlow: MonthlyCashFlow[],
    breakEvenMonths: number
  ): SensitivityAnalysis {
    const baseProfit = revenue - capex - opex;
    const baseBcRatio = revenue / (capex + opex);

    return {
      bestCase: {
        netProfit: Math.round(baseProfit * 1.25),
        breakEvenMonths: Math.max(1, Math.round(breakEvenMonths * 0.8)),
        benefitCostRatio: Math.round(baseBcRatio * 1.2 * 100) / 100
      },
      worstCase: {
        netProfit: Math.round(baseProfit * 0.6),
        breakEvenMonths: Math.round(breakEvenMonths * 1.4),
        benefitCostRatio: Math.round(baseBcRatio * 0.7 * 100) / 100
      },
      priceDrop10Percent: Math.round(revenue * 0.9 - capex - opex),
      priceIncrease10Percent: Math.round(revenue * 1.1 - capex - opex),
      yieldDrop15Percent: Math.round(revenue * 0.85 - capex - opex),
      feedCostIncrease20Percent: Math.round(revenue - capex - (opex * 1.2))
    };
  }
}
