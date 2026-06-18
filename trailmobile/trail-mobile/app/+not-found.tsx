import { Link, Stack } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { TrailButton } from '@/components/ui/TrailButton';
import { TrailScreen } from '@/components/ui/Screen';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Página não encontrada' }} />
      <TrailScreen>
        <View style={styles.container}>
          <Text style={styles.title}>Página não encontrada</Text>
          <Text style={styles.description}>
            O caminho solicitado não existe no app. Volte para a área principal ou faça login novamente.
          </Text>
          <Link href="/signin" asChild>
            <TrailButton label="Ir para o login" />
          </Link>
        </View>
      </TrailScreen>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    gap: 12,
  },
  title: {
    color: '#e5eef8',
    fontSize: 28,
    fontWeight: '700',
  },
  description: {
    color: '#94a3b8',
    fontSize: 16,
    lineHeight: 24,
  },
});
