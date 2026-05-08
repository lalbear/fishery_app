-- Migration 021: Column widths already set correctly in 020_create_location_hierarchy.sql
-- loc_districts.district_code and loc_blocks.district_code are both VARCHAR(24).
-- This migration is intentionally a no-op.
SELECT 1;
