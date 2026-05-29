import { useState } from 'react';
import {
  ActivityIndicator,
  Button,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { ScreenContainer } from '../components/ScreenContainer';
import { ApiError } from '../services/api';
import { useAuth } from '../context/AuthContext';

export function LoginScreen() {
  const { signIn } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleLogin() {
    if (!username.trim() || !password.trim()) {
      setError('Informe usuário e senha.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await signIn(username.trim(), password);
    } catch (loginError) {
      if (loginError instanceof ApiError) {
        setError(loginError.message);
      } else {
        setError('Erro inesperado no login.');
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScreenContainer>
      <Text style={styles.title}>Trail Mobile</Text>
      <Text style={styles.subtitle}>Entre para consultar projetos com dados reais.</Text>

      <View style={styles.formField}>
        <Text style={styles.label}>Usuário</Text>
        <TextInput
          value={username}
          onChangeText={setUsername}
          style={styles.input}
          autoCapitalize="none"
          placeholder="usuario@email.com"
        />
      </View>

      <View style={styles.formField}>
        <Text style={styles.label}>Senha</Text>
        <TextInput
          value={password}
          onChangeText={setPassword}
          style={styles.input}
          secureTextEntry
          placeholder="********"
        />
      </View>

      {error ? <Text style={styles.error}>{error}</Text> : null}

      {loading ? (
        <ActivityIndicator size="small" />
      ) : (
        <Button title="Entrar" onPress={handleLogin} />
      )}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginTop: 32,
  },
  subtitle: {
    color: '#556177',
    marginBottom: 12,
  },
  formField: {
    gap: 8,
  },
  label: {
    fontWeight: '600',
  },
  input: {
    borderWidth: 1,
    borderColor: '#d6dbe5',
    borderRadius: 8,
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  error: {
    color: '#bf2f2f',
  },
});
