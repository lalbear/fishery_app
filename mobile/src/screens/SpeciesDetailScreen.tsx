/**
 * Species Detail Screen
 */

import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useTheme } from '../ThemeContext';
import ScreenHeader from '../components/ScreenHeader';

export default function SpeciesDetailScreen() {
  const { t, i18n } = useTranslation();
  const route = useRoute();
  const navigation = useNavigation();
  const { speciesData } = route.params as any;
  const { theme } = useTheme();
  const styles = getStyles(theme);

  if (!speciesData) {
    return (
      <View style={styles.container}>
        <Text style={{ color: theme.colors.textPrimary }}>No species data available.</Text>
      </View>
    );
  }

  const d = speciesData.data || {};
  const params = d.biological_parameters || {};
  const econ = d.economic_parameters || {};
  const currentLang = i18n.language || 'en';
  const enName = d.common_names?.en;
  const translatedName = enName ? t(`species.names.${enName}`, { defaultValue: '' }) : '';
  const commonName = translatedName || d.common_names?.[currentLang] || enName || d.scientific_name;

  return (
    <SafeAreaView style={styles.safeContainer} edges={['top']}>
      <ScreenHeader
        title={commonName}
        onBack={() => (navigation as any).goBack()}
        variant="surface"
      />
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          {d.image_url ? (
            <Image
              source={{ uri: d.image_url }}
              style={{
                width: '100%',
                height: 220,
                borderRadius: theme.borderRadius.lg,
                marginBottom: theme.spacing.md,
                backgroundColor: theme.isDark ? '#1a1a1a' : '#f0f0f0',
                // B1 FIX: removed the erroneous scaleY: -1 transform that was flipping the Rohu image
              }}
              resizeMode="contain"
            />
          ) : (
            <View style={styles.iconWrap}>
              <Ionicons name="fish" size={48} color={theme.colors.surface} />
            </View>
          )}
          <Text style={styles.title}>{commonName}</Text>
          <Text style={styles.scientificName}>{d.scientific_name}</Text>
          {d.category && <Text style={styles.badge}>{(d.category || '').replace(/_/g, ' ')}</Text>}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('species.biologicalParameters') || 'Biological Parameters'}</Text>
          <View style={styles.paramCard}>
            <ParamRow
              theme={theme}
              styles={styles}
              icon="thermometer-outline"
              label={t('species.temperature') || 'Temperature'}
              value={`${params.temperature_celsius?.min}°C - ${params.temperature_celsius?.max}°C`}
            />
            <ParamRow
              theme={theme}
              styles={styles}
              icon="water-outline"
              label={t('species.dissolvedOxygen') || 'Min. DO'}
              value={`> ${params.dissolved_oxygen_mg_l?.min || params.min_do || '5.0'} mg/L`}
            />
            <ParamRow
              theme={theme}
              styles={styles}
              icon="flask-outline"
              label={t('species.ph') || 'pH Range'}
              value={`${params.ph_range?.min || '6.5'} - ${params.ph_range?.max || '8.5'}`}
            />
            <ParamRow
              theme={theme}
              styles={styles}
              icon="sunny-outline"
              label={t('species.salinity') || 'Salinity Tolerance'}
              value={`${params.salinity_tolerance_ppt?.min || 0} - ${params.salinity_tolerance_ppt?.max || 5} ppt`}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('species.economicParameters') || 'Economic Projections'}</Text>
          <View style={styles.paramCard}>
            {d.excel_economics ? (
              <>
                <ParamRow
                  theme={theme}
                  styles={styles}
                  icon="cash-outline"
                  label="Benchmark Market Price"
                  value={`₹${d.excel_economics.market_price_inr_kg}/kg`}
                />
                <ParamRow
                  theme={theme}
                  styles={styles}
                  icon="time-outline"
                  label="Culture Duration"
                  value={`${d.excel_economics.culture_period_months} months`}
                />
                <ParamRow
                  theme={theme}
                  styles={styles}
                  icon="analytics-outline"
                  label="Typical Survival"
                  value={`${d.excel_economics.harvest_survival_percent}%`}
                />
                <ParamRow
                  theme={theme}
                  styles={styles}
                  icon="business-outline"
                  label="CAPEX (Infrastructure)"
                  value={`₹${d.excel_economics.capital_investment_lakh_ha} Lakh / Ha`}
                />
                <ParamRow
                  theme={theme}
                  styles={styles}
                  icon="receipt-outline"
                  label="OPEX (Per Crop)"
                  value={`₹${d.excel_economics.operational_cost_lakh_ha_crop} Lakh / Ha`}
                />
                <ParamRow
                  theme={theme}
                  styles={styles}
                  icon="refresh-outline"
                  label="Crops per Year"
                  value={`${d.excel_economics.crops_per_year}`}
                />
              </>
            ) : (
              <>
                <ParamRow
                  theme={theme}
                  styles={styles}
                  icon="nutrition-outline"
                  label={t('species.feedConversionRatio') || 'Avg. FCR'}
                  value={`${econ.feed_conversion_ratio?.min || 1.2} - ${econ.feed_conversion_ratio?.max || 1.8}`}
                />
                <ParamRow
                  theme={theme}
                  styles={styles}
                  icon="trending-up-outline"
                  label={t('species.expectedYield') || 'Expected Yield'}
                  value={`${econ.expected_yield_mt_per_acre?.min || 3}-${econ.expected_yield_mt_per_acre?.max || 5} MT/Acre`}
                />
                <ParamRow
                  theme={theme}
                  styles={styles}
                  icon="cash-outline"
                  label={t('species.marketPrice') || 'Market Price'}
                  value={`₹${econ.market_price_per_kg_inr?.min || 100}-${econ.market_price_per_kg_inr?.max || 150}/kg`}
                />
                <ParamRow
                  theme={theme}
                  styles={styles}
                  icon="time-outline"
                  label={t('species.culturePeriod') || 'Culture Period'}
                  value={`${d.culture_period_months?.min || 8}-${d.culture_period_months?.max || 10} months`}
                />
              </>
            )}
          </View>
        </View>

        {d.optimal_systems && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Optimal Systems</Text>
            <View style={styles.systemsRow}>
              {d.optimal_systems.map((s: string, idx: number) => (
                <View key={idx} style={styles.systemBadge}>
                  <Text style={styles.systemBadgeText}>{s.replace(/_/g, ' ')}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Bottom padding */}
        <View style={{ height: theme.spacing.xxl }} />
      </ScrollView>
    </SafeAreaView>
  );
}

function ParamRow({ icon, label, value, theme, styles }: { icon: any; label: string; value: string; theme: any; styles: any; }) {
  return (
    <View style={styles.paramRow}>
      <Ionicons name={icon} size={20} color={theme.colors.textSecondary} />
      <Text style={styles.paramLabel}>{label}</Text>
      <Text style={styles.paramValue}>{value}</Text>
    </View>
  );
}

const getStyles = (theme: any) => StyleSheet.create({
  safeContainer: { flex: 1, backgroundColor: theme.colors.surface },
  container: { flex: 1, backgroundColor: theme.colors.background },
  header: { alignItems: 'center', padding: theme.spacing.xl, backgroundColor: theme.colors.surface },
  iconWrap: {
    width: 80, height: 80, borderRadius: 40,
    backgroundColor: theme.colors.success,
    justifyContent: 'center', alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  title: { ...theme.typography.h2, color: theme.colors.primary, textAlign: 'center' },
  scientificName: { ...theme.typography.body, fontStyle: 'italic', color: theme.colors.textSecondary, marginTop: theme.spacing.xs },
  badge: {
    marginTop: theme.spacing.sm, fontSize: 13,
    backgroundColor: theme.isDark ? '#1a3a1f' : '#E8F5E9', color: theme.colors.success,
    paddingHorizontal: 12, paddingVertical: 4, borderRadius: theme.borderRadius.sm,
    fontWeight: '600', textTransform: 'uppercase', overflow: 'hidden',
  },
  section: { marginTop: theme.spacing.md, paddingHorizontal: theme.spacing.md },
  sectionTitle: { ...theme.typography.h3, color: theme.colors.textPrimary, marginBottom: theme.spacing.sm },
  paramCard: { backgroundColor: theme.colors.surface, borderRadius: theme.borderRadius.md, padding: theme.spacing.md },
  paramRow: {
    flexDirection: 'row', alignItems: 'center',
    paddingVertical: theme.spacing.sm + 2,
    borderBottomWidth: 1, borderBottomColor: theme.colors.border,
  },
  paramLabel: { flex: 1, ...theme.typography.caption, color: theme.colors.textSecondary, marginLeft: theme.spacing.sm, fontSize: 14 },
  paramValue: { fontSize: 14, fontWeight: '600', color: theme.colors.textPrimary },
  systemsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: theme.spacing.sm },
  systemBadge: {
    backgroundColor: theme.colors.surface, paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.sm, borderRadius: theme.borderRadius.sm,
    borderWidth: 1, borderColor: theme.colors.border,
  },
  systemBadgeText: { fontSize: 13, color: theme.colors.textPrimary, fontWeight: '500' },
});