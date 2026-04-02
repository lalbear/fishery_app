export type CultureProfile = {
  days: number;
  label: string;
};

export const CULTURE_PERIODS: Record<string, CultureProfile> = {
  'Litopenaeus vannamei': { days: 120, label: 'Vannamei Shrimp' },
  'Penaeus monodon': { days: 150, label: 'Tiger Shrimp' },
  'Labeo rohita': { days: 300, label: 'Rohu' },
  'Catla catla': { days: 300, label: 'Catla' },
  'Cirrhinus mrigala': { days: 300, label: 'Mrigal' },
  'Oreochromis niloticus': { days: 180, label: 'Tilapia' },
  'Pangasianodon hypophthalmus': { days: 200, label: 'Pangasius' },
};

export const DEFAULT_CULTURE: CultureProfile = { days: 180, label: 'Fish' };

export function getCultureProfile(speciesScientificName?: string | null): CultureProfile {
  if (!speciesScientificName) {
    return DEFAULT_CULTURE;
  }

  return CULTURE_PERIODS[speciesScientificName] || DEFAULT_CULTURE;
}

export function getHarvestMetrics(params: {
  stockingDate?: number | null;
  speciesScientificName?: string | null;
}) {
  const culture = getCultureProfile(params.speciesScientificName);
  const stockingMs = params.stockingDate ?? 0;
  const now = Date.now();
  const daysElapsed = Math.max(0, Math.floor((now - stockingMs) / 86400000));
  const daysRemaining = Math.max(0, culture.days - daysElapsed);
  const progress = Math.min(1, daysElapsed / culture.days);
  const isReady = daysRemaining === 0;
  const expectedHarvestAt = stockingMs ? stockingMs + culture.days * 86400000 : null;

  return {
    culture,
    daysElapsed,
    daysRemaining,
    progress,
    isReady,
    expectedHarvestAt,
  };
}
