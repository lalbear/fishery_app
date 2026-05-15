import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useTheme } from '../ThemeContext';
import {
  type DoctorAlert,
  getDoctorDashboardSnapshot,
  markAllDoctorAlertsRead,
  markDoctorAlertRead,
} from '../services/doctorDashboardService';

export default function DoctorAlertsScreen() {
  const navigation = useNavigation<any>();
  const { theme } = useTheme();
  const c = theme.colors;
  const styles = getStyles(theme);

  const [alerts, setAlerts] = useState<DoctorAlert[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const loadAlerts = useCallback(async (mode: 'load' | 'refresh' = 'load') => {
    if (mode === 'refresh') setIsRefreshing(true);
    else setIsLoading(true);
    try {
      const snapshot = await getDoctorDashboardSnapshot();
      setAlerts(snapshot.alerts);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      void loadAlerts();
    }, [loadAlerts])
  );

  const unreadCount = alerts.filter((item) => !item.isRead).length;

  const handleOpenAlert = async (alert: DoctorAlert) => {
    await markDoctorAlertRead(alert.id);
    await loadAlerts();
    navigation.navigate('DoctorAppointmentDetail', { appointmentId: alert.appointmentId });
  };

  const handleMarkAllRead = async () => {
    await markAllDoctorAlertsRead();
    await loadAlerts();
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Reminder Center</Text>
          <Text style={styles.headerSubtitle}>{unreadCount} unread alerts waiting for review</Text>
        </View>
        <TouchableOpacity style={styles.markAllButton} onPress={() => void handleMarkAllRead()}>
          <Text style={styles.markAllButtonText}>Mark all</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.summaryCard}>
        <View style={styles.summaryIconWrap}>
          <Ionicons name="alarm-outline" size={22} color={c.primary} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.summaryTitle}>12-hour revisit reminders active</Text>
          <Text style={styles.summaryText}>Every open booking gets reminder alerts at 12-hour intervals until it is completed or reaches the 48-hour SLA threshold.</Text>
        </View>
      </View>

      {isLoading ? (
        <View style={styles.centered}>
          <ActivityIndicator color={c.primary} size="large" />
        </View>
      ) : (
        <FlatList
          data={alerts}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={isRefreshing} onRefresh={() => void loadAlerts('refresh')} tintColor={c.primary} />
          }
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Ionicons name="notifications-off-outline" size={28} color={c.textMuted} />
              <Text style={styles.emptyTitle}>No alerts yet</Text>
              <Text style={styles.emptyText}>Once a farmer booking is assigned to this doctor, reminders and SLA alerts will appear here.</Text>
            </View>
          }
          renderItem={({ item }) => {
            const accent = item.severity === 'critical' ? c.error : item.severity === 'warning' ? c.accent : c.primary;
            return (
              <TouchableOpacity style={styles.alertCard} activeOpacity={0.88} onPress={() => void handleOpenAlert(item)}>
                <View style={[styles.leftRail, { backgroundColor: accent }]} />
                <View style={[styles.iconWrap, { backgroundColor: accent + '18' }]}>
                  <Ionicons name={item.category === 'completed' ? 'checkmark-done-outline' : 'notifications-outline'} size={18} color={accent} />
                </View>
                <View style={{ flex: 1 }}>
                  <View style={styles.alertTopRow}>
                    <Text style={styles.alertTitle}>{item.title}</Text>
                    {!item.isRead ? <View style={[styles.unreadDot, { backgroundColor: accent }]} /> : null}
                  </View>
                  <Text style={styles.alertMessage}>{item.message}</Text>
                  <Text style={styles.alertTime}>
                    {new Date(item.createdAt).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          }}
        />
      )}
    </SafeAreaView>
  );
}

const getStyles = (theme: any) => {
  const c = theme.colors;
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: c.background,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 16,
      paddingTop: 12,
      paddingBottom: 16,
      gap: 12,
    },
    headerTitle: {
      color: c.textPrimary,
      fontSize: 24,
      fontWeight: '800',
    },
    headerSubtitle: {
      color: c.textSecondary,
      fontSize: 13,
      marginTop: 4,
    },
    markAllButton: {
      borderRadius: 999,
      paddingHorizontal: 14,
      paddingVertical: 10,
      backgroundColor: c.surface,
      borderWidth: 1,
      borderColor: c.border,
    },
    markAllButtonText: {
      color: c.primary,
      fontSize: 13,
      fontWeight: '800',
    },
    summaryCard: {
      marginHorizontal: 16,
      flexDirection: 'row',
      gap: 14,
      backgroundColor: c.surface,
      borderRadius: 24,
      borderWidth: 1,
      borderColor: c.border,
      padding: 18,
    },
    summaryIconWrap: {
      width: 48,
      height: 48,
      borderRadius: 24,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: c.primaryLight,
    },
    summaryTitle: {
      color: c.textPrimary,
      fontSize: 16,
      fontWeight: '700',
    },
    summaryText: {
      color: c.textSecondary,
      fontSize: 13,
      lineHeight: 20,
      marginTop: 6,
    },
    centered: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    listContent: {
      paddingHorizontal: 16,
      paddingTop: 16,
      paddingBottom: 120,
    },
    emptyState: {
      backgroundColor: c.surface,
      borderRadius: 24,
      borderWidth: 1,
      borderColor: c.border,
      padding: 24,
      alignItems: 'center',
    },
    emptyTitle: {
      color: c.textPrimary,
      fontSize: 18,
      fontWeight: '700',
      marginTop: 10,
    },
    emptyText: {
      color: c.textSecondary,
      fontSize: 14,
      lineHeight: 21,
      textAlign: 'center',
      marginTop: 8,
    },
    alertCard: {
      flexDirection: 'row',
      gap: 12,
      backgroundColor: c.surface,
      borderRadius: 24,
      borderWidth: 1,
      borderColor: c.border,
      padding: 16,
      marginBottom: 12,
      alignItems: 'flex-start',
    },
    leftRail: {
      width: 4,
      alignSelf: 'stretch',
      borderRadius: 999,
    },
    iconWrap: {
      width: 40,
      height: 40,
      borderRadius: 20,
      alignItems: 'center',
      justifyContent: 'center',
    },
    alertTopRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 8,
    },
    alertTitle: {
      flex: 1,
      color: c.textPrimary,
      fontSize: 16,
      fontWeight: '700',
    },
    unreadDot: {
      width: 10,
      height: 10,
      borderRadius: 5,
    },
    alertMessage: {
      color: c.textSecondary,
      fontSize: 14,
      lineHeight: 21,
      marginTop: 6,
    },
    alertTime: {
      color: c.textMuted,
      fontSize: 12,
      marginTop: 8,
    },
  });
};
