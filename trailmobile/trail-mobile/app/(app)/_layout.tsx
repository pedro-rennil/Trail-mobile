import { Stack } from 'expo-router';

export default function AppLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: '#0f1c2f', borderBottomColor: '#1e293b', borderBottomWidth: 1 },
        headerTintColor: '#e2e8f0',
        headerTitleStyle: { fontWeight: '800', fontSize: 18 },
        contentStyle: { backgroundColor: '#07111f' },
        freezeOnBlur: true,
        detachInactiveScreens: true,
      }}
    >
      <Stack.Screen name="dashboard" options={{ title: 'Painel Geral' }} />
      <Stack.Screen name="consulta" options={{ title: 'Consulta por IA' }} />
      <Stack.Screen name="minhas-trilhas" options={{ title: 'Minhas Trilhas' }} />
      <Stack.Screen name="progresso" options={{ title: 'Seu Progresso' }} />
      <Stack.Screen name="perfil" options={{ title: 'Seu Perfil' }} />
      <Stack.Screen name="configuracoes" options={{ title: 'Configurações' }} />
      <Stack.Screen name="resultado/[trailId]" options={{ title: 'Detalhamento da Trilha' }} />
    </Stack>
  );
}