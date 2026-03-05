/**
 * Profile Screen
 * Shows user's saved info (name, phone, category) and navigates to sub-screens.
 */

import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { loadProfile, UserProfile } from './PersonalInfoScreen';

export default function ProfileScreen({ navigation }: any) {
  const { t, i18n } = useTranslation();
  const [profile, setProfile] = useState<UserProfile>({ name: '', phone: '', farmerCategory: 'GENERAL', stateCode: '' });

  // Reload profile every time the tab is focused (including return from PersonalInfoScreen)
  useFocusEffect(
    useCallback(() => {
      loadProfile().then(setProfile);
    }, [])
  );

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
      onPress: () => Alert.alert('Coming Soon', 'My Ponds management will be available in the next update.'),
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
      icon: 'sync-outline',
      title: t('profile.syncData'),
      subtitle: 'Sync with server',
      onPress: () => Alert.alert('Coming Soon', 'Data sync will be available in the next update.'),
    },
    {
      icon: 'log-out-outline',
      title: t('profile.logout'),
      subtitle: 'Sign out of the app',
      onPress: () => Alert.alert('Logout', 'Are you sure you want to log out?', [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Logout', style: 'destructive', onPress: () => { } },
      ]),
      danger: true,
    },
  ];

  const displayName = profile.name || 'Farmer';
  const displayPhone = profile.phone ? `+91 ${profile.phone}` : 'Tap to add phone';
  const displayCategory = categoryLabels[profile.farmerCategory] || profile.farmerCategory;
  const initials = displayName.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);

  return (
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

      {/* Menu */}
      <View style={styles.menu}>
        {menuItems.map((item, index) => (
          <TouchableOpacity key={index} style={styles.menuItem} onPress={item.onPress} activeOpacity={0.7}>
            <View style={[styles.iconWrap, item.danger && styles.iconWrapDanger]}>
              <Ionicons name={item.icon as any} size={20} color={item.danger ? '#F44336' : '#2E7D32'} />
            </View>
            <View style={styles.menuTextBlock}>
              <Text style={[styles.menuText, item.danger && styles.dangerText]}>{item.title}</Text>
              {item.subtitle ? <Text style={styles.menuSub}>{item.subtitle}</Text> : null}
            </View>
            {item.value && <Text style={styles.menuValue}>{item.value}</Text>}
            <Ionicons name="chevron-forward" size={18} color="#ccc" />
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.version}>Fishing God v1.0.0</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },

  header: { alignItems: 'center', paddingTop: 36, paddingBottom: 28, paddingHorizontal: 16, backgroundColor: '#2E7D32' },
  avatar: { width: 76, height: 76, borderRadius: 38, backgroundColor: 'rgba(255,255,255,0.25)', justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  initials: { fontSize: 28, fontWeight: '700', color: '#fff' },
  name: { fontSize: 20, fontWeight: '700', color: '#fff' },
  phone: { fontSize: 13, color: 'rgba(255,255,255,0.8)', marginTop: 3 },
  badge: { backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 16, marginTop: 8 },
  badgeText: { color: '#fff', fontSize: 12, fontWeight: '600' },
  stateLabel: { color: 'rgba(255,255,255,0.7)', fontSize: 12, marginTop: 4 },

  menu: { marginTop: 16, backgroundColor: '#fff', borderRadius: 12, marginHorizontal: 12, overflow: 'hidden', elevation: 1 },
  menuItem: { flexDirection: 'row', alignItems: 'center', padding: 14, borderBottomWidth: 1, borderBottomColor: '#f5f5f5' },
  iconWrap: { width: 36, height: 36, borderRadius: 10, backgroundColor: '#E8F5E9', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  iconWrapDanger: { backgroundColor: '#FFEBEE' },
  menuTextBlock: { flex: 1 },
  menuText: { fontSize: 15, color: '#333', fontWeight: '500' },
  menuSub: { fontSize: 12, color: '#999', marginTop: 1 },
  menuValue: { fontSize: 13, color: '#888', fontWeight: '500', marginRight: 8 },
  dangerText: { color: '#F44336' },

  version: { textAlign: 'center', color: '#bbb', fontSize: 12, marginTop: 24, marginBottom: 32 },
});
