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
  completionRate: number;
}

interface StudentProgressResponse {
  studentId: string;
  studentName: string;
  totalChallenges: number;
  completedChallenges: number;
  completionRate: number;
  trails: TrailProgressItem[];
}

const ACHIEVEMENTS = [
  {
    icon: '🎓',
    title: 'Primeira trilha',
    desc: 'Iniciou sua primeira trilha',
    unlocked: true,
  },
  {
    icon: '✅',
    title: '10 aulas',
    desc: 'Concluiu 10 aulas',
    unlocked: true,
  },
  {
    icon: '🔥',
    title: '7 dias seguidos',
    desc: 'Estudou 7 dias consecutivos',
    unlocked: false,
  },
  {
    icon: '🤖',
    title: 'Primeira IA aceita',
    desc: 'Aceitou sugestão do Tutor IA',
    unlocked: false,
  },
];

export default function ProgressoScreen() {
  const router = useRouter();
  const session = useAuthStore((state) => state.session);
  const user = session?.user;

  const [progress, setProgress] = useState<StudentProgressResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  async function loadProgress(showLoader = true) {
    if (!user) return;
    if (showLoader) setLoading(true);

    try {
      if (user.role === 'Student') {
        const response = await api.get<StudentProgressResponse>(`/students/${user.id}/progress`);
        setProgress(response.data);
      } else {
        // Mock progress para mentores para não quebrar a tela
        setProgress({
          studentId: user.id || 'mentor',
          studentName: user.name,
          totalChallenges: 100,
          completedChallenges: 45,
          completionRate: 45,
          trails: [],
        });
      }
    } catch (error) {
      // Erro é amigavelmente tratado pelo interceptor global
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadProgress();
  }, [user?.id]);

  async function handleRefresh() {
    setRefreshing(true);
    await loadProgress(false);
    setRefreshing(false);
  }

  if (loading) {
    return (
      <TrailScreen activeTab="progresso">
        <View style={styles.centeredState}>
          <ActivityIndicator color="#f97316" size="large" />
          <Text style={styles.loadingText}>Carregando progresso...</Text>
        </View>
      </TrailScreen>
    );
  }

  const activeTrails = progress?.trails || [];
  const completedChallengesCount = progress?.completedChallenges ?? 26;
  const totalHours = ((progress?.completedChallenges ?? 26) * 1.5).toFixed(1);

  const STATS = [
    {
      label: 'Horas totais',
      value: `${totalHours}h`,
      icon: '⏱️',
    },
    {
      label: 'Aulas concluídas',
      value: String(completedChallengesCount),
      icon: '✔️',
    },
    {
      label: 'Sequência',
      value: '12 dias',
      icon: '🔥',
    },
    {
      label: 'Nível',
      value: 'Nível 3',
      icon: '🏆',
    },
  ];

  return (
    <TrailScreen activeTab="progresso">
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor="#f97316" />}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Seu Progresso</Text>
          <Text style={styles.subtitle}>Acompanhe sua evolução e conquistas</Text>
        </View>

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          {STATS.map((s) => (
            <View key={s.label} style={styles.statBox}>
              <Text style={styles.statIcon}>{s.icon}</Text>
              <Text style={styles.statValue}>{s.value}</Text>
              <Text style={styles.statLabel} numberOfLines={1}>{s.label}</Text>
            </View>
          ))}
        </View>

        {/* Trilhas em Andamento */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Trilhas em andamento</Text>
          <View style={styles.list}>
            {activeTrails.length > 0 ? (
              activeTrails.map((trail) => (
                <View key={trail.trailId} style={styles.trailCard}>
                  <View style={styles.trailCardHeader}>
                    <View style={styles.trailTitleContainer}>
                      <View style={styles.trailDot} />
                      <Text style={styles.trailTitle} numberOfLines={1}>
                        {trail.trailName}
                      </Text>
                    </View>
                    <Text style={styles.trailPercentage}>
                      {trail.completionRate.toFixed(0)}%
                    </Text>
                  </View>
                  <View style={styles.progressTrack}>
                    <View style={[styles.progressFill, { width: `${trail.completionRate}%` }]} />
                  </View>
                  <View style={styles.trailCardFooter}>
                    <Text style={styles.trailMeta}>
                      {trail.completedChallenges} de {trail.totalChallenges} desafios
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
                </View>
              ))
            ) : (
              <View style={styles.noTrailsCard}>
                <Text style={styles.noTrailsText}>Nenhuma trilha ativa no momento.</Text>
              </View>
            )}
          </View>
        </View>

        {/* Conquistas */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Conquistas</Text>
          <View style={styles.achievementsGrid}>
            {ACHIEVEMENTS.map((a) => (
              <View
                key={a.title}
                style={[styles.achievementCard, !a.unlocked && styles.lockedCard]}
              >
                <View style={[styles.achievementIconContainer, !a.unlocked && styles.lockedIconContainer]}>
                  <Text style={styles.achievementIcon}>{a.icon}</Text>
                </View>
                <Text style={styles.achievementTitle}>{a.title}</Text>
                <Text style={styles.achievementDesc}>{a.desc}</Text>
              </View>
            ))}
          </View>
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
    gap: 24,
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
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'space-between',
  },
  statBox: {
    backgroundColor: '#0f1c2f',
    borderColor: '#1e293b',
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    width: '48%',
    gap: 6,
  },
  statIcon: {
    fontSize: 20,
  },
  statValue: {
    color: '#f8fafc',
    fontSize: 24,
    fontWeight: '900',
  },
  statLabel: {
    color: '#94a3b8',
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  section: {
    gap: 14,
  },
  sectionTitle: {
    color: '#f8fafc',
    fontSize: 18,
    fontWeight: '800',
  },
  list: {
    gap: 12,
  },
  trailCard: {
    backgroundColor: '#0f1c2f',
    borderColor: '#1e293b',
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    gap: 12,
  },
  trailCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  trailTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  trailDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#f97316',
  },
  trailTitle: {
    color: '#f8fafc',
    fontSize: 14,
    fontWeight: '700',
    flex: 1,
  },
  trailPercentage: {
    color: '#f97316',
    fontSize: 13,
    fontWeight: '700',
  },
  progressTrack: {
    height: 4,
    backgroundColor: '#07111f',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#f97316',
    borderRadius: 2,
  },
  trailCardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 8,
  },
  trailMeta: {
    color: '#94a3b8',
    fontSize: 12,
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
  noTrailsCard: {
    backgroundColor: '#0f1c2f',
    borderColor: '#1e293b',
    borderWidth: 1,
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
  },
  noTrailsText: {
    color: '#94a3b8',
    fontSize: 14,
  },
  achievementsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'space-between',
  },
  achievementCard: {
    backgroundColor: '#0f1c2f',
    borderColor: '#f97316',
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    width: '48%',
    gap: 8,
  },
  lockedCard: {
    borderColor: '#1e293b',
    opacity: 0.4,
  },
  achievementIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: 'rgba(249, 115, 22, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  lockedIconContainer: {
    backgroundColor: '#07111f',
  },
  achievementIcon: {
    fontSize: 20,
  },
  achievementTitle: {
    color: '#f8fafc',
    fontSize: 13,
    fontWeight: '700',
  },
  achievementDesc: {
    color: '#94a3b8',
    fontSize: 11,
    lineHeight: 14,
  },
});
