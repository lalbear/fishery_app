import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert, KeyboardAvoidingView, Platform, Modal, FlatList, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../ThemeContext';
import database from '../database';
import Pond from '../database/models/Pond';
import * as Location from 'expo-location';
import { v4 as uuidv4 } from 'uuid';
import { speciesService } from '../services/apiService';
import { getSpeciesDisplay } from '../utils/speciesLookup';

const WATER_SOURCES = ['BOREWELL', 'OPEN_WELL', 'CANAL', 'RIVER', 'TANK'];
const SYSTEMS = ['EARTHEN', 'BIOFLOC', 'RAS', 'CAGES', 'PENS'];
const WEEKDAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

type SpeciesOption = {
    label: string;
    value: string;
    scientificName: string;
};

function formatDateInput(timestamp?: number | null): string {
    if (!timestamp) return '';
    const d = new Date(timestamp);
    const year = d.getFullYear();
    const month = `${d.getMonth() + 1}`.padStart(2, '0');
    const day = `${d.getDate()}`.padStart(2, '0');
    return `${year}-${month}-${day}`;
}

function parseDateInput(value: string): Date | null {
    const trimmed = value.trim();
    if (!trimmed) return null;
    const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(trimmed);
    if (!match) return null;

    const parsed = new Date(`${trimmed}T00:00:00`);
    if (Number.isNaN(parsed.getTime())) return null;
    return parsed;
}

function getMonthStart(date: Date): Date {
    return new Date(date.getFullYear(), date.getMonth(), 1);
}

function addDays(date: Date, days: number): Date {
    const next = new Date(date);
    next.setDate(next.getDate() + days);
    return next;
}

function isSameDay(a: Date, b: Date): boolean {
    return a.getFullYear() === b.getFullYear()
        && a.getMonth() === b.getMonth()
        && a.getDate() === b.getDate();
}

function formatDateLabel(value: string): string {
    const parsed = parseDateInput(value);
    if (!parsed) return '';

    return new Intl.DateTimeFormat('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    }).format(parsed);
}

function buildCalendarDays(monthDate: Date) {
    const today = new Date();
    const monthStart = getMonthStart(monthDate);
    const gridStart = addDays(monthStart, -monthStart.getDay());

    return Array.from({ length: 42 }, (_, index) => {
        const date = addDays(gridStart, index);
        const inMonth = date.getMonth() === monthDate.getMonth();
        const isFuture = date.getTime() > new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59, 999).getTime();

        return {
            key: `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`,
            date,
            inMonth,
            isFuture,
        };
    });
}

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
    const [speciesId, setSpeciesId] = useState('');
    const [stockingDate, setStockingDate] = useState('');
    const [lat, setLat] = useState('');
    const [lng, setLng] = useState('');
    const [speciesOptions, setSpeciesOptions] = useState<SpeciesOption[]>([]);
    const [speciesModalVisible, setSpeciesModalVisible] = useState(false);
    const [calendarVisible, setCalendarVisible] = useState(false);
    const [calendarMonth, setCalendarMonth] = useState(() => getMonthStart(new Date()));
    const [isLoadingSpecies, setIsLoadingSpecies] = useState(false);
    const [isGettingLocation, setIsGettingLocation] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const selectedSpecies = getSpeciesDisplay(
        speciesId,
        Object.fromEntries(
            speciesOptions.map(item => [
                item.value,
                { label: item.label, scientificName: item.scientificName },
            ])
        )
    );

    React.useEffect(() => {
        if (existingPondId) loadPond();
    }, [existingPondId]);

    React.useEffect(() => {
        loadSpecies();
    }, []);

    React.useEffect(() => {
        const parsed = parseDateInput(stockingDate);
        if (parsed) {
            setCalendarMonth(getMonthStart(parsed));
        }
    }, [stockingDate]);

    const loadSpecies = async () => {
        try {
            setIsLoadingSpecies(true);
            const response = await speciesService.getAll();
            if (response.success && Array.isArray(response.data)) {
                const options = response.data
                    .map((item: any) => {
                        const data = item.data || {};
                        const commonName = data.common_names?.en || data.scientific_name || 'Unknown Species';
                        const scientificName = data.scientific_name || commonName;
                        return {
                            label: commonName,
                            value: item.id,
                            scientificName,
                        };
                    })
                    .sort((a: SpeciesOption, b: SpeciesOption) => a.label.localeCompare(b.label));
                setSpeciesOptions(options);
            }
        } catch (error) {
            console.error('Failed to load species for pond form', error);
        } finally {
            setIsLoadingSpecies(false);
        }
    };

    const loadPond = async () => {
        try {
            const pond = await database.collections.get<Pond>('ponds').find(existingPondId);
            setName(pond.name);
            setArea(pond.areaHectares.toString());
            setSource(pond.waterSourceType);
            setSystem(pond.systemType);
            setStatus(pond.status);
            setSpeciesId(pond.speciesId || '');
            setStockingDate(formatDateInput(pond.stockingDate));
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
        const parsedStockingDate = parseDateInput(stockingDate);

        if (status === 'ACTIVE' && !speciesId) {
            return Alert.alert('Validation Error', 'Choose a species for active ponds.');
        }

        if (status === 'ACTIVE' && !parsedStockingDate) {
            return Alert.alert('Validation Error', 'Choose a valid stocking date for active ponds.');
        }

        if (parsedStockingDate && parsedStockingDate.getTime() > Date.now()) {
            return Alert.alert('Validation Error', 'Stocking date cannot be in the future.');
        }

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
                        p.speciesId = speciesId || undefined;
                        p.stockingDate = parsedStockingDate ? parsedStockingDate.getTime() : undefined;
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
                        p.speciesId = speciesId || undefined;
                        p.stockingDate = parsedStockingDate ? parsedStockingDate.getTime() : undefined;
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

    const openCalendar = () => {
        const baseDate = parseDateInput(stockingDate) || new Date();
        setCalendarMonth(getMonthStart(baseDate));
        setCalendarVisible(true);
    };

    const handleSelectCalendarDate = (date: Date) => {
        setStockingDate(formatDateInput(date.getTime()));
        setCalendarVisible(false);
    };

    const selectedCalendarDate = parseDateInput(stockingDate);
    const calendarDays = buildCalendarDays(calendarMonth);
    const monthLabel = new Intl.DateTimeFormat('en-IN', { month: 'long', year: 'numeric' }).format(calendarMonth);
    const canGoForward = getMonthStart(calendarMonth).getTime() < getMonthStart(new Date()).getTime();

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

                    <Text style={styles.sectionLabel}>Culture Details</Text>
                    <TouchableOpacity style={styles.selectorField} onPress={() => setSpeciesModalVisible(true)}>
                        <View style={styles.selectorCopy}>
                            <Text style={styles.fieldLabel}>Species</Text>
                            <Text style={[styles.selectorValue, !speciesId && styles.selectorPlaceholder]}>
                                {selectedSpecies?.label || 'Select species'}
                            </Text>
                        </View>
                        {isLoadingSpecies ? (
                            <ActivityIndicator size="small" color={theme.colors.primary} />
                        ) : (
                            <Ionicons name="chevron-down" size={18} color={theme.colors.textMuted} />
                        )}
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.selectorField} onPress={openCalendar}>
                        <View style={styles.selectorCopy}>
                            <Text style={styles.fieldLabel}>Stocking Date</Text>
                            <Text style={[styles.selectorValue, !stockingDate && styles.selectorPlaceholder]}>
                                {formatDateLabel(stockingDate) || 'Choose from calendar'}
                            </Text>
                            <Text style={styles.selectorHint}>
                                {stockingDate ? 'Tap to change the date' : 'Select the date when fish or shrimp were stocked'}
                            </Text>
                        </View>
                        <Ionicons name="calendar-outline" size={20} color={theme.colors.primary} />
                    </TouchableOpacity>
                    <View style={styles.calendarQuickActions}>
                        <TouchableOpacity style={styles.quickActionPill} onPress={() => setStockingDate(formatDateInput(Date.now()))}>
                            <Text style={styles.quickActionText}>Today</Text>
                        </TouchableOpacity>
                        {stockingDate ? (
                            <TouchableOpacity style={styles.quickActionPillMuted} onPress={() => setStockingDate('')}>
                                <Text style={styles.quickActionMutedText}>Clear</Text>
                            </TouchableOpacity>
                        ) : null}
                    </View>
                    <Text style={styles.helperText}>
                        Active ponds should include species and stocking date so harvest progress and alerts can work correctly.
                    </Text>

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

            <Modal visible={speciesModalVisible} transparent animationType="slide" onRequestClose={() => setSpeciesModalVisible(false)}>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalCard}>
                        <Text style={styles.modalTitle}>Select Species</Text>
                        <FlatList
                            data={speciesOptions}
                            keyExtractor={(item) => item.value}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    style={styles.modalItem}
                                    onPress={() => {
                                        setSpeciesId(item.value);
                                        setSpeciesModalVisible(false);
                                    }}
                                >
                                    <Text style={styles.modalItemTitle}>{item.label}</Text>
                                    <Text style={styles.modalItemMeta}>{item.scientificName}</Text>
                                </TouchableOpacity>
                            )}
                            ListEmptyComponent={
                                <Text style={styles.modalEmptyText}>
                                    No species options loaded yet. Make sure the backend is running and species data is available.
                                </Text>
                            }
                        />
                        <TouchableOpacity style={styles.modalCloseButton} onPress={() => setSpeciesModalVisible(false)}>
                            <Text style={styles.modalCloseText}>Close</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            <Modal visible={calendarVisible} transparent animationType="slide" onRequestClose={() => setCalendarVisible(false)}>
                <View style={styles.modalOverlay}>
                    <View style={styles.calendarCard}>
                        <View style={styles.calendarHeader}>
                            <View>
                                <Text style={styles.modalTitle}>Choose Stocking Date</Text>
                                <Text style={styles.calendarSubtitle}>
                                    Pick the day your pond was stocked.
                                </Text>
                            </View>
                            <TouchableOpacity style={styles.calendarIconButton} onPress={() => setCalendarVisible(false)}>
                                <Ionicons name="close" size={18} color={theme.colors.textPrimary} />
                            </TouchableOpacity>
                        </View>

                        <View style={styles.calendarMonthRow}>
                            <TouchableOpacity
                                style={styles.calendarArrowButton}
                                onPress={() => setCalendarMonth((current) => new Date(current.getFullYear(), current.getMonth() - 1, 1))}
                            >
                                <Ionicons name="chevron-back" size={18} color={theme.colors.textPrimary} />
                            </TouchableOpacity>
                            <Text style={styles.calendarMonthLabel}>{monthLabel}</Text>
                            <TouchableOpacity
                                style={[styles.calendarArrowButton, !canGoForward && styles.calendarArrowButtonDisabled]}
                                onPress={() => {
                                    if (canGoForward) {
                                        setCalendarMonth((current) => new Date(current.getFullYear(), current.getMonth() + 1, 1));
                                    }
                                }}
                                disabled={!canGoForward}
                            >
                                <Ionicons name="chevron-forward" size={18} color={canGoForward ? theme.colors.textPrimary : theme.colors.textMuted} />
                            </TouchableOpacity>
                        </View>

                        <View style={styles.weekdayRow}>
                            {WEEKDAY_LABELS.map((label) => (
                                <Text key={label} style={styles.weekdayLabel}>{label}</Text>
                            ))}
                        </View>

                        <View style={styles.calendarGrid}>
                            {calendarDays.map((day) => {
                                const isSelected = selectedCalendarDate ? isSameDay(day.date, selectedCalendarDate) : false;
                                const isToday = isSameDay(day.date, new Date());

                                return (
                                    <TouchableOpacity
                                        key={day.key}
                                        style={[
                                            styles.calendarDay,
                                            !day.inMonth && styles.calendarDayOutside,
                                            isSelected && styles.calendarDaySelected,
                                            isToday && !isSelected && styles.calendarDayToday,
                                            day.isFuture && styles.calendarDayDisabled,
                                        ]}
                                        onPress={() => handleSelectCalendarDate(day.date)}
                                        disabled={day.isFuture}
                                    >
                                        <Text
                                            style={[
                                                styles.calendarDayText,
                                                !day.inMonth && styles.calendarDayTextOutside,
                                                isSelected && styles.calendarDayTextSelected,
                                                day.isFuture && styles.calendarDayTextDisabled,
                                            ]}
                                        >
                                            {day.date.getDate()}
                                        </Text>
                                    </TouchableOpacity>
                                );
                            })}
                        </View>

                        <View style={styles.calendarFooter}>
                            <TouchableOpacity style={styles.quickActionPill} onPress={() => handleSelectCalendarDate(new Date())}>
                                <Text style={styles.quickActionText}>Use today</Text>
                            </TouchableOpacity>
                            {stockingDate ? (
                                <TouchableOpacity
                                    style={styles.quickActionPillMuted}
                                    onPress={() => {
                                        setStockingDate('');
                                        setCalendarVisible(false);
                                    }}
                                >
                                    <Text style={styles.quickActionMutedText}>Clear date</Text>
                                </TouchableOpacity>
                            ) : null}
                        </View>
                    </View>
                </View>
            </Modal>
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
    selectorField: {
        minHeight: 64,
        borderRadius: 14,
        backgroundColor: theme.colors.surface,
        borderWidth: 1,
        borderColor: theme.colors.border,
        paddingHorizontal: 14,
        marginBottom: 14,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 12,
    },
    selectorCopy: {
        flex: 1,
    },
    selectorValue: {
        color: theme.colors.textPrimary,
        fontSize: 15,
        fontWeight: '700',
    },
    selectorPlaceholder: {
        color: theme.colors.textMuted,
        fontWeight: '500',
    },
    selectorHint: {
        color: theme.colors.textMuted,
        fontSize: 12,
        lineHeight: 18,
        marginTop: 4,
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
    helperText: {
        color: theme.colors.textMuted,
        fontSize: 12,
        lineHeight: 18,
        marginBottom: 14,
    },
    calendarQuickActions: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        marginTop: -2,
        marginBottom: 10,
    },
    quickActionPill: {
        paddingHorizontal: 14,
        paddingVertical: 9,
        borderRadius: 999,
        backgroundColor: theme.colors.primary,
    },
    quickActionText: {
        color: theme.colors.textInverse,
        fontWeight: '800',
        fontSize: 12,
    },
    quickActionPillMuted: {
        paddingHorizontal: 14,
        paddingVertical: 9,
        borderRadius: 999,
        backgroundColor: theme.colors.surfaceAlt,
        borderWidth: 1,
        borderColor: theme.colors.border,
    },
    quickActionMutedText: {
        color: theme.colors.textPrimary,
        fontWeight: '700',
        fontSize: 12,
    },
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
    modalOverlay: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0,0,0,0.45)',
    },
    modalCard: {
        backgroundColor: theme.colors.surface,
        borderTopLeftRadius: 22,
        borderTopRightRadius: 22,
        padding: 20,
        maxHeight: '72%',
    },
    calendarCard: {
        backgroundColor: theme.colors.surface,
        borderTopLeftRadius: 26,
        borderTopRightRadius: 26,
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 24,
    },
    modalTitle: {
        color: theme.colors.textPrimary,
        fontSize: 20,
        fontWeight: '800',
        marginBottom: 14,
    },
    calendarHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        gap: 12,
        marginBottom: 18,
    },
    calendarSubtitle: {
        color: theme.colors.textSecondary,
        fontSize: 13,
        lineHeight: 18,
        marginTop: -6,
    },
    calendarIconButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: theme.colors.surfaceAlt,
    },
    calendarMonthRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 14,
    },
    calendarArrowButton: {
        width: 38,
        height: 38,
        borderRadius: 19,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: theme.colors.surfaceAlt,
    },
    calendarArrowButtonDisabled: {
        opacity: 0.45,
    },
    calendarMonthLabel: {
        color: theme.colors.textPrimary,
        fontSize: 18,
        fontWeight: '800',
    },
    weekdayRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
        paddingHorizontal: 4,
    },
    weekdayLabel: {
        width: `${100 / 7}%`,
        textAlign: 'center',
        color: theme.colors.textMuted,
        fontSize: 12,
        fontWeight: '700',
    },
    calendarGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginHorizontal: -2,
    },
    calendarDay: {
        width: '14.2857%',
        aspectRatio: 1,
        padding: 4,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 16,
        marginBottom: 6,
    },
    calendarDayOutside: {
        opacity: 0.45,
    },
    calendarDaySelected: {
        backgroundColor: theme.colors.primary,
    },
    calendarDayToday: {
        borderWidth: 1,
        borderColor: theme.colors.primary,
        backgroundColor: theme.colors.primaryLight,
    },
    calendarDayDisabled: {
        opacity: 0.3,
    },
    calendarDayText: {
        color: theme.colors.textPrimary,
        fontSize: 14,
        fontWeight: '700',
    },
    calendarDayTextOutside: {
        color: theme.colors.textMuted,
    },
    calendarDayTextSelected: {
        color: theme.colors.textInverse,
    },
    calendarDayTextDisabled: {
        color: theme.colors.textMuted,
    },
    calendarFooter: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        marginTop: 14,
    },
    modalItem: {
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.border,
    },
    modalItemTitle: {
        color: theme.colors.textPrimary,
        fontWeight: '700',
        fontSize: 15,
    },
    modalItemMeta: {
        color: theme.colors.textMuted,
        marginTop: 4,
    },
    modalEmptyText: {
        color: theme.colors.textSecondary,
        lineHeight: 20,
        marginVertical: 20,
    },
    modalCloseButton: {
        marginTop: 14,
        height: 50,
        borderRadius: 14,
        backgroundColor: theme.colors.surfaceAlt,
        alignItems: 'center',
        justifyContent: 'center',
    },
    modalCloseText: {
        color: theme.colors.textPrimary,
        fontWeight: '800',
    },
});
