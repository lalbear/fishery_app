import React, { useState, useEffect } from 'react';
import {
    View, Text, StyleSheet, ScrollView, TextInput,
    TouchableOpacity, ActivityIndicator, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
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
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

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
    } catch { }
    return { userId: generateUUID(), name: '', phone: '', farmerCategory: 'GENERAL', stateCode: '' };
}

export async function saveProfile(profile: UserProfile): Promise<void> {
    await AsyncStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
}

const FARMER_CATEGORIES: UserProfile['farmerCategory'][] = ['GENERAL', 'WOMEN', 'SC', 'ST'];
const STATES = ['AP', 'AR', 'AS', 'BR', 'GA', 'GJ', 'HR', 'HP', 'JK', 'KA', 'KL', 'MP', 'MH', 'MN', 'OR', 'PB', 'RJ', 'TN', 'TG', 'UP', 'WB'];

export default function PersonalInfoScreen({ navigation }: any) {
    const { theme } = useTheme();
    const styles = getStyles(theme);

    const [userId, setUserId] = useState('');
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [farmerCategory, setFarmerCategory] = useState<UserProfile['farmerCategory']>('GENERAL');
    const [stateCode, setStateCode] = useState('');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

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

    const handleSave = async () => {
        if (!name.trim()) {
            Alert.alert('Name required', 'Please enter your name before saving.');
            return;
        }
        setSaving(true);
        try {
            await saveProfile({ userId, name: name.trim(), phone: phone.trim(), farmerCategory, stateCode });
            Alert.alert('Saved', 'Your profile has been updated.', [
                { text: 'OK', onPress: () => navigation.navigate('Main') },
            ]);
        } catch {
            Alert.alert('Error', 'Could not save profile. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return <View style={styles.center}><ActivityIndicator size="large" color={theme.colors.primary} /></View>;
    }

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.navigate('Main', { screen: 'Profile' })}>
                    <Ionicons name="arrow-back" size={22} color={theme.colors.textPrimary} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Personal Info</Text>
                <View style={{ width: 22 }} />
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                <View style={styles.heroCard}>
                    <View style={styles.avatar}>
                        <Ionicons name="person" size={34} color={theme.colors.textInverse} />
                    </View>
                    <Text style={styles.heroName}>{name || 'Your Name'}</Text>
                    <Text style={styles.heroMeta}>{phone || '+91 --'}</Text>
                </View>

                <Field label="Full Name" value={name} onChangeText={setName} theme={theme} styles={styles} />
                <Field label="Phone Number" value={phone} onChangeText={setPhone} keyboardType="phone-pad" theme={theme} styles={styles} />

                <Text style={styles.sectionLabel}>Farmer Category</Text>
                <View style={styles.segmentRow}>
                    {FARMER_CATEGORIES.map(cat => (
                        <TouchableOpacity key={cat} style={[styles.segment, farmerCategory === cat && styles.segmentActive]} onPress={() => setFarmerCategory(cat)}>
                            <Text style={[styles.segmentText, farmerCategory === cat && styles.segmentTextActive]}>{cat}</Text>
                        </TouchableOpacity>
                    ))}
                </View>

                <Text style={styles.sectionLabel}>Home State</Text>
                <View style={styles.stateRow}>
                    {STATES.map(code => (
                        <TouchableOpacity key={code} style={[styles.stateChip, stateCode === code && styles.stateChipActive]} onPress={() => setStateCode(code)}>
                            <Text style={[styles.stateChipText, stateCode === code && styles.stateChipTextActive]}>{code}</Text>
                        </TouchableOpacity>
                    ))}
                </View>

                <TouchableOpacity style={styles.saveButton} onPress={handleSave} disabled={saving}>
                    {saving ? <ActivityIndicator color={theme.colors.textInverse} /> : <Text style={styles.saveButtonText}>Save Profile</Text>}
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
}

function Field({ label, theme, styles, ...props }: any) {
    return (
        <View style={styles.fieldWrap}>
            <Text style={styles.fieldLabel}>{label}</Text>
            <TextInput style={styles.input} placeholderTextColor={theme.colors.textMuted} {...props} />
        </View>
    );
}

const getStyles = (theme: any) => StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.colors.background },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.colors.background },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 14,
    },
    headerTitle: { color: theme.colors.textPrimary, fontSize: 22, fontWeight: '800' },
    content: { padding: 16, paddingBottom: 120 },
    heroCard: {
        alignItems: 'center',
        backgroundColor: theme.colors.surface,
        borderRadius: theme.borderRadius.xl,
        borderWidth: 1,
        borderColor: theme.colors.border,
        padding: 20,
        marginBottom: 18,
    },
    avatar: {
        width: 72,
        height: 72,
        borderRadius: 36,
        backgroundColor: theme.colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
    },
    heroName: { color: theme.colors.textPrimary, fontSize: 22, fontWeight: '800', marginTop: 12 },
    heroMeta: { color: theme.colors.textMuted, marginTop: 4 },
    fieldWrap: { marginBottom: 14 },
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
    sectionLabel: { color: theme.colors.textSecondary, fontWeight: '700', marginTop: 8, marginBottom: 10 },
    segmentRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 10 },
    segment: {
        height: 40,
        borderRadius: 20,
        paddingHorizontal: 14,
        backgroundColor: theme.colors.surface,
        borderWidth: 1,
        borderColor: theme.colors.border,
        alignItems: 'center',
        justifyContent: 'center',
    },
    segmentActive: { backgroundColor: theme.colors.primary, borderColor: theme.colors.primary },
    segmentText: { color: theme.colors.textSecondary, fontWeight: '700', fontSize: 12 },
    segmentTextActive: { color: theme.colors.textInverse },
    stateRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
    stateChip: {
        width: 56,
        height: 38,
        borderRadius: 12,
        backgroundColor: theme.colors.surface,
        borderWidth: 1,
        borderColor: theme.colors.border,
        alignItems: 'center',
        justifyContent: 'center',
    },
    stateChipActive: { backgroundColor: theme.colors.primary, borderColor: theme.colors.primary },
    stateChipText: { color: theme.colors.textSecondary, fontWeight: '700' },
    stateChipTextActive: { color: theme.colors.textInverse },
    saveButton: {
        height: 54,
        borderRadius: 18,
        backgroundColor: theme.colors.primary,
        marginTop: 24,
        alignItems: 'center',
        justifyContent: 'center',
    },
    saveButtonText: { color: theme.colors.textInverse, fontSize: 16, fontWeight: '800' },
});
