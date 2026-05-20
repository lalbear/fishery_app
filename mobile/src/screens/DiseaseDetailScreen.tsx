import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, View, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../ThemeContext';
import ScreenHeader from '../components/ScreenHeader';
import { getDiseaseEducationContent, getDiseaseDbOverride, type Lang } from '../utils/diseaseContent';
import { resolveDiseaseImage } from '../utils/diseaseImages';

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
  const { t, i18n } = useTranslation();
  const lang: Lang = (i18n.language?.startsWith('hi') ? 'hi' : 'en');
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const disease = route.params?.disease;
  const [imageError, setImageError] = useState(false);

  if (!disease) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <ScreenHeader title={t('disease.detailTitle')} onBack={() => navigation.goBack()} />
        <View style={styles.empty}><Text style={styles.emptyText}>{t('disease.notFound')}</Text></View>
      </SafeAreaView>
    );
  }

  const imgUri = resolveDiseaseImage({
    slug: disease.slug,
    category: disease.category,
    image_url: disease.image_url,
  });
  const education = getDiseaseEducationContent(disease.slug, lang);
  const override = getDiseaseDbOverride(disease.slug, lang);

  // Use localized override when available, else fall back to DB row
  const displayName = override?.name || disease.name;
  const displaySymptoms = override?.symptoms || disease.symptoms;
  const displayCauses = override?.causes || disease.causes;
  const displayPrevention = override?.prevention || disease.prevention;
  const displayTreatment = override?.treatment || disease.treatment;

  const severityColor =
    disease.severity === 'HIGH' ? theme.colors.error
    : disease.severity === 'MEDIUM' ? theme.colors.accent
    : theme.colors.success;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScreenHeader title={displayName} onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.content}>

        {/* Hero Image */}
        {imgUri && !imageError ? (
          <Image
            source={imgUri}
            style={styles.heroImage}
            resizeMode="cover"
            onError={() => setImageError(true)}
          />
        ) : (
          <View style={styles.heroImageFallback}>
            <Ionicons name="bug-outline" size={54} color={theme.colors.primary} />
            <Text style={styles.heroImageFallbackText}>{t(`disease.categories.${disease.category}`) || disease.category}</Text>
          </View>
        )}

        {/* Info Card */}
        <View style={styles.heroCard}>
          <View style={styles.heroTopRow}>
            <Text style={styles.heroMeta}>{t(`disease.categories.${disease.category}`) || disease.category}</Text>
            <View style={[styles.severityBadge, { backgroundColor: `${severityColor}22` }]}>
              <Ionicons
                name={disease.severity === 'HIGH' ? 'alert-circle' : disease.severity === 'MEDIUM' ? 'warning' : 'information-circle'}
                size={12}
                color={severityColor}
              />
              <Text style={[styles.severityText, { color: severityColor }]}>{t(`disease.severity.${disease.severity}`) || disease.severity} {t('disease.riskSuffix')}</Text>
            </View>
          </View>
          <Text style={styles.heroTitle}>{displayName}</Text>
          {disease.mortality_rate != null && (
            <Text style={styles.heroBody}>{t('disease.mortalityRisk')} <Text style={{ color: theme.colors.error, fontWeight: '800' }}>{disease.mortality_rate}%</Text></Text>
          )}
          <Text style={styles.heroBody}>{t('disease.affectedSpecies')} {(disease.affected_species || []).join(', ') || t('disease.notSpecified')}</Text>
          {(disease.seasonality || []).length > 0 && (
            <View style={styles.seasonRow}>
              <Ionicons name="calendar-outline" size={13} color={theme.colors.textMuted} />
              <Text style={styles.seasonText}>{t('disease.season')} {disease.seasonality.join(', ')}</Text>
            </View>
          )}
        </View>

        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>{t('disease.sections.whatItMeans')}</Text>
          <Text style={styles.summaryText}>{education.overview}</Text>
          <Text style={styles.summaryTitle}>{t('disease.sections.whyItHappens')}</Text>
          <Text style={styles.summaryText}>{education.whyItHappens}</Text>
        </View>

        <Section title={t('disease.sections.symptoms')} items={displaySymptoms} theme={theme} styles={styles} />
        <Section title={t('disease.sections.causes')} items={displayCauses} theme={theme} styles={styles} />
        <Section title={t('disease.sections.prevention')} items={displayPrevention} theme={theme} styles={styles} />
        <Section title={t('disease.sections.treatment')} items={displayTreatment} theme={theme} styles={styles} />
        <Section title={t('disease.sections.firstResponse')} items={education.firstResponse} theme={theme} styles={styles} />
        <Section title={t('disease.sections.farmerChecklist')} items={education.farmerChecklist} theme={theme} styles={styles} />
        <Section title={t('disease.sections.callDoctorNow')} items={education.callDoctorNow} theme={theme} styles={styles} />
      </ScrollView>
    </SafeAreaView>
  );
}

const getStyles = (theme: any) => StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  content: { paddingBottom: 120 },
  heroImage: {
    width: '100%',
    height: 220,
    resizeMode: 'cover',
  },
  heroImageFallback: {
    width: '100%',
    height: 220,
    backgroundColor: theme.colors.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  heroImageFallbackText: {
    color: theme.colors.textMuted,
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  heroCard: {
    margin: 16,
    marginTop: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
    padding: 16,
  },
  heroTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  heroMeta: { color: theme.colors.primary, fontWeight: '800', fontSize: 12 },
  severityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
  },
  severityText: { fontWeight: '800', fontSize: 11 },
  heroTitle: { color: theme.colors.textPrimary, fontWeight: '800', fontSize: 22, marginTop: 4 },
  heroBody: { color: theme.colors.textSecondary, marginTop: 8, lineHeight: 21 },
  seasonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 8,
  },
  seasonText: { color: theme.colors.textMuted, fontSize: 12, fontWeight: '600' },
  section: {
    marginHorizontal: 16,
    marginTop: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
    padding: 14,
  },
  summaryCard: {
    marginHorizontal: 16,
    marginTop: 4,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surfaceLow,
    padding: 14,
    gap: 8,
  },
  summaryTitle: {
    color: theme.colors.textPrimary,
    fontWeight: '800',
    fontSize: 15,
  },
  summaryText: {
    color: theme.colors.textSecondary,
    lineHeight: 21,
  },
  sectionTitle: { color: theme.colors.textPrimary, fontWeight: '800', fontSize: 16, marginBottom: 8 },
  bullet: { color: theme.colors.textSecondary, lineHeight: 22, marginBottom: 4 },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  emptyText: { color: theme.colors.textMuted },
});
