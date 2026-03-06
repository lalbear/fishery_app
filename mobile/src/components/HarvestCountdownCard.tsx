/**
 * HarvestCountdownCard — Shows active pond cycle progress with a countdown ring
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../ThemeContext';

// Culture period in days per species (conservative estimates)
const CULTURE_PERIODS: Record<string, { days: number; label: string }> = {
    'Litopenaeus vannamei': { days: 120, label: 'Vannamei Shrimp' },
    'Penaeus monodon': { days: 150, label: 'Tiger Shrimp' },
    'Labeo rohita': { days: 300, label: 'Rohu' },
    'Catla catla': { days: 300, label: 'Catla' },
    'Cirrhinus mrigala': { days: 300, label: 'Mrigal' },
    'Oreochromis niloticus': { days: 180, label: 'Tilapia' },
    'Pangasianodon hypophthalmus': { days: 200, label: 'Pangasius' },
};

const DEFAULT_CULTURE = { days: 180, label: 'Fish' };

interface Pond {
    id: string;
    name: string;
    species_id?: string | null;
    stocking_date?: number | null;
    status: string;
    area_hectares: number;
}

interface HarvestCountdownCardProps {
    ponds: Pond[];
    onPressPond?: (pond: Pond) => void;
}

function ProgressRing({
    progress,
    size,
    strokeWidth,
    color,
}: {
    progress: number; // 0–1
    size: number;
    strokeWidth: number;
    color: string;
}) {
    const r = (size - strokeWidth) / 2;
    const circ = 2 * Math.PI * r;
    const dash = circ * Math.min(1, Math.max(0, progress));

    return (
        <Svg width={size} height={size} style={{ transform: [{ rotate: '-90deg' }] }}>
            {/* Track */}
            <Circle cx={size / 2} cy={size / 2} r={r} stroke="#E5E7EB" strokeWidth={strokeWidth} fill="none" />
            {/* Progress */}
            <Circle
                cx={size / 2} cy={size / 2} r={r}
                stroke={color}
                strokeWidth={strokeWidth}
                fill="none"
                strokeDasharray={`${dash} ${circ}`}
                strokeLinecap="round"
            />
        </Svg>
    );
}

export default function HarvestCountdownCard({ ponds, onPressPond }: HarvestCountdownCardProps) {
    const { theme } = useTheme();
    const styles = getStyles(theme);

    const activePonds = ponds.filter(p => p.status === 'active' && p.stocking_date);

    if (activePonds.length === 0) return null;

    return (
        <View style={styles.section}>
            <Text style={styles.sectionTitle}>🎣 Active Harvests</Text>
            {activePonds.map(pond => {
                const culture = CULTURE_PERIODS[pond.species_id ?? ''] ?? DEFAULT_CULTURE;
                const now = Date.now();
                const stockingMs = pond.stocking_date!;
                const daysElapsed = Math.max(0, Math.floor((now - stockingMs) / 86400000));
                const daysRemaining = Math.max(0, culture.days - daysElapsed);
                const progress = Math.min(1, daysElapsed / culture.days);
                const isReady = daysRemaining === 0;

                const ringColor = isReady
                    ? theme.colors.success
                    : progress > 0.85
                        ? theme.colors.accent
                        : theme.colors.primary;

                const milestone =
                    daysRemaining === 0
                        ? '🎉 Ready to harvest!'
                        : daysRemaining <= 14
                            ? `⏳ Harvest window in ${daysRemaining} days`
                            : daysElapsed < 30
                                ? '🐟 Early growth stage'
                                : daysElapsed < culture.days * 0.5
                                    ? '📈 Active growth phase'
                                    : '🔄 Final grow-out stage';

                return (
                    <TouchableOpacity
                        key={pond.id}
                        style={styles.card}
                        onPress={() => onPressPond?.(pond)}
                        activeOpacity={0.85}
                    >
                        <View style={styles.ringWrapper}>
                            <ProgressRing
                                progress={progress}
                                size={72}
                                strokeWidth={7}
                                color={ringColor}
                            />
                            <View style={styles.ringCenter}>
                                <Text style={[styles.ringPercent, { color: ringColor }]}>
                                    {Math.round(progress * 100)}%
                                </Text>
                            </View>
                        </View>

                        <View style={styles.info}>
                            <Text style={styles.pondName} numberOfLines={1}>{pond.name}</Text>
                            <Text style={styles.speciesName}>{culture.label}</Text>
                            <Text style={styles.milestone}>{milestone}</Text>
                            <View style={styles.statsRow}>
                                <StatBadge icon="today-outline" label={`Day ${daysElapsed}`} theme={theme} />
                                {!isReady && (
                                    <StatBadge icon="flag-outline" label={`${daysRemaining}d left`} theme={theme} />
                                )}
                                <StatBadge
                                    icon="resize-outline"
                                    label={`${pond.area_hectares.toFixed(1)} ha`}
                                    theme={theme}
                                />
                            </View>
                        </View>

                        <Ionicons name="chevron-forward" size={18} color={theme.colors.border} />
                    </TouchableOpacity>
                );
            })}
        </View>
    );
}

function StatBadge({ icon, label, theme }: { icon: any; label: string; theme: any }) {
    return (
        <View style={{
            flexDirection: 'row', alignItems: 'center', gap: 3,
            backgroundColor: theme.colors.background, borderRadius: 8,
            paddingHorizontal: 6, paddingVertical: 3, marginRight: 4,
        }}>
            <Ionicons name={icon} size={11} color={theme.colors.textMuted} />
            <Text style={{ fontSize: 11, color: theme.colors.textMuted, fontWeight: '500' }}>{label}</Text>
        </View>
    );
}

const getStyles = (theme: any) =>
    StyleSheet.create({
        section: { marginBottom: theme.spacing.md },
        sectionTitle: { ...theme.typography.h3, marginBottom: theme.spacing.sm, paddingHorizontal: theme.spacing.xs },
        card: {
            backgroundColor: theme.colors.surface,
            borderRadius: theme.borderRadius.lg,
            padding: theme.spacing.md,
            flexDirection: 'row',
            alignItems: 'center',
            gap: theme.spacing.md,
            marginBottom: theme.spacing.sm,
            ...theme.shadows.sm,
        },
        ringWrapper: { position: 'relative', width: 72, height: 72, justifyContent: 'center', alignItems: 'center' },
        ringCenter: { position: 'absolute', justifyContent: 'center', alignItems: 'center' },
        ringPercent: { fontSize: 14, fontWeight: '800' },
        info: { flex: 1 },
        pondName: { ...theme.typography.h3, marginBottom: 2 },
        speciesName: { fontSize: 13, color: theme.colors.textSecondary, marginBottom: 4 },
        milestone: { fontSize: 12, color: theme.colors.textSecondary, marginBottom: 6, fontStyle: 'italic' },
        statsRow: { flexDirection: 'row', flexWrap: 'wrap' },
    });
