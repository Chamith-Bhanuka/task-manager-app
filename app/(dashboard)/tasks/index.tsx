import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Pressable, Animated } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from "expo-router";

export default function TasksScreen() {

    const router = useRouter();

    const scaleAnim = useRef(new Animated.Value(0)).current;
    const pulseAnim = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        Animated.spring(scaleAnim, {
            toValue: 1,
            useNativeDriver: true,
            friction: 5,
        }).start(() => {
            Animated.loop(
                Animated.sequence([
                    Animated.timing(pulseAnim, {
                        toValue: 1.08,
                        duration: 900,
                        useNativeDriver: true,
                    }),
                    Animated.timing(pulseAnim, {
                        toValue: 1,
                        duration: 900,
                        useNativeDriver: true,
                    }),
                ])
            ).start();
        });
    }, []);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Tasks</Text>
            <Text style={styles.subtitle}>Add and manage your daily tasks effortlessly.</Text>

            <Animated.View
                style={[
                    styles.fabContainer,
                    { transform: [{ scale: scaleAnim }, { scale: pulseAnim }] }
                ]}
            >
                <Pressable style={styles.fab} onPress={() => router.push('/tasks/form')}>
                    <Ionicons name="add" size={32} color="#fff" />
                </Pressable>
            </Animated.View>
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
        paddingHorizontal: 20,
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
    fabContainer: {
        position: 'absolute',
        bottom: 30,
        right: 30,
    },
    fab: {
        backgroundColor: PRIMARY,
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5,
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowRadius: 5,
        shadowOffset: { width: 0, height: 2 },
    },
});
