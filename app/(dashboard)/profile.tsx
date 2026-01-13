import React from 'react';
import { View, Text, StyleSheet, Pressable, Alert } from 'react-native';
import { signOut } from 'firebase/auth';
import { auth } from '@/services/firebase';
import { useRouter } from 'expo-router';

export default function ProfileScreen() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.replace('/login');
    } catch (error: any) {
      Alert.alert('Logout Failed', error.message);
    }
  };

  return (
    <View style={styles.container}>
      {/* LOGOUT BUTTON */}
      <Pressable style={styles.logoutBtn} onPress={handleLogout}>
        <Text style={styles.logoutText}>Logout</Text>
      </Pressable>

      {/* TITLE */}
      <Text style={styles.title}>Profile</Text>

      {/* SIMPLE DESCRIPTION (like Tasks page) */}
      <Text style={styles.subtitle}>
        Welcome back! Manage your work efficiently.
      </Text>
    </View>
  );
}

const PRIMARY = '#4A90E2';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: PRIMARY,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 8,
    textAlign: 'center',
  },
  logoutBtn: {
    position: 'absolute',
    top: 50,
    right: 20,
    backgroundColor: PRIMARY,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
  },
  logoutText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
});
