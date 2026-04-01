-- Align the SQL migration path with the application runtime contract.

ALTER TABLE users
ADD COLUMN IF NOT EXISTS password_hash VARCHAR(255);

ALTER TABLE users
ALTER COLUMN district_code DROP NOT NULL;

CREATE TABLE IF NOT EXISTS water_quality_readings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    device_id VARCHAR(100) NOT NULL DEFAULT 'mobile-app',
    temperature NUMERIC(5, 2),
    dissolved_oxygen NUMERIC(5, 2),
    ph NUMERIC(4, 2),
    salinity NUMERIC(8, 2),
    ammonia NUMERIC(6, 3),
    notes TEXT,
    recorded_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_wq_device_time
ON water_quality_readings(device_id, recorded_at DESC);
