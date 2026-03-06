/**
 * Market Prices Screen — connected to live backend API
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, StyleSheet, FlatList,
  ActivityIndicator, RefreshControl, Alert,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { marketService } from '../services/apiService';
import { useTheme } from '../ThemeContext';

interface PriceRow {
  id: string;
  species_name: string;
  market_name: string;
  state_code: string;
  price_inr_per_kg: string;
  grade?: string;
  date: string;
  source?: string;
}

function trendIcon(price: number, avgPrice: number, theme: any) {
  if (price > avgPrice * 1.05) return { name: 'trending-up-outline', color: theme.colors.success };
  if (price < avgPrice * 0.95) return { name: 'trending-down-outline', color: theme.colors.error };
  return { name: 'remove-outline', color: theme.colors.textMuted };
}

export default function MarketPricesScreen() {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const styles = getStyles(theme);

  const [prices, setPrices] = useState<PriceRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [avgPrice, setAvgPrice] = useState(200); // fallback

  const loadPrices = useCallback(async () => {
    try {
      const res = await marketService.getPrices();
      if (res.success && res.data) {
        setPrices(res.data);
        if (res.data.length > 0) {
          const total = res.data.reduce((s: number, r: PriceRow) => s + parseFloat(r.price_inr_per_kg), 0);
          setAvgPrice(total / res.data.length);
        }
      }
    } catch (err) {
      Alert.alert('Error', 'Could not load market prices. Please check your connection.');
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { loadPrices(); }, [loadPrices]);

  const onRefresh = () => { setRefreshing(true); loadPrices(); };

  if (isLoading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={{ marginTop: 12, color: theme.colors.textSecondary }}>Loading market prices…</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{t('markets.title') || 'Market Prices'}</Text>
        <Text style={styles.subtitle}>{t('markets.subtitle') || 'Live aquaculture commodity prices'}</Text>
      </View>

      <FlatList
        data={prices}
        keyExtractor={(item) => item.id}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[theme.colors.primary]} tintColor={theme.colors.primary} />}
        renderItem={({ item }) => {
          const price = parseFloat(item.price_inr_per_kg);
          const { name: iconName, color: iconColor } = trendIcon(price, avgPrice, theme);
          return (
            <View style={styles.priceCard}>
              <View style={styles.cardHeader}>
                <Ionicons name="fish-outline" size={24} color={theme.colors.success} />
                <Text style={styles.speciesName}>{item.species_name}</Text>
                <Ionicons name={iconName as any} size={20} color={iconColor} />
              </View>
              <View style={styles.cardBody}>
                <Text style={styles.marketName}>{item.market_name} • {item.state_code}</Text>
                <Text style={styles.price}>₹{price.toFixed(0)} {t('markets.perKg') || '/kg'}</Text>
              </View>
              {item.grade ? <Text style={styles.grade}>Grade: {item.grade}</Text> : null}
            </View>
          );
        }}
        ListEmptyComponent={
          <View style={{ padding: 40, alignItems: 'center' }}>
            <Ionicons name="alert-circle-outline" size={48} color={theme.colors.border} />
            <Text style={{ marginTop: 12, color: theme.colors.textMuted }}>No price data available</Text>
          </View>
        }
        contentContainerStyle={styles.list}
      />
    </View>
  );
}

const getStyles = (theme: any) => StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  header: { padding: 16, backgroundColor: theme.colors.surface },
  title: { fontSize: 24, fontWeight: 'bold', color: theme.colors.textPrimary },
  subtitle: { fontSize: 14, color: theme.colors.textSecondary, marginTop: 4 },
  list: { padding: 16 },
  priceCard: { backgroundColor: theme.colors.surface, borderRadius: 12, padding: 16, marginBottom: 12, elevation: 2 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  speciesName: { flex: 1, fontSize: 16, fontWeight: '600', color: theme.colors.textPrimary },
  cardBody: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 },
  marketName: { fontSize: 14, color: theme.colors.textSecondary },
  price: { fontSize: 16, fontWeight: 'bold', color: theme.colors.primary },
  grade: { fontSize: 12, color: theme.colors.textMuted, marginTop: 4 },
});