import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../ThemeContext';
import { useAuth } from '../AuthContext';
import { type DoctorDashboardSnapshot, getDoctorDashboardSnapshot } from '../services/doctorDashboardService';

export default function DoctorProfileScreen() {
  const { theme, isDark, toggleTheme } = useTheme();
  const { t } = useTranslation();
  const { logout } = useAuth();
  const styles = getStyles(theme);
  const c = theme.colors;

  const [snapshot, setSnapshot] = useState<DoctorDashboardSnapshot | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [availableForField, setAvailableForField] = useState(true);

  const loadProfile = useCallback(async () => {
    setIsLoading(true);
    try {
      setSnapshot(await getDoctorDashboardSnapshot());
    } finally {
      setIsLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      void loadProfile();
    }, [loadProfile])
  );

  if (isLoading || !snapshot) {
    return (
      <SafeAreaView style={styles.centered} edges={['top']}>
        <ActivityIndicator color={c.primary} size="large" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.profileCard}>
          <View style={styles.avatarWrap}>
            <Text style={styles.avatarText}>{snapshot.doctor.name.split(' ').map((item) => item[0]).join('').slice(0, 2)}</Text>
          </View>
          <Text style={styles.profileName}>{snapshot.doctor.name}</Text>
          <Text style={styles.profileMeta}>{snapshot.doctor.specialization}</Text>
          <View style={styles.badgeRow}>
            <View style={styles.badge}><Text style={styles.badgeText}>LIVE</Text></View>
            <View style={[styles.badge, { backgroundColor: c.primaryLight }]}><Text style={[styles.badgeText, { color: c.primary }]}>48-hour response track</Text></View>
          </View>
        </View>

        <Text style={styles.sectionLabel}>{t('profile.preferences').toUpperCase()}</Text>
        <View style={styles.panel}>
          <SettingsRow icon="call-outline" title={t('personalInfo.fields.phone')} value={snapshot.doctor.phone} />
          <Divider theme={theme} />
          <SettingsRow icon="language-outline" title={t('profile.language')} value={snapshot.doctor.languages.join(', ')} />
          <Divider theme={theme} />
          <View style={styles.switchRow}>
            <View style={styles.switchLeft}>
              <Ionicons name="walk-outline" size={18} color={c.textSecondary} />
              <View>
                <Text style={styles.switchTitle}>{t('doctor.visit')}</Text>
                <Text style={styles.switchMeta}>{t('doctor.consultationType')}</Text>
              </View>
            </View>
            <Switch value={availableForField} onValueChange={setAvailableForField} trackColor={{ false: c.border, true: c.primaryLight }} thumbColor={availableForField ? c.primary : c.textMuted} />
          </View>
          <Divider theme={theme} />
          <View style={styles.switchRow}>
            <View style={styles.switchLeft}>
              <Ionicons name={isDark ? 'moon-outline' : 'sunny-outline'} size={18} color={c.textSecondary} />
              <View>
                <Text style={styles.switchTitle}>{t('profile.darkMode')}</Text>
                <Text style={styles.switchMeta}>{t('profile.appearance')}</Text>
              </View>
            </View>
            <Switch value={isDark} onValueChange={toggleTheme} trackColor={{ false: c.border, true: c.primaryLight }} thumbColor={isDark ? c.primary : c.textMuted} />
          </View>
        </View>

        <Text style={styles.sectionLabel}>{t('auth.assignedServiceArea').toUpperCase()}</Text>
        <View style={styles.panel}>
          {snapshot.doctor.serviceAreas.map((area) => (
            <View key={area} style={styles.serviceAreaRow}>
              <Ionicons name="location-outline" size={16} color={c.primary} />
              <Text style={styles.serviceAreaText}>{area}</Text>
            </View>
          ))}
        </View>

        <Text style={styles.sectionLabel}>{t('profile.account').toUpperCase()}</Text>
        <View style={styles.panel}>
          <TouchableOpacity style={styles.actionButton} onPress={() => void loadProfile()}>
            <Ionicons name="refresh-outline" size={18} color={c.primary} />
            <Text style={styles.actionText}>{t('common.refresh')}</Text>
          </TouchableOpacity>
          <Divider theme={theme} />
          <TouchableOpacity style={styles.actionButton} onPress={() => void logout()}>
            <Ionicons name="log-out-outline" size={18} color={c.error} />
            <Text style={[styles.actionText, { color: c.error }]}>{t('profile.logout')}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function SettingsRow({ icon, title, value }: { icon: keyof typeof Ionicons.glyphMap; title: string; value: string }) {
  const { theme } = useTheme();
  return (
    <View style={stylesLocal.row}>
      <Ionicons name={icon} size={18} color={theme.colors.textSecondary} />
      <Text style={[stylesLocal.title, { color: theme.colors.textPrimary }]}>{title}</Text>
      <Text style={[stylesLocal.value, { color: theme.colors.textMuted }]}>{value}</Text>
    </View>
  );
}

function Divider({ theme }: { theme: any }) {
  return <View style={{ height: 1, backgroundColor: theme.colors.border }} />;
}

const stylesLocal = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 14,
  },
  title: {
    flex: 1,
    fontSize: 14,
    fontWeight: '700',
  },
  value: {
    fontSize: 13,
    fontWeight: '600',
    maxWidth: 160,
    textAlign: 'right',
  },
});

const getStyles = (theme: any) => {
  const c = theme.colors;
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: c.background,
    },
    centered: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: c.background,
    },
    content: {
      paddingHorizontal: 16,
      paddingTop: 12,
      paddingBottom: 120,
    },
    profileCard: {
      backgroundColor: c.surface,
      borderRadius: 28,
      borderWidth: 1,
      borderColor: c.border,
      padding: 22,
      alignItems: 'center',
    },
    avatarWrap: {
      width: 72,
      height: 72,
      borderRadius: 36,
      backgroundColor: c.primary,
      alignItems: 'center',
      justifyContent: 'center',
    },
    avatarText: {
      color: c.textInverse,
      fontSize: 24,
      fontWeight: '800',
    },
    profileName: {
      color: c.textPrimary,
      fontSize: 24,
      fontWeight: '800',
      marginTop: 16,
      textAlign: 'center',
    },
    profileMeta: {
      color: c.textSecondary,
      fontSize: 14,
      marginTop: 6,
      textAlign: 'center',
    },
    badgeRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 10,
      marginTop: 14,
      justifyContent: 'center',
    },
    badge: {
      borderRadius: 999,
      paddingHorizontal: 12,
      paddingVertical: 8,
      backgroundColor: c.surfaceAlt,
    },
    badgeText: {
      color: c.textSecondary,
      fontSize: 12,
      fontWeight: '800',
      letterSpacing: 0.5,
    },
    sectionLabel: {
      color: c.textMuted,
      fontSize: 12,
      fontWeight: '800',
      letterSpacing: 1.2,
      marginTop: 24,
      marginBottom: 12,
    },
    panel: {
      backgroundColor: c.surface,
      borderRadius: 24,
      borderWidth: 1,
      borderColor: c.border,
      paddingHorizontal: 16,
    },
    switchRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 12,
      paddingVertical: 14,
    },
    switchLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
      flex: 1,
    },
    switchTitle: {
      color: c.textPrimary,
      fontSize: 14,
      fontWeight: '700',
    },
    switchMeta: {
      color: c.textMuted,
      fontSize: 12,
      marginTop: 3,
    },
    serviceAreaRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
      paddingVertical: 14,
      borderBottomWidth: 1,
      borderBottomColor: c.border,
    },
    serviceAreaText: {
      color: c.textPrimary,
      fontSize: 14,
      fontWeight: '600',
    },
    actionButton: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
      paddingVertical: 16,
    },
    actionText: {
      color: c.textPrimary,
      fontSize: 14,
      fontWeight: '700',
    },
  });
};
