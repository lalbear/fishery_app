/**
 * WaterQualityChart — SVG line chart for water quality trends
 * Built with react-native-svg (included in Expo SDK)
 */

import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import Svg, { Path, Line, Rect, Text as SvgText, Defs, LinearGradient, Stop } from 'react-native-svg';
import { useTheme } from '../ThemeContext';

interface DataPoint {
    timestamp: number;
    temperature?: number | null;
    dissolved_oxygen?: number | null;
    ph?: number | null;
    ammonia?: number | null;
}

interface SeriesConfig {
    key: keyof Omit<DataPoint, 'timestamp'>;
    label: string;
    color: string;
    unit: string;
    min: number; // chart y-min
    max: number; // chart y-max
    dangerMin?: number;
    dangerMax?: number;
}

const SERIES: SeriesConfig[] = [
    { key: 'dissolved_oxygen', label: 'DO', color: '#3B82F6', unit: 'mg/L', min: 0, max: 12, dangerMin: 4, dangerMax: 11 },
    { key: 'ph', label: 'pH', color: '#8B5CF6', unit: '', min: 5, max: 10, dangerMin: 6.5, dangerMax: 8.5 },
    { key: 'temperature', label: 'Temp', color: '#F59E0B', unit: '°C', min: 15, max: 40, dangerMin: 20, dangerMax: 34 },
    { key: 'ammonia', label: 'NH₃', color: '#EF4444', unit: 'mg/L', min: 0, max: 1, dangerMax: 0.5 },
];

type TimeRange = '7d' | '30d' | 'all';
const TIME_LABELS: Record<TimeRange, string> = { '7d': '7 Days', '30d': '30 Days', all: 'All' };

const W = 340;
const H = 140;
const PAD_L = 36;
const PAD_R = 12;
const PAD_T = 12;
const PAD_B = 30;
const CHART_W = W - PAD_L - PAD_R;
const CHART_H = H - PAD_T - PAD_B;

function toSvgPath(points: Array<[number, number]>): string {
    if (points.length === 0) return '';
    return points
        .map(([x, y], i) => `${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`)
        .join(' ');
}

function normalize(val: number, min: number, max: number): number {
    return PAD_T + CHART_H - ((val - min) / (max - min)) * CHART_H;
}

interface WaterQualityChartProps {
    readings: DataPoint[];
}

export default function WaterQualityChart({ readings }: WaterQualityChartProps) {
    const { theme } = useTheme();
    const styles = getStyles(theme);
    const [timeRange, setTimeRange] = useState<TimeRange>('7d');
    const [activeSeries, setActiveSeries] = useState<string>('dissolved_oxygen');

    if (readings.length < 2) {
        return (
            <View style={styles.emptyState}>
                <Text style={styles.emptyTitle}>Not enough data</Text>
                <Text style={styles.emptySubtitle}>Log at least 2 readings to see trends</Text>
            </View>
        );
    }

    // Filter by time range
    const now = Date.now();
    const cutoff =
        timeRange === '7d' ? now - 7 * 86400000 :
            timeRange === '30d' ? now - 30 * 86400000 : 0;

    const filtered = readings
        .filter(r => r.timestamp >= cutoff)
        .sort((a, b) => a.timestamp - b.timestamp);

    const series = SERIES.find(s => s.key === activeSeries)!;
    const validPoints = filtered.filter(r => r[series.key] != null) as DataPoint[];

    const tMin = validPoints[0]?.timestamp ?? 0;
    const tMax = validPoints[validPoints.length - 1]?.timestamp ?? 1;
    const tSpan = tMax - tMin || 1;

    const svgPoints = validPoints.map(r => {
        const x = PAD_L + ((r.timestamp - tMin) / tSpan) * CHART_W;
        const val = r[series.key] as number;
        const y = normalize(Math.min(series.max, Math.max(series.min, val)), series.min, series.max);
        return [x, y] as [number, number];
    });

    // Danger zone rect
    const dangerY1 = series.dangerMax != null ? normalize(series.dangerMax, series.min, series.max) : PAD_T;
    const dangerY2 = series.dangerMin != null ? normalize(series.dangerMin, series.min, series.max) : PAD_T + CHART_H;
    const safeHeight = Math.abs(dangerY2 - dangerY1);

    // Y-axis labels
    const yLabels = [series.min, (series.min + series.max) / 2, series.max];

    // X-axis labels (dates)
    const xLabels = validPoints.length >= 2
        ? [validPoints[0], validPoints[Math.floor(validPoints.length / 2)], validPoints[validPoints.length - 1]]
        : validPoints;

    const formatDate = (ts: number) => {
        const d = new Date(ts);
        return `${d.getDate()}/${d.getMonth() + 1}`;
    };

    const gradId = `grad_${activeSeries}`;

    return (
        <View style={styles.container}>
            {/* Time range toggle */}
            <View style={styles.rangeRow}>
                {(['7d', '30d', 'all'] as TimeRange[]).map(r => (
                    <TouchableOpacity
                        key={r}
                        style={[styles.rangeBtn, timeRange === r && { backgroundColor: theme.colors.primary }]}
                        onPress={() => setTimeRange(r)}
                    >
                        <Text style={[styles.rangeBtnText, timeRange === r && { color: '#fff' }]}>{TIME_LABELS[r]}</Text>
                    </TouchableOpacity>
                ))}
            </View>

            {/* Series toggle chips */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.seriesRow}>
                {SERIES.map(s => (
                    <TouchableOpacity
                        key={s.key}
                        style={[styles.chip, activeSeries === s.key as string && { borderColor: s.color, backgroundColor: s.color + '22' }]}
                        onPress={() => setActiveSeries(s.key as string)}
                    >
                        <View style={[styles.chipDot, { backgroundColor: s.color }]} />
                        <Text style={[styles.chipText, activeSeries === s.key as string && { color: s.color, fontWeight: '700' }]}>
                            {s.label} {s.unit ? `(${s.unit})` : ''}
                        </Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>

            {/* SVG chart */}
            <View style={styles.chartContainer}>
                <Svg width={W} height={H}>
                    <Defs>
                        <LinearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
                            <Stop offset="0" stopColor={series.color} stopOpacity="0.25" />
                            <Stop offset="1" stopColor={series.color} stopOpacity="0.02" />
                        </LinearGradient>
                    </Defs>

                    {/* Safe zone band */}
                    {(series.dangerMin != null || series.dangerMax != null) && (
                        <Rect
                            x={PAD_L}
                            y={dangerY1}
                            width={CHART_W}
                            height={safeHeight}
                            fill={theme.colors.success}
                            opacity={0.08}
                        />
                    )}

                    {/* Baseline & grid lines */}
                    {yLabels.map((val, i) => {
                        const y = normalize(val, series.min, series.max);
                        return (
                            <React.Fragment key={i}>
                                <Line
                                    x1={PAD_L} y1={y} x2={PAD_L + CHART_W} y2={y}
                                    stroke={theme.colors.border} strokeWidth="0.5" strokeDasharray="4 4"
                                />
                                <SvgText
                                    x={PAD_L - 4} y={y + 4}
                                    textAnchor="end" fontSize={9}
                                    fill={theme.colors.textMuted}
                                >
                                    {val % 1 === 0 ? val : val.toFixed(1)}
                                </SvgText>
                            </React.Fragment>
                        );
                    })}

                    {/* X-axis labels */}
                    {xLabels.map((r, i) => {
                        const x = PAD_L + ((r.timestamp - tMin) / tSpan) * CHART_W;
                        return (
                            <SvgText
                                key={i}
                                x={x} y={H - 8}
                                textAnchor="middle" fontSize={9}
                                fill={theme.colors.textMuted}
                            >
                                {formatDate(r.timestamp)}
                            </SvgText>
                        );
                    })}

                    {/* Area fill */}
                    {svgPoints.length >= 2 && (
                        <Path
                            d={`${toSvgPath(svgPoints)} L ${svgPoints[svgPoints.length - 1][0]} ${PAD_T + CHART_H} L ${PAD_L} ${PAD_T + CHART_H} Z`}
                            fill={`url(#${gradId})`}
                        />
                    )}

                    {/* Line */}
                    {svgPoints.length >= 2 && (
                        <Path
                            d={toSvgPath(svgPoints)}
                            stroke={series.color}
                            strokeWidth="2.5"
                            fill="none"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    )}

                    {/* Data point dots */}
                    {svgPoints.map(([x, y], i) => (
                        <React.Fragment key={i}>
                            <Line x1={PAD_L} y1={PAD_T} x2={PAD_L} y2={PAD_T + CHART_H} stroke={theme.colors.border} strokeWidth="1" />
                            <Rect x={x - 4} y={y - 4} width={8} height={8} rx={4} fill={series.color} />
                        </React.Fragment>
                    ))}
                </Svg>
            </View>

            {/* Latest reading summary */}
            {validPoints.length > 0 && (() => {
                const latest = validPoints[validPoints.length - 1];
                const val = latest[series.key] as number;
                const isInSafeRange =
                    (series.dangerMin == null || val >= series.dangerMin) &&
                    (series.dangerMax == null || val <= series.dangerMax);
                return (
                    <View style={[styles.latestBanner, { backgroundColor: isInSafeRange ? theme.colors.success + '18' : theme.colors.error + '18' }]}>
                        <Text style={[styles.latestText, { color: isInSafeRange ? theme.colors.success : theme.colors.error }]}>
                            Latest {series.label}: {val.toFixed(2)} {series.unit} — {isInSafeRange ? '✅ Normal' : '⚠️ Out of range'}
                        </Text>
                    </View>
                );
            })()}
        </View>
    );
}

const getStyles = (theme: any) =>
    StyleSheet.create({
        container: { paddingTop: theme.spacing.sm },
        emptyState: { alignItems: 'center', paddingVertical: 32 },
        emptyTitle: { ...theme.typography.h3, color: theme.colors.textSecondary },
        emptySubtitle: { ...theme.typography.body, color: theme.colors.textMuted, marginTop: 4 },
        rangeRow: { flexDirection: 'row', gap: 8, marginBottom: 10 },
        rangeBtn: {
            paddingHorizontal: 14, paddingVertical: 6,
            borderRadius: theme.borderRadius.full,
            borderWidth: 1, borderColor: theme.colors.border,
            backgroundColor: theme.colors.background,
        },
        rangeBtnText: { fontSize: 13, fontWeight: '600', color: theme.colors.textSecondary },
        seriesRow: { marginBottom: 8 },
        chip: {
            flexDirection: 'row', alignItems: 'center', gap: 5,
            paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20,
            borderWidth: 1, borderColor: theme.colors.border,
            backgroundColor: theme.colors.background, marginRight: 8,
        },
        chipDot: { width: 8, height: 8, borderRadius: 4 },
        chipText: { fontSize: 12, color: theme.colors.textSecondary },
        chartContainer: {
            alignItems: 'center',
            backgroundColor: theme.colors.background,
            borderRadius: theme.borderRadius.md,
            padding: theme.spacing.xs,
        },
        latestBanner: {
            borderRadius: theme.borderRadius.sm,
            padding: theme.spacing.sm,
            marginTop: theme.spacing.sm,
            alignItems: 'center',
        },
        latestText: { fontSize: 13, fontWeight: '600' },
    });
