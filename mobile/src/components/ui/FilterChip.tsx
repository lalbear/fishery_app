import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

type Theme = any;

type FilterChipProps = {
  label: string;
  active: boolean;
  onPress: () => void;
  theme: Theme;
};

export default function FilterChip({ label, active, onPress, theme }: FilterChipProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.base,
        {
          borderColor: theme.colors.border,
          backgroundColor: theme.colors.surface,
        },
        active && {
          borderColor: theme.colors.primary,
          backgroundColor: theme.colors.primaryLight,
        },
      ]}
    >
      <Text
        style={[
          styles.text,
          { color: theme.colors.textSecondary },
          active && { color: theme.colors.textPrimary },
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  text: {
    fontSize: 12,
    fontWeight: '700',
  },
});
