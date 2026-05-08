import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

type Theme = any;

type SectionCardProps = {
  title: string;
  theme: Theme;
  children: React.ReactNode;
  marginTop?: number;
};

export default function SectionCard({ title, theme, children, marginTop = 14 }: SectionCardProps) {
  return (
    <View style={{ marginTop }}>
      <Text style={[styles.title, { color: theme.colors.textPrimary }]}>{title}</Text>
      <View
        style={[
          styles.card,
          {
            borderColor: theme.colors.border,
            backgroundColor: theme.colors.surface,
          },
        ]}
      >
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    fontWeight: '800',
    fontSize: 16,
    marginBottom: 8,
  },
  card: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 14,
  },
});
