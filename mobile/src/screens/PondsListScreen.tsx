import React, { useEffect, useState } from 'react';
import {
    View, Text, StyleSheet, FlatList, TouchableOpacity,
    Alert, Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../ThemeContext';
import database from '../database';
import Pond from '../database/models/Pond';
import { Q } from '@nozbe/watermelondb';
import withObservables from '@nozbe/with-observables';
import { fetchSpeciesLookup, getSpeciesDisplay, SpeciesLookup } from '../utils/speciesLookup';
import * as ImagePicker from 'expo-image-picker';

// ─── helpers ─────────────────────────────────────────────────────────────────

const formatStockingDate = (timestamp?: number) => {
    if (!timestamp) return null;
    return new Date(timestamp).toLocaleDateString('en-IN', {
        day: 'numeric', month: 'short', year: 'numeric',
    });
};

// ─── PondCard ────────────────────────────────────────────────────────────────

function PondCard({
    item, theme, styles, speciesLookup,
    onEdit, onDelete, onPickImage, t,
}: {
    item: Pond;
    theme: any;
    styles: ReturnType<typeof getStyles>;
    speciesLookup: SpeciesLookup;
    onEdit: () => void;
    onDelete: () => void;
    onPickImage: () => void;
    t: (k: string, opts?: any) => string;
}) {
    const species = getSpeciesDisplay(item.speciesId, speciesLookup);
    const stockingDate = formatStockingDate(item.stockingDate);
    const isActive = (item.status || '').toUpperCase() === 'ACTIVE';

    return (
        <View style={styles.card}>
            {/* ── Hero image section ── */}
            <TouchableOpacity
                activeOpacity={0.85}
                onPress={onPickImage}
                style={styles.heroWrapper}
            >
                {item.imageUri ? (
                    <Image source={{ uri: item.imageUri }} style={styles.heroImage} />
                ) : (
                    <View style={styles.heroPlaceholder}>
                        <Ionicons name="camera-outline" size={32} color={theme.colors.textMuted} />
                        <Text style={styles.heroPlaceholderText}>{t('ponds.tapAddPhoto')}</Text>
                    </View>
                )}
                {/* gradient overlay — simulated with layered semi-transparent Views */}
                <View style={styles.heroGradient} pointerEvents="none">
                    <View style={styles.heroGradientInner} />
                </View>
                <View style={styles.heroOverlayContent}>
                    <Text style={styles.heroTitle} numberOfLines={1}>{item.name}</Text>
                    <View style={[styles.statusBadge, isActive ? styles.statusBadgeActive : styles.statusBadgeFallow]}>
                        <Text style={[styles.statusBadgeText, isActive ? styles.statusBadgeTextActive : styles.statusBadgeTextFallow]}>
                            {t(`ponds.status.${(item.status || 'UNKNOWN').toUpperCase()}`)}
                        </Text>
                    </View>
                </View>

                {/* camera update chip – only when image exists */}
                {item.imageUri ? (
                    <View style={styles.cameraChip}>
                        <Ionicons name="camera" size={13} color="#fff" />
                        <Text style={styles.cameraChipText}>{t('ponds.update')}</Text>
                    </View>
                ) : null}
            </TouchableOpacity>

            {/* ── Card body ── */}
            <View style={styles.cardBody}>
                {/* Section: Stats row */}
                <View style={styles.statsRow}>
                    <View style={styles.statItem}>
                        <Text style={styles.statLabel}>{t('ponds.area')}</Text>
                        <Text style={styles.statValue}>{item.areaHectares ?? '—'}<Text style={styles.statUnit}> {t('common.ha')}</Text></Text>
                    </View>
                    <View style={styles.statDivider} />
                    <View style={styles.statItem}>
                        <Text style={styles.statLabel}>{t('ponds.source')}</Text>
                        <Text style={styles.statValue}>{item.waterSourceType || '—'}</Text>
                    </View>
                    <View style={styles.statDivider} />
                    <View style={styles.statItem}>
                        <Text style={styles.statLabel}>{t('ponds.system')}</Text>
                        <Text style={styles.statValue}>{item.systemType || '—'}</Text>
                    </View>
                </View>

                {/* Section: Species */}
                {species ? (
                    <View style={styles.infoRow}>
                        <Ionicons name="fish-outline" size={14} color={theme.colors.primary} />
                        <Text style={styles.infoLabel}>{species.label}</Text>
                        {species.scientificName && species.scientificName !== species.label ? (
                            <Text style={styles.infoMeta}>({species.scientificName})</Text>
                        ) : null}
                    </View>
                ) : (
                    <View style={styles.infoRow}>
                        <Ionicons name="fish-outline" size={14} color={theme.colors.textMuted} />
                        <Text style={styles.infoMeta}>{t('ponds.speciesNotAdded')}</Text>
                    </View>
                )}

                {/* Section: Stocking date */}
                {stockingDate ? (
                    <View style={styles.infoRow}>
                        <Ionicons name="calendar-outline" size={14} color={theme.colors.primary} />
                        <Text style={styles.infoMeta}>{t('ponds.stockedOn', { date: stockingDate })}</Text>
                    </View>
                ) : (
                    <View style={styles.infoRow}>
                        <Ionicons name="calendar-outline" size={14} color={theme.colors.textMuted} />
                        <Text style={styles.infoMeta}>{t('ponds.addStockingHelp')}</Text>
                    </View>
                )}

                {/* ── Action row ── */}
                <View style={styles.actionRow}>
                    <TouchableOpacity style={styles.editButton} onPress={onEdit}>
                        <Ionicons name="create-outline" size={16} color={theme.colors.primary} />
                        <Text style={styles.editButtonText}>{t('ponds.editPondBtn')}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.deleteButton} onPress={onDelete}>
                        <Ionicons name="trash-outline" size={16} color={theme.colors.error} />
                        <Text style={styles.deleteButtonText}>{t('ponds.deleteBtn')}</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}

// ─── PondsList (inner reactive component) ────────────────────────────────────

const PondsList = ({ ponds }: { ponds: Pond[] }) => {
    const navigation = useNavigation<any>();
    const { theme } = useTheme();
    const { t } = useTranslation();
    const styles = getStyles(theme);
    const [speciesLookup, setSpeciesLookup] = useState<SpeciesLookup>({});

    useEffect(() => {
        fetchSpeciesLookup().then(setSpeciesLookup);
    }, []);

    const handleDelete = (pond: Pond) => {
        Alert.alert(
            t('ponds.deletePondTitle'),
            t('ponds.deletePondBody', { name: pond.name }) + (pond.status === 'ACTIVE' ? t('ponds.deletePondActiveSuffix') : ''),
            [
                { text: t('common.cancel'), style: 'cancel' },
                {
                    text: t('common.delete'),
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
                            Alert.alert(t('ponds.deleteFailed'), error?.message || t('ponds.deleteFailedBody'));
                        }
                    },
                },
            ]
        );
    };

    const saveImageToPond = async (pond: Pond, uri: string) => {
        try {
            await database.write(async () => {
                await pond.update((p) => { p.imageUri = uri; });
            });
        } catch {
            Alert.alert(t('ponds.photoErrorTitle'), t('ponds.photoErrorBody'));
        }
    };

    const handlePickImage = async (pond: Pond) => {
        Alert.alert(
            t('ponds.updatePhoto'),
            t('ponds.updatePhotoBody'),
            [
                { text: t('common.cancel'), style: 'cancel' },
                {
                    text: t('ponds.takePhoto'),
                    onPress: async () => {
                        const permission = await ImagePicker.requestCameraPermissionsAsync();
                        if (!permission.granted) {
                            Alert.alert(t('common.error'), t('ponds.photoErrorBody'));
                            return;
                        }
                        const result = await ImagePicker.launchCameraAsync({ quality: 0.7 });
                        if (!result.canceled && result.assets?.length) {
                            saveImageToPond(pond, result.assets[0].uri);
                        }
                    },
                },
                {
                    text: t('ponds.fromGallery'),
                    onPress: async () => {
                        const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
                        if (!permission.granted) {
                            Alert.alert(t('common.error'), t('ponds.photoErrorBody'));
                            return;
                        }
                        const result = await ImagePicker.launchImageLibraryAsync({
                            mediaTypes: ImagePicker.MediaTypeOptions.Images,
                            quality: 0.7,
                        });
                        if (!result.canceled && result.assets?.length) {
                            saveImageToPond(pond, result.assets[0].uri);
                        }
                    },
                },
            ]
        );
    };

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            {/* ── Header ── */}
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.headerIconBtn}
                    onPress={() => navigation.navigate('Main', { screen: 'Profile' })}
                >
                    <Ionicons name="arrow-back" size={20} color={theme.colors.textPrimary} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>{t('ponds.title')}</Text>
                <TouchableOpacity
                    style={[styles.headerIconBtn, styles.headerAddBtn]}
                    onPress={() => navigation.navigate('AddEditPond')}
                >
                    <Ionicons name="add" size={22} color={theme.colors.textInverse} />
                </TouchableOpacity>
            </View>

            {ponds.length === 0 ? (
                /* ── Empty state ── */
                <View style={styles.emptyState}>
                    <View style={styles.emptyIconWrap}>
                        <Ionicons name="water-outline" size={52} color={theme.colors.primary} />
                    </View>
                    <Text style={styles.emptyTitle}>{t('ponds.noPondsTitle')}</Text>
                    <Text style={styles.emptySub}>
                        {t('ponds.noPondsBody')}
                    </Text>
                    <TouchableOpacity
                        style={styles.primaryButton}
                        onPress={() => navigation.navigate('AddEditPond')}
                    >
                        <Ionicons name="add" size={18} color={theme.colors.textInverse} />
                        <Text style={styles.primaryButtonText}>{t('ponds.addFirstPond')}</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <FlatList
                    data={ponds}
                    keyExtractor={item => item.id}
                    contentContainerStyle={styles.list}
                    renderItem={({ item }) => (
                        <PondCard
                            item={item}
                            theme={theme}
                            styles={styles}
                            speciesLookup={speciesLookup}
                            t={t}
                            onEdit={() => navigation.navigate('AddEditPond', { pondId: item.id })}
                            onDelete={() => handleDelete(item)}
                            onPickImage={() => handlePickImage(item)}
                        />
                    )}
                />
            )}
        </SafeAreaView>
    );
};

// ─── withObservables wrapper ──────────────────────────────────────────────────

const EnhancedPondsList = withObservables([], () => ({
    ponds: database.collections
        .get<Pond>('ponds')
        .query(Q.where('sync_status', Q.notEq('DELETED')))
        .observe(),
}))(PondsList);

export default function PondsListScreen() {
    return <EnhancedPondsList />;
}

// ─── Styles ──────────────────────────────────────────────────────────────────

const getStyles = (theme: any) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },

    // Header
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    headerIconBtn: {
        width: 38,
        height: 38,
        borderRadius: 19,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: theme.colors.surfaceAlt,
        borderWidth: 1,
        borderColor: theme.colors.borderGlass,
    },
    headerAddBtn: {
        backgroundColor: theme.colors.primary,
        borderColor: theme.colors.primary,
    },
    headerTitle: {
        color: theme.colors.textPrimary,
        fontSize: 22,
        fontWeight: '800',
        letterSpacing: -0.3,
    },

    // List
    list: {
        paddingHorizontal: 16,
        paddingTop: 8,
        paddingBottom: 120,
        gap: 16,
    },

    // Card shell
    card: {
        backgroundColor: theme.colors.surface,
        borderRadius: theme.borderRadius.lg,
        borderWidth: 1,
        borderColor: theme.colors.borderGlass,
        overflow: 'hidden',
        ...theme.shadows.md,
    },

    // Hero image
    heroWrapper: {
        height: 180,
        backgroundColor: theme.colors.surfaceAlt,
        position: 'relative',
    },
    heroImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    heroPlaceholder: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
    },
    heroPlaceholderText: {
        color: theme.colors.textMuted,
        fontSize: 13,
        fontWeight: '600',
    },
    heroGradient: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        height: 90,
    },
    heroGradientInner: {
        flex: 1,
        backgroundColor: 'rgba(11,19,38,0.75)',
    },
    heroOverlayContent: {
        position: 'absolute',
        left: 14,
        right: 14,
        bottom: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 10,
    },
    heroTitle: {
        flex: 1,
        color: '#ffffff',
        fontSize: 18,
        fontWeight: '800',
        letterSpacing: -0.2,
        textShadowColor: 'rgba(0,0,0,0.5)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 4,
    },
    cameraChip: {
        position: 'absolute',
        top: 10,
        right: 10,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        backgroundColor: 'rgba(0,0,0,0.55)',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 20,
    },
    cameraChipText: {
        color: '#fff',
        fontSize: 11,
        fontWeight: '700',
    },

    // Status badge
    statusBadge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: theme.borderRadius.full,
    },
    statusBadgeActive: {
        backgroundColor: theme.colors.secondary,
    },
    statusBadgeFallow: {
        backgroundColor: theme.colors.accentSoft,
        borderWidth: 1,
        borderColor: theme.colors.accent,
    },
    statusBadgeText: {
        fontSize: 10,
        fontWeight: '800',
        letterSpacing: 0.8,
    },
    statusBadgeTextActive: {
        color: theme.colors.textOnSecondary,
    },
    statusBadgeTextFallow: {
        color: theme.colors.accent,
    },

    // Card body
    cardBody: {
        padding: 14,
        gap: 10,
    },

    // Stats row
    statsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: theme.colors.surfaceAlt,
        borderRadius: theme.borderRadius.md,
        paddingVertical: 10,
        paddingHorizontal: 12,
        borderWidth: 1,
        borderColor: theme.colors.borderGlass,
    },
    statItem: {
        flex: 1,
        alignItems: 'center',
        gap: 2,
    },
    statLabel: {
        color: theme.colors.textMuted,
        fontSize: 9,
        fontWeight: '700',
        letterSpacing: 1.5,
    },
    statValue: {
        color: theme.colors.textPrimary,
        fontSize: 13,
        fontWeight: '800',
    },
    statUnit: {
        color: theme.colors.textMuted,
        fontSize: 11,
        fontWeight: '600',
    },
    statDivider: {
        width: 1,
        height: 28,
        backgroundColor: theme.colors.borderGlass,
    },

    // Info rows
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 7,
        flexWrap: 'wrap',
    },
    infoLabel: {
        color: theme.colors.textPrimary,
        fontSize: 13,
        fontWeight: '700',
    },
    infoMeta: {
        color: theme.colors.textSecondary,
        fontSize: 12,
    },

    // Action row
    actionRow: {
        flexDirection: 'row',
        gap: 10,
        marginTop: 4,
    },
    editButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        paddingVertical: 11,
        borderRadius: theme.borderRadius.md,
        backgroundColor: theme.colors.surfaceAlt,
        borderWidth: 1,
        borderColor: theme.colors.border,
    },
    editButtonText: {
        color: theme.colors.primary,
        fontWeight: '700',
        fontSize: 13,
    },
    deleteButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        paddingHorizontal: 16,
        paddingVertical: 11,
        borderRadius: theme.borderRadius.md,
        backgroundColor: theme.colors.errorSoft,
        borderWidth: 1,
        borderColor: theme.colors.error,
    },
    deleteButtonText: {
        color: theme.colors.error,
        fontWeight: '700',
        fontSize: 13,
    },

    // Empty state
    emptyState: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 32,
        gap: 12,
    },
    emptyIconWrap: {
        width: 96,
        height: 96,
        borderRadius: 48,
        backgroundColor: theme.colors.primaryLight,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 4,
    },
    emptyTitle: {
        color: theme.colors.textPrimary,
        fontSize: 26,
        fontWeight: '800',
        letterSpacing: -0.3,
    },
    emptySub: {
        color: theme.colors.textSecondary,
        textAlign: 'center',
        lineHeight: 20,
        fontSize: 14,
    },
    primaryButton: {
        marginTop: 8,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        height: 52,
        borderRadius: theme.borderRadius.lg,
        backgroundColor: theme.colors.primary,
        paddingHorizontal: 28,
        ...theme.shadows.glow,
    },
    primaryButtonText: {
        color: theme.colors.textInverse,
        fontWeight: '800',
        fontSize: 15,
    },
});
