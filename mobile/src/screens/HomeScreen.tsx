import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../ThemeContext';
import WeatherCard from '../components/WeatherCard';
import HarvestCountdownCard from '../components/HarvestCountdownCard';
import { database } from '../database';

export default function HomeScreen() {
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const { t } = useTranslation();
  const navigation = useNavigation<any>();
  const [activePonds, setActivePonds] = useState<any[]>([]);
  const [pondCount, setPondCount] = useState(0);

  useEffect(() => {
    const loadPonds = async () => {
      try {
        const pondsCollection = database.get<any>('ponds');
        const allPonds = await pondsCollection.query().fetch();
        setPondCount(allPonds.length);
        setActivePonds(
          allPonds
            .filter((p: any) => (p.status || '').toLowerCase() === 'active' && p.stockingDate)
            .map((p: any) => ({
              id: p.id,
              name: p.name,
              species_id: p.speciesId,
              stocking_date: p.stockingDate,
              status: p.status,
              area_hectares: p.areaHectares ?? 1,
            }))
        );
      } catch {
        // Ignore local-db bootstrap issues during initial app load.
      }
    };

    loadPonds();
  }, []);

  const handleNotificationsPress = () => {
    if (activePonds.length > 0) {
      Alert.alert(
        'Farm Alerts',
        `You currently have ${activePonds.length} active pond${activePonds.length === 1 ? '' : 's'} to monitor.`,
        [
          { text: 'Water Quality', onPress: () => navigation.navigate('WaterQuality') },
          { text: 'My Ponds', onPress: () => navigation.navigate('PondsList') },
          { text: 'Close', style: 'cancel' },
        ]
      );
      return;
    }

    Alert.alert(
      'Notifications',
      'No active pond alerts yet. Add a pond or log water quality readings to start getting actionable updates.',
      [
        { text: 'Add Pond', onPress: () => navigation.navigate('AddEditPond') },
        { text: 'Close', style: 'cancel' },
      ]
    );
  };

  const quickActions = [
    { icon: 'fish-outline' as const, label: t('home.checkSpecies') || 'Species', screen: 'Species' },
    { icon: 'calculator-outline' as const, label: t('home.calculateROI') || 'ROI', screen: 'Economics' },
    { icon: 'water-outline' as const, label: t('home.logWaterQuality') || 'Water Quality', screen: 'WaterQuality' },
    { icon: 'trending-up-outline' as const, label: t('home.viewMarkets') || 'Market Prices', screen: 'MarketPrices' },
    { icon: 'construct-outline' as const, label: t('home.equipmentCatalog') || 'Equipment', screen: 'EquipmentCatalog' },
    { icon: 'restaurant-outline' as const, label: t('home.feedNutrition') || 'Feed', screen: 'FeedCatalog' },
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
          <TouchableOpacity style={styles.iconButton} onPress={handleNotificationsPress}>
            <Ionicons name="notifications" size={18} color={theme.colors.textPrimary} />
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
                <Text style={styles.actionText}>{action.label}</Text>
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
    width: '31%',
    minHeight: 84,
    borderRadius: theme.borderRadius.lg,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  actionText: {
    color: theme.colors.textSecondary,
    fontSize: 11,
    fontWeight: '700',
    textAlign: 'center',
  },
});
