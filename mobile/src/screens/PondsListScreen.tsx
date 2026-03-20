import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../ThemeContext';
import database from '../database';
import Pond from '../database/models/Pond';
import withObservables from '@nozbe/with-observables';

const PondsList = ({ ponds }: { ponds: Pond[] }) => {
    const navigation = useNavigation<any>();
    const { theme } = useTheme();
    const styles = getStyles(theme);

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
                    renderItem={({ item }) => (
                        <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('AddEditPond', { pondId: item.id })}>
                            <View style={styles.cardTop}>
                                <Text style={styles.cardTitle}>{item.name}</Text>
                                <View style={[styles.badge, (item.status || '').toUpperCase() === 'ACTIVE' ? styles.badgeActive : styles.badgeFallow]}>
                                    <Text style={styles.badgeText}>{item.status}</Text>
                                </View>
                            </View>
                            <Text style={styles.cardMeta}>{item.areaHectares} hectares • {item.waterSourceType}</Text>
                            {item.speciesId ? <Text style={styles.cardMeta}>Species ID: {item.speciesId.slice(0, 8)}...</Text> : null}
                        </TouchableOpacity>
                    )}
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
