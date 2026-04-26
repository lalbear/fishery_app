/**
 * feedImages.ts
 *
 * Curated Wikimedia Commons image URLs for fish feed types shown in the
 * Feed Catalog screen. Keyed by feed_type string returned by the backend.
 *
 * All URLs are direct Wikimedia Commons uploads (CC-licensed, permanent).
 */

/**
 * Returns a feed image URI based on feed_type, suitable for the feed card header.
 * Falls back progressively: feed_type → brand keyword → generic pellet image.
 */
export function getFeedImageUri(feedType?: string, brand?: string): string | null {
  const type = (feedType || '').toLowerCase();

  if (type.includes('starter') || type.includes('fry') || type.includes('nursery')) {
    return 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/35/Fish_pellets.jpg/640px-Fish_pellets.jpg';
  }
  if (type.includes('growout') || type.includes('grow-out') || type.includes('grow out') || type.includes('grower')) {
    return 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/84/Fish_meal.jpg/640px-Fish_meal.jpg';
  }
  if (type.includes('finisher') || type.includes('pre-harvest') || type.includes('preharvest')) {
    return 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/35/Fish_pellets.jpg/640px-Fish_pellets.jpg';
  }
  if (type.includes('shrimp') || type.includes('prawn')) {
    return 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f5/Penaeus_monodon_from_Marsa_Alam.jpg/640px-Penaeus_monodon_from_Marsa_Alam.jpg';
  }
  if (type.includes('carp') || type.includes('rohu') || type.includes('catla')) {
    return 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Labeo_rohita_01.JPG/640px-Labeo_rohita_01.JPG';
  }
  if (type.includes('biofloc') || type.includes('organic')) {
    return 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/84/Fish_meal.jpg/640px-Fish_meal.jpg';
  }

  // Generic fish feed pellet image for any unmapped type
  return 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/35/Fish_pellets.jpg/640px-Fish_pellets.jpg';
}

/**
 * Gradient colors for feed type badge backgrounds, used to color-code cards.
 */
export function getFeedTypeColor(feedType?: string): {
  bg: string;
  text: string;
} {
  const type = (feedType || '').toLowerCase();

  if (type.includes('starter') || type.includes('fry') || type.includes('nursery')) {
    return { bg: '#E8F5E9', text: '#2E7D32' };
  }
  if (type.includes('growout') || type.includes('grow-out') || type.includes('grower')) {
    return { bg: '#E3F2FD', text: '#1565C0' };
  }
  if (type.includes('finisher') || type.includes('pre-harvest')) {
    return { bg: '#FFF3E0', text: '#E65100' };
  }
  if (type.includes('shrimp') || type.includes('prawn')) {
    return { bg: '#FCE4EC', text: '#880E4F' };
  }
  if (type.includes('carp')) {
    return { bg: '#F3E5F5', text: '#6A1B9A' };
  }
  return { bg: '#ECEFF1', text: '#37474F' };
}
