/**
 * Knowledge Node Model - WatermelonDB
 */

import { Model } from '@nozbe/watermelondb';
import { field, date, readonly } from '@nozbe/watermelondb/decorators';

export default class KnowledgeNode extends Model {
  static table = 'knowledge_nodes';

  @field('node_id') nodeId!: string;
  @field('parent_id') parentId?: string;
  @field('node_type') nodeType!: string;
  @field('data') data!: string; // JSON string
  @readonly @date('created_at') createdAt!: Date;
  @readonly @date('updated_at') updatedAt!: Date;

  getData<T = any>(): T {
    try {
      return JSON.parse(this.data);
    } catch {
      return {} as T;
    }
  }

  isRoot(): boolean {
    return !this.parentId;
  }

  isSpecies(): boolean {
    return this.nodeType === 'SPECIES';
  }

  isEconomicModel(): boolean {
    return this.nodeType === 'ECONOMIC_MODEL';
  }
}