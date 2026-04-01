import fs from 'fs';
import path from 'path';
import { closePool, query } from '../db';
import { logger } from '../utils/logger';

type KnowledgeRuleSeed = {
  id_slug: string;
  record_type: string;
  document_title: string;
  source_type: string;
  institution: string;
  scope_type: string;
  state_code: string | null;
  region_group: string | null;
  project_types: string[];
  species: string[];
  metric_name: string;
  numeric_value: number | null;
  min_value: number | null;
  max_value: number | null;
  unit: string | null;
  bucket: string;
  confidence: string | null;
  freshness: string | null;
  applicability_condition: string | null;
  user_editable: boolean;
  active_for_calculator: boolean;
  active_for_knowledgebase: boolean;
  warning_if_used: boolean;
  citation_text: string | null;
  citation_page: number | null;
  citation_section: string | null;
  notes: string | null;
};

function loadKnowledgeSeed(): KnowledgeRuleSeed[] {
  const dataPath = path.join(__dirname, '../../data/knowledge_rules.json');
  const parsed = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

  if (Array.isArray(parsed)) {
    return parsed as KnowledgeRuleSeed[];
  }

  if (Array.isArray(parsed.normalized_records)) {
    return parsed.normalized_records as KnowledgeRuleSeed[];
  }

  throw new Error('Invalid knowledge seed file format');
}

async function seedKnowledge() {
  const records = loadKnowledgeSeed();
  logger.info(`Seeding ${records.length} knowledge rules`);

  for (const record of records) {
    await query(
      `
        INSERT INTO knowledge_rules (
          id_slug,
          record_type,
          document_title,
          source_type,
          institution,
          scope_type,
          state_code,
          region_group,
          project_types,
          species,
          metric_name,
          numeric_value,
          min_value,
          max_value,
          unit,
          bucket,
          confidence,
          freshness,
          applicability_condition,
          user_editable,
          active_for_calculator,
          active_for_knowledgebase,
          warning_if_used,
          citation_text,
          citation_page,
          citation_section,
          notes
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9::jsonb, $10::jsonb, $11, $12, $13, $14, $15, $16,
          $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27
        )
        ON CONFLICT (id_slug) DO UPDATE SET
          record_type = EXCLUDED.record_type,
          document_title = EXCLUDED.document_title,
          source_type = EXCLUDED.source_type,
          institution = EXCLUDED.institution,
          scope_type = EXCLUDED.scope_type,
          state_code = EXCLUDED.state_code,
          region_group = EXCLUDED.region_group,
          project_types = EXCLUDED.project_types,
          species = EXCLUDED.species,
          metric_name = EXCLUDED.metric_name,
          numeric_value = EXCLUDED.numeric_value,
          min_value = EXCLUDED.min_value,
          max_value = EXCLUDED.max_value,
          unit = EXCLUDED.unit,
          bucket = EXCLUDED.bucket,
          confidence = EXCLUDED.confidence,
          freshness = EXCLUDED.freshness,
          applicability_condition = EXCLUDED.applicability_condition,
          user_editable = EXCLUDED.user_editable,
          active_for_calculator = EXCLUDED.active_for_calculator,
          active_for_knowledgebase = EXCLUDED.active_for_knowledgebase,
          warning_if_used = EXCLUDED.warning_if_used,
          citation_text = EXCLUDED.citation_text,
          citation_page = EXCLUDED.citation_page,
          citation_section = EXCLUDED.citation_section,
          notes = EXCLUDED.notes,
          updated_at = NOW()
      `,
      [
        record.id_slug,
        record.record_type,
        record.document_title,
        record.source_type,
        record.institution,
        record.scope_type,
        record.state_code,
        record.region_group,
        JSON.stringify(record.project_types ?? []),
        JSON.stringify(record.species ?? []),
        record.metric_name,
        record.numeric_value,
        record.min_value,
        record.max_value,
        record.unit,
        record.bucket,
        record.confidence,
        record.freshness,
        record.applicability_condition,
        record.user_editable,
        record.active_for_calculator,
        record.active_for_knowledgebase,
        record.warning_if_used,
        record.citation_text,
        record.citation_page,
        record.citation_section,
        record.notes,
      ]
    );
  }

  logger.info('Knowledge rules seeded successfully');
}

if (require.main === module) {
  seedKnowledge()
    .catch((error) => {
      logger.error('Failed to seed knowledge rules', error);
      process.exit(1);
    })
    .finally(async () => {
      await closePool();
    });
}
