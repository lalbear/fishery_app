/**
 * Water Quality Log Model - WatermelonDB
 */

import { Model } from '@nozbe/watermelondb';
import { field, date, readonly } from '@nozbe/watermelondb/decorators';

export interface WaterQualityAlert {
  parameter: string;
  severity: 'WARNING' | 'CRITICAL';
  message: string;
  recommendedAction: string;
}

export default class WaterQualityLog extends Model {
  static table = 'water_quality_logs';

  @field('log_id') logId!: string;
  @field('pond_id') pondId!: string;
  @field('timestamp') timestamp!: number;
  @field('temperature') temperature?: number;
  @field('dissolved_oxygen') dissolvedOxygen?: number;
  @field('ph') ph?: number;
  @field('salinity') salinity?: number;
  @field('alkalinity') alkalinity?: number;
  @field('ammonia') ammonia?: number;
  @field('nitrite') nitrite?: number;
  @field('turbidity') turbidity?: number;
  @field('alerts') alerts?: string; // JSON string
  @field('sync_status') localSyncStatus!: string;
  @readonly @date('created_at') createdAt!: Date;

  getDate(): Date {
    return new Date(this.timestamp);
  }

  getAlerts(): WaterQualityAlert[] {
    try {
      return JSON.parse(this.alerts || '[]');
    } catch {
      return [];
    }
  }

  hasCriticalAlerts(): boolean {
    const alerts = this.getAlerts();
    return alerts.some(a => a.severity === 'CRITICAL');
  }

  getParameters() {
    return {
      temperature: this.temperature,
      dissolvedOxygen: this.dissolvedOxygen,
      ph: this.ph,
      salinity: this.salinity,
      alkalinity: this.alkalinity,
      ammonia: this.ammonia,
      nitrite: this.nitrite,
      turbidity: this.turbidity,
    };
  }
}