import React, { useState, useEffect } from 'react';
import {
    View, Text, StyleSheet, FlatList, TouchableOpacity,
    ActivityIndicator, RefreshControl, Linking, Image
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../ThemeContext';
import { economicsService } from '../services/apiService';
import { getFeedImageUri, getFeedTypeColor } from '../utils/feedImages';

export default function FeedCatalogScreen() {
    const { theme } = useTheme();
    const styles = getStyles(theme);
    const navigation = useNavigation<any>();
    const [feeds, setFeeds] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const loadData = async () => {
        try {
            const res = await economicsService.getFeed();
            if (res.success) setFeeds(res.data);
        } catch (err) {
            console.error('Failed to load feed catalog', err);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => { loadData(); }, []);

    if (loading) {
        return <View style={styles.center}><ActivityIndicator size="large" color={theme.colors.primary} /></View>;
    }

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.navigate('Main', { screen: 'Home' })}>
                    <Ionicons name="arrow-back" size={22} color={theme.colors.textPrimary} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Feed & Nutrition</Text>
                <View style={{ width: 22 }} />
            </View>

            <FlatList
                data={feeds}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.list}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); loadData(); }} tintColor={theme.colors.primary} />}
                renderItem={({ item }) => <FeedCard item={item} theme={theme} styles={styles} />}
            />
        </SafeAreaView>
    );
}

function FeedCard({ item, theme, styles }: { item: any; theme: any; styles: any }) {
    const [imageError, setImageError] = useState(false);
    // Priority: DB image_url (like equipment) → type-based fallback map
    const imageUri = (item.image_url && !imageError)
        ? item.image_url
        : getFeedImageUri(item.feed_type, item.brand, item.suitable_for, item.name);
    const typeColor = getFeedTypeColor(item.feed_type);

    return (
        <View style={styles.card}>
            {/* Feed image banner */}
            {imageUri && !imageError ? (
                <Image
                    source={{ uri: imageUri }}
                    style={styles.feedImage}
                    resizeMode="cover"
                    onError={() => setImageError(true)}
                />
            ) : (
                <View style={[styles.feedImageFallback, { backgroundColor: typeColor.bg }]}>
                    <Ionicons name="nutrition-outline" size={36} color={typeColor.text} />
                </View>
            )}

            <View style={styles.cardBody}>
                <View style={styles.cardHeader}>
                    <View style={[styles.badge, { backgroundColor: typeColor.bg }]}>
                        <Text style={[styles.badgeText, { color: typeColor.text }]}>{item.feed_type}</Text>
                    </View>
                    <Text style={styles.brandText}>{item.brand}</Text>
                </View>
                <Text style={styles.nameText}>{item.name}</Text>
                <Text style={styles.priceText}>₹{parseFloat(item.cost_per_kg_inr).toFixed(2)} / kg</Text>
                <View style={styles.metrics}>
                    <Metric label="Protein" value={`${item.protein_percent}%`} styles={styles} />
                    <Metric label="Fat" value={`${item.fat_percent}%`} styles={styles} />
                    <Metric label="Pack" value={`${item.packaging_size_kg}kg`} styles={styles} />
                </View>
                <View style={styles.suitableRow}>
                    <Ionicons name="fish-outline" size={13} color={theme.colors.primary} />
                    <Text style={styles.suitableText}>Suitable for: {item.suitable_for}</Text>
                </View>
                <TouchableOpacity
                    style={styles.cta}
                    onPress={() => Linking.openURL(item.shop_url || `https://dir.indiamart.com/search.mp?ss=${encodeURIComponent(`${item.brand} ${item.name}`)}`)}
                >
                    <Ionicons name="cart-outline" size={18} color={theme.colors.textInverse} />
                    <Text style={styles.ctaText}>{item.shop_url ? 'Shop Now' : 'Search Suppliers'}</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

function Metric({ label, value, styles }: any) {
    return (
        <View style={styles.metric}>
            <Text style={styles.metricLabel}>{label}</Text>
            <Text style={styles.metricValue}>{value}</Text>
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
    list: { padding: 16, paddingBottom: 110 },
    card: {
        backgroundColor: theme.colors.surface,
        borderRadius: theme.borderRadius.lg,
        borderWidth: 1,
        borderColor: theme.colors.border,
        marginBottom: 16,
        overflow: 'hidden',
    },
    feedImage: {
        width: '100%',
        height: 140,
    },
    feedImageFallback: {
        height: 140,
        alignItems: 'center',
        justifyContent: 'center',
    },
    cardBody: {
        padding: 16,
    },
    cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    badge: {
        borderRadius: 8,
        paddingHorizontal: 10,
        paddingVertical: 5,
    },
    badgeText: { fontSize: 11, fontWeight: '800' },
    brandText: { color: theme.colors.textMuted, fontWeight: '600' },
    nameText: { color: theme.colors.textPrimary, fontSize: 20, fontWeight: '800', marginTop: 12 },
    priceText: { color: theme.colors.secondary, fontSize: 24, fontWeight: '900', marginTop: 6 },
    metrics: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 16 },
    metric: { flex: 1, alignItems: 'center' },
    metricLabel: { color: theme.colors.textMuted, fontSize: 11, fontWeight: '700' },
    metricValue: { color: theme.colors.textPrimary, fontSize: 16, fontWeight: '800', marginTop: 6 },
    suitableRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginTop: 14,
    },
    suitableText: { color: theme.colors.textSecondary, fontSize: 13, fontStyle: 'italic', flex: 1 },
    cta: {
        height: 48,
        borderRadius: 14,
        backgroundColor: theme.colors.primary,
        marginTop: 16,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        gap: 8,
    },
    ctaText: { color: theme.colors.textInverse, fontWeight: '800' },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.colors.background },
});
