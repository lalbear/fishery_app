import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../ThemeContext';
import { type DoctorDashboardSnapshot, getDoctorDashboardSnapshot } from '../services/doctorDashboardService';

export default function DoctorReportsScreen() {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const c = theme.colors;
  const styles = getStyles(theme);

  const [snapshot, setSnapshot] = useState<DoctorDashboardSnapshot | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const loadReports = useCallback(async (mode: 'load' | 'refresh' = 'load') => {
    if (mode === 'refresh') setIsRefreshing(true);
    else setIsLoading(true);
    try {
      setSnapshot(await getDoctorDashboardSnapshot());
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      void loadReports();
    }, [loadReports])
  );

  if (isLoading || !snapshot) {
    return (
      <SafeAreaView style={styles.centered} edges={['top']}>
        <ActivityIndicator color={c.primary} size="large" />
      </SafeAreaView>
    );
  }

  const { reports } = snapshot;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={() => void loadReports('refresh')} tintColor={c.primary} />}
      >
        <Text style={styles.title}>{t('doctor.reports')}</Text>
        <Text style={styles.subtitle}>{t('doctor.weeklyHelp')}</Text>

        <View style={styles.primaryStatsGrid}>
          <StatCard label={t('doctor.statAssigned')} value={String(reports.totalAssigned)} icon="briefcase-outline" accent={c.primary} backgroundColor={c.surface} textColor={c.textPrimary} subTextColor={c.textSecondary} />
          <StatCard label={t('doctor.statCompleted')} value={String(reports.completed)} icon="checkmark-circle-outline" accent={c.secondary} backgroundColor={c.surface} textColor={c.textPrimary} subTextColor={c.textSecondary} />
          <StatCard label={t('doctor.statMissed')} value={String(reports.missed)} icon="alert-circle-outline" accent={c.error} backgroundColor={c.surface} textColor={c.textPrimary} subTextColor={c.textSecondary} />
          <StatCard label={t('doctor.statRepeatPonds')} value={String(reports.repeatPonds)} icon="refresh-outline" accent={c.accent} backgroundColor={c.surface} textColor={c.textPrimary} subTextColor={c.textSecondary} />
        </View>

        <View style={styles.summaryBand}>
          <ProgressBlock label={t('doctor.statCompletionRate')} value={`${reports.completionRate}%`} progress={reports.completionRate} color={c.secondary} textColor={c.textPrimary} trackColor={c.surfaceAlt} />
          <ProgressBlock label={t('doctor.statAvgResponse')} value={`${reports.averageResponseHours}h`} progress={Math.max(0, 100 - reports.averageResponseHours * 4)} color={c.primary} textColor={c.textPrimary} trackColor={c.surfaceAlt} />
          <ProgressBlock label={t('doctor.statAvgClosure')} value={`${reports.averageClosureHours}h`} progress={Math.max(0, 100 - reports.averageClosureHours * 2)} color={c.accent} textColor={c.textPrimary} trackColor={c.surfaceAlt} />
        </View>

        <Text style={styles.sectionLabel}>{t('doctor.statInProgress').toUpperCase()}</Text>
        <View style={styles.chartCard}>
          <BarRow label={t('doctor.statInProgress')} value={reports.inProgress} total={Math.max(1, reports.totalAssigned)} color={c.primary} textColor={c.textPrimary} trackColor={c.surfaceAlt} />
          <BarRow label={t('doctor.statWaitingAccepted')} value={reports.acknowledged} total={Math.max(1, reports.totalAssigned)} color={c.accent} textColor={c.textPrimary} trackColor={c.surfaceAlt} />
          <BarRow label={t('doctor.statCompleted')} value={reports.completed} total={Math.max(1, reports.totalAssigned)} color={c.secondary} textColor={c.textPrimary} trackColor={c.surfaceAlt} />
          <BarRow label={t('doctor.statMissed')} value={reports.missed} total={Math.max(1, reports.totalAssigned)} color={c.error} textColor={c.textPrimary} trackColor={c.surfaceAlt} />
        </View>

        <Text style={styles.sectionLabel}>{t('profile.location').toUpperCase()}</Text>
        <View style={styles.chartCard}>
          {reports.topLocations.length === 0 ? (
            <Text style={styles.emptyText}>{t('doctor.hotspotEmpty')}</Text>
          ) : (
            reports.topLocations.map((location) => (
              <View key={location.label} style={styles.hotspotRow}>
                <View>
                  <Text style={styles.hotspotTitle}>{location.label}</Text>
                  <Text style={styles.hotspotMeta}>{t('doctor.appointmentCount', { count: location.count })}</Text>
                </View>
                <View style={styles.hotspotBadge}>
                  <Text style={styles.hotspotBadgeText}>{location.count}</Text>
                </View>
              </View>
            ))
          )}
        </View>

        <Text style={styles.sectionLabel}>{t('doctor.notes').toUpperCase()}</Text>
        <View style={styles.notesCard}>
          <Insight icon="map-outline" text={t('doctor.insightRoute')} />
          <Insight icon="images-outline" text={t('doctor.insightPhotos')} />
          <Insight icon="alarm-outline" text={t('doctor.insightReminders')} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function StatCard({
  label,
  value,
  icon,
  accent,
  backgroundColor,
  textColor,
  subTextColor,
}: {
  label: string;
  value: string;
  icon: keyof typeof Ionicons.glyphMap;
  accent: string;
  backgroundColor?: string;
  textColor?: string;
  subTextColor?: string;
}) {
  return (
    <View style={[stylesLocal.statCard, { borderColor: accent + '28', backgroundColor: backgroundColor || 'rgba(255,255,255,0.05)' }]}>
      <Ionicons name={icon} size={18} color={accent} />
      <Text style={[stylesLocal.statValue, { color: textColor || '#ffffff' }]}>{value}</Text>
      <Text style={[stylesLocal.statLabel, { color: subTextColor || '#b9cacb' }]}>{label}</Text>
    </View>
  );
}

function ProgressBlock({
  label,
  value,
  progress,
  color,
  textColor,
  trackColor,
}: {
  label: string;
  value: string;
  progress: number;
  color: string;
  textColor: string;
  trackColor: string;
}) {
  const widthPercent = `${Math.max(6, Math.min(progress, 100))}%` as any;
  return (
    <View style={stylesLocal.progressBlock}>
      <View style={stylesLocal.progressHeader}>
        <Text style={[stylesLocal.progressLabel, { color: textColor }]}>{label}</Text>
        <Text style={[stylesLocal.progressValue, { color: textColor }]}>{value}</Text>
      </View>
      <View style={[stylesLocal.progressTrack, { backgroundColor: trackColor }]}>
        <View style={[stylesLocal.progressFill, { width: widthPercent, backgroundColor: color }]} />
      </View>
    </View>
  );
}

function BarRow({
  label,
  value,
  total,
  color,
  textColor,
  trackColor,
}: {
  label: string;
  value: number;
  total: number;
  color: string;
  textColor: string;
  trackColor: string;
}) {
  const width = `${Math.max(6, Math.round((value / total) * 100))}%` as any;
  return (
    <View style={stylesLocal.barRow}>
      <View style={stylesLocal.barLabelRow}>
        <Text style={[stylesLocal.barLabel, { color: textColor }]}>{label}</Text>
        <Text style={[stylesLocal.barValue, { color: textColor }]}>{value}</Text>
      </View>
      <View style={[stylesLocal.barTrack, { backgroundColor: trackColor }]}>
        <View style={[stylesLocal.barFill, { width, backgroundColor: color }]} />
      </View>
    </View>
  );
}

function Insight({ icon, text }: { icon: keyof typeof Ionicons.glyphMap; text: string }) {
  const { theme } = useTheme();
  return (
    <View style={stylesLocal.insightRow}>
      <View style={[stylesLocal.insightIconWrap, { backgroundColor: theme.colors.surfaceAlt }]}>
        <Ionicons name={icon} size={16} color={theme.colors.primary} />
      </View>
      <Text style={[stylesLocal.insightText, { color: theme.colors.textSecondary }]}>{text}</Text>
    </View>
  );
}

const stylesLocal = StyleSheet.create({
  statCard: {
    flex: 1,
    minWidth: '47%',
    borderRadius: 22,
    borderWidth: 1,
    padding: 16,
    gap: 10,
  },
  statValue: {
    fontSize: 28,
    fontWeight: '800',
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  progressBlock: {
    marginBottom: 14,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressLabel: {
    fontSize: 13,
    fontWeight: '700',
  },
  progressValue: {
    fontSize: 13,
    fontWeight: '800',
  },
  progressTrack: {
    height: 10,
    borderRadius: 999,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 999,
  },
  barRow: {
    marginBottom: 14,
  },
  barLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  barLabel: {
    fontSize: 13,
    fontWeight: '700',
  },
  barValue: {
    fontSize: 13,
    fontWeight: '800',
  },
  barTrack: {
    height: 10,
    borderRadius: 999,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 999,
  },
  insightRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 14,
  },
  insightIconWrap: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
  },
  insightText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 20,
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
    title: {
      color: c.textPrimary,
      fontSize: 28,
      fontWeight: '800',
    },
    subtitle: {
      color: c.textSecondary,
      fontSize: 14,
      lineHeight: 21,
      marginTop: 8,
    },
    primaryStatsGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 12,
      marginTop: 18,
    },
    summaryBand: {
      backgroundColor: c.surface,
      borderRadius: 24,
      borderWidth: 1,
      borderColor: c.border,
      padding: 18,
      marginTop: 22,
    },
    sectionLabel: {
      color: c.textMuted,
      fontSize: 12,
      fontWeight: '800',
      letterSpacing: 1.3,
      marginTop: 24,
      marginBottom: 12,
    },
    chartCard: {
      backgroundColor: c.surface,
      borderRadius: 24,
      borderWidth: 1,
      borderColor: c.border,
      padding: 18,
    },
    hotspotRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: 10,
      borderBottomWidth: 1,
      borderBottomColor: c.border,
    },
    hotspotTitle: {
      color: c.textPrimary,
      fontSize: 15,
      fontWeight: '700',
    },
    hotspotMeta: {
      color: c.textSecondary,
      fontSize: 13,
      marginTop: 4,
    },
    hotspotBadge: {
      minWidth: 34,
      height: 34,
      borderRadius: 17,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: c.primaryLight,
      paddingHorizontal: 8,
    },
    hotspotBadgeText: {
      color: c.primary,
      fontSize: 13,
      fontWeight: '800',
    },
    notesCard: {
      backgroundColor: c.surface,
      borderRadius: 24,
      borderWidth: 1,
      borderColor: c.border,
      padding: 18,
      marginBottom: 24,
    },
    emptyText: {
      color: c.textSecondary,
      fontSize: 14,
      lineHeight: 21,
    },
  });
};
