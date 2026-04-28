-- ============================================================================
-- Aquaculture Health + Doctor Network
-- ============================================================================

CREATE TABLE IF NOT EXISTS diseases (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug VARCHAR(120) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(32) NOT NULL CHECK (category IN (
        'BACTERIAL', 'VIRAL', 'PARASITIC', 'FUNGAL', 'NUTRITIONAL', 'ENVIRONMENTAL'
    )),
    affected_species TEXT[] NOT NULL DEFAULT '{}',
    symptoms TEXT[] NOT NULL DEFAULT '{}',
    causes TEXT[] NOT NULL DEFAULT '{}',
    prevention TEXT[] NOT NULL DEFAULT '{}',
    treatment TEXT[] NOT NULL DEFAULT '{}',
    severity VARCHAR(16) NOT NULL CHECK (severity IN ('LOW', 'MEDIUM', 'HIGH')),
    mortality_rate NUMERIC(5, 2),
    seasonality TEXT[] NOT NULL DEFAULT '{}',
    water_conditions JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_diseases_category ON diseases(category);
CREATE INDEX IF NOT EXISTS idx_diseases_severity ON diseases(severity);
CREATE INDEX IF NOT EXISTS idx_diseases_slug ON diseases(slug);

CREATE TABLE IF NOT EXISTS doctors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(32) NOT NULL,
    assigned_panchayats TEXT[] NOT NULL DEFAULT '{}',
    specialization TEXT[] NOT NULL DEFAULT '{}',
    availability_schedule JSONB NOT NULL DEFAULT '{}'::jsonb,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_doctors_active ON doctors(is_active);

CREATE TABLE IF NOT EXISTS farmer_doctor_mappings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    farmer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    doctor_id UUID NOT NULL REFERENCES doctors(id) ON DELETE CASCADE,
    panchayat_id VARCHAR(80) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(farmer_id),
    UNIQUE(farmer_id, panchayat_id)
);

CREATE INDEX IF NOT EXISTS idx_fdm_doctor ON farmer_doctor_mappings(doctor_id);
CREATE INDEX IF NOT EXISTS idx_fdm_panchayat ON farmer_doctor_mappings(panchayat_id);

CREATE TABLE IF NOT EXISTS appointments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    farmer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    doctor_id UUID NOT NULL REFERENCES doctors(id) ON DELETE CASCADE,
    pond_id UUID REFERENCES ponds(id) ON DELETE SET NULL,
    issue_description TEXT NOT NULL,
    suspected_disease_id UUID REFERENCES diseases(id) ON DELETE SET NULL,
    status VARCHAR(16) NOT NULL DEFAULT 'REQUESTED' CHECK (status IN ('REQUESTED', 'APPROVED', 'COMPLETED', 'CANCELLED')),
    scheduled_date TIMESTAMPTZ NOT NULL,
    consultation_type VARCHAR(16) NOT NULL CHECK (consultation_type IN ('VISIT', 'CALL')),
    payment_status VARCHAR(16) NOT NULL DEFAULT 'PENDING' CHECK (payment_status IN ('PENDING', 'PARTIAL', 'PAID')),
    emergency_flag BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_appointments_farmer ON appointments(farmer_id);
CREATE INDEX IF NOT EXISTS idx_appointments_doctor ON appointments(doctor_id);
CREATE INDEX IF NOT EXISTS idx_appointments_status ON appointments(status);
CREATE INDEX IF NOT EXISTS idx_appointments_schedule ON appointments(scheduled_date);

CREATE TABLE IF NOT EXISTS appointment_payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    appointment_id UUID NOT NULL UNIQUE REFERENCES appointments(id) ON DELETE CASCADE,
    total_amount NUMERIC(10, 2) NOT NULL DEFAULT 300,
    farmer_contribution NUMERIC(10, 2) NOT NULL DEFAULT 200,
    govt_contribution NUMERIC(10, 2) NOT NULL DEFAULT 100,
    status VARCHAR(16) NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'PARTIAL', 'PAID')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS treatments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    appointment_id UUID NOT NULL REFERENCES appointments(id) ON DELETE CASCADE,
    disease_id UUID REFERENCES diseases(id) ON DELETE SET NULL,
    medicines JSONB NOT NULL DEFAULT '[]'::jsonb,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(appointment_id)
);

CREATE TABLE IF NOT EXISTS lab_reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    appointment_id UUID NOT NULL REFERENCES appointments(id) ON DELETE CASCADE,
    report_type VARCHAR(120) NOT NULL,
    file_url TEXT NOT NULL,
    result_summary TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_lab_reports_appointment ON lab_reports(appointment_id);

CREATE TABLE IF NOT EXISTS doctor_ratings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    appointment_id UUID NOT NULL UNIQUE REFERENCES appointments(id) ON DELETE CASCADE,
    doctor_id UUID NOT NULL REFERENCES doctors(id) ON DELETE CASCADE,
    farmer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
    comment TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_doctor_ratings_doctor ON doctor_ratings(doctor_id);

CREATE TRIGGER update_diseases_updated_at
    BEFORE UPDATE ON diseases
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_doctors_updated_at
    BEFORE UPDATE ON doctors
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_appointments_updated_at
    BEFORE UPDATE ON appointments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_appointment_payments_updated_at
    BEFORE UPDATE ON appointment_payments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_treatments_updated_at
    BEFORE UPDATE ON treatments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

INSERT INTO diseases (
    slug, name, category, affected_species, symptoms, causes, prevention, treatment,
    severity, mortality_rate, seasonality, water_conditions
) VALUES
(
    'columnaris',
    'Columnaris',
    'BACTERIAL',
    ARRAY['Tilapia', 'Catla', 'Rohu'],
    ARRAY['white patches', 'frayed fins', 'skin lesions'],
    ARRAY['stress', 'poor water quality', 'high organic load'],
    ARRAY['maintain DO above 5 mg/L', 'avoid overstocking', 'disinfect equipment'],
    ARRAY['salt bath', 'approved antibacterial treatment', 'partial water exchange'],
    'HIGH',
    35.00,
    ARRAY['summer', 'monsoon'],
    '{"temperatureRange":{"min":24,"max":34},"dissolvedOxygen":{"min":5}}'::jsonb
),
(
    'aeromonas-septicemia',
    'Aeromonas (Hemorrhagic Septicemia)',
    'BACTERIAL',
    ARRAY['Catla', 'Rohu', 'Mrigal', 'Tilapia'],
    ARRAY['hemorrhage', 'ulcers', 'abdominal swelling'],
    ARRAY['injury', 'temperature stress', 'high ammonia'],
    ARRAY['stable temperature', 'biosecurity', 'feed hygiene'],
    ARRAY['doctor-supervised antimicrobial plan', 'supportive mineral feed'],
    'HIGH',
    40.00,
    ARRAY['pre-monsoon', 'monsoon'],
    '{"ammoniaLevel":{"max":0.1},"temperatureRange":{"min":22,"max":32}}'::jsonb
),
(
    'white-spot-syndrome',
    'White Spot Syndrome',
    'VIRAL',
    ARRAY['Vannamei Shrimp', 'Black Tiger Shrimp'],
    ARRAY['white spots on shell', 'lethargy', 'rapid mortality'],
    ARRAY['viral exposure', 'poor biosecurity', 'contaminated seed'],
    ARRAY['PCR-screened seed', 'strict pond disinfection', 'screened intake water'],
    ARRAY['emergency harvest where possible', 'immediate specialist consultation'],
    'HIGH',
    80.00,
    ARRAY['all'],
    '{"temperatureRange":{"min":24,"max":32},"salinity":{"min":5,"max":35}}'::jsonb
),
(
    'ich-white-spot',
    'Ich (White Spot Disease)',
    'PARASITIC',
    ARRAY['Tilapia', 'Catla', 'Rohu', 'Ornamental'],
    ARRAY['pinhead white spots', 'flashing against surfaces', 'gasping'],
    ARRAY['protozoan parasite', 'temperature shock'],
    ARRAY['quarantine new stock', 'avoid abrupt temperature changes'],
    ARRAY['salt treatment', 'system cleaning', 'doctor-guided anti-parasitic'],
    'MEDIUM',
    20.00,
    ARRAY['winter', 'spring'],
    '{"temperatureRange":{"min":18,"max":30}}'::jsonb
),
(
    'saprolegniasis',
    'Saprolegniasis',
    'FUNGAL',
    ARRAY['Catla', 'Rohu', 'Tilapia', 'Trout'],
    ARRAY['cotton-like growth', 'skin damage', 'egg fungal growth'],
    ARRAY['injury', 'cold stress', 'organic debris'],
    ARRAY['good hygiene', 'remove dead biomass', 'handle fish gently'],
    ARRAY['fungal treatment protocol', 'supportive water correction'],
    'MEDIUM',
    18.00,
    ARRAY['winter'],
    '{"temperatureRange":{"min":12,"max":24}}'::jsonb
),
(
    'oxygen-depletion',
    'Oxygen Depletion',
    'ENVIRONMENTAL',
    ARRAY['All'],
    ARRAY['surface gasping', 'crowding near inlet', 'sudden mortality at dawn'],
    ARRAY['low aeration', 'algal crash', 'overfeeding'],
    ARRAY['continuous aeration', 'feed discipline', 'night checks'],
    ARRAY['run aerators immediately', 'stop feed temporarily', 'water exchange'],
    'HIGH',
    55.00,
    ARRAY['summer', 'monsoon'],
    '{"dissolvedOxygen":{"criticalBelow":4}}'::jsonb
),
(
    'ammonia-toxicity',
    'Ammonia Toxicity',
    'ENVIRONMENTAL',
    ARRAY['All'],
    ARRAY['gill irritation', 'surface piping', 'reduced feeding'],
    ARRAY['overfeeding', 'high biomass', 'insufficient nitrification'],
    ARRAY['regular sludge removal', 'probiotics', 'feed optimization'],
    ARRAY['reduce feed', 'apply zeolite', 'water exchange'],
    'HIGH',
    45.00,
    ARRAY['all'],
    '{"ammoniaLevel":{"warningAbove":0.1,"criticalAbove":0.5}}'::jsonb
)
ON CONFLICT (slug) DO NOTHING;
