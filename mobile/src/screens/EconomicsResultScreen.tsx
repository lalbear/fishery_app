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
import { theme } from '../theme';

export default function EconomicsResultScreen() {
  const { t } = useTranslation();
  const route = useRoute();
  const navigation = useNavigation();
  const { simulationData } = route.params as any;

  if (!simulationData) {
    return (
      <View style={styles.errorContainer}>
        <Text>No simulation data available.</Text>
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
          <StatRow label={t('economics.totalInvestment') || 'Total CAPEX'} value={formatCurrency(simulationData.totalCapitalExpenditureInr)} />
          <StatRow
            label={t('economics.subsidyAmount') || 'Government Subsidy (PMMSY)'}
            value={formatCurrency(simulationData.subsidyAmountInr)}
            color={theme.colors.success}
          />
          <StatRow
            label={t('economics.effectiveInvestment') || 'Your Contribution'}
            value={formatCurrency(simulationData.subsidizedCapitalExpenditureInr)}
            bold
          />
          <StatRow
            label={t('economics.breakeven') || 'Breakeven Timeline'}
            value={`${simulationData.breakevenTimelineMonths} Months`}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t('economics.recommendedSpecies') || 'Species Viability'}</Text>
        <View style={styles.card}>
          {simulationData.recommendedSpecies.map((species: any, idx: number) => (
            <View key={idx} style={[styles.speciesItem, idx > 0 && styles.borderTop]}>
              <View style={styles.speciesIconContainer}>
                <Ionicons name="fish" size={24} color={theme.colors.primary} />
              </View>
              <View style={styles.speciesInfo}>
                <View style={styles.row}>
                  <Text style={styles.speciesName}>{species.commonName}</Text>
                  <Text style={styles.compatibilityBadge}>{species.compatibilityScore}% Score</Text>
                </View>
                <Text style={styles.scientificName}>{species.scientificName}</Text>
                <View style={styles.speciesStats}>
                  <Text style={styles.statMini}>Yield: {species.expectedYieldKg} kg</Text>
                  <Text style={styles.statMini}>Rev: {formatCurrency(species.expectedRevenueInr)}</Text>
                </View>
                {species.compatibilityReasons.map((reason: string, rIdx: number) => (
                  <View key={rIdx} style={styles.reasonItem}>
                    <View style={styles.dot} />
                    <Text style={styles.reasonText}>{reason}</Text>
                  </View>
                ))}
              </View>
            </View>
          ))}
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
    </ScrollView>
  );
}

function StatRow({ label, value, color, bold }: { label: string; value: string; color?: string; bold?: boolean }) {
  return (
    <View style={styles.statRow}>
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={[styles.statValue, color && { color }, bold && { fontWeight: 'bold' }]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
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
    color: '#333',
    marginBottom: 12
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    ...theme.shadows.sm
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0'
  },
  statLabel: {
    fontSize: 14,
    color: '#666'
  },
  statValue: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333'
  },
  speciesItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    paddingVertical: 16
  },
  borderTop: {
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0'
  },
  speciesIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E8F5E9',
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
    color: '#333'
  },
  compatibilityBadge: {
    fontSize: 12,
    fontWeight: 'bold',
    color: theme.colors.primary,
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4
  },
  scientificName: {
    fontSize: 13,
    fontStyle: 'italic',
    color: '#888',
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
    color: '#555'
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
    color: '#666'
  },
  riskHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0'
  },
  riskLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#444'
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
    color: '#333'
  },
  riskText: {
    fontSize: 13,
    color: '#666',
    marginTop: 2
  },
  mitigationContainer: {
    backgroundColor: '#FAFAFA',
    padding: 12,
    borderRadius: 8,
    marginTop: 4
  },
  mitigationTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#333',
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
    color: '#444'
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
    color: '#999',
    textAlign: 'center'
  }
});