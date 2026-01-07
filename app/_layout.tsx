import React from 'react';
import { Slot } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StyleSheet } from 'react-native';
import { LoaderProvider } from '@/context/LoaderContext';

export default function RootLayout() {
  return (
    <LoaderProvider>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <Slot />
      </SafeAreaView>
    </LoaderProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
