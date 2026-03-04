import React, { useState, useEffect } from 'react';
import {
  View as RNView,
  Text as RNText,
  StyleSheet,
  TouchableOpacity as RNTouchableOpacity,
  Alert,
  ActivityIndicator as RNActivityIndicator,
  ScrollView as RNScrollView,
  TextInput as RNTextInput,
  Modal as RNModal,
  FlatList as RNFlatList
} from 'react-native';

const View = RNView as any;
const Text = RNText as any;
const TouchableOpacity = RNTouchableOpacity as any;
const ActivityIndicator = RNActivityIndicator as any;
const ScrollView = RNScrollView as any;
const TextInput = RNTextInput as any;
const Modal = RNModal as any;
const FlatList = RNFlatList as any;
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { theme } from '../theme';
import { geoService } from '../services/apiService';

const WATER_SOURCES = [
  { label: 'Borewell', value: 'BOREWELL' },
  { label: 'Open Well', value: 'OPEN_WELL' },
  { label: 'Canal', value: 'CANAL' },
  { label: 'River', value: 'RIVER' },
  { label: 'Tank', value: 'TANK' },
];

export default function MapScreen() {
  const { t } = useTranslation();
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [address, setAddress] = useState<string | null>(null);
  const [suitabilityData, setSuitabilityData] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Form state
  const [stateCode, setStateCode] = useState('');
  const [districtCode, setDistrictCode] = useState('');
  const [waterSource, setWaterSource] = useState('BOREWELL');
  const [salinity, setSalinity] = useState('');

  // Dropdown states
  const [zones, setZones] = useState<any[]>([]);
  const [isStateOpen, setIsStateOpen] = useState(false);
  const [isDistrictOpen, setIsDistrictOpen] = useState(false);
  const [isWaterOpen, setIsWaterOpen] = useState(false);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission denied', 'Location permission is required for maps');
        return;
      }
      let loc = await Location.getCurrentPositionAsync({});
      setLocation(loc);

      // Fetch zones to populate dropdowns
      try {
        const response = await geoService.getZones();
        if (response.success && response.data.length > 0) {
          setZones(response.data);
          // Set initial defaults if not set
          if (!stateCode) {
            const firstZone = response.data[0];
            setStateCode(firstZone.state_code);
            if (firstZone.district_codes && firstZone.district_codes.length > 0) {
              setDistrictCode(firstZone.district_codes[0]);
            }
          }
        }
      } catch (error) {
        console.error('Failed to fetch zones', error);
      }
    })();
  }, []);

  // Sync district when state changes
  useEffect(() => {
    if (stateCode && zones.length > 0) {
      const selectedZone = zones.find(z => z.state_code === stateCode);
      if (selectedZone && selectedZone.district_codes.length > 0) {
        // If current district is not in the new state's districts, reset it to the first one
        if (!selectedZone.district_codes.includes(districtCode)) {
          setDistrictCode(selectedZone.district_codes[0]);
        }
      }
    }
  }, [stateCode]);

  const analyzeLocation = async () => {
    if (!location) return;
    setIsLoading(true);

    try {
      const apiKey = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY;

      if (!apiKey) {
        Alert.alert("API Key Missing", "Please add EXPO_PUBLIC_GOOGLE_MAPS_API_KEY to your .env file.");
        setIsLoading(false);
        return;
      }

      // 1. Reverse Geocoding to get the area name
      const reverseGeoUrl = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${location.coords.latitude},${location.coords.longitude}&key=${apiKey}`;
      const geoResponse = await fetch(reverseGeoUrl);
      const geoData = await geoResponse.json();

      if (geoData.results && geoData.results.length > 0) {
        setAddress(geoData.results[0].formatted_address);
      } else {
        setAddress("Unknown Location");
      }

      // 2. Call real backend API
      const result = await geoService.analyzeSuitability({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        stateCode: stateCode,
        districtCode: districtCode,
        waterSourceType: waterSource,
        measuredSalinityUsCm: salinity ? parseFloat(salinity) : undefined
      });

      if (result.success) {
        setSuitabilityData(result.data);
      } else {
        Alert.alert("Analysis Failed", result.message || "Failed to analyze location data.");
      }

    } catch (error) {
      Alert.alert("Error", "Failed to connect to backend service. Please check your network and BACKEND_URL.");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const statesList = zones.map(z => ({ label: z.zone_name, value: z.state_code }));
  const relevantDistricts = zones.find(z => z.state_code === stateCode)?.district_codes || [];
  const selectedStateName = statesList.find(s => s.value === stateCode)?.label || stateCode || 'Select State';

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>{t('maps.title') || 'Geo Suitability'}</Text>
          <Text style={styles.subtitle}>{t('maps.subtitle') || 'Analyze your pond environment'}</Text>
        </View>

        <View style={styles.mapContainer}>
          {location ? (
            <MapView style={styles.map} initialRegion={{
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}>
              <Marker coordinate={{ latitude: location.coords.latitude, longitude: location.coords.longitude }} title="Current Location" />
            </MapView>
          ) : (
            <View style={styles.loadingMap}>
              <ActivityIndicator size="large" color={theme.colors.primary} />
              <Text style={styles.loadingText}>Acquiring GPS Signal...</Text>
            </View>
          )}
        </View>

        <View style={styles.formCard}>
          <View style={styles.formHeaderRow}>
            <Text style={styles.formTitle}>Environment Details</Text>
            <TouchableOpacity onPress={() => Alert.alert("Why this is needed?", "Fisheries policies, subsidies, and climate data are mapped by administrative zones. Your selection helps us provide accurate species and system recommendations for your region.")}>
              <Ionicons name="information-circle-outline" size={20} color={theme.colors.primary} />
            </TouchableOpacity>
          </View>

          <View style={styles.row}>
            <View style={styles.inputHalf}>
              <Text style={styles.label}>State</Text>
              <TouchableOpacity style={styles.pickerButton} onPress={() => setIsStateOpen(true)}>
                <Text style={styles.pickerText}>{selectedStateName}</Text>
                <Ionicons name="chevron-down" size={20} color="#666" />
              </TouchableOpacity>
            </View>

            <View style={styles.inputHalf}>
              <Text style={styles.label}>District</Text>
              <TouchableOpacity style={styles.pickerButton} onPress={() => setIsDistrictOpen(true)}>
                <Text style={styles.pickerText}>{districtCode || 'Select'}</Text>
                <Ionicons name="chevron-down" size={20} color="#666" />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.inputFull}>
            <Text style={styles.label}>Water Source</Text>
            <TouchableOpacity style={styles.pickerButton} onPress={() => setIsWaterOpen(true)}>
              <Text style={styles.pickerText}>{WATER_SOURCES.find(s => s.value === waterSource)?.label}</Text>
              <Ionicons name="chevron-down" size={20} color="#666" />
            </TouchableOpacity>
          </View>

          <View style={styles.inputFull}>
            <Text style={styles.label}>Measured Salinity (μS/cm) - Optional</Text>
            <TextInput
              style={styles.input}
              value={salinity}
              onChangeText={setSalinity}
              keyboardType="decimal-pad"
              placeholder="e.g. 500"
            />
          </View>

          <TouchableOpacity
            style={styles.checkButton}
            onPress={analyzeLocation}
            activeOpacity={0.8}
            disabled={isLoading || !location}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Ionicons name="analytics-outline" size={24} color="#fff" />
            )}
            <Text style={styles.buttonText}>
              {isLoading ? 'Analyzing...' : (t('maps.checkSuitability') || 'Analyze Environment')}
            </Text>
          </TouchableOpacity>
        </View>

        {suitabilityData && address && (
          <View style={styles.resultCard}>
            <View style={styles.resultHeader}>
              <Ionicons name="location" size={20} color={theme.colors.primary} />
              <Text style={styles.addressText} numberOfLines={2}>{address}</Text>
            </View>

            <View style={styles.scoreContainer}>
              <Text style={styles.resultLabel}>Suitability Index</Text>
              <Text style={[styles.score, {
                color: suitabilityData.suitabilityScore > 70 ? theme.colors.success :
                  suitabilityData.suitabilityScore > 50 ? theme.colors.accent :
                    theme.colors.error
              }]}>
                {suitabilityData.suitabilityScore}/100
              </Text>
              <Text style={styles.waterType}>{suitabilityData.waterQualityClassification} Profile</Text>
            </View>

            {suitabilityData.recommendedSystems && (
              <View style={styles.resultsSection}>
                <Text style={styles.sectionTitle}>Recommended Systems</Text>
                {suitabilityData.recommendedSystems.slice(0, 3).map((sys: any, idx: number) => (
                  <View key={idx} style={styles.systemItem}>
                    <Ionicons name="checkmark-circle" size={18} color={theme.colors.success} />
                    <Text style={styles.systemName}>{sys.system}</Text>
                    <Text style={styles.systemScore}>{sys.suitabilityScore}%</Text>
                  </View>
                ))}
              </View>
            )}

            {suitabilityData.restrictedSpecies && suitabilityData.restrictedSpecies.length > 0 && (
              <View style={styles.resultsSection}>
                <Text style={[styles.sectionTitle, { color: theme.colors.error }]}>Restricted Species</Text>
                <Text style={styles.smallText}>Not recommended for current salinity levels:</Text>
                <View style={styles.tagCloud}>
                  {suitabilityData.restrictedSpecies.map((s: string, idx: number) => (
                    <View key={idx} style={styles.tag}>
                      <Text style={styles.tagText}>{s}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}

            {suitabilityData.warnings && suitabilityData.warnings.length > 0 && (
              <View style={styles.resultsSection}>
                <Text style={[styles.sectionTitle, { color: theme.colors.accent }]}>Critical Warnings</Text>
                {suitabilityData.warnings.map((w: string, idx: number) => (
                  <View key={idx} style={styles.warningItem}>
                    <Ionicons name="warning" size={16} color={theme.colors.accent} />
                    <Text style={styles.warningText}>{w}</Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        )}
      </ScrollView>

      {/* Select Modals */}
      <SelectionModal
        visible={isStateOpen}
        items={statesList}
        onSelect={(val: string) => { setStateCode(val); setIsStateOpen(false); }}
        onClose={() => setIsStateOpen(false)}
        title="Select State"
      />
      <SelectionModal
        visible={isDistrictOpen}
        items={relevantDistricts.map((d: string) => ({ label: d, value: d }))}
        onSelect={(val: string) => { setDistrictCode(val); setIsDistrictOpen(false); }}
        onClose={() => setIsDistrictOpen(false)}
        title="Select District"
      />
      <SelectionModal
        visible={isWaterOpen}
        items={WATER_SOURCES}
        onSelect={(val: string) => { setWaterSource(val); setIsWaterOpen(false); }}
        onClose={() => setIsWaterOpen(false)}
        title="Water Source"
      />
    </SafeAreaView>
  );
}

function SelectionModal({ visible, items, onSelect, onClose, title }: any) {
  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{title}</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color="#333" />
            </TouchableOpacity>
          </View>
          <FlatList
            data={items}
            keyExtractor={(item: any) => item.value}
            renderItem={({ item }: { item: any }) => (
              <TouchableOpacity style={styles.modalItem} onPress={() => onSelect(item.value)}>
                <Text style={styles.modalItemText}>{item.label}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background
  },
  scrollContent: {
    paddingBottom: 40,
  },
  header: {
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.surface,
    ...theme.shadows.sm,
    zIndex: 10,
  },
  title: {
    ...theme.typography.h2,
    color: theme.colors.primary,
    fontWeight: 'bold'
  },
  subtitle: {
    ...theme.typography.body,
    color: theme.colors.textMuted,
    marginTop: 4
  },
  mapContainer: {
    height: 250,
    margin: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    overflow: 'hidden',
    ...theme.shadows.md,
  },
  map: {
    flex: 1
  },
  loadingMap: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.surface
  },
  loadingText: {
    marginTop: theme.spacing.md,
    ...theme.typography.body,
  },
  formCard: {
    backgroundColor: theme.colors.surface,
    margin: theme.spacing.md,
    marginTop: 0,
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.lg,
    ...theme.shadows.sm,
  },
  formTitle: {
    ...theme.typography.h3,
    color: '#333'
  },
  formHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12
  },
  inputHalf: {
    flex: 1,
    marginBottom: 16
  },
  inputFull: {
    width: '100%',
    marginBottom: 16
  },
  label: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#666',
    marginBottom: 8,
    textTransform: 'uppercase'
  },
  pickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#fafafa'
  },
  pickerText: {
    fontSize: 16,
    color: '#333'
  },
  input: {
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#fafafa',
    fontSize: 16
  },
  checkButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.sm,
    marginTop: 8,
    ...theme.shadows.sm,
  },
  buttonText: {
    ...theme.typography.buttonText,
    color: theme.colors.textInverse
  },
  resultCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    margin: theme.spacing.md,
    marginTop: 0,
    ...theme.shadows.md,
  },
  resultHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: theme.spacing.sm,
    paddingBottom: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    marginBottom: theme.spacing.md,
  },
  addressText: {
    ...theme.typography.body,
    flex: 1,
    fontWeight: '500',
  },
  scoreContainer: {
    alignItems: 'center',
    marginBottom: 24
  },
  resultLabel: {
    ...theme.typography.bodyLarge,
    fontWeight: '600',
  },
  score: {
    fontSize: 56,
    fontWeight: 'bold',
    marginVertical: theme.spacing.xs
  },
  waterType: {
    ...theme.typography.body,
    color: theme.colors.primary,
    fontWeight: 'bold',
    textTransform: 'uppercase'
  },
  resultsSection: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0'
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
    textTransform: 'uppercase'
  },
  systemItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 10
  },
  systemName: {
    flex: 1,
    fontSize: 15,
    color: '#444'
  },
  systemScore: {
    fontWeight: 'bold',
    color: theme.colors.primary
  },
  tagCloud: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 8
  },
  tag: {
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6
  },
  tagText: {
    fontSize: 12,
    color: '#B91C1C',
    fontWeight: '500'
  },
  smallText: {
    fontSize: 12,
    color: '#666'
  },
  warningItem: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'flex-start',
    marginBottom: 8
  },
  warningText: {
    fontSize: 13,
    color: '#92400E',
    flex: 1
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end'
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '70%',
    paddingBottom: 30
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee'
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold'
  },
  modalItem: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f9f9f9'
  },
  modalItemText: {
    fontSize: 16,
    color: '#333'
  }
});