import React, { useState, useEffect } from 'react';
import {
    View, Text, StyleSheet, FlatList, TouchableOpacity,
    ActivityIndicator, RefreshControl, ScrollView
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../ThemeContext';
import { economicsService } from '../services/apiService';

export default function FeedCatalogScreen() {
    const { theme } = useTheme();
    const styles = getStyles(theme);
    const { t } = useTranslation();
    const navigation = useNavigation();
    const [feeds, setFeeds] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const loadData = async () => {
        try {
            const res = await economicsService.getFeed();
            if (res.success) {
                setFeeds(res.data);
            }
        } catch (err) {
            console.error('Failed to load feed catalog', err);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const onRefresh = () => {
        setRefreshing(true);
        loadData();
    };

    const renderItem = ({ item }: { item: any }) => (
        <View style={styles.card}>
            <View style={styles.cardHeader}>
                <View style={styles.badge}>
                    <Text style={styles.badgeText}>{item.feed_type}</Text>
                </View>
                <Text style={styles.brandText}>{item.brand}</Text>
            </View>

            <Text style={styles.nameText}>{item.name}</Text>
            <Text style={styles.priceText}>₹{parseFloat(item.cost_per_kg_inr).toFixed(2)} / kg</Text>

            <View style={styles.divider} />

            <View style={styles.specsGrid}>
                <View style={styles.specItem}>
                    <Text style={styles.specLabel}>Protein</Text>
                    <Text style={styles.specValue}>{item.protein_percent}%</Text>
                </View>
                <View style={styles.specItem}>
                    <Text style={styles.specLabel}>Fat</Text>
                    <Text style={styles.specValue}>{item.fat_percent}%</Text>
                </View>
                <View style={styles.specItem}>
                    <Text style={styles.specLabel}>Size</Text>
                    <Text style={styles.specValue}>{item.packaging_size_kg}kg</Text>
                </View>
            </View>

            <Text style={styles.suitableText}>Suitable for: {item.suitable_for}</Text>
        </View>
    );

    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color={theme.colors.primary} />
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                    <Ionicons name="arrow-back" size={24} color={theme.colors.textPrimary} />
                </TouchableOpacity>
                <Text style={styles.title}>Feed & Nutrition</Text>
            </View>

            <FlatList
                data={feeds}
                renderItem={renderItem}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.list}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                ListEmptyComponent={
                    <View style={styles.empty}>
                        <Ionicons name="nutrition-outline" size={48} color={theme.colors.textMuted} />
                        <Text style={styles.emptyText}>No feed products found.</Text>
                    </View>
                }
            />
        </SafeAreaView>
    );
}

const getStyles = (theme: any) => StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.colors.background },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        backgroundColor: theme.colors.surface,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.border
    },
    backBtn: { marginRight: 16 },
    title: { fontSize: 20, fontWeight: 'bold', color: theme.colors.textPrimary },
    list: { padding: 16 },
    card: {
        backgroundColor: theme.colors.surface,
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4
    },
    cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
    badge: { backgroundColor: theme.colors.primaryLight, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
    badgeText: { fontSize: 10, fontWeight: 'bold', color: theme.colors.primary, textTransform: 'uppercase' },
    brandText: { fontSize: 12, color: theme.colors.textSecondary, fontWeight: '500' },
    nameText: { fontSize: 18, fontWeight: '700', color: theme.colors.textPrimary, marginBottom: 4 },
    priceText: { fontSize: 20, fontWeight: '800', color: theme.colors.secondary, marginBottom: 12 },
    divider: { height: 1, backgroundColor: theme.colors.border, marginBottom: 12 },
    specsGrid: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
    specItem: { alignItems: 'center', flex: 1 },
    specLabel: { fontSize: 11, color: theme.colors.textSecondary, marginBottom: 4 },
    specValue: { fontSize: 14, fontWeight: '700', color: theme.colors.textPrimary },
    suitableText: { fontSize: 12, color: theme.colors.textSecondary, fontStyle: 'italic', marginTop: 4 },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    empty: { padding: 40, alignItems: 'center' },
    emptyText: { marginTop: 12, color: theme.colors.textMuted, textAlign: 'center' }
});
