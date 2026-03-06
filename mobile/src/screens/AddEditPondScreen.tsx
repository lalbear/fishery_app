import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
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
    const { theme, isDark } = useTheme();
    const styles = getStyles(theme, isDark);
    const { t } = useTranslation();

    // Potential ID if editing
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
        if (existingPondId) {
            loadPond();
        }
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
        } catch (e) {
            Alert.alert('Error', 'Could not load pond details.');
            navigation.goBack();
        }
    };

    const handleGetLocation = async () => {
        try {
            setIsGettingLocation(true);
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Permission Denied', 'Allow location access to get pond coordinates.');
                setIsGettingLocation(false);
                return;
            }
            let loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
            setLat(loc.coords.latitude.toString());
            setLng(loc.coords.longitude.toString());
        } catch (e) {
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
                    // Explicitly setting the backend ID to UUID so that push sync doesn't crash on the server
                    await database.collections.get<Pond>('ponds').create(p => {
                        p._raw.id = uuidv4();
                        p.pondId = p._raw.id; // Just to maintain mapping if needed
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
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                    hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
                >
                    <Ionicons name="arrow-back" size={24} color={theme.colors.textPrimary} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>{existingPondId ? 'Edit Pond' : 'Add Pond'}</Text>
                <View style={{ width: 32 }} />
            </View>

            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
                <ScrollView contentContainerStyle={styles.scrollContent}>

                    <View style={styles.formGroup}>
                        <Text style={styles.label}>Pond Name*</Text>
                        <TextInput
                            style={styles.input}
                            value={name}
                            onChangeText={setName}
                            placeholder="e.g. Main Grow-out Pond"
                            placeholderTextColor={theme.colors.textMuted}
                        />
                    </View>

                    <View style={styles.formGroup}>
                        <Text style={styles.label}>Area (Hectares)*</Text>
                        <TextInput
                            style={styles.input}
                            value={area}
                            onChangeText={setArea}
                            placeholder="0.5"
                            keyboardType="decimal-pad"
                            placeholderTextColor={theme.colors.textMuted}
                        />
                    </View>

                    <View style={styles.formGroup}>
                        <Text style={styles.label}>Water Source</Text>
                        <View style={styles.chipRow}>
                            {WATER_SOURCES.map(s => (
                                <TouchableOpacity
                                    key={s}
                                    style={[styles.chip, source === s && styles.chipActive]}
                                    onPress={() => setSource(s)}
                                >
                                    <Text style={[styles.chipText, source === s && styles.chipTextActive]}>{s}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>

                    <View style={styles.formGroup}>
                        <Text style={styles.label}>System Type</Text>
                        <View style={styles.chipRow}>
                            {SYSTEMS.map(s => (
                                <TouchableOpacity
                                    key={s}
                                    style={[styles.chip, system === s && styles.chipActive]}
                                    onPress={() => setSystem(s)}
                                >
                                    <Text style={[styles.chipText, system === s && styles.chipTextActive]}>{s}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>

                    <View style={styles.formGroup}>
                        <Text style={styles.label}>Status</Text>
                        <View style={styles.chipRow}>
                            <TouchableOpacity
                                style={[styles.chip, status === 'ACTIVE' && styles.chipActive]}
                                onPress={() => setStatus('ACTIVE')}
                            >
                                <Text style={[styles.chipText, status === 'ACTIVE' && styles.chipTextActive]}>ACTIVE</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.chip, status === 'FALLOW' && styles.chipActive]}
                                onPress={() => setStatus('FALLOW')}
                            >
                                <Text style={[styles.chipText, status === 'FALLOW' && styles.chipTextActive]}>FALLOW</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={styles.formGroup}>
                        <View style={styles.locHeader}>
                            <Text style={styles.label}>Location</Text>
                            <TouchableOpacity onPress={handleGetLocation} disabled={isGettingLocation}>
                                <Text style={styles.getLocationText}>
                                    {isGettingLocation ? 'Getting...' : 'Auto-Locate'}
                                </Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.row}>
                            <TextInput
                                style={[styles.input, { flex: 1 }]}
                                value={lat}
                                onChangeText={setLat}
                                placeholder="Latitude"
                                keyboardType="decimal-pad"
                                placeholderTextColor={theme.colors.textMuted}
                            />
                            <View style={{ width: 12 }} />
                            <TextInput
                                style={[styles.input, { flex: 1 }]}
                                value={lng}
                                onChangeText={setLng}
                                placeholder="Longitude"
                                keyboardType="decimal-pad"
                                placeholderTextColor={theme.colors.textMuted}
                            />
                        </View>
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

const getStyles = (theme: any, isDark: boolean) => StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.colors.background },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: theme.spacing.md,
        backgroundColor: theme.colors.surface,
        ...theme.shadows.sm,
        zIndex: 10,
    },
    backButton: { padding: 4 },
    headerTitle: { ...theme.typography.h3, color: theme.colors.textPrimary },

    scrollContent: { padding: theme.spacing.lg },

    formGroup: { marginBottom: theme.spacing.lg },
    label: { fontSize: 13, fontWeight: '600', color: theme.colors.textSecondary, marginBottom: 8, textTransform: 'uppercase' },
    input: {
        backgroundColor: isDark ? '#1e1e1e' : '#FFFFFF',
        borderWidth: 1,
        borderColor: theme.colors.border,
        borderRadius: theme.borderRadius.md,
        padding: 14,
        fontSize: 16,
        color: theme.colors.textPrimary,
    },

    chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
    chip: {
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: theme.colors.border,
        backgroundColor: isDark ? '#1e1e1e' : '#f8f9fa',
    },
    chipActive: {
        backgroundColor: theme.colors.primary,
        borderColor: theme.colors.primary,
    },
    chipText: { fontSize: 14, color: theme.colors.textSecondary, fontWeight: '500' },
    chipTextActive: { color: '#fff' },

    row: { flexDirection: 'row' },
    locHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
    getLocationText: { color: theme.colors.secondary, fontWeight: '600', fontSize: 13 },

    footer: {
        padding: theme.spacing.md,
        paddingBottom: Platform.OS === 'ios' ? theme.spacing.xl : theme.spacing.md,
        backgroundColor: theme.colors.surface,
        borderTopWidth: 1,
        borderTopColor: theme.colors.border,
    },
    saveButton: {
        backgroundColor: theme.colors.primary,
        padding: 16,
        borderRadius: theme.borderRadius.md,
        alignItems: 'center',
    },
    saveButtonText: { ...theme.typography.buttonText, color: theme.colors.textInverse },
});
