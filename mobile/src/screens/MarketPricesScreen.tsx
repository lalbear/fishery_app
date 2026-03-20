import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, StyleSheet, FlatList, Image,
  ActivityIndicator, RefreshControl, Alert, TouchableOpacity,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { marketService, speciesService } from '../services/apiService';
import { useTheme } from '../ThemeContext';
import SparkLine from '../components/SparkLine';

interface PriceRow {
  id: string;
  species_name: string;
  market_name: string;
  state_code: string;
  price_inr_per_kg: string;
  grade?: string;
  date: string;
}

function getSparklineData(prices: PriceRow[], speciesName: string): number[] {
  return prices
    .filter(p => p.species_name === speciesName)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(-7)
    .map(p => parseFloat(p.price_inr_per_kg));
}

export default function MarketPricesScreen() {
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const navigation = useNavigation<any>();

  const [prices, setPrices] = useState<PriceRow[]>([]);
  const [speciesData, setSpeciesData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const loadData = useCallback(async () => {
    try {
      const [marketRes, speciesRes] = await Promise.all([marketService.getPrices(), speciesService.getAll()]);
      if (speciesRes.success && speciesRes.data) setSpeciesData(speciesRes.data);
      if (marketRes.success && marketRes.data) setPrices(marketRes.data);
    } catch {
      Alert.alert('Error', 'Could not load market prices. Please check your connection.');
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  const mergedData = speciesData
    .map((s: any) => {
      const commonName = s.data?.common_names?.en || s.data?.scientific_name;
      const priceEntry = prices.find((p: PriceRow) =>
        p.species_name.toLowerCase().includes(commonName.toLowerCase()) ||
        commonName.toLowerCase().includes(p.species_name.toLowerCase())
      );
      return {
        id: s.id,
        species_name: commonName,
        price_inr_per_kg: priceEntry?.price_inr_per_kg || null,
        market_name: priceEntry?.market_name || 'Awaiting market data',
        state_code: priceEntry?.state_code || '',
        grade: priceEntry?.grade,
        image_url: s.data?.image_url || null,
      };
    })
    .filter((item: any) => searchQuery === '' || item.species_name.toLowerCase().includes(searchQuery.toLowerCase()));

  if (isLoading) {
    return (
      <SafeAreaView style={[styles.container, styles.center]} edges={['top']}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate('Main', { screen: 'Home' })}>
          <Ionicons name="arrow-back" size={22} color={theme.colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Market Prices</Text>
        <View style={{ width: 22 }} />
      </View>

      <View style={styles.searchBar}>
        <Ionicons name="search-outline" size={18} color={theme.colors.textMuted} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search species..."
          placeholderTextColor={theme.colors.textMuted}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <FlatList
        data={mergedData}
        keyExtractor={(item) => item.id}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); loadData(); }} colors={[theme.colors.primary]} tintColor={theme.colors.primary} />}
        renderItem={({ item }) => {
          const price = item.price_inr_per_kg ? parseFloat(item.price_inr_per_kg) : null;
          const sparkData = price ? getSparklineData(prices, item.species_name) : [];
          return (
            <View style={styles.card}>
              {item.image_url ? (
                <Image source={{ uri: item.image_url }} style={styles.cardImage} />
              ) : (
                <View style={styles.cardImageFallback}>
                  <Ionicons name="fish-outline" size={40} color={theme.colors.primary} />
                </View>
              )}
              <View style={styles.cardBody}>
                <View style={styles.cardHeader}>
                  <Text style={styles.cardTitle}>{item.species_name}</Text>
                  <Ionicons name={price ? 'trending-up-outline' : 'remove-outline'} size={18} color={price ? theme.colors.success : theme.colors.textMuted} />
                </View>
                <Text style={styles.priceText}>{price ? `Rs ${price.toFixed(0)}/kg` : 'No recent trade data'}</Text>
                {price && sparkData.length > 1 ? <SparkLine data={sparkData} color={theme.colors.primary} width={70} height={24} /> : null}
                <Text style={styles.marketMeta}>{item.market_name}{item.state_code ? ` • ${item.state_code}` : ''}</Text>
              </View>
            </View>
          );
        }}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="trending-up-outline" size={48} color={theme.colors.textMuted} />
            <Text style={styles.emptyText}>No species match your search.</Text>
          </View>
        }
        contentContainerStyle={styles.listContent}
      />
    </SafeAreaView>
  );
}

const getStyles = (theme: any) => StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  center: { alignItems: 'center', justifyContent: 'center' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  headerTitle: {
    color: theme.colors.textPrimary,
    fontSize: 22,
    fontWeight: '800',
  },
  searchBar: {
    height: 48,
    marginHorizontal: 16,
    marginBottom: 14,
    borderRadius: 24,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: 14,
  },
  searchInput: {
    flex: 1,
    color: theme.colors.textPrimary,
  },
  listContent: {
    padding: 16,
    paddingTop: 2,
    paddingBottom: 110,
  },
  card: {
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.lg,
    overflow: 'hidden',
    marginBottom: 14,
  },
  cardImage: {
    width: '100%',
    height: 140,
  },
  cardImageFallback: {
    height: 140,
    backgroundColor: theme.colors.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardBody: {
    padding: 14,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 10,
  },
  cardTitle: {
    flex: 1,
    color: theme.colors.textPrimary,
    fontSize: 18,
    fontWeight: '800',
  },
  priceText: {
    color: theme.colors.primary,
    fontSize: 24,
    fontWeight: '900',
    marginTop: 8,
    marginBottom: 8,
  },
  marketMeta: {
    color: theme.colors.textSecondary,
    marginTop: 10,
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    color: theme.colors.textMuted,
    marginTop: 12,
  },
});
