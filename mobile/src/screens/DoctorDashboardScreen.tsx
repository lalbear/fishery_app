import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
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
  type DecoratedDoctorAppointment,
  type DoctorDashboardSnapshot,
  getDoctorDashboardSnapshot,
  updateDoctorAppointmentStatus,
} from '../services/doctorDashboardService';

export default function DoctorDashboardScreen() {
  const navigation = useNavigation<any>();
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const c = theme.colors;

  const [snapshot, setSnapshot] = useState<DoctorDashboardSnapshot | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const loadSnapshot = useCallback(async (mode: 'load' | 'refresh' = 'load') => {
    if (mode === 'refresh') setIsRefreshing(true);
    else setIsLoading(true);
    try {
      const next = await getDoctorDashboardSnapshot();
      setSnapshot(next);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      void loadSnapshot();
    }, [loadSnapshot])
  );

  const handleQuickAction = async (appointment: DecoratedDoctorAppointment) => {
    if (appointment.derivedStatus === 'NEW') {
      await updateDoctorAppointmentStatus(appointment.id, 'ACKNOWLEDGED');
      await loadSnapshot();
      return;
    }
    if (appointment.derivedStatus === 'ACKNOWLEDGED') {
      await updateDoctorAppointmentStatus(appointment.id, 'IN_PROGRESS');
      await loadSnapshot();
      return;
    }
    navigation.navigate('DoctorAppointmentDetail', { appointmentId: appointment.id });
  };

  if (isLoading || !snapshot) {
    return (
      <SafeAreaView style={styles.centered} edges={['top']}>
        <ActivityIndicator color={c.primary} size="large" />
      </SafeAreaView>
    );
  }

  const urgentAppointments = snapshot.appointments.filter(
    (item) => item.derivedStatus !== 'COMPLETED' && item.derivedStatus !== 'CANCELLED'
  ).slice(0, 3);
  const recentCompleted = snapshot.appointments.filter((item) => item.derivedStatus === 'COMPLETED').slice(0, 2);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={() => void loadSnapshot('refresh')}
            tintColor={c.primary}
          />
        }
      >
        <View style={styles.topBar}>
          <View>
            <Text style={styles.eyebrow}>DOCTOR COMMAND CENTER</Text>
            <Text style={styles.heroTitle}>{snapshot.doctor.name}</Text>
            <Text style={styles.heroSubtitle}>{snapshot.doctor.specialization}</Text>
          </View>
          <TouchableOpacity
            style={styles.alertButton}
            onPress={() => navigation.navigate('DoctorAlerts')}
            activeOpacity={0.85}
          >
            <Ionicons name="notifications-outline" size={20} color={c.textPrimary} />
            {snapshot.summary.unreadAlerts > 0 ? (
              <View style={styles.alertBadge}>
                <Text style={styles.alertBadgeText}>{snapshot.summary.unreadAlerts}</Text>
              </View>
            ) : null}
          </TouchableOpacity>
        </View>

        <View style={styles.heroCard}>
          <View style={styles.heroRow}>
            <View style={styles.heroBadge}>
              <Ionicons name="pulse-outline" size={14} color={c.primary} />
              <Text style={styles.heroBadgeText}>48-hour visit commitment active</Text>
            </View>
            <View style={styles.modeBadge}>
              <Text style={styles.modeBadgeText}>{snapshot.doctor.roleMode}</Text>
            </View>
          </View>
          <Text style={styles.heroMessage}>
            {snapshot.summary.activeCount > 0
              ? `${snapshot.summary.activeCount} live case${snapshot.summary.activeCount === 1 ? '' : 's'} assigned. ${snapshot.summary.dueWithin12Hours} need attention in the next 12 hours.`
              : 'No active field visits right now. New farmer bookings will appear here.'}
          </Text>
          <View style={styles.metricGrid}>
            <MetricCard label="Live Queue" value={String(snapshot.summary.activeCount)} accent={c.primary} bgColor={c.surfaceAlt} textColor={c.textPrimary} subTextColor={c.textSecondary} />
            <MetricCard label="Due <12h" value={String(snapshot.summary.dueWithin12Hours)} accent={c.accent} bgColor={c.surfaceAlt} textColor={c.textPrimary} subTextColor={c.textSecondary} />
            <MetricCard label="Completed" value={String(snapshot.summary.completedThisWeek)} accent={c.secondary} bgColor={c.surfaceAlt} textColor={c.textPrimary} subTextColor={c.textSecondary} />
            <MetricCard label="SLA Risk" value={String(snapshot.summary.overdueCount)} accent={c.error} bgColor={c.surfaceAlt} textColor={c.textPrimary} subTextColor={c.textSecondary} />
          </View>
        </View>

        <Text style={styles.sectionLabel}>URGENT VISITS</Text>
        {urgentAppointments.length === 0 ? (
          <View style={styles.emptyCard}>
            <Ionicons name="checkmark-circle-outline" size={22} color={c.secondary} />
            <Text style={styles.emptyTitle}>Queue is clear</Text>
            <Text style={styles.emptyText}>When a farmer books a visit, it will appear here with alerts and pond details.</Text>
          </View>
        ) : (
          urgentAppointments.map((appointment) => (
            <TouchableOpacity
              key={appointment.id}
              style={styles.urgentCard}
              activeOpacity={0.88}
              onPress={() => navigation.navigate('DoctorAppointmentDetail', { appointmentId: appointment.id })}
            >
              <View style={styles.urgentHeader}>
                <View>
                  <Text style={styles.urgentTitle}>{appointment.pondName}</Text>
                  <Text style={styles.urgentMeta}>{appointment.farmerName} · {appointment.location.addressLine}</Text>
                </View>
                <PriorityPill priority={appointment.priority} />
              </View>
              <Text style={styles.urgentBody} numberOfLines={2}>{appointment.issueDescription}</Text>
              <View style={styles.urgentFooter}>
                <View style={styles.infoChip}>
                  <Ionicons name="time-outline" size={14} color={c.textSecondary} />
                  <Text style={styles.infoChipText}>
                    {appointment.timeRemainingHours >= 0 ? `${appointment.timeRemainingHours}h left` : `${Math.abs(appointment.timeRemainingHours)}h overdue`}
                  </Text>
                </View>
                <View style={styles.infoChip}>
                  <Ionicons name="images-outline" size={14} color={c.textSecondary} />
                  <Text style={styles.infoChipText}>{appointment.images.length} image{appointment.images.length === 1 ? '' : 's'}</Text>
                </View>
              </View>
              <TouchableOpacity style={styles.primaryAction} onPress={() => void handleQuickAction(appointment)}>
                <Text style={styles.primaryActionText}>
                  {appointment.derivedStatus === 'NEW'
                    ? 'Acknowledge'
                    : appointment.derivedStatus === 'ACKNOWLEDGED'
                    ? 'Start Visit'
                    : 'Open Case'}
                </Text>
                <Ionicons name="arrow-forward" size={16} color={c.textInverse} />
              </TouchableOpacity>
            </TouchableOpacity>
          ))
        )}

        <Text style={styles.sectionLabel}>TODAY'S ROUTE CUES</Text>
        <View style={styles.routeCard}>
          {urgentAppointments.map((appointment, index) => (
            <View key={appointment.id} style={[styles.routeRow, index === urgentAppointments.length - 1 && styles.routeRowLast]}>
              <View style={styles.routeMarkerColumn}>
                <View style={styles.routeMarker} />
                {index !== urgentAppointments.length - 1 ? <View style={styles.routeLine} /> : null}
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.routeTitle}>{appointment.location.panchayatName || appointment.location.blockName || appointment.location.addressLine}</Text>
                <Text style={styles.routeText}>{appointment.pondName} · {appointment.issueDescription}</Text>
                <Text style={styles.routeMeta}>Coordinates: {appointment.coordinates ? `${appointment.coordinates.latitude.toFixed(4)}, ${appointment.coordinates.longitude.toFixed(4)}` : 'Not captured yet'}</Text>
              </View>
            </View>
          ))}
          {urgentAppointments.length === 0 ? (
            <Text style={styles.routeText}>Your route list will populate as soon as farmer bookings are assigned to your panchayat coverage.</Text>
          ) : null}
        </View>

        <Text style={styles.sectionLabel}>RECENT COMPLETIONS</Text>
        <View style={styles.completionCard}>
          {recentCompleted.length === 0 ? (
            <Text style={styles.emptyText}>Complete a field visit to start building your progress report and visit history.</Text>
          ) : (
            recentCompleted.map((appointment) => (
              <View key={appointment.id} style={styles.completionRow}>
                <View style={styles.completionIcon}>
                  <Ionicons name="checkmark-done-outline" size={16} color={c.secondary} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.completionTitle}>{appointment.pondName}</Text>
                  <Text style={styles.completionText}>{appointment.report?.diagnosis || 'Visit report captured'}</Text>
                </View>
                <Text style={styles.completionTime}>{appointment.completedAt ? new Date(appointment.completedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) : ''}</Text>
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function MetricCard({
  label,
  value,
  accent,
  bgColor,
  textColor,
  subTextColor,
}: {
  label: string;
  value: string;
  accent: string;
  bgColor: string;
  textColor: string;
  subTextColor: string;
}) {
  return (
    <View style={[stylesLocal.metricCard, { borderColor: accent + '33', backgroundColor: bgColor }]}>
      <Text style={[stylesLocal.metricValue, { color: textColor }]}>{value}</Text>
      <Text style={[stylesLocal.metricLabel, { color: subTextColor }]}>{label}</Text>
    </View>
  );
}

function PriorityPill({ priority }: { priority: DecoratedDoctorAppointment['priority'] }) {
  const palette = {
    ROUTINE: { bg: 'rgba(0,105,112,0.12)', fg: '#006970' },
    HIGH: { bg: 'rgba(133,83,0,0.12)', fg: '#855300' },
    CRITICAL: { bg: 'rgba(105,0,5,0.12)', fg: '#690005' },
  }[priority];

  return (
    <View style={[stylesLocal.priorityPill, { backgroundColor: palette.bg }]}> 
      <Text style={[stylesLocal.priorityText, { color: palette.fg }]}>{priority}</Text>
    </View>
  );
}

const stylesLocal = StyleSheet.create({
  metricCard: {
    flex: 1,
    minWidth: '47%',
    borderRadius: 18,
    borderWidth: 1,
    padding: 16,
  },
  metricValue: {
    fontSize: 26,
    fontWeight: '800',
  },
  metricLabel: {
    marginTop: 6,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
  priorityPill: {
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  priorityText: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.6,
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
      paddingBottom: 120,
    },
    topBar: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      paddingTop: 10,
      paddingBottom: 18,
    },
    eyebrow: {
      color: c.textMuted,
      fontSize: 11,
      fontWeight: '800',
      letterSpacing: 1.4,
    },
    heroTitle: {
      color: c.textPrimary,
      fontSize: 30,
      fontWeight: '800',
      marginTop: 10,
    },
    heroSubtitle: {
      color: c.textSecondary,
      fontSize: 15,
      marginTop: 4,
    },
    alertButton: {
      width: 46,
      height: 46,
      borderRadius: 23,
      backgroundColor: c.surface,
      borderWidth: 1,
      borderColor: c.border,
      alignItems: 'center',
      justifyContent: 'center',
    },
    alertBadge: {
      position: 'absolute',
      top: -4,
      right: -4,
      minWidth: 18,
      height: 18,
      borderRadius: 9,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: c.error,
      paddingHorizontal: 4,
    },
    alertBadgeText: {
      color: c.textInverse,
      fontSize: 10,
      fontWeight: '800',
    },
    heroCard: {
      backgroundColor: c.surface,
      borderRadius: 28,
      borderWidth: 1,
      borderColor: c.border,
      padding: 20,
      shadowColor: c.primary,
      shadowOpacity: 0.08,
      shadowRadius: 18,
      shadowOffset: { width: 0, height: 10 },
      elevation: 5,
    },
    heroRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: 12,
    },
    heroBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      backgroundColor: c.primaryLight,
      borderRadius: 999,
      paddingHorizontal: 12,
      paddingVertical: 8,
    },
    heroBadgeText: {
      color: c.primary,
      fontSize: 12,
      fontWeight: '700',
    },
    modeBadge: {
      borderRadius: 999,
      paddingHorizontal: 12,
      paddingVertical: 8,
      backgroundColor: c.surfaceAlt,
    },
    modeBadgeText: {
      color: c.textSecondary,
      fontSize: 11,
      fontWeight: '800',
      letterSpacing: 0.7,
    },
    heroMessage: {
      color: c.textPrimary,
      fontSize: 16,
      lineHeight: 23,
      marginTop: 16,
      marginBottom: 18,
    },
    metricGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 12,
    },
    sectionLabel: {
      color: c.textMuted,
      fontSize: 12,
      fontWeight: '800',
      letterSpacing: 1.4,
      marginTop: 26,
      marginBottom: 12,
    },
    emptyCard: {
      backgroundColor: c.surface,
      borderRadius: 22,
      borderWidth: 1,
      borderColor: c.border,
      padding: 22,
      alignItems: 'flex-start',
      gap: 10,
    },
    emptyTitle: {
      color: c.textPrimary,
      fontSize: 18,
      fontWeight: '700',
    },
    emptyText: {
      color: c.textSecondary,
      fontSize: 14,
      lineHeight: 21,
    },
    urgentCard: {
      backgroundColor: c.surface,
      borderRadius: 24,
      borderWidth: 1,
      borderColor: c.border,
      padding: 18,
      marginBottom: 12,
    },
    urgentHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      gap: 12,
    },
    urgentTitle: {
      color: c.textPrimary,
      fontSize: 18,
      fontWeight: '700',
    },
    urgentMeta: {
      color: c.textMuted,
      fontSize: 13,
      marginTop: 6,
      maxWidth: 220,
    },
    urgentBody: {
      color: c.textSecondary,
      fontSize: 14,
      lineHeight: 21,
      marginTop: 14,
    },
    urgentFooter: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 10,
      marginTop: 14,
      marginBottom: 14,
    },
    infoChip: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      paddingHorizontal: 10,
      paddingVertical: 8,
      borderRadius: 999,
      backgroundColor: c.surfaceAlt,
    },
    infoChipText: {
      color: c.textSecondary,
      fontSize: 12,
      fontWeight: '600',
    },
    primaryAction: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      backgroundColor: c.primary,
      borderRadius: 16,
      paddingVertical: 14,
    },
    primaryActionText: {
      color: c.textInverse,
      fontSize: 15,
      fontWeight: '800',
    },
    routeCard: {
      backgroundColor: c.surface,
      borderRadius: 24,
      borderWidth: 1,
      borderColor: c.border,
      padding: 18,
    },
    routeRow: {
      flexDirection: 'row',
      gap: 12,
      paddingBottom: 18,
    },
    routeRowLast: {
      paddingBottom: 0,
    },
    routeMarkerColumn: {
      alignItems: 'center',
      width: 18,
    },
    routeMarker: {
      width: 12,
      height: 12,
      borderRadius: 6,
      backgroundColor: c.primary,
      marginTop: 3,
    },
    routeLine: {
      flex: 1,
      width: 2,
      backgroundColor: c.border,
      marginTop: 6,
    },
    routeTitle: {
      color: c.textPrimary,
      fontSize: 15,
      fontWeight: '700',
    },
    routeText: {
      color: c.textSecondary,
      fontSize: 13,
      lineHeight: 20,
      marginTop: 4,
    },
    routeMeta: {
      color: c.textMuted,
      fontSize: 12,
      marginTop: 6,
    },
    completionCard: {
      backgroundColor: c.surface,
      borderRadius: 24,
      borderWidth: 1,
      borderColor: c.border,
      padding: 18,
      marginBottom: 24,
    },
    completionRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      paddingVertical: 10,
    },
    completionIcon: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: c.secondaryLight,
      alignItems: 'center',
      justifyContent: 'center',
    },
    completionTitle: {
      color: c.textPrimary,
      fontSize: 15,
      fontWeight: '700',
    },
    completionText: {
      color: c.textSecondary,
      fontSize: 13,
      lineHeight: 20,
      marginTop: 2,
    },
    completionTime: {
      color: c.textMuted,
      fontSize: 12,
      fontWeight: '600',
    },
  });
};
