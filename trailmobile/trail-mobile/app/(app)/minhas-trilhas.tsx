import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  RefreshControl,
} from 'react-native';
import { Link } from 'expo-router';

import { TrailScreen } from '@/components/ui/Screen';
import { api } from '@/services/api';
import { useAuthStore } from '@/store/authStore';

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

export default function MinhasTrilhasScreen() {
  const router = useRouter();
  const session = useAuthStore((state) => state.session);
  const user = session?.user;

  const [trails, setTrails] = useState<TrailProgressItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  async function loadTrails(showLoader = true) {
    if (!user) return;
    if (showLoader) setLoading(true);

    try {
      if (user.role === 'Student') {
        const response = await api.get<StudentProgressResponse>(`/students/${user.id}/progress`);
        setTrails(response.data.trails || []);
      } else {
        // Para mentores, vamos listar todas as trilhas do banco ou retornar vazio
        const response = await api.get<any[]>('/trails');
        // Adaptar resposta se necessário
        const adapted = response.data.map((t: any) => ({
          trailId: t.id,
          trailName: t.name,
          totalChallenges: t.challengesCount || 0,
          completedChallenges: 0,
          pendingChallenges: 0,
          completionRate: 0,
          lastSubmissionAt: null,
        }));
        setTrails(adapted);
      }
    } catch (error) {
      // Erro é amigavelmente tratado pelo interceptor global
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadTrails();
  }, [user?.id]);

  async function handleRefresh() {
    setRefreshing(true);
    await loadTrails(false);
    setRefreshing(false);
  }

  if (loading) {
    return (
      <TrailScreen activeTab="trilhas">
        <View style={styles.centeredState}>
          <ActivityIndicator color="#f97316" size="large" />
          <Text style={styles.loadingText}>Carregando suas trilhas...</Text>
        </View>
      </TrailScreen>
    );
  }

  const isStudent = user?.role === 'Student';

  return (
    <TrailScreen activeTab="trilhas">
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor="#f97316" />}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Minhas Trilhas</Text>
          <Text style={styles.subtitle}>
            {isStudent 
              ? `${trails.length} trilha${trails.length !== 1 ? 's' : ''} em andamento`
              : `${trails.length} trilha${trails.length !== 1 ? 's' : ''} cadastradas no sistema`
            }
          </Text>
        </View>

        {/* List of Trails */}
        <View style={styles.list}>
          {trails.length > 0 ? (
            trails.map((trail) => (
              <Pressable
                key={trail.trailId}
                style={styles.card}
                onPress={() =>
                  router.push({
                    pathname: '/resultado/[trailId]',
                    params: { trailId: trail.trailId },
                  })
                }
              >
                {/* Badge e Nível */}
                <View style={styles.cardHeader}>
                  <View style={styles.iconContainer}>
                    <View style={styles.indicatorDot} />
                  </View>
                  <View style={styles.levelBadge}>
                    <Text style={styles.levelText}>IA GENERATED</Text>
                  </View>
                </View>

                {/* Título */}
                <View style={styles.cardBody}>
                  <Text style={styles.cardTitle} numberOfLines={1}>
                    {trail.trailName}
                  </Text>
                  <Text style={styles.cardDesc}>
                    {trail.completedChallenges} de {trail.totalChallenges} desafios concluídos
                  </Text>
                </View>

                {/* Barra de Progresso */}
                {isStudent ? (
                  <View style={styles.progressSection}>
                    <View style={styles.progressLabels}>
                      <Text style={styles.progressText}>Progresso</Text>
                      <Text style={styles.progressPercentage}>
                        {trail.completionRate.toFixed(0)}%
                      </Text>
                    </View>
                    <View style={styles.progressTrack}>
                      <View style={[styles.progressFill, { width: `${trail.completionRate}%` }]} />
                    </View>
                  </View>
                ) : null}

                {/* Footer do Card */}
                <View style={styles.cardFooter}>
                  <Text style={styles.metaText}>
                    ⏱️ {trail.totalChallenges * 2}h estimadas
                  </Text>
                  <Link
                    href={{
                      pathname: '/resultado/[trailId]',
                      params: { trailId: trail.trailId },
                    }}
                    asChild
                  >
                    <Pressable style={styles.continueBtn}>
                      <Text style={styles.continueBtnText}>Continuar →</Text>
                    </Pressable>
                  </Link>
                </View>
              </Pressable>
            ))
          ) : (
            <View style={styles.emptyCard}>
              <Text style={styles.emptyTitle}>Nenhuma trilha ativa</Text>
              <Text style={styles.emptyDesc}>
                {isStudent 
                  ? 'Você ainda não possui nenhuma trilha de estudos gerada. Vá para o Painel para criar sua primeira trilha.'
                  : 'Nenhuma trilha encontrada no banco de dados.'
                }
              </Text>
              {isStudent ? (
                <Link href="/consulta" asChild>
                  <Pressable style={styles.createBtn}>
                    <Text style={styles.createBtnText}>Criar nova trilha com IA</Text>
                  </Pressable>
                </Link>
              ) : null}
            </View>
          )}
        </View>
      </ScrollView>
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
    color: '#e2e8f0',
    fontSize: 16,
    fontWeight: '600',
  },
  content: {
    paddingBottom: 24,
    gap: 20,
  },
  header: {
    gap: 4,
    marginTop: 4,
  },
  title: {
    color: '#f8fafc',
    fontSize: 28,
    fontWeight: '900',
  },
  subtitle: {
    color: '#94a3b8',
    fontSize: 14,
    fontWeight: '600',
  },
  list: {
    gap: 16,
  },
  card: {
    backgroundColor: '#0f1c2f',
    borderColor: '#1e293b',
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    gap: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: 'rgba(249, 115, 22, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(249, 115, 22, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  indicatorDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#f97316',
  },
  levelBadge: {
    backgroundColor: '#07111f',
    borderColor: '#1e293b',
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  levelText: {
    color: '#94a3b8',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  cardBody: {
    gap: 4,
  },
  cardTitle: {
    color: '#f8fafc',
    fontSize: 18,
    fontWeight: '800',
  },
  cardDesc: {
    color: '#94a3b8',
    fontSize: 13,
  },
  progressSection: {
    gap: 6,
  },
  progressLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  progressText: {
    color: '#94a3b8',
    fontSize: 12,
  },
  progressPercentage: {
    color: '#f97316',
    fontSize: 12,
    fontWeight: '700',
  },
  progressTrack: {
    height: 6,
    backgroundColor: '#07111f',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#f97316',
    borderRadius: 3,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#1e293b',
    paddingTop: 12,
    marginTop: 4,
  },
  metaText: {
    color: '#94a3b8',
    fontSize: 12,
    fontWeight: '600',
  },
  continueBtn: {
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  continueBtnText: {
    color: '#f97316',
    fontSize: 13,
    fontWeight: '700',
  },
  emptyCard: {
    backgroundColor: '#0f1c2f',
    borderColor: '#1e293b',
    borderWidth: 1,
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    gap: 12,
  },
  emptyTitle: {
    color: '#f8fafc',
    fontSize: 16,
    fontWeight: '700',
  },
  emptyDesc: {
    color: '#e2e8f0',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  createBtn: {
    backgroundColor: '#f97316',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  createBtnText: {
    color: '#f8fafc',
    fontSize: 14,
    fontWeight: '700',
  },
});
