import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../ThemeContext';
import database from '../database';
import Pond from '../database/models/Pond';
import * as Location from 'expo-location';
import { v4 as uuidv4 } from 'uuid';

const WATER_SOURCES = ['BOREWELL', 'OPEN_WELL', 'CANAL', 'RIVER', 'TANK'];
const SYSTEMS = ['EARTHEN', 'BIOFLOC', 'RAS', 'CAGES', 'PENS'];

export default function AddEditPondScreen({ route }: any) {
    const navigation = useNavigation<any>();
    const { theme } = useTheme();
    const styles = getStyles(theme);

    const existingPondId = route.params?.pondId;
    const [name, setName] = useState('');
    const [area, setArea] = useState('');
    const [source, setSource] = useState(WATER_SOURCES[0]);
    const [system, setSystem] = useState(SYSTEMS[0]);
    const [status, setStatus] = useState('ACTIVE');
    const [lat, setLat] = useState('');
    const [lng, setLng] = useState('');
    const [isGettingLocation, setIsGettingLocation] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    React.useEffect(() => {
        if (existingPondId) loadPond();
    }, [existingPondId]);

    const loadPond = async () => {
        try {
            const pond = await database.collections.get<Pond>('ponds').find(existingPondId);
            setName(pond.name);
            setArea(pond.areaHectares.toString());
            setSource(pond.waterSourceType);
            setSystem(pond.systemType);
            setStatus(pond.status);
            if (pond.latitude) setLat(pond.latitude.toString());
            if (pond.longitude) setLng(pond.longitude.toString());
        } catch {
            Alert.alert('Error', 'Could not load pond details.');
            navigation.goBack();
        }
    };

    const handleGetLocation = async () => {
        try {
            setIsGettingLocation(true);
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Permission Denied', 'Allow location access to get pond coordinates.');
                return;
            }
            const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
            setLat(loc.coords.latitude.toString());
            setLng(loc.coords.longitude.toString());
        } catch {
            Alert.alert('Error', 'Failed to get location.');
        } finally {
            setIsGettingLocation(false);
        }
    };

    const handleSave = async () => {
        if (!name.trim()) return Alert.alert('Validation Error', 'Pond name is required.');
        if (!area.trim() || isNaN(Number(area))) return Alert.alert('Validation Error', 'Valid area in hectares is required.');

        setIsSaving(true);
        try {
            await database.write(async () => {
                if (existingPondId) {
                    const pond = await database.collections.get<Pond>('ponds').find(existingPondId);
                    await pond.update(p => {
                        p.name = name;
                        p.areaHectares = Number(area);
                        p.waterSourceType = source;
                        p.systemType = system;
                        p.status = status;
                        p.latitude = lat ? Number(lat) : undefined;
                        p.longitude = lng ? Number(lng) : undefined;
                        p.localSyncStatus = 'PENDING';
                    });
                } else {
                    await database.collections.get<Pond>('ponds').create(p => {
                        p._raw.id = uuidv4();
                        p.pondId = p._raw.id;
                        p.name = name;
                        p.areaHectares = Number(area);
                        p.waterSourceType = source;
                        p.systemType = system;
                        p.status = status;
                        p.latitude = lat ? Number(lat) : undefined;
                        p.longitude = lng ? Number(lng) : undefined;
                        p.localSyncStatus = 'NEW';
                    });
                }
            });
            navigation.goBack();
        } catch (e: any) {
            Alert.alert('Save Error', e.message);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={22} color={theme.colors.textPrimary} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>{existingPondId ? 'Edit Pond' : 'Add Pond'}</Text>
                <View style={{ width: 22 }} />
            </View>

            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
                <ScrollView contentContainerStyle={styles.content}>
                    <Field label="Pond Name" value={name} onChangeText={setName} styles={styles} />
                    <Field label="Area (Hectares)" value={area} onChangeText={setArea} keyboardType="decimal-pad" styles={styles} />

                    <Text style={styles.sectionLabel}>Water Source</Text>
                    <View style={styles.chipRow}>
                        {WATER_SOURCES.map(item => (
                            <TouchableOpacity key={item} style={[styles.chip, source === item && styles.chipActive]} onPress={() => setSource(item)}>
                                <Text style={[styles.chipText, source === item && styles.chipTextActive]}>{item}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    <Text style={styles.sectionLabel}>System Type</Text>
                    <View style={styles.chipRow}>
                        {SYSTEMS.map(item => (
                            <TouchableOpacity key={item} style={[styles.chip, system === item && styles.chipActive]} onPress={() => setSystem(item)}>
                                <Text style={[styles.chipText, system === item && styles.chipTextActive]}>{item}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    <Text style={styles.sectionLabel}>Status</Text>
                    <View style={styles.chipRow}>
                        {['ACTIVE', 'FALLOW'].map(item => (
                            <TouchableOpacity key={item} style={[styles.chip, status === item && styles.chipActive]} onPress={() => setStatus(item)}>
                                <Text style={[styles.chipText, status === item && styles.chipTextActive]}>{item}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    <View style={styles.locationHeader}>
                        <Text style={styles.sectionLabel}>Location</Text>
                        <TouchableOpacity onPress={handleGetLocation}>
                            <Text style={styles.autoLocate}>{isGettingLocation ? 'Getting...' : 'Auto-Locate'}</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.coordinateRow}>
                        <Field label="Latitude" value={lat} onChangeText={setLat} keyboardType="decimal-pad" styles={styles} half />
                        <Field label="Longitude" value={lng} onChangeText={setLng} keyboardType="decimal-pad" styles={styles} half />
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>

            <View style={styles.footer}>
                <TouchableOpacity style={styles.saveButton} onPress={handleSave} disabled={isSaving}>
                    <Text style={styles.saveButtonText}>{isSaving ? 'Saving...' : 'Save Pond'}</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

function Field({ label, styles, half, ...props }: any) {
    return (
        <View style={[styles.fieldWrap, half && styles.halfField]}>
            <Text style={styles.fieldLabel}>{label}</Text>
            <TextInput style={styles.input} placeholderTextColor="#7D9A83" {...props} />
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
    headerTitle: { color: theme.colors.textPrimary, fontSize: 22, fontWeight: '800' },
    content: { padding: 16, paddingBottom: 120 },
    fieldWrap: { marginBottom: 14 },
    halfField: { flex: 1 },
    fieldLabel: { color: theme.colors.textSecondary, fontWeight: '700', marginBottom: 8 },
    input: {
        minHeight: 54,
        borderRadius: 14,
        backgroundColor: theme.colors.surface,
        borderWidth: 1,
        borderColor: theme.colors.border,
        paddingHorizontal: 14,
        color: theme.colors.textPrimary,
    },
    sectionLabel: { color: theme.colors.textSecondary, fontWeight: '700', marginBottom: 10, marginTop: 6 },
    chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 12 },
    chip: {
        height: 38,
        borderRadius: 19,
        paddingHorizontal: 14,
        backgroundColor: theme.colors.surface,
        borderWidth: 1,
        borderColor: theme.colors.border,
        alignItems: 'center',
        justifyContent: 'center',
    },
    chipActive: { backgroundColor: theme.colors.primary, borderColor: theme.colors.primary },
    chipText: { color: theme.colors.textSecondary, fontSize: 12, fontWeight: '700' },
    chipTextActive: { color: theme.colors.textInverse },
    locationHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    autoLocate: { color: theme.colors.primary, fontWeight: '800' },
    coordinateRow: { flexDirection: 'row', gap: 12 },
    footer: {
        padding: 16,
        borderTopWidth: 1,
        borderTopColor: theme.colors.border,
        backgroundColor: theme.colors.background,
    },
    saveButton: {
        height: 54,
        borderRadius: 18,
        backgroundColor: theme.colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
    },
    saveButtonText: { color: theme.colors.textInverse, fontSize: 16, fontWeight: '800' },
});
