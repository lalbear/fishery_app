import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  FlatList,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../ThemeContext';
import { geoService, economicsService } from '../services/apiService';

export default function EconomicsScreen() {
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const { t } = useTranslation();
  const navigation = useNavigation<any>();

  const [landSize, setLandSize] = useState('');
  const [salinity, setSalinity] = useState('500');
  const [capital, setCapital] = useState('');
  const [riskTolerance, setRiskTolerance] = useState<'LOW' | 'MEDIUM' | 'HIGH'>('MEDIUM');
  const [farmerCategory, setFarmerCategory] = useState<'GENERAL' | 'WOMEN' | 'SC' | 'ST'>('GENERAL');
  const [stateCode, setStateCode] = useState('');
  const [districtCode, setDistrictCode] = useState('');
  const [preferredSpecies, setPreferredSpecies] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [zones, setZones] = useState<any[]>([]);
  const [activeModal, setActiveModal] = useState<'state' | 'district' | 'species' | null>(null);

  const SPECIES_OPTIONS = [
    { label: 'Auto Recommend', value: '' },
    { label: 'Vannamei Shrimp', value: 'Litopenaeus vannamei' },
    { label: 'Black Tiger Shrimp', value: 'Penaeus monodon' },
    { label: 'Pangasius', value: 'Pangasianodon hypophthalmus' },
    { label: 'Tilapia', value: 'Oreochromis niloticus' },
    { label: 'Rohu', value: 'Labeo rohita' },
  ];

  useEffect(() => {
    (async () => {
      try {
        const response = await geoService.getZones();
        if (response.success && response.data.length > 0) {
          setZones(response.data);
          const firstZone = response.data[0];
          setStateCode(firstZone.state_code);
          if (firstZone.district_codes?.length > 0) {
            setDistrictCode(firstZone.district_codes[0]);
          }
        }
      } catch (error) {
        console.error('Failed to fetch zones for economics', error);
      }
    })();
  }, []);

  const runSimulation = async () => {
    if (!landSize || !capital || !stateCode || !districtCode) {
      Alert.alert('Missing Information', 'Please fill in all required fields.');
      return;
    }

    setIsLoading(true);
    try {
      const landHectares = parseFloat(landSize) * 0.4047;
      const payload: any = {
        landSizeHectares: landHectares,
        waterSourceSalinityUsCm: parseFloat(salinity),
        availableCapitalInr: parseFloat(capital),
        riskTolerance,
        farmerCategory,
        stateCode,
        districtCode,
      };

      if (preferredSpecies) payload.preferredSpecies = [preferredSpecies];

      const result = await economicsService.simulate(payload);
      if (result.success) {
        navigation.navigate('EconomicsResult', { simulationData: result.data });
      } else {
        Alert.alert('Simulation Error', result.message || 'Failed to calculate ROI.');
      }
    } catch (error) {
      Alert.alert('Connection Failed', 'Could not reach simulation server.');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const statesList = zones.map(z => ({ label: z.zone_name, value: z.state_code }));
  const relevantDistricts = zones.find(z => z.state_code === stateCode)?.district_codes || [];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate('Main', { screen: 'Home' })}>
          <Ionicons name="arrow-back" size={22} color={theme.colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Economics Input</Text>
        <TouchableOpacity>
          <Ionicons name="help-circle-outline" size={22} color={theme.colors.textPrimary} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.stepText}>STEP 1 OF 3</Text>
        <View style={styles.heroRow}>
          <Text style={styles.heroTitle}>Farm Profile</Text>
          <Text style={styles.heroProgress}>33% Complete</Text>
        </View>
        <View style={styles.progressTrack}>
          <View style={styles.progressFill} />
        </View>

        <View style={styles.sectionCard}>
          <SectionTitle icon="location-outline" title="Location & Scale" theme={theme} styles={styles} />
          <View style={styles.row}>
            <PickerField label="State" value={statesList.find(s => s.value === stateCode)?.label || 'Select'} onPress={() => setActiveModal('state')} theme={theme} styles={styles} />
            <PickerField label="District" value={districtCode || 'Select'} onPress={() => setActiveModal('district')} theme={theme} styles={styles} />
          </View>
          <InputField label="Land Size (Acres)" value={landSize} onChangeText={setLandSize} suffix="Ac" theme={theme} styles={styles} />
        </View>

        <View style={styles.sectionCard}>
          <SectionTitle icon="water-outline" title="Operational Data" theme={theme} styles={styles} />
          <InputField label="Water Salinity (uS/cm)" value={salinity} onChangeText={setSalinity} suffix="uS" theme={theme} styles={styles} />

          <Text style={styles.fieldLabel}>Farmer Category</Text>
          <View style={styles.segmentRow}>
            {['GENERAL', 'WOMEN', 'SC', 'ST'].map((item) => (
              <TouchableOpacity
                key={item}
                style={[styles.segment, farmerCategory === item && styles.segmentActive]}
                onPress={() => setFarmerCategory(item as any)}
              >
                <Text style={[styles.segmentText, farmerCategory === item && styles.segmentTextActive]}>{item}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.sectionCard}>
          <SectionTitle icon="cash-outline" title="Financial Settings" theme={theme} styles={styles} />
          <InputField label="Initial Capital (INR)" value={capital} onChangeText={setCapital} prefix="Rs" theme={theme} styles={styles} />

          <Text style={styles.fieldLabel}>Risk Tolerance</Text>
          <View style={styles.sliderLabels}>
            {['LOW', 'MEDIUM', 'HIGH'].map((risk) => (
              <TouchableOpacity key={risk} onPress={() => setRiskTolerance(risk as any)} style={styles.riskOption}>
                <View style={[styles.riskDot, riskTolerance === risk && styles.riskDotActive]} />
                <Text style={[styles.riskText, riskTolerance === risk && styles.riskTextActive]}>{risk}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <PickerField
            label="Preferred Species"
            value={SPECIES_OPTIONS.find(item => item.value === preferredSpecies)?.label || 'Auto Recommend'}
            onPress={() => setActiveModal('species')}
            theme={theme}
            styles={styles}
          />
        </View>

        <TouchableOpacity style={styles.ctaButton} onPress={runSimulation} disabled={isLoading}>
          {isLoading ? <ActivityIndicator color={theme.colors.textInverse} /> : <Text style={styles.ctaText}>Calculate ROI</Text>}
        </TouchableOpacity>
      </ScrollView>

      <SelectionModal
        visible={activeModal === 'state'}
        title="Select State"
        data={statesList}
        onClose={() => setActiveModal(null)}
        onSelect={(item: any) => {
          setStateCode(item.value);
          setDistrictCode('');
          setActiveModal(null);
        }}
        theme={theme}
      />

      <SelectionModal
        visible={activeModal === 'district'}
        title="Select District"
        data={relevantDistricts.map((item: string) => ({ label: item, value: item }))}
        onClose={() => setActiveModal(null)}
        onSelect={(item: any) => {
          setDistrictCode(item.value);
          setActiveModal(null);
        }}
        theme={theme}
      />

      <SelectionModal
        visible={activeModal === 'species'}
        title="Select Species"
        data={SPECIES_OPTIONS}
        onClose={() => setActiveModal(null)}
        onSelect={(item: any) => {
          setPreferredSpecies(item.value);
          setActiveModal(null);
        }}
        theme={theme}
      />
    </SafeAreaView>
  );
}

function SectionTitle({ icon, title, theme, styles }: any) {
  return (
    <View style={styles.sectionTitleRow}>
      <Ionicons name={icon} size={18} color={theme.colors.primary} />
      <Text style={styles.sectionTitle}>{title}</Text>
    </View>
  );
}

function PickerField({ label, value, onPress, theme, styles }: any) {
  return (
    <View style={styles.halfField}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <TouchableOpacity style={styles.fieldBox} onPress={onPress}>
        <Text style={styles.fieldValue}>{value}</Text>
        <Ionicons name="chevron-down" size={18} color={theme.colors.textMuted} />
      </TouchableOpacity>
    </View>
  );
}

function InputField({ label, value, onChangeText, prefix, suffix, theme, styles }: any) {
  return (
    <View style={styles.fullField}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <View style={styles.fieldBox}>
        {prefix ? <Text style={styles.unitText}>{prefix}</Text> : null}
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          keyboardType="decimal-pad"
          placeholderTextColor={theme.colors.textMuted}
        />
        {suffix ? <Text style={styles.unitText}>{suffix}</Text> : null}
      </View>
    </View>
  );
}

function SelectionModal({ visible, title, data, onClose, onSelect, theme }: any) {
  const styles = getStyles(theme);
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalCard}>
          <Text style={styles.modalTitle}>{title}</Text>
          <FlatList
            data={data}
            keyExtractor={(item) => item.value}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.modalItem} onPress={() => onSelect(item)}>
                <Text style={styles.modalItemText}>{item.label}</Text>
              </TouchableOpacity>
            )}
          />
          <TouchableOpacity style={styles.modalClose} onPress={onClose}>
            <Text style={styles.modalCloseText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
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
  content: {
    paddingHorizontal: 16,
    paddingBottom: 120,
  },
  stepText: {
    color: theme.colors.primary,
    fontWeight: '800',
    fontSize: 12,
    marginTop: 8,
  },
  heroRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  heroTitle: {
    ...theme.typography.h1,
    fontSize: 36,
  },
  heroProgress: {
    color: theme.colors.textPrimary,
    fontWeight: '800',
  },
  progressTrack: {
    height: 6,
    borderRadius: 3,
    backgroundColor: theme.colors.border,
    marginTop: 12,
    marginBottom: 18,
  },
  progressFill: {
    width: '33%',
    height: '100%',
    backgroundColor: theme.colors.primary,
    borderRadius: 3,
  },
  sectionCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: 16,
    marginBottom: 16,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 16,
  },
  sectionTitle: {
    color: theme.colors.textPrimary,
    fontSize: 24,
    fontWeight: '800',
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  halfField: {
    flex: 1,
    marginBottom: 14,
  },
  fullField: {
    marginBottom: 14,
  },
  fieldLabel: {
    color: theme.colors.textSecondary,
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 8,
  },
  fieldBox: {
    minHeight: 52,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.background,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  fieldValue: {
    flex: 1,
    color: theme.colors.textPrimary,
    fontSize: 16,
  },
  input: {
    flex: 1,
    color: theme.colors.textPrimary,
    fontSize: 16,
  },
  unitText: {
    color: theme.colors.primary,
    fontWeight: '700',
  },
  segmentRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  segment: {
    minWidth: 78,
    height: 40,
    borderRadius: 20,
    paddingHorizontal: 16,
    backgroundColor: theme.colors.background,
    borderWidth: 1,
    borderColor: theme.colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  segmentActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  segmentText: {
    color: theme.colors.textSecondary,
    fontWeight: '700',
    fontSize: 12,
  },
  segmentTextActive: {
    color: theme.colors.textInverse,
  },
  sliderLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  riskOption: {
    alignItems: 'center',
    flex: 1,
    gap: 8,
  },
  riskDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: theme.colors.border,
  },
  riskDotActive: {
    backgroundColor: theme.colors.primary,
  },
  riskText: {
    color: theme.colors.textMuted,
    fontSize: 11,
    fontWeight: '700',
  },
  riskTextActive: {
    color: theme.colors.primary,
  },
  ctaButton: {
    height: 56,
    borderRadius: 18,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 6,
  },
  ctaText: {
    color: theme.colors.textInverse,
    fontSize: 18,
    fontWeight: '800',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalCard: {
    maxHeight: '70%',
    backgroundColor: theme.colors.surface,
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    padding: 20,
  },
  modalTitle: {
    color: theme.colors.textPrimary,
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 14,
  },
  modalItem: {
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  modalItemText: {
    color: theme.colors.textPrimary,
    fontSize: 16,
  },
  modalClose: {
    marginTop: 14,
    height: 50,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.surfaceAlt,
  },
  modalCloseText: {
    color: theme.colors.textPrimary,
    fontWeight: '800',
  },
});
