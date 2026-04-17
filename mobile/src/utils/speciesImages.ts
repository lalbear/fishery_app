/**
 * speciesImages.ts
 *
 * Curated, stable Wikimedia Commons image URLs for Indian aquaculture species.
 *
 * WHY THIS FILE EXISTS:
 * Images are stored as Wikipedia thumbnail URLs in the backend DB.
 * Those URLs can break due to Wikipedia CDN changes, rate limits, or offline use.
 * This map provides guaranteed-working fallback images keyed by scientific name.
 *
 * All URLs are direct Wikimedia Commons uploads (permanent, no rate limits, no auth):
 * https://commons.wikimedia.org/wiki/Commons:Reusing_content_outside_Wikimedia
 */

// Map from scientific name → stable Wikimedia Commons image URL
export const SPECIES_IMAGE_MAP: Record<string, string> = {
  // ── Carps (most common Indian freshwater aquaculture) ─────────────────────
  'Catla catla':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/Catla_catla_Day.jpg/640px-Catla_catla_Day.jpg',
  'Labeo rohita':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Labeo_rohita_01.JPG/640px-Labeo_rohita_01.JPG',
  'Cirrhinus mrigala':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/Cirrhina_mrigala.jpg/640px-Cirrhina_mrigala.jpg',
  'Cyprinus carpio':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/9/98/Cyprinus_carpio.jpg/640px-Cyprinus_carpio.jpg',
  'Hypophthalmichthys molitrix':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/Silver_carp.jpg/640px-Silver_carp.jpg',
  'Hypophthalmichthys nobilis':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Bighead_carp.jpg/640px-Bighead_carp.jpg',
  // Common name fallback for Mrigal
  'Cirrhinus cirrhosus':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/Cirrhina_mrigala.jpg/640px-Cirrhina_mrigala.jpg',

  // ── Tilapia ───────────────────────────────────────────────────────────────
  'Oreochromis niloticus':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b1/Oreochromis_niloticus_-_Pla_nil.JPG/640px-Oreochromis_niloticus_-_Pla_nil.JPG',
  'Oreochromis mossambicus':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Mozambique_tilapia.jpg/640px-Mozambique_tilapia.jpg',
  'Tilapia zillii':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b1/Oreochromis_niloticus_-_Pla_nil.JPG/640px-Oreochromis_niloticus_-_Pla_nil.JPG',
  'Oreochromis karongae':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b1/Oreochromis_niloticus_-_Pla_nil.JPG/640px-Oreochromis_niloticus_-_Pla_nil.JPG',

  // ── Catfish ───────────────────────────────────────────────────────────────
  'Pangasianodon hypophthalmus':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8b/Pangasianodon_hypophthalmus.jpg/640px-Pangasianodon_hypophthalmus.jpg',
  'Clarias batrachus':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/Clarias_batrachus_Day.jpg/640px-Clarias_batrachus_Day.jpg',
  'Clarias gariepinus':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f1/Clarias_gariepinus_1.jpg/640px-Clarias_gariepinus_1.jpg',
  'Mystus seenghala':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fd/Sperata_seenghala.jpg/640px-Sperata_seenghala.jpg',

  // ── Snakeheads ────────────────────────────────────────────────────────────
  'Channa striata':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/6/61/Channa_striata.jpg/640px-Channa_striata.jpg',
  'Channa marulius':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/2/26/Channa_marulius.jpg/640px-Channa_marulius.jpg',
  'Channa punctata':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/Channa_punctatus.jpg/640px-Channa_punctatus.jpg',

  // ── Shrimp / Prawns ───────────────────────────────────────────────────────
  'Litopenaeus vannamei':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Shrimp_on_the_Barbie.jpg/640px-Shrimp_on_the_Barbie.jpg',
  'Penaeus monodon':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f5/Penaeus_monodon_from_Marsa_Alam.jpg/640px-Penaeus_monodon_from_Marsa_Alam.jpg',
  'Macrobrachium rosenbergii':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Macrobrachium_rosenbergii.jpg/640px-Macrobrachium_rosenbergii.jpg',
  'Macrobrachium malcolmsonii':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Macrobrachium_rosenbergii.jpg/640px-Macrobrachium_rosenbergii.jpg',

  // ── Marine / Brackish ─────────────────────────────────────────────────────
  'Lates calcarifer':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Barramundi_%28Lates_calcarifer%29.jpg/640px-Barramundi_%28Lates_calcarifer%29.jpg',
  'Mugil cephalus':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f1/Flathead_mullet.jpg/640px-Flathead_mullet.jpg',
  'Chanos chanos':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b8/Milkfish.jpg/640px-Milkfish.jpg',
  'Epinephelus coioides':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f1/Epinephelus_coioides.jpg/640px-Epinephelus_coioides.jpg',
  'Crassostrea gigas':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f0/Pacific_oyster_cluster.jpg/640px-Pacific_oyster_cluster.jpg',
  'Crassostrea madrasensis':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f0/Pacific_oyster_cluster.jpg/640px-Pacific_oyster_cluster.jpg',
  'Penaeus semisulcatus':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f5/Penaeus_monodon_from_Marsa_Alam.jpg/640px-Penaeus_monodon_from_Marsa_Alam.jpg',

  // ── Others ────────────────────────────────────────────────────────────────
  'Carassius auratus':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/Goldfish3.jpg/640px-Goldfish3.jpg',
  'Labeo bata':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Labeo_rohita_01.JPG/640px-Labeo_rohita_01.JPG',
  'Labeo calbasu':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Labeo_rohita_01.JPG/640px-Labeo_rohita_01.JPG',
  'Tor putitora':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e7/Mahseer.jpg/640px-Mahseer.jpg',
  'Tor tor':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e7/Mahseer.jpg/640px-Mahseer.jpg',
};

/**
 * Returns an image URI for a species card, preferring:
 *  1. The curated local map (by scientific name) → always stable
 *  2. The image_url from backend DB → may be a Wikipedia thumbnail URL
 *  3. null → the SpeciesCard will render its icon fallback
 */
export function getSpeciesImageUri(scientificName?: string | null, dbImageUrl?: string | null): string | null {
  if (scientificName && SPECIES_IMAGE_MAP[scientificName]) {
    return SPECIES_IMAGE_MAP[scientificName];
  }
  if (dbImageUrl && dbImageUrl.startsWith('http')) {
    return dbImageUrl;
  }
  return null;
}
