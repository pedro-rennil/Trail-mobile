import { Link, useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, View, Pressable } from 'react-native';

import { TrailButton } from '@/components/ui/TrailButton';
import { TrailScreen } from '@/components/ui/Screen';
import { api } from '@/services/api';
import { saveAuthSession } from '@/store/authStore';
import type { LoginResponse, RegisterRequest } from '@/types/auth';

const initialForm: RegisterRequest = {
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
};

export default function SignUpScreen() {
  const router = useRouter();
  const [form, setForm] = useState<RegisterRequest>(initialForm);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSignUp() {
    if (!form.name.trim() || !form.email.trim() || !form.password.trim()) {
      Alert.alert('Preencha os campos', 'Informe nome, email e senha para continuar.');
      return;
    }

    if (form.password !== form.confirmPassword) {
      Alert.alert('Senhas diferentes', 'Confirme a mesma senha antes de continuar.');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await api.post<LoginResponse>('/auth/register', {
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
        confirmPassword: form.confirmPassword,
      });

      await saveAuthSession({
        accessToken: response.data.token,
        refreshToken: response.data.refreshToken,
        user: {
          name: response.data.name,
          role: response.data.role,
        },
      });

      router.replace('/dashboard');
    } catch {
      Alert.alert('Falha no cadastro', 'Não foi possível criar a conta agora.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <TrailScreen>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.container}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Logo */}
          <View style={styles.logoRow}>
            <Text style={styles.logoText}>T<Text style={styles.orangeText}>R</Text>AIL<Text style={styles.orangeText}>.</Text></Text>
          </View>

          {/* Hero Header */}
          <View style={styles.hero}>
            <Text style={styles.badge}>Criar Conta</Text>
            <Text style={styles.title}>Sua trilha começa aqui.</Text>
            <Text style={styles.subtitle}>Em 3 min você tem sua primeira trilha gerada pela IA.</Text>
          </View>

          {/* Form */}
          <View style={styles.form}>
            <Text style={styles.label}>Nome completo *</Text>
            <TextInput
              placeholder="Samuel Silva"
              placeholderTextColor="#64748b"
              style={styles.input}
              value={form.name}
              onChangeText={(name) => setForm((current) => ({ ...current, name }))}
            />

            <Text style={styles.label}>E-mail *</Text>
            <TextInput
              autoCapitalize="none"
              autoComplete="email"
              keyboardType="email-address"
              placeholder="voce@exemplo.com"
              placeholderTextColor="#64748b"
              style={styles.input}
              value={form.email}
              onChangeText={(email) => setForm((current) => ({ ...current, email }))}
            />

            <Text style={styles.label}>Senha *</Text>
            <TextInput
              autoComplete="new-password"
              placeholder="Sua senha"
              placeholderTextColor="#64748b"
              secureTextEntry
              style={styles.input}
              value={form.password}
              onChangeText={(password) => setForm((current) => ({ ...current, password }))}
            />

            <Text style={styles.label}>Confirmar senha *</Text>
            <TextInput
              autoComplete="new-password"
              placeholder="Repita a senha"
              placeholderTextColor="#64748b"
              secureTextEntry
              style={styles.input}
              value={form.confirmPassword}
              onChangeText={(confirmPassword) => setForm((current) => ({ ...current, confirmPassword }))}
            />

            <TrailButton
              label={isSubmitting ? 'Criando...' : 'Criar conta e começar →'}
              onPress={handleSignUp}
              disabled={isSubmitting}
              style={styles.button}
            />

            <View style={styles.socialRow}>
              <Pressable style={styles.socialButton}>
                <Text style={styles.socialButtonText}>Continuar com Google</Text>
              </Pressable>
              <Pressable style={styles.socialButton}>
                <Text style={styles.socialButtonText}>Continuar com GitHub</Text>
              </Pressable>
            </View>

            <Link href="/signin" asChild>
              <Pressable style={styles.linkContainer}>
                <Text style={styles.linkText}>Já tem conta? <Text style={styles.orangeText}>Entrar</Text></Text>
              </Pressable>
            </Link>
          </View>

          {/* Features Column (Benefícios) */}
          <View style={styles.featuresSection}>
            <Text style={styles.featuresHeader}>Uma trilha que adapta-se enquanto você estuda.</Text>
            
            <View style={styles.featureItem}>
              <View style={styles.checkedBox}>
                <Text style={styles.checkedIcon}>✓</Text>
              </View>
              <View style={styles.featureTextContainer}>
                <Text style={styles.featureTitle}>Trilhas personalizadas</Text>
                <Text style={styles.featureDescription}>Montadas pela IA com base nos seus objetivos.</Text>
              </View>
            </View>

            <View style={styles.featureItem}>
              <View style={styles.checkedBox}>
                <Text style={styles.checkedIcon}>✓</Text>
              </View>
              <View style={styles.featureTextContainer}>
                <Text style={styles.featureTitle}>Mentoria humana</Text>
                <Text style={styles.featureDescription}>Acompanhamento real, não só automático.</Text>
              </View>
            </View>

            <View style={styles.featureItem}>
              <View style={styles.checkedBox}>
                <Text style={styles.checkedIcon}>✓</Text>
              </View>
              <View style={styles.featureTextContainer}>
                <Text style={styles.featureTitle}>Adapta em tempo real</Text>
                <Text style={styles.featureDescription}>Se você trava, a trilha ajusta.</Text>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </TrailScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#07111f',
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 40,
    gap: 24,
  },
  logoRow: {
    marginTop: 10,
    paddingVertical: 8,
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
  hero: {
    gap: 8,
  },
  badge: {
    color: '#f97316',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  title: {
    color: '#f8fafc',
    fontSize: 28,
    fontWeight: '900',
  },
  subtitle: {
    color: '#94a3b8',
    fontSize: 14,
    lineHeight: 20,
  },
  form: {
    gap: 12,
  },
  label: {
    color: '#94a3b8',
    fontSize: 13,
    fontWeight: '600',
    marginTop: 4,
  },
  input: {
    backgroundColor: '#0f1c2f',
    borderColor: '#1e293b',
    borderRadius: 12,
    borderWidth: 1,
    color: '#f8fafc',
    minHeight: 52,
    paddingHorizontal: 16,
  },
  button: {
    marginTop: 8,
  },
  socialRow: {
    flexDirection: 'column',
    gap: 10,
    marginTop: 10,
  },
  socialButton: {
    borderColor: '#1e293b',
    borderRadius: 12,
    borderWidth: 1,
    minHeight: 48,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#07111f',
  },
  socialButtonText: {
    color: '#e2e8f0',
    fontSize: 14,
    fontWeight: '600',
  },
  linkContainer: {
    paddingVertical: 8,
    alignItems: 'center',
  },
  linkText: {
    color: '#e2e8f0',
    fontSize: 14,
    fontWeight: '600',
  },
  featuresSection: {
    backgroundColor: '#0f1c2f',
    borderColor: '#1e293b',
    borderWidth: 1,
    borderRadius: 12,
    padding: 20,
    gap: 16,
    marginTop: 12,
  },
  featuresHeader: {
    color: '#f8fafc',
    fontSize: 16,
    fontWeight: '800',
    lineHeight: 22,
    marginBottom: 4,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  checkedBox: {
    backgroundColor: '#3b2010',
    borderColor: '#f97316',
    borderWidth: 1,
    borderRadius: 6,
    width: 22,
    height: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  checkedIcon: {
    color: '#f97316',
    fontSize: 12,
    fontWeight: '900',
  },
  featureTextContainer: {
    flex: 1,
    gap: 2,
  },
  featureTitle: {
    color: '#f8fafc',
    fontSize: 14,
    fontWeight: '700',
  },
  featureDescription: {
    color: '#94a3b8',
    fontSize: 13,
    lineHeight: 18,
  },
});