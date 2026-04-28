import React, { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../ThemeContext';
import ScreenHeader from '../components/ScreenHeader';
import { diseaseService, doctorNetworkService } from '../services/apiService';
import { loadProfile } from './PersonalInfoScreen';

const symptomHints = ['fish gasping', 'white spots', 'red lesions', 'sudden deaths'];

export default function DoctorNetworkScreen() {
  const navigation = useNavigation<any>();
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [farmerId, setFarmerId] = useState<string>('');
  const [doctors, setDoctors] = useState<any[]>([]);
  const [selectedDoctorId, setSelectedDoctorId] = useState<string>('');
  const [symptoms, setSymptoms] = useState<string>('');
  const [issueDescription, setIssueDescription] = useState<string>('');
  const [sugg, setSugg] = useState<any>(null);

  useEffect(() => {
    void initialize();
  }, []);

  const initialize = async () => {
    setLoading(true);
    try {
      const profile = await loadProfile();
      const userId = profile?.userId || '';
      setFarmerId(userId);

      const [doctorsRes] = await Promise.all([
        doctorNetworkService.listDoctors(),
      ]);
      if (doctorsRes.success) {
        const rows = doctorsRes.data || [];
        setDoctors(rows);
        if (rows.length > 0) setSelectedDoctorId(rows[0].id);
      }
    } finally {
      setLoading(false);
    }
  };

  const selectedSymptoms = useMemo(() => (
    symptoms
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean)
  ), [symptoms]);

  const runSuggestion = async () => {
    if (selectedSymptoms.length === 0) {
      Alert.alert('Enter symptoms', 'Add at least one symptom to run disease suggestion.');
      return;
    }
    const res = await diseaseService.suggest({ symptoms: selectedSymptoms });
    if (res.success) setSugg(res.data);
  };

  const bookAppointment = async () => {
    if (!farmerId) {
      Alert.alert('Login required', 'Could not detect user profile. Please login again.');
      return;
    }
    if (!selectedDoctorId) {
      Alert.alert('Select doctor', 'Choose a doctor before booking.');
      return;
    }
    if (!issueDescription.trim()) {
      Alert.alert('Missing issue', 'Please describe the issue in short.');
      return;
    }

    setSubmitting(true);
    try {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);

      const suspected = sugg?.recommendations?.[0]?.id;
      const res = await doctorNetworkService.createAppointment({
        farmerId,
        doctorId: selectedDoctorId,
        issueDescription: issueDescription.trim(),
        suspectedDiseaseId: suspected || undefined,
        scheduledDate: tomorrow.toISOString(),
        consultationType: 'VISIT',
        emergencyFlag: sugg?.urgency === 'CRITICAL',
      });

      if (res.success) {
        Alert.alert('Booked', `Appointment requested.\nFarmer pays ₹200, Govt pays ₹100.`);
      } else {
        Alert.alert('Failed', res.error || 'Could not book appointment.');
      }
    } catch (error: any) {
      Alert.alert('Error', error?.message || 'Could not book appointment.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScreenHeader title="Doctor Network" onBack={() => navigation.goBack()} />
      {loading ? (
        <View style={styles.center}><ActivityIndicator color={theme.colors.primary} /></View>
      ) : (
        <FlatList
          data={doctors}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.content}
          ListHeaderComponent={(
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Symptom triage</Text>
              <Text style={styles.helper}>Example: {symptomHints.join(', ')}</Text>
              <TextInput
                style={styles.input}
                value={symptoms}
                onChangeText={setSymptoms}
                placeholder="white spots, fish gasping, lethargy"
                placeholderTextColor={theme.colors.textMuted}
              />
              <TouchableOpacity style={styles.actionBtn} onPress={runSuggestion}>
                <Text style={styles.actionBtnText}>Suggest disease risk</Text>
              </TouchableOpacity>
              {sugg ? (
                <View style={styles.suggestionCard}>
                  <Text style={styles.suggestionTitle}>Urgency: {sugg.urgency}</Text>
                  <Text style={styles.suggestionBody}>{sugg.advisory}</Text>
                  <Text style={styles.suggestionBody}>
                    Top match: {sugg.recommendations?.[0]?.name || 'No strong match'}
                  </Text>
                </View>
              ) : null}
            </View>
          )}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[styles.docCard, selectedDoctorId === item.id && styles.docCardActive]}
              onPress={() => setSelectedDoctorId(item.id)}
            >
              <Text style={styles.docName}>{item.name}</Text>
              <Text style={styles.docMeta}>{item.phone}</Text>
              <Text style={styles.docMeta}>Panchayats: {(item.assigned_panchayats || []).join(', ') || '-'}</Text>
            </TouchableOpacity>
          )}
          ListFooterComponent={(
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Book appointment</Text>
              <TextInput
                style={[styles.input, styles.multiline]}
                value={issueDescription}
                onChangeText={setIssueDescription}
                multiline
                placeholder="Describe pond issue and mortality pattern..."
                placeholderTextColor={theme.colors.textMuted}
              />
              <View style={styles.paymentRow}>
                <Text style={styles.paymentText}>Total ₹300 = Farmer ₹200 + Govt ₹100</Text>
              </View>
              <TouchableOpacity style={styles.bookBtn} disabled={submitting} onPress={bookAppointment}>
                <Text style={styles.bookBtnText}>{submitting ? 'Booking...' : 'Book Doctor Visit'}</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      )}
    </SafeAreaView>
  );
}

const getStyles = (theme: any) => StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  content: { padding: 16, paddingBottom: 120 },
  section: {
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
  },
  sectionTitle: { color: theme.colors.textPrimary, fontSize: 16, fontWeight: '800' },
  helper: { color: theme.colors.textSecondary, marginTop: 6, marginBottom: 8, lineHeight: 20 },
  input: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: theme.colors.textPrimary,
    backgroundColor: theme.colors.surfaceAlt,
  },
  multiline: { minHeight: 90, textAlignVertical: 'top' },
  actionBtn: {
    marginTop: 10,
    backgroundColor: theme.colors.surfaceAlt,
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: 'center',
  },
  actionBtnText: { color: theme.colors.textPrimary, fontWeight: '800' },
  suggestionCard: {
    marginTop: 10,
    borderRadius: 12,
    backgroundColor: theme.colors.primaryLight,
    padding: 10,
  },
  suggestionTitle: { color: theme.colors.textPrimary, fontWeight: '800' },
  suggestionBody: { color: theme.colors.textSecondary, marginTop: 5, lineHeight: 19 },
  docCard: {
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
  },
  docCardActive: { borderColor: theme.colors.primary },
  docName: { color: theme.colors.textPrimary, fontSize: 16, fontWeight: '800' },
  docMeta: { color: theme.colors.textSecondary, marginTop: 5 },
  paymentRow: { marginTop: 10 },
  paymentText: { color: theme.colors.textSecondary, fontWeight: '700' },
  bookBtn: {
    marginTop: 12,
    borderRadius: 12,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    paddingVertical: 12,
  },
  bookBtnText: { color: theme.colors.textInverse, fontWeight: '800' },
});
