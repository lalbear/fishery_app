import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../ThemeContext';
import database from '../database';
import Pond from '../database/models/Pond';
import withObservables from '@nozbe/with-observables';
import { fetchSpeciesLookup, getSpeciesDisplay, SpeciesLookup } from '../utils/speciesLookup';
import * as ImagePicker from 'expo-image-picker';

const PondsList = ({ ponds }: { ponds: Pond[] }) => {
    const navigation = useNavigation<any>();
    const { theme } = useTheme();
    const styles = getStyles(theme);
    const [speciesLookup, setSpeciesLookup] = useState<SpeciesLookup>({});

    useEffect(() => {
        fetchSpeciesLookup().then(setSpeciesLookup);
    }, []);

    const handleDelete = (pond: Pond) => {
        Alert.alert(
            'Delete pond?',
            `This will remove ${pond.name} from your pond list.${pond.status === 'ACTIVE' ? ' You can add it again later if needed.' : ''}`,
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await database.write(async () => {
                                if (pond.localSyncStatus === 'NEW') {
                                    await pond.destroyPermanently();
                                    return;
                                }

                                await pond.markAsDeleted();
                            });
                        } catch (error: any) {
                            Alert.alert('Delete failed', error?.message || 'Could not remove this pond right now.');
                        }
                    },
                },
            ]
        );
    };

    const formatStockingDate = (timestamp?: number) => {
        if (!timestamp) return null;
        return new Date(timestamp).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
        });
    };

    const saveImageToPond = async (pond: Pond, uri: string) => {
        try {
            await database.write(async () => {
                await pond.update((p) => {
                    p.imageUri = uri;
                });
            });
        } catch (e: any) {
            Alert.alert('Error', 'Failed to update pond photo.');
        }
    };

    const handlePickImage = async (pond: Pond) => {
        Alert.alert(
            'Update Pond Photo',
            'Take a photo of the pond or how the stock looks right now.',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Take Photo',
                    onPress: async () => {
                        const permission = await ImagePicker.requestCameraPermissionsAsync();
                        if (!permission.granted) {
                            Alert.alert('Permission Denied', 'Camera access is required.');
                            return;
                        }
                        const result = await ImagePicker.launchCameraAsync({
                            allowsEditing: true,
                            aspect: [16, 9],
                            quality: 0.5,
                        });
                        if (!result.canceled && result.assets?.length) {
                            saveImageToPond(pond, result.assets[0].uri);
                        }
                    }
                },
                {
                    text: 'Choose from Gallery',
                    onPress: async () => {
                        const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
                        if (!permission.granted) {
                            Alert.alert('Permission Denied', 'Gallery access is required.');
                            return;
                        }
                        const result = await ImagePicker.launchImageLibraryAsync({
                            mediaTypes: ImagePicker.MediaTypeOptions.Images,
                            allowsEditing: true,
                            aspect: [16, 9],
                            quality: 0.5,
                        });
                         if (!result.canceled && result.assets?.length) {
                            saveImageToPond(pond, result.assets[0].uri);
                        }
                    }
                }
            ]
        );
    };

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.navigate('Main', { screen: 'Profile' })}>
                    <Ionicons name="arrow-back" size={22} color={theme.colors.textPrimary} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>My Ponds</Text>
                <TouchableOpacity onPress={() => navigation.navigate('AddEditPond')}>
                    <Ionicons name="add" size={24} color={theme.colors.primary} />
                </TouchableOpacity>
            </View>

            {ponds.length === 0 ? (
                <View style={styles.emptyState}>
                    <Ionicons name="water-outline" size={68} color={theme.colors.textMuted} />
                    <Text style={styles.emptyTitle}>No Ponds Yet</Text>
                    <Text style={styles.emptySub}>Add your first pond to start tracking operations.</Text>
                    <TouchableOpacity style={styles.primaryButton} onPress={() => navigation.navigate('AddEditPond')}>
                        <Text style={styles.primaryButtonText}>Add Pond</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <FlatList
                    data={ponds}
                    keyExtractor={item => item.id}
                    contentContainerStyle={styles.list}
                    renderItem={({ item }) => {
                        const species = getSpeciesDisplay(item.speciesId, speciesLookup);
                        const stockingDate = formatStockingDate(item.stockingDate);

                        return (
                        <View style={styles.card}>
                            <View style={styles.cardTop}>
                                <Text style={styles.cardTitle}>{item.name}</Text>
                                <View style={[styles.badge, (item.status || '').toUpperCase() === 'ACTIVE' ? styles.badgeActive : styles.badgeFallow]}>
                                    <Text style={styles.badgeText}>{(item.status || 'UNKNOWN').toUpperCase()}</Text>
                                </View>
                            </View>
                            <Text style={styles.cardMeta}>{item.areaHectares} hectares • {item.waterSourceType}</Text>
                            {species ? (
                                <View style={styles.infoRow}>
                                    <Ionicons name="fish-outline" size={14} color={theme.colors.primary} />
                                    <Text style={styles.cardMetaStrong}>{species.label}</Text>
                                    {species.scientificName && species.scientificName !== species.label ? (
                                        <Text style={styles.cardMetaSecondary}>({species.scientificName})</Text>
                                    ) : null}
                                </View>
                            ) : (
                                <Text style={styles.cardMetaSecondary}>Species not added yet</Text>
                            )}
                            {stockingDate ? (
                                <View style={styles.infoRow}>
                                    <Ionicons name="calendar-outline" size={14} color={theme.colors.primary} />
                                    <Text style={styles.cardMetaSecondary}>Stocked on {stockingDate}</Text>
                                </View>
                            ) : (
                                <Text style={styles.cardMetaSecondary}>Add a stocking date to unlock harvest tracking</Text>
                            )}

                            <View style={styles.imageSection}>
                                {item.imageUri ? (
                                    <TouchableOpacity style={styles.imageWrapper} onPress={() => handlePickImage(item)}>
                                        <Image source={{ uri: item.imageUri }} style={styles.pondImage} />
                                        <View style={styles.imageOverlay}>
                                            <Ionicons name="camera" size={16} color="#fff" />
                                            <Text style={styles.imageOverlayText}>Update Photo</Text>
                                        </View>
                                    </TouchableOpacity>
                                ) : (
                                    <TouchableOpacity style={styles.noImageContainer} onPress={() => handlePickImage(item)}>
                                        <Ionicons name="camera-outline" size={24} color={theme.colors.textMuted} />
                                        <Text style={styles.noImageText}>Add Pond Photo</Text>
                                    </TouchableOpacity>
                                )}
                            </View>

                            <View style={styles.cardActions}>
                                <TouchableOpacity
                                    style={styles.editButton}
                                    onPress={() => navigation.navigate('AddEditPond', { pondId: item.id })}
                                >
                                    <Ionicons name="create-outline" size={16} color={theme.colors.primary} />
                                    <Text style={styles.editButtonText}>Edit pond</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.deleteButton} onPress={() => handleDelete(item)}>
                                    <Ionicons name="trash-outline" size={16} color={theme.colors.error} />
                                    <Text style={styles.deleteButtonText}>Delete</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    )}}
                />
            )}
        </SafeAreaView>
    );
};

const EnhancedPondsList = withObservables([], () => ({
    ponds: database.collections.get<Pond>('ponds').query().observe(),
}))(PondsList);

export default function PondsListScreen() {
    return <EnhancedPondsList />;
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
    list: { padding: 16, paddingBottom: 120 },
    card: {
        backgroundColor: theme.colors.surface,
        borderWidth: 1,
        borderColor: theme.colors.border,
        borderRadius: theme.borderRadius.lg,
        padding: 16,
        marginBottom: 12,
    },
    cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 12 },
    cardTitle: { flex: 1, color: theme.colors.textPrimary, fontSize: 18, fontWeight: '800' },
    badge: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 12 },
    badgeActive: { backgroundColor: theme.colors.primaryLight },
    badgeFallow: { backgroundColor: theme.colors.accentSoft },
    badgeText: { color: theme.colors.textPrimary, fontWeight: '800', fontSize: 11 },
    cardMeta: { color: theme.colors.textSecondary, marginTop: 10 },
    cardMetaStrong: { color: theme.colors.textPrimary, fontWeight: '700' },
    cardMetaSecondary: { color: theme.colors.textSecondary, marginTop: 8 },
    infoRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 8, flexWrap: 'wrap' },
    cardActions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 16,
        gap: 12,
    },
    editButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        borderRadius: 14,
        borderWidth: 1,
        borderColor: theme.colors.border,
        paddingVertical: 12,
        backgroundColor: theme.colors.surfaceAlt,
    },
    editButtonText: { color: theme.colors.textPrimary, fontWeight: '700' },
    deleteButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        paddingHorizontal: 12,
        paddingVertical: 12,
        borderRadius: 14,
        backgroundColor: theme.colors.errorSoft || `${theme.colors.error}22`,
    },
    deleteButtonText: { color: theme.colors.error, fontWeight: '700' },
    imageSection: { marginTop: 16 },
    imageWrapper: { borderRadius: 12, overflow: 'hidden', height: 160, backgroundColor: theme.colors.surfaceAlt, position: 'relative' },
    pondImage: { width: '100%', height: '100%', resizeMode: 'cover' },
    imageOverlay: { position: 'absolute', bottom: 8, right: 8, backgroundColor: 'rgba(0,0,0,0.6)', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 12, flexDirection: 'row', alignItems: 'center', gap: 4 },
    imageOverlayText: { color: '#fff', fontSize: 12, fontWeight: '700' },
    noImageContainer: { height: 100, borderRadius: 12, borderWidth: 1, borderStyle: 'dashed', borderColor: theme.colors.border, alignItems: 'center', justifyContent: 'center', gap: 6, backgroundColor: theme.colors.surfaceAlt },
    noImageText: { color: theme.colors.textSecondary, fontSize: 13, fontWeight: '600' },
    emptyState: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
    emptyTitle: { color: theme.colors.textPrimary, fontSize: 26, fontWeight: '800', marginTop: 12 },
    emptySub: { color: theme.colors.textSecondary, marginTop: 8, textAlign: 'center' },
    primaryButton: {
        marginTop: 18,
        height: 52,
        borderRadius: 18,
        backgroundColor: theme.colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 24,
    },
    primaryButtonText: { color: theme.colors.textInverse, fontWeight: '800' },
});
