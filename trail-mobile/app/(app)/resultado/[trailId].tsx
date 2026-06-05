import axios from 'axios';
import { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Link, Stack, useLocalSearchParams } from 'expo-router';

import { TrailButton } from '@/components/ui/TrailButton';
import { TrailScreen } from '@/components/ui/Screen';
import { api } from '@/services/api';
import type { ChallengeResponse, TrailResponse } from '@/types/trail';

type LoadState = 'loading' | 'ready' | 'not-found' | 'error';

export default function ResultadoScreen() {
  const params = useLocalSearchParams<{ trailId?: string | string[]; title?: string | string[] }>();
  const trailId = useMemo(() => {
    const value = params.trailId;
    return Array.isArray(value) ? value[0] : value;
  }, [params.trailId]);

  const [state, setState] = useState<LoadState>('loading');
  const [trail, setTrail] = useState<TrailResponse | null>(null);
  const [challenges, setChallenges] = useState<ChallengeResponse[]>([]);

  async function loadTrail() {
    if (!trailId) {
      setState('not-found');
      return;
    }

    setState('loading');

    try {
      const [trailResponse, challengesResponse] = await Promise.all([
        api.get<TrailResponse>(`/trails/${trailId}`),
        api.get<ChallengeResponse[]>(`/trails/${trailId}/challenges`),
      ]);

      setTrail(trailResponse.data);
      setChallenges(challengesResponse.data);
      setState('ready');
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const status = error.response?.status;

        if (status === 404) {
          setState('not-found');
          return;
        }

        if (!error.response || error.code === 'ECONNABORTED') {
          setState('error');
          return;
        }
      }

      setState('error');
    }
  }

  useEffect(() => {
    void loadTrail();
  }, [trailId]);

  if (state === 'loading') {
    return (
      <TrailScreen>
        <Stack.Screen options={{ title: 'Resultado da consulta' }} />
        <View style={styles.centeredState}>
          <ActivityIndicator color="#38bdf8" size="large" />
          <Text style={styles.stateTitle}>Carregando trilha...</Text>
          <Text style={styles.stateDescription}>
            Estamos buscando os dados reais da API e montando os desafios na tela.
          </Text>
        </View>
      </TrailScreen>
    );
  }

  if (state === 'not-found') {
    return (
      <TrailScreen>
        <Stack.Screen options={{ title: 'Resultado da consulta' }} />
        <View style={styles.centeredState}>
          <Text style={styles.stateTitle}>Trilha não encontrada</Text>
          <Text style={styles.stateDescription}>
            O backend não localizou a trilha solicitada. Verifique se o identificador está correto.
          </Text>
          <Link href="/consulta" asChild>
            <TrailButton label="Nova consulta" />
          </Link>
        </View>
      </TrailScreen>
    );
  }

  if (state === 'error') {
    return (
      <TrailScreen>
        <Stack.Screen options={{ title: 'Resultado da consulta' }} />
        <View style={styles.centeredState}>
          <Text style={styles.stateTitle}>Falha ao carregar</Text>
          <Text style={styles.stateDescription}>
            Houve um problema de rede, timeout ou resposta inesperada da API.
          </Text>
          <Pressable onPress={loadTrail} style={styles.retryButton}>
            <Text style={styles.retryText}>Tentar novamente</Text>
          </Pressable>
        </View>
      </TrailScreen>
    );
  }

  return (
    <>
      <Stack.Screen options={{ title: 'Resultado da consulta' }} />
      <TrailScreen>
        <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
          <Text style={styles.badge}>IA concluída</Text>
          <Text style={styles.title}>{trail?.name ?? 'Sua trilha foi gerada'}</Text>
          {trail?.description ? <Text style={styles.description}>{trail.description}</Text> : null}

          <View style={styles.summaryCard}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Carga horária</Text>
              <Text style={styles.summaryValue}>{trail?.estimatedHours?.toFixed(1) ?? '0.0'}h</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Nível</Text>
              <Text style={styles.summaryValue}>{trail?.level ?? 'Não informado'}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Desafios</Text>
              <Text style={styles.summaryValue}>{trail?.challengesCount ?? challenges.length}</Text>
            </View>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardLabel}>Desafios</Text>
            {challenges.length > 0 ? (
              challenges.map((challenge) => (
                <View key={challenge.id} style={styles.challengeItem}>
                  <Text style={styles.challengeOrder}>Etapa {challenge.order}</Text>
                  <Text style={styles.challengeTitle}>{challenge.title}</Text>
                  <Text style={styles.challengeDescription}>{challenge.description}</Text>
                  {challenge.youtubeUrl ? <Text style={styles.challengeMeta}>YouTube: {challenge.youtubeUrl}</Text> : null}
                </View>
              ))
            ) : (
              <Text style={styles.cardText}>Nenhum desafio foi retornado pela API.</Text>
            )}
          </View>

          <Link href="/consulta" asChild>
            <TrailButton label="Nova consulta" />
          </Link>
        </ScrollView>
      </TrailScreen>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 14,
    paddingBottom: 24,
    paddingTop: 8,
  },
  centeredState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    paddingHorizontal: 8,
  },
  badge: {
    color: '#7dd3fc',
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  title: {
    color: '#f8fafc',
    fontSize: 30,
    fontWeight: '800',
    lineHeight: 36,
  },
  description: {
    color: '#94a3b8',
    fontSize: 15,
    lineHeight: 22,
  },
  stateTitle: {
    color: '#f8fafc',
    fontSize: 24,
    fontWeight: '800',
    textAlign: 'center',
  },
  stateDescription: {
    color: '#94a3b8',
    fontSize: 15,
    lineHeight: 22,
    textAlign: 'center',
  },
  retryButton: {
    alignItems: 'center',
    backgroundColor: '#38bdf8',
    borderRadius: 16,
    minHeight: 52,
    justifyContent: 'center',
    paddingHorizontal: 18,
    paddingVertical: 14,
  },
  retryText: {
    color: '#07111f',
    fontSize: 16,
    fontWeight: '700',
  },
  summaryCard: {
    backgroundColor: '#0f1c2f',
    borderColor: '#203246',
    borderRadius: 22,
    borderWidth: 1,
    gap: 12,
    padding: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  summaryLabel: {
    color: '#94a3b8',
    fontSize: 14,
    fontWeight: '600',
  },
  summaryValue: {
    color: '#e2e8f0',
    fontSize: 14,
    fontWeight: '700',
  },
  card: {
    backgroundColor: '#0f1c2f',
    borderColor: '#203246',
    borderRadius: 22,
    borderWidth: 1,
    gap: 8,
    padding: 16,
  },
  cardLabel: {
    color: '#e2e8f0',
    fontSize: 15,
    fontWeight: '700',
  },
  cardText: {
    color: '#94a3b8',
    fontSize: 14,
    lineHeight: 20,
  },
  challengeItem: {
    borderTopColor: '#203246',
    borderTopWidth: 1,
    gap: 8,
    paddingTop: 12,
  },
  challengeOrder: {
    color: '#7dd3fc',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  challengeTitle: {
    color: '#f8fafc',
    fontSize: 16,
    fontWeight: '700',
  },
  challengeDescription: {
    color: '#cbd5e1',
    fontSize: 14,
    lineHeight: 20,
  },
  challengeMeta: {
    color: '#94a3b8',
    fontSize: 13,
    lineHeight: 18,
  },
});