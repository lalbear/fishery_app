import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../ThemeContext';
import database from '../database';
import Pond from '../database/models/Pond';
import withObservables from '@nozbe/with-observables';

const PondsList = ({ ponds }: { ponds: Pond[] }) => {
    const navigation = useNavigation<any>();
    const { theme, isDark } = useTheme();
    const styles = getStyles(theme, isDark);
    const { t } = useTranslation();

    const renderItem = ({ item }: { item: Pond }) => (
        <TouchableOpacity
            style={styles.pondCard}
            onPress={() => navigation.navigate('AddEditPond', { pondId: item.id })}
            activeOpacity={0.8}
        >
            <View style={styles.cardHeader}>
                <View style={styles.titleWrap}>
                    <Ionicons name="fish-outline" size={24} color={theme.colors.primary} />
                    <Text style={styles.pondName}>{item.name}</Text>
                </View>
                <View style={[styles.statusBadge, item.status === 'ACTIVE' ? styles.statusActive : styles.statusFallow]}>
                    <Text style={[styles.statusText, item.status === 'ACTIVE' ? styles.textActive : styles.textFallow]}>
                        {item.status}
                    </Text>
                </View>
            </View>

            <View style={styles.cardBody}>
                <View style={styles.infoRow}>
                    <Ionicons name="expand-outline" size={16} color={theme.colors.textMuted} />
                    <Text style={styles.infoText}>{item.areaHectares} Hectares</Text>
                </View>
                <View style={styles.infoRow}>
                    <Ionicons name="water-outline" size={16} color={theme.colors.textMuted} />
                    <Text style={styles.infoText}>{item.waterSourceType}</Text>
                </View>
                {item.speciesId ? (
                    <View style={styles.infoRow}>
                        <Ionicons name="information-circle-outline" size={16} color={theme.colors.textMuted} />
                        <Text style={styles.infoText}>Stocked Species ID: {item.speciesId.slice(0, 8)}...</Text>
                    </View>
                ) : null}
            </View>
        </TouchableOpacity>
    );

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
                <Text style={styles.headerTitle}>My Ponds</Text>
                <TouchableOpacity
                    style={styles.addButton}
                    onPress={() => navigation.navigate('AddEditPond')}
                    hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
                >
                    <Ionicons name="add" size={24} color={theme.colors.primary} />
                </TouchableOpacity>
            </View>

            {ponds.length === 0 ? (
                <View style={styles.emptyState}>
                    <Ionicons name="water" size={80} color={theme.colors.border} />
                    <Text style={styles.emptyTitle}>No Ponds Yet</Text>
                    <Text style={styles.emptySub}>Add your first pond to start tracking water quality and operations.</Text>
                    <TouchableOpacity style={styles.primaryButton} onPress={() => navigation.navigate('AddEditPond')}>
                        <Text style={styles.primaryButtonText}>Add Pond</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <FlatList
                    data={ponds}
                    keyExtractor={item => item.id}
                    renderItem={renderItem}
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
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
    addButton: { padding: 4 },
    headerTitle: { ...theme.typography.h3, color: theme.colors.textPrimary },

    listContent: { padding: theme.spacing.md },
    pondCard: {
        backgroundColor: theme.colors.surface,
        borderRadius: theme.borderRadius.lg,
        padding: theme.spacing.md,
        marginBottom: theme.spacing.md,
        ...theme.shadows.sm,
        borderWidth: 1,
        borderColor: theme.colors.border,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: theme.spacing.md,
        paddingBottom: theme.spacing.sm,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.border,
    },
    titleWrap: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    pondName: { ...theme.typography.h3, color: theme.colors.textPrimary },

    statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
    statusActive: { backgroundColor: isDark ? '#14532D' : '#DCFCE7' },
    statusFallow: { backgroundColor: isDark ? '#4A1C1C' : '#FEE2E2' },
    statusText: { fontSize: 12, fontWeight: '700', textTransform: 'uppercase' },
    textActive: { color: isDark ? '#4ADE80' : '#166534' },
    textFallow: { color: isDark ? '#FCA5A5' : '#991B1B' },

    cardBody: { gap: 8 },
    infoRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    infoText: { ...theme.typography.body, color: theme.colors.textSecondary },

    emptyState: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: theme.spacing.xl },
    emptyTitle: { ...theme.typography.h2, color: theme.colors.textPrimary, marginTop: theme.spacing.md },
    emptySub: { ...theme.typography.body, color: theme.colors.textSecondary, textAlign: 'center', marginTop: 8, marginBottom: 24 },

    primaryButton: {
        backgroundColor: theme.colors.primary,
        paddingHorizontal: 24,
        paddingVertical: 14,
        borderRadius: theme.borderRadius.md,
        ...theme.shadows.sm,
    },
    primaryButtonText: { ...theme.typography.buttonText, color: theme.colors.textInverse },
});
