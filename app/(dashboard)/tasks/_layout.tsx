import React from 'react';
import {Slot, Stack} from "expo-router";

export default function ProfileScreen() {
    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="form" />
        </Stack>
    );
}
