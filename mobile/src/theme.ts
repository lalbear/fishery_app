export const lightTheme = {
    isDark: false,
    colors: {
        primary: '#0F8F2E',
        primaryDark: '#004D1A',
        primaryLight: '#E5F7E9',
        secondary: '#1F8A70',
        secondaryLight: '#DDF4EE',
        accent: '#FFB300',
        accentSoft: '#FFF4D6',

        background: '#F6F4EC',
        surface: '#FFFCF4',
        surfaceAlt: '#EEF4EA',
        card: '#FFFFFF',
        border: '#D7DFD1',

        textPrimary: '#102617',
        textSecondary: '#43604A',
        textMuted: '#6F8477',
        textInverse: '#FFFFFF',

        success: '#35A854',
        warning: '#FFB300',
        error: '#C44732',
    },
    spacing: {
        xs: 4, sm: 8, md: 16, lg: 24, xl: 32, xxl: 48, xxxl: 64,
    },
    borderRadius: {
        sm: 8, md: 12, lg: 18, xl: 24, full: 9999,
    },
    shadows: {
        sm: {
            shadowColor: '#102617',
            shadowOffset: { width: 0, height: 6 },
            shadowOpacity: 0.08,
            shadowRadius: 12,
            elevation: 3,
        },
        md: {
            shadowColor: '#102617',
            shadowOffset: { width: 0, height: 12 },
            shadowOpacity: 0.12,
            shadowRadius: 20,
            elevation: 7,
        }
    },
    typography: {
        h1: { fontSize: 34, fontWeight: '800' as const, color: '#102617' },
        h2: { fontSize: 28, fontWeight: '700' as const, color: '#102617' },
        h3: { fontSize: 22, fontWeight: '700' as const, color: '#102617' },
        bodyLarge: { fontSize: 18, fontWeight: '500' as const, color: '#43604A', lineHeight: 26 },
        body: { fontSize: 15, fontWeight: '400' as const, color: '#43604A', lineHeight: 22 },
        caption: { fontSize: 12, fontWeight: '500' as const, color: '#6F8477' },
        buttonText: { fontSize: 17, fontWeight: '700' as const },
    }
};

export const darkTheme = {
    ...lightTheme,
    isDark: true,
    colors: {
        primary: '#0E8E2E',
        primaryDark: '#031D0C',
        primaryLight: '#09381A',
        secondary: '#25A58C',
        secondaryLight: '#0D3E34',
        accent: '#FFB300',
        accentSoft: '#3E3008',

        background: '#071A0D',
        surface: '#0C2412',
        surfaceAlt: '#12331B',
        card: '#0F2A15',
        border: '#173B20',

        textPrimary: '#F3F6EF',
        textSecondary: '#B5C7B8',
        textMuted: '#7D9A83',
        textInverse: '#FFFFFF',

        success: '#4CAF50',
        warning: '#FFB300',
        error: '#D66745',
    },
    shadows: {
        sm: {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.25,
            shadowRadius: 8,
            elevation: 2,
        },
        md: {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.35,
            shadowRadius: 18,
            elevation: 6,
        }
    },
    typography: {
        ...lightTheme.typography,
        h1: { ...lightTheme.typography.h1, color: '#F3F6EF' },
        h2: { ...lightTheme.typography.h2, color: '#F3F6EF' },
        h3: { ...lightTheme.typography.h3, color: '#F3F6EF' },
        bodyLarge: { ...lightTheme.typography.bodyLarge, color: '#B5C7B8' },
        body: { ...lightTheme.typography.body, color: '#B5C7B8' },
    }
};

export type Theme = typeof lightTheme;
