import { Link, useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, View, Pressable } from 'react-native';

import { TrailButton } from '@/components/ui/TrailButton';
import { TrailScreen } from '@/components/ui/Screen';
import { api } from '@/services/api';
import { saveAuthSession } from '@/store/authStore';
import type { LoginRequest, LoginResponse } from '@/types/auth';

const initialForm: LoginRequest = {
  email: '',
  password: '',
};

export default function SignInScreen() {
  const router = useRouter();
  const [form, setForm] = useState<LoginRequest>(initialForm);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSignIn() {
    if (!form.email.trim() || !form.password.trim()) {
      Alert.alert('Preencha os campos', 'Informe email e senha para continuar.');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await api.post<LoginResponse>('/auth/login', {
        email: form.email.trim(),
        password: form.password,
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
      Alert.alert('Falha no login', 'Verifique suas credenciais e tente novamente.');
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
            <Text style={styles.badge}>Acesso</Text>
            <Text style={styles.title}>Entre para consultar trilhas com IA.</Text>
            <Text style={styles.subtitle}>Acesso seguro com JWT e suporte a refresh automático.</Text>
          </View>

          {/* Form */}
          <View style={styles.form}>
            <Text style={styles.label}>E-mail</Text>
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

            <Text style={styles.label}>Senha</Text>
            <TextInput
              autoComplete="password"
              placeholder="Sua senha"
              placeholderTextColor="#64748b"
              secureTextEntry
              style={styles.input}
              value={form.password}
              onChangeText={(password) => setForm((current) => ({ ...current, password }))}
            />

            <TrailButton
              label={isSubmitting ? 'Entrando...' : 'Entrar na plataforma →'}
              onPress={handleSignIn}
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

            <Link href="/signup" asChild>
              <Pressable style={styles.linkContainer}>
                <Text style={styles.linkText}>Não tem conta? <Text style={styles.orangeText}>Criar conta</Text></Text>
              </Pressable>
            </Link>
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
    justifyContent: 'center',
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
});