-- Profile and routing location support for doctor assignment

ALTER TABLE users
ADD COLUMN IF NOT EXISTS block_code VARCHAR(120),
ADD COLUMN IF NOT EXISTS panchayat_code VARCHAR(160);

ALTER TABLE ponds
ADD COLUMN IF NOT EXISTS district_code VARCHAR(120),
ADD COLUMN IF NOT EXISTS block_code VARCHAR(120),
ADD COLUMN IF NOT EXISTS panchayat_code VARCHAR(160);

CREATE INDEX IF NOT EXISTS idx_users_location
ON users(state_code, district_code, block_code, panchayat_code);

CREATE INDEX IF NOT EXISTS idx_ponds_location
ON ponds(district_code, block_code, panchayat_code);
