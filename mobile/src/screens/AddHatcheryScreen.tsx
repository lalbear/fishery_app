/**
 * AddHatcheryScreen
 * Create a new hatchery record for the operator.
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../ThemeContext';
import ScreenHeader from '../components/ScreenHeader';
import api from '../services/apiService';
import LocationCascadePicker, { LocationSelection } from '../components/LocationCascadePicker';
import { loadProfile } from './PersonalInfoScreen';

export default function AddHatcheryScreen() {
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const navigation = useNavigation<any>();

  const [name, setName] = useState('');
  const [hatcheryStateCode, setHatcheryStateCode] = useState('BR');
  const [hatcheryLocation, setHatcheryLocation] = useState<Partial<LocationSelection>>({});
  const [capacityKg, setCapacityKg] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const prefillLocation = async () => {
      try {
        const profile = await loadProfile();
        if (profile.stateCode) setHatcheryStateCode(profile.stateCode);
        if (profile.panchayatCode) {
          setHatcheryLocation({
            districtCode: profile.districtCode,
            districtName: profile.districtName,
            blockCode: profile.blockCode,
            blockName: profile.blockName,
            panchayatCode: profile.panchayatCode,
            panchayatName: profile.panchayatName,
          });
        }
      } catch {}
    };
    void prefillLocation();
  }, []);

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert('Required', 'Please enter the hatchery name.');
      return;
    }

    setSaving(true);
    try {
      await api.post('/api/v1/hatcheries', {
        name: name.trim(),
        district: hatcheryLocation.districtName || undefined,
        block: hatcheryLocation.blockName || undefined,
        panchayat: hatcheryLocation.panchayatName || undefined,
        capacity_kg: capacityKg ? parseFloat(capacityKg) : undefined,
      });

      navigation.replace('HatcheryDashboard');
    } catch (e: any) {
      Alert.alert('Error', e?.response?.data?.error ?? 'Failed to create hatchery.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScreenHeader title="Create Hatchery" onBack={() => navigation.goBack()} />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Hatchery Details</Text>

            <FormField label="Hatchery Name *" value={name} onChangeText={setName} placeholder="e.g. Sri Gopal Fish Hatchery" icon="business-outline" theme={theme} />
            <Text style={{ fontSize: 11, fontWeight: '700', color: theme.colors.textSecondary, marginTop: 4, marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.5 }}>
              Hatchery Location
            </Text>
            <LocationCascadePicker
              stateCode={hatcheryStateCode}
              value={hatcheryLocation}
              onChange={setHatcheryLocation}
            />
            <FormField label="Capacity (kg/year)" value={capacityKg} onChangeText={setCapacityKg} placeholder="e.g. 5000" icon="scale-outline" keyboardType="decimal-pad" theme={theme} />
          </View>

          <TouchableOpacity
            style={[styles.saveBtn, saving && { opacity: 0.7 }]}
            onPress={() => void handleSave()}
            disabled={saving}
          >
            {saving ? (
              <ActivityIndicator color={theme.colors.textInverse} />
            ) : (
              <>
                <Ionicons name="add-circle-outline" size={20} color={theme.colors.textInverse} />
                <Text style={styles.saveBtnText}>Create Hatchery</Text>
              </>
            )}
          </TouchableOpacity>

          <View style={{ height: 32 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function FormField({ label, icon, theme, ...props }: any) {
  const c = theme.colors;
  return (
    <View style={{ marginBottom: 12 }}>
      <Text style={{ fontSize: 11, fontWeight: '700', color: c.textSecondary, marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.5 }}>
        {label}
      </Text>
      <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: c.surfaceLow ?? c.background, borderWidth: 1, borderColor: c.border, borderRadius: 14, paddingHorizontal: 12, minHeight: 48, gap: 10 }}>
        <Ionicons name={icon} size={18} color={c.textMuted} />
        <TextInput
          style={{ flex: 1, color: c.textPrimary, fontSize: 15, paddingVertical: 10 }}
          placeholderTextColor={c.textMuted}
          selectionColor={c.primary}
          {...props}
        />
      </View>
    </View>
  );
}

const getStyles = (theme: any) => {
  const c = theme.colors;
  return StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: c.background },
    scroll: { padding: 16 },
    section: {
      backgroundColor: c.surface,
      borderRadius: theme.borderRadius?.lg ?? 16,
      borderWidth: 1,
      borderColor: c.border,
      padding: 16,
      marginBottom: 16,
    },
    sectionTitle: { fontSize: 14, fontWeight: '800', color: c.textPrimary, marginBottom: 14 },
    saveBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: c.primary,
      borderRadius: 18,
      paddingVertical: 16,
      gap: 10,
    },
    saveBtnText: { color: c.textInverse, fontSize: 16, fontWeight: '800' },
  });
};
