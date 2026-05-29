import { useState } from 'react';
import {
  ActivityIndicator,
  Button,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ScreenContainer } from '../components/ScreenContainer';
import { useAuth } from '../context/AuthContext';
import { ApiError, getProjectById } from '../services/api';
import type { RootStackParamList } from '../types/navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'ProjectSearch'>;

export function ProjectSearchScreen({ navigation }: Props) {
  const { token, signOut } = useAuth();
  const [projectId, setProjectId] = useState('');
  const [naturalQuery, setNaturalQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSearch() {
    if (!token) {
      setError('Sessão expirada. Faça login novamente.');
      return;
    }

    if (!projectId.trim()) {
      setError('Informe o ID do projeto.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const project = await getProjectById(projectId.trim(), token);
      navigation.navigate('ProjectResult', {
        project,
        query: naturalQuery.trim() || undefined,
      });
    } catch (searchError) {
      if (searchError instanceof ApiError && searchError.status === 401) {
        await signOut();
      }

      setError(
        searchError instanceof ApiError
          ? searchError.message
          : 'Falha inesperada ao consultar projeto.',
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScreenContainer>
      <Text style={styles.title}>Consulta de Projeto</Text>
      <Text style={styles.subtitle}>
        Fluxo principal da US01: consulte projetos com API autenticada.
      </Text>

      <View style={styles.formField}>
        <Text style={styles.label}>ID do projeto</Text>
        <TextInput
          keyboardType="number-pad"
          value={projectId}
          onChangeText={setProjectId}
          style={styles.input}
          placeholder="Ex.: 1"
        />
      </View>

      <View style={styles.formField}>
        <Text style={styles.label}>Consulta em linguagem natural (opcional)</Text>
        <TextInput
          value={naturalQuery}
          onChangeText={setNaturalQuery}
          style={[styles.input, styles.multiline]}
          multiline
          numberOfLines={3}
          placeholder="Ex.: mostrar projeto mobile com IA"
        />
      </View>

      {error ? <Text style={styles.error}>{error}</Text> : null}

      {loading ? (
        <ActivityIndicator size="small" />
      ) : (
        <Button title="Consultar projeto" onPress={handleSearch} />
      )}

      <View style={styles.footerAction}>
        <Button title="Sair" color="#6f7888" onPress={signOut} />
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginTop: 20,
  },
  subtitle: {
    color: '#556177',
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
  multiline: {
    minHeight: 90,
    textAlignVertical: 'top',
  },
  error: {
    color: '#bf2f2f',
  },
  footerAction: {
    marginTop: 'auto',
  },
});
