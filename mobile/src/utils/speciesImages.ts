/**
 * LOCAL FALLBACK ASSET MAPPING
 * 
 * Instead of relying on Wikimedia API which throws 403 Forbidden without User-Agents 
 * natively on some Android versions, or causes unpredictable 404s, we bundle high quality 
 * category images directly into the app assets.
 * 
 * This ensures that even beautifully rendered lists work offline instantly.
 */

const IMG_CARP    = require('../../assets/images/categories/generic_carp.jpg');
const IMG_CATFISH = require('../../assets/images/categories/generic_catfish.jpg');
const IMG_SHRIMP  = require('../../assets/images/categories/generic_shrimp.jpg');
const IMG_CRAB    = require('../../assets/images/categories/generic_crab.jpg');

/**
 * Maps the scientific name to a robust native require() image string.
 */
export function getSpeciesImageUri(
  scientificName?: string | null,
  dbImageUrl?: string | null, // we can optionally ignore or still use DB URL.
): any {
  // If the backend actually returned a URL and we want to try it
  if (dbImageUrl && dbImageUrl.startsWith('http')) {
    return { uri: dbImageUrl };
  }

  const s = (scientificName || '').toLowerCase();
  
  if (s.includes('penaeus') || s.includes('macrobrachium')) return IMG_SHRIMP;
  if (s.includes('clarias') || s.includes('mystus') || s.includes('heteropneustes') || s.includes('wallago') || s.includes('pangasianodon') || s.includes('ompok') || s.includes('sperata')) return IMG_CATFISH;
  if (s.includes('scylla')) return IMG_CRAB;
  
  // Default to carp for most others
  return IMG_CARP;
}

export const FISH_MEAL_IMAGE = require('../../assets/images/categories/generic_fish_feed.jpg');
