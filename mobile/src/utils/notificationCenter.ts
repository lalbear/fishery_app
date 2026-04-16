import AsyncStorage from '@react-native-async-storage/async-storage';
import database from '../database';
import Pond from '../database/models/Pond';
import WaterQualityLog from '../database/models/WaterQualityLog';
import { evaluatePondHealth } from './pondAdvisory';
import { getHarvestMetrics } from './pondLifecycle';
import { fetchSpeciesLookup } from './speciesLookup';

const NOTIFICATION_READS_KEY = '@fishing_god_notification_reads';

export type NotificationSeverity = 'info' | 'warning' | 'critical';
export type NotificationType = 'harvest' | 'water_quality' | 'setup' | 'feed' | 'disease' | 'market' | 'subsidy';

export interface FarmNotification {
  id: string;
  type: NotificationType;
  severity: NotificationSeverity;
  title: string;
  message: string;
  timestamp: number;
  pondId?: string;
  pondName?: string;
  isRead: boolean;
}

type NotificationReadMap = Record<string, boolean>;

async function loadReadMap(): Promise<NotificationReadMap> {
  try {
    const raw = await AsyncStorage.getItem(NOTIFICATION_READS_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as NotificationReadMap;
  } catch {
    return {};
  }
}

async function saveReadMap(readMap: NotificationReadMap) {
  await AsyncStorage.setItem(NOTIFICATION_READS_KEY, JSON.stringify(readMap));
}

type PondLike = {
  id: string;
  name: string;
  speciesId?: string | null;
  stockingDate?: number | null;
  status?: string | null;
  createdAt?: number | null;
  updatedAt?: number | null;
};

type WaterLogLike = {
  id: string;
  pondId: string;
  timestamp: number;
  temperature?: number | null;
  dissolvedOxygen?: number | null;
  ph?: number | null;
  ammonia?: number | null;
};

function buildNotifications(params: {
  ponds: PondLike[];
  logs: WaterLogLike[];
  speciesLookup: Record<string, { label: string; scientificName: string }>;
  readMap: NotificationReadMap;
}): FarmNotification[] {
  const { ponds, logs, speciesLookup, readMap } = params;
  const items: FarmNotification[] = [];

  for (const pond of ponds) {
    const normalizedStatus = String(pond.status || '').toLowerCase();
    const species = pond.speciesId ? speciesLookup[pond.speciesId] : null;

    if (normalizedStatus === 'active' && (!pond.speciesId || !pond.stockingDate)) {
      const id = `setup-${pond.id}`;
      items.push({
        id,
        type: 'setup',
        severity: 'warning',
        title: `Complete setup for ${pond.name}`,
        message: 'Add species and stocking date to unlock harvest tracking and pond alerts.',
        timestamp: pond.updatedAt || pond.createdAt || 0,
        pondId: pond.id,
        pondName: pond.name,
        isRead: Boolean(readMap[id]),
      });
    }

    if (normalizedStatus === 'active' && pond.stockingDate) {
      const harvest = getHarvestMetrics({
        stockingDate: pond.stockingDate,
        speciesScientificName: species?.scientificName,
      });

      if (harvest.isReady) {
        const id = `harvest-ready-${pond.id}-${pond.stockingDate}`;
        items.push({
          id,
          type: 'harvest',
          severity: 'info',
          title: `${pond.name} is ready to harvest`,
          message: `${species?.label || harvest.culture.label} has reached the planned harvest window.`,
          timestamp: harvest.expectedHarvestAt || pond.stockingDate,
          pondId: pond.id,
          pondName: pond.name,
          isRead: Boolean(readMap[id]),
        });
      } else if (harvest.daysRemaining <= 7) {
        const id = `harvest-soon-${pond.id}-${pond.stockingDate}`;
        items.push({
          id,
          type: 'harvest',
          severity: 'warning',
          title: `${pond.name} harvest is approaching`,
          message: `${species?.label || harvest.culture.label} is estimated to reach harvest in ${harvest.daysRemaining} day${harvest.daysRemaining === 1 ? '' : 's'}.`,
          timestamp: harvest.expectedHarvestAt || pond.stockingDate,
          pondId: pond.id,
          pondName: pond.name,
          isRead: Boolean(readMap[id]),
        });
      }
    }
  }

  const latestLogByPond = new Map<string, WaterLogLike>();
  for (const log of logs) {
    const current = latestLogByPond.get(log.pondId);
    if (!current || current.timestamp < log.timestamp) {
      latestLogByPond.set(log.pondId, log);
    }
  }

  for (const [pondId, log] of latestLogByPond.entries()) {
    const advisory = evaluatePondHealth({
      temperature: log.temperature,
      dissolved_oxygen: log.dissolvedOxygen,
      ph: log.ph,
      ammonia: log.ammonia,
    });

    if (advisory.level === 'good') {
      continue;
    }

    const pond = ponds.find((item) => item.id === pondId);
    const id = `water-quality-${log.id}`;

    items.push({
      id,
      type: 'water_quality',
      severity: advisory.level === 'critical' ? 'critical' : 'warning',
      title: pond ? `${pond.name}: ${advisory.title.replace(/^[^\w]+/u, '').trim()}` : advisory.title,
      message: advisory.message,
      timestamp: log.timestamp,
      pondId,
      pondName: pond?.name,
      isRead: Boolean(readMap[id]),
    });
  }

  const now = Date.now();
  const FIVE_DAYS_MS = 5 * 24 * 60 * 60 * 1000;

  for (const pond of ponds) {
    const normalizedStatus = String(pond.status || '').toLowerCase();
    
    if (normalizedStatus === 'active') {
      // 1. REAL Feed Schedule / Reminder
      if (pond.stockingDate && pond.stockingDate < now) {
        // Calculate rough biomass-based feed just for fun (or keep it simple)
        const daysSinceStocking = Math.floor((now - pond.stockingDate) / (1000 * 60 * 60 * 24));
        const estimatedFeedKg = Math.max(1, Math.min(50, Math.floor(daysSinceStocking * 0.5))); // Just an estimate logic
        
        const feedId = `feed-reminder-${pond.id}`;
        items.push({
          id: feedId,
          type: 'feed',
          severity: 'info',
          title: `Time to feed ${pond.name}`,
          message: `Based on your stocking date (${daysSinceStocking} days ago), we suggest throwing ~${estimatedFeedKg}kg of feed today.`,
          timestamp: now - (1000 * 60 * 60 * 6), // 6 hours ago
          pondId: pond.id,
          pondName: pond.name,
          isRead: Boolean(readMap[feedId]),
        });
      }

      // 2. REAL Water Quality Checkups
      const lastLog = latestLogByPond.get(pond.id);
      if (lastLog) {
        const timeSinceLastLog = now - lastLog.timestamp;
        if (timeSinceLastLog > FIVE_DAYS_MS) {
          const daysAgo = Math.floor(timeSinceLastLog / (1000 * 60 * 60 * 24));
          const wqReminderId = `wq-reminder-${pond.id}`;
          items.push({
            id: wqReminderId,
            type: 'water_quality',
            severity: 'warning',
            title: `Water Check Due for ${pond.name}`,
            message: `It's been ${daysAgo} days since you last logged water quality. Regular checking prevents disease!`,
            timestamp: now - 1000 * 60 * 60 * 24, // 1 day ago
            pondId: pond.id,
            pondName: pond.name,
            isRead: Boolean(readMap[wqReminderId]),
          });
        }
      } else {
        // No logs ever
        const wqMissingId = `wq-missing-${pond.id}`;
        items.push({
          id: wqMissingId,
          type: 'water_quality',
          severity: 'warning',
          title: `Start logging ${pond.name}`,
          message: `Add your first water quality log to unlock health analytics for this pond!`,
          timestamp: pond.updatedAt || pond.createdAt || now,
          pondId: pond.id,
          pondName: pond.name,
          isRead: Boolean(readMap[wqMissingId]),
        });
      }
    }
  }

  // --- PLACEHOLDER ALERTS FOR EXTERNAL DATA (Disease, Market, Subsidy) ---
  const nowMock = Date.now();

  const diseaseId = 'mock-disease-outbreak';
  items.push({
    id: diseaseId,
    type: 'disease',
    severity: 'critical',
    title: 'Regional Disease Alert: ARGULUS',
    message: '[Placeholder] Reports of ARGULUS (fish lice) in your district. Watch for fish rubbing against surfaces & consider preventive measures.',
    timestamp: nowMock - 1000 * 60 * 60 * 48, // 2 days ago
    isRead: Boolean(readMap[diseaseId]),
  });

  const marketId = 'mock-market-surge';
  items.push({
    id: marketId,
    type: 'market',
    severity: 'info',
    title: 'Market Prices Surging',
    message: '[Placeholder] Rohu prices are up 12% in your local market this week! Great time to consider partial harvest.',
    timestamp: nowMock - 1000 * 60 * 60 * 72, // 3 days ago
    isRead: Boolean(readMap[marketId]),
  });

  const subsidyId = 'mock-subsidy-deadline';
  items.push({
    id: subsidyId,
    type: 'subsidy',
    severity: 'info',
    title: 'PMMSY Subsidy Deadline',
    message: '[Placeholder] Deadline approaching for the latest Pradhan Mantri Matsya Sampada Yojana cycle. Subsidize your aeration equipment now.',
    timestamp: nowMock - 1000 * 60 * 60 * 96, // 4 days ago
    isRead: Boolean(readMap[subsidyId]),
  });

  return items.sort((a, b) => b.timestamp - a.timestamp);
}

export async function getNotificationFeed(): Promise<FarmNotification[]> {
  const [ponds, logs, speciesLookup, readMap] = await Promise.all([
    database.collections.get<Pond>('ponds').query().fetch(),
    database.collections.get<WaterQualityLog>('water_quality_logs').query().fetch(),
    fetchSpeciesLookup(),
    loadReadMap(),
  ]);

  return buildNotifications({
    ponds: ponds.map((pond) => ({
      id: pond.id,
      name: pond.name,
      speciesId: pond.speciesId,
      stockingDate: pond.stockingDate,
      status: pond.status,
      createdAt: pond.createdAt?.getTime?.() ?? null,
      updatedAt: pond.updatedAt?.getTime?.() ?? null,
    })),
    logs: logs.map((log) => ({
      id: log.id,
      pondId: log.pondId,
      timestamp: log.timestamp,
      temperature: log.temperature,
      dissolvedOxygen: log.dissolvedOxygen,
      ph: log.ph,
      ammonia: log.ammonia,
    })),
    speciesLookup,
    readMap,
  });
}

export async function getUnreadNotificationCount(): Promise<number> {
  const feed = await getNotificationFeed();
  return feed.filter((item) => !item.isRead).length;
}

export async function markNotificationRead(notificationId: string) {
  const readMap = await loadReadMap();
  readMap[notificationId] = true;
  await saveReadMap(readMap);
}

export async function markAllNotificationsRead(notificationIds: string[]) {
  const readMap = await loadReadMap();
  for (const id of notificationIds) {
    readMap[id] = true;
  }
  await saveReadMap(readMap);
}
