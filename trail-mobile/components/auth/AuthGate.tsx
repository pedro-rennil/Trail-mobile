import { useEffect } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { usePathname, useRouter } from 'expo-router';

import { useAuthStore } from '@/store/authStore';

export function AuthGate() {
  const router = useRouter();
  const pathname = usePathname();
  const hasHydrated = useAuthStore((state) => state.hasHydrated);
  const session = useAuthStore((state) => state.session);

  useEffect(() => {
    if (!hasHydrated) {
      return;
    }

    const isAuthRoute = pathname.startsWith('/signin') || pathname.startsWith('/signup');
    const isPublicRoute = pathname === '/';

    if (!session && !isAuthRoute && !isPublicRoute) {
      router.replace('/signin');
      return;
    }

    if (session && isAuthRoute) {
      router.replace('/consulta');
    }
  }, [hasHydrated, pathname, router, session]);

  if (hasHydrated) {
    return null;
  }

  return (
    <View style={styles.loading}>
      <ActivityIndicator size="large" color="#38bdf8" />
    </View>
  );
}

const styles = StyleSheet.create({
  loading: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    backgroundColor: '#07111f',
    justifyContent: 'center',
    zIndex: 20,
  },
});