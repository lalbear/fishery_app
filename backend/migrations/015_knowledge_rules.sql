CREATE TABLE IF NOT EXISTS knowledge_rules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    id_slug VARCHAR(255) UNIQUE NOT NULL,
    record_type VARCHAR(50) NOT NULL CHECK (record_type IN (
        'policy_rule',
        'subsidy_rule',
        'project_template',
        'biological_assumption',
        'cost_benchmark',
        'risk_flag'
    )),
    document_title VARCHAR(255) NOT NULL,
    source_type VARCHAR(100) NOT NULL,
    institution VARCHAR(255) NOT NULL,
    scope_type VARCHAR(50) NOT NULL CHECK (scope_type IN (
        'NATIONAL',
        'STATE',
        'REGION_GROUP',
        'BENCHMARK'
    )),
    state_code VARCHAR(10),
    region_group VARCHAR(50),
    project_types JSONB NOT NULL DEFAULT '[]'::jsonb,
    species JSONB NOT NULL DEFAULT '[]'::jsonb,
    metric_name VARCHAR(255) NOT NULL,
    numeric_value NUMERIC,
    min_value NUMERIC,
    max_value NUMERIC,
    unit VARCHAR(100),
    bucket VARCHAR(100) NOT NULL,
    confidence VARCHAR(50),
    freshness VARCHAR(100),
    applicability_condition TEXT,
    user_editable BOOLEAN NOT NULL DEFAULT FALSE,
    active_for_calculator BOOLEAN NOT NULL DEFAULT FALSE,
    active_for_knowledgebase BOOLEAN NOT NULL DEFAULT TRUE,
    warning_if_used BOOLEAN NOT NULL DEFAULT FALSE,
    citation_text TEXT,
    citation_page INTEGER,
    citation_section VARCHAR(255),
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_knowledge_rules_record_type
    ON knowledge_rules(record_type);

CREATE INDEX IF NOT EXISTS idx_knowledge_rules_state_code
    ON knowledge_rules(state_code);

CREATE INDEX IF NOT EXISTS idx_knowledge_rules_region_group
    ON knowledge_rules(region_group);

CREATE INDEX IF NOT EXISTS idx_knowledge_rules_bucket
    ON knowledge_rules(bucket);

CREATE INDEX IF NOT EXISTS idx_knowledge_rules_active_for_calculator
    ON knowledge_rules(active_for_calculator);

CREATE INDEX IF NOT EXISTS idx_knowledge_rules_project_types
    ON knowledge_rules USING GIN (project_types);

CREATE INDEX IF NOT EXISTS idx_knowledge_rules_species
    ON knowledge_rules USING GIN (species);

DROP TRIGGER IF EXISTS update_knowledge_rules_updated_at ON knowledge_rules;
CREATE TRIGGER update_knowledge_rules_updated_at
    BEFORE UPDATE ON knowledge_rules
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
