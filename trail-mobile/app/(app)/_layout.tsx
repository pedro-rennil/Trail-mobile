import { Stack } from 'expo-router';

export default function AppLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: '#07111f' },
        headerTintColor: '#e2e8f0',
        headerTitleStyle: { fontWeight: '700' },
        contentStyle: { backgroundColor: '#07111f' },
      }}
    >
      <Stack.Screen name="consulta" options={{ title: 'Consulta' }} />
      <Stack.Screen name="resultado/[trailId]" options={{ title: 'Resultado' }} />
    </Stack>
  );
}