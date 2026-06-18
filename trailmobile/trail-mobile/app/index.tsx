import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { ScrollView, StyleSheet, Text, View, Pressable, ActivityIndicator } from 'react-native';

import { TrailScreen } from '@/components/ui/Screen';
import { useAuthStore } from '@/store/authStore';

export default function WelcomeScreen() {
  const router = useRouter();
  const hasHydrated = useAuthStore((state) => state.hasHydrated);
  const session = useAuthStore((state) => state.session);

  // Redirecionamento automático se já estiver logado
  useEffect(() => {
    if (hasHydrated && session) {
      router.replace('/dashboard');
    }
  }, [hasHydrated, session]);

  if (!hasHydrated) {
    return (
      <TrailScreen>
        <View style={styles.centeredState}>
          <ActivityIndicator color="#f97316" size="large" />
        </View>
      </TrailScreen>
    );
  }

  return (
    <TrailScreen>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Brand Header / Navbar */}
        <View style={styles.brandNavbar}>
          <Text style={styles.logoText}>
            T<Text style={styles.orangeAccent}>R</Text>AIL<Text style={styles.orangeAccent}>.</Text>
          </Text>
        </View>

        {/* Hero Section */}
        <View style={styles.heroSection}>
          <Text style={styles.heroTagline}>✨ TRILHAS DE ESTUDO COM IA</Text>
          <Text style={styles.heroTitle}>
            Aprender devia ser{' '}
            <Text style={styles.heroTitleHighlight}>seu caminho</Text>
            , não o roadmap de outra pessoa.
          </Text>
          <Text style={styles.heroSubtitle}>
            Trail gera uma trilha única a partir dos seus objetivos, tempo disponível e nível atual — e adapta em tempo real conforme você avança. Acompanhada por mentores humanos, não só por um bot.
          </Text>
        </View>

        {/* Metrics Section (Social Proof) */}
        <View style={styles.metricsContainer}>
          <View style={styles.metricItem}>
            <Text style={styles.metricValue}>3.2k+</Text>
            <Text style={styles.metricLabel}>trilhas personalizadas geradas</Text>
          </View>
          <View style={styles.metricItem}>
            <Text style={styles.metricValue}>87%</Text>
            <Text style={styles.metricLabel}>dos alunos completam mais de 1 módulo/semana</Text>
          </View>
          <View style={styles.metricItem}>
            <Text style={styles.metricValue}>4.9★</Text>
            <Text style={styles.metricLabel}>avaliação média dos mentores</Text>
          </View>
        </View>

        {/* Pilars Section */}
        <View style={styles.pilarsSection}>
          <Text style={styles.sectionEyebrow}>PILARES</Text>
          <Text style={styles.sectionTitle}>
            Uma plataforma desenhada em torno de como devs realmente aprendem.
          </Text>

          <View style={styles.pilarCard}>
            <View style={styles.pilarHeader}>
              <View style={styles.pilarIconContainer}>
                <Text style={styles.pilarIcon}>🎯</Text>
              </View>
              <Text style={styles.pilarTitle}>Onboarding inteligente</Text>
            </View>
            <Text style={styles.pilarDescription}>
              Responda 5 perguntas. A IA monta uma trilha única com módulos, aulas e exercícios sob medida para seu objetivo e ritmo.
            </Text>
          </View>

          <View style={styles.pilarCard}>
            <View style={styles.pilarHeader}>
              <View style={styles.pilarIconContainer}>
                <Text style={styles.pilarIcon}>💻</Text>
              </View>
              <Text style={styles.pilarTitle}>Execução guiada</Text>
            </View>
            <Text style={styles.pilarDescription}>
              Conteúdo em etapas com desbloqueio progressivo. Feedback a cada aula. Notas associadas ao minuto exato do vídeo.
            </Text>
          </View>

          <View style={styles.pilarCard}>
            <View style={styles.pilarHeader}>
              <View style={styles.pilarIconContainer}>
                <Text style={styles.pilarIcon}>🔄</Text>
              </View>
              <Text style={styles.pilarTitle}>Adaptação contínua</Text>
            </View>
            <Text style={styles.pilarDescription}>
              A IA observa onde você trava, o quanto acertou nos exercícios, e reorganiza a trilha — sem você pedir.
            </Text>
          </View>

          <View style={styles.pilarCard}>
            <View style={styles.pilarHeader}>
              <View style={styles.pilarIconContainer}>
                <Text style={styles.pilarIcon}>📊</Text>
              </View>
              <Text style={styles.pilarTitle}>Mentoria orientada a dados</Text>
            </View>
            <Text style={styles.pilarDescription}>
              Mentores enxergam progresso individual e coletivo em tempo real. Alunos em risco são sinalizados automaticamente.
            </Text>
          </View>
        </View>

        {/* Testimonial Section */}
        <View style={styles.testimonialSection}>
          <Text style={styles.sectionEyebrow}>DEPOIMENTOS</Text>
          <View style={styles.testimonialCard}>
            <Text style={styles.quoteText}>
              "Em 3 meses aprendi mais com a Trail do que em 2 anos pulando entre cursos. A trilha ajusta antes de eu perceber que tô travando."
            </Text>
            <View style={styles.authorContainer}>
              <View style={styles.avatarCircle}>
                <Text style={styles.avatarText}>AB</Text>
              </View>
              <View style={styles.authorMeta}>
                <Text style={styles.authorName}>Ana Beatriz Costa</Text>
                <Text style={styles.authorRole}>Jr. Frontend - contratada em jan/26</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Bottom CTA Block */}
        <View style={styles.actionContainer}>
          <Pressable style={styles.primaryBtn} onPress={() => router.push('/signup')}>
            <Text style={styles.primaryBtnText}>Começar trilha grátis →</Text>
          </Pressable>

          <Pressable style={styles.secondaryBtn} onPress={() => router.push('/signin')}>
            <Text style={styles.secondaryBtnText}>
              Já tem uma conta? <Text style={styles.orangeText}>Entrar</Text>
            </Text>
          </Pressable>
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
    backgroundColor: '#07111f',
  },
  scrollContent: {
    flexGrow: 1,
    backgroundColor: '#07111f',
    paddingBottom: 40,
    paddingHorizontal: 4,
  },
  brandNavbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#1e293b',
    marginBottom: 20,
  },
  logoText: {
    color: '#ffffff',
    fontSize: 28,
    fontWeight: '900',
    letterSpacing: 1.5,
  },
  orangeAccent: {
    color: '#f97316',
  },
  heroSection: {
    marginBottom: 32,
  },
  heroTagline: {
    color: '#f97316',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1.2,
    marginBottom: 10,
  },
  heroTitle: {
    color: '#ffffff',
    fontSize: 28,
    fontWeight: '800',
    lineHeight: 36,
    marginBottom: 16,
  },
  heroTitleHighlight: {
    color: '#f97316',
    fontStyle: 'italic',
    fontWeight: '900',
  },
  heroSubtitle: {
    color: '#94a3b8',
    fontSize: 15,
    lineHeight: 22,
  },
  metricsContainer: {
    borderTopWidth: 1,
    borderTopColor: '#1e293b',
    paddingTop: 24,
    marginBottom: 40,
    gap: 20,
  },
  metricItem: {
    flexDirection: 'column',
  },
  metricValue: {
    color: '#f97316',
    fontSize: 32,
    fontWeight: '800',
    lineHeight: 36,
  },
  metricLabel: {
    color: '#94a3b8',
    fontSize: 13,
    lineHeight: 18,
    marginTop: 4,
  },
  pilarsSection: {
    marginBottom: 40,
    gap: 16,
  },
  sectionEyebrow: {
    color: '#f97316',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  sectionTitle: {
    color: '#ffffff',
    fontSize: 22,
    fontWeight: '800',
    lineHeight: 28,
    marginBottom: 8,
  },
  pilarCard: {
    backgroundColor: '#0f1c2f',
    borderColor: '#1e293b',
    borderWidth: 1,
    borderRadius: 12,
    padding: 20,
    gap: 10,
  },
  pilarHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  pilarIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: 'rgba(249, 115, 22, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(249, 115, 22, 0.2)',
  },
  pilarIcon: {
    fontSize: 18,
  },
  pilarTitle: {
    color: '#f8fafc',
    fontSize: 16,
    fontWeight: '700',
  },
  pilarDescription: {
    color: '#cbd5e1',
    fontSize: 13.5,
    lineHeight: 20,
  },
  testimonialSection: {
    marginBottom: 40,
    gap: 16,
  },
  testimonialCard: {
    backgroundColor: '#0f1c2f',
    borderColor: '#1e293b',
    borderWidth: 1,
    borderRadius: 12,
    padding: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#f97316',
  },
  quoteText: {
    color: '#f8fafc',
    fontSize: 15,
    fontStyle: 'italic',
    lineHeight: 22,
    marginBottom: 16,
  },
  authorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatarCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#7c3aed',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 14,
  },
  authorMeta: {
    flex: 1,
  },
  authorName: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
  },
  authorRole: {
    color: '#94a3b8',
    fontSize: 12,
    marginTop: 2,
  },
  actionContainer: {
    gap: 14,
    width: '100%',
    marginTop: 10,
  },
  primaryBtn: {
    backgroundColor: '#f97316',
    borderRadius: 12,
    minHeight: 52,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryBtnText: {
    color: '#f8fafc',
    fontSize: 16,
    fontWeight: '700',
  },
  secondaryBtn: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  secondaryBtnText: {
    color: '#94a3b8',
    fontSize: 14,
    fontWeight: '600',
  },
  orangeText: {
    color: '#f97316',
    fontWeight: '700',
  },
});