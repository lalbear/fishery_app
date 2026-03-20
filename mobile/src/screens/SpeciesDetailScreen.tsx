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
      <View style={styles.emptyWrap}>
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
      <ScreenHeader title={commonName} onBack={() => (navigation as any).goBack()} variant="surface" />
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        {d.image_url ? (
          <Image source={{ uri: d.image_url }} style={styles.heroImage} resizeMode="cover" />
        ) : (
          <View style={styles.heroFallback}>
            <Ionicons name="fish" size={56} color={theme.colors.primary} />
          </View>
        )}

        <View style={styles.heroCard}>
          <Text style={styles.title}>{commonName}</Text>
          <Text style={styles.scientificName}>{d.scientific_name}</Text>
          {d.category ? <Text style={styles.badge}>{(d.category || '').replace(/_/g, ' ')}</Text> : null}
          {d.description ? <Text style={styles.description}>{d.description}</Text> : null}
        </View>

        <Section title={t('species.biologicalParameters') || 'Biological Parameters'} styles={styles}>
          <ParamRow icon="thermometer-outline" label="Temperature" value={`${params.temperature_celsius?.min || '-'}°C - ${params.temperature_celsius?.max || '-'}°C`} theme={theme} styles={styles} />
          <ParamRow icon="water-outline" label="Min. DO" value={`> ${params.dissolved_oxygen_mg_l?.min || params.min_do || '5.0'} mg/L`} theme={theme} styles={styles} />
          <ParamRow icon="flask-outline" label="pH Range" value={`${params.ph_range?.min || '6.5'} - ${params.ph_range?.max || '8.5'}`} theme={theme} styles={styles} />
          <ParamRow icon="water" label="Salinity" value={`${params.salinity_tolerance_ppt?.min || 0} - ${params.salinity_tolerance_ppt?.max || 5} ppt`} theme={theme} styles={styles} />
        </Section>

        <Section title={t('species.economicParameters') || 'Economic Projections'} styles={styles}>
          {d.excel_economics ? (
            <>
              <ParamRow icon="cash-outline" label="Benchmark Market Price" value={`₹${d.excel_economics.market_price_inr_kg}/kg`} theme={theme} styles={styles} />
              <ParamRow icon="time-outline" label="Culture Duration" value={`${d.excel_economics.culture_period_months} months`} theme={theme} styles={styles} />
              <ParamRow icon="analytics-outline" label="Typical Survival" value={`${d.excel_economics.harvest_survival_percent}%`} theme={theme} styles={styles} />
              <ParamRow icon="business-outline" label="CAPEX" value={`₹${d.excel_economics.capital_investment_lakh_ha} Lakh / Ha`} theme={theme} styles={styles} />
            </>
          ) : (
            <>
              <ParamRow icon="nutrition-outline" label="Avg. FCR" value={`${econ.feed_conversion_ratio?.min || 1.2} - ${econ.feed_conversion_ratio?.max || 1.8}`} theme={theme} styles={styles} />
              <ParamRow icon="trending-up-outline" label="Expected Yield" value={`${econ.expected_yield_mt_per_acre?.min || 3}-${econ.expected_yield_mt_per_acre?.max || 5} MT/Acre`} theme={theme} styles={styles} />
              <ParamRow icon="cash-outline" label="Market Price" value={`₹${econ.market_price_per_kg_inr?.min || 100}-${econ.market_price_per_kg_inr?.max || 150}/kg`} theme={theme} styles={styles} />
              <ParamRow icon="time-outline" label="Culture Period" value={`${d.culture_period_months?.min || 8}-${d.culture_period_months?.max || 10} months`} theme={theme} styles={styles} />
            </>
          )}
        </Section>

        {d.optimal_systems?.length ? (
          <Section title="Optimal Systems" styles={styles}>
            <View style={styles.systemsRow}>
              {d.optimal_systems.map((s: string, idx: number) => (
                <View key={idx} style={styles.systemBadge}>
                  <Text style={styles.systemBadgeText}>{s.replace(/_/g, ' ')}</Text>
                </View>
              ))}
            </View>
          </Section>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}

function Section({ title, styles, children }: any) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.sectionCard}>{children}</View>
    </View>
  );
}

function ParamRow({ icon, label, value, theme, styles }: { icon: any; label: string; value: string; theme: any; styles: any; }) {
  return (
    <View style={styles.paramRow}>
      <Ionicons name={icon} size={18} color={theme.colors.primary} />
      <Text style={styles.paramLabel}>{label}</Text>
      <Text style={styles.paramValue}>{value}</Text>
    </View>
  );
}

const getStyles = (theme: any) => StyleSheet.create({
  safeContainer: { flex: 1, backgroundColor: theme.colors.background },
  container: { flex: 1, backgroundColor: theme.colors.background },
  content: { padding: 16, paddingBottom: 110 },
  emptyWrap: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: theme.colors.background },
  heroImage: {
    width: '100%',
    height: 220,
    borderRadius: theme.borderRadius.lg,
  },
  heroFallback: {
    height: 220,
    borderRadius: theme.borderRadius.lg,
    backgroundColor: theme.colors.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: 18,
    marginTop: 14,
  },
  title: { ...theme.typography.h2 },
  scientificName: {
    color: theme.colors.textMuted,
    fontStyle: 'italic',
    marginTop: 4,
  },
  badge: {
    alignSelf: 'flex-start',
    marginTop: 12,
    backgroundColor: theme.colors.secondaryLight,
    color: theme.colors.secondary,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    fontSize: 12,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  description: {
    color: theme.colors.textSecondary,
    marginTop: 14,
    lineHeight: 22,
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
    paddingHorizontal: 16,
  },
  paramRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  paramLabel: {
    flex: 1,
    color: theme.colors.textSecondary,
    fontWeight: '600',
  },
  paramValue: {
    color: theme.colors.textPrimary,
    fontWeight: '700',
    maxWidth: '45%',
    textAlign: 'right',
  },
  systemsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    paddingVertical: 4,
  },
  systemBadge: {
    borderRadius: 12,
    backgroundColor: theme.colors.surfaceAlt,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  systemBadgeText: {
    color: theme.colors.textSecondary,
    fontWeight: '700',
  },
});
