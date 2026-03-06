/**
 * Map Screen - Web Placeholder
 */

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../ThemeContext';

export default function MapScreen() {
    const { theme } = useTheme();
    const styles = getStyles(theme);
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
                    <Ionicons name="map-outline" size={64} color={theme.colors.primary} />
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
                        <Text style={[styles.score, { color: suitabilityScore > 70 ? theme.colors.success : suitabilityScore > 50 ? theme.colors.accent : theme.colors.error }]}>
                            {suitabilityScore}/100
                        </Text>
                        <Text style={styles.waterType}>{t('maps.freshwater')}</Text>
                    </View>
                )}
            </View>
        </View>
    );
}

const getStyles = (theme: any) => StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.colors.background },
    header: { padding: 16, backgroundColor: theme.colors.surface },
    title: { fontSize: 24, fontWeight: 'bold', color: theme.colors.primary },
    subtitle: { fontSize: 14, color: theme.colors.textMuted, marginTop: 4 },
    mapContainer: { flex: 1, margin: 16, backgroundColor: theme.colors.surface, borderRadius: 12, overflow: 'hidden' },
    webPlaceholder: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
    placeholderTitle: { fontSize: 18, fontWeight: 'bold', color: theme.colors.textPrimary, marginTop: 16 },
    placeholderText: { fontSize: 14, color: theme.colors.textSecondary, textAlign: 'center', marginTop: 8 },
    controls: { padding: 16 },
    checkButton: { backgroundColor: theme.colors.primary, borderRadius: 8, padding: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
    buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
    resultCard: { backgroundColor: theme.colors.surface, borderRadius: 12, padding: 16, marginTop: 16, alignItems: 'center' },
    resultLabel: { fontSize: 14, color: theme.colors.textSecondary },
    score: { fontSize: 36, fontWeight: 'bold', marginVertical: 8 },
    waterType: { fontSize: 16, color: theme.colors.textPrimary, fontWeight: '500' },
});
