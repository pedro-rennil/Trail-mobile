import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { TrailButton } from '@/components/ui/TrailButton';
import { TrailScreen } from '@/components/ui/Screen';
import { api } from '@/services/api';
import { signOut } from '@/store/authStore';
import type { GenerateTrailRequest, GenerateTrailResult } from '@/types/ai';

const initialForm: GenerateTrailRequest = {
  targetRole: 'Student',
  technicalDepth: 'beginner',
  weeklyHours: '5-10',
  learningStyle: 'hands-on',
  projectGoal: '',
};

export default function ConsultaScreen() {
  const router = useRouter();
  const [form, setForm] = useState<GenerateTrailRequest>(initialForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleLogout() {
    await signOut();
    router.replace('/signin');
  }

  async function handleSubmit() {
    if (!form.projectGoal.trim()) {
      setErrorMessage('Descreva o projeto antes de gerar a trilha.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const response = await api.post<GenerateTrailResult>('/ai/generate-trail', {
        targetRole: form.targetRole,
        technicalDepth: form.technicalDepth,
        weeklyHours: form.weeklyHours,
        learningStyle: form.learningStyle,
        projectGoal: form.projectGoal.trim(),
      });

      router.push({
        pathname: '/resultado/[trailId]',
        params: {
          trailId: response.data.trailId,
          title: response.data.title,
        },
      });
    } catch {
      setErrorMessage('Não foi possível gerar a trilha agora. Verifique sua conexão ou tente novamente em instantes.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <TrailScreen>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.container}>
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.hero}>
            <View style={styles.topRow}>
              <Text style={styles.badge}>Milestone 2</Text>
              <Pressable onPress={handleLogout} style={styles.logoutButton}>
                <Text style={styles.logoutText}>Sair</Text>
              </Pressable>
            </View>
            <Text style={styles.title}>Consulta por linguagem natural</Text>
            <Text style={styles.subtitle}>
              Descreva o projeto e a IA retorna uma trilha inicial para começar com segurança.
            </Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.label}>Objetivo do projeto</Text>
            <TextInput
              multiline
              numberOfLines={6}
              placeholder="Ex.: quero criar um app mobile para consultar trilhas, com login, IA e histórico de progresso..."
              placeholderTextColor="#64748b"
              style={[styles.input, styles.textArea]}
              textAlignVertical="top"
              value={form.projectGoal}
              onChangeText={(projectGoal) => setForm((current) => ({ ...current, projectGoal }))}
            />

            <View style={styles.row}>
              <View style={styles.rowItem}>
                <Text style={styles.label}>Nível</Text>
                <TextInput
                  placeholder="beginner"
                  placeholderTextColor="#64748b"
                  style={styles.input}
                  value={form.technicalDepth}
                  onChangeText={(technicalDepth) =>
                    setForm((current) => ({
                      ...current,
                      technicalDepth: technicalDepth as GenerateTrailRequest['technicalDepth'],
                    }))
                  }
                />
              </View>

              <View style={styles.rowItem}>
                <Text style={styles.label}>Horas/semana</Text>
                <TextInput
                  placeholder="5-10"
                  placeholderTextColor="#64748b"
                  style={styles.input}
                  value={form.weeklyHours}
                  onChangeText={(weeklyHours) =>
                    setForm((current) => ({
                      ...current,
                      weeklyHours: weeklyHours as GenerateTrailRequest['weeklyHours'],
                    }))
                  }
                />
              </View>
            </View>

            <Text style={styles.label}>Estilo de aprendizado</Text>
            <TextInput
              placeholder="hands-on"
              placeholderTextColor="#64748b"
              style={styles.input}
              value={form.learningStyle}
              onChangeText={(learningStyle) =>
                setForm((current) => ({
                  ...current,
                  learningStyle: learningStyle as GenerateTrailRequest['learningStyle'],
                }))
              }
            />

            <TrailButton label={isSubmitting ? 'Gerando trilha...' : 'Gerar trilha'} onPress={handleSubmit} disabled={isSubmitting} style={styles.button} />

            {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}

            {isSubmitting ? (
              <View style={styles.loadingRow}>
                <ActivityIndicator color="#38bdf8" />
                <Text style={styles.loadingText}>A IA pode levar alguns segundos para responder.</Text>
              </View>
            ) : null}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </TrailScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    gap: 18,
    paddingBottom: 24,
  },
  hero: {
    gap: 10,
    marginTop: 10,
  },
  topRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
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
  subtitle: {
    color: '#94a3b8',
    fontSize: 15,
    lineHeight: 22,
  },
  logoutButton: {
    borderColor: '#334155',
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  logoutText: {
    color: '#e2e8f0',
    fontSize: 13,
    fontWeight: '700',
  },
  card: {
    backgroundColor: '#0f1c2f',
    borderColor: '#203246',
    borderRadius: 24,
    borderWidth: 1,
    gap: 12,
    padding: 16,
  },
  label: {
    color: '#cbd5e1',
    fontSize: 14,
    fontWeight: '600',
    marginTop: 4,
  },
  input: {
    backgroundColor: '#07111f',
    borderColor: '#223246',
    borderRadius: 16,
    borderWidth: 1,
    color: '#f8fafc',
    minHeight: 52,
    paddingHorizontal: 16,
  },
  textArea: {
    minHeight: 150,
    paddingTop: 14,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  rowItem: {
    flex: 1,
    gap: 8,
  },
  button: {
    marginTop: 6,
  },
  errorText: {
    color: '#f87171',
    fontSize: 13,
    fontWeight: '600',
    lineHeight: 18,
    marginTop: 2,
  },
  loadingRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
    marginTop: 4,
  },
  loadingText: {
    color: '#94a3b8',
    flex: 1,
    fontSize: 13,
  },
});