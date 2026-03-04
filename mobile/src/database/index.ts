/**
 * WatermelonDB Database Initialization
 * Optimized for Mobile (Native)
 */

import { Database } from '@nozbe/watermelondb';
import schema from './schema';
import adapter from './adapter';
import Species from './models/Species';
import Pond from './models/Pond';
import WaterQualityLog from './models/WaterQualityLog';
import KnowledgeNode from './models/KnowledgeNode';
import EconomicsSimulation from './models/EconomicsSimulation';
import MarketPrice from './models/MarketPrice';
import SyncQueueItem from './models/SyncQueueItem';

// Initialize database
export const database = new Database({
  adapter,
  modelClasses: [
    Species as any,
    Pond as any,
    WaterQualityLog as any,
    KnowledgeNode as any,
    EconomicsSimulation as any,
    MarketPrice as any,
    SyncQueueItem as any,
  ],
});

export { default as Species } from './models/Species';
export { default as Pond } from './models/Pond';
export { default as WaterQualityLog } from './models/WaterQualityLog';
export { default as KnowledgeNode } from './models/KnowledgeNode';
export { default as EconomicsSimulation } from './models/EconomicsSimulation';
export { default as MarketPrice } from './models/MarketPrice';
export { default as SyncQueueItem } from './models/SyncQueueItem';

export default database;