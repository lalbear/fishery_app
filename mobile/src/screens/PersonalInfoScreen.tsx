/**
 * Personal Info Screen
 * Lets the user view and edit their name, phone, farmer category, and state.
 * Data is persisted locally via AsyncStorage (no auth required).
 */

import React, { useState, useEffect } from 'react';
import {
    View, Text, StyleSheet, ScrollView, TextInput,
    TouchableOpacity, ActivityIndicator, Alert, Platform,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../ThemeContext';

const PROFILE_KEY = '@fishing_god_profile';

export interface UserProfile {
    userId: string;
    name: string;
    phone: string;
    farmerCategory: 'GENERAL' | 'WOMEN' | 'SC' | 'ST';
    stateCode: string;
}

function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

const FARMER_CATEGORIES: { value: UserProfile['farmerCategory']; label: string }[] = [
    { value: 'GENERAL', label: 'General' },
    { value: 'WOMEN', label: 'Women' },
    { value: 'SC', label: 'SC — Scheduled Caste' },
    { value: 'ST', label: 'ST — Scheduled Tribe' },
];

const STATES = [
    { value: 'AP', label: 'Andhra Pradesh' },
    { value: 'AR', label: 'Arunachal Pradesh' },
    { value: 'AS', label: 'Assam' },
    { value: 'BR', label: 'Bihar' },
    { value: 'GA', label: 'Goa' },
    { value: 'GJ', label: 'Gujarat' },
    { value: 'HR', label: 'Haryana' },
    { value: 'HP', label: 'Himachal Pradesh' },
    { value: 'JK', label: 'Jammu & Kashmir' },
    { value: 'KA', label: 'Karnataka' },
    { value: 'KL', label: 'Kerala' },
    { value: 'MP', label: 'Madhya Pradesh' },
    { value: 'MH', label: 'Maharashtra' },
    { value: 'MN', label: 'Manipur' },
    { value: 'OR', label: 'Odisha' },
    { value: 'PB', label: 'Punjab' },
    { value: 'RJ', label: 'Rajasthan' },
    { value: 'TN', label: 'Tamil Nadu' },
    { value: 'TG', label: 'Telangana' },
    { value: 'UP', label: 'Uttar Pradesh' },
    { value: 'WB', label: 'West Bengal' },
];

/** Load saved profile, or return defaults */
export async function loadProfile(): Promise<UserProfile> {
    try {
        const json = await AsyncStorage.getItem(PROFILE_KEY);
        if (json) {
            const p = JSON.parse(json) as UserProfile;
            if (!p.userId) {
                p.userId = generateUUID();
                await saveProfile(p);
            }
            return p;
        }
    } catch (_) { }
    return { userId: generateUUID(), name: '', phone: '', farmerCategory: 'GENERAL', stateCode: '' };
}

/** Persist profile */
export async function saveProfile(profile: UserProfile): Promise<void> {
    await AsyncStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
}

interface Props {
    navigation: any;
}

export default function PersonalInfoScreen({ navigation }: Props) {
    const { t } = useTranslation();
    const { theme } = useTheme();
    const styles = getStyles(theme);

    const [userId, setUserId] = useState('');
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [farmerCategory, setFarmerCategory] = useState<UserProfile['farmerCategory']>('GENERAL');
    const [stateCode, setStateCode] = useState('');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [dirty, setDirty] = useState(false);

    // Track if field was touched for validation
    const [touchedName, setTouchedName] = useState(false);

    useEffect(() => {
        loadProfile().then(p => {
            setUserId(p.userId);
            setName(p.name);
            setPhone(p.phone);
            setFarmerCategory(p.farmerCategory);
            setStateCode(p.stateCode);
            setLoading(false);
        });
    }, []);

    const markDirty = () => setDirty(true);

    const handleSave = async () => {
        setTouchedName(true);
        if (!name.trim()) {
            Alert.alert('Name required', 'Please enter your name before saving.');
            return;
        }
        setSaving(true);
        try {
            await saveProfile({ userId, name: name.trim(), phone: phone.trim(), farmerCategory, stateCode });
            setDirty(false);
            Alert.alert('✓ Saved', 'Your profile has been updated.', [
                { text: 'OK', onPress: () => navigation.goBack() },
            ]);
        } catch (e) {
            Alert.alert('Error', 'Could not save profile. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color={theme.colors.primary} />
            </View>
        );
    }

    const selectedStateName = STATES.find(s => s.value === stateCode)?.label || 'Select State';

    return (
        <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 60 }} keyboardShouldPersistTaps="handled">
            {/* Header */}
            <View style={styles.hero}>
                <View style={styles.avatar}>
                    <Ionicons name="person" size={40} color={theme.colors.textInverse} />
                </View>
                <Text style={styles.heroTitle}>{name || 'Your Name'}</Text>
                <Text style={styles.heroSub}>{phone || '+91 —'}</Text>
            </View>

            {/* Form Card */}
            <View style={styles.card}>
                <Text style={styles.sectionTitle}>Edit Information</Text>

                {/* Name */}
                <View style={styles.fieldGroup}>
                    <Text style={styles.label}>Full Name *</Text>
                    <View style={[styles.inputRow, touchedName && !name.trim() && styles.inputError]}>
                        <Ionicons name="person-outline" size={18} color={theme.colors.textMuted} style={styles.inputIcon} />
                        <TextInput
                            style={styles.input}
                            placeholder="e.g. Ramesh Kumar"
                            placeholderTextColor={theme.colors.textMuted}
                            value={name}
                            onChangeText={v => { setName(v); markDirty(); setTouchedName(true); }}
                            returnKeyType="next"
                        />
                    </View>
                    {touchedName && !name.trim() && (
                        <Text style={styles.errorText}>Name cannot be empty</Text>
                    )}
                </View>

                {/* Phone */}
                <View style={styles.fieldGroup}>
                    <Text style={styles.label}>Phone Number</Text>
                    <View style={styles.inputRow}>
                        <Ionicons name="call-outline" size={18} color={theme.colors.textMuted} style={styles.inputIcon} />
                        <TextInput
                            style={styles.input}
                            placeholder="e.g. 9876543210"
                            placeholderTextColor={theme.colors.textMuted}
                            value={phone}
                            onChangeText={v => { setPhone(v); markDirty(); }}
                            keyboardType="phone-pad"
                            maxLength={10}
                        />
                    </View>
                </View>

                {/* Farmer Category */}
                <View style={styles.fieldGroup}>
                    <Text style={styles.label}>Farmer Category</Text>
                    <View style={styles.chipRow}>
                        {FARMER_CATEGORIES.map(cat => (
                            <TouchableOpacity
                                key={cat.value}
                                style={[styles.chip, farmerCategory === cat.value && styles.chipActive]}
                                onPress={() => { setFarmerCategory(cat.value); markDirty(); }}
                            >
                                <Text style={[styles.chipText, farmerCategory === cat.value && styles.chipTextActive]}>
                                    {cat.label}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* State */}
                <View style={styles.fieldGroup}>
                    <Text style={styles.label}>Home State</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.stateScroll}>
                        {STATES.map(s => (
                            <TouchableOpacity
                                key={s.value}
                                style={[styles.stateChip, stateCode === s.value && styles.chipActive]}
                                onPress={() => { setStateCode(s.value); markDirty(); }}
                            >
                                <Text style={[styles.chipText, stateCode === s.value && styles.chipTextActive]}>
                                    {s.label}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                    {stateCode ? (
                        <Text style={styles.selectedState}>✓ {selectedStateName}</Text>
                    ) : null}
                </View>
            </View>

            {/* Save Button */}
            <TouchableOpacity
                style={[styles.saveBtn, !dirty && styles.saveBtnDisabled]}
                onPress={handleSave}
                disabled={saving || !dirty}
                activeOpacity={0.85}
            >
                {saving
                    ? <ActivityIndicator color={theme.colors.surface} />
                    : <><Ionicons name="checkmark-circle-outline" size={20} color={theme.colors.surface} /><Text style={styles.saveBtnText}>Save Changes</Text></>
                }
            </TouchableOpacity>
        </ScrollView>
    );
}

const getStyles = (theme: any) => StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.colors.background },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },

    hero: { backgroundColor: theme.colors.primary, alignItems: 'center', paddingVertical: 28, paddingHorizontal: 16 },
    avatar: { width: 72, height: 72, borderRadius: 36, backgroundColor: 'rgba(255,255,255,0.25)', justifyContent: 'center', alignItems: 'center', marginBottom: 10 },
    heroTitle: { fontSize: 20, fontWeight: '700', color: theme.colors.textInverse },
    heroSub: { fontSize: 14, color: 'rgba(255,255,255,0.8)', marginTop: 2 },

    card: { backgroundColor: theme.colors.surface, margin: 16, borderRadius: 12, padding: 16, elevation: 2 },
    sectionTitle: { fontSize: 13, fontWeight: '700', color: theme.colors.primary, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 16 },

    fieldGroup: { marginBottom: 20 },
    label: { fontSize: 13, fontWeight: '600', color: theme.colors.textSecondary, marginBottom: 8 },

    inputRow: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: theme.colors.border, borderRadius: 8, backgroundColor: theme.colors.background, paddingHorizontal: 4 },
    inputError: { borderColor: theme.colors.error },
    inputIcon: { marginHorizontal: 8 },
    input: { flex: 1, paddingVertical: 12, fontSize: 15, color: theme.colors.textPrimary },
    errorText: { color: theme.colors.error, fontSize: 12, marginTop: 4 },

    chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
    chip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, borderWidth: 1, borderColor: theme.colors.border, backgroundColor: theme.colors.background },
    chipActive: { backgroundColor: theme.colors.primary, borderColor: theme.colors.primary },
    chipText: { fontSize: 13, color: theme.colors.textSecondary, fontWeight: '500' },
    chipTextActive: { color: theme.colors.surface, fontWeight: '700' },

    stateScroll: { marginBottom: 8 },
    stateChip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, borderWidth: 1, borderColor: theme.colors.border, backgroundColor: theme.colors.background, marginRight: 8 },
    selectedState: { fontSize: 13, color: theme.colors.primary, fontWeight: '600', marginTop: 4 },

    saveBtn: { marginHorizontal: 16, marginTop: 8, backgroundColor: theme.colors.primary, borderRadius: 10, padding: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, elevation: 2 },
    saveBtnDisabled: { backgroundColor: theme.colors.border },
    saveBtnText: { color: theme.colors.surface, fontSize: 16, fontWeight: '700' },
});
