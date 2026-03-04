/**
 * Species Model - WatermelonDB
 */

import { Model } from '@nozbe/watermelondb';
import { field, date, readonly } from '@nozbe/watermelondb/decorators';

export default class Species extends Model {
  static table = 'species';

  @field('species_id') speciesId!: string;
  @field('scientific_name') scientificName!: string;
  @field('common_names') commonNames!: string; // JSON string
  @field('category') category!: string;
  @field('biological_parameters') biologicalParameters!: string; // JSON string
  @field('economic_parameters') economicParameters!: string; // JSON string
  @field('optimal_systems') optimalSystems!: string; // JSON string
  @readonly @date('created_at') createdAt!: Date;
  @readonly @date('updated_at') updatedAt!: Date;

  // Helper methods
  getCommonName(language: string = 'en'): string {
    try {
      const names = JSON.parse(this.commonNames);
      return names[language] || names['en'] || this.scientificName;
    } catch {
      return this.scientificName;
    }
  }

  getBiologicalParameters(): any {
    try {
      return JSON.parse(this.biologicalParameters);
    } catch {
      return {};
    }
  }

  getEconomicParameters(): any {
    try {
      return JSON.parse(this.economicParameters);
    } catch {
      return {};
    }
  }

  getOptimalSystems(): string[] {
    try {
      return JSON.parse(this.optimalSystems);
    } catch {
      return [];
    }
  }
}