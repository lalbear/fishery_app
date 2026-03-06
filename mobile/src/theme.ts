export const lightTheme = {
    isDark: false,
    colors: {
        primary: '#2E5B3D',      // Muted Forest Green
        primaryLight: '#E8F3EB', // Very soft green background
        secondary: '#3B82F6',    // Balanced Blue
        secondaryLight: '#EFF6FF',
        accent: '#F59E0B',       // Muted Orange for alerts/standouts

        background: '#F8FAFC',   // Slate-50, softer than pure white
        surface: '#FFFFFF',      // Pure white
        border: '#E2E8F0',

        textPrimary: '#0F172A',
        textSecondary: '#475569',
        textMuted: '#94A3B8',
        textInverse: '#FFFFFF',

        success: '#10B981',
        error: '#EF4444',
    },
    spacing: {
        xs: 4, sm: 8, md: 16, lg: 24, xl: 32, xxl: 48,
    },
    borderRadius: {
        sm: 6, md: 12, lg: 16, full: 9999,
    },
    shadows: {
        sm: {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.05,
            shadowRadius: 2,
            elevation: 2,
        },
        md: {
            shadowColor: '#0F172A',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.08,
            shadowRadius: 8,
            elevation: 4,
        }
    },
    typography: {
        h1: { fontSize: 28, fontWeight: '700' as const, color: '#0F172A' },
        h2: { fontSize: 24, fontWeight: '600' as const, color: '#0F172A' },
        h3: { fontSize: 18, fontWeight: '600' as const, color: '#0F172A' },
        bodyLarge: { fontSize: 16, fontWeight: '400' as const, color: '#475569', lineHeight: 24 },
        body: { fontSize: 14, fontWeight: '400' as const, color: '#475569', lineHeight: 20 },
        caption: { fontSize: 12, fontWeight: '400' as const, color: '#94A3B8' },
        buttonText: { fontSize: 16, fontWeight: '600' as const },
    }
};

export const darkTheme = {
    ...lightTheme,
    isDark: true,
    colors: {
        primary: '#4ADE80',      // Lighter Green for dark mode
        primaryLight: '#14532D', // Deep green bg
        secondary: '#60A5FA',    // Lighter blue
        secondaryLight: '#1E3A8A',
        accent: '#FBBF24',

        background: '#0F172A',   // Slate-900
        surface: '#1E293B',      // Slate-800
        border: '#334155',       // Slate-700

        textPrimary: '#F8FAFC',  // Slate-50
        textSecondary: '#CBD5E1',// Slate-300
        textMuted: '#94A3B8',    // Slate-400
        textInverse: '#1E293B',

        success: '#34D399',
        error: '#F87171',
    },
    shadows: {
        sm: {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.3,
            shadowRadius: 2,
            elevation: 2,
        },
        md: {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.4,
            shadowRadius: 8,
            elevation: 4,
        }
    },
    typography: {
        ...lightTheme.typography,
        h1: { ...lightTheme.typography.h1, color: '#F8FAFC' },
        h2: { ...lightTheme.typography.h2, color: '#F8FAFC' },
        h3: { ...lightTheme.typography.h3, color: '#F8FAFC' },
        bodyLarge: { ...lightTheme.typography.bodyLarge, color: '#CBD5E1' },
        body: { ...lightTheme.typography.body, color: '#CBD5E1' },
    }
};

export type Theme = typeof lightTheme;
