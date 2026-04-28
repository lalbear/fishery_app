import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useTheme } from '../ThemeContext';
import ScreenHeader from '../components/ScreenHeader';

function Section({ title, items, theme, styles }: any) {
  if (!items || items.length === 0) return null;
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {items.map((item: string) => (
        <Text key={item} style={styles.bullet}>• {item}</Text>
      ))}
    </View>
  );
}

export default function DiseaseDetailScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const disease = route.params?.disease;

  if (!disease) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <ScreenHeader title="Disease Detail" onBack={() => navigation.goBack()} />
        <View style={styles.empty}><Text style={styles.emptyText}>No disease data found.</Text></View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScreenHeader title={disease.name} onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.heroCard}>
          <Text style={styles.heroMeta}>{disease.category}</Text>
          <Text style={styles.heroTitle}>{disease.name}</Text>
          <Text style={styles.heroBody}>Severity: {disease.severity} | Mortality risk: {disease.mortality_rate ?? '-'}%</Text>
          <Text style={styles.heroBody}>Affected species: {(disease.affected_species || []).join(', ') || 'Not specified'}</Text>
        </View>

        <Section title="Symptoms" items={disease.symptoms} theme={theme} styles={styles} />
        <Section title="Causes" items={disease.causes} theme={theme} styles={styles} />
        <Section title="Prevention" items={disease.prevention} theme={theme} styles={styles} />
        <Section title="Treatment" items={disease.treatment} theme={theme} styles={styles} />
      </ScrollView>
    </SafeAreaView>
  );
}

const getStyles = (theme: any) => StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  content: { padding: 16, paddingBottom: 120 },
  heroCard: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
    padding: 16,
  },
  heroMeta: { color: theme.colors.primary, fontWeight: '800', fontSize: 12 },
  heroTitle: { color: theme.colors.textPrimary, fontWeight: '800', fontSize: 22, marginTop: 4 },
  heroBody: { color: theme.colors.textSecondary, marginTop: 8, lineHeight: 21 },
  section: {
    marginTop: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
    padding: 14,
  },
  sectionTitle: { color: theme.colors.textPrimary, fontWeight: '800', fontSize: 16, marginBottom: 8 },
  bullet: { color: theme.colors.textSecondary, lineHeight: 22, marginBottom: 4 },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  emptyText: { color: theme.colors.textMuted },
});
