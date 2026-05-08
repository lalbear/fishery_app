-- Migration 021: Widen district code column to accommodate longest Bihar slugs.
-- 'BR-PASHCHIM-CHAMPARAN' is 21 chars; bump district code to VARCHAR(24) with headroom.
-- The FK in loc_blocks must widen in the same transaction.

ALTER TABLE loc_districts ALTER COLUMN code TYPE VARCHAR(24);
ALTER TABLE loc_blocks    ALTER COLUMN district_code TYPE VARCHAR(24);
