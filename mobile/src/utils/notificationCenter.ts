import AsyncStorage from '@react-native-async-storage/async-storage';
import database from '../database';
import Pond from '../database/models/Pond';
import WaterQualityLog from '../database/models/WaterQualityLog';
import { evaluatePondHealth } from './pondAdvisory';
import { getHarvestMetrics } from './pondLifecycle';
import { fetchSpeciesLookup } from './speciesLookup';

const NOTIFICATION_READS_KEY = '@fishing_god_notification_reads';

export type NotificationSeverity = 'info' | 'warning' | 'critical';
export type NotificationType = 'harvest' | 'water_quality' | 'setup';

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
