/**
 * Species Detail Screen
 */

import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';

import { useRoute, useNavigation } from '@react-navigation/native';

export default function SpeciesDetailScreen() {
  const { t } = useTranslation();
  const route = useRoute();
  const navigation = useNavigation();
  const { speciesData } = route.params as any;

  if (!speciesData) {
    return (
      <View style={styles.container}>
        <Text>No species data available.</Text>
      </View>
    );
  }

  const d = speciesData.data || {};
  const params = d.biological_parameters || {};
  const econ = d.economic_parameters || {};
  const commonName = d.common_names?.en || d.scientific_name;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        {d.image_url ? (
          <Image
            source={{ uri: d.image_url }}
            style={{ width: '100%', height: 220, borderRadius: 16, marginBottom: 16 }}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.iconWrap}>
            <Ionicons name="fish" size={48} color="#fff" />
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
            icon="thermometer-outline"
            label={t('species.temperature') || 'Temperature'}
            value={`${params.temperature_celsius?.min}°C - ${params.temperature_celsius?.max}°C`}
          />
          <ParamRow
            icon="water-outline"
            label={t('species.dissolvedOxygen') || 'Min. DO'}
            value={`> ${params.dissolved_oxygen_mg_l?.min || params.min_do || '5.0'} mg/L`}
          />
          <ParamRow
            icon="flask-outline"
            label={t('species.ph') || 'pH Range'}
            value={`${params.ph_range?.min || '6.5'} - ${params.ph_range?.max || '8.5'}`}
          />
          <ParamRow
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
                icon="cash-outline"
                label="Benchmark Market Price"
                value={`₹${d.excel_economics.market_price_inr_kg}/kg`}
              />
              <ParamRow
                icon="time-outline"
                label="Culture Duration"
                value={`${d.excel_economics.culture_period_months} months`}
              />
              <ParamRow
                icon="analytics-outline"
                label="Typical Survival"
                value={`${d.excel_economics.harvest_survival_percent}%`}
              />
              <ParamRow
                icon="business-outline"
                label="CAPEX (Infrastructure)"
                value={`₹${d.excel_economics.capital_investment_lakh_ha} Lakh / Ha`}
              />
              <ParamRow
                icon="receipt-outline"
                label="OPEX (Per Crop)"
                value={`₹${d.excel_economics.operational_cost_lakh_ha_crop} Lakh / Ha`}
              />
              <ParamRow
                icon="refresh-outline"
                label="Crops per Year"
                value={`${d.excel_economics.crops_per_year}`}
              />
            </>
          ) : (
            <>
              <ParamRow
                icon="nutrition-outline"
                label={t('species.feedConversionRatio') || 'Avg. FCR'}
                value={`${econ.feed_conversion_ratio?.min || 1.2} - ${econ.feed_conversion_ratio?.max || 1.8}`}
              />
              <ParamRow
                icon="trending-up-outline"
                label={t('species.expectedYield') || 'Expected Yield'}
                value={`${econ.expected_yield_mt_per_acre?.min || 3}-${econ.expected_yield_mt_per_acre?.max || 5} MT/Acre`}
              />
              <ParamRow
                icon="cash-outline"
                label={t('species.marketPrice') || 'Market Price'}
                value={`₹${econ.market_price_per_kg_inr?.min || 100}-${econ.market_price_per_kg_inr?.max || 150}/kg`}
              />
              <ParamRow
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

function ParamRow({ icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <View style={styles.paramRow}>
      <Ionicons name={icon} size={20} color="#666" />
      <Text style={styles.paramLabel}>{label}</Text>
      <Text style={styles.paramValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  header: { alignItems: 'center', padding: 32, backgroundColor: '#fff' },
  iconWrap: {
    width: 80, height: 80, borderRadius: 40,
    backgroundColor: '#4CAF50',
    justifyContent: 'center', alignItems: 'center',
    marginBottom: 16,
  },
  title: { fontSize: 28, fontWeight: 'bold', color: '#1B5E20' },
  scientificName: { fontSize: 16, fontStyle: 'italic', color: '#666', marginTop: 4 },
  badge: {
    marginTop: 12, fontSize: 13,
    backgroundColor: '#E8F5E9', color: '#2E7D32',
    paddingHorizontal: 12, paddingVertical: 4, borderRadius: 8, fontWeight: '600',
    textTransform: 'uppercase',
  },
  section: { marginTop: 16, padding: 16 },
  sectionTitle: { fontSize: 18, fontWeight: '600', color: '#333', marginBottom: 12 },
  paramCard: { backgroundColor: '#fff', borderRadius: 12, padding: 16 },
  paramRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  paramLabel: { flex: 1, fontSize: 14, color: '#666', marginLeft: 12 },
  paramValue: { fontSize: 14, fontWeight: '600', color: '#333' },
  systemsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  systemBadge: { backgroundColor: '#fff', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8, borderWidth: 1, borderColor: '#e0e0e0' },
  systemBadgeText: { fontSize: 13, color: '#444', fontWeight: '500' },
});