import { type ImageSourcePropType } from 'react-native';

const DISEASE_IMAGE_BY_SLUG: Record<string, ImageSourcePropType> = {
  columnaris: require('../../assets/images/diseases/columnaris.jpg'),
  'aeromonas-septicemia': require('../../assets/images/diseases/aeromonas-septicemia.jpg'),
  'white-spot-syndrome': require('../../assets/images/diseases/white-spot-syndrome.jpg'),
  'ich-white-spot': require('../../assets/images/diseases/ich-white-spot.jpg'),
  saprolegniasis: require('../../assets/images/diseases/saprolegniasis.jpg'),
  'oxygen-depletion': require('../../assets/images/diseases/oxygen-depletion.jpg'),
  'ammonia-toxicity': require('../../assets/images/diseases/ammonia-toxicity.png'),
};

const CATEGORY_FALLBACK_IMAGE: Record<string, ImageSourcePropType> = {
  BACTERIAL: DISEASE_IMAGE_BY_SLUG.columnaris,
  VIRAL: DISEASE_IMAGE_BY_SLUG['white-spot-syndrome'],
  PARASITIC: DISEASE_IMAGE_BY_SLUG['ich-white-spot'],
  FUNGAL: DISEASE_IMAGE_BY_SLUG.saprolegniasis,
  ENVIRONMENTAL: DISEASE_IMAGE_BY_SLUG['oxygen-depletion'],
  NUTRITIONAL: DISEASE_IMAGE_BY_SLUG['ammonia-toxicity'],
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
}): ImageSourcePropType {
  const slug = disease.slug?.toLowerCase().trim() ?? '';
  if (slug && DISEASE_IMAGE_BY_SLUG[slug]) {
    return DISEASE_IMAGE_BY_SLUG[slug];
  }

  const safeBackendImage = sanitizeUrl(disease.image_url);
  if (safeBackendImage) {
    return { uri: safeBackendImage };
  }

  const category = disease.category?.toUpperCase().trim() ?? '';
  return CATEGORY_FALLBACK_IMAGE[category] ?? CATEGORY_FALLBACK_IMAGE.ENVIRONMENTAL;
}
