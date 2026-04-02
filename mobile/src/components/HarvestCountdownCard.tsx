/**
 * HarvestCountdownCard — Shows active pond cycle progress with a countdown ring
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../ThemeContext';
import { getHarvestMetrics } from '../utils/pondLifecycle';

interface Pond {
    id: string;
    name: string;
    species_id?: string | null;
    species_name?: string | null;
    species_label?: string | null;
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

    const activePonds = ponds.filter(p => String(p.status || '').toLowerCase() === 'active' && p.stocking_date);

    if (activePonds.length === 0) return null;

    return (
        <View style={styles.section}>
            <Text style={styles.sectionTitle}>🎣 Active Harvests</Text>
            {activePonds.map(pond => {
                const harvest = getHarvestMetrics({
                    stockingDate: pond.stocking_date,
                    speciesScientificName: pond.species_name,
                });
                const displaySpecies = pond.species_label || harvest.culture.label;

                const ringColor = harvest.isReady
                    ? theme.colors.success
                    : harvest.progress > 0.85
                        ? theme.colors.accent
                        : theme.colors.primary;

                const milestone =
                    harvest.daysRemaining === 0
                        ? '🎉 Ready to harvest!'
                        : harvest.daysRemaining <= 14
                            ? `⏳ Harvest window in ${harvest.daysRemaining} days`
                            : harvest.daysElapsed < 30
                                ? '🐟 Early growth stage'
                                : harvest.daysElapsed < harvest.culture.days * 0.5
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
                                progress={harvest.progress}
                                size={72}
                                strokeWidth={7}
                                color={ringColor}
                            />
                            <View style={styles.ringCenter}>
                                <Text style={[styles.ringPercent, { color: ringColor }]}>
                                    {Math.round(harvest.progress * 100)}%
                                </Text>
                            </View>
                        </View>

                        <View style={styles.info}>
                            <Text style={styles.pondName} numberOfLines={1}>{pond.name}</Text>
                            <Text style={styles.speciesName}>{displaySpecies}</Text>
                            <Text style={styles.milestone}>{milestone}</Text>
                            <View style={styles.statsRow}>
                                <StatBadge icon="today-outline" label={`Day ${harvest.daysElapsed}`} theme={theme} />
                                {!harvest.isReady && (
                                    <StatBadge icon="flag-outline" label={`${harvest.daysRemaining}d left`} theme={theme} />
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
