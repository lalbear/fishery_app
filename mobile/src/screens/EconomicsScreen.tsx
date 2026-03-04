import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { theme } from '../theme';

export default function EconomicsScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation();

  const [landSize, setLandSize] = useState('');
  const [salinity, setSalinity] = useState('');
  const [capital, setCapital] = useState('');
  const [riskTolerance, setRiskTolerance] = useState<'LOW' | 'MEDIUM' | 'HIGH'>('MEDIUM');
  const [farmerCategory, setFarmerCategory] = useState<'GENERAL' | 'WOMEN' | 'SC' | 'ST'>('GENERAL');

  const riskOptions: Array<'LOW' | 'MEDIUM' | 'HIGH'> = ['LOW', 'MEDIUM', 'HIGH'];
  const categoryOptions: Array<'GENERAL' | 'WOMEN' | 'SC' | 'ST'> = ['GENERAL', 'WOMEN', 'SC', 'ST'];

  const runSimulation = () => {
    navigation.navigate('EconomicsResult' as never, { simulationId: 'sim-001' } as never);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>{t('economics.title') || 'Calculate ROI'}</Text>
          <Text style={styles.subtitle}>{t('economics.subtitle') || 'Estimate your returns'}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>{t('economics.inputParameters') || 'Input Parameters'}</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>{t('economics.landSize') || 'Land Size (Acres)'}</Text>
            <TextInput
              style={styles.input}
              value={landSize}
              onChangeText={setLandSize}
              keyboardType="decimal-pad"
              placeholder="e.g. 1.0"
              placeholderTextColor={theme.colors.textMuted}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>{t('economics.salinity') || 'Water Salinity'}</Text>
            <TextInput
              style={styles.input}
              value={salinity}
              onChangeText={setSalinity}
              keyboardType="decimal-pad"
              placeholder="e.g. 500"
              placeholderTextColor={theme.colors.textMuted}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>{t('economics.capital') || 'Investment Capital'}</Text>
            <TextInput
              style={styles.input}
              value={capital}
              onChangeText={setCapital}
              keyboardType="decimal-pad"
              placeholder="e.g. 100000"
              placeholderTextColor={theme.colors.textMuted}
            />
          </View>

          <Text style={styles.label}>{t('economics.riskTolerance') || 'Risk Tolerance'}</Text>
          <View style={styles.optionsRow}>
            {riskOptions.map((risk) => (
              <TouchableOpacity
                key={risk}
                style={[styles.optionButton, riskTolerance === risk && styles.optionButtonActive]}
                onPress={() => setRiskTolerance(risk)}
                activeOpacity={0.7}
              >
                <Text style={[styles.optionText, riskTolerance === risk && styles.optionTextActive]}>
                  {t(`economics.${risk.toLowerCase()}Risk`) || risk}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.label}>{t('economics.farmerCategory') || 'Farmer Category'}</Text>
          <View style={styles.optionsRow}>
            {categoryOptions.map((cat) => (
              <TouchableOpacity
                key={cat}
                style={[styles.optionButton, farmerCategory === cat && styles.optionButtonActive]}
                onPress={() => setFarmerCategory(cat)}
                activeOpacity={0.7}
              >
                <Text style={[styles.optionText, farmerCategory === cat && styles.optionTextActive]}>
                  {t(`economics.categories.${cat}`) || cat}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity style={styles.submitButton} onPress={runSimulation} activeOpacity={0.8}>
            <Ionicons name="calculator-outline" size={24} color="#fff" />
            <Text style={styles.submitButtonText}>{t('economics.runSimulation') || 'Calculate Now'}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background
  },
  scrollContent: {
    padding: theme.spacing.lg,
  },
  header: {
    marginBottom: theme.spacing.lg
  },
  title: {
    ...theme.typography.h1,
    color: theme.colors.primary
  },
  subtitle: {
    ...theme.typography.bodyLarge,
    marginTop: theme.spacing.xs
  },
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    ...theme.shadows.sm,
  },
  sectionTitle: {
    ...theme.typography.h3,
    marginBottom: theme.spacing.lg
  },
  inputGroup: {
    marginBottom: theme.spacing.md
  },
  label: {
    ...theme.typography.body,
    fontWeight: '600',
    marginBottom: theme.spacing.sm
  },
  input: {
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    fontSize: 16,
    borderWidth: 1,
    borderColor: theme.colors.border,
    color: theme.colors.textPrimary
  },
  optionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.lg
  },
  optionButton: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.full,
    backgroundColor: theme.colors.background,
    borderWidth: 1,
    borderColor: theme.colors.border
  },
  optionButtonActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary
  },
  optionText: {
    ...theme.typography.body,
    fontWeight: '500'
  },
  optionTextActive: {
    color: theme.colors.textInverse
  },
  submitButton: {
    backgroundColor: theme.colors.secondary,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.sm,
    marginTop: theme.spacing.sm,
    ...theme.shadows.md,
  },
  submitButtonText: {
    ...theme.typography.buttonText,
    color: theme.colors.textInverse
  },
});