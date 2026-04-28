import React, { useCallback, useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, TextInput, Alert,
  ActivityIndicator, RefreshControl, Modal, FlatList,
} from 'react-native';
import { Q } from '@nozbe/watermelondb';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { v4 as uuidv4 } from 'uuid';
import { useTheme } from '../ThemeContext';
import WaterQualityChart from '../components/WaterQualityChart';
import { evaluatePondHealth, Advisory } from '../utils/pondAdvisory';
import { database } from '../database';
import Pond from '../database/models/Pond';
import WaterQualityLog from '../database/models/WaterQualityLog';
import { fetchSpeciesLookup } from '../utils/speciesLookup';
import { getUnreadNotificationCount } from '../utils/notificationCenter';

interface Reading {
  id: string;
  pond_id: string;
  pond_name: string;
  temperature?: number;
  dissolved_oxygen?: number;
  ph?: number;
  salinity?: number;
  ammonia?: number;
  recorded_at: string;
}

interface PondOption {
  id: string;
  name: string;
  subtitle: string;
}

function statusFor(reading: Reading): 'normal' | 'warning' | 'alert' {
  if (reading.dissolved_oxygen != null && reading.dissolved_oxygen < 4) return 'alert';
  if (reading.ph != null && (reading.ph < 6.5 || reading.ph > 8.5)) return 'warning';
  if (reading.temperature != null && (reading.temperature < 20 || reading.temperature > 35)) return 'warning';
  return 'normal';
}

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
}

export default function WaterQualityScreen({ route }: any) {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const navigation = useNavigation<any>();

  const [activeTab, setActiveTab] = useState<'log' | 'history'>(route.params?.initialTab || 'log');
  const [temperature, setTemperature] = useState('');
  const [dissolvedOxygen, setDissolvedOxygen] = useState('');
  const [ph, setPh] = useState('');
  const [salinity, setSalinity] = useState('');
  const [ammonia, setAmmonia] = useState('');
  const [notes, setNotes] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [history, setHistory] = useState<Reading[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [lastAdvisory, setLastAdvisory] = useState<Advisory | null>(null);
  const [ponds, setPonds] = useState<PondOption[]>([]);
  const [selectedPondId, setSelectedPondId] = useState(route.params?.pondId || '');
  const [isLoadingPonds, setIsLoadingPonds] = useState(true);
  const [pondSelectorVisible, setPondSelectorVisible] = useState(false);
  const [unreadNotificationCount, setUnreadNotificationCount] = useState(0);
  const speciesLookupRef = React.useRef<Record<string, any>>({});

  const selectedPond = ponds.find((pond) => pond.id === selectedPondId);

  // Load species lookup once on mount (non-blocking — ponds load independently)
  useEffect(() => {
    fetchSpeciesLookup()
      .then((lookup) => { speciesLookupRef.current = lookup; })
      .catch(() => {}); // silent — species labels are cosmetic
  }, []);
  const loadNotificationCount = useCallback(async () => {
    const count = await getUnreadNotificationCount();
    setUnreadNotificationCount(count);
  }, []);

  const loadPonds = useCallback(async () => {
    try {
      setIsLoadingPonds(true);
      const pondRecords = await database.collections.get<Pond>('ponds').query().fetch();
      const speciesLookup = speciesLookupRef.current;

      const options = pondRecords
        .map((pond) => {
          const species = pond.speciesId ? speciesLookup[pond.speciesId] : null;
          const status = String(pond.status || '').toUpperCase();
          const speciesLabel = species?.label || 'Species not added';
          return {
            id: pond.id,
            name: pond.name,
            subtitle: `${speciesLabel} • ${status}`,
          };
        })
        .sort((a, b) => a.name.localeCompare(b.name));

      setPonds(options);

      setSelectedPondId((prevId: string) => {
        if (options.length > 0) {
          const hasSelected = options.some((pond) => pond.id === prevId);
          if (!prevId || !hasSelected) {
            return route.params?.pondId && options.some((pond) => pond.id === route.params?.pondId)
              ? route.params.pondId
              : options[0].id;
          }
          return prevId;
        }
        return '';
      });
    } catch (error) {
      console.error('Failed to load ponds for water quality', error);
    } finally {
      setIsLoadingPonds(false);
    }
  }, [route.params?.pondId]);

  const loadHistory = useCallback(async () => {
    if (!selectedPondId) {
      setHistory([]);
      setIsLoadingHistory(false);
      setRefreshing(false);
      return;
    }

    try {
      setIsLoadingHistory(true);
      const logs = await database.collections
        .get<WaterQualityLog>('water_quality_logs')
        .query(
          Q.where('pond_id', selectedPondId),
          Q.sortBy('timestamp', Q.desc)
        )
        .fetch();

      const pondMap = new Map(ponds.map((pond) => [pond.id, pond.name]));

      setHistory(
        logs.map((log) => ({
          id: log.id,
          pond_id: log.pondId,
          pond_name: pondMap.get(log.pondId) || 'Unknown Pond',
          temperature: log.temperature,
          dissolved_oxygen: log.dissolvedOxygen,
          ph: log.ph,
          salinity: log.salinity,
          ammonia: log.ammonia,
          recorded_at: new Date(log.timestamp).toISOString(),
        }))
      );
    } catch (err) {
      console.error('Failed to load pond-linked water quality history', err);
    } finally {
      setIsLoadingHistory(false);
      setRefreshing(false);
    }
  }, [ponds, selectedPondId]);

  useFocusEffect(
    useCallback(() => {
      loadPonds();
      loadNotificationCount();
    }, [loadNotificationCount, loadPonds])
  );

  useEffect(() => {
    if (activeTab === 'history') {
      loadHistory();
    }
  }, [activeTab, selectedPondId, loadHistory]);

  useEffect(() => {
    if (route.params?.initialTab) {
      setActiveTab(route.params.initialTab);
    }
    if (route.params?.pondId) {
      setSelectedPondId(route.params.pondId);
    }
  }, [route.params?.initialTab, route.params?.pondId]);

  const saveReading = async () => {
    if (!selectedPondId) {
      Alert.alert('Add a pond first', 'Create a pond before logging water quality.');
      return;
    }

    if (!temperature && !dissolvedOxygen && !ph && !salinity && !ammonia) {
      Alert.alert('No Data', 'Please enter at least one measurement.');
      return;
    }

    setIsSaving(true);
    try {
      const payload: any = {};
      if (temperature) payload.temperature = parseFloat(temperature);
      if (dissolvedOxygen) payload.dissolvedOxygen = parseFloat(dissolvedOxygen);
      if (ph) payload.ph = parseFloat(ph);
      if (salinity) payload.salinity = parseFloat(salinity);
      if (ammonia) payload.ammonia = parseFloat(ammonia);

      const advisory = evaluatePondHealth({
        temperature: payload.temperature,
        dissolved_oxygen: payload.dissolvedOxygen,
        ph: payload.ph,
        ammonia: payload.ammonia,
      });

      const alerts = advisory.level === 'good'
        ? []
        : [{
          parameter: 'overall',
          severity: advisory.level === 'critical' ? 'CRITICAL' : 'WARNING',
          message: notes.trim() ? `${advisory.message} Note: ${notes.trim()}` : advisory.message,
          recommendedAction: advisory.action,
        }];

      await database.write(async () => {
        await database.collections.get<WaterQualityLog>('water_quality_logs').create((log) => {
          const id = uuidv4();
          log._raw.id = id;
          log.logId = id;
          log.pondId = selectedPondId;
          log.timestamp = Date.now();
          log.temperature = payload.temperature ?? undefined;
          log.dissolvedOxygen = payload.dissolvedOxygen ?? undefined;
          log.ph = payload.ph ?? undefined;
          log.salinity = payload.salinity ?? undefined;
          log.ammonia = payload.ammonia ?? undefined;
          log.alerts = JSON.stringify(alerts);
          log.localSyncStatus = 'NEW';
        });
      });

      setLastAdvisory(advisory);
      setTemperature('');
      setDissolvedOxygen('');
      setPh('');
      setSalinity('');
      setAmmonia('');
      setNotes('');
      setActiveTab('history');
      await loadHistory();
      await loadNotificationCount();
    } catch (err: any) {
      Alert.alert('Error', err?.message || 'Could not save this pond reading.');
    } finally {
      setIsSaving(false);
    }
  };

  const renderNotificationButton = () => (
    <TouchableOpacity style={styles.notificationButton} onPress={() => navigation.navigate('Notifications')}>
      <Ionicons name="notifications" size={20} color={theme.colors.textPrimary} />
      {unreadNotificationCount > 0 ? (
        <View style={styles.notificationBadge}>
          <Text style={styles.notificationBadgeText}>
            {unreadNotificationCount > 9 ? '9+' : unreadNotificationCount}
          </Text>
        </View>
      ) : null}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate('Main', { screen: 'Home' })}>
          <Ionicons name="arrow-back" size={22} color={theme.colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('waterQuality.title') || 'Water Quality'}</Text>
        {renderNotificationButton()}
      </View>

      <View style={styles.tabRow}>
        {['log', 'history'].map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tabButton, activeTab === tab && styles.tabButtonActive]}
            onPress={() => setActiveTab(tab as 'log' | 'history')}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
              {tab === 'log' ? 'Add Reading' : 'History'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {lastAdvisory && (
        <View style={styles.alertBanner}>
          <Ionicons name="warning" size={16} color={theme.colors.accent} />
          <View style={{ flex: 1 }}>
            <Text style={styles.alertTitle}>{lastAdvisory.title}</Text>
            <Text style={styles.alertText}>{lastAdvisory.message}</Text>
          </View>
        </View>
      )}

      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={
          activeTab === 'history'
            ? <RefreshControl
                refreshing={refreshing}
                onRefresh={() => {
                  setRefreshing(true);
                  loadHistory();
                  loadNotificationCount();
                }}
                colors={[theme.colors.primary]}
                tintColor={theme.colors.primary}
              />
            : undefined
        }
      >
        {isLoadingPonds ? (
          <View style={styles.center}>
            <ActivityIndicator color={theme.colors.primary} />
          </View>
        ) : ponds.length === 0 ? (
          <View style={styles.emptyCard}>
            <Ionicons name="water-outline" size={36} color={theme.colors.primary} />
            <Text style={styles.emptyTitle}>Add a pond before logging water quality</Text>
            <Text style={styles.emptyText}>
              Water quality is now tracked pond by pond, so each reading can be tied to the right harvest and alerts.
            </Text>
            <TouchableOpacity style={styles.primaryButton} onPress={() => navigation.navigate('AddEditPond')}>
              <Text style={styles.primaryButtonText}>Add Pond</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            <TouchableOpacity style={styles.pondSelector} onPress={() => setPondSelectorVisible(true)}>
              <View style={styles.pondSelectorCopy}>
                <Text style={styles.fieldLabel}>Selected Pond</Text>
                <Text style={styles.pondSelectorTitle}>{selectedPond?.name || 'Choose pond'}</Text>
                <Text style={styles.pondSelectorMeta}>{selectedPond?.subtitle || 'Pick the pond for this reading'}</Text>
              </View>
              <Ionicons name="chevron-down" size={18} color={theme.colors.textMuted} />
            </TouchableOpacity>

            {activeTab === 'log' ? (
              <>
                <Text style={styles.sectionTitle}>New Measurement</Text>
                <View style={styles.formGrid}>
                  <Field label="Temperature (°C)" value={temperature} onChangeText={setTemperature} theme={theme} styles={styles} />
                  <Field label="Dissolved Oxygen (mg/L)" value={dissolvedOxygen} onChangeText={setDissolvedOxygen} theme={theme} styles={styles} />
                  <Field label="pH Level" value={ph} onChangeText={setPh} theme={theme} styles={styles} />
                  <Field label="Salinity (ppt)" value={salinity} onChangeText={setSalinity} theme={theme} styles={styles} />
                  <Field label="Ammonia (NH3-N mg/L)" value={ammonia} onChangeText={setAmmonia} theme={theme} styles={styles} full />
                  <View style={styles.fullField}>
                    <Text style={styles.fieldLabel}>Field Notes</Text>
                    <TextInput
                      style={styles.notesInput}
                      value={notes}
                      onChangeText={setNotes}
                      multiline
                      placeholder="Optional note about water color, feed, smell, or pond condition..."
                      placeholderTextColor={theme.colors.textMuted}
                    />
                  </View>
                </View>
                <TouchableOpacity style={styles.saveButton} onPress={saveReading} disabled={isSaving}>
                  {isSaving ? <ActivityIndicator color={theme.colors.textInverse} /> : <Text style={styles.saveButtonText}>Save Pond Reading</Text>}
                </TouchableOpacity>
              </>
            ) : (
              <>
                {isLoadingHistory && !refreshing ? (
                  <View style={styles.center}>
                    <ActivityIndicator color={theme.colors.primary} />
                  </View>
                ) : history.length === 0 ? (
                  <View style={styles.emptyCard}>
                    <Ionicons name="analytics-outline" size={34} color={theme.colors.primary} />
                    <Text style={styles.emptyTitle}>No readings for this pond yet</Text>
                    <Text style={styles.emptyText}>Add the first pond-specific reading to unlock trend analysis and alerts.</Text>
                  </View>
                ) : (
                  <>
                    <Text style={styles.sectionTitle}>Trend Analysis</Text>
                    <View style={styles.chartCard}>
                      <WaterQualityChart
                        readings={history.map((r) => ({
                          timestamp: new Date(r.recorded_at).getTime(),
                          temperature: r.temperature,
                          dissolved_oxygen: r.dissolved_oxygen,
                          ph: r.ph,
                          ammonia: r.ammonia,
                        }))}
                      />
                    </View>

                    <Text style={styles.sectionTitle}>Recent Readings</Text>
                    {history.map((item) => {
                      const status = statusFor(item);
                      return (
                        <View key={item.id} style={styles.historyCard}>
                          <View style={styles.historyTop}>
                            <View>
                              <Text style={styles.historyDate}>{formatDate(item.recorded_at)}</Text>
                              <Text style={styles.historyPondName}>{item.pond_name}</Text>
                            </View>
                            <Text style={[
                              styles.statusBadge,
                              status === 'alert'
                                ? styles.statusAlert
                                : status === 'warning'
                                  ? styles.statusWarning
                                  : styles.statusNormal,
                            ]}>
                              {status.toUpperCase()}
                            </Text>
                          </View>
                          <Text style={styles.historyMetrics}>
                            Temp {item.temperature ?? '-'}°C   pH {item.ph ?? '-'}   DO {item.dissolved_oxygen ?? '-'}
                          </Text>
                        </View>
                      );
                    })}
                  </>
                )}
              </>
            )}
          </>
        )}
      </ScrollView>

      <Modal visible={pondSelectorVisible} transparent animationType="slide" onRequestClose={() => setPondSelectorVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Choose Pond</Text>
            <FlatList
              data={ponds}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[styles.modalItem, item.id === selectedPondId && styles.modalItemSelected]}
                  onPress={() => {
                    setSelectedPondId(item.id);
                    setPondSelectorVisible(false);
                  }}
                >
                  <Text style={styles.modalItemTitle}>{item.name}</Text>
                  <Text style={styles.modalItemMeta}>{item.subtitle}</Text>
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity style={styles.modalCloseButton} onPress={() => setPondSelectorVisible(false)}>
              <Text style={styles.modalCloseText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

function Field({ label, value, onChangeText, theme, styles, full }: any) {
  return (
    <View style={[styles.fieldWrap, full && styles.fullField]}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <TextInput
        style={styles.fieldInput}
        value={value}
        onChangeText={onChangeText}
        keyboardType="decimal-pad"
        placeholderTextColor={theme.colors.textMuted}
      />
    </View>
  );
}

const getStyles = (theme: any) => StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  headerTitle: {
    color: theme.colors.textPrimary,
    fontSize: 22,
    fontWeight: '800',
  },
  notificationButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.surfaceAlt,
  },
  notificationBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: theme.colors.error,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  notificationBadgeText: {
    color: theme.colors.textInverse,
    fontSize: 10,
    fontWeight: '800',
  },
  tabRow: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    paddingBottom: 12,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabButtonActive: {
    borderBottomColor: theme.colors.primary,
  },
  tabText: {
    color: theme.colors.textMuted,
    fontWeight: '700',
  },
  tabTextActive: {
    color: theme.colors.textPrimary,
  },
  alertBanner: {
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 14,
    backgroundColor: theme.colors.accentSoft,
    borderWidth: 1,
    borderColor: theme.colors.accent,
    flexDirection: 'row',
    gap: 10,
    padding: 14,
  },
  alertTitle: {
    color: theme.colors.textPrimary,
    fontWeight: '800',
  },
  alertText: {
    color: theme.colors.textSecondary,
    marginTop: 4,
    fontSize: 12,
    lineHeight: 18,
  },
  content: {
    paddingHorizontal: 16,
    paddingBottom: 120,
  },
  pondSelector: {
    borderRadius: 18,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 18,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  pondSelectorCopy: {
    flex: 1,
  },
  pondSelectorTitle: {
    color: theme.colors.textPrimary,
    fontSize: 16,
    fontWeight: '800',
  },
  pondSelectorMeta: {
    color: theme.colors.textSecondary,
    fontSize: 12,
    marginTop: 4,
  },
  sectionTitle: {
    ...theme.typography.h3,
    marginBottom: 12,
  },
  formGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  fieldWrap: {
    width: '48%',
    marginBottom: 2,
  },
  fullField: {
    width: '100%',
  },
  fieldLabel: {
    color: theme.colors.textSecondary,
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 8,
  },
  fieldInput: {
    minHeight: 52,
    borderRadius: 14,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    paddingHorizontal: 14,
    color: theme.colors.textPrimary,
  },
  notesInput: {
    minHeight: 96,
    borderRadius: 14,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: theme.colors.textPrimary,
    textAlignVertical: 'top',
  },
  saveButton: {
    marginTop: 18,
    height: 54,
    borderRadius: 18,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButtonText: {
    color: theme.colors.textInverse,
    fontWeight: '800',
    fontSize: 16,
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 36,
  },
  chartCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    paddingVertical: 14,
    paddingHorizontal: 8,
    marginBottom: 18,
  },
  historyCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: 14,
    marginBottom: 12,
  },
  historyTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  historyDate: {
    color: theme.colors.textMuted,
    fontSize: 12,
    fontWeight: '700',
  },
  historyPondName: {
    color: theme.colors.textPrimary,
    fontSize: 14,
    fontWeight: '700',
    marginTop: 4,
  },
  statusBadge: {
    fontSize: 11,
    fontWeight: '800',
  },
  statusNormal: {
    color: theme.colors.success,
  },
  statusWarning: {
    color: theme.colors.accent,
  },
  statusAlert: {
    color: theme.colors.error,
  },
  historyMetrics: {
    marginTop: 10,
    color: theme.colors.textPrimary,
    fontWeight: '700',
  },
  emptyCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: 20,
    alignItems: 'center',
  },
  emptyTitle: {
    color: theme.colors.textPrimary,
    fontSize: 18,
    fontWeight: '800',
    textAlign: 'center',
    marginTop: 12,
  },
  emptyText: {
    color: theme.colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    marginTop: 8,
  },
  primaryButton: {
    marginTop: 16,
    backgroundColor: theme.colors.primary,
    borderRadius: 16,
    paddingHorizontal: 18,
    paddingVertical: 12,
  },
  primaryButtonText: {
    color: theme.colors.textInverse,
    fontWeight: '800',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
  modalCard: {
    backgroundColor: theme.colors.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    maxHeight: '70%',
  },
  modalTitle: {
    color: theme.colors.textPrimary,
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 14,
  },
  modalItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  modalItemSelected: {
    backgroundColor: theme.colors.primaryLight,
    borderRadius: 16,
    paddingHorizontal: 10,
  },
  modalItemTitle: {
    color: theme.colors.textPrimary,
    fontWeight: '700',
    fontSize: 15,
  },
  modalItemMeta: {
    color: theme.colors.textMuted,
    marginTop: 4,
  },
  modalCloseButton: {
    marginTop: 14,
    height: 50,
    borderRadius: 14,
    backgroundColor: theme.colors.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalCloseText: {
    color: theme.colors.textPrimary,
    fontWeight: '800',
  },
});
