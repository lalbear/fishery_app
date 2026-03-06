import React, { useState, useEffect } from 'react';
import {
    View, Text, StyleSheet, FlatList, TouchableOpacity,
    ActivityIndicator, RefreshControl, Image, Modal, ScrollView, Linking
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../ThemeContext';
import { economicsService } from '../services/apiService';

export default function EquipmentCatalogScreen() {
    const { theme } = useTheme();
    const styles = getStyles(theme);
    const { t } = useTranslation();
    const navigation = useNavigation();
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

    const EquipmentImage = ({ item, isModal = false }: { item: any, isModal?: boolean }) => {
        const [imgError, setImgError] = useState(false);
        const iconSize = isModal ? 48 : 32;

        if (item.image_url && !imgError) {
            return (
                <Image
                    source={{ uri: item.image_url }}
                    style={isModal ? styles.modalFullImage : styles.cardImage}
                    resizeMode={isModal ? "contain" : "cover"}
                    onError={() => setImgError(true)}
                />
            );
        }

        return (
            <Ionicons
                name={item.category === 'AERATION' ? 'options-outline' :
                    item.category === 'TANK' ? 'cube-outline' :
                        item.category === 'CIRCULATION' ? 'sync-outline' :
                            'construct-outline'}
                size={iconSize}
                color={theme.colors.primary}
            />
        );
    };

    const renderItem = ({ item }: { item: any }) => (
        <View style={styles.card}>
            <View style={styles.cardIcon}>
                <EquipmentImage item={item} />
            </View>
            <View style={styles.cardContent}>
                <Text style={styles.categoryText}>{item.category}</Text>
                <Text style={styles.nameText} numberOfLines={2}>{item.name}</Text>
                <Text style={styles.priceText}>Avg. ₹{parseFloat(item.cost_inr).toLocaleString('en-IN')}</Text>

                <View style={styles.specsRow}>
                    <Text style={styles.specLabel}>Lifespan:</Text>
                    <Text style={styles.specValue}>{item.lifespan_years} Years</Text>
                </View>

                <TouchableOpacity style={styles.detailsBtn} onPress={() => setSelectedItem(item)}>
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
                        <Ionicons name="search-outline" size={48} color={theme.colors.textMuted} />
                        <Text style={styles.emptyText}>No equipment found in this category.</Text>
                    </View>
                }
            />

            {/* Equipment Details Modal */}
            <Modal
                visible={!!selectedItem}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setSelectedItem(null)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Equipment Details</Text>
                            <TouchableOpacity onPress={() => setSelectedItem(null)} style={styles.closeBtn}>
                                <Ionicons name="close" size={24} color={theme.colors.textPrimary} />
                            </TouchableOpacity>
                        </View>

                        {selectedItem && (
                            <ScrollView style={styles.modalBody}>
                                <View style={styles.modalIconWrap}>
                                    <EquipmentImage item={selectedItem} isModal />
                                </View>

                                <Text style={styles.modalItemTitle}>{selectedItem.name}</Text>
                                <Text style={styles.modalCategoryBadge}>{selectedItem.category}</Text>

                                <View style={styles.specsContainer}>
                                    <Text style={styles.sectionHeading}>Financials & Lifecycle</Text>
                                    <View style={styles.specDetailRow}>
                                        <Text style={styles.specDetailLabel}>Capital Cost</Text>
                                        <Text style={styles.specDetailValue}>Est. Avg. ₹{parseFloat(selectedItem.cost_inr).toLocaleString('en-IN')}</Text>
                                    </View>
                                    {selectedItem.maintenance_cost_annual_inr && (
                                        <View style={styles.specDetailRow}>
                                            <Text style={styles.specDetailLabel}>Annual Maintenance</Text>
                                            <Text style={styles.specDetailValue}>₹{parseFloat(selectedItem.maintenance_cost_annual_inr).toLocaleString('en-IN')}/yr</Text>
                                        </View>
                                    )}
                                    <View style={styles.specDetailRow}>
                                        <Text style={styles.specDetailLabel}>Expected Lifespan</Text>
                                        <Text style={styles.specDetailValue}>{selectedItem.lifespan_years} Years</Text>
                                    </View>

                                    <Text style={styles.sectionHeading}>Technical Specifications</Text>
                                    {selectedItem.power_consumption_kw && (
                                        <View style={styles.specDetailRow}>
                                            <Text style={styles.specDetailLabel}>Power Consumption</Text>
                                            <Text style={styles.specDetailValue}>{selectedItem.power_consumption_kw} kW</Text>
                                        </View>
                                    )}

                                    {selectedItem.specifications && Object.keys(selectedItem.specifications).map(key => (
                                        <View style={styles.specDetailRow} key={key}>
                                            <Text style={styles.specDetailLabel}>{key.replace(/_/g, ' ').toUpperCase()}</Text>
                                            <Text style={styles.specDetailValue}>{String(selectedItem.specifications[key])}</Text>
                                        </View>
                                    ))}
                                </View>
                            </ScrollView>
                        )}

                        <View style={styles.modalFooter}>
                            <TouchableOpacity
                                style={styles.buyBtn}
                                onPress={() => Linking.openURL(`https://dir.indiamart.com/search.mp?ss=${encodeURIComponent(selectedItem?.name || '')}`)}
                            >
                                <Ionicons name="cart-outline" size={20} color="#fff" />
                                <Text style={styles.buyBtnText}>Search Suppliers (IndiaMART)</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
}

const getStyles = (theme: any) => StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.colors.background },
    header: { backgroundColor: theme.colors.surface, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: theme.colors.border },
    headerTop: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, gap: 12, marginBottom: 16 },
    title: { fontSize: 20, fontWeight: 'bold', color: theme.colors.textPrimary },
    categoriesList: { paddingHorizontal: 16, gap: 8 },
    categoryBtn: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: theme.isDark ? '#2c2c2c' : '#f1f3f5' },
    categoryBtnActive: { backgroundColor: theme.colors.primary },
    categoryBtnText: { fontSize: 12, fontWeight: '600', color: theme.colors.textSecondary },
    categoryBtnTextActive: { color: theme.colors.textInverse },
    list: { padding: 12 },
    card: { flex: 1, margin: 6, backgroundColor: theme.colors.surface, borderRadius: 12, overflow: 'hidden', elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2 },
    cardIcon: { height: 120, backgroundColor: theme.isDark ? '#2a2a2a' : '#e9ecef', justifyContent: 'center', alignItems: 'center' },
    cardImage: { width: '100%', height: '100%' },
    cardContent: { padding: 12 },
    categoryText: { fontSize: 10, color: theme.colors.primary, fontWeight: 'bold', marginBottom: 4 },
    nameText: { fontSize: 14, fontWeight: '600', color: theme.colors.textPrimary, height: 40, marginBottom: 8 },
    priceText: { fontSize: 16, fontWeight: 'bold', color: theme.colors.secondary, marginBottom: 8 },
    specsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
    specLabel: { fontSize: 11, color: theme.colors.textSecondary },
    specValue: { fontSize: 11, fontWeight: '600', color: theme.colors.textPrimary },
    detailsBtn: { borderTopWidth: 1, borderTopColor: theme.colors.border, paddingTop: 8, alignItems: 'center' },
    detailsBtnText: { fontSize: 12, fontWeight: '600', color: theme.colors.primary },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    empty: { padding: 40, alignItems: 'center' },
    emptyText: { marginTop: 12, color: theme.colors.textMuted, textAlign: 'center' },
    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
    modalContent: { backgroundColor: theme.colors.surface, borderTopLeftRadius: 24, borderTopRightRadius: 24, maxHeight: '85%' },
    modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, borderBottomWidth: 1, borderBottomColor: theme.colors.border },
    modalTitle: { fontSize: 18, fontWeight: 'bold', color: theme.colors.textPrimary },
    closeBtn: { padding: 4 },
    modalBody: { padding: 20 },
    modalIconWrap: { width: '100%', height: 200, backgroundColor: theme.isDark ? '#2a2a2a' : '#f8f9fa', borderRadius: 16, overflow: 'hidden', justifyContent: 'center', alignItems: 'center', marginBottom: 20 },
    modalFullImage: { width: '100%', height: '100%' },
    modalItemTitle: { fontSize: 22, fontWeight: 'bold', color: theme.colors.textPrimary, textAlign: 'center', marginBottom: 8 },
    modalCategoryBadge: { alignSelf: 'center', backgroundColor: theme.isDark ? '#1a3a1f' : '#E8F5E9', color: theme.colors.success, paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12, fontSize: 12, fontWeight: '600', marginBottom: 24 },
    specsContainer: { backgroundColor: theme.isDark ? '#1e1e1e' : '#f8f9fa', borderRadius: 16, padding: 16, marginBottom: 20 },
    sectionHeading: { fontSize: 15, fontWeight: 'bold', color: theme.colors.primary, marginTop: 16, marginBottom: 12, textTransform: 'uppercase' },
    specDetailRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: theme.colors.border },
    specDetailLabel: { fontSize: 14, color: theme.colors.textSecondary, flex: 1 },
    specDetailValue: { fontSize: 14, fontWeight: '600', color: theme.colors.textPrimary, textAlign: 'right', flex: 1 },
    modalFooter: { padding: 20, borderTopWidth: 1, borderTopColor: theme.colors.border, backgroundColor: theme.colors.surface },
    buyBtn: { backgroundColor: '#e28743', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 16, borderRadius: 12, gap: 8 },
    buyBtnText: { color: '#fff', fontSize: 16, fontWeight: 'bold' }
});
