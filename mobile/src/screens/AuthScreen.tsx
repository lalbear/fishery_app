import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { authService } from '../services/authService';
import { useTheme } from '../ThemeContext';

interface Props {
    onLoginSuccess: () => void;
}

export default function AuthScreen({ onLoginSuccess }: Props) {
    const { theme } = useTheme();
    const styles = getStyles(theme);

    const [isLogin, setIsLogin] = useState(true);
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [stateCode, setStateCode] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        if (!phone || !password) {
            Alert.alert('Error', 'Please enter phone and password.');
            return;
        }
        setLoading(true);

        try {
            if (isLogin) {
                const res = await authService.login(phone, password);
                if (res.success) {
                    onLoginSuccess();
                } else {
                    Alert.alert('Login Failed', res.error);
                }
            } else {
                if (!name || !stateCode) {
                    Alert.alert('Error', 'Please fill all required fields for signup.');
                    setLoading(false);
                    return;
                }
                const res = await authService.signup(phone, password, name, stateCode, 'GENERAL');
                if (res.success) {
                    Alert.alert('Signup Successful', 'Welcome to Fishing God!');
                    onLoginSuccess();
                } else {
                    Alert.alert('Signup Failed', res.error);
                }
            }
        } catch (e: any) {
            Alert.alert('Error', 'An unexpected error occurred.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.header}>
                <Ionicons name="fish" size={60} color={theme.colors.primary} />
                <Text style={styles.title}>Fishing God</Text>
                <Text style={styles.subtitle}>{isLogin ? 'Welcome Back!' : 'Create an Account'}</Text>
            </View>

            <View style={styles.form}>
                {!isLogin && (
                    <>
                        <View style={styles.inputWrap}>
                            <Ionicons name="person-outline" size={20} color={theme.colors.textMuted} style={styles.icon} />
                            <TextInput style={styles.input} placeholder="Full Name" placeholderTextColor={theme.colors.textMuted} value={name} onChangeText={setName} />
                        </View>
                        <View style={styles.inputWrap}>
                            <Ionicons name="map-outline" size={20} color={theme.colors.textMuted} style={styles.icon} />
                            <TextInput style={styles.input} placeholder="State (e.g. Andhra Pradesh)" placeholderTextColor={theme.colors.textMuted} value={stateCode} onChangeText={setStateCode} />
                        </View>
                    </>
                )}

                <View style={styles.inputWrap}>
                    <Ionicons name="call-outline" size={20} color={theme.colors.textMuted} style={styles.icon} />
                    <TextInput style={styles.input} placeholder="Phone Number" placeholderTextColor={theme.colors.textMuted} value={phone} onChangeText={setPhone} keyboardType="phone-pad" maxLength={10} />
                </View>

                <View style={styles.inputWrap}>
                    <Ionicons name="lock-closed-outline" size={20} color={theme.colors.textMuted} style={styles.icon} />
                    <TextInput style={styles.input} placeholder="Password" placeholderTextColor={theme.colors.textMuted} value={password} onChangeText={setPassword} secureTextEntry />
                </View>

                <TouchableOpacity style={styles.btn} onPress={handleSubmit} disabled={loading}>
                    {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.btnText}>{isLogin ? 'Login' : 'Sign Up'}</Text>}
                </TouchableOpacity>

                <TouchableOpacity style={styles.switchBtn} onPress={() => setIsLogin(!isLogin)} disabled={loading}>
                    <Text style={styles.switchText}>
                        {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Login"}
                    </Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}

const getStyles = (theme: any) => StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.colors.background, justifyContent: 'center', padding: 20 },
    header: { alignItems: 'center', marginBottom: 40 },
    title: { fontSize: 28, fontWeight: 'bold', color: theme.colors.primary, marginTop: 10 },
    subtitle: { fontSize: 16, color: theme.colors.textSecondary, marginTop: 5 },
    form: { backgroundColor: theme.colors.surface, borderRadius: 12, padding: 20, elevation: 3 },
    inputWrap: { flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: theme.colors.border, marginBottom: 20, paddingBottom: 5 },
    icon: { marginRight: 10 },
    input: { flex: 1, fontSize: 16, color: theme.colors.textPrimary },
    btn: { backgroundColor: theme.colors.primary, borderRadius: 8, padding: 15, alignItems: 'center', marginTop: 10 },
    btnText: { color: theme.colors.surface, fontSize: 16, fontWeight: 'bold' },
    switchBtn: { marginTop: 20, alignItems: 'center' },
    switchText: { color: theme.colors.primary, fontSize: 14, fontWeight: '500' }
});
