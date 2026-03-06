/**
 * Home Screen - Main Dashboard
 * Icon-driven interface for rural farmers
 */

import React from 'react';
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

export default function HomeScreen() {
  const { theme, isDark } = useTheme();
  const styles = getStyles(theme);
  const { t } = useTranslation();
  const navigation = useNavigation();

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
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <Ionicons name="fish" size={48} color={theme.colors.primary} />
          </View>
          <Text style={styles.title}>{t('home.welcome') || 'Fishing God'}</Text>
          <Text style={styles.subtitle}>{t('home.subtitle') || 'Manage your ponds'}</Text>
        </View>

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
    marginBottom: theme.spacing.xl,
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
    marginTop: theme.spacing.sm,
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