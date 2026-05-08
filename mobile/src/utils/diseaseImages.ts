const DISEASE_IMAGE_BY_SLUG: Record<string, string> = {
  columnaris:
    'https://upload.wikimedia.org/wikipedia/commons/3/32/Columnaris_disease.jpg',
  'aeromonas-septicemia':
    'https://upload.wikimedia.org/wikipedia/commons/0/0f/EUS_red_spot_disease_in_fish.jpg',
  'white-spot-syndrome':
    'https://upload.wikimedia.org/wikipedia/commons/8/83/White_spot_syndrome_virus.jpg',
  'ich-white-spot':
    'https://upload.wikimedia.org/wikipedia/commons/6/62/White_Spot_disease_causing_Ichthyophthirius_multifiliis.jpg',
  saprolegniasis:
    'https://upload.wikimedia.org/wikipedia/commons/1/1b/Saprolegnia_on_fish_eggs.jpg',
  'oxygen-depletion':
    'https://upload.wikimedia.org/wikipedia/commons/1/19/Aerator_in_fish_pond%2C_Thailand.jpg',
  'ammonia-toxicity':
    'https://upload.wikimedia.org/wikipedia/commons/b/b5/YSI_multiparameter_water_quality_sonde.jpg',
};

const CATEGORY_FALLBACK_IMAGE: Record<string, string> = {
  BACTERIAL:
    'https://upload.wikimedia.org/wikipedia/commons/3/32/Columnaris_disease.jpg',
  VIRAL:
    'https://upload.wikimedia.org/wikipedia/commons/8/83/White_spot_syndrome_virus.jpg',
  PARASITIC:
    'https://upload.wikimedia.org/wikipedia/commons/6/62/White_Spot_disease_causing_Ichthyophthirius_multifiliis.jpg',
  FUNGAL:
    'https://upload.wikimedia.org/wikipedia/commons/1/1b/Saprolegnia_on_fish_eggs.jpg',
  ENVIRONMENTAL:
    'https://upload.wikimedia.org/wikipedia/commons/b/b5/YSI_multiparameter_water_quality_sonde.jpg',
  NUTRITIONAL:
    'https://upload.wikimedia.org/wikipedia/commons/b/b5/YSI_multiparameter_water_quality_sonde.jpg',
};

const sanitizeUrl = (url?: string) => {
  if (!url || typeof url !== 'string') return null;
  const trimmed = url.trim();
  if (!trimmed) return null;
  if (trimmed.includes('unsplash.com')) return null;
  return trimmed;
};

export function resolveDiseaseImage(disease: {
  slug?: string;
  category?: string;
  image_url?: string;
}) {
  const slug = disease.slug?.toLowerCase().trim() ?? '';
  if (slug && DISEASE_IMAGE_BY_SLUG[slug]) {
    return DISEASE_IMAGE_BY_SLUG[slug];
  }

  const safeBackendImage = sanitizeUrl(disease.image_url);
  if (safeBackendImage) {
    return safeBackendImage;
  }

  const category = disease.category?.toUpperCase().trim() ?? '';
  return CATEGORY_FALLBACK_IMAGE[category] ?? CATEGORY_FALLBACK_IMAGE.ENVIRONMENTAL;
}
