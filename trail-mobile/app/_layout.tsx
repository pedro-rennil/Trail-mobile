import { Stack } from 'expo-router';
import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import 'react-native-reanimated';

import { AuthGate } from '@/components/auth/AuthGate';
import { hydrateAuthSession } from '@/store/authStore';

export default function RootLayout() {
  useEffect(() => {
    void hydrateAuthSession();
  }, []);

  return (
    <View style={styles.container}>
      <AuthGate />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(app)" />
      </Stack>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#07111f',
  },
});
