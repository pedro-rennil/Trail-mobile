import { Button, StyleSheet, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ScreenContainer } from '../components/ScreenContainer';
import type { RootStackParamList } from '../types/navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'ProjectResult'>;

export function ProjectResultScreen({ navigation, route }: Props) {
  const { project, query } = route.params;

  return (
    <ScreenContainer>
      <Text style={styles.title}>{project.title}</Text>
      <Text style={styles.description}>{project.description}</Text>

      <View style={styles.card}>
        <Text style={styles.cardLabel}>ID</Text>
        <Text>{project.id}</Text>

        <Text style={styles.cardLabel}>Status</Text>
        <Text>{project.status ?? 'Não informado'}</Text>

        <Text style={styles.cardLabel}>Trilha</Text>
        <Text>{project.trail?.name ?? 'Não informada'}</Text>

        <Text style={styles.cardLabel}>Tecnologias</Text>
        <Text>{project.technologies?.join(', ') || 'Não informadas'}</Text>
      </View>

      {query ? (
        <View style={styles.queryBox}>
          <Text style={styles.queryLabel}>Consulta informada:</Text>
          <Text>{query}</Text>
        </View>
      ) : null}

      <Button title="Nova consulta" onPress={() => navigation.goBack()} />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginTop: 12,
  },
  description: {
    color: '#556177',
  },
  card: {
    marginTop: 16,
    borderRadius: 10,
    padding: 16,
    backgroundColor: '#fff',
    gap: 6,
  },
  cardLabel: {
    marginTop: 8,
    fontWeight: '700',
    color: '#2b3240',
  },
  queryBox: {
    borderLeftWidth: 3,
    borderLeftColor: '#3861d2',
    backgroundColor: '#f0f4ff',
    padding: 12,
    borderRadius: 8,
  },
  queryLabel: {
    fontWeight: '700',
  },
});
