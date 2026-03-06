import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { lightTheme, darkTheme, Theme } from './theme';

type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeContextData {
    theme: Theme;
    mode: ThemeMode;
    setMode: (mode: ThemeMode) => void;
    isDark: boolean;
    toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextData | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const systemColorScheme = useColorScheme();
    const [mode, setMode] = useState<ThemeMode>('system');
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        const loadTheme = async () => {
            try {
                const savedMode = await AsyncStorage.getItem('@theme_mode');
                if (savedMode === 'light' || savedMode === 'dark' || savedMode === 'system') {
                    setMode(savedMode as ThemeMode);
                }
            } catch (e) {
                console.error('Failed to load theme mode', e);
            } finally {
                setIsReady(true);
            }
        };
        loadTheme();
    }, []);

    useEffect(() => {
        if (isReady) {
            AsyncStorage.setItem('@theme_mode', mode).catch(e => console.error('Failed to save theme mode', e));
        }
    }, [mode, isReady]);

    const isDark = mode === 'dark' || (mode === 'system' && systemColorScheme === 'dark');
    const theme = isDark ? darkTheme : lightTheme;

    const toggleTheme = () => {
        setMode(prev => (isDark ? 'light' : 'dark'));
    };

    if (!isReady) {
        return null;
    }

    return (
        <ThemeContext.Provider value={{ theme, mode, setMode, isDark, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};
