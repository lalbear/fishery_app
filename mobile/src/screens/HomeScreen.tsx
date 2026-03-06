/**
 * Home Screen - Main Dashboard
 * Icon-driven interface for rural farmers
 * F2: Live Weather + Pond Impact Card
 * F5: Harvest Countdown Widget
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../ThemeContext';
import WeatherCard from '../components/WeatherCard';
import HarvestCountdownCard from '../components/HarvestCountdownCard';
import { database } from '../database';

export default function HomeScreen() {
  const { theme, isDark } = useTheme();
  const styles = getStyles(theme);
  const { t } = useTranslation();
  const navigation = useNavigation();
  const [activePonds, setActivePonds] = useState<any[]>([]);

  // F5: Load active ponds from WatermelonDB for harvest countdown
  useEffect(() => {
    (async () => {
      try {
        const pondsCollection = database.get<any>('ponds');
        const allPonds = await pondsCollection.query().fetch();
        setActivePonds(
          allPonds
            .filter((p: any) => p.status === 'active' && p.stockingDate)
            .map((p: any) => ({
              id: p.id,
              name: p.name,
              species_id: p.speciesId,
              stocking_date: p.stockingDate,
              status: p.status,
              area_hectares: p.areaHectares ?? 1,
            }))
        );
      } catch (e) {
        // WatermelonDB may not be initialized yet in dev — fail silently
      }
    })();
  }, []);

  const quickActions = [
    {
      icon: 'fish-outline' as const,
      title: t('home.checkSpecies'),
      onPress: () => navigation.navigate('Species' as never),
      color: theme.colors.primary,
      bgColor: theme.colors.primaryLight,
    },
    {
      icon: 'calculator-outline' as const,
      title: t('home.calculateROI'),
      onPress: () => navigation.navigate('Economics' as never),
      color: theme.colors.secondary,
      bgColor: theme.colors.secondaryLight,
    },
    {
      icon: 'water-outline' as const,
      title: t('home.logWaterQuality'),
      onPress: () => navigation.navigate('WaterQuality' as never),
      color: isDark ? '#38BDF8' : '#0284C7',
      bgColor: isDark ? '#0C4A6E' : '#E0F2FE',
    },
    {
      icon: 'trending-up-outline' as const,
      title: t('home.viewMarkets'),
      onPress: () => navigation.navigate('MarketPrices' as never),
      color: isDark ? '#FBBF24' : theme.colors.accent,
      bgColor: isDark ? '#78350F' : '#FEF3C7',
    },
    {
      icon: 'construct-outline' as const,
      title: t('home.equipmentCatalog') || 'Equipment Catalog',
      onPress: () => navigation.navigate('EquipmentCatalog' as never),
      color: theme.colors.primary,
      bgColor: theme.colors.primaryLight,
    },
    {
      icon: 'nutrition-outline' as const,
      title: t('home.feedNutrition') || 'Feed & Nutrition',
      onPress: () => navigation.navigate('FeedCatalog' as never),
      color: theme.colors.success,
      bgColor: isDark ? '#14532D' : '#DCFCE7',
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* App Header */}
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <Ionicons name="fish" size={48} color={theme.colors.primary} />
          </View>
          <Text style={styles.title}>{t('home.welcome') || 'Fishing God'}</Text>
          <Text style={styles.subtitle}>{t('home.subtitle') || 'Manage your ponds'}</Text>
        </View>

        {/* F2: Weather Card */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🌤️ Today's Weather</Text>
          <WeatherCard locationName="Your District" />
        </View>

        {/* F5: Harvest Countdown */}
        {activePonds.length > 0 && (
          <HarvestCountdownCard
            ponds={activePonds}
            onPressPond={(pond) => navigation.navigate('PondsList' as never)}
          />
        )}

        {/* Quick Actions Grid */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('home.quickActions') || 'Quick Actions'}</Text>
          <View style={styles.actionGrid}>
            {quickActions.map((action, index) => (
              <TouchableOpacity
                key={index}
                style={styles.actionCard}
                onPress={action.onPress}
                activeOpacity={0.7}
              >
                <View style={[styles.iconWrapper, { backgroundColor: action.bgColor }]}>
                  <Ionicons name={action.icon} size={28} color={action.color} />
                </View>
                <Text style={styles.actionText}>
                  {action.title}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={{ height: theme.spacing.xxl }} />
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
    padding: theme.spacing.lg,
  },
  header: {
    alignItems: 'center',
    paddingVertical: theme.spacing.xl,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    marginBottom: theme.spacing.lg,
    ...theme.shadows.sm,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: theme.borderRadius.full,
    backgroundColor: theme.colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.md,
  },
  title: {
    ...theme.typography.h1,
    marginBottom: theme.spacing.xs,
  },
  subtitle: {
    ...theme.typography.bodyLarge,
    textAlign: 'center',
  },
  section: {
    marginBottom: theme.spacing.lg,
  },
  sectionTitle: {
    ...theme.typography.h3,
    marginBottom: theme.spacing.md,
    paddingHorizontal: theme.spacing.xs,
  },
  actionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: theme.spacing.md,
  },
  actionCard: {
    width: '47%',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    alignItems: 'center',
    ...theme.shadows.sm,
  },
  iconWrapper: {
    width: 56,
    height: 56,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.sm,
  },
  actionText: {
    ...theme.typography.body,
    textAlign: 'center',
    fontWeight: '500',
  },
});