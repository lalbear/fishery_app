-- Migration 018: Add image_url to feed_catalog and populate it

ALTER TABLE feed_catalog ADD COLUMN IF NOT EXISTS image_url VARCHAR(1024);

-- Popular crustacean feed
UPDATE feed_catalog 
SET image_url = 'https://upload.wikimedia.org/wikipedia/commons/c/c5/Penaeus_vannamei.jpg' 
WHERE suitable_for ILIKE '%shrimp%' OR suitable_for ILIKE '%vannamei%' OR suitable_for ILIKE '%scampi%' OR name ILIKE '%shrimp%';

-- Rice bran overrides
UPDATE feed_catalog 
SET image_url = 'https://upload.wikimedia.org/wikipedia/commons/d/df/Rice_bran.jpg' 
WHERE name ILIKE '%bran%';

-- Oil cakes and high protein powder
UPDATE feed_catalog 
SET image_url = 'https://upload.wikimedia.org/wikipedia/commons/7/70/Fish_meal.jpg' 
WHERE name ILIKE '%cake%' OR name ILIKE '%high protein%' OR feed_type = 'POWDER' AND image_url IS NULL;

-- Carp/Tilapia focused overrides
UPDATE feed_catalog 
SET image_url = 'https://upload.wikimedia.org/wikipedia/commons/d/d1/Labeo_rohita.JPG' 
WHERE (suitable_for ILIKE '%carp%' OR suitable_for ILIKE '%tilapia%' OR suitable_for ILIKE '%rohu%') AND image_url IS NULL;

-- Default for any remaining feeds (generic fish food pellets)
UPDATE feed_catalog 
SET image_url = 'https://upload.wikimedia.org/wikipedia/commons/a/a3/Fish_food.jpg' 
WHERE image_url IS NULL;
