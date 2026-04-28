import React, { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../ThemeContext';
import ScreenHeader from '../components/ScreenHeader';
import { diseaseService } from '../services/apiService';

const CATEGORIES = ['ALL', 'BACTERIAL', 'VIRAL', 'PARASITIC', 'FUNGAL', 'ENVIRONMENTAL'] as const;

export default function DiseaseListScreen() {
  const navigation = useNavigation<any>();
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const [diseases, setDiseases] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<(typeof CATEGORIES)[number]>('ALL');

  useEffect(() => {
    void loadDiseases();
  }, [category]);

  const loadDiseases = async () => {
    setLoading(true);
    try {
      const res = await diseaseService.list(category === 'ALL' ? undefined : { category });
      if (res.success) setDiseases(res.data || []);
    } finally {
      setLoading(false);
    }
  };

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return diseases;
    return diseases.filter((d) => {
      const text = `${d.name} ${(d.symptoms || []).join(' ')} ${(d.affected_species || []).join(' ')}`.toLowerCase();
      return text.includes(q);
    });
  }, [diseases, query]);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScreenHeader title="Disease Intelligence" onBack={() => navigation.goBack()} />

      <View style={styles.searchWrap}>
        <Ionicons name="search-outline" size={18} color={theme.colors.textMuted} />
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Search by symptom, species, disease..."
          placeholderTextColor={theme.colors.textMuted}
          style={styles.searchInput}
        />
      </View>

      <FlatList
        horizontal
        data={CATEGORIES as readonly string[]}
        keyExtractor={(item) => item}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filters}
        renderItem={({ item }) => (
          <TouchableOpacity style={[styles.filterChip, category === item && styles.filterChipActive]} onPress={() => setCategory(item as any)}>
            <Text style={[styles.filterText, category === item && styles.filterTextActive]}>{item}</Text>
          </TouchableOpacity>
        )}
      />

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator color={theme.colors.primary} />
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={<Text style={styles.emptyText}>No disease record found for this filter.</Text>}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('DiseaseDetail', { disease: item })}>
              <View style={styles.row}>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={[
                  styles.severity,
                  item.severity === 'HIGH' ? styles.high : item.severity === 'MEDIUM' ? styles.medium : styles.low,
                ]}>
                  {item.severity}
                </Text>
              </View>
              <Text style={styles.meta}>{item.category}</Text>
              <Text style={styles.preview} numberOfLines={2}>
                {(item.symptoms || []).slice(0, 3).join(' • ')}
              </Text>
            </TouchableOpacity>
          )}
        />
      )}
    </SafeAreaView>
  );
}

const getStyles = (theme: any) => StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  searchWrap: {
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 10,
    backgroundColor: theme.colors.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: theme.colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    gap: 8,
  },
  searchInput: { flex: 1, color: theme.colors.textPrimary, paddingVertical: 12 },
  filters: { paddingHorizontal: 16, paddingBottom: 8, gap: 8 },
  filterChip: {
    borderRadius: 999,
    borderWidth: 1,
    borderColor: theme.colors.border,
    paddingHorizontal: 12,
    paddingVertical: 7,
    backgroundColor: theme.colors.surface,
  },
  filterChipActive: { backgroundColor: theme.colors.primaryLight, borderColor: theme.colors.primary },
  filterText: { color: theme.colors.textSecondary, fontWeight: '700', fontSize: 12 },
  filterTextActive: { color: theme.colors.textPrimary },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  listContent: { paddingHorizontal: 16, paddingBottom: 110, paddingTop: 4 },
  card: {
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
  },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 10 },
  name: { color: theme.colors.textPrimary, fontWeight: '800', fontSize: 16, flex: 1 },
  severity: { fontWeight: '800', fontSize: 12, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 999 },
  high: { color: theme.colors.error, backgroundColor: `${theme.colors.error}22` },
  medium: { color: theme.colors.accent, backgroundColor: `${theme.colors.accent}22` },
  low: { color: theme.colors.success, backgroundColor: `${theme.colors.success}22` },
  meta: { color: theme.colors.textSecondary, marginTop: 5, fontWeight: '700', fontSize: 12 },
  preview: { color: theme.colors.textSecondary, marginTop: 8, lineHeight: 20 },
  emptyText: { textAlign: 'center', color: theme.colors.textMuted, marginTop: 40 },
});
