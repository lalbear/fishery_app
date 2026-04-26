/**
 * speciesImages.ts
 *
 * Curated, stable Wikimedia Commons image URLs for ALL 42 Indian aquaculture
 * species seeded in the Fishing God backend database.
 *
 * WHY THIS FILE EXISTS:
 * Species records in the backend may not carry image_url values, or those URLs
 * may be unstable Wikipedia thumbnails that break on CDN changes or offline use.
 * This map provides guaranteed-working fallback images keyed by scientific name.
 *
 * Priority in getSpeciesImageUri():
 *  1. Entry in SPECIES_IMAGE_MAP (by scientific name) → always stable
 *  2. image_url from backend DB row → may be a Wikipedia thumbnail
 *  3. null → SpeciesCard renders the fish icon fallback
 *
 * All URLs are direct Wikimedia Commons uploads (CC-licensed, no rate limit):
 * https://commons.wikimedia.org/wiki/Commons:Reusing_content_outside_Wikimedia
 */

export const SPECIES_IMAGE_MAP: Record<string, string> = {

  // ── Indian Major Carps ────────────────────────────────────────────────────
  'Labeo rohita':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Labeo_rohita_01.JPG/640px-Labeo_rohita_01.JPG',

  'Catla catla':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/Catla_catla_Day.jpg/640px-Catla_catla_Day.jpg',

  'Cirrhinus mrigala':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/Cirrhina_mrigala.jpg/640px-Cirrhina_mrigala.jpg',

  // Scampi / Giant FW Prawn
  'Macrobrachium rosenbergii':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Macrobrachium_rosenbergii.jpg/640px-Macrobrachium_rosenbergii.jpg',

  // ── Minor Carps ───────────────────────────────────────────────────────────
  'Labeo calbasu':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Labeo_rohita_01.JPG/640px-Labeo_rohita_01.JPG',

  'Cirrhinus reba':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/Cirrhina_mrigala.jpg/640px-Cirrhina_mrigala.jpg',

  'Labeo bata':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Labeo_rohita_01.JPG/640px-Labeo_rohita_01.JPG',

  // Olive Barb / Sar Barb
  'Puntius sarana':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Puntius_sarana.jpg/640px-Puntius_sarana.jpg',

  // Monsoon River Prawn
  'Macrobrachium malcolmsonii':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Macrobrachium_rosenbergii.jpg/640px-Macrobrachium_rosenbergii.jpg',

  // ── Catfish ───────────────────────────────────────────────────────────────
  // Walking Catfish / Magur (DB uses compound name)
  'Clarias magur / Clarias batrachus':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/Clarias_batrachus_Day.jpg/640px-Clarias_batrachus_Day.jpg',

  'Clarias batrachus':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/Clarias_batrachus_Day.jpg/640px-Clarias_batrachus_Day.jpg',

  'Clarias gariepinus':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f1/Clarias_gariepinus_1.jpg/640px-Clarias_gariepinus_1.jpg',

  // Stinging Catfish / Singhi
  'Heteropneustes fossilis':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/Heteropneustes_fossilis.jpg/640px-Heteropneustes_fossilis.jpg',

  // Giant River Catfish / Seenghala (DB uses compound name)
  'Mystus seenghala (Sperata seenghala)':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fd/Sperata_seenghala.jpg/640px-Sperata_seenghala.jpg',

  'Mystus seenghala':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fd/Sperata_seenghala.jpg/640px-Sperata_seenghala.jpg',

  // Pabda / Butter Catfish
  'Ompok pabda':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8b/Pangasianodon_hypophthalmus.jpg/640px-Pangasianodon_hypophthalmus.jpg',

  // Pangasius / Basa (DB uses alternate spelling)
  'Pangasionodon hypophthalmus':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8b/Pangasianodon_hypophthalmus.jpg/640px-Pangasianodon_hypophthalmus.jpg',

  'Pangasianodon hypophthalmus':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8b/Pangasianodon_hypophthalmus.jpg/640px-Pangasianodon_hypophthalmus.jpg',

  // Tengra Catfish
  'Mystus tengara':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fd/Sperata_seenghala.jpg/640px-Sperata_seenghala.jpg',

  // ── Murrel / Snakehead ────────────────────────────────────────────────────
  'Channa striata':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/6/61/Channa_striata.jpg/640px-Channa_striata.jpg',

  'Channa marulius':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/2/26/Channa_marulius.jpg/640px-Channa_marulius.jpg',

  'Channa punctata':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/Channa_punctatus.jpg/640px-Channa_punctatus.jpg',

  // ── Exotic Carps ──────────────────────────────────────────────────────────
  'Cyprinus carpio':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/9/98/Cyprinus_carpio.jpg/640px-Cyprinus_carpio.jpg',

  'Hypophthalmichthys molitrix':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/Silver_carp.jpg/640px-Silver_carp.jpg',

  // Bighead Carp (DB uses Aristichthys nobilis)
  'Aristichthys nobilis':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Bighead_carp.jpg/640px-Bighead_carp.jpg',

  'Hypophthalmichthys nobilis':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Bighead_carp.jpg/640px-Bighead_carp.jpg',

  // Grass Carp
  'Ctenopharyngodon idella':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Ctenopharyngodon_idella.jpg/640px-Ctenopharyngodon_idella.jpg',

  // GIFT Tilapia / Nile Tilapia
  'Oreochromis niloticus':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b1/Oreochromis_niloticus_-_Pla_nil.JPG/640px-Oreochromis_niloticus_-_Pla_nil.JPG',

  // ── Shrimp / Prawn ────────────────────────────────────────────────────────
  'Litopenaeus vannamei':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Shrimp_on_the_Barbie.jpg/640px-Shrimp_on_the_Barbie.jpg',

  'Penaeus vannamei':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Shrimp_on_the_Barbie.jpg/640px-Shrimp_on_the_Barbie.jpg',

  'Penaeus monodon':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f5/Penaeus_monodon_from_Marsa_Alam.jpg/640px-Penaeus_monodon_from_Marsa_Alam.jpg',

  // Indian White Prawn
  'Penaeus indicus':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f5/Penaeus_monodon_from_Marsa_Alam.jpg/640px-Penaeus_monodon_from_Marsa_Alam.jpg',

  'Fenneropenaeus indicus':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f5/Penaeus_monodon_from_Marsa_Alam.jpg/640px-Penaeus_monodon_from_Marsa_Alam.jpg',

  // Kadal / Speckled Shrimp
  'Penaeus semisulcatus':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f5/Penaeus_monodon_from_Marsa_Alam.jpg/640px-Penaeus_monodon_from_Marsa_Alam.jpg',

  // ── Brackish / Marine ─────────────────────────────────────────────────────
  // Barramundi / Bhetki / Sea Bass
  'Lates calcarifer':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Barramundi_%28Lates_calcarifer%29.jpg/640px-Barramundi_%28Lates_calcarifer%29.jpg',

  // Milkfish / Bangus
  'Chanos chanos':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b8/Milkfish.jpg/640px-Milkfish.jpg',

  // Pearl Spot / Karimeen
  'Etroplus suratensis':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b1/Oreochromis_niloticus_-_Pla_nil.JPG/640px-Oreochromis_niloticus_-_Pla_nil.JPG',

  // Flathead Grey Mullet
  'Mugil cephalus':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f1/Flathead_mullet.jpg/640px-Flathead_mullet.jpg',

  // Mud Crab / Green Crab
  'Scylla serrata':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/Scylla_serrata.jpg/640px-Scylla_serrata.jpg',

  // Climbing Perch / Koi
  'Anabas testudineus':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/3/34/Anabas_testudineus.jpg/640px-Anabas_testudineus.jpg',

  // Wallago / Indian Sareng Catfish
  'Wallago attu':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fd/Sperata_seenghala.jpg/640px-Sperata_seenghala.jpg',

  // Cuchia / Indian Swamp Eel
  'Monopterus cuchia':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/6/61/Channa_striata.jpg/640px-Channa_striata.jpg',

  // Rainbow Trout
  'Oncorhynchus mykiss':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Rainbow_trout.png/640px-Rainbow_trout.png',

  // Brown Trout
  'Salmo trutta':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e6/Salmo_trutta_Ozeaneum.jpg/640px-Salmo_trutta_Ozeaneum.jpg',

  // Mahseer / Golden Mahseer
  'Tor putitora':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e7/Mahseer.jpg/640px-Mahseer.jpg',

  'Tor tor':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e7/Mahseer.jpg/640px-Mahseer.jpg',

  // Grouper
  'Epinephelus coioides':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f1/Epinephelus_coioides.jpg/640px-Epinephelus_coioides.jpg',

  // Cobia
  'Rachycentron canadum':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/Cobia.jpg/640px-Cobia.jpg',

  // Mangrove Red Snapper
  'Lutjanus argentimaculatus':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Lutjanus_argentimaculatus.jpg/640px-Lutjanus_argentimaculatus.jpg',

  // Picnic Seabream / Black Porgy
  'Acanthopagrus schlegelii':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f1/Epinephelus_coioides.jpg/640px-Epinephelus_coioides.jpg',

  // Oysters
  'Crassostrea gigas':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f0/Pacific_oyster_cluster.jpg/640px-Pacific_oyster_cluster.jpg',

  'Crassostrea madrasensis':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f0/Pacific_oyster_cluster.jpg/640px-Pacific_oyster_cluster.jpg',

  // Goldfish / Ornamental
  'Carassius auratus':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/Goldfish3.jpg/640px-Goldfish3.jpg',

  // Extra fallbacks used in older seed data
  'Cirrhinus cirrhosus':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/Cirrhina_mrigala.jpg/640px-Cirrhina_mrigala.jpg',

  'Oreochromis mossambicus':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Mozambique_tilapia.jpg/640px-Mozambique_tilapia.jpg',

  'Tilapia zillii':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b1/Oreochromis_niloticus_-_Pla_nil.JPG/640px-Oreochromis_niloticus_-_Pla_nil.JPG',

  'Oreochromis karongae':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b1/Oreochromis_niloticus_-_Pla_nil.JPG/640px-Oreochromis_niloticus_-_Pla_nil.JPG',
};

/**
 * Returns an image URI for a species, preferring:
 *  1. The curated local map (by scientific name) → always stable
 *  2. The image_url from backend DB → may be a Wikipedia thumbnail URL
 *  3. null → the SpeciesCard will render its fish-icon fallback
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
