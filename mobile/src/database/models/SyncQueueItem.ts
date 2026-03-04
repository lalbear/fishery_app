/**
 * Sync Queue Item Model - WatermelonDB
 */

import { Model } from '@nozbe/watermelondb';
import { field, date, readonly } from '@nozbe/watermelondb/decorators';

export default class SyncQueueItem extends Model {
  static table = 'sync_queue';

  @field('queue_id') queueId!: string;
  @field('table_name') tableName!: string;
  @field('record_id') recordId!: string;
  @field('operation') operation!: 'INSERT' | 'UPDATE' | 'DELETE';
  @field('data') data!: string; // JSON string
  @field('status') status!: string;
  @field('retry_count') retryCount!: number;
  @readonly @date('created_at') createdAt!: Date;

  getData<T = any>(): T {
    try {
      return JSON.parse(this.data);
    } catch {
      return {} as T;
    }
  }

  isPending(): boolean {
    return this.status === 'PENDING';
  }

  hasFailed(): boolean {
    return this.status === 'FAILED';
  }

  incrementRetry(): number {
    return this.retryCount + 1;
  }
}