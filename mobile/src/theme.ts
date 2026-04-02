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
        primary: '#17A34A',
        primaryDark: '#050505',
        primaryLight: '#102014',
        secondary: '#2DD4BF',
        secondaryLight: '#10211F',
        accent: '#FFB300',
        accentSoft: '#2A220D',

        background: '#050505',
        surface: '#0E0E0E',
        surfaceAlt: '#151515',
        card: '#121212',
        border: '#242424',

        textPrimary: '#F5F5F5',
        textSecondary: '#C2C2C2',
        textMuted: '#8C8C8C',
        textInverse: '#FFFFFF',

        success: '#4ADE80',
        warning: '#FFB300',
        error: '#F87171',
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
        h1: { ...lightTheme.typography.h1, color: '#F5F5F5' },
        h2: { ...lightTheme.typography.h2, color: '#F5F5F5' },
        h3: { ...lightTheme.typography.h3, color: '#F5F5F5' },
        bodyLarge: { ...lightTheme.typography.bodyLarge, color: '#C2C2C2' },
        body: { ...lightTheme.typography.body, color: '#C2C2C2' },
    }
};

export type Theme = typeof lightTheme;
