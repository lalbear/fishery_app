
import React, { useState, useEffect } from 'react';
import {
    View, Text, StyleSheet, FlatList, TouchableOpacity,
    ActivityIndicator, RefreshControl, Image
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '../theme';
import { economicsService } from '../services/apiService';

export default function EquipmentCatalogScreen() {
    const { t } = useTranslation();
    const navigation = useNavigation();
    const [equipment, setEquipment] = useState<any[]>([]);
    const [filtered, setFiltered] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [activeCategory, setActiveCategory] = useState('ALL');

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

    useEffect(() => {
        loadData();
    }, []);

    useEffect(() => {
        if (activeCategory === 'ALL') {
            setFiltered(equipment);
        } else {
            setFiltered(equipment.filter(e => e.category === activeCategory));
        }
    }, [activeCategory, equipment]);

    const onRefresh = () => {
        setRefreshing(true);
        loadData();
    };

    const renderItem = ({ item }: { item: any }) => (
        <View style={styles.card}>
            <View style={styles.cardIcon}>
                <Ionicons
                    name={item.category === 'AERATION' ? 'options-outline' :
                        item.category === 'TANK' ? 'cube-outline' :
                            item.category === 'CIRCULATION' ? 'sync-outline' :
                                'construct-outline'}
                    size={32}
                    color={theme.colors.primary}
                />
            </View>
            <View style={styles.cardContent}>
                <Text style={styles.categoryText}>{item.category}</Text>
                <Text style={styles.nameText} numberOfLines={2}>{item.name}</Text>
                <Text style={styles.priceText}>₹{parseFloat(item.cost_inr).toLocaleString('en-IN')}</Text>

                <View style={styles.specsRow}>
                    <Text style={styles.specLabel}>Lifespan:</Text>
                    <Text style={styles.specValue}>{item.lifespan_years} Years</Text>
                </View>

                <TouchableOpacity style={styles.detailsBtn}>
                    <Text style={styles.detailsBtnText}>View Details</Text>
                </TouchableOpacity>
            </View>
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
                <View style={styles.headerTop}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Ionicons name="arrow-back" size={24} color={theme.colors.textPrimary} />
                    </TouchableOpacity>
                    <Text style={styles.title}>Equipment Catalog</Text>
                </View>

                <FlatList
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    data={categories}
                    keyExtractor={item => item}
                    contentContainerStyle={styles.categoriesList}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            style={[styles.categoryBtn, activeCategory === item && styles.categoryBtnActive]}
                            onPress={() => setActiveCategory(item)}
                        >
                            <Text style={[styles.categoryBtnText, activeCategory === item && styles.categoryBtnTextActive]}>
                                {item}
                            </Text>
                        </TouchableOpacity>
                    )}
                />
            </View>

            <FlatList
                data={filtered}
                renderItem={renderItem}
                keyExtractor={item => item.id}
                numColumns={2}
                contentContainerStyle={styles.list}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                ListEmptyComponent={
                    <View style={styles.empty}>
                        <Ionicons name="search-outline" size={48} color="#ccc" />
                        <Text style={styles.emptyText}>No equipment found in this category.</Text>
                    </View>
                }
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f8f9fa' },
    header: { backgroundColor: '#fff', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#eee' },
    headerTop: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, gap: 12, marginBottom: 16 },
    title: { fontSize: 20, fontWeight: 'bold', color: theme.colors.textPrimary },
    categoriesList: { paddingHorizontal: 16, gap: 8 },
    categoryBtn: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: '#f1f3f5' },
    categoryBtnActive: { backgroundColor: theme.colors.primary },
    categoryBtnText: { fontSize: 12, fontWeight: '600', color: '#666' },
    categoryBtnTextActive: { color: '#fff' },
    list: { padding: 12 },
    card: { flex: 1, margin: 6, backgroundColor: '#fff', borderRadius: 12, overflow: 'hidden', elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2 },
    cardIcon: { height: 100, backgroundColor: '#e9ecef', justifyContent: 'center', alignItems: 'center' },
    cardContent: { padding: 12 },
    categoryText: { fontSize: 10, color: theme.colors.primary, fontWeight: 'bold', marginBottom: 4 },
    nameText: { fontSize: 14, fontWeight: '600', color: '#333', height: 40, marginBottom: 8 },
    priceText: { fontSize: 16, fontWeight: 'bold', color: theme.colors.secondary, marginBottom: 8 },
    specsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
    specLabel: { fontSize: 11, color: '#999' },
    specValue: { fontSize: 11, fontWeight: '600', color: '#444' },
    detailsBtn: { borderTopWidth: 1, borderTopColor: '#f1f3f5', paddingTop: 8, alignItems: 'center' },
    detailsBtnText: { fontSize: 12, fontWeight: '600', color: theme.colors.primary },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    empty: { padding: 40, alignItems: 'center' },
    emptyText: { marginTop: 12, color: '#999', textAlign: 'center' }
});
