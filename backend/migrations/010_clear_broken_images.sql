-- Clear all image URLs since external hotlinking is blocked by CDN policies.
-- The app will fall back to clean category icons via the EquipmentImage component.
UPDATE equipment_catalog SET image_url = NULL;
