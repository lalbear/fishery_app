import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../ThemeContext';
import ScreenHeader from '../components/ScreenHeader';

export default function LearningCenterScreen() {
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const knowledgeInsights = route.params?.knowledgeInsights;
  const stateCode = route.params?.stateCode;
  const farmerCategory = route.params?.farmerCategory;

  const subsidyText =
    knowledgeInsights?.beneficiarySubsidyPercent != null
      ? `${knowledgeInsights.beneficiarySubsidyPercent}%`
      : farmerCategory === 'GENERAL'
        ? 'Usually 40%'
        : farmerCategory
          ? 'Usually 60%'
          : 'Usually 40% to 60%';

  const fundingPattern =
    knowledgeInsights?.fundingShare?.centralPercent != null &&
    knowledgeInsights?.fundingShare?.statePercent != null
      ? `${knowledgeInsights.fundingShare.centralPercent}:${knowledgeInsights.fundingShare.statePercent}`
      : stateCode
        ? 'Depends on your state'
        : 'Usually 60:40 or 90:10';

  const glossary = [
    {
      term: 'FCR',
      meaning: 'Feed Conversion Ratio',
      simple: 'How many kg of feed are needed to produce 1 kg of fish or shrimp. Lower is usually better.',
    },
    {
      term: 'BCR',
      meaning: 'Benefit-Cost Ratio',
      simple: 'A quick way to compare money coming in versus money going out. Above 1 usually means the project is financially positive.',
    },
    {
      term: 'CAPEX',
      meaning: 'Capital Expenditure',
      simple: 'Your setup cost at the beginning, like pond work, tanks, pumps, aerators, sheds, or equipment.',
    },
    {
      term: 'OPEX',
      meaning: 'Operating Expenditure',
      simple: 'Your running cost during the crop, like feed, seed, medicines, electricity, labor, and maintenance.',
    },
    {
      term: 'Survival Rate',
      meaning: 'How much stock survives to harvest',
      simple: 'If survival is 80%, then out of 100 stocked fish or shrimp, around 80 reach harvest.',
    },
    {
      term: 'Culture Period',
      meaning: 'Time from stocking to harvest',
      simple: 'This tells you how long one crop takes before you can sell and earn revenue.',
    },
  ];

  const roadmap = [
    'Choose your location, water type, and land or tank size first.',
    'Pick a farming system that matches your capital, skill level, and risk tolerance.',
    'Estimate setup cost, running cost, crop duration, and selling price before borrowing.',
    'Check which subsidy rule may apply, but do not treat it as guaranteed cash in hand.',
    'Start with a manageable scale and learn operations before expanding.',
  ];

  const beginnerWarnings = [
    'Document-based models are planning examples, not guaranteed profit outcomes.',
    'Feed price, electricity cost, and sale price can change sharply by district and season.',
    'High-return systems like RAS or shrimp can also fail faster if operations are weak.',
    'Subsidy approval, bank sanction, and release timing can all change your real cash flow.',
  ];

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScreenHeader title="Learning Center" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.heroCard}>
          <Text style={styles.eyebrow}>BEGINNER GUIDE</Text>
          <Text style={styles.title}>How this business works in simple terms</Text>
          <Text style={styles.subtitle}>
            This section is for first-time users who want to understand aquaculture, subsidy rules, and the app’s economics terms before making decisions.
          </Text>
        </View>

        <Section title="Start here" styles={styles}>
          {roadmap.map((item) => (
            <Bullet key={item} text={item} styles={styles} />
          ))}
        </Section>

        <Section title="What the business needs" styles={styles}>
          <InfoCard title="Land or space" body="You do not need the same size for every system. Earthen ponds usually need more land. RAS and tank-based systems use less land but need more equipment and stronger management." styles={styles} />
          <InfoCard title="Water quality" body="Water type matters a lot. Freshwater, brackishwater, salinity, oxygen, and pH affect which species and systems are suitable." styles={styles} />
          <InfoCard title="Capital" body="Some systems are beginner-friendly with lower capital, while others need a much bigger setup budget. In general, ponds are simpler to start than RAS." styles={styles} />
          <InfoCard title="Working capital" body="You need money not just for setup, but also for feed, seed, medicines, labor, and electricity until harvest happens." styles={styles} />
        </Section>

        <Section title="Subsidy explained simply" styles={styles}>
          <View style={styles.previewRow}>
            <PreviewStat label="Likely subsidy" value={subsidyText} styles={styles} />
            <PreviewStat label="Funding split" value={fundingPattern} styles={styles} />
          </View>
          <Text style={styles.bodyText}>Subsidy means the government may support part of the approved project cost. It does not usually mean the full project becomes free.</Text>
          <Text style={styles.bodyText}>The beneficiary subsidy percentage is the part of project cost the farmer may get support for. The funding split only tells you how that subsidy is shared between Centre and State.</Text>
          <Text style={styles.bodyText}>In simple words: if subsidy is 40%, the farmer usually still arranges the remaining 60% through own money, bank loan, or both.</Text>
          <Text style={styles.bodyText}>Subsidy sanction and subsidy release are not the same thing. Timing can depend on paperwork, state release, and project approval.</Text>
        </Section>

        <Section title="Important terms made simple" styles={styles}>
          {glossary.map((item) => (
            <View key={item.term} style={styles.termCard}>
              <View style={styles.termHeader}>
                <Text style={styles.termTitle}>{item.term}</Text>
                <Text style={styles.termMeaning}>{item.meaning}</Text>
              </View>
              <Text style={styles.termBody}>{item.simple}</Text>
            </View>
          ))}
        </Section>

        <Section title="How to read your app result" styles={styles}>
          <Bullet text="Compatibility score tells you how well a species matches your current inputs like water, economics, and risk level." styles={styles} />
          <Bullet text="Projected revenue is the sales estimate before subtracting all expenses." styles={styles} />
          <Bullet text="Projected profit is what may remain after setup and operating cost assumptions are applied." styles={styles} />
          <Bullet text="Breakeven timeline tells you how long it may take to recover your investment if assumptions hold." styles={styles} />
          <Bullet text="Tap recommended species cards to see why the match is strong, medium, or weak." styles={styles} />
        </Section>

        <Section title="Current beginner rules used in this app" styles={styles}>
          <Bullet text="Some PMMSY-linked eligibility checks in the app expect at least 0.1 hectare for subsidy planning." styles={styles} />
          <Bullet text="The simulator uses document-backed assumptions like FCR, survival, cycle duration, and state benchmarks where available." styles={styles} />
          <Bullet text="If the app shows warnings or disclaimers, treat them seriously and update local prices before making a financial decision." styles={styles} />
        </Section>

        <Section title="Beginner warnings" styles={styles}>
          {beginnerWarnings.map((item) => (
            <Bullet key={item} text={item} styles={styles} />
          ))}
        </Section>

        <TouchableOpacity
          style={styles.linkCard}
          onPress={() =>
            navigation.navigate('PolicyGuidance', {
              knowledgeInsights,
              stateCode,
              farmerCategory,
            })
          }
        >
          <View style={styles.linkCopy}>
            <Text style={styles.linkTitle}>Open policy guidance</Text>
            <Text style={styles.linkText}>See your current state and category subsidy preview in more detail.</Text>
          </View>
          <Ionicons name="arrow-forward" size={18} color={theme.colors.primary} />
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

function Section({ title, styles, children }: any) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.sectionCard}>{children}</View>
    </View>
  );
}

function Bullet({ text, styles }: any) {
  return <Text style={styles.bulletText}>• {text}</Text>;
}

function InfoCard({ title, body, styles }: any) {
  return (
    <View style={styles.infoCard}>
      <Text style={styles.infoCardTitle}>{title}</Text>
      <Text style={styles.infoCardBody}>{body}</Text>
    </View>
  );
}

function PreviewStat({ label, value, styles }: any) {
  return (
    <View style={styles.previewStat}>
      <Text style={styles.previewLabel}>{label}</Text>
      <Text style={styles.previewValue}>{value}</Text>
    </View>
  );
}

const getStyles = (theme: any) =>
  StyleSheet.create({
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
    bodyText: {
      color: theme.colors.textSecondary,
      lineHeight: 22,
    },
    bulletText: {
      color: theme.colors.textSecondary,
      lineHeight: 22,
    },
    infoCard: {
      borderRadius: 14,
      backgroundColor: theme.colors.surfaceAlt,
      padding: 14,
    },
    infoCardTitle: {
      color: theme.colors.textPrimary,
      fontSize: 15,
      fontWeight: '800',
    },
    infoCardBody: {
      color: theme.colors.textSecondary,
      lineHeight: 20,
      marginTop: 6,
    },
    previewRow: {
      flexDirection: 'row',
      gap: 12,
      marginBottom: 6,
    },
    previewStat: {
      flex: 1,
      borderRadius: 14,
      backgroundColor: theme.colors.surfaceAlt,
      padding: 14,
    },
    previewLabel: {
      color: theme.colors.textSecondary,
      fontSize: 12,
      fontWeight: '700',
    },
    previewValue: {
      color: theme.colors.textPrimary,
      fontSize: 24,
      fontWeight: '900',
      marginTop: 6,
    },
    termCard: {
      borderRadius: 14,
      backgroundColor: theme.colors.surfaceAlt,
      padding: 14,
    },
    termHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: 8,
    },
    termTitle: {
      color: theme.colors.textPrimary,
      fontSize: 16,
      fontWeight: '900',
    },
    termMeaning: {
      color: theme.colors.primary,
      fontSize: 12,
      fontWeight: '800',
      textAlign: 'right',
      flexShrink: 1,
    },
    termBody: {
      color: theme.colors.textSecondary,
      lineHeight: 20,
      marginTop: 8,
    },
    linkCard: {
      marginTop: 18,
      borderRadius: theme.borderRadius.lg,
      borderWidth: 1,
      borderColor: theme.colors.border,
      backgroundColor: theme.colors.surface,
      padding: 16,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: 12,
    },
    linkCopy: {
      flex: 1,
    },
    linkTitle: {
      color: theme.colors.textPrimary,
      fontSize: 16,
      fontWeight: '800',
    },
    linkText: {
      color: theme.colors.textSecondary,
      lineHeight: 20,
      marginTop: 6,
    },
  });
