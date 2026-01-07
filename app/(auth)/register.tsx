import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { registerUser } from '@/services/authService';
import { useLoader } from '@/hooks/useLoader';

export default function RegisterScreen() {
  const router = useRouter();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { showLoader, hideLoader, isLoading } = useLoader();

  const handleSubmit = async () => {
    if (!name || !email || !password || isLoading) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }

    showLoader();

    try {
      await registerUser(name, email, password);

      Alert.alert('Success', 'Account created successfully!', [
        {
          text: 'Login Now',
          onPress: () => router.push('/login'),
        },
      ]);
    } catch (error: any) {
      Alert.alert(
        'Registration Failed',
        error.message || 'Something went wrong.'
      );
    } finally {
      hideLoader();
    }
  };

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

      {/* Disable button while loading */}
      <Pressable
        style={[styles.registerBtn, isLoading && styles.disabledBtn]}
        onPress={handleSubmit}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.registerTextBtn}>Register</Text>
        )}
      </Pressable>

      <Pressable onPress={() => router.push('/login')}>
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
    height: 55, // Fixed height prevents resizing when spinner appears
    justifyContent: 'center',
  },
  disabledBtn: {
    opacity: 0.7, // Visual feedback that button is disabled
    backgroundColor: '#A0C4F2',
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
