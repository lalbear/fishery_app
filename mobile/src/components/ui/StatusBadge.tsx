import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

type Theme = any;

type StatusBadgeTone = 'high' | 'medium' | 'low' | 'neutral';

type StatusBadgeProps = {
  label: string;
  tone: StatusBadgeTone;
  theme: Theme;
};

const toneColor = (tone: StatusBadgeTone, theme: Theme) => {
  if (tone === 'high') return theme.colors.error;
  if (tone === 'medium') return theme.colors.accent;
  if (tone === 'low') return theme.colors.success;
  return theme.colors.textSecondary;
};

export default function StatusBadge({ label, tone, theme }: StatusBadgeProps) {
  const color = toneColor(tone, theme);
  return (
    <View style={[styles.badge, { backgroundColor: `${color}22` }]}>
      <Text style={[styles.text, { color }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  text: {
    fontSize: 12,
    fontWeight: '800',
  },
});
