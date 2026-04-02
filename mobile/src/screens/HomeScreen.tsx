import React, { useCallback, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useTheme } from '../ThemeContext';
import WeatherCard from '../components/WeatherCard';
import HarvestCountdownCard from '../components/HarvestCountdownCard';
import { database } from '../database';
import { fetchSpeciesLookup } from '../utils/speciesLookup';
import { getUnreadNotificationCount } from '../utils/notificationCenter';

export default function HomeScreen() {
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const { t } = useTranslation();
  const navigation = useNavigation<any>();
  const [activePonds, setActivePonds] = useState<any[]>([]);
  const [pondCount, setPondCount] = useState(0);
  const [unreadNotificationCount, setUnreadNotificationCount] = useState(0);

  const loadPonds = useCallback(async () => {
    try {
      const pondsCollection = database.get<any>('ponds');
      const allPonds = await pondsCollection.query().fetch();
      const speciesLookup = await fetchSpeciesLookup();

      setPondCount(allPonds.length);
      setActivePonds(
        allPonds
          .filter((p: any) => (p.status || '').toLowerCase() === 'active' && p.stockingDate)
          .map((p: any) => ({
            id: p.id,
            name: p.name,
            species_id: p.speciesId,
            species_name: speciesLookup[p.speciesId]?.scientificName || null,
            species_label: speciesLookup[p.speciesId]?.label || null,
            stocking_date: p.stockingDate,
            status: p.status,
            area_hectares: p.areaHectares ?? 1,
          }))
      );

      const unreadCount = await getUnreadNotificationCount();
      setUnreadNotificationCount(unreadCount);
    } catch {
      // Ignore local-db bootstrap issues during initial app load.
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadPonds();
    }, [loadPonds])
  );

  const quickActions = [
    { icon: 'fish-outline' as const, label: t('home.checkSpecies'), screen: 'Species' },
    { icon: 'calculator-outline' as const, label: t('home.calculateROI'), screen: 'Economics' },
    { icon: 'water-outline' as const, label: t('home.logWaterQuality'), screen: 'WaterQuality' },
    { icon: 'trending-up-outline' as const, label: t('home.viewMarkets'), screen: 'MarketPrices' },
    { icon: 'construct-outline' as const, label: t('home.equipmentCatalog'), screen: 'EquipmentCatalog' },
    { icon: 'restaurant-outline' as const, label: t('home.feedNutrition'), screen: 'FeedCatalog' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.topRow}>
          <View style={styles.brandWrap}>
            <View style={styles.brandIcon}>
              <Ionicons name="fish" size={20} color={theme.colors.primary} />
            </View>
            <Text style={styles.brandText}>Fishing God</Text>
          </View>
          <TouchableOpacity style={styles.iconButton} onPress={() => navigation.navigate('Notifications')}>
            <Ionicons name="notifications" size={18} color={theme.colors.textPrimary} />
            {unreadNotificationCount > 0 ? (
              <View style={styles.notificationBadge}>
                <Text style={styles.notificationBadgeText}>
                  {unreadNotificationCount > 9 ? '9+' : unreadNotificationCount}
                </Text>
              </View>
            ) : null}
          </TouchableOpacity>
        </View>

        <View style={styles.hero}>
          <View style={styles.avatar}>
            <Ionicons name="person" size={28} color={theme.colors.textInverse} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.heroTitle}>Welcome back, Chief!</Text>
            <Text style={styles.heroSub}>
              {pondCount > 0
                ? `${pondCount} pond${pondCount === 1 ? '' : 's'} in your farm${activePonds.length > 0 ? ` • ${activePonds.length} active` : ''}`
                : 'Add your first pond to start tracking your farm'}
            </Text>
          </View>
        </View>

        <View style={styles.weatherShell}>
          <WeatherCard locationName="Your District" />
        </View>

        <TouchableOpacity
          style={styles.learnCard}
          onPress={() => navigation.navigate('LearningCenter')}
          activeOpacity={0.9}
        >
          <View style={styles.learnCardIcon}>
            <Ionicons name="school-outline" size={18} color={theme.colors.primary} />
          </View>
          <View style={styles.learnCopy}>
            <Text style={styles.learnTitle}>New to aquaculture?</Text>
            <Text style={styles.learnText}>
              Learn business basics, subsidy rules, key terms, and how to read the app&apos;s numbers.
            </Text>
          </View>
          <Ionicons name="arrow-forward" size={18} color={theme.colors.primary} />
        </TouchableOpacity>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Management</Text>
          <View style={styles.actionGrid}>
            {quickActions.map((action) => (
              <TouchableOpacity
                key={action.label}
                style={styles.actionCard}
                onPress={() => navigation.navigate(action.screen)}
                activeOpacity={0.85}
              >
                <Ionicons name={action.icon} size={20} color={theme.colors.primary} />
                <Text style={styles.actionText} numberOfLines={2}>
                  {action.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {activePonds.length > 0 && (
          <HarvestCountdownCard ponds={activePonds} onPressPond={() => navigation.navigate('PondsList')} />
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const getStyles = (theme: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 120,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  brandWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  brandIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandText: {
    color: theme.colors.textPrimary,
    fontSize: 22,
    fontWeight: '800',
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.surfaceAlt,
  },
  notificationBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: theme.colors.error,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  notificationBadgeText: {
    color: theme.colors.textInverse,
    fontSize: 10,
    fontWeight: '800',
  },
  hero: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginBottom: 20,
  },
  avatar: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroTitle: {
    ...theme.typography.h2,
  },
  heroSub: {
    ...theme.typography.body,
    color: theme.colors.primary,
    marginTop: 4,
  },
  weatherShell: {
    marginBottom: 20,
  },
  learnCard: {
    marginBottom: 20,
    borderRadius: theme.borderRadius.lg,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  learnCardIcon: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: theme.colors.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
  },
  learnCopy: {
    flex: 1,
  },
  learnTitle: {
    color: theme.colors.textPrimary,
    fontSize: 16,
    fontWeight: '800',
  },
  learnText: {
    color: theme.colors.textSecondary,
    fontSize: 13,
    lineHeight: 18,
    marginTop: 4,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    ...theme.typography.h3,
    marginBottom: 12,
  },
  actionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  actionCard: {
    width: '48%',
    minHeight: 92,
    paddingHorizontal: 10,
    paddingVertical: 14,
    borderRadius: theme.borderRadius.lg,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  actionText: {
    color: theme.colors.textSecondary,
    fontSize: 12,
    fontWeight: '700',
    textAlign: 'center',
    lineHeight: 16,
  },
});
