import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Modal,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  Linking,
  InteractionManager,
} from 'react-native';

import { TrailButton } from '@/components/ui/TrailButton';
import { TrailScreen } from '@/components/ui/Screen';
import { api } from '@/services/api';
import { signOut, useAuthStore } from '@/store/authStore';

interface TrailProgressItem {
  trailId: string;
  trailName: string;
  totalChallenges: number;
  completedChallenges: number;
  pendingChallenges: number;
  completionRate: number;
  lastSubmissionAt: string | null;
}

interface StudentProgressResponse {
  studentId: string;
  studentName: string;
  totalChallenges: number;
  completedChallenges: number;
  pendingChallenges: number;
  completionRate: number;
  trails: TrailProgressItem[];
}

interface MetricsOverviewResponse {
  totalStudents: number;
  totalTrails: number;
  totalChallenges: number;
  totalSubmissions: number;
  pendingSubmissions: number;
  approvedSubmissions: number;
  needsRevisionSubmissions: number;
  completionRate: number;
  approvalRate: number | null;
  averageLeadTimeHours: number | null;
}

interface PendingSubmission {
  id: string;
  studentId: string;
  studentName: string;
  challengeId: string;
  challengeTitle: string;
  trailName: string | null;
  gitHubUrl: string;
  submittedAt: string;
  status: string;
}

interface AiReviewDraft {
  qualityAnalysis: string;
  edgeCases: string[];
  suggestedComment: string;
  suggestedDecision: 'Approved' | 'NeedsRevision';
}

export default function DashboardScreen() {
  const router = useRouter();
  const session = useAuthStore((state) => state.session);
  const user = session?.user;

  const [allTrails, setAllTrails] = useState<any[]>([]);
  const [studentProgress, setStudentProgress] = useState<StudentProgressResponse | null>(null);
  const [metrics, setMetrics] = useState<MetricsOverviewResponse | null>(null);
  const [pendingSubmissions, setPendingSubmissions] = useState<PendingSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Form de Avaliação (Mentor)
  const [selectedSubmission, setSelectedSubmission] = useState<PendingSubmission | null>(null);
  const [reviewDecision, setReviewDecision] = useState<'Approved' | 'NeedsRevision'>('Approved');
  const [reviewComment, setReviewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  // Estado da IA de Copiloto
  const [loadingAi, setLoadingAi] = useState(false);
  const [aiDraft, setAiDraft] = useState<AiReviewDraft | null>(null);

  // Cores dinâmicas para as trilhas
  function getTrailColor(trailName: string) {
    if (!trailName) return '#64748b';
    const name = trailName.toLowerCase();
    if (name.includes('react')) return '#f97316'; // laranja
    if (name.includes('next') || name.includes('advanced')) return '#a78bfa'; // roxo
    if (name.includes('ui') || name.includes('ux') || name.includes('design')) return '#14b8a6'; // verde-água/teal
    if (name.includes('docker') || name.includes('devops')) return '#f43f5e'; // rosa/vermelho
    if (name.includes('git') || name.includes('github')) return '#38bdf8'; // azul claro
    if (name.includes('.net') || name.includes('c#')) return '#8b5cf6'; // violeta
    return '#64748b'; // cinza fallback
  }

  async function loadData(showLoader = true) {
    if (!user) return;
    if (showLoader) setLoading(true);

    try {
      if (user.role === 'Student') {
        const [progressResp, trailsResp] = await Promise.all([
          api.get<StudentProgressResponse>(`/students/${user.id}/progress`),
          api.get<any[]>('/trails')
        ]);
        setStudentProgress(progressResp.data);
        setAllTrails(trailsResp.data || []);
      } else {
        const [metricsResp, submissionsResp] = await Promise.all([
          api.get<MetricsOverviewResponse>('/metrics/overview'),
          api.get<PendingSubmission[]>('/submissions'),
        ]);
        setMetrics(metricsResp.data);
        setPendingSubmissions(submissionsResp.data);
      }
    } catch (error) {
      // Erro é amigavelmente tratado pelo interceptor global
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const task = InteractionManager.runAfterInteractions(() => {
      void loadData();
    });
    return () => task.cancel();
  }, [user?.id]);

  async function handleRefresh() {
    setRefreshing(true);
    await loadData(false);
    setRefreshing(false);
  }

  async function handleLogout() {
    await signOut();
    router.replace('/signin');
  }

  function handleOpenReview(sub: PendingSubmission) {
    setSelectedSubmission(sub);
    setReviewDecision('Approved');
    setReviewComment('');
    setAiDraft(null);
    setLoadingAi(false);
  }

  async function handleConsultAi() {
    if (!selectedSubmission) return;
    setLoadingAi(true);
    setAiDraft(null);
    try {
      const response = await api.post<AiReviewDraft>(`/ai/review/${selectedSubmission.id}`);
      setAiDraft(response.data);
    } catch (error) {
      // Erro tratado pelo interceptor
    } finally {
      setLoadingAi(false);
    }
  }

  function applyAiSuggestion() {
    if (!aiDraft) return;
    setReviewDecision(aiDraft.suggestedDecision);
    setReviewComment(aiDraft.suggestedComment);
  }

  async function handleSubmitReview() {
    if (!selectedSubmission) return;
    setSubmittingReview(true);

    try {
      await api.put(`/submissions/${selectedSubmission.id}/review`, {
        decision: reviewDecision,
        comment: reviewComment.trim() || null,
      });

      Alert.alert('Sucesso', 'Avaliação registrada com sucesso.');
      setSelectedSubmission(null);
      await loadData(false);
    } catch (error) {
      // Erro tratado pelo interceptor
    } finally {
      setSubmittingReview(false);
    }
  }

  const isStudent = user?.role === 'Student';
  const firstName = user?.name ? user.name.split(' ')[0] : 'Samuel';

  if (loading) {
    return (
      <TrailScreen activeTab="dashboard">
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          {/* Skeleton Navbar */}
          <View style={styles.navbar}>
            <View style={[styles.skeleton, styles.skeletonLogo]} />
            <View style={[styles.skeleton, styles.skeletonLogout]} />
          </View>

          {/* Skeleton Header */}
          <View style={styles.header}>
            <View style={[styles.skeleton, styles.skeletonGreeting]} />
            <View style={[styles.skeleton, styles.skeletonRoleSub]} />
          </View>

          {/* Skeleton statsGrid 2x2 */}
          <View style={styles.statsGrid}>
            <View style={[styles.statBox, styles.skeletonCard]}>
              <View style={[styles.skeleton, styles.skeletonCircle]} />
              <View style={[styles.skeleton, styles.skeletonStatValue]} />
              <View style={[styles.skeleton, styles.skeletonStatLabel]} />
            </View>
            <View style={[styles.statBox, styles.skeletonCard]}>
              <View style={[styles.skeleton, styles.skeletonCircle]} />
              <View style={[styles.skeleton, styles.skeletonStatValue]} />
              <View style={[styles.skeleton, styles.skeletonStatLabel]} />
            </View>
            <View style={[styles.statBox, styles.skeletonCard]}>
              <View style={[styles.skeleton, styles.skeletonCircle]} />
              <View style={[styles.skeleton, styles.skeletonStatValue]} />
              <View style={[styles.skeleton, styles.skeletonStatLabel]} />
            </View>
            <View style={[styles.statBox, styles.skeletonCard]}>
              <View style={[styles.skeleton, styles.skeletonCircle]} />
              <View style={[styles.skeleton, styles.skeletonStatValue]} />
              <View style={[styles.skeleton, styles.skeletonStatLabel]} />
            </View>
          </View>

          {/* Skeleton Section Header */}
          <View style={styles.listHeaderRow}>
            <View style={[styles.skeleton, styles.skeletonSectionTitle]} />
          </View>

          {/* Skeleton Trails Cards */}
          <View style={styles.availableTrailsList}>
            <View style={[styles.trailItemCard, styles.skeletonCard]}>
              <View style={styles.trailItemHeader}>
                <View style={styles.trailTitleContainer}>
                  <View style={[styles.skeleton, styles.skeletonCircle]} />
                  <View style={{ gap: 6 }}>
                    <View style={[styles.skeleton, styles.skeletonTextBar, { width: 140 }]} />
                    <View style={[styles.skeleton, styles.skeletonTextBar, { width: 80 }]} />
                  </View>
                </View>
              </View>
            </View>
            <View style={[styles.trailItemCard, styles.skeletonCard]}>
              <View style={styles.trailItemHeader}>
                <View style={styles.trailTitleContainer}>
                  <View style={[styles.skeleton, styles.skeletonCircle]} />
                  <View style={{ gap: 6 }}>
                    <View style={[styles.skeleton, styles.skeletonTextBar, { width: 160 }]} />
                    <View style={[styles.skeleton, styles.skeletonTextBar, { width: 95 }]} />
                  </View>
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
      </TrailScreen>
    );
  }

  return (
    <TrailScreen activeTab="dashboard">
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor="#f97316" />}
      >
        {/* Navbar simulada no topo */}
        <View style={styles.navbar}>
          <View style={styles.logoContainer}>
            <Text style={styles.logoText}>T<Text style={styles.orangeText}>R</Text>AIL<Text style={styles.orangeText}>.</Text></Text>
            <View style={styles.versionBadge}><Text style={styles.versionText}>v1.0</Text></View>
          </View>
          <Pressable onPress={handleLogout} style={styles.logoutButton}>
            <Text style={styles.logoutText}>Sair</Text>
          </Pressable>
        </View>

        {/* Header Superior */}
        <View style={styles.header}>
          <Text style={styles.greeting}>Olá, {firstName}.</Text>
          <Text style={styles.roleSub}>
            {isStudent ? 'Semana 4 da sua trilha • Continue o ritmo' : '👨‍🏫 Painel do Mentor • Acompanhamento operacional'}
          </Text>
        </View>

        {isStudent ? (
          /* ========================================================== */
          /* 🎓 VISÃO DE ESTUDANTE                                       */
          /* ========================================================== */
          <View style={styles.section}>
            {/* Grid de 4 Stats cards (2x2 Grid compacta de progresso do topo) */}
            <View style={styles.statsGrid}>
              <View style={styles.statBox}>
                <Text style={styles.statBoxEmoji}>✔️</Text>
                <Text style={styles.statBoxValue}>{studentProgress?.completedChallenges ?? 26}</Text>
                <Text style={styles.statBoxLabel}>Desafios Aprovados</Text>
              </View>
              <View style={styles.statBox}>
                <Text style={styles.statBoxEmoji}>⏱️</Text>
                <Text style={styles.statBoxValue}>
                  {((studentProgress?.completedChallenges ?? 26) * 1.5).toFixed(1)}h
                </Text>
                <Text style={styles.statBoxLabel}>Horas Estimadas</Text>
              </View>
              <View style={styles.statBox}>
                <Text style={styles.statBoxEmoji}>🔥</Text>
                <Text style={styles.statBoxValue}>12 dias</Text>
                <Text style={styles.statBoxLabel}>Sequência</Text>
              </View>
              <View style={styles.statBox}>
                <Text style={styles.statBoxEmoji}>🏆</Text>
                <Text style={styles.statBoxValue}>Nível 1</Text>
                <Text style={styles.statBoxLabel}>Nível</Text>
              </View>
            </View>

            {/* ✨ CARD DESTAQUE CO-PILOTO DE IA */}
            <View style={styles.aiCard}>
              <View style={styles.aiCardHeader}>
                <Text style={styles.aiCardTag}>✨ Co-piloto de IA</Text>
                <Text style={styles.aiCardTitle}>Crie uma trilha sob medida</Text>
              </View>
              <Text style={styles.aiCardDescription}>
                Gere um roteiro de estudos totalmente personalizado com inteligência artificial baseado no seu objetivo, linguagem ou tecnologia.
              </Text>
              <Pressable style={styles.aiCardButton} onPress={() => router.push('/consulta')}>
                <Text style={styles.aiCardButtonText}>Gerar Nova Trilha com IA →</Text>
              </Pressable>
            </View>

            {/* Listagem de Trilhas Disponíveis */}
            <View style={styles.listHeaderRow}>
              <Text style={styles.sectionTitle}>Trilhas disponíveis</Text>
              <Pressable onPress={() => router.push('/minhas-trilhas')} style={styles.inlineButton}>
                <Text style={styles.inlineButtonText}>Ver todas</Text>
              </Pressable>
            </View>

            <View style={styles.availableTrailsList}>
              {allTrails.length > 0 ? (
                allTrails.map((trail) => {
                  const trailColor = getTrailColor(trail.name);
                  // Encontrar progresso correspondente
                  const progressItem = studentProgress?.trails?.find(
                    (t) => t.trailId === trail.id
                  );
                  const completed = progressItem ? progressItem.completedChallenges : 0;
                  const total = progressItem ? progressItem.totalChallenges : (trail.challengesCount || 5);
                  const rate = progressItem ? progressItem.completionRate : 0;

                  return (
                    <Pressable
                      key={trail.id}
                      style={styles.trailItemCard}
                      onPress={() =>
                        router.push({
                          pathname: '/resultado/[trailId]',
                          params: { trailId: trail.id },
                        })
                      }
                    >
                      <View style={styles.trailItemHeader}>
                        <View style={styles.trailTitleContainer}>
                          <View style={[styles.trailSquareColor, { backgroundColor: trailColor }]} />
                          <View style={styles.trailTextDetails}>
                            <Text style={styles.trailName} numberOfLines={1}>
                              {trail.name}
                            </Text>
                            <Text style={styles.trailSubtext}>
                              {completed} de {total} desafios
                            </Text>
                          </View>
                        </View>
                        <Text style={[styles.trailProgressPercentage, { color: trailColor }]}>
                          {rate.toFixed(0)}%
                        </Text>
                      </View>
                      {/* Barra de progresso para a trilha */}
                      <View style={styles.trailTrack}>
                        <View style={[styles.trailFill, { width: `${rate}%`, backgroundColor: trailColor }]} />
                      </View>
                    </Pressable>
                  );
                })
              ) : (
                <View style={styles.emptyStateContainer}>
                  <View style={styles.emptyStateIconCircle}>
                    <Text style={styles.emptyStateIconText}>🧭</Text>
                  </View>
                  <Text style={styles.emptyStateTitleText}>Sua jornada ainda não começou.</Text>
                  <Text style={styles.emptyStateSubtitleText}>
                    Você não está matriculado em nenhuma trilha no momento. Gere um roteiro personalizado com inteligência artificial para começar.
                  </Text>
                  <Pressable style={styles.emptyStateSecondaryBtn} onPress={() => router.push('/minhas-trilhas')}>
                    <Text style={styles.emptyStateSecondaryBtnText}>Explorar Trilhas Disponíveis</Text>
                  </Pressable>
                </View>
              )}
            </View>

            {/* Atividade Semanal (Simulated Bar Chart) */}
            <View style={styles.dashboardCard}>
              <Text style={styles.cardSectionTitle}>Atividade semanal</Text>
              <Text style={styles.cardSectionSubtitle}>Minutos estudados por dia</Text>

              <View style={styles.chartContainer}>
                <View style={styles.chartBarItem}>
                  <View style={styles.chartBarTrack}>
                    <View style={[styles.chartBarFill, { height: '30%' }]} />
                  </View>
                  <Text style={styles.chartBarLabel}>Seg</Text>
                </View>
                <View style={styles.chartBarItem}>
                  <View style={styles.chartBarTrack}>
                    <View style={[styles.chartBarFill, { height: '50%' }]} />
                  </View>
                  <Text style={styles.chartBarLabel}>Ter</Text>
                </View>
                <View style={styles.chartBarItem}>
                  <View style={styles.chartBarTrack}>
                    <View style={[styles.chartBarFill, { height: '40%' }]} />
                  </View>
                  <Text style={styles.chartBarLabel}>Qua</Text>
                </View>
                <View style={styles.chartBarItem}>
                  <View style={styles.chartBarTrack}>
                    <View style={[styles.chartBarFillActive, { height: '85%' }]} />
                  </View>
                  <Text style={[styles.chartBarLabel, styles.chartBarLabelActive]}>Qui</Text>
                </View>
                <View style={styles.chartBarItem}>
                  <View style={styles.chartBarTrack}>
                    <View style={[styles.chartBarFill, { height: '60%' }]} />
                  </View>
                  <Text style={styles.chartBarLabel}>Sex</Text>
                </View>
                <View style={styles.chartBarItem}>
                  <View style={styles.chartBarTrack}>
                    <View style={[styles.chartBarFill, { height: '20%' }]} />
                  </View>
                  <Text style={styles.chartBarLabel}>Sab</Text>
                </View>
                <View style={styles.chartBarItem}>
                  <View style={styles.chartBarTrack}>
                    <View style={[styles.chartBarFill, { height: '5%' }]} />
                  </View>
                  <Text style={styles.chartBarLabel}>Dom</Text>
                </View>
              </View>
            </View>
          </View>
        ) : (
          /* ========================================================== */
          /* 👨‍🏫 VISÃO DE MENTOR / MANAGER                                 */
          /* ========================================================== */
          <View style={styles.section}>
            {/* Grid de KPIs Operacionais */}
            <Text style={styles.sectionTitle}>Métricas da Turma</Text>
            <View style={styles.kpiGrid}>
              <View style={styles.kpiCard}>
                <Text style={styles.kpiEmoji}>👥</Text>
                <Text style={styles.kpiValue}>{metrics?.totalStudents ?? 0}</Text>
                <Text style={styles.kpiLabel}>Estudantes</Text>
              </View>
              <View style={styles.kpiCard}>
                <Text style={styles.kpiEmoji}>🗺️</Text>
                <Text style={styles.kpiValue}>{metrics?.totalTrails ?? 0}</Text>
                <Text style={styles.kpiLabel}>Trilhas</Text>
              </View>
              <View style={styles.kpiCard}>
                <Text style={styles.kpiEmoji}>📈</Text>
                <Text style={styles.kpiValue}>
                  {metrics?.completionRate?.toFixed(0) ?? '0'}%
                </Text>
                <Text style={styles.kpiLabel}>Conclusão</Text>
              </View>
              <View style={styles.kpiCard}>
                <Text style={styles.kpiEmoji}>🌟</Text>
                <Text style={styles.kpiValue}>
                  {metrics?.approvalRate !== null
                    ? `${metrics?.approvalRate?.toFixed(0)}%`
                    : '-'}
                </Text>
                <Text style={styles.kpiLabel}>Aprovação</Text>
              </View>
              <View style={styles.kpiCard}>
                <Text style={styles.kpiEmoji}>⏱️</Text>
                <Text style={styles.kpiValue}>
                  {metrics?.averageLeadTimeHours !== null
                    ? `${metrics?.averageLeadTimeHours?.toFixed(1)}h`
                    : '-'}
                </Text>
                <Text style={styles.kpiLabel}>Tempo Resposta</Text>
              </View>
              <View style={[styles.kpiCard, metrics?.pendingSubmissions && metrics.pendingSubmissions > 0 ? styles.kpiHighlightCard : null]}>
                <Text style={styles.kpiEmoji}>📥</Text>
                <Text style={[styles.kpiValue, metrics?.pendingSubmissions && metrics.pendingSubmissions > 0 ? styles.kpiHighlightText : null]}>
                  {metrics?.pendingSubmissions ?? 0}
                </Text>
                <Text style={styles.kpiLabel}>Pendentes</Text>
              </View>
            </View>

            {/* Listagem de Submissões Pendentes */}
            <Text style={[styles.sectionTitle, { marginTop: 12 }]}>Aguardando Avaliação</Text>
            {pendingSubmissions.length > 0 ? (
              pendingSubmissions.map((sub) => (
                <View key={sub.id} style={styles.submissionCard}>
                  <View style={styles.submissionHeader}>
                    <Text style={styles.studentNameText}>{sub.studentName}</Text>
                    <Text style={styles.submissionDate}>
                      {new Date(sub.submittedAt).toLocaleDateString('pt-BR')}
                    </Text>
                  </View>
                  <Text style={styles.submissionDetailText}>
                    Trilha: <Text style={styles.boldText}>{sub.trailName ?? 'Geral'}</Text>
                  </Text>
                  <Text style={styles.submissionDetailText}>
                    Desafio: <Text style={styles.boldText}>{sub.challengeTitle}</Text>
                  </Text>
                  <Pressable
                    onPress={() => Linking.openURL(sub.gitHubUrl)}
                    style={styles.githubLinkContainer}
                  >
                    <Text style={styles.githubLinkText} numberOfLines={1}>
                      🔗 {sub.gitHubUrl}
                    </Text>
                  </Pressable>
                  <TrailButton
                    label="Avaliar entrega"
                    onPress={() => handleOpenReview(sub)}
                    style={styles.reviewButton}
                  />
                </View>
              ))
            ) : (
              <View style={styles.emptyStateCard}>
                <Text style={styles.emptyStateTitle}>Tudo avaliado!</Text>
                <Text style={styles.emptyStateSub}>
                  Nenhuma submissão pendente de avaliação no momento.
                </Text>
              </View>
            )}
          </View>
        )}
      </ScrollView>

      {/* FLOATING ACTION BUTTON (Extended FAB - Material 3) */}
      {isStudent && (
        <Pressable style={styles.fabButton} onPress={() => router.push('/consulta')}>
          <Text style={styles.fabText}>✨ Gerar Nova Trilha com IA</Text>
        </Pressable>
      )}

      {/* MODAL DE AVALIAÇÃO (MENTOR) */}
      <Modal visible={!!selectedSubmission} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.modalScroll}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Avaliar Submissão</Text>
                <Pressable onPress={() => setSelectedSubmission(null)} style={styles.closeModalButton}>
                  <Text style={styles.closeModalText}>✕</Text>
                </Pressable>
              </View>

              {selectedSubmission ? (
                <View style={styles.modalDetails}>
                  <Text style={styles.modalSubLabel}>Estudante</Text>
                  <Text style={styles.modalValueText}>{selectedSubmission.studentName}</Text>

                  <Text style={styles.modalSubLabel}>Desafio</Text>
                  <Text style={styles.modalValueText}>
                    {selectedSubmission.challengeTitle} ({selectedSubmission.trailName ?? 'Geral'})
                  </Text>

                  <Text style={styles.modalSubLabel}>Entrega</Text>
                  <Pressable onPress={() => Linking.openURL(selectedSubmission.gitHubUrl)} style={styles.githubModalLink}>
                    <Text style={styles.githubModalLinkText} numberOfLines={1}>
                      🔗 {selectedSubmission.gitHubUrl}
                    </Text>
                  </Pressable>

                  {/* 🤖 COPILOTO DE IA */}
                  <View style={styles.aiTutorContainer}>
                    <Pressable
                      onPress={handleConsultAi}
                      disabled={loadingAi}
                      style={[styles.aiButton, loadingAi ? styles.disabledAiButton : null]}
                    >
                      <Text style={styles.aiButtonText}>
                        {loadingAi ? '🤖 Analisando...' : '🤖 Consultar Co-piloto de IA'}
                      </Text>
                    </Pressable>

                    {loadingAi ? (
                      <View style={styles.aiLoadingRow}>
                        <ActivityIndicator color="#f97316" />
                        <Text style={styles.aiLoadingText}>O copiloto está analisando o código...</Text>
                      </View>
                    ) : null}

                    {aiDraft ? (
                      <View style={styles.aiDraftCard}>
                        <Text style={styles.aiDraftTitle}>Análise do Co-piloto:</Text>
                        <Text style={styles.aiDraftText}>
                          <Text style={styles.boldText}>Qualidade: </Text>
                          {aiDraft.qualityAnalysis}
                        </Text>
                        {aiDraft.edgeCases && aiDraft.edgeCases.length > 0 ? (
                          <View style={styles.edgeCasesContainer}>
                            <Text style={styles.boldText}>Casos de Borda Não Tratados:</Text>
                            {aiDraft.edgeCases.map((ec, idx) => (
                              <Text key={idx} style={styles.edgeCaseItem}>• {ec}</Text>
                            ))}
                          </View>
                        ) : null}
                        <Text style={styles.aiDraftText}>
                          <Text style={styles.boldText}>Recomendação: </Text>
                          {aiDraft.suggestedDecision === 'Approved' ? 'Aprovar ✅' : 'Pedir Revisão ⚠️'}
                        </Text>
                        <Text style={styles.aiDraftText}>
                          <Text style={styles.boldText}>Comentário Sugerido: </Text>
                          "{aiDraft.suggestedComment}"
                        </Text>

                        <Pressable onPress={applyAiSuggestion} style={styles.applySuggestionButton}>
                          <Text style={styles.applySuggestionText}>Usar sugestão da IA</Text>
                        </Pressable>
                      </View>
                    ) : null}
                  </View>

                  {/* Formulário de Decisão */}
                  <Text style={styles.modalSubLabel}>Sua Decisão</Text>
                  <View style={styles.decisionRow}>
                    <Pressable
                      style={[
                        styles.decisionSelectBtn,
                        reviewDecision === 'Approved' ? styles.decisionSelectBtnActiveApprove : null,
                      ]}
                      onPress={() => setReviewDecision('Approved')}
                    >
                      <Text style={[styles.decisionSelectText, reviewDecision === 'Approved' ? styles.decisionSelectTextActive : null]}>
                        Aprovar
                      </Text>
                    </Pressable>
                    <Pressable
                      style={[
                        styles.decisionSelectBtn,
                        reviewDecision === 'NeedsRevision' ? styles.decisionSelectBtnActiveRevise : null,
                      ]}
                      onPress={() => setReviewDecision('NeedsRevision')}
                    >
                      <Text style={[styles.decisionSelectText, reviewDecision === 'NeedsRevision' ? styles.decisionSelectTextActive : null]}>
                        Pedir Revisão
                      </Text>
                    </Pressable>
                  </View>

                  <Text style={styles.modalSubLabel}>Feedback / Comentário</Text>
                  <TextInput
                     multiline
                     numberOfLines={4}
                     placeholder="Escreva um feedback para o aluno (ex: sugestões de melhoria)..."
                     placeholderTextColor="#64748b"
                     style={styles.modalInput}
                     value={reviewComment}
                     onChangeText={setReviewComment}
                  />

                  <TrailButton
                    label={submittingReview ? 'Enviando...' : 'Salvar Avaliação'}
                    onPress={handleSubmitReview}
                    disabled={submittingReview}
                    style={styles.submitReviewBtn}
                  />
                </View>
              ) : null}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </TrailScreen>
  );
}

const styles = StyleSheet.create({
  centeredState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    backgroundColor: '#07111f',
  },
  loadingText: {
    color: '#94a3b8',
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 22,
  },
  content: {
    paddingBottom: 24,
    gap: 20,
    backgroundColor: '#07111f',
  },
  navbar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    borderBottomColor: '#1e293b',
    borderBottomWidth: 1,
    paddingBottom: 12,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  logoText: {
    color: '#f8fafc',
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: 1.5,
  },
  orangeText: {
    color: '#f97316',
  },
  versionBadge: {
    backgroundColor: '#1e293b',
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  versionText: {
    color: '#e2e8f0',
    fontSize: 10,
    fontWeight: '700',
  },
  logoutButton: {
    borderColor: '#ef4444',
    borderRadius: 10,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  logoutText: {
    color: '#ef4444',
    fontSize: 12,
    fontWeight: '700',
  },
  header: {
    gap: 4,
    marginTop: 4,
  },
  greeting: {
    color: '#f8fafc',
    fontSize: 28,
    fontWeight: '900',
  },
  roleSub: {
    color: '#94a3b8',
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 18,
  },
  section: {
    gap: 16,
  },
  sectionTitle: {
    color: '#f8fafc',
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  cardsRow: {
    flexDirection: 'column',
    gap: 16,
  },
  dashboardCard: {
    backgroundColor: '#0f1c2f',
    borderColor: '#1e293b',
    borderRadius: 12,
    borderWidth: 1,
    padding: 18,
    gap: 12,
  },
  cardTag: {
    color: '#f97316',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  cardTitleText: {
    color: '#f8fafc',
    fontSize: 20,
    fontWeight: '900',
  },
  cardSubText: {
    color: '#94a3b8',
    fontSize: 14,
    lineHeight: 20,
    marginVertical: 2,
  },
  cardNotesText: {
    color: '#94a3b8',
    fontSize: 13,
    lineHeight: 18,
    fontStyle: 'italic',
    marginVertical: 2,
  },
  nextLessonText: {
    color: '#e2e8f0',
    fontSize: 13,
    fontWeight: '700',
    marginVertical: 2,
  },
  continueButton: {
    backgroundColor: '#f97316',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-start',
    marginTop: 6,
  },
  continueButtonText: {
    color: '#f8fafc',
    fontSize: 14,
    fontWeight: '700',
  },
  notesLink: {
    alignSelf: 'flex-start',
    marginTop: 6,
  },
  notesLinkText: {
    color: '#a78bfa',
    fontSize: 13,
    fontWeight: '700',
    textDecorationLine: 'underline',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginVertical: 10,
  },
  statBox: {
    backgroundColor: '#0f1c2f',
    borderColor: '#1e293b',
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    width: '48%',
    marginVertical: 6,
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: 8,
  },
  statBoxEmoji: {
    fontSize: 22,
    marginBottom: 2,
  },
  statBoxValue: {
    color: '#f8fafc',
    fontSize: 22,
    fontWeight: '900',
  },
  statBoxLabel: {
    color: '#94a3b8',
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    lineHeight: 14,
  },
  cardSectionTitle: {
    color: '#f8fafc',
    fontSize: 16,
    fontWeight: '800',
  },
  cardSectionSubtitle: {
    color: '#94a3b8',
    fontSize: 12,
    fontWeight: '600',
    lineHeight: 16,
  },
  chartContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 120,
    paddingTop: 10,
    paddingHorizontal: 4,
  },
  chartBarItem: {
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  chartBarTrack: {
    backgroundColor: '#1e293b',
    width: 12,
    height: 80,
    borderRadius: 99,
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  chartBarFill: {
    backgroundColor: '#475569',
    borderRadius: 99,
  },
  chartBarFillActive: {
    backgroundColor: '#f97316',
    borderRadius: 99,
  },
  chartBarLabel: {
    color: '#64748b',
    fontSize: 10,
    fontWeight: '700',
  },
  chartBarLabelActive: {
    color: '#f97316',
  },
  listHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  inlineButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  inlineButtonText: {
    color: '#f97316',
    fontSize: 14,
    fontWeight: '700',
  },
  availableTrailsList: {
    gap: 12,
  },
  trailItemCard: {
    backgroundColor: '#0f1c2f',
    borderColor: '#1e293b',
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
    gap: 12,
  },
  trailItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  trailTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  trailTextDetails: {
    flexDirection: 'column',
    gap: 2,
    flex: 1,
  },
  trailSquareColor: {
    width: 12,
    height: 12,
    borderRadius: 3,
  },
  trailName: {
    color: '#f8fafc',
    fontSize: 15,
    fontWeight: '700',
    flex: 1,
  },
  trailSubtext: {
    color: '#94a3b8',
    fontSize: 12,
    lineHeight: 16,
  },
  trailProgressPercentage: {
    fontSize: 14,
    fontWeight: '800',
  },
  trailTrack: {
    backgroundColor: '#07111f',
    borderRadius: 99,
    height: 6,
    overflow: 'hidden',
    width: '100%',
  },
  trailFill: {
    height: '100%',
  },
  emptyStateCard: {
    backgroundColor: '#0f1c2f',
    borderColor: '#1e293b',
    borderRadius: 12,
    borderWidth: 1,
    padding: 24,
    alignItems: 'center',
    gap: 12,
  },
  emptyStateTitle: {
    color: '#f8fafc',
    fontSize: 16,
    fontWeight: '700',
  },
  emptyStateSub: {
    color: '#94a3b8',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  emptyStateButton: {
    marginTop: 8,
    width: '100%',
  },
  kpiGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    justifyContent: 'space-between',
  },
  kpiCard: {
    backgroundColor: '#0f1c2f',
    borderColor: '#1e293b',
    borderRadius: 12,
    borderWidth: 1,
    width: '48%',
    padding: 16,
    alignItems: 'flex-start',
    gap: 6,
  },
  kpiHighlightCard: {
    borderColor: '#f97316',
  },
  kpiHighlightText: {
    color: '#f97316',
  },
  kpiEmoji: {
    fontSize: 20,
    marginBottom: 2,
  },
  kpiValue: {
    color: '#f8fafc',
    fontSize: 24,
    fontWeight: '900',
  },
  kpiLabel: {
    color: '#e2e8f0',
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'left',
  },
  submissionCard: {
    backgroundColor: '#0f1c2f',
    borderColor: '#1e293b',
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
    gap: 8,
  },
  submissionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  studentNameText: {
    color: '#f8fafc',
    fontSize: 15,
    fontWeight: '700',
  },
  submissionDate: {
    color: '#64748b',
    fontSize: 12,
  },
  submissionDetailText: {
    color: '#e2e8f0',
    fontSize: 13,
  },
  boldText: {
    fontWeight: '700',
    color: '#f8fafc',
  },
  githubLinkContainer: {
    backgroundColor: '#07111f',
    borderRadius: 12,
    padding: 10,
    marginVertical: 4,
  },
  githubLinkText: {
    color: '#f97316',
    fontSize: 13,
  },
  reviewButton: {
    marginTop: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(7, 17, 31, 0.95)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#0f1c2f',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    height: '92%',
    borderColor: '#1e293b',
    borderTopWidth: 1,
  },
  modalScroll: {
    padding: 20,
    paddingBottom: 40,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    color: '#f8fafc',
    fontSize: 20,
    fontWeight: '800',
  },
  closeModalButton: {
    backgroundColor: '#1e293b',
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeModalText: {
    color: '#e2e8f0',
    fontSize: 16,
    fontWeight: '700',
  },
  modalDetails: {
    gap: 12,
  },
  modalSubLabel: {
    color: '#e2e8f0',
    fontSize: 13,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginTop: 4,
  },
  modalValueText: {
    color: '#f8fafc',
    fontSize: 15,
    fontWeight: '600',
    backgroundColor: '#07111f',
    borderRadius: 12,
    padding: 12,
  },
  githubModalLink: {
    backgroundColor: '#07111f',
    borderRadius: 12,
    padding: 12,
  },
  githubModalLinkText: {
    color: '#f97316',
    fontSize: 14,
    fontWeight: '600',
  },
  aiTutorContainer: {
    backgroundColor: '#07111f',
    borderRadius: 12,
    borderColor: '#3b2010',
    borderWidth: 1,
    padding: 12,
    gap: 10,
    marginVertical: 6,
  },
  aiButton: {
    backgroundColor: '#3b2010',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
  },
  disabledAiButton: {
    opacity: 0.6,
  },
  aiButtonText: {
    color: '#f97316',
    fontSize: 14,
    fontWeight: '700',
  },
  aiLoadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 4,
  },
  aiLoadingText: {
    color: '#e2e8f0',
    fontSize: 13,
  },
  aiDraftCard: {
    backgroundColor: '#0d1020',
    borderColor: '#1e293b',
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    gap: 8,
  },
  aiDraftTitle: {
    color: '#f97316',
    fontSize: 14,
    fontWeight: '700',
  },
  aiDraftText: {
    color: '#e2e8f0',
    fontSize: 13,
    lineHeight: 18,
  },
  edgeCasesContainer: {
    gap: 4,
  },
  edgeCaseItem: {
    color: '#ef4444',
    fontSize: 12,
    paddingLeft: 8,
  },
  applySuggestionButton: {
    backgroundColor: '#f97316',
    borderRadius: 10,
    padding: 10,
    alignItems: 'center',
    marginTop: 4,
  },
  applySuggestionText: {
    color: '#f8fafc',
    fontSize: 13,
    fontWeight: '700',
  },
  decisionRow: {
    flexDirection: 'row',
    gap: 12,
  },
  decisionSelectBtn: {
    flex: 1,
    backgroundColor: '#07111f',
    borderColor: '#1e293b',
    borderWidth: 1,
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
  },
  decisionSelectBtnActiveApprove: {
    backgroundColor: '#10b981',
    borderColor: '#059669',
  },
  decisionSelectBtnActiveRevise: {
    backgroundColor: '#ef4444',
    borderColor: '#dc2626',
  },
  decisionSelectText: {
    color: '#e2e8f0',
    fontSize: 14,
    fontWeight: '700',
  },
  decisionSelectTextActive: {
    color: '#f8fafc',
  },
  modalInput: {
    backgroundColor: '#07111f',
    borderColor: '#1e293b',
    borderRadius: 12,
    borderWidth: 1,
    color: '#f8fafc',
    minHeight: 100,
    padding: 12,
    textAlignVertical: 'top',
  },
  submitReviewBtn: {
    marginTop: 10,
  },
  aiCard: {
    backgroundColor: '#0f1c2f',
    borderColor: '#1e293b',
    borderWidth: 1,
    borderRadius: 12,
    padding: 18,
    gap: 10,
    marginTop: 8,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#f97316',
  },
  aiCardHeader: {
    gap: 4,
  },
  aiCardTag: {
    color: '#f97316',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  aiCardTitle: {
    color: '#f8fafc',
    fontSize: 18,
    fontWeight: '900',
  },
  aiCardDescription: {
    color: '#94a3b8',
    fontSize: 13,
    lineHeight: 18,
  },
  aiCardButton: {
    backgroundColor: '#f97316',
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 6,
  },
  aiCardButtonText: {
    color: '#f8fafc',
    fontSize: 14,
    fontWeight: '700',
  },
  fabButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#f97316',
    borderRadius: 28,
    paddingHorizontal: 20,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    zIndex: 100,
  },
  fabText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  skeleton: {
    backgroundColor: '#1e293b',
    borderRadius: 6,
  },
  skeletonLogo: {
    width: 100,
    height: 24,
  },
  skeletonLogout: {
    width: 50,
    height: 28,
    borderRadius: 10,
  },
  skeletonGreeting: {
    width: 180,
    height: 32,
    marginBottom: 6,
  },
  skeletonRoleSub: {
    width: 220,
    height: 16,
  },
  skeletonCard: {
    borderColor: '#1e293b',
    borderWidth: 1,
    opacity: 0.6,
  },
  skeletonCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
  },
  skeletonStatValue: {
    width: 60,
    height: 22,
    marginTop: 4,
  },
  skeletonStatLabel: {
    width: 90,
    height: 12,
    marginTop: 4,
  },
  skeletonSectionTitle: {
    width: 150,
    height: 20,
    marginVertical: 10,
  },
  skeletonTextBar: {
    height: 14,
    borderRadius: 4,
  },
  emptyStateContainer: {
    backgroundColor: '#0f1c2f',
    borderColor: '#1e293b',
    borderWidth: 1,
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    marginVertical: 10,
  },
  emptyStateIconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(249, 115, 22, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(249, 115, 22, 0.2)',
  },
  emptyStateIconText: {
    fontSize: 28,
  },
  emptyStateTitleText: {
    color: '#f8fafc',
    fontSize: 18,
    fontWeight: '800',
    textAlign: 'center',
  },
  emptyStateSubtitleText: {
    color: '#94a3b8',
    fontSize: 13,
    lineHeight: 18,
    textAlign: 'center',
    paddingHorizontal: 12,
  },
  emptyStateSecondaryBtn: {
    borderColor: '#f97316',
    borderWidth: 1.5,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  emptyStateSecondaryBtnText: {
    color: '#f97316',
    fontSize: 13,
    fontWeight: '700',
  },
});
