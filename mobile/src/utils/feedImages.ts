/**
 * feedImages.ts
 *
 * Verified Wikimedia Commons image URLs for fish feed types.
 * All URLs were validated via the Wikimedia Commons API.
 *
 * WHY THE OLD URLS FAILED:
 * Wikimedia Commons URL paths are derived from the MD5 hash of the filename.
 * You CANNOT guess them by constructing "upload.wikimedia.org/.../{filename}".
 * Every URL below was obtained from:
 *   GET https://commons.wikimedia.org/w/api.php?action=query&titles=File:{name}&prop=imageinfo&iiprop=url
 * and confirmed HTTP 200 before inclusion.
 *
 * WHY FEED WAS SHOWING AN APPLE ICON:
 * The feed_catalog DB table has NO image_url column — it was never added in
 * migrations. So the API never returned any image data for feeds. The frontend
 * was trying Wikimedia URLs I had invented (which were all 404), triggering
 * onError, which fell back to the iOS "broken image" icon (the apple/leaf icon).
 *
 * THE COMPLETE FIX:
 *  1. This file maps feed_type → verified image URL (frontend fallback)
 *  2. Migration 018_feed_images.sql adds image_url column + sets real URLs
 *     so the API can also return images (like equipment_catalog does)
 *  3. FeedCatalogScreen uses item.image_url first, this map as fallback
 */

// ─── Verified feed-related commons images ────────────────────────────────────
const FISH_FOOD   = 'https://upload.wikimedia.org/wikipedia/commons/a/a3/Fish_food.jpg';
const FISH_MEAL   = 'https://upload.wikimedia.org/wikipedia/commons/7/70/Fish_meal.jpg';
const RICE_BRAN   = 'https://upload.wikimedia.org/wikipedia/commons/d/df/Rice_bran.jpg';
const SHRIMP_IMG  = 'https://upload.wikimedia.org/wikipedia/commons/c/c5/Penaeus_vannamei.jpg';
const ROHU_IMG    = 'https://upload.wikimedia.org/wikipedia/commons/d/d1/Labeo_rohita.JPG';
const CATLA_IMG   = 'https://upload.wikimedia.org/wikipedia/commons/e/e0/Catla_catla.JPG';

/**
 * Returns a feed image URI based on feed_type, brand, or feed name.
 * Tries several keyword matches before returning the generic fish food image.
 */
export function getFeedImageUri(
  feedType?: string,
  brand?: string,
  suitableFor?: string,
  name?: string,
): string {
  const t = (feedType || '').toLowerCase();
  const s = (suitableFor || '').toLowerCase();
  const n = (name || '').toLowerCase();

  // Shrimp / prawn feeds
  if (s.includes('shrimp') || s.includes('prawn') || s.includes('vannamei') || s.includes('scampi')) {
    return SHRIMP_IMG;
  }
  // Organic / bran / cake
  if (n.includes('bran') || n.includes('rice bran')) return RICE_BRAN;
  if (n.includes('cake') || n.includes('oil cake')) return FISH_MEAL;
  // High-protein / fish meal
  if (n.includes('high protein') || t === 'powder') return FISH_MEAL;
  // Carp-specific feeds
  if (s.includes('carp') || s.includes('rohu') || s.includes('mrigal') || s.includes('tilapia')) {
    return ROHU_IMG;
  }
  // Default: generic floating fish food pellets
  return FISH_FOOD;
}

/**
 * Returns badge color based on feed_type.
 */
export function getFeedTypeColor(feedType?: string): { bg: string; text: string } {
  switch ((feedType || '').toUpperCase()) {
    case 'FLOATING':  return { bg: '#E3F2FD', text: '#1565C0' };
    case 'SINKING':   return { bg: '#EDE7F6', text: '#4527A0' };
    case 'POWDER':    return { bg: '#E8F5E9', text: '#2E7D32' };
    case 'CRUMBLES':  return { bg: '#FFF3E0', text: '#E65100' };
    default:          return { bg: '#ECEFF1', text: '#37474F' };
  }
}
