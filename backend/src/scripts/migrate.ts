import { query, closePool } from '../db';
import { logger } from '../utils/logger';

async function migrate() {
  logger.info('Starting database migration...');

  try {
    // Create knowledge_nodes table (Hierarchical JSONB properties)
    await query(`
      CREATE TABLE IF NOT EXISTS knowledge_nodes (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        parent_id UUID REFERENCES knowledge_nodes(id) ON DELETE CASCADE,
        node_type VARCHAR(50) NOT NULL,
        data JSONB NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        version INTEGER NOT NULL DEFAULT 1
      );
    `);

    // Index on parent_id for hierarchical queries
    await query(`CREATE INDEX IF NOT EXISTS idx_knowledge_nodes_parent_id ON knowledge_nodes(parent_id);`);

    // GIN index for robust JSONB querying
    await query(`CREATE INDEX IF NOT EXISTS idx_knowledge_nodes_data ON knowledge_nodes USING GIN (data);`);

    // Create market_prices table
    await query(`
      CREATE TABLE IF NOT EXISTS market_prices (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        species_name VARCHAR(100) NOT NULL,
        market_name VARCHAR(100) NOT NULL,
        state_code VARCHAR(10) NOT NULL,
        price_inr_per_kg NUMERIC(10, 2) NOT NULL,
        grade VARCHAR(50) NOT NULL,
        date DATE NOT NULL,
        source VARCHAR(50) NOT NULL,
        volume_kg NUMERIC(10, 2),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create equipment_catalog table
    await query(`
      CREATE TABLE IF NOT EXISTS equipment_catalog (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(255) NOT NULL,
        category VARCHAR(100) NOT NULL,
        specifications JSONB,
        cost_inr NUMERIC(12, 2) NOT NULL,
        lifespan_years NUMERIC(5, 1) NOT NULL,
        power_consumption_kw NUMERIC(10, 2),
        maintenance_cost_annual_inr NUMERIC(12, 2) NOT NULL,
        supplier_directory JSONB,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create users table
    await query(`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        phone_number VARCHAR(20) UNIQUE NOT NULL,
        name VARCHAR(255) NOT NULL,
        preferred_language VARCHAR(10) DEFAULT 'en',
        farmer_category VARCHAR(50) NOT NULL,
        state_code VARCHAR(10) NOT NULL,
        district_code VARCHAR(50) NOT NULL,
        village VARCHAR(255),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create ponds table
    await query(`
      CREATE TABLE IF NOT EXISTS ponds (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        name VARCHAR(255) NOT NULL,
        area_hectares NUMERIC(10, 4) NOT NULL,
        water_type VARCHAR(50) NOT NULL,
        system_type VARCHAR(50) NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        deleted_at TIMESTAMP WITH TIME ZONE
      );
    `);

    // Create water_quality_logs table
    await query(`
      CREATE TABLE IF NOT EXISTS water_quality_logs (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        pond_id UUID REFERENCES ponds(id) ON DELETE CASCADE,
        timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
        parameters JSONB NOT NULL,
        alerts JSONB,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        deleted_at TIMESTAMP WITH TIME ZONE
      );
    `);

    // Create economics_simulations table for saved user simulations
    await query(`
      CREATE TABLE IF NOT EXISTS economics_simulations (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        input_data JSONB NOT NULL,
        output_data JSONB NOT NULL,
        is_saved BOOLEAN DEFAULT false,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        deleted_at TIMESTAMP WITH TIME ZONE
      );
    `);


    // Create water_quality_readings table (device-level, no user FK required)
    await query(`
      CREATE TABLE IF NOT EXISTS water_quality_readings (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        device_id VARCHAR(100) NOT NULL DEFAULT 'mobile-app',
        temperature NUMERIC(5, 2),
        dissolved_oxygen NUMERIC(5, 2),
        ph NUMERIC(4, 2),
        salinity NUMERIC(8, 2),
        ammonia NUMERIC(6, 3),
        notes TEXT,
        recorded_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);
    await query(`CREATE INDEX IF NOT EXISTS idx_wq_device_time ON water_quality_readings(device_id, recorded_at DESC);`);

    logger.info('Database migration completed successfully!');
  } catch (error) {
    logger.error('Failed to run migration:', error);
    process.exit(1);
  } finally {
    await closePool();
  }
}

// Call if executed directly
if (require.main === module) {
  migrate();
}
