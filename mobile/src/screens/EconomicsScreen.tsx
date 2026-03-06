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
import ScreenHeader from '../components/ScreenHeader';

const WATER_SOURCES = [
  { label: 'Borewell', value: 'BOREWELL' },
  { label: 'Open Well', value: 'OPEN_WELL' },
  { label: 'Canal', value: 'CANAL' },
  { label: 'River', value: 'RIVER' },
  { label: 'Tank', value: 'TANK' },
];

export default function EconomicsScreen() {
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const { t } = useTranslation();
  const navigation = useNavigation<any>();

  // Form state
  const [landSize, setLandSize] = useState('');
  const [salinity, setSalinity] = useState('500');
  const [capital, setCapital] = useState('');
  const [riskTolerance, setRiskTolerance] = useState<'LOW' | 'MEDIUM' | 'HIGH'>('MEDIUM');
  const [farmerCategory, setFarmerCategory] = useState<'GENERAL' | 'WOMEN' | 'SC' | 'ST'>('GENERAL');
  const [stateCode, setStateCode] = useState('');
  const [districtCode, setDistrictCode] = useState('');
  const [preferredSpecies, setPreferredSpecies] = useState<string>('');

  // UI state
  const [isLoading, setIsLoading] = useState(false);
  const [zones, setZones] = useState<any[]>([]);
  const [isStateOpen, setIsStateOpen] = useState(false);
  const [isDistrictOpen, setIsDistrictOpen] = useState(false);
  const [isSpeciesOpen, setIsSpeciesOpen] = useState(false);

  const riskOptions: Array<'LOW' | 'MEDIUM' | 'HIGH'> = ['LOW', 'MEDIUM', 'HIGH'];
  const categoryOptions: Array<'GENERAL' | 'WOMEN' | 'SC' | 'ST'> = ['GENERAL', 'WOMEN', 'SC', 'ST'];

  const SPECIES_OPTIONS = [
    { label: 'Auto Recommend', value: '' },
    { label: 'Vannamei Shrimp', value: 'Litopenaeus vannamei' },
    { label: 'Black Tiger Shrimp', value: 'Penaeus monodon' },
    { label: 'Pangasius', value: 'Pangasianodon hypophthalmus' },
    { label: 'Tilapia', value: 'Oreochromis niloticus' },
    { label: 'Labeo rohita (Rohu)', value: 'Labeo rohita' },
    { label: 'Catla catla (Catla)', value: 'Catla catla' },
    { label: 'Cirrhinus mrigala (Mrigal)', value: 'Cirrhinus mrigala' },
  ];

  useEffect(() => {
    (async () => {
      try {
        const response = await geoService.getZones();
        if (response.success && response.data.length > 0) {
          setZones(response.data);
          // B9 FIX: Only set stateCode and districtCode on initial load (when both are still empty).
          // Previously, a second useEffect on stateCode would immediately clear the district
          // because it ran on the same render cycle that set the stateCode.
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

  // Clear district when user actively changes state (but not on initial load,
  // because the initial load already sets both stateCode and districtCode together).
  const handleStateSelect = (val: string) => {
    setStateCode(val);
    setDistrictCode(''); // Clear district only when user manually picks a new state
    setIsStateOpen(false);
  };

  const runSimulation = async () => {
    if (!landSize || !capital || !stateCode || !districtCode) {
      Alert.alert('Missing Information', 'Please fill in all required fields.');
      return;
    }

    setIsLoading(true);
    try {
      // 1.0 Acre = 0.4047 Hectares (approx)
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

      if (preferredSpecies) {
        payload.preferredSpecies = [preferredSpecies];
      }

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
  const selectedStateName = statesList.find(s => s.value === stateCode)?.label || 'Select State';

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.surface }]} edges={['top']}>
      <ScreenHeader
        title={t('economics.title') || 'ROI Calculator'}
        onBack={() => (navigation as any).navigate('Main', { screen: 'Home' })}
        variant="surface"
      />
      <ScrollView contentContainerStyle={[styles.scrollContent, { backgroundColor: theme.colors.background }]}>
        <View style={styles.headerInfo}>
          <Text style={styles.subtitle}>{t('economics.subtitle') || 'Estimate your returns'}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>{t('economics.inputParameters') || 'Input Parameters'}</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>{t('economics.landSize') || 'Land Size (Acres)'}</Text>
            <TextInput
              style={styles.input}
              value={landSize}
              onChangeText={setLandSize}
              keyboardType="decimal-pad"
              placeholder="e.g. 1.0"
              placeholderTextColor={theme.colors.textMuted}
            />
          </View>

          <View style={styles.row}>
            <View style={styles.inputHalf}>
              <Text style={styles.label}>State</Text>
              <TouchableOpacity style={styles.pickerButton} onPress={() => setIsStateOpen(true)}>
                <Text style={styles.pickerText} numberOfLines={1}>{selectedStateName}</Text>
                <Ionicons name="chevron-down" size={16} color={theme.colors.textMuted} />
              </TouchableOpacity>
            </View>

            <View style={styles.inputHalf}>
              <Text style={styles.label}>District</Text>
              <TouchableOpacity style={styles.pickerButton} onPress={() => setIsDistrictOpen(true)}>
                <Text style={styles.pickerText} numberOfLines={1}>{districtCode || 'Select'}</Text>
                <Ionicons name="chevron-down" size={16} color={theme.colors.textMuted} />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>{t('economics.salinity') || 'Water Salinity (μS/cm)'}</Text>
            <TextInput
              style={styles.input}
              value={salinity}
              onChangeText={setSalinity}
              keyboardType="decimal-pad"
              placeholder="e.g. 500"
              placeholderTextColor={theme.colors.textMuted}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>{t('economics.capital') || 'Investment Capital (₹)'}</Text>
            <TextInput
              style={styles.input}
              value={capital}
              onChangeText={setCapital}
              keyboardType="decimal-pad"
              placeholder="e.g. 100000"
              placeholderTextColor={theme.colors.textMuted}
            />
          </View>

          <Text style={styles.label}>{t('economics.riskTolerance') || 'Risk Tolerance'}</Text>
          <View style={styles.optionsRow}>
            {riskOptions.map((risk) => (
              <TouchableOpacity
                key={risk}
                style={[styles.optionButton, riskTolerance === risk && styles.optionButtonActive]}
                onPress={() => setRiskTolerance(risk)}
                activeOpacity={0.7}
              >
                <Text style={[styles.optionText, riskTolerance === risk && styles.optionTextActive]}>
                  {t(`economics.${risk.toLowerCase()}Risk`) || risk}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.label}>{t('economics.farmerCategory') || 'Farmer Category'}</Text>
          <View style={styles.optionsRow}>
            {categoryOptions.map((cat) => (
              <TouchableOpacity
                key={cat}
                style={[styles.optionButton, farmerCategory === cat && styles.optionButtonActive]}
                onPress={() => setFarmerCategory(cat)}
                activeOpacity={0.7}
              >
                <Text style={[styles.optionText, farmerCategory === cat && styles.optionTextActive]}>
                  {t(`economics.categories.${cat}`) || cat}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Target Species (Optional)</Text>
            <TouchableOpacity style={styles.pickerButton} onPress={() => setIsSpeciesOpen(true)}>
              <Text style={styles.pickerText}>
                {SPECIES_OPTIONS.find(s => s.value === preferredSpecies)?.label || 'Auto Recommend'}
              </Text>
              <Ionicons name="chevron-down" size={16} color={theme.colors.textMuted} />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={[styles.submitButton, isLoading && { opacity: 0.7 }]}
            onPress={runSimulation}
            activeOpacity={0.8}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color={theme.colors.surface} />
            ) : (
              <>
                <Ionicons name="calculator-outline" size={24} color={theme.colors.surface} />
                <Text style={styles.submitButtonText}>{t('economics.runSimulation') || 'Calculate Now'}</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
        <View style={{ height: theme.spacing.xxl }} />
      </ScrollView>

      {/* Select Modals */}
      <SelectionModal
        visible={isStateOpen}
        items={statesList}
        onSelect={handleStateSelect}
        onClose={() => setIsStateOpen(false)}
        title="Select State"
        theme={theme}
        styles={styles}
      />
      <SelectionModal
        visible={isDistrictOpen}
        items={relevantDistricts.map((d: string) => ({ label: d, value: d }))}
        onSelect={(val: string) => { setDistrictCode(val); setIsDistrictOpen(false); }}
        onClose={() => setIsDistrictOpen(false)}
        title="Select District"
        theme={theme}
        styles={styles}
      />
      <SelectionModal
        visible={isSpeciesOpen}
        items={SPECIES_OPTIONS}
        onSelect={(val: string) => { setPreferredSpecies(val); setIsSpeciesOpen(false); }}
        onClose={() => setIsSpeciesOpen(false)}
        title="Select Target Species"
        theme={theme}
        styles={styles}
      />
    </SafeAreaView>
  );
}

function SelectionModal({ visible, items, onSelect, onClose, title, theme, styles }: any) {
  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{title}</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color={theme.colors.textPrimary} />
            </TouchableOpacity>
          </View>
          {items.length === 0 ? (
            <View style={{ padding: 40, alignItems: 'center' }}>
              <ActivityIndicator color={theme.colors.primary} />
              <Text style={{ marginTop: 10, color: theme.colors.textSecondary }}>Loading data...</Text>
            </View>
          ) : (
            <FlatList
              data={items}
              keyExtractor={(item: any) => item.value || item.label}
              contentContainerStyle={{ paddingBottom: 20 }}
              renderItem={({ item }: { item: any }) => (
                <TouchableOpacity style={styles.modalItem} onPress={() => onSelect(item.value)}>
                  <Text style={styles.modalItemText}>{item.label}</Text>
                </TouchableOpacity>
              )}
            />
          )}
        </View>
      </View>
    </Modal>
  );
}

const getStyles = (theme: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollContent: {
    padding: theme.spacing.lg,
  },
  headerInfo: {
    marginBottom: theme.spacing.md,
  },
  subtitle: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
  },
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    ...theme.shadows.sm,
  },
  sectionTitle: {
    ...theme.typography.h3,
    marginBottom: theme.spacing.lg,
    color: theme.colors.textPrimary,
  },
  inputGroup: {
    marginBottom: theme.spacing.md,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.md,
  },
  inputHalf: {
    flex: 1,
  },
  label: {
    ...theme.typography.body,
    fontWeight: '600',
    marginBottom: theme.spacing.sm,
    color: theme.colors.textPrimary,
    fontSize: 15,
  },
  input: {
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    fontSize: 16,
    borderWidth: 1,
    borderColor: theme.colors.border,
    color: theme.colors.textPrimary,
  },
  pickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: theme.spacing.sm + 4,
    borderRadius: theme.borderRadius.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.background,
  },
  pickerText: {
    fontSize: 15,
    color: theme.colors.textPrimary,
    flex: 1,
  },
  optionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.lg,
  },
  optionButton: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.full,
    backgroundColor: theme.colors.background,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  optionButtonActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  optionText: {
    fontSize: 15,
    fontWeight: '500',
    color: theme.colors.textPrimary,
  },
  optionTextActive: {
    color: theme.colors.textInverse,
  },
  submitButton: {
    backgroundColor: theme.colors.secondary,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.sm,
    marginTop: theme.spacing.sm,
    ...theme.shadows.md,
  },
  submitButtonText: {
    ...theme.typography.buttonText,
    color: theme.colors.textInverse,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: theme.colors.surface,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '70%',
    paddingBottom: 30,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.colors.textPrimary,
  },
  modalItem: {
    padding: theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  modalItemText: {
    fontSize: 17,
    color: theme.colors.textPrimary,
  },
});