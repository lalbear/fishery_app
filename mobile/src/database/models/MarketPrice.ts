/**
 * Market Price Model - WatermelonDB
 */

import { Model } from '@nozbe/watermelondb';
import { field, date, readonly } from '@nozbe/watermelondb/decorators';

export default class MarketPrice extends Model {
  static table = 'market_prices';

  @field('price_id') priceId!: string;
  @field('species_name') speciesName!: string;
  @field('market_name') marketName!: string;
  @field('state_code') stateCode!: string;
  @field('price_inr_per_kg') priceInrPerKg!: number;
  @field('grade') grade?: string;
  @field('date') date!: number;
  @field('source') source!: string;
  @readonly @date('created_at') createdAt!: Date;

  getDate(): Date {
    return new Date(this.date);
  }

  getFormattedPrice(): string {
    return `₹${this.priceInrPerKg.toFixed(2)}`;
  }

  isRecent(days: number = 7): boolean {
    const priceDate = this.getDate();
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    return priceDate >= cutoffDate;
  }
}