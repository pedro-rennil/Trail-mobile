import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { TrailScreen } from '@/components/ui/Screen';
import { useAuthStore } from '@/store/authStore';

export default function PerfilScreen() {
  const session = useAuthStore((state) => state.session);
  const user = session?.user;

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      setLoading(false);
    }
  }, [user]);

  if (loading || !user) {
    return (
      <TrailScreen activeTab="perfil">
        <View style={styles.centeredState}>
          <ActivityIndicator color="#f97316" size="large" />
          <Text style={styles.loadingText}>Carregando perfil...</Text>
        </View>
      </TrailScreen>
    );
  }

  // Obter as iniciais do nome
  const getInitials = (fullName: string) => {
    const names = fullName.trim().split(' ');
    if (names.length >= 2) {
      return (names[0][0] + names[names.length - 1][0]).toUpperCase();
    }
    return fullName.substring(0, 2).toUpperCase();
  };

  const initials = getInitials(user.name || 'Samuel Silva');
  const roleLabel = user.role === 'Student' ? 'Estudante' : 'Mentor / Tutor';

  const rows = [
    { label: 'Nome completo', value: user.name || 'Samuel Silva' },
    { label: 'E-mail', value: user.email || 'samuel.silva@exemplo.com' },
    { label: 'Papel na plataforma', value: roleLabel },
    { label: 'Nível de gamificação', value: 'Nível 3' },
    { label: 'Membro desde', value: '10 de março de 2024' },
    { label: 'Horas de estudo', value: '39.0h' },
  ];

  return (
    <TrailScreen activeTab="perfil">
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Perfil</Text>
          <Text style={styles.subtitle}>Suas informações e progresso</Text>
        </View>

        {/* Avatar Card */}
        <View style={styles.avatarCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>
          <View style={styles.avatarInfo}>
            <View style={styles.nameRow}>
              <Text style={styles.nameText} numberOfLines={1}>
                {user.name || 'Samuel Silva'}
              </Text>
              <View style={styles.badgeContainer}>
                <Text style={styles.badgeText}>{roleLabel}</Text>
              </View>
            </View>
            <Text style={styles.emailText} numberOfLines={1}>
              {user.email || 'samuel.silva@exemplo.com'}
            </Text>
          </View>
        </View>

        {/* Info Box */}
        <View style={styles.infoBox}>
          <Text style={styles.infoBoxTitle}>Informações da conta</Text>
          
          {rows.map((row, index) => (
            <View
              key={row.label}
              style={[
                styles.rowContainer,
                index < rows.length - 1 && styles.rowBorder,
              ]}
            >
              <Text style={styles.rowLabel}>{row.label}</Text>
              <Text style={styles.rowValue}>{row.value}</Text>
            </View>
          ))}
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
  avatarCard: {
    backgroundColor: '#0f1c2f',
    borderColor: '#1e293b',
    borderWidth: 1,
    borderRadius: 12,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#f97316',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(249, 115, 22, 0.3)',
  },
  avatarText: {
    color: '#f8fafc',
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  avatarInfo: {
    flex: 1,
    gap: 4,
    justifyContent: 'center',
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flexWrap: 'wrap',
  },
  nameText: {
    color: '#f8fafc',
    fontSize: 18,
    fontWeight: '800',
    maxWidth: '60%',
  },
  badgeContainer: {
    backgroundColor: 'rgba(249, 115, 22, 0.1)',
    borderColor: 'rgba(249, 115, 22, 0.2)',
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  badgeText: {
    color: '#f97316',
    fontSize: 11,
    fontWeight: '700',
  },
  emailText: {
    color: '#94a3b8',
    fontSize: 13,
  },
  infoBox: {
    backgroundColor: '#0f1c2f',
    borderColor: '#1e293b',
    borderWidth: 1,
    borderRadius: 12,
    padding: 20,
    gap: 4,
  },
  infoBoxTitle: {
    color: '#f8fafc',
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 12,
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
  },
  rowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#1e293b',
  },
  rowLabel: {
    color: '#94a3b8',
    fontSize: 14,
    fontWeight: '600',
  },
  rowValue: {
    color: '#e2e8f0',
    fontSize: 14,
    fontWeight: '700',
  },
});
