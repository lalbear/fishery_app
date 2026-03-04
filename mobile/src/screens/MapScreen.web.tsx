/**
 * Map Screen - Web Placeholder
 */

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';

export default function MapScreen() {
    const { t } = useTranslation();
    const [suitabilityScore, setSuitabilityScore] = useState<number | null>(null);

    const checkSuitability = () => {
        setSuitabilityScore(Math.floor(Math.random() * 40) + 60);
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>{t('maps.title')}</Text>
                <Text style={styles.subtitle}>{t('maps.subtitle')}</Text>
            </View>

            <View style={styles.mapContainer}>
                <View style={styles.webPlaceholder}>
                    <Ionicons name="map-outline" size={64} color="#2E7D32" />
                    <Text style={styles.placeholderTitle}>Map View Not Available on Web</Text>
                    <Text style={styles.placeholderText}>
                        For satellite location intelligence, please use the mobile app on Android or iOS.
                    </Text>
                </View>
            </View>

            <View style={styles.controls}>
                <TouchableOpacity style={styles.checkButton} onPress={checkSuitability}>
                    <Ionicons name="locate-outline" size={20} color="#fff" />
                    <Text style={styles.buttonText}>{t('maps.checkSuitability')}</Text>
                </TouchableOpacity>

                {suitabilityScore && (
                    <View style={styles.resultCard}>
                        <Text style={styles.resultLabel}>{t('maps.suitabilityScore')}</Text>
                        <Text style={[styles.score, { color: suitabilityScore > 70 ? '#4CAF50' : suitabilityScore > 50 ? '#FF9800' : '#F44336' }]}>
                            {suitabilityScore}/100
                        </Text>
                        <Text style={styles.waterType}>{t('maps.freshwater')}</Text>
                    </View>
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f5f5f5' },
    header: { padding: 16, backgroundColor: '#fff' },
    title: { fontSize: 24, fontWeight: 'bold', color: '#1B5E20' },
    subtitle: { fontSize: 14, color: '#666', marginTop: 4 },
    mapContainer: { flex: 1, margin: 16, backgroundColor: '#fff', borderRadius: 12, overflow: 'hidden' },
    webPlaceholder: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
    placeholderTitle: { fontSize: 18, fontWeight: 'bold', color: '#333', marginTop: 16 },
    placeholderText: { fontSize: 14, color: '#666', textAlign: 'center', marginTop: 8 },
    controls: { padding: 16 },
    checkButton: { backgroundColor: '#2E7D32', borderRadius: 8, padding: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
    buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
    resultCard: { backgroundColor: '#fff', borderRadius: 12, padding: 16, marginTop: 16, alignItems: 'center' },
    resultLabel: { fontSize: 14, color: '#666' },
    score: { fontSize: 36, fontWeight: 'bold', marginVertical: 8 },
    waterType: { fontSize: 16, color: '#333', fontWeight: '500' },
});
