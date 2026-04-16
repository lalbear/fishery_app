import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ActivityIndicator,
    Alert,
    ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { authService } from '../services/authService';
import { useTheme } from '../ThemeContext';

interface Props {
    onLoginSuccess: () => void;
}

const STATE_CODE_BY_LABEL: Record<string, string> = {
    'andhra pradesh': 'AP',
    'arunachal pradesh': 'AR',
    assam: 'AS',
    bihar: 'BR',
    goa: 'GA',
    gujarat: 'GJ',
    haryana: 'HR',
    'himachal pradesh': 'HP',
    'jammu & kashmir': 'JK',
    'jammu and kashmir': 'JK',
    karnataka: 'KA',
    kerala: 'KL',
    'madhya pradesh': 'MP',
    maharashtra: 'MH',
    manipur: 'MN',
    odisha: 'OR',
    orissa: 'OR',
    punjab: 'PB',
    rajasthan: 'RJ',
    'tamil nadu': 'TN',
    telangana: 'TG',
    'uttar pradesh': 'UP',
    'west bengal': 'WB',
};

function normalizeStateCode(value: string): string | null {
    const normalized = value.trim().toLowerCase();
    if (!normalized) return null;
    if (normalized.length === 2) return normalized.toUpperCase();
    return STATE_CODE_BY_LABEL[normalized] || null;
}

export default function AuthScreen({ onLoginSuccess }: Props) {
    const { theme } = useTheme();
    const styles = getStyles(theme);

    const [isLogin, setIsLogin] = useState(true);
    const [phone, setPhone] = useState('+91 ');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [stateCode, setStateCode] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = async () => {
        if (!phone || !password) {
            Alert.alert('Error', 'Please enter phone and password.');
            return;
        }

        let formattedPhone = phone.trim();
        // If they did not provide a country code, prepend +91 automatically
        if (!formattedPhone.startsWith('+')) {
            formattedPhone = '+91' + formattedPhone;
        }

        setLoading(true);
        try {
            if (isLogin) {
                const res = await authService.login(formattedPhone, password);
                if (res.success) onLoginSuccess();
                else Alert.alert('Login Failed', res.error);
            } else {
                if (!name || !stateCode) {
                    Alert.alert('Error', 'Please fill all required fields for signup.');
                    setLoading(false);
                    return;
                }

                const normalizedStateCode = normalizeStateCode(stateCode);
                if (!normalizedStateCode) {
                    Alert.alert('Error', 'Please enter a valid 2-letter state code or a supported state name.');
                    setLoading(false);
                    return;
                }

                const res = await authService.signup(formattedPhone, password, name, normalizedStateCode, 'GENERAL');
                if (res.success) {
                    Alert.alert('Signup Successful', 'Welcome to Fishing God!');
                    onLoginSuccess();
                } else {
                    Alert.alert('Signup Failed', res.error);
                }
            }
        } catch {
            Alert.alert('Error', 'An unexpected error occurred.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
            <View style={styles.topBar}>
                <Ionicons name="fish" size={20} color={theme.colors.textInverse} />
                <Text style={styles.topBarTitle}>Fishing God</Text>
                <View style={{ width: 20 }} />
            </View>

            <View style={styles.heroImage}>
                <View style={styles.heroOverlay} />
            </View>

            <View style={styles.content}>
                <Text style={styles.title}>Welcome to Fishing God</Text>
                <Text style={styles.subtitle}>Premium aquaculture management for modern farmers</Text>

                <View style={styles.tabs}>
                    <TouchableOpacity
                        style={[styles.tab, isLogin && styles.tabActive]}
                        onPress={() => setIsLogin(true)}
                    >
                        <Text style={[styles.tabText, isLogin && styles.tabTextActive]}>Login</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.tab, !isLogin && styles.tabActive]}
                        onPress={() => setIsLogin(false)}
                    >
                        <Text style={[styles.tabText, !isLogin && styles.tabTextActive]}>Sign Up</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.form}>
                    {!isLogin && (
                        <>
                            <Field
                                icon="person-outline"
                                label="Full Name"
                                placeholder="John Doe"
                                value={name}
                                onChangeText={setName}
                                theme={theme}
                                styles={styles}
                            />
                            <Field
                                icon="location-outline"
                                label="State (India)"
                                placeholder="Select your state"
                                value={stateCode}
                                onChangeText={setStateCode}
                                theme={theme}
                                styles={styles}
                            />
                        </>
                    )}

                    <Field
                        icon="phone-portrait-outline"
                        label="Phone Number"
                        placeholder="+91 00000 00000"
                        value={phone}
                        onChangeText={setPhone}
                        keyboardType="phone-pad"
                        theme={theme}
                        styles={styles}
                    />

                    <Field
                        icon="lock-closed-outline"
                        label="Password"
                        placeholder="Enter password"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry={!showPassword}
                        theme={theme}
                        styles={styles}
                        rightIcon={showPassword ? 'eye-outline' : 'eye-off-outline'}
                        onRightIconPress={() => setShowPassword(!showPassword)}
                    />

                    {isLogin && (
                        <TouchableOpacity style={styles.forgotWrap}>
                            <Text style={styles.forgotText}>Forgot Password?</Text>
                        </TouchableOpacity>
                    )}

                    <TouchableOpacity style={styles.primaryButton} onPress={handleSubmit} disabled={loading}>
                        {loading ? (
                            <ActivityIndicator color={theme.colors.textInverse} />
                        ) : (
                            <>
                                <Text style={styles.primaryButtonText}>{isLogin ? 'Sign In' : 'Create Account'}</Text>
                                <Ionicons name="arrow-forward" size={18} color={theme.colors.textInverse} />
                            </>
                        )}
                    </TouchableOpacity>

                    <View style={styles.dividerRow}>
                        <View style={styles.divider} />
                        <Text style={styles.dividerText}>{isLogin ? 'OR SIGN UP' : 'ALREADY HAVE AN ACCOUNT?'}</Text>
                        <View style={styles.divider} />
                    </View>

                    <TouchableOpacity style={styles.secondaryButton} onPress={() => setIsLogin(!isLogin)}>
                        <Ionicons
                            name={isLogin ? 'person-add-outline' : 'log-in-outline'}
                            size={18}
                            color={theme.colors.primary}
                        />
                        <Text style={styles.secondaryButtonText}>
                            {isLogin ? 'Create New Account' : 'Switch To Login'}
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>

            <Text style={styles.footer}>
                By continuing, you agree to our Terms of Service and Privacy Policy
            </Text>
        </ScrollView>
    );
}

function Field({
    icon,
    label,
    theme,
    styles,
    rightIcon,
    onRightIconPress,
    ...props
}: any) {
    return (
        <View style={styles.fieldWrap}>
            <Text style={styles.fieldLabel}>{label}</Text>
            <View style={styles.field}>
                <Ionicons name={icon} size={18} color={theme.colors.textMuted} />
                <TextInput
                    style={styles.input}
                    placeholderTextColor={theme.colors.textMuted}
                    {...props}
                />
                {rightIcon && (
                    <TouchableOpacity onPress={onRightIconPress} style={{ padding: 4 }}>
                        <Ionicons name={rightIcon} size={20} color={theme.colors.textMuted} />
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
}

const getStyles = (theme: any) => StyleSheet.create({
    container: {
        flexGrow: 1,
        backgroundColor: theme.colors.background,
    },
    topBar: {
        height: 56,
        backgroundColor: theme.colors.primaryDark,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 18,
    },
    topBarTitle: {
        color: theme.colors.textInverse,
        fontSize: 16,
        fontWeight: '800',
    },
    heroImage: {
        height: 180,
        backgroundColor: theme.colors.primaryDark,
        overflow: 'hidden',
    },
    heroOverlay: {
        flex: 1,
        backgroundColor: theme.isDark ? '#050505' : '#295D31',
        opacity: 0.85,
    },
    content: {
        paddingHorizontal: 20,
        paddingTop: 28,
    },
    title: {
        ...theme.typography.h2,
        textAlign: 'center',
    },
    subtitle: {
        ...theme.typography.body,
        textAlign: 'center',
        color: theme.colors.textSecondary,
        marginTop: 8,
        marginBottom: 20,
    },
    tabs: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.border,
        marginBottom: 20,
    },
    tab: {
        flex: 1,
        paddingBottom: 12,
        alignItems: 'center',
        borderBottomWidth: 2,
        borderBottomColor: 'transparent',
    },
    tabActive: {
        borderBottomColor: theme.colors.primary,
    },
    tabText: {
        color: theme.colors.textMuted,
        fontSize: 14,
        fontWeight: '700',
    },
    tabTextActive: {
        color: theme.colors.textPrimary,
    },
    form: {
        gap: 14,
        paddingBottom: 28,
    },
    fieldWrap: {
        gap: 8,
    },
    fieldLabel: {
        fontSize: 13,
        fontWeight: '700',
        color: theme.colors.textSecondary,
    },
    field: {
        height: 56,
        borderRadius: theme.borderRadius.lg,
        backgroundColor: theme.colors.surface,
        borderWidth: 1,
        borderColor: theme.colors.border,
        paddingHorizontal: 16,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    input: {
        flex: 1,
        color: theme.colors.textPrimary,
        fontSize: 16,
    },
    forgotWrap: {
        alignItems: 'flex-end',
        marginTop: -4,
    },
    forgotText: {
        color: theme.colors.primary,
        fontWeight: '700',
        fontSize: 13,
    },
    primaryButton: {
        height: 56,
        borderRadius: theme.borderRadius.lg,
        backgroundColor: theme.colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        gap: 8,
        marginTop: 4,
    },
    primaryButtonText: {
        color: theme.colors.textInverse,
        fontSize: 18,
        fontWeight: '800',
    },
    dividerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        marginTop: 2,
    },
    divider: {
        flex: 1,
        height: 1,
        backgroundColor: theme.colors.border,
    },
    dividerText: {
        color: theme.colors.textMuted,
        fontSize: 11,
        fontWeight: '800',
    },
    secondaryButton: {
        height: 54,
        borderRadius: theme.borderRadius.lg,
        backgroundColor: theme.colors.surface,
        borderWidth: 1,
        borderColor: theme.colors.border,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        gap: 8,
    },
    secondaryButtonText: {
        color: theme.colors.primary,
        fontSize: 17,
        fontWeight: '800',
    },
    footer: {
        color: theme.colors.textMuted,
        textAlign: 'center',
        fontSize: 12,
        lineHeight: 18,
        paddingHorizontal: 28,
        paddingBottom: 28,
    },
});
