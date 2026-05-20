import React, { useCallback, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
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
import { useTranslation } from 'react-i18next';
import { useTheme } from '../ThemeContext';
import {
  type DecoratedDoctorAppointment,
  getDoctorDashboardSnapshot,
  updateDoctorAppointmentStatus,
} from '../services/doctorDashboardService';

type VisitFilter = 'ACTIVE' | 'COMPLETED' | 'MISSED' | 'ALL';

export default function DoctorAppointmentsScreen() {
  const navigation = useNavigation<any>();
  const { theme } = useTheme();
  const { t } = useTranslation();
  const c = theme.colors;
  const styles = getStyles(theme);

  const [appointments, setAppointments] = useState<DecoratedDoctorAppointment[]>([]);
  const [filter, setFilter] = useState<VisitFilter>('ACTIVE');
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const loadAppointments = useCallback(async (mode: 'load' | 'refresh' = 'load') => {
    if (mode === 'refresh') setIsRefreshing(true);
    else setIsLoading(true);
    try {
      const snapshot = await getDoctorDashboardSnapshot();
      setAppointments(snapshot.appointments);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      void loadAppointments();
    }, [loadAppointments])
  );

  const filteredAppointments = useMemo(() => {
    switch (filter) {
      case 'ACTIVE':
        return appointments.filter((item) => !['COMPLETED', 'MISSED', 'CANCELLED'].includes(item.derivedStatus));
      case 'COMPLETED':
        return appointments.filter((item) => item.derivedStatus === 'COMPLETED');
      case 'MISSED':
        return appointments.filter((item) => item.derivedStatus === 'MISSED');
      default:
        return appointments;
    }
  }, [appointments, filter]);

  const handleStatusAction = async (appointment: DecoratedDoctorAppointment) => {
    const nextStatus =
      appointment.derivedStatus === 'NEW'
        ? 'ACKNOWLEDGED'
        : appointment.derivedStatus === 'ACKNOWLEDGED'
        ? 'IN_PROGRESS'
        : null;

    if (!nextStatus) {
      navigation.navigate('DoctorAppointmentDetail', { appointmentId: appointment.id });
      return;
    }

    // Fix #10: wrap in try/catch so network failures surface to the user
    try {
      await updateDoctorAppointmentStatus(appointment.id, nextStatus);
      await loadAppointments();
    } catch (error: any) {
      Alert.alert(
        'Status update failed',
        error?.message || 'Could not update the appointment status right now.'
      );
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{t('doctor.appointments')}</Text>
        <TouchableOpacity
          style={styles.headerAction}
          onPress={() => navigation.navigate('DoctorAlerts')}
        >
          <Ionicons name="notifications-outline" size={18} color={c.primary} />
          <Text style={styles.headerActionText}>{t('doctor.alerts')}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.filterRow}>
        {(['ACTIVE', 'COMPLETED', 'MISSED', 'ALL'] as VisitFilter[]).map((item) => {
          const active = filter === item;
          const labelMap: Record<string, string> = {
            ACTIVE: t('doctor.filterActive'),
            COMPLETED: t('doctor.statusValues.COMPLETED'),
            MISSED: t('doctor.filterMissed'),
            ALL: t('common.all'),
          };
          return (
            <TouchableOpacity
              key={item}
              style={[styles.filterChip, active && styles.filterChipActive]}
              onPress={() => setFilter(item)}
            >
              <Text style={[styles.filterChipText, active && styles.filterChipTextActive]}>{labelMap[item]}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {isLoading ? (
        <View style={styles.centered}>
          <ActivityIndicator color={c.primary} size="large" />
        </View>
      ) : (
        <FlatList
          data={filteredAppointments}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={isRefreshing} onRefresh={() => void loadAppointments('refresh')} tintColor={c.primary} />
          }
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Ionicons name="medical-outline" size={28} color={c.textMuted} />
              <Text style={styles.emptyTitle}>{t('doctor.noAppointmentsTitle')}</Text>
              <Text style={styles.emptyText}>{t('doctor.noAppointmentsBody')}</Text>
            </View>
          }
          renderItem={({ item }) => {
            const statusColor =
              item.derivedStatus === 'COMPLETED'
                ? c.secondary
                : item.derivedStatus === 'MISSED'
                ? c.error
                : item.priority === 'CRITICAL'
                ? c.error
                : item.priority === 'HIGH'
                ? c.accent
                : c.primary;

            return (
              <TouchableOpacity
                style={styles.card}
                activeOpacity={0.88}
                onPress={() => navigation.navigate('DoctorAppointmentDetail', { appointmentId: item.id })}
              >
                <View style={styles.cardTopRow}>
                  <View style={[styles.statusDot, { backgroundColor: statusColor }]} />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.cardTitle}>{item.pondName}</Text>
                    <Text style={styles.cardSubtitle}>{item.farmerName} · {item.location.addressLine}</Text>
                  </View>
                  <View style={[styles.statusPill, { backgroundColor: statusColor + '18' }]}>
                    <Text style={[styles.statusPillText, { color: statusColor }]}>{t(`doctor.derivedStatus.${item.derivedStatus}`, { defaultValue: item.derivedStatus })}</Text>
                  </View>
                </View>

                <Text style={styles.cardBody} numberOfLines={2}>{item.issueDescription}</Text>

                <View style={styles.metaGrid}>
                  <MetaItem icon="time-outline" label={item.timeRemainingHours >= 0 ? t('doctor.timeLeft', { hours: item.timeRemainingHours }) : t('doctor.timeOverdue', { hours: Math.abs(item.timeRemainingHours) })} />
                  <MetaItem icon="location-outline" label={item.location.panchayatName || item.location.blockName || t('doctor.locationPending')} />
                  <MetaItem icon="images-outline" label={t('doctor.farmerImages', { count: item.images.length })} />
                  <MetaItem icon="flask-outline" label={item.waterQualitySnapshot ? t('doctor.waterLogAttached') : t('doctor.noWaterLog')} />
                </View>

                <View style={styles.actionRow}>
                  <TouchableOpacity style={styles.secondaryButton} onPress={() => navigation.navigate('DoctorAppointmentDetail', { appointmentId: item.id })}>
                    <Text style={styles.secondaryButtonText}>{t('doctor.details')}</Text>
                  </TouchableOpacity>
                  {item.derivedStatus !== 'COMPLETED' && item.derivedStatus !== 'MISSED' ? (
                    <TouchableOpacity style={styles.primaryButton} onPress={() => void handleStatusAction(item)}>
                      <Text style={styles.primaryButtonText}>
                        {item.derivedStatus === 'NEW' ? t('doctor.actionAccept') : item.derivedStatus === 'ACKNOWLEDGED' ? t('doctor.actionStartVisit') : t('doctor.actionOpenReport')}
                      </Text>
                    </TouchableOpacity>
                  ) : null}
                </View>
              </TouchableOpacity>
            );
          }}
        />
      )}
    </SafeAreaView>
  );
}

function MetaItem({ icon, label }: { icon: keyof typeof Ionicons.glyphMap; label: string }) {
  const { theme } = useTheme();
  return (
    <View style={stylesMeta.item}>
      <Ionicons name={icon} size={14} color={theme.colors.textMuted} />
      <Text style={[stylesMeta.label, { color: theme.colors.textSecondary }]}>{label}</Text>
    </View>
  );
}

const stylesMeta = StyleSheet.create({
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    width: '48%',
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
  },
});

const getStyles = (theme: any) => {
  const c = theme.colors;
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: c.background,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 16,
      paddingTop: 12,
      paddingBottom: 12,
    },
    headerTitle: {
      color: c.textPrimary,
      fontSize: 24,
      fontWeight: '800',
    },
    headerAction: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      paddingHorizontal: 12,
      paddingVertical: 10,
      borderRadius: 999,
      backgroundColor: c.primaryLight,
    },
    headerActionText: {
      color: c.primary,
      fontSize: 13,
      fontWeight: '700',
    },
    filterRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 10,
      paddingHorizontal: 16,
      paddingBottom: 12,
    },
    filterChip: {
      paddingHorizontal: 14,
      paddingVertical: 10,
      borderRadius: 999,
      borderWidth: 1,
      borderColor: c.border,
      backgroundColor: c.surface,
    },
    filterChipActive: {
      backgroundColor: c.primary,
      borderColor: c.primary,
    },
    filterChipText: {
      color: c.textSecondary,
      fontSize: 12,
      fontWeight: '800',
      letterSpacing: 0.6,
    },
    filterChipTextActive: {
      color: c.textInverse,
    },
    centered: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    listContent: {
      paddingHorizontal: 16,
      paddingBottom: 120,
      gap: 12,
    },
    emptyState: {
      backgroundColor: c.surface,
      borderRadius: 24,
      borderWidth: 1,
      borderColor: c.border,
      padding: 24,
      alignItems: 'center',
      marginTop: 24,
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
    card: {
      backgroundColor: c.surface,
      borderRadius: 24,
      borderWidth: 1,
      borderColor: c.border,
      padding: 18,
      marginBottom: 12,
    },
    cardTopRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
    },
    statusDot: {
      width: 12,
      height: 12,
      borderRadius: 6,
      marginTop: 4,
    },
    cardTitle: {
      color: c.textPrimary,
      fontSize: 18,
      fontWeight: '700',
    },
    cardSubtitle: {
      color: c.textMuted,
      fontSize: 12,
      marginTop: 4,
    },
    statusPill: {
      borderRadius: 999,
      paddingHorizontal: 10,
      paddingVertical: 6,
    },
    statusPillText: {
      fontSize: 11,
      fontWeight: '800',
      letterSpacing: 0.5,
    },
    cardBody: {
      color: c.textSecondary,
      fontSize: 14,
      lineHeight: 21,
      marginTop: 14,
    },
    metaGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      rowGap: 10,
      columnGap: 8,
      marginTop: 14,
      marginBottom: 16,
    },
    actionRow: {
      flexDirection: 'row',
      gap: 10,
    },
    secondaryButton: {
      flex: 1,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: c.border,
      paddingVertical: 13,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: c.surfaceAlt,
    },
    secondaryButtonText: {
      color: c.textPrimary,
      fontSize: 14,
      fontWeight: '700',
    },
    primaryButton: {
      flex: 1,
      borderRadius: 16,
      paddingVertical: 13,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: c.primary,
    },
    primaryButtonText: {
      color: c.textInverse,
      fontSize: 14,
      fontWeight: '800',
    },
  });
};
