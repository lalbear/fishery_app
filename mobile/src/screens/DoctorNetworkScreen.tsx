import React, { useEffect, useMemo, useState, useCallback } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Image,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../ThemeContext';
import ScreenHeader from '../components/ScreenHeader';
import { diseaseService, doctorNetworkService } from '../services/apiService';
import { loadProfile, isProfileLocationComplete, UserProfile } from './PersonalInfoScreen';
import database, { Pond } from '../database';
import { Q } from '@nozbe/watermelondb';

const symptomHints = ['fish gasping', 'white spots', 'red lesions', 'sudden deaths'];

export default function DoctorNetworkScreen() {
  const navigation = useNavigation<any>();
  const { theme } = useTheme();
  const styles = getStyles(theme);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [routingDoctor, setRoutingDoctor] = useState(false);

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [assignedDoctor, setAssignedDoctor] = useState<any | null>(null);
  const [noDocMsg, setNoDocMsg] = useState('');

  const [ponds, setPonds] = useState<Pond[]>([]);
  const [selectedPondId, setSelectedPondId] = useState<string>('');
  const [pondPickerVisible, setPondPickerVisible] = useState(false);

  const [symptoms, setSymptoms] = useState('');
  const [issueDescription, setIssueDescription] = useState('');
  const [photoUri, setPhotoUri] = useState('');
  const [sugg, setSugg] = useState<any>(null);

  useEffect(() => {
    void initialize();
  }, []);

  const initialize = async () => {
    setLoading(true);
    try {
      const p = await loadProfile();
      setProfile(p);

      if (!isProfileLocationComplete(p)) {
        Alert.alert(
          'Location Required',
          'Please complete your district, block, and panchayat details in your profile before booking a doctor.',
          [
            { text: 'Go to Profile', onPress: () => navigation.navigate('PersonalInfo') },
            { text: 'Later', style: 'cancel' },
          ]
        );
        return;
      }

      // Load ponds from local DB
      const pondRecords = await database.collections
        .get<Pond>('ponds')
        .query(Q.where('status', 'ACTIVE'))
        .fetch();
      setPonds(pondRecords);
      if (pondRecords.length === 1) setSelectedPondId(pondRecords[0].id);

      // Auto-route doctor by profile panchayat
      await resolveDoctor(p, pondRecords.length === 1 ? pondRecords[0] : null);
    } finally {
      setLoading(false);
    }
  };

  const resolveDoctor = useCallback(async (p: UserProfile, pond: Pond | null) => {
    // Use pond's panchayat if set, otherwise fall back to profile panchayat
    const panchayatCode =
      (pond?.panchayatCode) ||
      p.panchayatCode;

    if (!panchayatCode) {
      setAssignedDoctor(null);
      setNoDocMsg('No panchayat set. Please update your profile.');
      return;
    }

    setRoutingDoctor(true);
    try {
      const res = await doctorNetworkService.routeDoctor(panchayatCode);
      if (res.success && res.data) {
        setAssignedDoctor(res.data);
        setNoDocMsg('');
      } else {
        setAssignedDoctor(null);
        setNoDocMsg(res.message || 'No doctor assigned to your panchayat yet. Please contact your block fisheries officer.');
      }
    } catch {
      setAssignedDoctor(null);
      setNoDocMsg('Could not reach server. Please check your connection.');
    } finally {
      setRoutingDoctor(false);
    }
  }, []);

  const handlePondSelect = useCallback(async (pond: Pond) => {
    setSelectedPondId(pond.id);
    setPondPickerVisible(false);
    if (profile) {
      await resolveDoctor(profile, pond);
    }
  }, [profile, resolveDoctor]);

  const selectedPond = ponds.find((p) => p.id === selectedPondId) || null;

  const selectedSymptoms = useMemo(
    () => symptoms.split(',').map((s) => s.trim()).filter(Boolean),
    [symptoms]
  );

  const runSuggestion = async () => {
    if (selectedSymptoms.length === 0) {
      Alert.alert('Enter symptoms', 'Add at least one symptom to run disease suggestion.');
      return;
    }
    const res = await diseaseService.suggest({ symptoms: selectedSymptoms });
    if (res.success) setSugg(res.data);
  };

  const handlePickImage = async () => {
    const perm = await ImagePicker.requestCameraPermissionsAsync();
    if (!perm.granted) {
      Alert.alert('Permission needed', 'Camera access is required to take a photo.');
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.7,
    });
    if (!result.canceled && result.assets?.[0]?.uri) {
      setPhotoUri(result.assets[0].uri);
    }
  };

  const bookAppointment = async () => {
    if (!profile?.userId) {
      Alert.alert('Login required', 'Could not detect user profile. Please login again.');
      return;
    }
    if (!assignedDoctor) {
      Alert.alert('No doctor available', noDocMsg || 'No doctor is assigned to your panchayat.');
      return;
    }
    if (ponds.length > 1 && !selectedPondId) {
      Alert.alert('Select pond', 'Please select which pond this appointment is for.');
      return;
    }
    if (!issueDescription.trim()) {
      Alert.alert('Missing issue', 'Please describe the pond issue.');
      return;
    }

    setSubmitting(true);
    try {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);

      const suspected = sugg?.recommendations?.[0]?.id;
      const res = await doctorNetworkService.createAppointment({
        farmerId: profile.userId,
        doctorId: assignedDoctor.id,
        pondId: selectedPond?.pondId || undefined,
        issueDescription: issueDescription.trim(),
        suspectedDiseaseId: suspected || undefined,
        scheduledDate: tomorrow.toISOString(),
        consultationType: 'VISIT',
        emergencyFlag: sugg?.urgency === 'CRITICAL',
        photoUri: photoUri || undefined,
      });

      if (res.success) {
        Alert.alert(
          'Appointment Requested',
          `Dr. ${assignedDoctor.name} will visit${selectedPond ? ` for pond "${selectedPond.name}"` : ''}.\nFarmer pays ₹200, Govt pays ₹100.`
        );
        setIssueDescription('');
        setSugg(null);
        setPhotoUri('');
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
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">

          {/* Assigned Doctor Card */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Your Assigned Doctor</Text>
            {routingDoctor ? (
              <ActivityIndicator style={{ marginVertical: 12 }} color={theme.colors.primary} />
            ) : assignedDoctor ? (
              <View style={styles.doctorCard}>
                <View style={styles.doctorAvatarWrap}>
                  <Text style={styles.doctorAvatar}>
                    {assignedDoctor.name?.charAt(0)?.toUpperCase() || 'D'}
                  </Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.doctorName}>{assignedDoctor.name}</Text>
                  <Text style={styles.doctorMeta}>{assignedDoctor.phone}</Text>
                  <Text style={styles.doctorMeta}>
                    Area: {profile?.panchayatName || profile?.blockName || 'Your panchayat'}
                  </Text>
                </View>
              </View>
            ) : (
              <View style={styles.noDocCard}>
                <Text style={styles.noDocText}>{noDocMsg}</Text>
                {!isProfileLocationComplete(profile!) && (
                  <TouchableOpacity
                    style={styles.profileBtn}
                    onPress={() => navigation.navigate('PersonalInfo')}
                  >
                    <Text style={styles.profileBtnText}>Complete Profile</Text>
                  </TouchableOpacity>
                )}
              </View>
            )}
          </View>

          {/* Pond Selector */}
          {ponds.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Select Pond</Text>
              {ponds.length === 1 ? (
                <Text style={styles.helper}>{ponds[0].name} (auto-selected)</Text>
              ) : (
                <>
                  <TouchableOpacity
                    style={styles.pondSelector}
                    onPress={() => setPondPickerVisible(true)}
                  >
                    <Text style={[styles.pondSelectorText, { color: selectedPond ? theme.colors.textPrimary : theme.colors.textMuted }]}>
                      {selectedPond ? selectedPond.name : 'Select a pond...'}
                    </Text>
                    <Text style={{ color: theme.colors.textMuted, fontSize: 20 }}>›</Text>
                  </TouchableOpacity>
                  {selectedPond?.panchayatName ? (
                    <Text style={styles.helper}>
                      Pond panchayat: {selectedPond.panchayatName}
                    </Text>
                  ) : null}
                </>
              )}
            </View>
          )}

          {/* Symptom Triage */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Symptom Triage</Text>
            <Text style={styles.helper}>Example: {symptomHints.join(', ')}</Text>
            <TextInput
              style={styles.input}
              value={symptoms}
              onChangeText={setSymptoms}
              placeholder="white spots, fish gasping, lethargy"
              placeholderTextColor={theme.colors.textMuted}
            />
            <TouchableOpacity style={styles.actionBtn} onPress={runSuggestion}>
              <Text style={styles.actionBtnText}>Suggest Disease Risk</Text>
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

          {/* Photo */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Attach Photo (Optional)</Text>
            <Text style={styles.helper}>Take a clear picture of the affected fish or pond.</Text>
            {photoUri ? (
              <View style={styles.photoPreviewWrap}>
                <Image source={{ uri: photoUri }} style={styles.photoPreview} />
                <TouchableOpacity style={styles.photoRetakeBtn} onPress={handlePickImage}>
                  <Text style={styles.photoRetakeText}>Retake</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity style={styles.photoBtn} onPress={handlePickImage}>
                <Text style={styles.photoBtnText}>📷 Take Photo</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Booking */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Book Appointment</Text>
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
            <TouchableOpacity
              style={[styles.bookBtn, !assignedDoctor && styles.bookBtnDisabled]}
              disabled={submitting || !assignedDoctor}
              onPress={bookAppointment}
            >
              <Text style={styles.bookBtnText}>
                {submitting ? 'Booking...' : assignedDoctor ? `Book Dr. ${assignedDoctor.name}` : 'No Doctor Available'}
              </Text>
            </TouchableOpacity>
          </View>

        </ScrollView>
      )}

      {/* Pond Picker Modal */}
      <Modal
        visible={pondPickerVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setPondPickerVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalSheet, { backgroundColor: theme.colors.background }]}>
            <View style={[styles.modalHeader, { borderBottomColor: theme.colors.border }]}>
              <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>Select Pond</Text>
              <TouchableOpacity onPress={() => setPondPickerVisible(false)}>
                <Text style={{ color: theme.colors.primary, fontWeight: '700' }}>Done</Text>
              </TouchableOpacity>
            </View>
            <FlatList
              data={ponds}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[styles.pondItem, { borderBottomColor: theme.colors.border }]}
                  onPress={() => handlePondSelect(item)}
                >
                  <Text style={[styles.pondItemName, { color: theme.colors.textPrimary }]}>{item.name}</Text>
                  {item.panchayatName ? (
                    <Text style={[styles.pondItemMeta, { color: theme.colors.textSecondary }]}>
                      {item.panchayatName}, {item.blockName}
                    </Text>
                  ) : (
                    <Text style={[styles.pondItemMeta, { color: theme.colors.textMuted }]}>
                      No panchayat set — will use profile location
                    </Text>
                  )}
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>
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
  sectionTitle: { color: theme.colors.textPrimary, fontSize: 16, fontWeight: '800', marginBottom: 8 },
  helper: { color: theme.colors.textSecondary, marginBottom: 8, lineHeight: 20, fontSize: 13 },
  // Doctor card
  doctorCard: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  doctorAvatarWrap: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  doctorAvatar: { color: theme.colors.textInverse, fontSize: 22, fontWeight: '800' },
  doctorName: { color: theme.colors.textPrimary, fontSize: 16, fontWeight: '800' },
  doctorMeta: { color: theme.colors.textSecondary, marginTop: 3, fontSize: 13 },
  noDocCard: { paddingVertical: 8 },
  noDocText: { color: theme.colors.textSecondary, lineHeight: 20 },
  profileBtn: {
    marginTop: 12,
    backgroundColor: theme.colors.primary,
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
  },
  profileBtnText: { color: theme.colors.textInverse, fontWeight: '800' },
  // Pond selector
  pondSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    backgroundColor: theme.colors.surfaceAlt,
  },
  pondSelectorText: { fontSize: 15, fontWeight: '600' },
  // Inputs
  input: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: theme.colors.textPrimary,
    backgroundColor: theme.colors.surfaceAlt,
    marginBottom: 10,
  },
  multiline: { minHeight: 90, textAlignVertical: 'top' },
  actionBtn: {
    backgroundColor: theme.colors.surfaceAlt,
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: 'center',
    marginBottom: 8,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  actionBtnText: { color: theme.colors.textPrimary, fontWeight: '800' },
  suggestionCard: {
    borderRadius: 12,
    backgroundColor: theme.colors.primaryLight,
    padding: 10,
  },
  suggestionTitle: { color: theme.colors.textPrimary, fontWeight: '800' },
  suggestionBody: { color: theme.colors.textSecondary, marginTop: 5, lineHeight: 19 },
  // Photo
  photoPreviewWrap: { borderRadius: 12, overflow: 'hidden', borderWidth: 1, borderColor: theme.colors.border },
  photoPreview: { width: '100%', height: 150, resizeMode: 'cover' },
  photoRetakeBtn: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  photoRetakeText: { color: '#fff', fontSize: 12, fontWeight: '700' },
  photoBtn: {
    backgroundColor: theme.colors.surfaceAlt,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderStyle: 'dashed',
  },
  photoBtnText: { color: theme.colors.textPrimary, fontWeight: '700' },
  // Booking
  paymentRow: { marginBottom: 8 },
  paymentText: { color: theme.colors.textSecondary, fontWeight: '700' },
  bookBtn: {
    borderRadius: 12,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    paddingVertical: 14,
  },
  bookBtnDisabled: { backgroundColor: theme.colors.border },
  bookBtnText: { color: theme.colors.textInverse, fontWeight: '800', fontSize: 15 },
  // Pond modal
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.45)', justifyContent: 'flex-end' },
  modalSheet: { borderTopLeftRadius: 20, borderTopRightRadius: 20, maxHeight: '60%', paddingBottom: 32 },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  pondItem: { paddingHorizontal: 18, paddingVertical: 14, borderBottomWidth: StyleSheet.hairlineWidth },
  pondItemName: { fontSize: 15, fontWeight: '700' },
  pondItemMeta: { fontSize: 13, marginTop: 3 },
});
