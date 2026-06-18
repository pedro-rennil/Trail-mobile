import { useMemo, type PropsWithChildren, ReactNode } from 'react';
import { SafeAreaView, StyleSheet, View, Text, Pressable } from 'react-native';
import { Link } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type TrailScreenProps = PropsWithChildren<{
  footer?: ReactNode;
  activeTab?: 'dashboard' | 'trilhas' | 'progresso' | 'perfil' | 'configuracoes';
}>;

export function TrailScreen({ children, footer, activeTab }: TrailScreenProps) {
  const insets = useSafeAreaInsets();

  // Memoizar a Tab Bar para evitar re-renderizações desnecessárias
  const renderedTabBar = useMemo(() => {
    if (!activeTab) return null;
    return (
      <View style={[styles.tabBar, { paddingBottom: insets.bottom || 4, height: 64 + insets.bottom }]}>
        {/* Painel */}
        <Link href="/dashboard" asChild>
          <Pressable style={styles.tabItem}>
            <Text style={[styles.tabIcon, activeTab === 'dashboard' && styles.tabActiveIcon]}>📊</Text>
            <Text style={[styles.tabLabel, activeTab === 'dashboard' && styles.tabActiveLabel]}>Painel</Text>
          </Pressable>
        </Link>

        {/* Trilhas */}
        <Link href="/minhas-trilhas" asChild>
          <Pressable style={styles.tabItem}>
            <Text style={[styles.tabIcon, activeTab === 'trilhas' && styles.tabActiveIcon]}>🗺️</Text>
            <Text style={[styles.tabLabel, activeTab === 'trilhas' && styles.tabActiveLabel]}>Trilhas</Text>
          </Pressable>
        </Link>

        {/* Progresso */}
        <Link href="/progresso" asChild>
          <Pressable style={styles.tabItem}>
            <Text style={[styles.tabIcon, activeTab === 'progresso' && styles.tabActiveIcon]}>🏆</Text>
            <Text style={[styles.tabLabel, activeTab === 'progresso' && styles.tabActiveLabel]}>Progresso</Text>
          </Pressable>
        </Link>

        {/* Perfil */}
        <Link href="/perfil" asChild>
          <Pressable style={styles.tabItem}>
            <Text style={[styles.tabIcon, activeTab === 'perfil' && styles.tabActiveIcon]}>👤</Text>
            <Text style={[styles.tabLabel, activeTab === 'perfil' && styles.tabActiveLabel]}>Perfil</Text>
          </Pressable>
        </Link>

        {/* Ajustes */}
        <Link href="/configuracoes" asChild>
          <Pressable style={styles.tabItem}>
            <Text style={[styles.tabIcon, activeTab === 'configuracoes' && styles.tabActiveIcon]}>⚙️</Text>
            <Text style={[styles.tabLabel, activeTab === 'configuracoes' && styles.tabActiveLabel]}>Ajustes</Text>
          </Pressable>
        </Link>
      </View>
    );
  }, [activeTab, insets.bottom]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.mainContent}>
          {children}
        </View>
        {footer ? <View style={styles.footer}>{footer}</View> : null}
      </View>

      {renderedTabBar}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#07111f',
  },
  container: {
    flex: 1,
    backgroundColor: '#07111f',
  },
  mainContent: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  footer: {
    marginTop: 10,
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  tabBar: {
    flexDirection: 'row',
    height: 64,
    backgroundColor: '#07111f',
    borderTopWidth: 1,
    borderTopColor: '#1e293b',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingBottom: 4,
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    paddingVertical: 6,
  },
  tabIcon: {
    fontSize: 20,
    color: '#94a3b8',
    opacity: 0.8,
  },
  tabActiveIcon: {
    color: '#f97316',
    opacity: 1,
  },
  tabLabel: {
    fontSize: 11,
    color: '#94a3b8',
    fontWeight: '600',
    marginTop: 2,
  },
  tabActiveLabel: {
    color: '#f97316',
    fontWeight: '700',
  },
});