/**
 * WeatherCard — Live weather + pond impact advisory
 * Uses OpenMeteo (free, no API key needed)
 */

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../ThemeContext';

interface WeatherData {
    temperature: number;
    humidity: number;
    precipitationProbability: number;
    windSpeed: number;
    weatherCode: number;
}

// WMO weather code → icon + label
function describeWeather(code: number): { icon: string; label: string } {
    if (code === 0) return { icon: 'sunny', label: 'Clear sky' };
    if (code <= 3) return { icon: 'partly-sunny', label: 'Partly cloudy' };
    if (code <= 48) return { icon: 'cloud', label: 'Foggy' };
    if (code <= 55) return { icon: 'rainy', label: 'Drizzle' };
    if (code <= 67) return { icon: 'rainy', label: 'Rain' };
    if (code <= 77) return { icon: 'snow', label: 'Snow' };
    if (code <= 82) return { icon: 'thunderstorm', label: 'Showers' };
    if (code <= 99) return { icon: 'thunderstorm', label: 'Thunderstorm' };
    return { icon: 'cloud', label: 'Cloudy' };
}

function getPondImpact(weather: WeatherData): { level: 'good' | 'warning' | 'critical'; text: string } {
    const { temperature, precipitationProbability, windSpeed } = weather;

    if (temperature >= 38) {
        return {
            level: 'critical',
            text: `🌡️ Extreme heat (${temperature}°C). DO will drop sharply. Run aerators 24/7 and cut feeding by 50%.`,
        };
    }
    if (precipitationProbability >= 70) {
        return {
            level: 'warning',
            text: `🌧️ Heavy rain likely (${precipitationProbability}% chance). Runoff can spike ammonia. Check water quality after rain.`,
        };
    }
    if (temperature >= 34) {
        return {
            level: 'warning',
            text: `☀️ Hot day (${temperature}°C). Monitor DO every 2 hrs. Aerate from 5–8 AM especially.`,
        };
    }
    if (temperature <= 18) {
        return {
            level: 'warning',
            text: `🥶 Cold snap (${temperature}°C). Fish metabolism slows — reduce feed by 40% today.`,
        };
    }
    if (windSpeed >= 25) {
        return {
            level: 'warning',
            text: `💨 Strong winds (${windSpeed} km/h). Natural surface aeration is high — good for DO levels.`,
        };
    }

    return {
        level: 'good',
        text: `✅ Weather is suitable for fish today. Maintain normal feeding schedule.`,
    };
}

interface WeatherCardProps {
    /** Latitude for weather lookup (default: central India) */
    latitude?: number;
    /** Longitude for weather lookup */
    longitude?: number;
    /** Optional district name for display */
    locationName?: string;
}

export default function WeatherCard({
    latitude = 20.5937,
    longitude = 78.9629,
    locationName = 'Your Region',
}: WeatherCardProps) {
    const { theme } = useTheme();
    const styles = getStyles(theme);

    const [weather, setWeather] = useState<WeatherData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(false);
    const [expanded, setExpanded] = useState(false);

    useEffect(() => {
        fetchWeather();
    }, [latitude, longitude]);

    const fetchWeather = async () => {
        setIsLoading(true);
        setError(false);
        try {
            const url =
                `https://api.open-meteo.com/v1/forecast` +
                `?latitude=${latitude}&longitude=${longitude}` +
                `&current=temperature_2m,relative_humidity_2m,precipitation_probability,wind_speed_10m,weather_code` +
                `&timezone=Asia%2FKolkata&forecast_days=1`;

            const res = await fetch(url);
            const json = await res.json();
            const c = json.current;

            setWeather({
                temperature: Math.round(c.temperature_2m),
                humidity: Math.round(c.relative_humidity_2m),
                precipitationProbability: Math.round(c.precipitation_probability),
                windSpeed: Math.round(c.wind_speed_10m),
                weatherCode: c.weather_code,
            });
        } catch {
            setError(true);
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return (
            <View style={[styles.card, styles.loadingCard]}>
                <ActivityIndicator size="small" color={theme.colors.primary} />
                <Text style={styles.loadingText}>Loading weather…</Text>
            </View>
        );
    }

    if (error || !weather) {
        return (
            <TouchableOpacity style={[styles.card, styles.errorCard]} onPress={fetchWeather}>
                <Ionicons name="cloud-offline-outline" size={24} color={theme.colors.textMuted} />
                <Text style={styles.errorText}>Weather unavailable. Tap to retry.</Text>
            </TouchableOpacity>
        );
    }

    const { icon: weatherIcon, label: weatherLabel } = describeWeather(weather.weatherCode);
    const impact = getPondImpact(weather);

    const impactBg =
        impact.level === 'critical'
            ? theme.isDark ? '#4a1111' : '#FFF0F0'
            : impact.level === 'warning'
                ? theme.isDark ? '#4a2f11' : '#FFFBEB'
                : theme.isDark ? '#0d2e1a' : '#F0FDF4';

    const impactColor =
        impact.level === 'critical'
            ? theme.colors.error
            : impact.level === 'warning'
                ? theme.colors.accent
                : theme.colors.success;

    return (
        <TouchableOpacity style={styles.card} onPress={() => setExpanded(!expanded)} activeOpacity={0.9}>
            {/* Top row */}
            <View style={styles.topRow}>
                <View style={styles.locationRow}>
                    <Ionicons name="location-outline" size={14} color={theme.colors.textMuted} />
                    <Text style={styles.locationText}>{locationName}</Text>
                </View>
                <Ionicons
                    name={expanded ? 'chevron-up' : 'chevron-down'}
                    size={16}
                    color={theme.colors.textMuted}
                />
            </View>

            {/* Main weather row */}
            <View style={styles.mainRow}>
                <View style={styles.tempBlock}>
                    <Ionicons name={weatherIcon as any} size={40} color={theme.colors.accent} />
                    <Text style={styles.tempText}>{weather.temperature}°C</Text>
                </View>
                <View style={styles.statsGrid}>
                    <WeatherStat icon="water-outline" label="Humidity" value={`${weather.humidity}%`} theme={theme} />
                    <WeatherStat icon="umbrella-outline" label="Rain" value={`${weather.precipitationProbability}%`} theme={theme} />
                    <WeatherStat icon="flag-outline" label="Wind" value={`${weather.windSpeed} km/h`} theme={theme} />
                    <WeatherStat icon="partly-sunny-outline" label={weatherLabel} value="" theme={theme} />
                </View>
            </View>

            {/* Pond impact advisory */}
            <View style={[styles.impactBanner, { backgroundColor: impactBg }]}>
                <Text style={[styles.impactText, { color: impactColor }]}>{impact.text}</Text>
            </View>

            {/* Expanded: refresh hint */}
            {expanded && (
                <TouchableOpacity onPress={fetchWeather} style={styles.refreshRow}>
                    <Ionicons name="refresh-outline" size={14} color={theme.colors.primary} />
                    <Text style={styles.refreshText}>Refresh weather</Text>
                </TouchableOpacity>
            )}
        </TouchableOpacity>
    );
}

function WeatherStat({ icon, label, value, theme }: { icon: any; label: string; value: string; theme: any }) {
    return (
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 4 }}>
            <Ionicons name={icon} size={13} color={theme.colors.textSecondary} />
            <Text style={{ fontSize: 12, color: theme.colors.textSecondary }}>
                {value ? `${value} ` : ''}{label}
            </Text>
        </View>
    );
}

const getStyles = (theme: any) =>
    StyleSheet.create({
        card: {
            backgroundColor: theme.colors.surface,
            borderRadius: theme.borderRadius.lg,
            padding: theme.spacing.md,
            ...theme.shadows.sm,
            marginBottom: theme.spacing.md,
        },
        loadingCard: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: theme.spacing.sm,
            padding: theme.spacing.md,
        },
        loadingText: { fontSize: 14, color: theme.colors.textSecondary },
        errorCard: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: theme.spacing.sm,
            padding: theme.spacing.md,
            borderWidth: 1,
            borderColor: theme.colors.border,
            borderStyle: 'dashed',
        },
        errorText: { fontSize: 14, color: theme.colors.textMuted, flex: 1 },
        topRow: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: theme.spacing.sm,
        },
        locationRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
        locationText: { fontSize: 12, color: theme.colors.textMuted, fontWeight: '500' },
        mainRow: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: theme.spacing.md,
            marginBottom: theme.spacing.sm,
        },
        tempBlock: { alignItems: 'center', gap: 4, minWidth: 72 },
        tempText: { fontSize: 28, fontWeight: '800', color: theme.colors.textPrimary },
        statsGrid: { flex: 1, flexWrap: 'wrap', flexDirection: 'row', gap: 0 },
        impactBanner: {
            borderRadius: theme.borderRadius.sm,
            padding: theme.spacing.sm,
            marginTop: theme.spacing.xs,
        },
        impactText: { fontSize: 13, fontWeight: '500', lineHeight: 18 },
        refreshRow: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 4,
            justifyContent: 'center',
            paddingTop: theme.spacing.sm,
        },
        refreshText: { fontSize: 12, color: theme.colors.primary, fontWeight: '500' },
    });
