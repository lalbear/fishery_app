/**
 * Species Detail Screen
 */

import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';

import { useRoute, useNavigation } from '@react-navigation/native';
import { useTheme } from '../ThemeContext';

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
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        {d.image_url ? (
          <Image
            source={{ uri: d.image_url }}
            style={{ width: '100%', height: 220, borderRadius: 16, marginBottom: 16, backgroundColor: theme.isDark ? '#1a1a1a' : '#f0f0f0' }}
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
    </ScrollView>
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
  container: { flex: 1, backgroundColor: theme.colors.background },
  header: { alignItems: 'center', padding: 32, backgroundColor: theme.colors.surface },
  iconWrap: {
    width: 80, height: 80, borderRadius: 40,
    backgroundColor: theme.colors.success,
    justifyContent: 'center', alignItems: 'center',
    marginBottom: 16,
  },
  title: { fontSize: 28, fontWeight: 'bold', color: theme.colors.primary },
  scientificName: { fontSize: 16, fontStyle: 'italic', color: theme.colors.textSecondary, marginTop: 4 },
  badge: {
    marginTop: 12, fontSize: 13,
    backgroundColor: theme.isDark ? '#1a3a1f' : '#E8F5E9', color: theme.colors.success,
    paddingHorizontal: 12, paddingVertical: 4, borderRadius: 8, fontWeight: '600',
    textTransform: 'uppercase',
  },
  section: { marginTop: 16, padding: 16 },
  sectionTitle: { fontSize: 18, fontWeight: '600', color: theme.colors.textPrimary, marginBottom: 12 },
  paramCard: { backgroundColor: theme.colors.surface, borderRadius: 12, padding: 16 },
  paramRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: theme.colors.border },
  paramLabel: { flex: 1, fontSize: 14, color: theme.colors.textSecondary, marginLeft: 12 },
  paramValue: { fontSize: 14, fontWeight: '600', color: theme.colors.textPrimary },
  systemsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  systemBadge: { backgroundColor: theme.colors.surface, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8, borderWidth: 1, borderColor: theme.colors.border },
  systemBadgeText: { fontSize: 13, color: theme.colors.textPrimary, fontWeight: '500' },
});