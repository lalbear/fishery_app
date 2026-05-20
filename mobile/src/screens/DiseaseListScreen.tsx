import React, { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View, ScrollView, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../ThemeContext';
import ScreenHeader from '../components/ScreenHeader';
import { diseaseService } from '../services/apiService';
import { resolveDiseaseImage } from '../utils/diseaseImages';
import { getDiseaseDbOverride, type Lang } from '../utils/diseaseContent';

const CATEGORIES = ['ALL', 'BACTERIAL', 'VIRAL', 'PARASITIC', 'FUNGAL', 'ENVIRONMENTAL'] as const;

const SEVERITY_ICON: Record<string, string> = {
  HIGH: 'alert-circle',
  MEDIUM: 'warning',
  LOW: 'information-circle',
};

const DiseaseCard = ({
  item,
  styles,
  theme,
  onPress,
  t,
  lang,
}: {
  item: any;
  styles: any;
  theme: any;
  onPress: () => void;
  t: (key: string) => string;
  lang: Lang;
}) => {
  const [imageError, setImageError] = useState(false);
  const imgUri = resolveDiseaseImage({
    slug: item.slug,
    category: item.category,
    image_url: item.image_url,
  });

  // Apply localized override for the disease name (and symptoms if needed)
  const override = getDiseaseDbOverride(item.slug, lang);
  const displayName = override?.name || item.name;
  const displaySymptoms = override?.symptoms || item.symptoms;
  const displayAffected = item.affected_species;

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.88}>
      {imgUri && !imageError ? (
        <Image
          source={imgUri}
          style={styles.cardImage}
          resizeMode="cover"
          onError={() => setImageError(true)}
        />
      ) : (
        <View style={styles.cardImageFallback}>
          <Ionicons name="bug-outline" size={40} color={theme.colors.primary} />
          <Text style={styles.cardImageFallbackText}>{t(`disease.categories.${item.category}`) || item.category}</Text>
        </View>
      )}
      <View style={styles.cardContent}>
        <View style={styles.row}>
          <Text style={styles.name}>{displayName}</Text>
          <View style={[
            styles.severityBadge,
            item.severity === 'HIGH' ? styles.high : item.severity === 'MEDIUM' ? styles.medium : styles.low,
          ]}>
            <Ionicons
              name={(SEVERITY_ICON[item.severity] || 'information-circle') as any}
              size={11}
              color={item.severity === 'HIGH' ? theme.colors.error : item.severity === 'MEDIUM' ? theme.colors.accent : theme.colors.success}
            />
            <Text style={[
              styles.severityText,
              item.severity === 'HIGH' ? styles.highText : item.severity === 'MEDIUM' ? styles.mediumText : styles.lowText,
            ]}>
              {t(`disease.severity.${item.severity}`) || item.severity}
            </Text>
          </View>
        </View>
        <Text style={styles.meta}>{t(`disease.categories.${item.category}`) || item.category}</Text>
        <Text style={styles.species}>
          {t('disease.affected')} {(displayAffected || []).slice(0, 3).join(', ') || t('disease.variousSpecies')}
        </Text>
        <Text style={styles.preview} numberOfLines={2}>
          {(displaySymptoms || []).slice(0, 3).join(' • ')}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default function DiseaseListScreen() {
  const navigation = useNavigation<any>();
  const { t, i18n } = useTranslation();
  const lang: Lang = (i18n.language?.startsWith('hi') ? 'hi' : 'en');
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
      const override = getDiseaseDbOverride(d.slug, lang);
      const localizedName = override?.name || d.name;
      const localizedSymptoms = override?.symptoms || d.symptoms;
      const text = `${localizedName} ${d.name} ${(localizedSymptoms || []).join(' ')} ${(d.affected_species || []).join(' ')}`.toLowerCase();
      return text.includes(q);
    });
  }, [diseases, query, lang]);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScreenHeader title={t('disease.title')} onBack={() => navigation.goBack()} />

      <View style={styles.searchWrap}>
        <Ionicons name="search-outline" size={18} color={theme.colors.textMuted} />
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder={t('disease.searchPlaceholder')}
          placeholderTextColor={theme.colors.textMuted}
          style={styles.searchInput}
        />
      </View>

      <View style={{ flexGrow: 0, minHeight: 44, marginBottom: 8 }}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filters}
        >
          {CATEGORIES.map((item) => (
            <TouchableOpacity 
              key={item}
              style={[styles.filterChip, category === item && styles.filterChipActive]} 
              onPress={() => setCategory(item as any)}
            >
              <Text style={[styles.filterText, category === item && styles.filterTextActive]}>
                {t(`disease.categories.${item}`) || item}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Item count */}
      {!loading && (
        <View style={styles.countRow}>
          <Text style={styles.countText}>{filtered.length} DISEASES</Text>
        </View>
      )}

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator color={theme.colors.primary} />
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={<Text style={styles.emptyText}>{t('disease.noResults')}</Text>}
          renderItem={({ item }) => (
            <DiseaseCard
              item={item}
              styles={styles}
              theme={theme}
              t={t}
              lang={lang}
              onPress={() => navigation.navigate('DiseaseDetail', { disease: item })}
            />
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
  filters: { paddingHorizontal: 16, paddingTop: 4, paddingBottom: 10, gap: 8 },
  filterChip: {
    borderRadius: 999,
    borderWidth: 1,
    borderColor: theme.colors.border,
    paddingHorizontal: 14,
    paddingVertical: 8,
    minHeight: 36,
    backgroundColor: theme.colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterChipActive: { backgroundColor: theme.colors.primaryLight, borderColor: theme.colors.primary },
  filterText: { color: theme.colors.textSecondary, fontWeight: '700', fontSize: 12 },
  filterTextActive: { color: theme.colors.textPrimary },
  countRow: { paddingHorizontal: 16, paddingBottom: 6 },
  countText: {
    color: theme.colors.textMuted,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  listContent: { paddingHorizontal: 16, paddingBottom: 110, paddingTop: 4 },
  card: {
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 14,
    marginBottom: 10,
    overflow: 'hidden',
  },
  cardImage: { width: '100%', height: 150, resizeMode: 'cover' },
  cardImageFallback: {
    width: '100%',
    height: 150,
    backgroundColor: theme.colors.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  cardImageFallbackText: {
    color: theme.colors.textMuted,
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  cardContent: { padding: 14 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 10 },
  name: { color: theme.colors.textPrimary, fontWeight: '800', fontSize: 16, flex: 1 },
  severityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
  },
  severityText: { fontWeight: '800', fontSize: 11 },
  high: { backgroundColor: `${theme.colors.error}22` },
  medium: { backgroundColor: `${theme.colors.accent}22` },
  low: { backgroundColor: `${theme.colors.success}22` },
  highText: { color: theme.colors.error },
  mediumText: { color: theme.colors.accent },
  lowText: { color: theme.colors.success },
  meta: { color: theme.colors.textSecondary, marginTop: 5, fontWeight: '700', fontSize: 12 },
  species: { color: theme.colors.textSecondary, marginTop: 4, fontWeight: '600', fontSize: 12 },
  preview: { color: theme.colors.textSecondary, marginTop: 8, lineHeight: 20 },
  emptyText: { textAlign: 'center', color: theme.colors.textMuted, marginTop: 40 },
});
