/**
 * Market Prices Screen — connected to live backend API
 * Shows fish pictures + per-species average prices
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, StyleSheet, FlatList, Image,
  ActivityIndicator, RefreshControl, Alert, TouchableOpacity,
  TextInput,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { marketService, speciesService } from '../services/apiService';
import { useTheme } from '../ThemeContext';
import ScreenHeader from '../components/ScreenHeader';
import SparkLine from '../components/SparkLine';

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

function trendIcon(price: number, avg: number, theme: any) {
  if (price > avg * 1.05) return { name: 'trending-up-outline', color: theme.colors.success };
  if (price < avg * 0.95) return { name: 'trending-down-outline', color: theme.colors.error };
  return { name: 'remove-outline', color: theme.colors.textMuted };
}

// Group prices by species for sparkline data
function getSparklineData(prices: PriceRow[], speciesName: string): number[] {
  return prices
    .filter(p => p.species_name === speciesName)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(-7)
    .map(p => parseFloat(p.price_inr_per_kg));
}

function priceDelta(current: number, benchmark: number): { pct: number; up: boolean } {
  if (benchmark === 0) return { pct: 0, up: true };
  const pct = ((current - benchmark) / benchmark) * 100;
  return { pct: Math.abs(pct), up: pct >= 0 };
}

export default function MarketPricesScreen() {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const navigation = useNavigation<any>();

  const [prices, setPrices] = useState<PriceRow[]>([]);
  const [speciesData, setSpeciesData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  // B10 FIX: initialized as null so we don't show a fake "200" before data loads
  const [globalAvg, setGlobalAvg] = useState<number | null>(null);

  const loadData = useCallback(async () => {
    try {
      const [marketRes, speciesRes] = await Promise.all([
        marketService.getPrices(),
        speciesService.getAll()
      ]);

      if (speciesRes.success && speciesRes.data) {
        setSpeciesData(speciesRes.data);
      }

      if (marketRes.success && marketRes.data) {
        setPrices(marketRes.data);
        if (marketRes.data.length > 0) {
          const total = marketRes.data.reduce((s: number, r: PriceRow) => s + parseFloat(r.price_inr_per_kg), 0);
          setGlobalAvg(total / marketRes.data.length);
        } else {
          setGlobalAvg(null);
        }
      }
    } catch (err) {
      Alert.alert('Error', 'Could not load market prices. Please check your connection.');
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  const onRefresh = () => { setRefreshing(true); loadData(); };

  const getFishImage = useCallback((speciesName: string) => {
    if (!speciesName) return null;
    const name = speciesName.trim().toLowerCase();

    const match = speciesData.find(s => {
      const d = s.data || {};
      const common = (d.common_names?.en || '').toLowerCase();
      const scientific = (d.scientific_name || '').toLowerCase();
      return common.includes(name) || name.includes(common) ||
        scientific.includes(name) || name.includes(scientific);
    });

    return match?.data?.image_url || null;
  }, [speciesData]);

  const getSpeciesAvgPrice = useCallback((speciesName: string, liveAvg: number) => {
    if (!speciesName) return liveAvg;
    const name = speciesName.trim().toLowerCase();

    const match = speciesData.find(s => {
      const d = s.data || {};
      const common = (d.common_names?.en || '').toLowerCase();
      const scientific = (d.scientific_name || '').toLowerCase();
      return common.includes(name) || name.includes(common) ||
        scientific.includes(name) || name.includes(scientific);
    });

    if (match) {
      const p = match.data?.economic_parameters?.market_price_per_kg_inr || match.data?.economic_parameters?.market_price_inr_per_kg;
      if (p && p.min && p.max) return (p.min + p.max) / 2;
    }
    return liveAvg;
  }, [speciesData]);

  const mergedData = speciesData.map((s: any) => {
    const commonName = s.data?.common_names?.en || s.data?.scientific_name;
    const priceEntry = prices.find((p: PriceRow) =>
      p.species_name.toLowerCase().includes(commonName.toLowerCase()) ||
      commonName.toLowerCase().includes(p.species_name.toLowerCase())
    );

    return {
      id: s.id,
      species_name: commonName,
      price_inr_per_kg: priceEntry?.price_inr_per_kg || null,
      market_name: priceEntry?.market_name || 'Generic Market',
      state_code: priceEntry?.state_code || 'IN',
      date: priceEntry?.date || new Date().toISOString(),
      grade: priceEntry?.grade,
      hasPrice: !!priceEntry
    };
  }).filter((item: any) =>
    searchQuery === '' ||
    item.species_name.toLowerCase().includes(searchQuery.toLowerCase())
  ).sort((a: any, b: any) => (b.hasPrice ? 1 : 0) - (a.hasPrice ? 1 : 0));

  if (isLoading) {
    return (
      <SafeAreaView style={[styles.container, { justifyContent: 'center', alignItems: 'center', backgroundColor: theme.colors.surface }]} edges={['top']}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={{ marginTop: 12, color: theme.colors.textSecondary }}>Loading market prices…</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.surface }]} edges={['top']}>
      <ScreenHeader
        title={t('markets.title') || 'Market Prices'}
        onBack={() => (navigation as any).navigate('Main', { screen: 'Home' })}
        variant="surface"
      />
      <View style={styles.subHeader}>
        <Text style={styles.subtitle}>{t('markets.subtitle') || 'Live aquaculture commodity prices'}</Text>
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={18} color={theme.colors.textMuted} />
          <TextInput
            style={styles.searchInput}
            placeholder={t('common.search') || "Search species..."}
            placeholderTextColor={theme.colors.textMuted}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      <FlatList
        data={mergedData}
        keyExtractor={(item) => item.id}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[theme.colors.primary]} tintColor={theme.colors.primary} />}
        renderItem={({ item }) => {
          const price = item.price_inr_per_kg ? parseFloat(item.price_inr_per_kg) : null;
          const speciesAvg = getSpeciesAvgPrice(item.species_name, globalAvg ?? 0);
          const { name: iconName, color: iconColor } = price ? trendIcon(price, speciesAvg, theme) : { name: 'help-circle-outline', color: theme.colors.textMuted };
          const fishImg = getFishImage(item.species_name);

          const sparkData = getSparklineData(prices, item.species_name);
          const finalSparkData = price ? (sparkData.length > 1 ? sparkData : [price * 0.98, price * 1.01, price]) : [];
          const delta = price ? priceDelta(price, speciesAvg) : { pct: 0, up: true };

          return (
            <View style={[styles.priceCard, !price && { opacity: 0.85 }]}>
              {/* Fish Image */}
              <FishImageComponent imageUrl={fishImg} speciesName={item.species_name} theme={theme} styles={styles} />

              {/* Card Content */}
              <View style={styles.cardContent}>
                <View style={styles.cardHeader}>
                  <Text style={styles.speciesName}>{item.species_name}</Text>
                  <Ionicons name={iconName as any} size={20} color={iconColor} />
                </View>

                <View style={styles.priceRow}>
                  <View>
                    <Text style={styles.priceLabel}>Current Price</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                      <Text style={[styles.price, !price && { color: theme.colors.textMuted, fontSize: 16 }]}>
                        {price ? `₹${price.toFixed(0)}/kg` : 'No recent trade data'}
                      </Text>
                      {price && delta.pct > 0 && (
                        <View style={{ backgroundColor: delta.up ? theme.colors.success + '22' : theme.colors.error + '22', paddingHorizontal: 4, paddingVertical: 2, borderRadius: 4 }}>
                          <Text style={{ fontSize: 10, fontWeight: '700', color: delta.up ? theme.colors.success : theme.colors.error }}>
                            {delta.up ? '↑' : '↓'} {delta.pct.toFixed(1)}%
                          </Text>
                        </View>
                      )}
                    </View>
                  </View>
                  <View style={{ alignItems: 'flex-end', gap: 4 }}>
                    {price && <SparkLine data={finalSparkData} color={iconColor} width={60} height={20} />}
                    <Text style={styles.avgPriceLabel}>
                      Benchmark: {speciesAvg > 0 ? `₹${speciesAvg.toFixed(0)}/kg` : '—'}
                    </Text>
                  </View>
                </View>

                <View style={styles.cardFooter}>
                  <Text style={styles.marketName}>{price ? `${item.market_name} • ${item.state_code}` : 'Awaiting data'}</Text>
                  {item.grade ? <Text style={styles.grade}>Grade: {item.grade}</Text> : null}
                </View>
              </View>
            </View>
          );
        }}
        ListEmptyComponent={
          <View style={{ padding: 40, alignItems: 'center' }}>
            <Ionicons name="alert-circle-outline" size={48} color={theme.colors.border} />
            <Text style={{ marginTop: 12, color: theme.colors.textMuted }}>No species match your search</Text>
          </View>
        }
        contentContainerStyle={styles.list}
      />
    </SafeAreaView>
  );
}

function FishImageComponent({ imageUrl, speciesName, theme, styles }: { imageUrl: string | null; speciesName: string; theme: any; styles: any; }) {
  const [imgError, setImgError] = useState(false);

  if (imageUrl && !imgError) {
    return (
      <Image
        source={{ uri: imageUrl }}
        style={styles.fishImage}
        resizeMode="cover"
        onError={() => setImgError(true)}
      />
    );
  }

  return (
    <View style={styles.fishImageFallback}>
      <Ionicons name="fish" size={36} color={theme.colors.primary} />
      <Text style={styles.fishImageFallbackText} numberOfLines={1}>{speciesName}</Text>
    </View>
  );
}

const getStyles = (theme: any) => StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  subHeader: { paddingHorizontal: 16, paddingVertical: 12, backgroundColor: theme.colors.surface, borderBottomWidth: 1, borderBottomColor: theme.colors.border },
  subtitle: { fontSize: 13, color: theme.colors.textSecondary, marginBottom: 12 },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.isDark ? '#2c2c2c' : '#f5f5f5',
    borderRadius: 8,
    paddingHorizontal: 10,
    height: 36,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: theme.colors.textPrimary,
    marginLeft: 8,
    padding: 0,
  },
  list: { padding: 12 },
  priceCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: 16,
    marginBottom: 14,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  fishImage: { width: '100%', height: 150 },
  fishImageFallback: {
    width: '100%', height: 120,
    backgroundColor: theme.isDark ? '#1e3a1e' : '#e8f5e9',
    justifyContent: 'center', alignItems: 'center',
  },
  fishImageFallbackText: { fontSize: 12, color: theme.colors.textSecondary, marginTop: 6 },
  cardContent: { padding: 14 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 },
  speciesName: { fontSize: 18, fontWeight: '700', color: theme.colors.textPrimary, flex: 1, marginRight: 8 },
  priceRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 10 },
  priceLabel: { fontSize: 11, color: theme.colors.textSecondary, marginBottom: 2 },
  price: { fontSize: 22, fontWeight: 'bold', color: theme.colors.primary },
  avgPriceBadge: {
    backgroundColor: theme.isDark ? '#1a2e1a' : '#e8f5e9',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    alignItems: 'flex-end',
  },
  avgPriceLabel: { fontSize: 10, color: theme.colors.textSecondary, marginBottom: 2 },
  avgPrice: { fontSize: 15, fontWeight: '700', color: theme.colors.success },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  marketName: { fontSize: 13, color: theme.colors.textSecondary },
  grade: { fontSize: 12, color: theme.colors.textMuted, fontStyle: 'italic' },
});