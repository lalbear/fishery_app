/**
 * Profile Screen
 * Shows user's saved info (name, phone, category) and navigates to sub-screens.
 */

import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, ActivityIndicator, Platform } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { loadProfile, UserProfile } from './PersonalInfoScreen';
import { syncService } from '../services/syncService';
import { useAuth } from '../AuthContext';
import { useTheme } from '../ThemeContext';

export default function ProfileScreen({ navigation }: any) {
  const { t, i18n } = useTranslation();
  const { logout } = useAuth();
  const { theme, isDark, toggleTheme } = useTheme();
  const styles = getStyles(theme);

  const [profile, setProfile] = useState<UserProfile>({ userId: '', name: '', phone: '', farmerCategory: 'GENERAL', stateCode: '' });
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSynced, setLastSynced] = useState<string | null>(null);

  useFocusEffect(
    useCallback(() => {
      loadProfile().then(setProfile);
    }, [])
  );

  const handleSync = async () => {
    if (!profile.userId) {
      Alert.alert('Profile Incomplete', 'Please save your profile before syncing.');
      return;
    }
    if (isSyncing) return;

    setIsSyncing(true);
    try {
      const res = await syncService.sync(profile.userId);
      if (res.success) {
        const now = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
        setLastSynced(now);
        Alert.alert('✓ Sync Complete', `Your data (market prices, species data) is now up to date.`);
      } else {
        Alert.alert('Sync Failed', res.error || 'Please check your internet connection.');
      }
    } catch (err) {
      Alert.alert('Sync Error', 'An unexpected error occurred. Please try again.');
    } finally {
      setIsSyncing(false);
    }
  };

  const categoryLabels: Record<string, string> = {
    GENERAL: 'General', WOMEN: 'Women', SC: 'SC', ST: 'ST',
  };

  const menuItems = [
    {
      icon: 'person-outline',
      title: t('profile.personalInfo'),
      subtitle: 'Name, phone, location',
      onPress: () => navigation.navigate('PersonalInfo'),
    },
    {
      icon: 'fish-outline',
      title: t('profile.myPonds'),
      subtitle: 'Manage your ponds',
      onPress: () => navigation.navigate('PondsList'),
    },
    {
      icon: 'language-outline',
      title: t('profile.language'),
      subtitle: 'App language',
      value: i18n.language === 'hi' ? 'HINDI' : 'ENGLISH',
      onPress: () => {
        Alert.alert(
          'Select Language',
          'Choose your preferred language / अपनी पसंदीदा भाषा चुनें',
          [
            { text: 'English', onPress: () => i18n.changeLanguage('en') },
            { text: 'हिंदी (Hindi)', onPress: () => i18n.changeLanguage('hi') },
            { text: 'Cancel', style: 'cancel' }
          ]
        );
      },
    },
    {
      icon: 'cloud-offline-outline',
      title: t('profile.offlineMode'),
      subtitle: 'View cached data when offline',
      onPress: () => Alert.alert('Coming Soon', 'Offline mode settings will be available in the next update.'),
    },
    {
      icon: isDark ? 'moon-outline' : 'sunny-outline',
      title: 'Dark Mode',
      subtitle: 'Toggle app appearance',
      value: isDark ? 'ON' : 'OFF',
      onPress: toggleTheme,
    },
    {
      icon: 'sync-outline',
      title: t('profile.syncData'),
      subtitle: lastSynced ? `Last synced at ${lastSynced}` : 'Sync market prices & species data',
      onPress: handleSync,
      isSyncing,
    },
    {
      icon: 'log-out-outline',
      title: t('profile.logout'),
      subtitle: 'Sign out of the app',
      onPress: () => Alert.alert('Logout', 'Are you sure you want to log out?', [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Logout', style: 'destructive', onPress: () => logout() },
      ]),
      danger: true,
    },
  ];

  const displayName = profile.name || 'Farmer';
  const displayPhone = profile.phone ? `+91 ${profile.phone}` : 'Tap to add phone';
  const displayCategory = categoryLabels[profile.farmerCategory] || profile.farmerCategory;
  const initials = displayName.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.primary }} edges={['top']}>
      {/* Nav Header */}
      <View style={{
        flexDirection: 'row', alignItems: 'center',
        paddingHorizontal: 16, paddingVertical: 12,
        backgroundColor: theme.colors.primary
      }}>
        <TouchableOpacity
          onPress={() => (navigation as any).navigate('Main', { screen: 'Home' })}
          hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
          style={{ flexDirection: 'row', alignItems: 'center' }}
        >
          <Ionicons name="arrow-back" size={24} color={theme.colors.textInverse} />
          <Text style={{ marginLeft: 8, fontSize: 16, color: theme.colors.textInverse, fontWeight: '600' }}>Home</Text>
        </TouchableOpacity>
        <Text style={{
          marginLeft: 12, fontSize: 18, fontWeight: '700',
          color: theme.colors.textInverse
        }}>{t('profile.title') || 'Your Profile'}</Text>
      </View>

      <ScrollView style={styles.container}>
        {/* Header / Hero */}
        <View style={styles.header}>
          <View style={styles.avatar}>
            <Text style={styles.initials}>{initials || '?'}</Text>
          </View>
          <Text style={styles.name}>{displayName}</Text>
          <Text style={styles.phone}>{displayPhone}</Text>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{displayCategory}</Text>
          </View>
          {profile.stateCode ? (
            <Text style={styles.stateLabel}>{profile.stateCode}</Text>
          ) : null}
        </View>

        {/* Sync Status Banner (visible while syncing) */}
        {isSyncing && (
          <View style={styles.syncBanner}>
            <ActivityIndicator size="small" color={theme.colors.surface} />
            <Text style={styles.syncBannerText}>Syncing data with server...</Text>
          </View>
        )}

        {/* Menu */}
        <View style={styles.menu}>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.menuItem}
              onPress={item.isSyncing ? undefined : item.onPress}
              activeOpacity={item.isSyncing ? 1 : 0.7}
            >
              <View style={[styles.iconWrap, (item as any).danger && styles.iconWrapDanger]}>
                {item.isSyncing ? (
                  <ActivityIndicator size="small" color={theme.colors.primary} />
                ) : (
                  <Ionicons name={item.icon as any} size={20} color={(item as any).danger ? theme.colors.error : theme.colors.primary} />
                )}
              </View>
              <View style={styles.menuTextBlock}>
                <Text style={[styles.menuText, (item as any).danger && styles.dangerText]}>{item.title}</Text>
                {item.subtitle ? <Text style={styles.menuSub}>{item.subtitle}</Text> : null}
              </View>
              {(item as any).value && <Text style={styles.menuValue}>{(item as any).value}</Text>}
              <Ionicons name="chevron-forward" size={18} color={theme.colors.border} />
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.version}>Fishing God v0.9-beta</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const getStyles = (theme: any) => StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  header: { alignItems: 'center', paddingTop: 10, paddingBottom: 28, paddingHorizontal: 16, backgroundColor: theme.colors.primary },
  avatar: { width: 76, height: 76, borderRadius: 38, backgroundColor: 'rgba(255,255,255,0.25)', justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  initials: { fontSize: 30, fontWeight: '700', color: theme.colors.textInverse },
  name: { fontSize: 22, fontWeight: '700', color: theme.colors.textInverse },
  phone: { fontSize: 15, color: 'rgba(255,255,255,0.8)', marginTop: 3 },
  badge: { backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 16, marginTop: 8 },
  badgeText: { color: theme.colors.textInverse, fontSize: 14, fontWeight: '600' },
  stateLabel: { color: 'rgba(255,255,255,0.7)', fontSize: 14, marginTop: 4 },
  syncBanner: { flexDirection: 'row', alignItems: 'center', backgroundColor: theme.colors.success, paddingHorizontal: 16, paddingVertical: 10, gap: 10 },
  syncBannerText: { color: theme.colors.textInverse, fontSize: 15, fontWeight: '500' },
  menu: { marginTop: 16, backgroundColor: theme.colors.surface, borderRadius: 12, marginHorizontal: 12, overflow: 'hidden', elevation: 1 },
  menuItem: { flexDirection: 'row', alignItems: 'center', padding: 14, borderBottomWidth: 1, borderBottomColor: theme.colors.background },
  iconWrap: { width: 36, height: 36, borderRadius: 10, backgroundColor: theme.colors.primaryLight, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  iconWrapDanger: { backgroundColor: theme.colors.error + '20' },
  menuTextBlock: { flex: 1 },
  menuText: { fontSize: 17, color: theme.colors.textPrimary, fontWeight: '500' },
  menuSub: { fontSize: 14, color: theme.colors.textSecondary, marginTop: 1 },
  menuValue: { fontSize: 15, color: theme.colors.textMuted, fontWeight: '500', marginRight: 8 },
  dangerText: { color: theme.colors.error },
  version: { textAlign: 'center', color: theme.colors.textMuted, fontSize: 14, marginTop: 24, marginBottom: 32 },
});
