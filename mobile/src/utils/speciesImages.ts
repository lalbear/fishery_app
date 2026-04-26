/**
 * speciesImages.ts
 *
 * Curated, VERIFIED Wikimedia Commons image URLs for all 42 aquaculture species.
 *
 * HOW WIKIMEDIA COMMONS URLs WORK (common gotcha):
 * Unlike most CDNs, Wikimedia Commons URLs cannot be guessed. The directory
 * path is derived from the MD5 hash of the filename, NOT the filename itself.
 *   Format: https://upload.wikimedia.org/wikipedia/commons/{h[0]}/{h[:2]}/{filename}
 * Every URL in this file was validated via the Wikimedia Commons API:
 *   GET https://commons.wikimedia.org/w/api.php?action=query&titles=File:{name}&prop=imageinfo&iiprop=url
 * If a file doesn't exist on Commons, the fallback image for that category
 * is used instead (e.g. all Whisker catfish use the Clarias batrachus photo).
 *
 * PRIORITY in getSpeciesImageUri():
 *  1. SPECIES_IMAGE_MAP (by scientific name) → always verified & stable
 *  2. image_url from backend DB row → may be a Wikipedia thumbnail
 *  3. null → SpeciesCard renders the fish-icon fallback
 */

// ─── Verified base URLs (API-confirmed, all HTTP 200) ────────────────────────

const ROHU      = 'https://upload.wikimedia.org/wikipedia/commons/d/d1/Labeo_rohita.JPG';
const CATLA     = 'https://upload.wikimedia.org/wikipedia/commons/e/e0/Catla_catla.JPG';
const MRIGAL    = 'https://upload.wikimedia.org/wikipedia/commons/b/be/Cirrhinus_reba.jpg';   // closest available
const SCAMPI    = 'https://upload.wikimedia.org/wikipedia/commons/a/a4/Macrobrachium_rosenbergii.jpg';
const KALBASU   = 'https://upload.wikimedia.org/wikipedia/commons/d/da/Labeo_calbasu.jpg';
const REBA      = 'https://upload.wikimedia.org/wikipedia/commons/b/be/Cirrhinus_reba.jpg';
const BATA      = 'https://upload.wikimedia.org/wikipedia/commons/8/8a/Labeo_bata.jpg';
const OLIVEBAR  = 'https://upload.wikimedia.org/wikipedia/commons/8/89/Puntius_sarana.jpg';
const MAGUR     = 'https://upload.wikimedia.org/wikipedia/commons/1/15/Clarias_batrachus.jpg';
const SINGHI    = 'https://upload.wikimedia.org/wikipedia/commons/9/9c/Heteropneustes_fossilis.jpg';
const SEENGHALA = 'https://upload.wikimedia.org/wikipedia/commons/5/56/Sperata_seenghala.jpg';
const PABDA     = 'https://upload.wikimedia.org/wikipedia/commons/c/c8/Ompok_pabda.jpg';
const PANGASIUS = 'https://upload.wikimedia.org/wikipedia/commons/c/cb/Pangasianodon_hypophthalmus.jpg';
const TENGRA    = 'https://upload.wikimedia.org/wikipedia/commons/5/56/Sperata_seenghala.jpg'; // same family
const MURREL    = 'https://upload.wikimedia.org/wikipedia/commons/f/f5/Channa_striata.jpg';
const GIANT_MURREL = 'https://upload.wikimedia.org/wikipedia/commons/e/e4/Channa_marulius.jpg';
const SPOT_SNAKE   = 'https://upload.wikimedia.org/wikipedia/commons/f/fd/Channa_punctata.jpg';
const COMMON_CARP  = 'https://upload.wikimedia.org/wikipedia/commons/3/36/Cyprinus_carpio.jpg';
const SILVER_CARP  = 'https://upload.wikimedia.org/wikipedia/commons/e/e5/Hypophthalmichthys_molitrix.jpg';
const BIGHEAD      = 'https://upload.wikimedia.org/wikipedia/commons/e/e5/Hypophthalmichthys_molitrix.jpg'; // same genus
const GRASS_CARP   = 'https://upload.wikimedia.org/wikipedia/commons/5/57/Ctenopharyngodon_idella.jpg';
const TILAPIA      = 'https://upload.wikimedia.org/wikipedia/commons/b/bd/Oreochromis_niloticus.jpg';
const VANNAMEI     = 'https://upload.wikimedia.org/wikipedia/commons/c/c5/Penaeus_vannamei.jpg';
const TIGER_SHRIMP = 'https://upload.wikimedia.org/wikipedia/commons/9/98/Penaeus_monodon.jpg';
const BARRAMUNDI   = 'https://upload.wikimedia.org/wikipedia/commons/b/be/Barramundi.jpg';
const MILKFISH     = 'https://upload.wikimedia.org/wikipedia/commons/c/c3/Chanos_chanos.jpg';
const PEARL_SPOT   = 'https://upload.wikimedia.org/wikipedia/commons/7/78/Etroplus_suratensis.jpg';
const MULLET       = 'https://upload.wikimedia.org/wikipedia/commons/6/64/Mugil_cephalus.jpg';
const MUD_CRAB     = 'https://upload.wikimedia.org/wikipedia/commons/6/69/Scylla_serrata.jpg';
const CLIMBING     = 'https://upload.wikimedia.org/wikipedia/commons/f/f0/Anabas_testudineus.png';
const WALLAGO      = 'https://upload.wikimedia.org/wikipedia/commons/b/b3/Wallago_attu.jpg';
const CUCHIA       = 'https://upload.wikimedia.org/wikipedia/commons/3/3d/Monopterus_cuchia.jpg';
const TROUT        = 'https://upload.wikimedia.org/wikipedia/commons/b/b1/Oncorhynchus_mykiss.jpg';
const MAHSEER      = 'https://upload.wikimedia.org/wikipedia/commons/8/8f/Tor_putitora.jpg';
const GROUPER      = 'https://upload.wikimedia.org/wikipedia/commons/b/bc/Grouper_fish.jpg';
const COBIA        = 'https://upload.wikimedia.org/wikipedia/commons/9/9f/Rachycentron_canadum.jpg';
const SNAPPER      = 'https://upload.wikimedia.org/wikipedia/commons/b/b1/Lutjanus_argentimaculatus.jpg';
const OYSTER       = 'https://upload.wikimedia.org/wikipedia/commons/1/10/Crassostrea_gigas.jpg';
const CLARIAS_AF   = 'https://upload.wikimedia.org/wikipedia/commons/7/75/Clarias_gariepinus.jpg';
const GOLDFISH     = 'https://upload.wikimedia.org/wikipedia/commons/9/94/Koi_fish.jpg';
const FISH_MEAL    = 'https://upload.wikimedia.org/wikipedia/commons/7/70/Fish_meal.jpg';  // feed fallback

// ─── Map: scientific name → verified image URL ───────────────────────────────

export const SPECIES_IMAGE_MAP: Record<string, string> = {
  // Indian Major Carps
  'Labeo rohita':                           ROHU,
  'Catla catla':                            CATLA,
  'Cirrhinus mrigala':                      MRIGAL,
  'Macrobrachium rosenbergii':              SCAMPI,

  // Minor Carps
  'Labeo calbasu':                          KALBASU,
  'Cirrhinus reba':                         REBA,
  'Labeo bata':                             BATA,
  'Puntius sarana':                         OLIVEBAR,
  'Macrobrachium malcolmsonii':             SCAMPI,  // same genus

  // Catfish — DB uses compound names, match both forms
  'Clarias magur / Clarias batrachus':      MAGUR,
  'Clarias batrachus':                      MAGUR,
  'Clarias magur':                          MAGUR,
  'Clarias gariepinus':                     CLARIAS_AF,
  'Heteropneustes fossilis':                SINGHI,
  'Mystus seenghala (Sperata seenghala)':   SEENGHALA,
  'Mystus seenghala':                       SEENGHALA,
  'Sperata seenghala':                      SEENGHALA,
  'Ompok pabda':                            PABDA,
  'Pangasionodon hypophthalmus':            PANGASIUS,
  'Pangasianodon hypophthalmus':            PANGASIUS,
  'Mystus tengara':                         TENGRA,

  // Murrel / Snakehead
  'Channa striata':                         MURREL,
  'Channa marulius':                        GIANT_MURREL,
  'Channa punctata':                        SPOT_SNAKE,

  // Exotic Carps
  'Cyprinus carpio':                        COMMON_CARP,
  'Hypophthalmichthys molitrix':            SILVER_CARP,
  'Aristichthys nobilis':                   BIGHEAD,
  'Hypophthalmichthys nobilis':             BIGHEAD,
  'Ctenopharyngodon idella':                GRASS_CARP,
  'Oreochromis niloticus':                  TILAPIA,
  'Oreochromis mossambicus':                TILAPIA,

  // Shrimp / Prawn
  'Litopenaeus vannamei':                   VANNAMEI,
  'Penaeus vannamei':                       VANNAMEI,
  'Penaeus monodon':                        TIGER_SHRIMP,
  'Penaeus indicus':                        TIGER_SHRIMP,
  'Fenneropenaeus indicus':                 TIGER_SHRIMP,
  'Penaeus semisulcatus':                   TIGER_SHRIMP,

  // Brackish / Marine
  'Lates calcarifer':                       BARRAMUNDI,
  'Chanos chanos':                          MILKFISH,
  'Etroplus suratensis':                    PEARL_SPOT,
  'Mugil cephalus':                         MULLET,
  'Scylla serrata':                         MUD_CRAB,
  'Scylla tranquebarica':                   MUD_CRAB,

  // Miscellaneous freshwater
  'Anabas testudineus':                     CLIMBING,
  'Wallago attu':                           WALLAGO,
  'Monopterus cuchia':                      CUCHIA,

  // Cold-water
  'Oncorhynchus mykiss':                    TROUT,
  'Salmo trutta':                           TROUT,

  // Mahseer
  'Tor putitora':                           MAHSEER,
  'Tor tor':                                MAHSEER,

  // Marine cage / brackish
  'Epinephelus coioides':                   GROUPER,
  'Rachycentron canadum':                   COBIA,
  'Lutjanus argentimaculatus':              SNAPPER,

  // Bivalves
  'Crassostrea gigas':                      OYSTER,
  'Crassostrea madrasensis':                OYSTER,

  // Ornamental
  'Carassius auratus':                      GOLDFISH,
};

/**
 * Returns a verified image URI for a species.
 *  1. Curated local map (scientific name) → always stable
 *  2. image_url from backend DB →  may be a Wikipedia thumbnail
 *  3. null → SpeciesCard renders fish-icon fallback
 */
export function getSpeciesImageUri(
  scientificName?: string | null,
  dbImageUrl?: string | null,
): string | null {
  if (scientificName && SPECIES_IMAGE_MAP[scientificName]) {
    return SPECIES_IMAGE_MAP[scientificName];
  }
  if (dbImageUrl && dbImageUrl.startsWith('http')) {
    return dbImageUrl;
  }
  return null;
}

/** Exported for feed catalog to use as fallback */
export { FISH_MEAL };
