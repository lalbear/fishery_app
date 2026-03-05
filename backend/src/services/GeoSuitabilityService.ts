/**
 * GeoSuitabilityService
 * Analyzes geographic location data for aquaculture suitability
 * Integrates salinity mapping, soil analysis, and climate data
 */

import {
  GeoSuitabilityInput,
  GeoSuitabilityOutput,
  SystemSuitability,
  SoilAnalysis,
  ClimateAnalysis,
  CultivationSystem,
  WaterType,
  SpeciesData
} from '../types';
import { query } from '../db';
import { logger } from '../utils/logger';

// Salinity classification thresholds (μS/cm)
const SALINITY_THRESHOLDS = {
  FRESHWATER_MAX: 1000,
  BRACKISH_MIN: 1000,
  BRACKISH_MAX: 3000,
  SALINE_MIN: 3000,
  HIGH_SALINITY: 2000  // Critical threshold for freshwater species exclusion
};

// Distance from coast thresholds (km)
const COASTAL_THRESHOLDS = {
  TIDAL_ZONE: 5,
  COASTAL_PLAIN: 25,
  INLAND: 50
};

export class GeoSuitabilityService {
  /**
   * Main analysis method for geographic suitability
   * Evaluates water quality, soil conditions, and climate factors
   */
  static async analyzeSuitability(input: GeoSuitabilityInput): Promise<GeoSuitabilityOutput> {
    logger.info('Analyzing geographic suitability', {
      lat: input.latitude,
      lng: input.longitude,
      state: input.stateCode
    });

    const locationId = `${input.latitude.toFixed(4)},${input.longitude.toFixed(4)}`;

    // Step 1: Classify water quality
    const waterQualityClassification = this.classifyWaterQuality(input.measuredSalinityUsCm);

    // Step 2: Get soil analysis
    const soilAnalysis = await this.analyzeSoil(input.stateCode, input.districtCode);

    // Step 3: Get climate analysis
    const climateAnalysis = this.analyzeClimate(input.stateCode);

    // Step 4: Determine suitable cultivation systems
    const recommendedSystems = await this.determineSuitableSystems(
      waterQualityClassification,
      soilAnalysis,
      climateAnalysis,
      input
    );

    // Step 5: Calculate overall suitability score
    const suitabilityScore = this.calculateSuitabilityScore(
      recommendedSystems,
      soilAnalysis,
      climateAnalysis
    );

    // Step 6: Identify restricted species based on salinity
    const restrictedSpecies = await this.getRestrictedSpecies(waterQualityClassification);

    // Step 7: Generate warnings
    const warnings = this.generateWarnings(
      waterQualityClassification,
      input.measuredSalinityUsCm,
      recommendedSystems
    );

    return {
      locationId,
      suitabilityScore,
      waterQualityClassification,
      recommendedSystems,
      restrictedSpecies,
      soilAnalysis,
      climateAnalysis,
      warnings
    };
  }

  /**
   * Classify water quality based on salinity levels
   */
  private static classifyWaterQuality(measuredSalinityUsCm?: number): WaterType {
    if (!measuredSalinityUsCm) {
      // Default to freshwater if no measurement
      return WaterType.FRESHWATER;
    }

    if (measuredSalinityUsCm <= SALINITY_THRESHOLDS.FRESHWATER_MAX) {
      return WaterType.FRESHWATER;
    } else if (measuredSalinityUsCm <= SALINITY_THRESHOLDS.BRACKISH_MAX) {
      return WaterType.BRACKISH;
    } else {
      return WaterType.SALINE;
    }
  }

  /**
   * Analyze soil conditions for the location
   */
  private static async analyzeSoil(
    stateCode: string,
    districtCode: string
  ): Promise<SoilAnalysis> {
    // Query geographic zone data from database
    const result = await query<{ data: any }>(`
      SELECT data FROM geographic_zones
      WHERE state_code = $1 AND $2 = ANY(district_codes)
      LIMIT 1
    `, [stateCode, districtCode]);

    if (result.rows.length > 0 && result.rows[0].data) {
      const zone = result.rows[0].data;
      return {
        texture: zone.soil_texture || 'Loamy',
        ph: zone.ph || { min: 6.5, max: 8.0 },
        organicMatterPercent: { min: 1.0, max: 3.0 },
        permeability: zone.permeability || 'Moderate',
        suitability: zone.soil_suitability || 'GOOD'
      };
    }

    // Default soil analysis based on state
    return this.getDefaultSoilAnalysis(stateCode);
  }

  /**
   * Get default soil analysis for states without specific data
   */
  private static getDefaultSoilAnalysis(stateCode: string): SoilAnalysis {
    // High salinity states
    const salineStates = ['RJ', 'GJ', 'HR', 'PB'];
    // Coastal states with brackish water potential
    const coastalStates = ['AP', 'TN', 'KL', 'KA', 'MH', 'WB', 'OR'];

    if (salineStates.includes(stateCode)) {
      return {
        texture: 'Sandy Loam',
        ph: { min: 8.0, max: 9.0 },
        organicMatterPercent: { min: 0.5, max: 1.5 },
        permeability: 'High',
        suitability: 'FAIR'
      };
    }

    if (coastalStates.includes(stateCode)) {
      return {
        texture: 'Clay Loam',
        ph: { min: 6.5, max: 8.0 },
        organicMatterPercent: { min: 1.5, max: 3.5 },
        permeability: 'Low to Moderate',
        suitability: 'EXCELLENT'
      };
    }

    // Default for other states
    return {
      texture: 'Loamy',
      ph: { min: 6.5, max: 7.5 },
      organicMatterPercent: { min: 1.0, max: 2.5 },
      permeability: 'Moderate',
      suitability: 'GOOD'
    };
  }

  /**
   * Analyze climate conditions
   */
  private static analyzeClimate(stateCode: string): ClimateAnalysis {
    // Tropical states - excellent for aquaculture
    const tropicalStates = ['KL', 'TN', 'AP', 'KA', 'OR', 'WB'];
    // Hot/dry states - challenging
    const aridStates = ['RJ', 'GJ'];
    // Temperate states - moderate
    const temperateStates = ['MH', 'MP', 'UP', 'BR', 'JH'];

    let temperatureSuitability = 85;
    let extremeWeatherRisk: 'LOW' | 'MEDIUM' | 'HIGH' = 'LOW';
    let rainfallPattern = 'Monsoon-dependent';
    let seasonalVariations: string[] = [];

    if (tropicalStates.includes(stateCode)) {
      temperatureSuitability = 95;
      extremeWeatherRisk = 'MEDIUM';
      rainfallPattern = 'High rainfall, tropical climate';
      seasonalVariations = ['Monsoon (Jun-Sep)', 'Post-monsoon (Oct-Jan)', 'Summer (Feb-May)'];
    } else if (aridStates.includes(stateCode)) {
      temperatureSuitability = 60;
      extremeWeatherRisk = 'HIGH';
      rainfallPattern = 'Low rainfall, arid climate';
      seasonalVariations = ['Extreme summer (Apr-Jun)', 'Monsoon (Jul-Sep)', 'Winter (Oct-Mar)'];
    } else if (temperateStates.includes(stateCode)) {
      temperatureSuitability = 80;
      extremeWeatherRisk = 'MEDIUM';
      rainfallPattern = 'Moderate rainfall';
      seasonalVariations = ['Winter (Nov-Feb)', 'Summer (Mar-Jun)', 'Monsoon (Jul-Oct)'];
    }

    return {
      temperatureSuitability,
      rainfallPattern,
      seasonalVariations,
      extremeWeatherRisk
    };
  }

  /**
   * Determine suitable cultivation systems based on all factors
   */
  private static async determineSuitableSystems(
    waterType: WaterType,
    soilAnalysis: SoilAnalysis,
    climateAnalysis: ClimateAnalysis,
    input: GeoSuitabilityInput
  ): Promise<SystemSuitability[]> {
    const systems: SystemSuitability[] = [];

    // Evaluate each system type
    for (const system of Object.values(CultivationSystem)) {
      const suitability = await this.evaluateSystem(
        system,
        waterType,
        soilAnalysis,
        climateAnalysis,
        input
      );

      if (suitability.suitabilityScore > 0) {
        systems.push(suitability);
      }
    }

    // Sort by suitability score (descending)
    return systems.sort((a, b) => b.suitabilityScore - a.suitabilityScore);
  }

  /**
   * Evaluate a specific cultivation system
   */
  private static async evaluateSystem(
    system: CultivationSystem,
    waterType: WaterType,
    soilAnalysis: SoilAnalysis,
    climateAnalysis: ClimateAnalysis,
    input: GeoSuitabilityInput
  ): Promise<SystemSuitability> {
    let score = 50; // Base score
    const limitingFactors: string[] = [];
    const advantages: string[] = [];

    switch (system) {
      case CultivationSystem.TRADITIONAL_POND:
        if (waterType === WaterType.FRESHWATER) {
          score += 30;
          advantages.push('Ideal for freshwater fish culture');
        } else {
          score -= 20;
          limitingFactors.push('Not suitable for brackish/saline water');
        }

        if (soilAnalysis.suitability === 'EXCELLENT' || soilAnalysis.suitability === 'GOOD') {
          score += 10;
          advantages.push('Soil suitable for pond construction');
        }

        if (input.waterSourceType === 'CANAL' || input.waterSourceType === 'RIVER') {
          score += 10;
          advantages.push('Reliable water source available');
        }
        break;

      case CultivationSystem.BIOFLOC:
        if (waterType === WaterType.FRESHWATER) {
          score += 25;
          advantages.push('Suitable for intensive freshwater production');
        }

        if (climateAnalysis.extremeWeatherRisk === 'LOW') {
          score += 10;
          advantages.push('Climate suitable for biofloc management');
        } else {
          score -= 5;
          limitingFactors.push('Extreme temperatures may affect biofloc stability');
        }

        advantages.push('Higher yield per unit area');
        advantages.push('Lower water requirement than traditional ponds');
        break;

      case CultivationSystem.RAS:
        if (climateAnalysis.extremeWeatherRisk === 'HIGH') {
          score += 10;
          advantages.push('Controlled environment protects from extreme weather');
        }

        score -= 10; // Higher complexity
        limitingFactors.push('Requires technical expertise');
        limitingFactors.push('High capital investment required');
        limitingFactors.push('Continuous power supply essential');

        advantages.push('Highest production per unit area');
        advantages.push('Water-independent operation');
        break;

      case CultivationSystem.BRACKISH_POND:
        if (waterType === WaterType.BRACKISH || waterType === WaterType.SALINE) {
          score += 40;
          advantages.push('Ideal for shrimp and brackish water species');
          advantages.push('Water salinity matches requirements');
        } else {
          score = 0; // Not applicable for freshwater
          limitingFactors.push('Requires brackish/saline water');
        }

        if (soilAnalysis.permeability === 'Low to Moderate') {
          score += 10;
          advantages.push('Soil suitable for brackish water ponds');
        }
        break;

      case CultivationSystem.FLOATING_CAGE:
        if (input.waterSourceType === 'RIVER' || input.waterSourceType === 'TANK') {
          score += 30;
          advantages.push('Open water body available for cage culture');
        } else {
          score -= 20;
          limitingFactors.push('Requires large open water body');
        }

        if (waterType === WaterType.FRESHWATER) {
          score += 10;
        }
        break;

      case CultivationSystem.ORNAMENTAL_UNIT:
        score += 20;
        advantages.push('Low land requirement');
        advantages.push('High-value niche market');
        limitingFactors.push('Requires specialized knowledge');
        limitingFactors.push('Limited market size');
        break;
    }

    // Adjust for climate
    if (climateAnalysis.temperatureSuitability > 80) {
      score += 5;
    } else if (climateAnalysis.temperatureSuitability < 70) {
      score -= 5;
      limitingFactors.push('Suboptimal temperature range');
    }

    return {
      system,
      suitabilityScore: Math.max(0, Math.min(100, score)),
      confidence: this.calculateConfidence(limitingFactors.length),
      limitingFactors,
      advantages
    };
  }

  /**
   * Calculate confidence level based on number of limiting factors
   */
  private static calculateConfidence(limitingFactorCount: number): number {
    if (limitingFactorCount === 0) return 0.9;
    if (limitingFactorCount === 1) return 0.75;
    if (limitingFactorCount === 2) return 0.6;
    return 0.45;
  }

  /**
   * Calculate overall suitability score
   */
  private static calculateSuitabilityScore(
    systems: SystemSuitability[],
    soilAnalysis: SoilAnalysis,
    climateAnalysis: ClimateAnalysis
  ): number {
    if (systems.length === 0) return 0;

    // Weight top 3 systems
    const topSystems = systems.slice(0, 3);
    const systemScore = topSystems.reduce((acc, sys, idx) => {
      const weight = 1 - (idx * 0.2); // 1.0, 0.8, 0.6
      return acc + (sys.suitabilityScore * weight);
    }, 0) / topSystems.reduce((acc, _, idx) => acc + (1 - idx * 0.2), 0);

    // Adjust for soil and climate
    const soilMultiplier = soilAnalysis.suitability === 'EXCELLENT' ? 1.1 :
      soilAnalysis.suitability === 'GOOD' ? 1.0 :
        soilAnalysis.suitability === 'FAIR' ? 0.85 : 0.7;

    const climateMultiplier = climateAnalysis.temperatureSuitability / 100;

    return Math.round(systemScore * soilMultiplier * climateMultiplier);
  }

  /**
   * Get species restricted by water quality
   * CRITICAL: If salinity > 2000 μS/cm, exclude freshwater carps
   */
  private static async getRestrictedSpecies(
    waterType: WaterType
  ): Promise<string[]> {
    if (waterType === WaterType.FRESHWATER) {
      return []; // No restrictions in freshwater
    }

    // Get freshwater-only species
    const result = await query<{ scientific_name: string }>(`
      SELECT data->>'scientific_name' as scientific_name
      FROM knowledge_nodes
      WHERE node_type = 'SPECIES'
      AND (
        (data->'biological_parameters'->'salinity_tolerance_ppt'->>'max')::numeric < 5
        OR data->>'category' = 'INDIAN_MAJOR_CARP'
      )
    `);

    return result.rows.map(r => r.scientific_name);
  }

  /**
   * Generate warnings based on analysis
   */
  private static generateWarnings(
    waterType: WaterType,
    measuredSalinityUsCm: number | undefined,
    systems: SystemSuitability[]
  ): string[] {
    const warnings: string[] = [];

    if (measuredSalinityUsCm && measuredSalinityUsCm > SALINITY_THRESHOLDS.HIGH_SALINITY) {
      warnings.push('High salinity detected (>2000 μS/cm). Freshwater species are NOT suitable.');
      warnings.push('Recommend brackish water species: Vannamei shrimp, Scampi');
    }

    if (waterType === WaterType.SALINE) {
      warnings.push('Saline water detected. Only specialized brackish/saline tolerant species recommended.');
    }

    if (systems.length === 0 || systems[0].suitabilityScore < 40) {
      warnings.push('Low suitability for aquaculture. Consider soil treatment or alternative locations.');
    }

    if (systems.length > 0 && systems[0].limitingFactors.length > 2) {
      warnings.push(`Top recommended system (${systems[0].system}) has significant limitations.`);
    }

    return warnings;
  }

  /**
   * Validate coordinates are within Indian boundaries (approximate)
   */
  static validateCoordinates(latitude: number, longitude: number): boolean {
    // India approximate boundaries
    const INDIA_BOUNDS = {
      latMin: 6.5,
      latMax: 37.0,
      lngMin: 68.0,
      lngMax: 97.5
    };

    return (
      latitude >= INDIA_BOUNDS.latMin &&
      latitude <= INDIA_BOUNDS.latMax &&
      longitude >= INDIA_BOUNDS.lngMin &&
      longitude <= INDIA_BOUNDS.lngMax
    );
  }
}