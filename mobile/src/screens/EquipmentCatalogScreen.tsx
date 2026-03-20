import React, { useState, useEffect } from 'react';
import {
    View, Text, StyleSheet, FlatList, TouchableOpacity,
    ActivityIndicator, RefreshControl, Image, Modal, ScrollView, Linking
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../ThemeContext';
import { economicsService } from '../services/apiService';

export default function EquipmentCatalogScreen() {
    const { theme } = useTheme();
    const styles = getStyles(theme);
    const navigation = useNavigation<any>();
    const [equipment, setEquipment] = useState<any[]>([]);
    const [filtered, setFiltered] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [activeCategory, setActiveCategory] = useState('ALL');
    const [selectedItem, setSelectedItem] = useState<any>(null);

    const categories = ['ALL', 'AERATION', 'TANK', 'CIRCULATION', 'FILTRATION', 'MONITORING'];

    const loadData = async () => {
        try {
            const res = await economicsService.getEquipment();
            if (res.success) {
                setEquipment(res.data);
                setFiltered(res.data);
            }
        } catch (err) {
            console.error('Failed to load equipment', err);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => { loadData(); }, []);
    useEffect(() => {
        setFiltered(activeCategory === 'ALL' ? equipment : equipment.filter(e => e.category === activeCategory));
    }, [activeCategory, equipment]);

    if (loading) {
        return <View style={styles.center}><ActivityIndicator size="large" color={theme.colors.primary} /></View>;
    }

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.navigate('Main', { screen: 'Home' })}>
                    <Ionicons name="arrow-back" size={22} color={theme.colors.textPrimary} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Equipment Catalog</Text>
                <View style={{ width: 22 }} />
            </View>

            <FlatList
                horizontal
                showsHorizontalScrollIndicator={false}
                data={categories}
                keyExtractor={item => item}
                contentContainerStyle={styles.categoryRow}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={[styles.categoryChip, activeCategory === item && styles.categoryChipActive]}
                        onPress={() => setActiveCategory(item)}
                    >
                        <Text style={[styles.categoryChipText, activeCategory === item && styles.categoryChipTextActive]}>{item}</Text>
                    </TouchableOpacity>
                )}
            />

            <FlatList
                data={filtered}
                keyExtractor={item => item.id}
                numColumns={2}
                contentContainerStyle={styles.list}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); loadData(); }} />}
                renderItem={({ item }) => (
                    <TouchableOpacity style={styles.card} onPress={() => setSelectedItem(item)}>
                        {item.image_url ? (
                            <Image source={{ uri: item.image_url }} style={styles.cardImage} />
                        ) : (
                            <View style={styles.cardImageFallback}>
                                <Ionicons name="construct-outline" size={32} color={theme.colors.primary} />
                            </View>
                        )}
                        <Text style={styles.cardCategory}>{item.category}</Text>
                        <Text style={styles.cardTitle} numberOfLines={2}>{item.name}</Text>
                        <Text style={styles.cardPrice}>Rs {parseFloat(item.cost_inr).toLocaleString('en-IN')}</Text>
                    </TouchableOpacity>
                )}
            />

            <Modal visible={!!selectedItem} transparent animationType="slide" onRequestClose={() => setSelectedItem(null)}>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalCard}>
                        {selectedItem && (
                            <ScrollView>
                                <Text style={styles.modalTitle}>{selectedItem.name}</Text>
                                <Text style={styles.modalMeta}>{selectedItem.category}</Text>
                                <Text style={styles.modalLine}>Capital Cost: Rs {parseFloat(selectedItem.cost_inr).toLocaleString('en-IN')}</Text>
                                <Text style={styles.modalLine}>Expected Lifespan: {selectedItem.lifespan_years} years</Text>
                                {selectedItem.maintenance_cost_annual_inr ? <Text style={styles.modalLine}>Annual Maintenance: Rs {parseFloat(selectedItem.maintenance_cost_annual_inr).toLocaleString('en-IN')}</Text> : null}
                                <TouchableOpacity
                                    style={styles.modalButton}
                                    onPress={() => Linking.openURL(`https://dir.indiamart.com/search.mp?ss=${encodeURIComponent(selectedItem.name || '')}`)}
                                >
                                    <Text style={styles.modalButtonText}>Search Suppliers</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.modalClose} onPress={() => setSelectedItem(null)}>
                                    <Text style={styles.modalCloseText}>Close</Text>
                                </TouchableOpacity>
                            </ScrollView>
                        )}
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
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
    categoryRow: { paddingHorizontal: 16, paddingBottom: 12, gap: 10 },
    categoryChip: {
        height: 36,
        borderRadius: 18,
        paddingHorizontal: 14,
        backgroundColor: theme.colors.surface,
        borderWidth: 1,
        borderColor: theme.colors.border,
        alignItems: 'center',
        justifyContent: 'center',
    },
    categoryChipActive: { backgroundColor: theme.colors.primary, borderColor: theme.colors.primary },
    categoryChipText: { color: theme.colors.textSecondary, fontWeight: '700', fontSize: 12 },
    categoryChipTextActive: { color: theme.colors.textInverse },
    list: { paddingHorizontal: 10, paddingBottom: 120 },
    card: {
        flex: 1,
        margin: 6,
        backgroundColor: theme.colors.surface,
        borderRadius: theme.borderRadius.lg,
        borderWidth: 1,
        borderColor: theme.colors.border,
        overflow: 'hidden',
        paddingBottom: 14,
    },
    cardImage: { width: '100%', height: 120 },
    cardImageFallback: {
        height: 120,
        backgroundColor: theme.colors.surfaceAlt,
        alignItems: 'center',
        justifyContent: 'center',
    },
    cardCategory: {
        marginTop: 12,
        marginHorizontal: 12,
        color: theme.colors.primary,
        fontSize: 11,
        fontWeight: '800',
    },
    cardTitle: {
        marginHorizontal: 12,
        marginTop: 6,
        color: theme.colors.textPrimary,
        fontSize: 15,
        fontWeight: '700',
    },
    cardPrice: {
        marginHorizontal: 12,
        marginTop: 8,
        color: theme.colors.secondary,
        fontSize: 18,
        fontWeight: '900',
    },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.colors.background },
    modalOverlay: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.5)' },
    modalCard: {
        backgroundColor: theme.colors.surface,
        borderTopLeftRadius: 22,
        borderTopRightRadius: 22,
        padding: 20,
        maxHeight: '70%',
    },
    modalTitle: { color: theme.colors.textPrimary, fontSize: 22, fontWeight: '800' },
    modalMeta: { color: theme.colors.primary, fontWeight: '700', marginTop: 6, marginBottom: 14 },
    modalLine: { color: theme.colors.textSecondary, marginBottom: 10, lineHeight: 22 },
    modalButton: {
        height: 50,
        borderRadius: 14,
        backgroundColor: theme.colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10,
    },
    modalButtonText: { color: theme.colors.textInverse, fontWeight: '800' },
    modalClose: {
        height: 48,
        borderRadius: 14,
        backgroundColor: theme.colors.surfaceAlt,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10,
    },
    modalCloseText: { color: theme.colors.textPrimary, fontWeight: '800' },
});
