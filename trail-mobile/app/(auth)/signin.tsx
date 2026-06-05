import { Link, useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

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

      router.replace('/consulta');
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
          <View style={styles.card}>
            <View style={styles.hero}>
              <Text style={styles.badge}>Trail Mobile</Text>
              <Text style={styles.title}>Entre para consultar trilhas com IA.</Text>
              <Text style={styles.subtitle}>Acesso seguro com JWT e suporte a refresh automático.</Text>
            </View>

            <View style={styles.form}>
              <Text style={styles.label}>Email</Text>
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
                label={isSubmitting ? 'Entrando...' : 'Entrar'}
                onPress={handleSignIn}
                disabled={isSubmitting}
                style={styles.button}
              />

              <Link href="/signup" asChild>
                <Text style={styles.link}>Criar conta</Text>
              </Link>
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
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingVertical: 20,
  },
  card: {
    alignSelf: 'center',
    gap: 28,
    width: '100%',
    maxWidth: 520,
  },
  hero: {
    gap: 10,
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
    fontSize: 34,
    fontWeight: '800',
    lineHeight: 40,
  },
  subtitle: {
    color: '#94a3b8',
    fontSize: 15,
    lineHeight: 22,
  },
  form: {
    gap: 12,
  },
  label: {
    color: '#cbd5e1',
    fontSize: 14,
    fontWeight: '600',
    marginTop: 8,
  },
  input: {
    backgroundColor: '#0f1c2f',
    borderColor: '#203246',
    borderRadius: 16,
    borderWidth: 1,
    color: '#f8fafc',
    minHeight: 52,
    width: '100%',
    paddingHorizontal: 16,
  },
  button: {
    marginTop: 10,
    width: '100%',
  },
  link: {
    color: '#7dd3fc',
    fontSize: 15,
    fontWeight: '600',
    marginTop: 8,
    textAlign: 'center',
  },
});