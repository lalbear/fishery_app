/**
 * Water Quality Screen — fully integrated with backend persistence
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, TextInput, Alert,
  ActivityIndicator, RefreshControl,
  KeyboardAvoidingView, Platform,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { waterQualityService } from '../services/apiService';

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
  const [activeTab, setActiveTab] = useState<'log' | 'history'>('log');

  // Form fields
  const [temperature, setTemperature] = useState('');
  const [dissolvedOxygen, setDissolvedOxygen] = useState('');
  const [ph, setPh] = useState('');
  const [salinity, setSalinity] = useState('');
  const [ammonia, setAmmonia] = useState('');
  const [notes, setNotes] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // History
  const [history, setHistory] = useState<Reading[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

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
        Alert.alert('Saved ✓', 'Water quality reading has been recorded.');
        setTemperature(''); setDissolvedOxygen(''); setPh('');
        setSalinity(''); setAmmonia(''); setNotes('');
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

  const onRefresh = () => { setRefreshing(true); loadHistory(); };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.header}>
        <Text style={styles.title}>{t('waterQuality.title') || 'Water Quality'}</Text>
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'log' && styles.tabActive]}
            onPress={() => setActiveTab('log')}
          >
            <Text style={[styles.tabText, activeTab === 'log' && styles.tabTextActive]}>
              {t('waterQuality.addReading') || 'Add Reading'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'history' && styles.tabActive]}
            onPress={() => setActiveTab('history')}
          >
            <Text style={[styles.tabText, activeTab === 'history' && styles.tabTextActive]}>
              {t('waterQuality.history') || 'History'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {activeTab === 'log' ? (
        <ScrollView style={styles.content}>
          <View style={styles.form}>
            <InputRow label={t('waterQuality.temperature') || 'Temperature (°C)'} icon="thermometer-outline"
              placeholder="28.5" value={temperature} onChangeText={setTemperature} />
            <InputRow label={t('waterQuality.dissolvedOxygen') || 'Dissolved Oxygen (mg/L)'} icon="water-outline"
              placeholder="6.0" value={dissolvedOxygen} onChangeText={setDissolvedOxygen} />
            <InputRow label={t('waterQuality.ph') || 'pH'} icon="flask-outline"
              placeholder="7.5" value={ph} onChangeText={setPh} />
            <InputRow label={t('waterQuality.salinity') || 'Salinity (ppt)'} icon="sunny-outline"
              placeholder="0.5" value={salinity} onChangeText={setSalinity} />
            <InputRow label="Ammonia (mg/L)" icon="alert-circle-outline"
              placeholder="0.05" value={ammonia} onChangeText={setAmmonia} />
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Notes (optional)</Text>
              <TextInput
                style={[styles.input, { height: 72, textAlignVertical: 'top' }]}
                placeholder="Any observations…"
                placeholderTextColor="#aaa"
                value={notes}
                onChangeText={setNotes}
                multiline
              />
            </View>
            <TouchableOpacity style={styles.saveButton} onPress={saveReading} disabled={isSaving} activeOpacity={0.8}>
              {isSaving
                ? <ActivityIndicator color="#fff" />
                : <><Ionicons name="save-outline" size={20} color="#fff" /><Text style={styles.saveButtonText}>{t('common.save') || 'Save Reading'}</Text></>
              }
            </TouchableOpacity>
          </View>
        </ScrollView>
      ) : (
        <ScrollView
          style={styles.content}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#2E7D32']} />}
        >
          {isLoadingHistory && !refreshing ? (
            <View style={{ padding: 40, alignItems: 'center' }}>
              <ActivityIndicator color="#2E7D32" />
              <Text style={{ marginTop: 10, color: '#666' }}>Loading history…</Text>
            </View>
          ) : history.length === 0 ? (
            <View style={{ padding: 40, alignItems: 'center' }}>
              <Ionicons name="water-outline" size={48} color="#ccc" />
              <Text style={{ marginTop: 12, color: '#999' }}>No readings yet. Add your first reading!</Text>
            </View>
          ) : (
            <View style={styles.history}>
              {history.map((item) => {
                const status = statusFor(item);
                return (
                  <View key={item.id} style={styles.historyItem}>
                    <View style={styles.historyHeader}>
                      <Text style={styles.historyDate}>{formatDate(item.recorded_at)}</Text>
                      <View style={[styles.statusBadge,
                      status === 'normal' ? styles.statusNormal
                        : status === 'warning' ? styles.statusWarning
                          : styles.statusAlert
                      ]}>
                        <Text style={styles.statusText}>
                          {status === 'normal' ? '✓ Normal' : status === 'warning' ? '⚠ Warning' : '🚨 Alert'}
                        </Text>
                      </View>
                    </View>
                    <View style={styles.historyParams}>
                      {item.temperature != null && <ParamChip label="Temp" value={`${item.temperature}°C`} />}
                      {item.dissolved_oxygen != null && <ParamChip label="DO" value={`${item.dissolved_oxygen} mg/L`} />}
                      {item.ph != null && <ParamChip label="pH" value={String(item.ph)} />}
                      {item.salinity != null && <ParamChip label="Sal" value={`${item.salinity} ppt`} />}
                      {item.ammonia != null && <ParamChip label="NH₃" value={`${item.ammonia} mg/L`} />}
                    </View>
                    {item.notes ? <Text style={styles.notesText}>📝 {item.notes}</Text> : null}
                  </View>
                );
              })}
            </View>
          )}
        </ScrollView>
      )}
    </KeyboardAvoidingView>
  );
}

function InputRow({ label, icon, placeholder, value, onChangeText }: {
  label: string; icon: any; placeholder: string; value: string; onChangeText: (t: string) => void;
}) {
  return (
    <View style={styles.inputGroup}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.inputContainer}>
        <Ionicons name={icon} size={20} color="#666" style={styles.inputIcon} />
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor="#aaa"
          keyboardType="decimal-pad"
          value={value}
          onChangeText={onChangeText}
        />
      </View>
    </View>
  );
}

function ParamChip({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.chip}>
      <Text style={styles.chipLabel}>{label}</Text>
      <Text style={styles.chipValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  header: { padding: 16, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', color: '#1B5E20' },
  tabContainer: { flexDirection: 'row', marginTop: 16, backgroundColor: '#f0f0f0', borderRadius: 8, padding: 4 },
  tab: { flex: 1, paddingVertical: 8, alignItems: 'center', borderRadius: 6 },
  tabActive: { backgroundColor: '#fff' },
  tabText: { color: '#666', fontWeight: '500' },
  tabTextActive: { color: '#2E7D32', fontWeight: '700' },
  content: { flex: 1, padding: 16 },
  form: { gap: 4 },
  inputGroup: { marginBottom: 12 },
  label: { fontSize: 14, fontWeight: '600', color: '#333', marginBottom: 6 },
  inputContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 8, borderWidth: 1, borderColor: '#ddd' },
  inputIcon: { padding: 12 },
  input: { flex: 1, paddingVertical: 12, paddingRight: 12, fontSize: 16, color: '#333' },
  saveButton: { backgroundColor: '#2E7D32', borderRadius: 8, padding: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 16 },
  saveButtonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  history: { gap: 12 },
  historyItem: { backgroundColor: '#fff', borderRadius: 12, padding: 16, elevation: 1 },
  historyHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  historyDate: { fontSize: 13, fontWeight: '600', color: '#333' },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 12 },
  statusNormal: { backgroundColor: '#E8F5E9' },
  statusWarning: { backgroundColor: '#FFF3E0' },
  statusAlert: { backgroundColor: '#FFEBEE' },
  statusText: { fontSize: 12, fontWeight: '500', color: '#333' },
  historyParams: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { backgroundColor: '#f5f5f5', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 5 },
  chipLabel: { fontSize: 10, color: '#999', textTransform: 'uppercase' },
  chipValue: { fontSize: 13, fontWeight: '600', color: '#333' },
  notesText: { marginTop: 8, fontSize: 13, color: '#666', fontStyle: 'italic' },
});