-- Add unique constraint to prevent duplicate price entries for the same species/market/date
ALTER TABLE market_prices ADD CONSTRAINT unique_market_price UNIQUE (species_id, market_name, date);

-- Recreate the view to be more robust
DROP VIEW IF EXISTS market_price_latest;

CREATE VIEW market_price_latest AS
SELECT DISTINCT ON (species_name, market_name, state_code)
    id,
    species_id,
    species_name,
    market_name,
    state_code,
    price_inr_per_kg,
    grade,
    date,
    source
FROM market_prices
ORDER BY species_name, market_name, state_code, date DESC;
