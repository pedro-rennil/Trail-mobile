import axios from 'axios';
import { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  Linking,
} from 'react-native';
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

  // Estados de submissão do desafio
  const [expandedChallengeId, setExpandedChallengeId] = useState<string | null>(null);
  const [submissionUrl, setSubmissionUrl] = useState('');
  const [submittingId, setSubmittingId] = useState<string | null>(null);

  async function loadTrail() {
    if (!trailId) {
      setState('not-found');
      return;
    }

    setState('loading');

    try {
      const [trailResponse, challengesResponse] = await Promise.all([
        api.get<TrailResponse>(`/trails/${trailId}`, {
          headers: { 'X-Skip-Error-Handler': 'true' },
        }),
        api.get<ChallengeResponse[]>(`/trails/${trailId}/challenges`, {
          headers: { 'X-Skip-Error-Handler': 'true' },
        }),
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

  async function handleSubmitSubmission(challengeId: string) {
    if (!submissionUrl.trim()) {
      Alert.alert('Erro', 'Por favor, insira o link do GitHub ou Gist para a entrega.');
      return;
    }

    setSubmittingId(challengeId);

    try {
      await api.post('/submissions', {
        challengeId,
        gitHubUrl: submissionUrl.trim(),
      });

      Alert.alert('Sucesso', 'Sua solução foi submetida para avaliação!');
      setSubmissionUrl('');
      // Recarrega os desafios para mostrar o novo status "Submitted"
      const challengesResponse = await api.get<ChallengeResponse[]>(`/trails/${trailId}/challenges`);
      setChallenges(challengesResponse.data);
    } catch (error) {
      // Erro é amigavelmente tratado pelo interceptor global
    } finally {
      setSubmittingId(null);
    }
  }

  function getStatusLabelAndColor(status: string | null) {
    switch (status) {
      case 'Approved':
        return { 
          label: 'Aprovado ✅', 
          color: '#10b981', 
          bg: 'rgba(16, 185, 129, 0.1)',
          border: 'rgba(16, 185, 129, 0.2)' 
        };
      case 'Submitted':
        return { 
          label: 'Aguardando Avaliação ⏳', 
          color: '#f59e0b', 
          bg: 'rgba(245, 158, 11, 0.1)',
          border: 'rgba(245, 158, 11, 0.2)' 
        };
      case 'NeedsRevision':
        return { 
          label: 'Revisão Necessária ⚠️', 
          color: '#f43f5e', 
          bg: 'rgba(244, 63, 94, 0.1)',
          border: 'rgba(244, 63, 94, 0.2)' 
        };
      default:
        return { 
          label: 'Pendente', 
          color: '#94a3b8', 
          bg: 'rgba(148, 163, 184, 0.1)',
          border: 'rgba(148, 163, 184, 0.2)' 
        };
    }
  }

  if (state === 'loading') {
    return (
      <TrailScreen activeTab="trilhas">
        <Stack.Screen options={{ title: 'Carregando Trilha' }} />
        <View style={styles.centeredState}>
          <ActivityIndicator color="#f97316" size="large" />
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
      <TrailScreen activeTab="trilhas">
        <Stack.Screen options={{ title: 'Trilha não encontrada' }} />
        <View style={styles.centeredState}>
          <Text style={styles.stateTitle}>Trilha não encontrada</Text>
          <Text style={styles.stateDescription}>
            O backend não localizou a trilha solicitada. Verifique se o identificador está correto.
          </Text>
          <Link href="/dashboard" asChild>
            <TrailButton label="Voltar ao Painel" />
          </Link>
        </View>
      </TrailScreen>
    );
  }

  if (state === 'error') {
    return (
      <TrailScreen activeTab="trilhas">
        <Stack.Screen options={{ title: 'Erro' }} />
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
      <Stack.Screen options={{ title: trail?.name || 'Sua Trilha' }} />
      <TrailScreen activeTab="trilhas">
        <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
          <Text style={styles.badge}>Trilha Gerada por IA</Text>
          <Text style={styles.title}>{trail?.name ?? 'Sua trilha foi gerada'}</Text>
          {trail?.description ? <Text style={styles.description}>{trail.description}</Text> : null}

          {/* Resumo da Trilha */}
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
              <Text style={styles.summaryLabel}>Total de Desafios</Text>
              <Text style={styles.summaryValue}>{trail?.challengesCount ?? challenges.length}</Text>
            </View>
          </View>

          {/* Desafios */}
          <Text style={styles.sectionHeader}>Desafios da Trilha</Text>
          {challenges.length > 0 ? (
            challenges.map((challenge) => {
              const isExpanded = expandedChallengeId === challenge.id;
              const status = getStatusLabelAndColor(challenge.lastSubmissionStatus);

              return (
                <View key={challenge.id} style={styles.challengeItem}>
                  <Pressable
                    onPress={() => {
                      setExpandedChallengeId(isExpanded ? null : challenge.id);
                      setSubmissionUrl('');
                    }}
                    style={styles.challengeHeader}
                  >
                    <View style={styles.challengeHeaderLeft}>
                      <Text style={styles.challengeOrder}>Etapa {challenge.order}</Text>
                      <Text style={styles.challengeTitle}>{challenge.title}</Text>
                    </View>
                    <View style={styles.challengeHeaderRight}>
                      <View style={[styles.statusBadge, { backgroundColor: status.bg, borderColor: status.border, borderWidth: 1 }]}>
                        <Text style={[styles.statusText, { color: status.color }]}>
                          {status.label}
                        </Text>
                      </View>
                      <Text style={styles.expandChevron}>{isExpanded ? '▲' : '▼'}</Text>
                    </View>
                  </Pressable>

                  {isExpanded ? (
                    <View style={styles.challengeDetails}>
                      <Text style={styles.challengeDescription}>{challenge.description}</Text>

                      {/* Link de Estudos */}
                      {challenge.youtubeUrl ? (
                        <Pressable
                          onPress={() => Linking.openURL(challenge.youtubeUrl!)}
                          style={styles.youtubeButton}
                        >
                          <Text style={styles.youtubeText}>📺 Assistir videoaula de apoio</Text>
                        </Pressable>
                      ) : null}

                      {/* Feedback do Mentor (se houver) */}
                      {challenge.mentorComment ? (
                        <View style={styles.mentorFeedbackBox}>
                          <Text style={styles.feedbackTitle}>Feedback do Mentor:</Text>
                          <Text style={styles.feedbackText}>"{challenge.mentorComment}"</Text>
                        </View>
                      ) : null}

                      {/* Formulário de Submissão */}
                      {challenge.lastSubmissionStatus !== 'Approved' &&
                      challenge.lastSubmissionStatus !== 'Submitted' ? (
                        <View style={styles.submissionForm}>
                          <Text style={styles.submissionLabel}>Enviar Solução (GitHub ou Gist)</Text>
                          <TextInput
                            autoCapitalize="none"
                            placeholder="https://github.com/usuario/projeto"
                            placeholderTextColor="#64748b"
                            style={styles.submissionInput}
                            value={submissionUrl}
                            onChangeText={setSubmissionUrl}
                          />
                          <TrailButton
                            label={submittingId === challenge.id ? 'Enviando...' : 'Enviar Entrega'}
                            onPress={() => handleSubmitSubmission(challenge.id)}
                            disabled={submittingId !== null}
                            style={styles.submitBtn}
                          />
                        </View>
                      ) : challenge.lastSubmissionStatus === 'Submitted' ? (
                        <View style={styles.submittedInfoBox}>
                          <Text style={styles.submittedInfoText}>
                            Sua entrega está na fila para avaliação do mentor.
                          </Text>
                        </View>
                      ) : (
                        <View style={styles.approvedInfoBox}>
                          <Text style={styles.approvedInfoText}>
                            Desafio concluído com sucesso! 🎉
                          </Text>
                        </View>
                      )}
                    </View>
                  ) : null}
                </View>
              );
            })
          ) : (
            <Text style={styles.cardText}>Nenhum desafio foi retornado pela API.</Text>
          )}

          <Link href="/dashboard" asChild>
            <TrailButton label="Voltar ao Painel" style={{ marginTop: 12, marginBottom: 20 }} />
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
    backgroundColor: '#07111f',
  },
  centeredState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    paddingHorizontal: 16,
    backgroundColor: '#07111f',
  },
  badge: {
    color: '#f97316',
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  title: {
    color: '#f8fafc',
    fontSize: 26,
    fontWeight: '800',
    lineHeight: 32,
  },
  description: {
    color: '#94a3b8',
    fontSize: 15,
    lineHeight: 22,
  },
  sectionHeader: {
    color: '#f8fafc',
    fontSize: 18,
    fontWeight: '800',
    marginTop: 10,
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
    backgroundColor: '#f97316',
    borderRadius: 12,
    minHeight: 52,
    justifyContent: 'center',
    paddingHorizontal: 18,
    paddingVertical: 14,
  },
  retryText: {
    color: '#f8fafc',
    fontSize: 16,
    fontWeight: '700',
  },
  summaryCard: {
    backgroundColor: '#0f1c2f',
    borderColor: '#1e293b',
    borderRadius: 12,
    borderWidth: 1,
    gap: 12,
    padding: 18,
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
  cardText: {
    color: '#94a3b8',
    fontSize: 14,
    lineHeight: 20,
  },
  challengeItem: {
    backgroundColor: '#0f1c2f',
    borderColor: '#1e293b',
    borderWidth: 1,
    borderRadius: 12,
    overflow: 'hidden',
  },
  challengeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    gap: 8,
  },
  challengeHeaderLeft: {
    flex: 1,
    gap: 4,
  },
  challengeHeaderRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    justifyContent: 'flex-end',
  },
  challengeOrder: {
    color: '#f97316',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  challengeTitle: {
    color: '#f8fafc',
    fontSize: 16,
    fontWeight: '700',
  },
  statusBadge: {
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
  },
  expandChevron: {
    color: '#94a3b8',
    fontSize: 12,
  },
  challengeDetails: {
    borderTopColor: '#1e293b',
    borderTopWidth: 1,
    padding: 16,
    gap: 14,
    backgroundColor: '#07111f',
  },
  challengeDescription: {
    color: '#e2e8f0',
    fontSize: 14,
    lineHeight: 20,
  },
  youtubeButton: {
    backgroundColor: '#0f1c2f',
    borderColor: '#1e293b',
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    marginVertical: 2,
  },
  youtubeText: {
    color: '#f8fafc',
    fontSize: 13,
    fontWeight: '600',
  },
  mentorFeedbackBox: {
    backgroundColor: '#0f1c2f',
    borderColor: '#1e293b',
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    gap: 4,
    marginVertical: 2,
  },
  feedbackTitle: {
    color: '#f59e0b',
    fontSize: 13,
    fontWeight: '700',
  },
  feedbackText: {
    color: '#e2e8f0',
    fontSize: 13,
    lineHeight: 18,
    fontStyle: 'italic',
  },
  submissionForm: {
    gap: 10,
    marginTop: 4,
  },
  submissionLabel: {
    color: '#e2e8f0',
    fontSize: 13,
    fontWeight: '600',
  },
  submissionInput: {
    backgroundColor: '#0f1c2f',
    borderColor: '#1e293b',
    borderRadius: 12,
    borderWidth: 1,
    color: '#f8fafc',
    minHeight: 46,
    paddingHorizontal: 12,
  },
  submitBtn: {
    marginTop: 4,
  },
  submittedInfoBox: {
    backgroundColor: '#3b2010',
    borderColor: '#78350f',
    borderRadius: 12,
    borderWidth: 1,
    padding: 12,
  },
  submittedInfoText: {
    color: '#f59e0b',
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
  },
  approvedInfoBox: {
    backgroundColor: '#064e3b',
    borderColor: '#065f46',
    borderRadius: 12,
    borderWidth: 1,
    padding: 12,
  },
  approvedInfoText: {
    color: '#34d399',
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
  },
});