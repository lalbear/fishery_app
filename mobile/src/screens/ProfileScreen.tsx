import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, ActivityIndicator, Switch } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { loadProfile, UserProfile } from './PersonalInfoScreen';
import { syncService } from '../services/syncService';
import { useAuth } from '../AuthContext';
import { useTheme } from '../ThemeContext';
import { database } from '../database';

export default function ProfileScreen({ navigation }: any) {
  const { t, i18n } = useTranslation();
  const { logout } = useAuth();
  const { theme, isDark, toggleTheme } = useTheme();
  const styles = getStyles(theme);

  const [profile, setProfile] = useState<UserProfile>({ userId: '', name: '', phone: '', farmerCategory: 'GENERAL', stateCode: '' });
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSynced, setLastSynced] = useState<string | null>(null);
  const [offlineMode, setOfflineMode] = useState(true);
  const [pondCount, setPondCount] = useState(0);

  useFocusEffect(
    useCallback(() => {
      let isMounted = true;

      const loadData = async () => {
        const loadedProfile = await loadProfile();
        const ponds = await database.get<any>('ponds').query().fetch();
        if (!isMounted) return;
        setProfile(loadedProfile);
        setPondCount(ponds.length);
      };

      loadData().catch(() => {
        if (!isMounted) return;
        setPondCount(0);
      });

      return () => {
        isMounted = false;
      };
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
        Alert.alert('Sync Complete', 'Your data is now up to date.');
      } else {
        Alert.alert('Sync Failed', res.error || 'Please check your internet connection.');
      }
    } catch {
      Alert.alert('Sync Error', 'An unexpected error occurred. Please try again.');
    } finally {
      setIsSyncing(false);
    }
  };

  const menuItems = [
    { icon: 'person-outline', title: t('profile.personalInfo') || 'Personal Info', action: () => navigation.navigate('PersonalInfo') },
    { icon: 'water-outline', title: t('profile.myPonds') || 'My Ponds', action: () => navigation.navigate('PondsList') },
    { icon: 'school-outline', title: 'Learning Center', action: () => navigation.navigate('LearningCenter') },
  ];

  const displayName = profile.name || 'Fishing God';
  const initials = displayName.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate('Main', { screen: 'Home' })}>
          <Ionicons name="arrow-back" size={22} color={theme.colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile</Text>
        <TouchableOpacity>
          <Ionicons name="settings" size={22} color={theme.colors.textPrimary} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <View style={styles.hero}>
          <View style={styles.heroAvatar}>
            <Text style={styles.heroInitials}>{initials || 'FG'}</Text>
            <View style={styles.badge}>
              <Ionicons name="checkmark-circle" size={18} color={theme.colors.textInverse} />
            </View>
          </View>
          <Text style={styles.name}>{displayName}</Text>
          <Text style={styles.memberText}>
            {pondCount > 0 ? `${pondCount} pond${pondCount === 1 ? '' : 's'} added` : 'No ponds added yet'}
          </Text>
        </View>

        <Text style={styles.sectionLabel}>ACCOUNT MANAGEMENT</Text>
        {menuItems.map((item) => (
          <MenuRow key={item.title} icon={item.icon} title={item.title} onPress={item.action} theme={theme} />
        ))}

        <Text style={styles.sectionLabel}>PREFERENCES</Text>
        <MenuRow
          icon="language-outline"
          title={t('profile.language') || 'Language'}
          value={i18n.language === 'hi' ? 'Hindi' : 'English'}
          onPress={() => {
            Alert.alert('Select Language', 'Choose your preferred language.', [
              { text: 'English', onPress: () => i18n.changeLanguage('en') },
              { text: 'Hindi', onPress: () => i18n.changeLanguage('hi') },
              { text: 'Cancel', style: 'cancel' },
            ]);
          }}
          theme={theme}
        />

        <SwitchRow
          icon="cloud-offline-outline"
          title={t('profile.offlineMode') || 'Offline Mode'}
          value={offlineMode}
          onValueChange={setOfflineMode}
          theme={theme}
        />

        <SwitchRow
          icon={isDark ? 'moon-outline' : 'sunny-outline'}
          title="Dark Mode"
          value={isDark}
          onValueChange={toggleTheme}
          theme={theme}
        />

        <MenuRow
          icon="sync-outline"
          title={t('profile.syncData') || 'Sync Data'}
          value={lastSynced ? lastSynced : undefined}
          trailing={isSyncing ? <ActivityIndicator color={theme.colors.primary} /> : <Ionicons name="sync-outline" size={18} color={theme.colors.primary} />}
          onPress={handleSync}
          theme={theme}
        />

        <TouchableOpacity
          style={styles.logoutButton}
          onPress={() => Alert.alert('Logout', 'Are you sure you want to log out?', [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Logout', style: 'destructive', onPress: () => logout() },
          ])}
        >
          <View style={styles.logoutIcon}>
            <Ionicons name="log-out-outline" size={18} color={theme.colors.error} />
          </View>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

function MenuRow({ icon, title, value, trailing, onPress, theme }: any) {
  const styles = getStyles(theme);
  return (
    <TouchableOpacity style={styles.menuRow} onPress={onPress} activeOpacity={0.8}>
      <View style={styles.leadingIcon}>
        <Ionicons name={icon} size={18} color={theme.colors.primary} />
      </View>
      <Text style={styles.menuTitle}>{title}</Text>
      {value ? <Text style={styles.menuValue}>{value}</Text> : null}
      {trailing || <Ionicons name="chevron-forward" size={18} color={theme.colors.textMuted} />}
    </TouchableOpacity>
  );
}

function SwitchRow({ icon, title, value, onValueChange, theme }: any) {
  const styles = getStyles(theme);
  return (
    <View style={styles.menuRow}>
      <View style={styles.leadingIcon}>
        <Ionicons name={icon} size={18} color={theme.colors.primary} />
      </View>
      <Text style={styles.menuTitle}>{title}</Text>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
        thumbColor={theme.colors.textInverse}
      />
    </View>
  );
}

const getStyles = (theme: any) => StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    paddingVertical: 14,
  },
  headerTitle: {
    color: theme.colors.textPrimary,
    fontSize: 22,
    fontWeight: '800',
  },
  container: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 16,
    paddingBottom: 120,
  },
  hero: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  heroAvatar: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: theme.colors.surface,
    borderWidth: 3,
    borderColor: theme.colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  heroInitials: {
    color: theme.colors.textPrimary,
    fontSize: 34,
    fontWeight: '800',
  },
  badge: {
    position: 'absolute',
    right: 4,
    bottom: 4,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  name: {
    marginTop: 14,
    color: theme.colors.textPrimary,
    fontSize: 20,
    fontWeight: '800',
  },
  memberText: {
    color: theme.colors.primary,
    fontWeight: '700',
    marginTop: 6,
  },
  sectionLabel: {
    marginTop: 20,
    marginBottom: 10,
    color: theme.colors.textMuted,
    fontSize: 12,
    fontWeight: '800',
  },
  menuRow: {
    minHeight: 68,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginBottom: 12,
  },
  leadingIcon: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: theme.colors.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuTitle: {
    flex: 1,
    color: theme.colors.textPrimary,
    fontSize: 17,
    fontWeight: '700',
  },
  menuValue: {
    color: theme.colors.textMuted,
    fontWeight: '600',
  },
  logoutButton: {
    minHeight: 72,
    borderRadius: theme.borderRadius.lg,
    backgroundColor: theme.isDark ? '#3D2217' : '#F7E5DE',
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginTop: 8,
  },
  logoutIcon: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: theme.isDark ? '#5A2B1B' : '#F3D2C7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoutText: {
    color: theme.colors.error,
    fontSize: 18,
    fontWeight: '800',
  },
});
