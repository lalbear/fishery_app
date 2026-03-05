-- Make district_code optional since it's not collected during signup yet
ALTER TABLE users ALTER COLUMN district_code DROP NOT NULL;

-- Expand state_code to accommodate full state names
ALTER TABLE users ALTER COLUMN state_code TYPE VARCHAR(100);
