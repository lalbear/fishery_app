/**
 * Species Screen – connected to live backend knowledge graph
 */
// @ts-nocheck

import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
  ActivityIndicator, TextInput, RefreshControl, Image
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '../theme';
import { speciesService } from '../services/apiService';

const SpeciesCard = ({ species, onPress }: { species: any; onPress: () => void }) => {
  const { t, i18n } = useTranslation();
  const d = species.data || {};
  const params = d.biological_parameters || {};
  const temp = params.temperature_celsius || {};
  const doMin = params.dissolved_oxygen_mg_l?.min ?? params.min_do ?? '-';
  const currentLang = i18n.language || 'en';
  const enName = d.common_names?.en;

  // Try i18n mapping first, then db common_names[lang], then db common_names.en, then scientific
  const translatedName = enName ? t(`species.names.${enName}`, { defaultValue: '' }) : '';
  const commonName = translatedName || d.common_names?.[currentLang] || enName || d.scientific_name || 'Unknown Species';

  const category = (d.category || '').replace(/_/g, ' ');

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
      <View style={styles.cardHeader}>
        <View style={styles.iconWrap}>
          {d.image_url ? (
            <Image
              source={{ uri: d.image_url }}
              style={{ width: '100%', height: '100%', borderRadius: 23 }}
              resizeMode="cover"
            />
          ) : (
            <Ionicons name="fish" size={28} color="#fff" />
          )}
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.speciesName}>{commonName}</Text>
          <Text style={styles.scientificName}>{d.scientific_name}</Text>
        </View>
        <Ionicons name="chevron-forward" size={18} color="#ccc" />
      </View>
      {category ? <Text style={styles.badge}>{category}</Text> : null}
      <View style={styles.parameters}>
        {temp.min != null && (
          <View style={styles.paramItem}>
            <Ionicons name="thermometer-outline" size={14} color="#666" />
            <Text style={styles.paramText}>{temp.min}°C – {temp.max}°C</Text>
          </View>
        )}
        {doMin !== '-' && (
          <View style={styles.paramItem}>
            <Ionicons name="water-outline" size={14} color="#666" />
            <Text style={styles.paramText}>DO &gt; {doMin} mg/L</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

export default function SpeciesScreen() {
  const { t, i18n } = useTranslation();
  const navigation = useNavigation();
  const [speciesList, setSpeciesList] = useState<any[]>([]);
  const [filtered, setFiltered] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadSpecies = useCallback(async () => {
    try {
      const res = await speciesService.getAll();
      if (res.success && res.data) {
        setSpeciesList(res.data);
        setFiltered(res.data);
      }
    } catch (err) {
      console.error('Failed to load species', err);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { loadSpecies(); }, [loadSpecies]);

  const currentLang = i18n.language || 'en';

  useEffect(() => {
    if (!search) { setFiltered(speciesList); return; }
    const q = search.toLowerCase();
    setFiltered(speciesList.filter((s: any) => {
      const d = s.data || {};
      const enName = d.common_names?.en;
      const translatedName = enName ? t(`species.names.${enName}`, { defaultValue: '' }) : '';
      const localizedName = (translatedName || d.common_names?.[currentLang] || enName || '').toLowerCase();
      const sci = (d.scientific_name || '').toLowerCase();
      return localizedName.includes(q) || sci.includes(q);
    }));
  }, [search, speciesList, currentLang, t]);

  const onRefresh = () => { setRefreshing(true); loadSpecies(); };

  if (isLoading) {
    return (
      <SafeAreaView style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]} edges={['top']}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={{ marginTop: 12, color: '#666' }}>Loading species data…</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <View style={styles.header}>
        <Text style={styles.title}>{t('species.title') || 'Species Intelligence'}</Text>
        <Text style={styles.subtitle}>{t('species.subtitle') || 'Aquaculture knowledge base'}</Text>
        <View style={styles.searchBar}>
          <Ionicons name="search-outline" size={18} color="#999" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search species…"
            placeholderTextColor="#aaa"
            value={search}
            onChangeText={setSearch}
          />
          {search ? (
            <TouchableOpacity onPress={() => setSearch('')}>
              <Ionicons name="close-circle" size={18} color="#999" />
            </TouchableOpacity>
          ) : null}
        </View>
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[theme.colors.primary]} />}
        renderItem={({ item }) => (
          <SpeciesCard
            species={item}
            onPress={() => navigation.navigate('SpeciesDetail' as never, { speciesId: item.id, speciesData: item } as never)}
          />
        )}
        ListEmptyComponent={
          <View style={{ padding: 40, alignItems: 'center' }}>
            <Ionicons name="fish-outline" size={48} color="#ccc" />
            <Text style={{ marginTop: 12, color: '#999' }}>No species found</Text>
          </View>
        }
        contentContainerStyle={styles.list}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { padding: 16, backgroundColor: '#fff', paddingBottom: 8 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#1B5E20' },
  subtitle: { fontSize: 14, color: '#666', marginTop: 4 },
  searchBar: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#f5f5f5', borderRadius: 10, paddingHorizontal: 12,
    paddingVertical: 8, marginTop: 12, gap: 8,
  },
  searchInput: { flex: 1, fontSize: 15, color: '#333' },
  list: { padding: 16, backgroundColor: '#f5f5f5', flexGrow: 1 },
  card: {
    backgroundColor: '#fff', borderRadius: 14, padding: 16,
    marginBottom: 12, elevation: 2,
  },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  iconWrap: {
    width: 46, height: 46, borderRadius: 23,
    backgroundColor: '#4CAF50',
    justifyContent: 'center', alignItems: 'center',
  },
  speciesName: { fontSize: 16, fontWeight: '600', color: '#333' },
  scientificName: { fontSize: 13, fontStyle: 'italic', color: '#888', marginTop: 2 },
  badge: {
    alignSelf: 'flex-start', marginTop: 8, fontSize: 11,
    backgroundColor: '#E8F5E9', color: '#2E7D32',
    paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6, fontWeight: '500',
    textTransform: 'capitalize',
  },
  parameters: { flexDirection: 'row', gap: 16, marginTop: 10 },
  paramItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  paramText: { fontSize: 12, color: '#666' },
});
