import { ActivityIndicator, View } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '../context/AuthContext';
import { LoginScreen } from '../screens/LoginScreen';
import { ProjectResultScreen } from '../screens/ProjectResultScreen';
import { ProjectSearchScreen } from '../screens/ProjectSearchScreen';
import type { RootStackParamList } from '../types/navigation';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function AppNavigator() {
  const { token, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <Stack.Navigator>
      {!token ? (
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
      ) : (
        <>
          <Stack.Screen
            name="ProjectSearch"
            component={ProjectSearchScreen}
            options={{ title: 'Consultar projeto' }}
          />
          <Stack.Screen
            name="ProjectResult"
            component={ProjectResultScreen}
            options={{ title: 'Resultado' }}
          />
        </>
      )}
    </Stack.Navigator>
  );
}
