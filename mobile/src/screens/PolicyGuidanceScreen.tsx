import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useTheme } from '../ThemeContext';
import ScreenHeader from '../components/ScreenHeader';

export default function PolicyGuidanceScreen() {
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const knowledgeInsights = route.params?.knowledgeInsights;
  const stateCode = route.params?.stateCode;
  const farmerCategory = route.params?.farmerCategory;

  const beneficiarySubsidyText =
    knowledgeInsights?.beneficiarySubsidyPercent != null
      ? `${knowledgeInsights.beneficiarySubsidyPercent}%`
      : 'Not available yet';
  const fundingPatternText =
    knowledgeInsights?.fundingShare?.centralPercent != null &&
    knowledgeInsights?.fundingShare?.statePercent != null
      ? `${knowledgeInsights.fundingShare.centralPercent}:${knowledgeInsights.fundingShare.statePercent}`
      : 'Not available yet';

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScreenHeader
        title="Policy Guidance"
        onBack={() => navigation.goBack()}
      />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.heroCard}>
          <Text style={styles.eyebrow}>GOVERNMENT-BACKED EXPLANATION</Text>
          <Text style={styles.title}>What these subsidy numbers mean</Text>
          <Text style={styles.subtitle}>
            This page translates the seeded government and institutional rules into plain language for new business starters.
          </Text>
        </View>

        <Section title="Your current preview" styles={styles}>
          <InfoRow label="State" value={stateCode || 'Not selected'} styles={styles} />
          <InfoRow label="Farmer category" value={farmerCategory || 'Not selected'} styles={styles} />
          <InfoRow label="Beneficiary subsidy" value={beneficiarySubsidyText} styles={styles} />
          <InfoRow label="Funding pattern" value={fundingPatternText} styles={styles} />
        </Section>

        <Section title="Simple meaning" styles={styles}>
          <Text style={styles.bodyText}>
            Beneficiary subsidy tells you the maximum part of the approved project cost that the government may support for your category.
          </Text>
          <Text style={styles.bodyText}>
            Funding pattern tells you how the government subsidy itself is split between the Centre and the State. It does not mean you only pay the remaining number shown there.
          </Text>
          <Text style={styles.bodyText}>
            Example: if your subsidy is 40% and the funding pattern is 60:40, that means the total subsidy is still 40% for you, but that subsidy is jointly funded by the Centre and State in a 60:40 ratio.
          </Text>
        </Section>

        <Section title="How to use this in planning" styles={styles}>
          <Bullet text="Use the subsidy preview as a planning guide, not a guaranteed sanction amount." styles={styles} />
          <Bullet text="Bank loans, state release timing, and project approval can still affect the actual amount and timing." styles={styles} />
          <Bullet text="If the app shows state-specific benchmarks, those are useful for budgeting, especially pond development and system setup costs." styles={styles} />
          <Bullet text="If the app shows warnings or disclaimer notes, update feed price, sale price, and local market assumptions before making a business decision." styles={styles} />
        </Section>

        <TouchableOpacity
          style={styles.learnLinkCard}
          onPress={() =>
            navigation.navigate('LearningCenter', {
              knowledgeInsights,
              stateCode,
              farmerCategory,
            })
          }
        >
          <View style={styles.learnLinkCopy}>
            <Text style={styles.learnLinkTitle}>Need the beginner version?</Text>
            <Text style={styles.learnLinkText}>
              Open Learning Center for simple explanations of terms like FCR, BCR, subsidy, capital, and land planning.
            </Text>
          </View>
          <Ionicons name="arrow-forward" size={18} color={theme.colors.primary} />
        </TouchableOpacity>

        {knowledgeInsights?.templateHighlights?.length ? (
          <Section title="Document-backed assumptions in use" styles={styles}>
            {knowledgeInsights.templateHighlights.map((item: any) => (
              <View key={item.idSlug} style={styles.card}>
                <Text style={styles.cardTitle}>{item.metricName}</Text>
                <Text style={styles.cardValue}>{formatValue(item.numericValue, item.unit)}</Text>
                <Text style={styles.cardMeta}>{item.notes || item.sourceLabel}</Text>
              </View>
            ))}
          </Section>
        ) : null}

        {knowledgeInsights?.disclaimerHighlights?.length ? (
          <Section title="Important disclaimer" styles={styles}>
            {knowledgeInsights.disclaimerHighlights.map((item: any) => (
              <Text key={item.idSlug} style={styles.bodyText}>
                {item.citationText || item.notes || item.metricName}
              </Text>
            ))}
          </Section>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}

function formatValue(value: number | null | undefined, unit?: string | null) {
  if (value == null) return 'N/A';
  switch (unit) {
    case 'PERCENT':
      return `${value}%`;
    case 'INR':
      return `Rs ${value.toLocaleString('en-IN')}`;
    case 'INR_PER_KG':
      return `Rs ${value}/kg`;
    case 'INR_PER_HA':
      return `Rs ${value.toLocaleString('en-IN')}/ha`;
    case 'FISH_PER_CUBIC_METER':
      return `${value} fish/m3`;
    case 'FINGERLINGS_PER_HA':
      return `${value.toLocaleString('en-IN')} fingerlings/ha`;
    case 'MONTH':
      return `${value} months`;
    case 'RATIO':
      return `${value}`;
    default:
      return `${value}`;
  }
}

function Section({ title, styles, children }: any) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.sectionCard}>{children}</View>
    </View>
  );
}

function InfoRow({ label, value, styles }: any) {
  return (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
}

function Bullet({ text, styles }: any) {
  return <Text style={styles.bulletText}>• {text}</Text>;
}

const getStyles = (theme: any) => StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: theme.colors.background },
  content: { padding: 16, paddingBottom: 120 },
  heroCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.xl,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: 20,
  },
  eyebrow: {
    color: theme.colors.primary,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.6,
  },
  title: {
    ...theme.typography.h2,
    marginTop: 8,
  },
  subtitle: {
    ...theme.typography.body,
    marginTop: 10,
  },
  section: {
    marginTop: 18,
  },
  sectionTitle: {
    ...theme.typography.h3,
    marginBottom: 10,
  },
  sectionCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: 16,
    gap: 10,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  infoLabel: {
    flex: 1,
    color: theme.colors.textSecondary,
    fontWeight: '700',
  },
  infoValue: {
    color: theme.colors.textPrimary,
    fontWeight: '800',
    textAlign: 'right',
  },
  bodyText: {
    color: theme.colors.textSecondary,
    lineHeight: 22,
  },
  bulletText: {
    color: theme.colors.textSecondary,
    lineHeight: 22,
  },
  learnLinkCard: {
    marginTop: 18,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  learnLinkCopy: {
    flex: 1,
  },
  learnLinkTitle: {
    color: theme.colors.textPrimary,
    fontSize: 15,
    fontWeight: '800',
  },
  learnLinkText: {
    color: theme.colors.textSecondary,
    marginTop: 6,
    lineHeight: 20,
  },
  card: {
    borderRadius: 14,
    backgroundColor: theme.colors.surfaceAlt,
    padding: 14,
  },
  cardTitle: {
    color: theme.colors.textPrimary,
    fontSize: 15,
    fontWeight: '800',
  },
  cardValue: {
    color: theme.colors.primary,
    fontSize: 16,
    fontWeight: '800',
    marginTop: 6,
  },
  cardMeta: {
    color: theme.colors.textSecondary,
    marginTop: 6,
    lineHeight: 20,
  },
});
