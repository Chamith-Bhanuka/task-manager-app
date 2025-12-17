import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

export default function RegisterScreen() {
    const router = useRouter();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Create Account</Text>

            <TextInput
                style={styles.input}
                placeholder="Full Name"
                value={name}
                onChangeText={setName}
            />

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

            <Pressable style={styles.registerBtn} onPress={() => console.log('Register pressed')}>
                <Text style={styles.registerTextBtn}>Register</Text>
            </Pressable>

            <Pressable onPress={() => router.push("/login")}>
                <Text style={styles.loginText}>Already have an account? Login</Text>
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
        fontSize: 28,
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
    registerBtn: {
        backgroundColor: PRIMARY,
        padding: 16,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 10,
    },
    registerTextBtn: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 16,
    },
    loginText: {
        marginTop: 20,
        textAlign: 'center',
        color: PRIMARY,
        fontWeight: '500',
    },
});
