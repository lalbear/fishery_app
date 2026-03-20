import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, TextInput, Alert,
  ActivityIndicator, RefreshControl,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { waterQualityService } from '../services/apiService';
import { useTheme } from '../ThemeContext';
import WaterQualityChart from '../components/WaterQualityChart';
import { evaluatePondHealth, Advisory } from '../utils/pondAdvisory';

interface Reading {
  id: string;
  temperature?: number;
  dissolved_oxygen?: number;
  ph?: number;
  salinity?: number;
  ammonia?: number;
  notes?: string;
  recorded_at: string;
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

export default function WaterQualityScreen() {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const navigation = useNavigation<any>();

  const [activeTab, setActiveTab] = useState<'log' | 'history'>('log');
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

  const loadHistory = useCallback(async () => {
    try {
      setIsLoadingHistory(true);
      const res = await waterQualityService.getReadings();
      if (res.success && res.data) setHistory(res.data);
    } catch (err) {
      console.error('Failed to load water quality history', err);
    } finally {
      setIsLoadingHistory(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    if (activeTab === 'history') loadHistory();
  }, [activeTab, loadHistory]);

  const saveReading = async () => {
    if (!temperature && !dissolvedOxygen && !ph && !salinity) {
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
      if (notes) payload.notes = notes.trim();

      const res = await waterQualityService.saveReading(payload);
      if (res.success) {
        const advisory = evaluatePondHealth({
          temperature: payload.temperature,
          dissolved_oxygen: payload.dissolvedOxygen,
          ph: payload.ph,
          ammonia: payload.ammonia,
        });
        setLastAdvisory(advisory);
        setTemperature('');
        setDissolvedOxygen('');
        setPh('');
        setSalinity('');
        setAmmonia('');
        setNotes('');
        setActiveTab('history');
      } else {
        Alert.alert('Failed', 'Could not save reading. Please try again.');
      }
    } catch (err: any) {
      const msg = err?.response?.data?.message || 'Connection error. Please check your network.';
      Alert.alert('Error', msg);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate('Main', { screen: 'Home' })}>
          <Ionicons name="arrow-back" size={22} color={theme.colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('waterQuality.title') || 'Water Quality'}</Text>
        <TouchableOpacity>
          <Ionicons name="notifications" size={20} color={theme.colors.textPrimary} />
        </TouchableOpacity>
      </View>

      <View style={styles.tabRow}>
        {['log', 'history'].map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tabButton, activeTab === tab && styles.tabButtonActive]}
            onPress={() => setActiveTab(tab as any)}
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

      {activeTab === 'log' ? (
        <ScrollView contentContainerStyle={styles.content}>
          <Text style={styles.sectionTitle}>New Measurement</Text>
          <View style={styles.formGrid}>
            <Field label="Temperature (°C)" value={temperature} onChangeText={setTemperature} theme={theme} styles={styles} />
            <Field label="Dissolved Oxygen (mg/L)" value={dissolvedOxygen} onChangeText={setDissolvedOxygen} theme={theme} styles={styles} />
            <Field label="pH Level" value={ph} onChangeText={setPh} theme={theme} styles={styles} />
            <Field label="Salinity (ppt)" value={salinity} onChangeText={setSalinity} theme={theme} styles={styles} />
            <Field label="Ammonia (NH3-N mg/L)" value={ammonia} onChangeText={setAmmonia} theme={theme} styles={styles} full />
            <View style={styles.fullField}>
              <Text style={styles.fieldLabel}>Notes</Text>
              <TextInput
                style={styles.notesInput}
                value={notes}
                onChangeText={setNotes}
                multiline
                placeholder="e.g. Water looks slightly cloudy today..."
                placeholderTextColor={theme.colors.textMuted}
              />
            </View>
          </View>
          <TouchableOpacity style={styles.saveButton} onPress={saveReading} disabled={isSaving}>
            {isSaving ? <ActivityIndicator color={theme.colors.textInverse} /> : <Text style={styles.saveButtonText}>Save Reading</Text>}
          </TouchableOpacity>
        </ScrollView>
      ) : (
        <ScrollView
          contentContainerStyle={styles.content}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); loadHistory(); }} colors={[theme.colors.primary]} tintColor={theme.colors.primary} />}
        >
          {isLoadingHistory && !refreshing ? (
            <View style={styles.center}>
              <ActivityIndicator color={theme.colors.primary} />
            </View>
          ) : (
            <>
              <Text style={styles.sectionTitle}>Trend Analysis</Text>
              <View style={styles.chartCard}>
                <WaterQualityChart
                  readings={history.map(r => ({
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
                      <Text style={styles.historyDate}>{formatDate(item.recorded_at)}</Text>
                      <Text style={[styles.statusBadge, status === 'alert' ? styles.statusAlert : status === 'warning' ? styles.statusWarning : styles.statusNormal]}>
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
        </ScrollView>
      )}
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
});
