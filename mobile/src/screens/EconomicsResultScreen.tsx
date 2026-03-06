/**
 * Economics Result Screen - ROI Dashboard
 */

import React from 'react';
import {
  View as RNView,
  Text as RNText,
  StyleSheet,
  ScrollView as RNScrollView,
  TouchableOpacity as RNTouchableOpacity
} from 'react-native';

const View = RNView as any;
const Text = RNText as any;
const ScrollView = RNScrollView as any;
const TouchableOpacity = RNTouchableOpacity as any;

import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useTheme } from '../ThemeContext';

export default function EconomicsResultScreen() {
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const { t } = useTranslation();
  const route = useRoute();
  const navigation = useNavigation();
  const { simulationData } = route.params as any;

  if (!simulationData) {
    return (
      <View style={styles.errorContainer}>
        <Text style={{ color: theme.colors.textPrimary }}>No simulation data available.</Text>
      </View>
    );
  }

  const formatCurrency = (amount: number) => {
    return `₹${amount.toLocaleString('en-IN')}`;
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{t('economics.results') || 'Analysis Results'}</Text>
        </View>

        <View style={styles.scoreCard}>
          <Text style={styles.scoreLabel}>{t('economics.benefitCostRatio') || 'Benefit-Cost Ratio'}</Text>
          <Text style={styles.scoreValue}>{simulationData.benefitCostRatio}</Text>
          <Text style={styles.scoreStatus}>
            {t('economics.projectedProfit') || 'Projected Net Profit'}: {formatCurrency(simulationData.projectedNetProfitInr)}
          </Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t('economics.investmentBreakdown') || 'Investment Breakdown'}</Text>
        <View style={styles.card}>
          <StatRow styles={styles} label="Initial CAPEX (Construction)" value={formatCurrency(simulationData.totalCapitalExpenditureInr)} />
          <StatRow
            styles={styles}
            label="Government Subsidy (PMMSY)"
            value={`- ${formatCurrency(simulationData.subsidyAmountInr)}`}
            color={theme.colors.success}
          />
          <StatRow
            styles={styles}
            label="Working Capital (Feed & Stock)"
            value={formatCurrency(simulationData.firstCycleWorkingCapitalInr)}
          />
          <View style={styles.divider} />
          <StatRow
            styles={styles}
            label="Total Startup Capital Required"
            value={formatCurrency(simulationData.totalProjectCostInr)}
            bold
            color={theme.colors.primary}
          />
          <StatRow
            styles={styles}
            label={t('economics.breakeven') || 'Breakeven Timeline'}
            value={`${simulationData.breakevenTimelineMonths} Months`}
          />
        </View>
        {simulationData.availableCapitalInr > simulationData.totalProjectCostInr && (
          <View style={{ marginTop: 12, padding: 12, backgroundColor: theme.isDark ? '#1a2b3a' : '#E3F2FD', borderRadius: 8 }}>
            <Text style={{ fontSize: 13, color: theme.colors.primary, fontStyle: 'italic' }}>
              Note: This project layout requires ₹{(simulationData.totalProjectCostInr / 100000).toFixed(2)} Lakhs.
              You have ₹{((simulationData.availableCapitalInr - simulationData.totalProjectCostInr) / 100000).toFixed(2)} Lakhs surplus capital available.
            </Text>
          </View>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t('economics.recommendedSpecies') || 'Species Viability'}</Text>
        <View style={styles.card}>
          {simulationData.recommendedSpecies.map((species: any, idx: number) => {
            const score = species.compatibilityScore;
            let badgeColor = theme.colors.success;
            let badgeBg = theme.isDark ? '#1a3a1f' : '#E8F5E9';

            if (score < 40) {
              badgeColor = theme.colors.error;
              badgeBg = theme.isDark ? '#3a1a1a' : '#FFEBEB';
            } else if (score < 70) {
              badgeColor = '#EAB308';
              badgeBg = theme.isDark ? '#3e3210' : '#FEF9C3';
            }

            return (
              <View key={idx} style={[styles.speciesItem, idx > 0 && styles.borderTop]}>
                <View style={styles.speciesIconContainer}>
                  <Ionicons name="fish" size={24} color={theme.colors.primary} />
                </View>
                <View style={styles.speciesInfo}>
                  <View style={styles.row}>
                    <Text style={styles.speciesName}>{species.commonName}</Text>
                    <View style={[styles.compatibilityBadge, { backgroundColor: badgeBg }]}>
                      <Text style={{ color: badgeColor, fontSize: 12, fontWeight: 'bold' }}>{score}% Score</Text>
                    </View>
                  </View>
                  <Text style={styles.scientificName}>{species.scientificName}</Text>
                  <View style={styles.speciesStats}>
                    <Text style={styles.statMini}>Yield: {species.expectedYieldKg.toLocaleString('en-IN')} kg</Text>
                    <Text style={styles.statMini}>BCR: {species.benefitCostRatio ? species.benefitCostRatio.toFixed(2) : 'N/A'}:1</Text>
                  </View>
                  <View style={styles.speciesStats}>
                    <Text style={styles.statMini}>FCR: {species.fcr ? species.fcr.toFixed(2) : '1.50'}</Text>
                    <Text style={[styles.statMini, { color: theme.colors.success }]}>Profit: {formatCurrency(species.netProfitInr || 0)}</Text>
                  </View>
                  {species.compatibilityReasons.map((reason: string, rIdx: number) => (
                    <View key={rIdx} style={styles.reasonItem}>
                      <View style={styles.dot} />
                      <Text style={styles.reasonText}>{reason}</Text>
                    </View>
                  ))}
                </View>
              </View>
            );
          })}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t('economics.riskAnalysis') || 'Risk & Mitigation'}</Text>
        <View style={styles.card}>
          <View style={styles.riskHeader}>
            <Text style={styles.riskLabel}>Overall Profile:</Text>
            <Text style={[styles.riskValue, {
              color: simulationData.riskAnalysisProfile.overallRisk === 'HIGH' ? theme.colors.error :
                simulationData.riskAnalysisProfile.overallRisk === 'MEDIUM' ? theme.colors.accent :
                  theme.colors.success
            }]}>
              {simulationData.riskAnalysisProfile.overallRisk}
            </Text>
          </View>

          {simulationData.riskAnalysisProfile.riskFactors.map((risk: any, idx: number) => (
            <View key={idx} style={styles.riskItem}>
              <Ionicons name="warning-outline" size={20} color={theme.colors.accent} />
              <View style={{ flex: 1 }}>
                <Text style={styles.riskCategory}>{risk.category}</Text>
                <Text style={styles.riskText}>{risk.description}</Text>
              </View>
            </View>
          ))}

          <View style={styles.mitigationContainer}>
            <Text style={styles.mitigationTitle}>Suggested Actions</Text>
            {simulationData.riskAnalysisProfile.mitigationStrategies.map((strategy: string, idx: number) => (
              <View key={idx} style={styles.strategyItem}>
                <Ionicons name="shield-checkmark" size={16} color={theme.colors.success} />
                <Text style={styles.strategyText}>{strategy}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>* Projections are based on historical data and current market rates.</Text>
      </View>
    </ScrollView >
  );
}

function StatRow({ label, value, color, bold, styles }: { label: string; value: string; color?: string; bold?: boolean; styles: any; }) {
  return (
    <View style={styles.statRow}>
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={[styles.statValue, color && { color }, bold && { fontWeight: 'bold' }]}>{value}</Text>
    </View>
  );
}

const getStyles = (theme: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background
  },
  header: {
    padding: 16,
    backgroundColor: theme.colors.primary,
    paddingTop: 40
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16
  },
  headerTitle: {
    ...theme.typography.h2,
    color: '#fff'
  },
  scoreCard: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center'
  },
  scoreLabel: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    textTransform: 'uppercase',
    fontWeight: 'bold'
  },
  scoreValue: {
    fontSize: 56,
    fontWeight: 'bold',
    color: '#fff',
    marginVertical: 4
  },
  scoreStatus: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '500'
  },
  section: {
    marginTop: 20,
    paddingHorizontal: 16
  },
  sectionTitle: {
    ...theme.typography.h3,
    color: theme.colors.textPrimary,
    marginBottom: 12
  },
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
    padding: 16,
    ...theme.shadows.sm
  },
  divider: {
    height: 1,
    backgroundColor: theme.colors.border,
    marginVertical: 4
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border
  },
  statLabel: {
    fontSize: 14,
    color: theme.colors.textSecondary
  },
  statValue: {
    fontSize: 15,
    fontWeight: '600',
    color: theme.colors.textPrimary
  },
  speciesItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    paddingVertical: 16
  },
  borderTop: {
    borderTopWidth: 1,
    borderTopColor: theme.colors.border
  },
  speciesIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.isDark ? '#1a3a1f' : '#E8F5E9',
    alignItems: 'center',
    justifyContent: 'center'
  },
  speciesInfo: {
    flex: 1
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  speciesName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.textPrimary,
    flex: 1,
    marginRight: 8
  },
  compatibilityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    flexShrink: 0,
    alignItems: 'center'
  },
  scientificName: {
    fontSize: 13,
    fontStyle: 'italic',
    color: theme.colors.textSecondary,
    marginBottom: 8
  },
  speciesStats: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 8
  },
  statMini: {
    fontSize: 13,
    fontWeight: '500',
    color: theme.colors.textSecondary
  },
  reasonItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: theme.colors.primary
  },
  reasonText: {
    fontSize: 12,
    color: theme.colors.textSecondary
  },
  riskHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border
  },
  riskLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: theme.colors.textPrimary
  },
  riskValue: {
    fontSize: 16,
    fontWeight: 'bold'
  },
  riskItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 16
  },
  riskCategory: {
    fontSize: 14,
    fontWeight: 'bold',
    color: theme.colors.textPrimary
  },
  riskText: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    marginTop: 2
  },
  mitigationContainer: {
    backgroundColor: theme.colors.background,
    padding: 12,
    borderRadius: 8,
    marginTop: 4
  },
  mitigationTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: theme.colors.textPrimary,
    marginBottom: 8,
    textTransform: 'uppercase'
  },
  strategyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6
  },
  strategyText: {
    fontSize: 13,
    color: theme.colors.textPrimary
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  footer: {
    padding: 24,
    alignItems: 'center'
  },
  footerText: {
    fontSize: 11,
    color: theme.colors.textMuted,
    textAlign: 'center'
  }
});