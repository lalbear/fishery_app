/**
 * Economics Simulation Model - WatermelonDB
 */

import { Model } from '@nozbe/watermelondb';
import { field, date, readonly } from '@nozbe/watermelondb/decorators';

export default class EconomicsSimulation extends Model {
  static table = 'economics_simulations';

  @field('simulation_id') simulationId!: string;
  @field('input_params') inputParams!: string; // JSON string
  @field('results') results!: string; // JSON string
  @field('recommended_species') recommendedSpecies?: string;
  @field('recommended_system') recommendedSystem?: string;
  @field('projected_revenue') projectedRevenue?: number;
  @field('breakeven_months') breakevenMonths?: number;
  @field('benefit_cost_ratio') benefitCostRatio?: number;
  @readonly @date('created_at') createdAt!: Date;

  getInputParams<T = any>(): T {
    try {
      return JSON.parse(this.inputParams);
    } catch {
      return {} as T;
    }
  }

  getResults<T = any>(): T {
    try {
      return JSON.parse(this.results);
    } catch {
      return {} as T;
    }
  }

  getRecommendedSpecies(): string[] {
    try {
      return JSON.parse(this.recommendedSpecies || '[]');
    } catch {
      return [];
    }
  }

  isProfitable(): boolean {
    return (this.benefitCostRatio || 0) > 1.0;
  }
}