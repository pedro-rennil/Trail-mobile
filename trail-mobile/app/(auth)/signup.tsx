import { Link, useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, View } from 'react-native';

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

      router.replace('/consulta');
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
        <View style={styles.hero}>
          <Text style={styles.badge}>Trail Mobile</Text>
          <Text style={styles.title}>Crie sua conta e comece a explorar.</Text>
          <Text style={styles.subtitle}>Cadastro mínimo para o Milestone 1, com sessão persistida em SecureStore.</Text>
        </View>

        <View style={styles.form}>
          <Text style={styles.label}>Nome</Text>
          <TextInput
            placeholder="Seu nome"
            placeholderTextColor="#64748b"
            style={styles.input}
            value={form.name}
            onChangeText={(name) => setForm((current) => ({ ...current, name }))}
          />

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
            autoComplete="new-password"
            placeholder="Senha forte"
            placeholderTextColor="#64748b"
            secureTextEntry
            style={styles.input}
            value={form.password}
            onChangeText={(password) => setForm((current) => ({ ...current, password }))}
          />

          <Text style={styles.label}>Confirmar senha</Text>
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
            label={isSubmitting ? 'Criando...' : 'Criar conta'}
            onPress={handleSignUp}
            disabled={isSubmitting}
            style={styles.button}
          />

          <Link href="/signin" asChild>
            <Text style={styles.link}>Já tenho conta</Text>
          </Link>
        </View>
      </KeyboardAvoidingView>
    </TrailScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
  },
  hero: {
    gap: 10,
    marginTop: 24,
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
    fontSize: 32,
    fontWeight: '800',
    lineHeight: 38,
  },
  subtitle: {
    color: '#94a3b8',
    fontSize: 15,
    lineHeight: 22,
  },
  form: {
    gap: 12,
    marginBottom: 12,
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
    paddingHorizontal: 16,
  },
  button: {
    marginTop: 10,
  },
  link: {
    color: '#7dd3fc',
    fontSize: 15,
    fontWeight: '600',
    marginTop: 8,
    textAlign: 'center',
  },
});