import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { useRoute, useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../ThemeContext';
import ScreenHeader from '../components/ScreenHeader';

export default function EconomicsResultScreen() {
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const { t } = useTranslation();
  const route = useRoute();
  const navigation = useNavigation();
  const { simulationData } = route.params as any;

  if (!simulationData) {
    return (
      <SafeAreaView style={styles.errorContainer} edges={['top']}>
        <Ionicons name="alert-circle-outline" size={48} color={theme.colors.error} />
        <Text style={styles.errorText}>No simulation data available.</Text>
      </SafeAreaView>
    );
  }

  const formatCurrency = (amount: number) => `Rs ${amount.toLocaleString('en-IN')}`;
  const knowledgeInsights = simulationData.knowledgeInsights;
  const openPolicyGuidance = () =>
    (navigation as any).navigate('PolicyGuidance', {
      knowledgeInsights,
    });

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScreenHeader
        title={t('economics.results') || 'ROI Results'}
        onBack={() => (navigation as any).goBack()}
        rightSlot={
          <Text style={styles.helpLink} onPress={openPolicyGuidance}>
            Guide
          </Text>
        }
      />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.heroCard}>
          <Text style={styles.heroEyebrow}>PROJECT VIABILITY</Text>
          <Text style={styles.heroTitle}>{simulationData.benefitCostRatio}</Text>
          <Text style={styles.heroSubtitle}>Benefit-Cost Ratio</Text>
          <Text style={styles.heroProfit}>{formatCurrency(simulationData.projectedNetProfitInr)} projected profit</Text>
        </View>

        <Section title="Investment Breakdown" styles={styles}>
          <StatRow label="Initial CAPEX" value={formatCurrency(simulationData.totalCapitalExpenditureInr)} styles={styles} />
          <StatRow label="Government Subsidy" value={`- ${formatCurrency(simulationData.subsidyAmountInr)}`} styles={styles} valueColor={theme.colors.success} />
          <StatRow label="Working Capital" value={formatCurrency(simulationData.firstCycleWorkingCapitalInr)} styles={styles} />
          <StatRow label="Total Startup Capital" value={formatCurrency(simulationData.totalProjectCostInr)} styles={styles} strong />
          <StatRow label="Breakeven" value={`${simulationData.breakevenTimelineMonths} months`} styles={styles} />
        </Section>

        {knowledgeInsights ? (
          <Section title="Policy-Backed Guidance" styles={styles}>
            <StatRow
              label="Beneficiary subsidy rule"
              value={
                knowledgeInsights.beneficiarySubsidyPercent != null
                  ? `${knowledgeInsights.beneficiarySubsidyPercent}%`
                  : 'N/A'
              }
              styles={styles}
            />
            <StatRow
              label="Centre : State funding share"
              value={
                knowledgeInsights.fundingShare?.centralPercent != null &&
                knowledgeInsights.fundingShare?.statePercent != null
                  ? `${knowledgeInsights.fundingShare.centralPercent}:${knowledgeInsights.fundingShare.statePercent}`
                  : 'N/A'
              }
              styles={styles}
            />
            <Text style={styles.policySourceText}>
              {getPolicyResultDescription(knowledgeInsights)}
            </Text>

            {knowledgeInsights.policyHighlights?.length ? (
              <View style={styles.policyCardList}>
                {knowledgeInsights.policyHighlights.map((item: any) => (
                  <View key={item.idSlug} style={styles.policyCard}>
                    <Text style={styles.policyCardTitle}>{item.metricName}</Text>
                    <Text style={styles.policyCardMeta}>{item.notes || item.sourceLabel}</Text>
                  </View>
                ))}
              </View>
            ) : null}

            {knowledgeInsights.stateBenchmarks?.length ? (
              <View style={styles.policyCardList}>
                {knowledgeInsights.stateBenchmarks.map((item: any) => (
                  <View key={item.idSlug} style={styles.policyCard}>
                    <Text style={styles.policyCardTitle}>{item.metricName}</Text>
                    <Text style={styles.policyCardValue}>{formatKnowledgeValue(item.numericValue, item.unit)}</Text>
                    <Text style={styles.policyCardMeta}>{item.sourceLabel}</Text>
                  </View>
                ))}
              </View>
            ) : null}

            {knowledgeInsights.templateHighlights?.length ? (
              <View style={styles.policyCardList}>
                {knowledgeInsights.templateHighlights.map((item: any) => (
                  <View key={item.idSlug} style={styles.policyCard}>
                    <Text style={styles.policyCardTitle}>{item.metricName}</Text>
                    <Text style={styles.policyCardValue}>{formatKnowledgeValue(item.numericValue, item.unit)}</Text>
                    <Text style={styles.policyCardMeta}>{item.notes || item.sourceLabel}</Text>
                  </View>
                ))}
              </View>
            ) : null}

            {knowledgeInsights.warningHighlights?.length ? (
              <View style={styles.warningBox}>
                <Text style={styles.warningTitle}>Use current market prices</Text>
                {knowledgeInsights.warningHighlights.map((item: any) => (
                  <Text key={item.idSlug} style={styles.warningText}>
                    • {item.metricName}: {item.notes || 'Outdated benchmark; update locally before relying on it.'}
                  </Text>
                ))}
              </View>
            ) : null}

            {knowledgeInsights.disclaimerHighlights?.length ? (
              <View style={styles.warningBox}>
                <Text style={styles.warningTitle}>Institutional disclaimer</Text>
                {knowledgeInsights.disclaimerHighlights.map((item: any) => (
                  <Text key={item.idSlug} style={styles.warningText}>
                    • {item.citationText || item.notes || item.metricName}
                  </Text>
                ))}
              </View>
            ) : null}

            <Text style={styles.resultGuideLink} onPress={openPolicyGuidance}>
              Open full policy guidance
            </Text>
          </Section>
        ) : null}

        {simulationData.recommendedSpecies?.length ? (
          <Section title="Recommended Species" styles={styles}>
            {simulationData.recommendedSpecies.map((species: any, idx: number) => (
              <View key={idx} style={styles.listCard}>
                <Text style={styles.listCardTitle}>
                  {species.commonName || species.speciesName || species.scientificName || species.species || 'Recommended species'}
                </Text>
                <Text style={styles.listCardMeta}>
                  {species.scientificName && species.scientificName !== species.commonName
                    ? `${species.scientificName} • `
                    : ''}
                  Compatibility {species.compatibilityScore || species.score || '-'}%
                </Text>
              </View>
            ))}
          </Section>
        ) : null}

        {simulationData.recommendedSystems?.length ? (
          <Section title="Recommended Systems" styles={styles}>
            {simulationData.recommendedSystems.map((system: any, idx: number) => (
              <View key={idx} style={styles.listCard}>
                <Text style={styles.listCardTitle}>{system.system || system.name || 'System'}</Text>
                <Text style={styles.listCardMeta}>Suitability {system.suitabilityScore || system.score || '-'}%</Text>
              </View>
            ))}
          </Section>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}

function formatKnowledgeValue(value: number | null | undefined, unit?: string | null) {
  if (value == null) {
    return 'N/A';
  }

  switch (unit) {
    case 'PERCENT':
      return `${value}%`;
    case 'INR':
      return `Rs ${value.toLocaleString('en-IN')}`;
    case 'INR_PER_KG':
      return `Rs ${value}/kg`;
    case 'INR_PER_HA':
      return `Rs ${value.toLocaleString('en-IN')}/ha`;
    case 'INR_PER_50M3':
      return `Rs ${value.toLocaleString('en-IN')}/50m3`;
    default:
      return `${value}`;
  }
}

function getPolicyResultDescription(knowledgeInsights: any) {
  if (!knowledgeInsights) {
    return 'Institutional rule source unavailable';
  }

  const subsidy = knowledgeInsights?.beneficiarySubsidyPercent;
  const central = knowledgeInsights?.fundingShare?.centralPercent;
  const state = knowledgeInsights?.fundingShare?.statePercent;

  if (subsidy == null) {
    return knowledgeInsights.beneficiaryRuleSource || 'Institutional rule source unavailable';
  }

  if (central != null && state != null) {
    return `This result uses a ${subsidy}% beneficiary subsidy rule. The ${central}:${state} pattern only describes how the subsidy is funded between Centre and State.`;
  }

  return `This result uses a ${subsidy}% beneficiary subsidy rule from the seeded institutional guidance.`;
}

function Section({ title, styles, children }: any) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.sectionCard}>{children}</View>
    </View>
  );
}

function StatRow({ label, value, styles, valueColor, strong }: any) {
  return (
    <View style={styles.statRow}>
      <Text style={[styles.statLabel, strong && styles.strongText]}>{label}</Text>
      <Text style={[styles.statValue, valueColor ? { color: valueColor } : null, strong && styles.strongText]}>{value}</Text>
    </View>
  );
}

const getStyles = (theme: any) => StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: theme.colors.background },
  content: { padding: 16, paddingBottom: 110 },
  errorContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: theme.colors.background },
  errorText: { marginTop: 12, color: theme.colors.textPrimary, fontSize: 16 },
  helpLink: {
    color: theme.colors.primary,
    fontWeight: '800',
    fontSize: 14,
  },
  heroCard: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.xl,
    padding: 22,
  },
  heroEyebrow: {
    color: 'rgba(255,255,255,0.7)',
    fontWeight: '800',
    fontSize: 11,
  },
  heroTitle: {
    color: theme.colors.textInverse,
    fontSize: 54,
    fontWeight: '900',
    marginTop: 8,
  },
  heroSubtitle: {
    color: theme.colors.textInverse,
    fontSize: 18,
    fontWeight: '700',
  },
  heroProfit: {
    color: 'rgba(255,255,255,0.9)',
    marginTop: 8,
    fontWeight: '600',
  },
  section: {
    marginTop: 18,
  },
  sectionTitle: {
    ...theme.typography.h3,
    marginBottom: 10,
  },
  sectionCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: 16,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  statLabel: {
    flex: 1,
    color: theme.colors.textSecondary,
    fontWeight: '600',
  },
  statValue: {
    color: theme.colors.textPrimary,
    fontWeight: '700',
    textAlign: 'right',
  },
  strongText: {
    fontWeight: '800',
    color: theme.colors.textPrimary,
  },
  listCard: {
    borderRadius: 14,
    backgroundColor: theme.colors.surfaceAlt,
    padding: 14,
    marginBottom: 10,
  },
  listCardTitle: {
    color: theme.colors.textPrimary,
    fontSize: 16,
    fontWeight: '800',
  },
  listCardMeta: {
    color: theme.colors.textSecondary,
    marginTop: 4,
  },
  policySourceText: {
    color: theme.colors.textSecondary,
    lineHeight: 20,
    marginTop: 12,
  },
  policyCardList: {
    gap: 10,
    marginTop: 14,
  },
  policyCard: {
    borderRadius: 14,
    backgroundColor: theme.colors.surfaceAlt,
    padding: 14,
  },
  policyCardTitle: {
    color: theme.colors.textPrimary,
    fontSize: 15,
    fontWeight: '800',
  },
  policyCardValue: {
    color: theme.colors.primary,
    fontSize: 16,
    fontWeight: '800',
    marginTop: 6,
  },
  policyCardMeta: {
    color: theme.colors.textSecondary,
    marginTop: 6,
    lineHeight: 19,
  },
  warningBox: {
    borderRadius: 14,
    padding: 14,
    marginTop: 14,
    backgroundColor: theme.colors.accentSoft,
  },
  warningTitle: {
    color: theme.colors.textPrimary,
    fontSize: 15,
    fontWeight: '800',
    marginBottom: 6,
  },
  warningText: {
    color: theme.colors.textSecondary,
    lineHeight: 20,
  },
  resultGuideLink: {
    color: theme.colors.primary,
    fontWeight: '800',
    marginTop: 14,
  },
});
