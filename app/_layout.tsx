import React from 'react';
import { Slot } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StyleSheet } from 'react-native';
import { LoaderProvider } from '@/context/LoaderContext';
import { AuthProvider } from '@/context/AuthContext';

export default function RootLayout() {
  return (
    <LoaderProvider>
      <AuthProvider>
        <SafeAreaView style={styles.safeArea} edges={['top']}>
          <Slot />
        </SafeAreaView>
      </AuthProvider>
    </LoaderProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
