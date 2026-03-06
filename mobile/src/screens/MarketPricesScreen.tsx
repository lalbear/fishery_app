/**
 * Market Prices Screen — connected to live backend API
 * Shows fish pictures + per-species average prices
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, StyleSheet, FlatList, Image,
  ActivityIndicator, RefreshControl, Alert, TouchableOpacity,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { marketService } from '../services/apiService';
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

// High quality fish images from Wikimedia Commons / public domain
const FISH_IMAGES: Record<string, string> = {
  'Vannamei Shrimp': 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4f/Vannamei8.jpg/640px-Vannamei8.jpg',
  'Black Tiger Shrimp': 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Penaeus_monodon_Bali.jpg/640px-Penaeus_monodon_Bali.jpg',
  'Rohu': 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/Labeo_rohita.jpg/640px-Labeo_rohita.jpg',
  'Catla': 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/32/Catla_catla.jpg/640px-Catla_catla.jpg',
  'Mrigal': 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/79/Cirrhinus_mrigala.jpg/640px-Cirrhinus_mrigala.jpg',
  'Tilapia': 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/62/Tilapia_%28Oreochromis_niloticus%29.jpg/640px-Tilapia_%28Oreochromis_niloticus%29.jpg',
  'Pangasius': 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b4/Pangasianodon_hypophthalmus.jpg/640px-Pangasianodon_hypophthalmus.jpg',
  'Sea Bass': 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/Lates_calcarifer.jpg/640px-Lates_calcarifer.jpg',
  'Pompano': 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Trachinotus_blochii.jpg/640px-Trachinotus_blochii.jpg',
  'Crab': 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/17/Scylla_serrata_in_Mangroves.jpg/640px-Scylla_serrata_in_Mangroves.jpg',
  'Pearl Spot': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Etroplus_suratensis.jpg/640px-Etroplus_suratensis.jpg',
  'Grass Carp': 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/23/Grass_carp_%28Ctenopharyngodon_idella%29.jpg/640px-Grass_carp_%28Ctenopharyngodon_idella%29.jpg',
  'Silver Carp': 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b9/Hypophthalmichthys_molitrix.jpg/640px-Hypophthalmichthys_molitrix.jpg',
  'Common Carp': 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/Cyprinus_carpio.jpeg/640px-Cyprinus_carpio.jpeg',
};

// Average prices from industry benchmarks (INR/kg)
const SPECIES_AVG_PRICES: Record<string, number> = {
  'Vannamei Shrimp': 380,
  'Black Tiger Shrimp': 620,
  'Rohu': 145,
  'Catla': 180,
  'Mrigal': 130,
  'Tilapia': 110,
  'Pangasius': 95,
  'Sea Bass': 450,
  'Pompano': 520,
  'Crab': 800,
  'Pearl Spot': 350,
  'Grass Carp': 120,
  'Silver Carp': 100,
  'Common Carp': 115,
};

function getFishImage(speciesName: string): string | null {
  if (!speciesName) return null;
  const name = speciesName.trim();
  // Direct match
  if (FISH_IMAGES[name]) return FISH_IMAGES[name];
  // Partial match
  const key = Object.keys(FISH_IMAGES).find(k =>
    name.toLowerCase().includes(k.toLowerCase()) ||
    k.toLowerCase().includes(name.toLowerCase())
  );
  return key ? FISH_IMAGES[key] : null;
}

function getSpeciesAvgPrice(speciesName: string, liveAvg: number): number {
  if (!speciesName) return liveAvg;
  const name = speciesName.trim();
  if (SPECIES_AVG_PRICES[name]) return SPECIES_AVG_PRICES[name];
  const key = Object.keys(SPECIES_AVG_PRICES).find(k =>
    name.toLowerCase().includes(k.toLowerCase()) ||
    k.toLowerCase().includes(name.toLowerCase())
  );
  return key ? SPECIES_AVG_PRICES[key] : liveAvg;
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
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  // B10 FIX: initialized as null so we don't show a fake "200" before data loads
  const [globalAvg, setGlobalAvg] = useState<number | null>(null);

  const loadPrices = useCallback(async () => {
    try {
      const res = await marketService.getPrices();
      if (res.success && res.data) {
        setPrices(res.data);
        if (res.data.length > 0) {
          const total = res.data.reduce((s: number, r: PriceRow) => s + parseFloat(r.price_inr_per_kg), 0);
          setGlobalAvg(total / res.data.length);
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

  useEffect(() => { loadPrices(); }, [loadPrices]);

  const onRefresh = () => { setRefreshing(true); loadPrices(); };

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
      </View>

      <FlatList
        data={prices}
        keyExtractor={(item) => item.id}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[theme.colors.primary]} tintColor={theme.colors.primary} />}
        renderItem={({ item }) => {
          const price = parseFloat(item.price_inr_per_kg);
          const speciesAvg = getSpeciesAvgPrice(item.species_name, globalAvg ?? 0);
          const { name: iconName, color: iconColor } = trendIcon(price, speciesAvg, theme);
          const fishImg = getFishImage(item.species_name);

          const sparkData = getSparklineData(prices, item.species_name);
          // If not enough history, mock a flat-ish line to show the component
          const finalSparkData = sparkData.length > 1 ? sparkData : [price * 0.98, price * 1.01, price];
          const delta = priceDelta(price, speciesAvg);

          return (
            <View style={styles.priceCard}>
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
                      <Text style={styles.price}>₹{price.toFixed(0)}/kg</Text>
                      {delta.pct > 0 && (
                        <View style={{ backgroundColor: delta.up ? theme.colors.success + '22' : theme.colors.error + '22', paddingHorizontal: 4, paddingVertical: 2, borderRadius: 4 }}>
                          <Text style={{ fontSize: 10, fontWeight: '700', color: delta.up ? theme.colors.success : theme.colors.error }}>
                            {delta.up ? '↑' : '↓'} {delta.pct.toFixed(1)}%
                          </Text>
                        </View>
                      )}
                    </View>
                  </View>
                  <View style={{ alignItems: 'flex-end', gap: 4 }}>
                    <SparkLine data={finalSparkData} color={iconColor} width={60} height={20} />
                    <Text style={styles.avgPriceLabel}>
                      Avg. {speciesAvg > 0 ? `₹${speciesAvg.toFixed(0)}/kg` : '—'}
                    </Text>
                  </View>
                </View>

                <View style={styles.cardFooter}>
                  <Text style={styles.marketName}>{item.market_name} • {item.state_code}</Text>
                  {item.grade ? <Text style={styles.grade}>Grade: {item.grade}</Text> : null}
                </View>
              </View>
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
  subHeader: { paddingHorizontal: 16, paddingVertical: 8, backgroundColor: theme.colors.surface, borderBottomWidth: 1, borderBottomColor: theme.colors.border },
  subtitle: { fontSize: 13, color: theme.colors.textSecondary },
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