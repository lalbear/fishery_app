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

const LOCAL_EQUIPMENT_IMAGES: Record<string, any> = {
    AERATION: require('../assets/equipment/aeration.jpg'),
    FEEDING: require('../assets/equipment/feeding.jpg'),
    TANK: require('../assets/equipment/tank.jpg'),
    CIRCULATION: require('../assets/equipment/circulation.jpg'),
    FILTRATION: require('../assets/equipment/filtration.jpg'),
    MONITORING: require('../assets/equipment/monitoring.jpg'),
    POWER: require('../assets/equipment/power.jpg'),
    '550W Vortex Blower': require('../assets/equipment/blower.jpg'),
};

function getLocalEquipmentImage(item: any): any | null {
    return LOCAL_EQUIPMENT_IMAGES[item.name] || LOCAL_EQUIPMENT_IMAGES[item.category] || null;
}

function getEquipmentVisual(item: any): { icon: keyof typeof Ionicons.glyphMap; accent: string; chip: string } {
    const name = String(item?.name || '').toLowerCase();
    const category = String(item?.category || '').toUpperCase();

    if (name.includes('paddle') || name.includes('aerator') || category === 'AERATION') {
        return { icon: 'refresh-circle-outline', accent: '#23A55A', chip: 'Aeration' };
    }
    if (name.includes('blower')) {
        return { icon: 'speedometer-outline', accent: '#0F9D8A', chip: 'Blower' };
    }
    if (name.includes('tank')) {
        return { icon: 'ellipse-outline', accent: '#3E8EDE', chip: 'Tank' };
    }
    if (name.includes('pump') || category === 'CIRCULATION') {
        return { icon: 'water-outline', accent: '#2577C9', chip: 'Pump' };
    }
    if (name.includes('uv') || category === 'FILTRATION') {
        return { icon: 'sunny-outline', accent: '#A06CFF', chip: 'Filter' };
    }
    if (name.includes('meter') || name.includes('test kit') || category === 'MONITORING') {
        return { icon: 'pulse-outline', accent: '#F08A24', chip: 'Meter' };
    }
    if (name.includes('net')) {
        return { icon: 'grid-outline', accent: '#2D9C72', chip: 'Net' };
    }
    if (name.includes('crate')) {
        return { icon: 'cube-outline', accent: '#9C6B30', chip: 'Crate' };
    }
    if (name.includes('feeder')) {
        return { icon: 'restaurant-outline', accent: '#D97904', chip: 'Feeder' };
    }
    if (name.includes('generator')) {
        return { icon: 'flash-outline', accent: '#C96A2C', chip: 'Power' };
    }

    return { icon: 'construct-outline', accent: '#1F9D55', chip: category || 'Equipment' };
}

function EquipmentArtwork({ item, style }: { item: any; style: any }) {
    const visual = getEquipmentVisual(item);

    return (
        <View style={[style, { backgroundColor: '#EEF5EC' }]}>
            <View style={stylesStatic.artBackdrop} />
            <View style={[stylesStatic.artChip, { backgroundColor: visual.accent }]}>
                <Text style={stylesStatic.artChipText}>{visual.chip}</Text>
            </View>
            <View style={stylesStatic.artIconWrap}>
                <Ionicons name={visual.icon} size={56} color={visual.accent} />
            </View>
            <View style={stylesStatic.artBottomRow}>
                <View style={[stylesStatic.artMiniCard, { borderColor: `${visual.accent}33` }]}>
                    <Ionicons name="leaf-outline" size={16} color={visual.accent} />
                </View>
                <View style={[stylesStatic.artMiniCard, { borderColor: `${visual.accent}33` }]}>
                    <Ionicons name="hardware-chip-outline" size={16} color={visual.accent} />
                </View>
                <View style={[stylesStatic.artMiniCard, { borderColor: `${visual.accent}33` }]}>
                    <Ionicons name="water-outline" size={16} color={visual.accent} />
                </View>
            </View>
        </View>
    );
}

function EquipmentImage({ item, style, fallbackStyle, iconColor }: { item: any; style: any; fallbackStyle: any; iconColor: string }) {
    const localImage = getLocalEquipmentImage(item);
    const [failed, setFailed] = useState(false);

    if (localImage) {
        return <Image source={localImage} style={style} resizeMode="cover" />;
    }

    if (failed || !item.image_url) {
        return <EquipmentArtwork item={item} style={fallbackStyle} />;
    }

    return <Image source={{ uri: item.image_url }} style={style} resizeMode="cover" onError={() => setFailed(true)} />;
}

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
                        <EquipmentImage
                            item={item}
                            style={styles.cardImage}
                            fallbackStyle={styles.cardImageFallback}
                            iconColor={theme.colors.primary}
                        />
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
                                <EquipmentImage
                                    item={selectedItem}
                                    style={styles.modalImage}
                                    fallbackStyle={styles.modalImageFallback}
                                    iconColor={theme.colors.primary}
                                />
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
    modalImage: {
        width: '100%',
        height: 180,
        borderRadius: 18,
        marginBottom: 16,
    },
    modalImageFallback: {
        width: '100%',
        height: 180,
        borderRadius: 18,
        marginBottom: 16,
        backgroundColor: theme.colors.surfaceAlt,
        alignItems: 'center',
        justifyContent: 'center',
    },
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

const stylesStatic = StyleSheet.create({
    artBackdrop: {
        position: 'absolute',
        top: 18,
        left: 18,
        right: 18,
        bottom: 18,
        borderRadius: 20,
        backgroundColor: '#F7FBF5',
    },
    artChip: {
        position: 'absolute',
        top: 12,
        left: 12,
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 999,
    },
    artChipText: {
        color: '#FFFFFF',
        fontSize: 10,
        fontWeight: '800',
        letterSpacing: 0.3,
        textTransform: 'uppercase',
    },
    artIconWrap: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    artBottomRow: {
        position: 'absolute',
        left: 12,
        right: 12,
        bottom: 12,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    artMiniCard: {
        width: 34,
        height: 34,
        borderRadius: 12,
        borderWidth: 1,
        backgroundColor: '#FFFFFFCC',
        alignItems: 'center',
        justifyContent: 'center',
    },
});
