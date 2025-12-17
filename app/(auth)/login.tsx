import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

export default function LoginScreen() {
    const router = useRouter();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    return (
        <View style={styles.container}>
            <Text style={styles.title}>TaskHub</Text>

            <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
            />

            <TextInput
                style={styles.input}
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />

            <Pressable style={styles.loginBtn} onPress={() => router.replace('/home')}>
                <Text style={styles.loginText}>Login</Text>
            </Pressable>

            <Pressable onPress={() => router.push("/register")}>
                <Text style={styles.registerText}>Don’t have an account? Register</Text>
            </Pressable>
        </View>
    );
}

const PRIMARY = '#4A90E2';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: 24,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 32,
        fontWeight: '700',
        color: PRIMARY,
        textAlign: 'center',
        marginBottom: 40,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 14,
        borderRadius: 8,
        marginBottom: 16,
    },
    loginBtn: {
        backgroundColor: PRIMARY,
        padding: 16,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 10,
    },
    loginText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 16,
    },
    registerText: {
        marginTop: 20,
        textAlign: 'center',
        color: PRIMARY,
        fontWeight: '500',
    },
});
