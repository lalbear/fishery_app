/**
 * LOCAL FALLBACK ASSET MAPPING FOR FEEDS
 */

const IMG_FEED = require('../../assets/images/categories/generic_fish_feed.jpg');
const IMG_BRAN = require('../../assets/images/categories/generic_rice_bran.jpg');
const IMG_SHRIMP = require('../../assets/images/categories/generic_shrimp.jpg');

/**
 * Returns a generic feed asset module based on text matching.
 */
export function getFeedImageUri(
  feedType?: string,
  brand?: string,
  suitableFor?: string,
  name?: string,
): any {
  const s = (suitableFor || '').toLowerCase();
  const n = (name || '').toLowerCase();

  // Shrimp / prawn
  if (s.includes('shrimp') || s.includes('prawn') || s.includes('vannamei') || s.includes('scampi')) {
    return IMG_SHRIMP;
  }
  // Organic / bran
  if (n.includes('bran') || n.includes('rice bran')) return IMG_BRAN;

  // Default: generic floating fish food pellets
  return IMG_FEED;
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
