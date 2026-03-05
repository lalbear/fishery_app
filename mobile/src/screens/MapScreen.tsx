import React, { useState, useEffect, useRef } from 'react';
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

// Helper to reliably map state names to abbreviations when Google returns full names
const STATE_MAP: Record<string, string> = {
  "Andhra Pradesh": "AP",
  "Arunachal Pradesh": "AR",
  "Assam": "AS",
  "Bihar": "BR",
  "Chhattisgarh": "CT",
  "Goa": "GA",
  "Gujarat": "GJ",
  "Haryana": "HR",
  "Himachal Pradesh": "HP",
  "Jharkhand": "JH",
  "Karnataka": "KA",
  "Kerala": "KL",
  "Madhya Pradesh": "MP",
  "Maharashtra": "MH",
  "Manipur": "MN",
  "Meghalaya": "ML",
  "Mizoram": "MZ",
  "Nagaland": "NL",
  "Odisha": "OR",
  "Punjab": "PB",
  "Rajasthan": "RJ",
  "Sikkim": "SK",
  "Tamil Nadu": "TN",
  "Telangana": "TG",
  "Tripura": "TR",
  "Uttar Pradesh": "UP",
  "Uttarakhand": "UT",
  "West Bengal": "WB",
  "Andaman and Nicobar Islands": "AN",
  "Chandigarh": "CH",
  "Dadra and Nagar Haveli and Daman and Diu": "DN",
  "Delhi": "DL",
  "Jammu and Kashmir": "JK",
  "Ladakh": "LA",
  "Lakshadweep": "LD",
  "Puducherry": "PY"
};

// --- Free geocoding via OpenStreetMap Nominatim (no API key, no rate-limit issues) ---
interface NominatimResult {
  display_name: string;
  address: {
    state?: string;
    state_district?: string;
    county?: string;
    city?: string;
    town?: string;
    village?: string;
    suburb?: string;
  };
}

async function reverseGeocode(lat: number, lng: number): Promise<NominatimResult | null> {
  try {
    const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&addressdetails=1`;
    const res = await fetch(url, {
      headers: { 'User-Agent': 'FisheryApp/1.0 (contact@fisheryapp.in)' }
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

export default function MapScreen() {
  const { t } = useTranslation();
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [address, setAddress] = useState<string | null>(null);
  const [suitabilityData, setSuitabilityData] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isGettingLocation, setIsGettingLocation] = useState<boolean>(true);
  const scrollViewRef = useRef<any>(null);

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

  // Load Zones first
  useEffect(() => {
    (async () => {
      try {
        const response = await geoService.getZones();
        if (response.success && response.data.length > 0) {
          setZones(response.data);
        }
      } catch (error) {
        console.error('Failed to fetch zones', error);
      }
    })();
  }, []);

  // Set default state/district safely if nothing selected and zones arrive
  useEffect(() => {
    if (zones.length > 0 && !stateCode) {
      const firstZone = zones[0];
      setStateCode(firstZone.state_code);
      if (firstZone.district_codes && firstZone.district_codes.length > 0) {
        setDistrictCode(firstZone.district_codes[0]);
      }
    }
  }, [zones]); // run if zones load and no stateCode yet

  // Load Location
  useEffect(() => {
    let locationSubscription: Location.LocationSubscription | null = null;

    const initLocation = async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Permission denied', 'Location permission is required for maps to automatically find your district.');
          setIsGettingLocation(false);
          return;
        }

        // Get initial location with balanced accuracy for speed
        let loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
        setLocation(loc);
        await autoFillLocation(loc); // Trigger geocoding + form autofill
        setIsGettingLocation(false);

        // Start real-time watching for high accuracy
        locationSubscription = await Location.watchPositionAsync(
          { accuracy: Location.Accuracy.High, distanceInterval: 100, timeInterval: 10000 },
          (newLoc) => {
            setLocation(newLoc);
          }
        );
      } catch (err) {
        console.error("Location acquisition failed:", err);
        setIsGettingLocation(false);
      }
    };

    if (zones.length > 0) {
      initLocation(); // Only perform location stuff once zones are loaded so we can auto-fill
    }

    return () => {
      if (locationSubscription) {
        locationSubscription.remove();
      }
    };
  }, [zones.length]); // run after zones array populates

  // Keep track of the last geocoded coordinates to prevent spamming the geocoder
  const lastGeocodedCoords = useRef<{ lat: number; lng: number } | null>(null);

  const autoFillLocation = async (loc: Location.LocationObject) => {
    try {
      // Prevent rapid requests for very near locations (< ~50 meters)
      // 0.0005 degrees is approx 55 meters
      if (lastGeocodedCoords.current) {
        const dLat = Math.abs(lastGeocodedCoords.current.lat - loc.coords.latitude);
        const dLng = Math.abs(lastGeocodedCoords.current.lng - loc.coords.longitude);
        if (dLat < 0.0005 && dLng < 0.0005) {
          return; // Skip reverse geocoding if we haven't moved far
        }
      }
      lastGeocodedCoords.current = { lat: loc.coords.latitude, lng: loc.coords.longitude };

      // Use OSM Nominatim instead of expo-location to avoid rate limits
      const nominatim = await reverseGeocode(loc.coords.latitude, loc.coords.longitude);
      if (!nominatim) return;

      setAddress(nominatim.display_name || 'Unknown Location');

      const stateName = nominatim.address?.state;
      const districtName = nominatim.address?.state_district
        || nominatim.address?.county
        || nominatim.address?.city
        || nominatim.address?.town
        || nominatim.address?.village;

      if (stateName) {
        const mappedCode = STATE_MAP[stateName] || stateName;
        const foundState = zones.find((z: any) => z.state_code === mappedCode || z.zone_name === stateName);
        if (foundState) {
          setStateCode(foundState.state_code);
          if (districtName && foundState.district_codes) {
            const match = foundState.district_codes.find((d: string) =>
              d.toLowerCase() === districtName.toLowerCase()
            );
            setDistrictCode(match || foundState.district_codes[0]);
          } else {
            setDistrictCode(foundState.district_codes[0]);
          }
        }
      }
    } catch (err) {
      console.error('Auto fill reverse geocode error', err);
    }
  };



  // Sync district when user manually changes state ONLY if current district is invalid for new state
  useEffect(() => {
    if (stateCode && zones.length > 0) {
      const selectedZone = zones.find(z => z.state_code === stateCode);
      if (selectedZone && selectedZone.district_codes.length > 0) {
        if (!selectedZone.district_codes.includes(districtCode)) {
          setDistrictCode(selectedZone.district_codes[0]);
        }
      }
    }
  }, [stateCode, zones]);

  const analyzeLocation = async () => {
    if (!location) return;
    setIsLoading(true);

    try {
      // We removed the redundant reverse geocoding here to prevent hitting
      // rate limits. The address should already be populated by autoFillLocation.

      // Call real backend API
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
        setTimeout(() => {
          scrollViewRef.current?.scrollToEnd({ animated: true });
        }, 100);
      } else {
        Alert.alert("Analysis Failed", result.message || "Failed to analyze location data.");
      }

    } catch (error: any) {
      const apiErrorMsg = error.response?.data?.message || error.response?.data?.error;
      const genericMsg = error?.message || "Failed to connect to backend service. Please check your network.";
      Alert.alert("Analysis Error", apiErrorMsg || genericMsg);
      console.error("Analysis Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMapPress = async (e: any) => {
    if (location) {
      const newLoc = {
        ...location,
        coords: {
          ...location.coords,
          latitude: e.nativeEvent.coordinate.latitude,
          longitude: e.nativeEvent.coordinate.longitude
        }
      };
      setLocation(newLoc);
      // re-autofill using the selected map point!
      await autoFillLocation(newLoc);
    }
  };

  const statesList = zones.map(z => ({ label: z.zone_name, value: z.state_code }));
  const relevantDistricts = zones.find(z => z.state_code === stateCode)?.district_codes || [];
  const selectedStateName = statesList.find(s => s.value === stateCode)?.label || stateCode || 'Select State';

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView ref={scrollViewRef} contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>{t('maps.title') || 'Geo Suitability'}</Text>
          <Text style={styles.subtitle}>{t('maps.subtitle') || 'Analyze your pond environment'}</Text>
        </View>

        <View style={styles.mapContainer}>
          {location ? (
            <MapView
              style={styles.map}
              initialRegion={{
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
              }}
              showsUserLocation={true}
              showsMyLocationButton={true}
              onPress={handleMapPress}
            >
              <Marker
                coordinate={{ latitude: location.coords.latitude, longitude: location.coords.longitude }}
                title="Selected Location"
                draggable
                onDragEnd={handleMapPress}
              />
            </MapView>
          ) : (
            <View style={styles.loadingMap}>
              {isGettingLocation ? (
                <>
                  <ActivityIndicator size="large" color={theme.colors.primary} />
                  <Text style={styles.loadingText}>Acquiring GPS Signal...</Text>
                </>
              ) : (
                <Text style={styles.loadingText}>GPS Unavailable</Text>
              )}
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