import { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  Switch,
  Pressable,
  Alert,
} from 'react-native';

import { TrailScreen } from '@/components/ui/Screen';

export default function ConfiguracoesScreen() {
  // Estado das configurações
  const [twoFactor, setTwoFactor] = useState(false);
  const [publicProfile, setPublicProfile] = useState(true);

  const [emailNotif, setEmailNotif] = useState(true);
  const [progressReminder, setProgressReminder] = useState(true);
  const [aiSuggestions, setAiSuggestions] = useState(true);
  const [weeklyReport, setWeeklyReport] = useState(false);

  const [language, setLanguage] = useState('pt-BR');
  const [studyGoal, setStudyGoal] = useState('1h');

  // Função para simular salvar ou alterar seletores
  const selectLanguage = () => {
    Alert.alert(
      'Selecionar Idioma',
      'Escolha o idioma de sua preferência:',
      [
        { text: 'Português (BR)', onPress: () => setLanguage('pt-BR') },
        { text: 'English (US)', onPress: () => setLanguage('en-US') },
        { text: 'Español', onPress: () => setLanguage('es') },
        { text: 'Cancelar', style: 'cancel' },
      ]
    );
  };

  const selectStudyGoal = () => {
    Alert.alert(
      'Meta Diária',
      'Selecione sua meta diária de estudos:',
      [
        { text: '30 minutos', onPress: () => setStudyGoal('30m') },
        { text: '1 hora', onPress: () => setStudyGoal('1h') },
        { text: '2 horas', onPress: () => setStudyGoal('2h') },
        { text: '3 horas ou mais', onPress: () => setStudyGoal('3h') },
        { text: 'Cancelar', style: 'cancel' },
      ]
    );
  };

  const getLanguageLabel = (code: string) => {
    switch (code) {
      case 'en-US':
        return 'English (US)';
      case 'es':
        return 'Español';
      default:
        return 'Português (BR)';
    }
  };

  const getGoalLabel = (code: string) => {
    switch (code) {
      case '30m':
        return '30 minutos';
      case '2h':
        return '2 horas';
      case '3h':
        return '3 horas+';
      default:
        return '1 hora';
    }
  };

  return (
    <TrailScreen activeTab="configuracoes">
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Configurações</Text>
          <Text style={styles.subtitle}>Personalize sua experiência no app</Text>
        </View>

        {/* Grupo: Conta */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>👤 Conta</Text>
          <Text style={styles.sectionSub}>Segurança e visibilidade do seu perfil</Text>
          
          <View style={styles.row}>
            <View style={styles.rowInfo}>
              <Text style={styles.rowLabel}>Autenticação em dois fatores</Text>
              <Text style={styles.rowDesc}>Adiciona segurança extra ao fazer login</Text>
            </View>
            <Switch
              value={twoFactor}
              onValueChange={setTwoFactor}
              trackColor={{ false: '#07111f', true: '#f97316' }}
              thumbColor={twoFactor ? '#f8fafc' : '#94a3b8'}
            />
          </View>

          <View style={[styles.row, styles.noBorder]}>
            <View style={styles.rowInfo}>
              <Text style={styles.rowLabel}>Perfil público</Text>
              <Text style={styles.rowDesc}>Outros alunos podem ver seu progresso</Text>
            </View>
            <Switch
              value={publicProfile}
              onValueChange={setPublicProfile}
              trackColor={{ false: '#07111f', true: '#f97316' }}
              thumbColor={publicProfile ? '#f8fafc' : '#94a3b8'}
            />
          </View>
        </View>

        {/* Grupo: Notificações */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>🔔 Notificações</Text>
          <Text style={styles.sectionSub}>Escolha o que você quer receber</Text>
          
          <View style={styles.row}>
            <View style={styles.rowInfo}>
              <Text style={styles.rowLabel}>E-mails de novidades</Text>
              <Text style={styles.rowDesc}>Novas aulas e atualizações de trilha</Text>
            </View>
            <Switch
              value={emailNotif}
              onValueChange={setEmailNotif}
              trackColor={{ false: '#07111f', true: '#f97316' }}
              thumbColor={emailNotif ? '#f8fafc' : '#94a3b8'}
            />
          </View>

          <View style={styles.row}>
            <View style={styles.rowInfo}>
              <Text style={styles.rowLabel}>Lembretes de estudo</Text>
              <Text style={styles.rowDesc}>Aviso diário para manter sua sequência</Text>
            </View>
            <Switch
              value={progressReminder}
              onValueChange={setProgressReminder}
              trackColor={{ false: '#07111f', true: '#f97316' }}
              thumbColor={progressReminder ? '#f8fafc' : '#94a3b8'}
            />
          </View>

          <View style={styles.row}>
            <View style={styles.rowInfo}>
              <Text style={styles.rowLabel}>Sugestões da IA</Text>
              <Text style={styles.rowDesc}>Recomendações do Tutor Inteligente</Text>
            </View>
            <Switch
              value={aiSuggestions}
              onValueChange={setAiSuggestions}
              trackColor={{ false: '#07111f', true: '#f97316' }}
              thumbColor={aiSuggestions ? '#f8fafc' : '#94a3b8'}
            />
          </View>

          <View style={[styles.row, styles.noBorder]}>
            <View style={styles.rowInfo}>
              <Text style={styles.rowLabel}>Relatório semanal</Text>
              <Text style={styles.rowDesc}>Resumo do seu progresso por e-mail</Text>
            </View>
            <Switch
              value={weeklyReport}
              onValueChange={setWeeklyReport}
              trackColor={{ false: '#07111f', true: '#f97316' }}
              thumbColor={weeklyReport ? '#f8fafc' : '#94a3b8'}
            />
          </View>
        </View>

        {/* Grupo: Preferências */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>⚙️ Preferências</Text>
          <Text style={styles.sectionSub}>Ajuste o comportamento do app</Text>
          
          <Pressable style={styles.row} onPress={selectLanguage}>
            <View style={styles.rowInfo}>
              <Text style={styles.rowLabel}>Idioma</Text>
              <Text style={styles.rowDesc}>Idioma padrão das interfaces</Text>
            </View>
            <View style={styles.pickerPreview}>
              <Text style={styles.pickerPreviewText}>{getLanguageLabel(language)}</Text>
              <Text style={styles.pickerArrow}>▼</Text>
            </View>
          </Pressable>

          <Pressable style={[styles.row, styles.noBorder]} onPress={selectStudyGoal}>
            <View style={styles.rowInfo}>
              <Text style={styles.rowLabel}>Meta diária de estudos</Text>
              <Text style={styles.rowDesc}>Duração que você planeja focar por dia</Text>
            </View>
            <View style={styles.pickerPreview}>
              <Text style={styles.pickerPreviewText}>{getGoalLabel(studyGoal)}</Text>
              <Text style={styles.pickerArrow}>▼</Text>
            </View>
          </Pressable>
        </View>
      </ScrollView>
    </TrailScreen>
  );
}

const styles = StyleSheet.create({
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
  sectionCard: {
    backgroundColor: '#0f1c2f',
    borderColor: '#1e293b',
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
  },
  sectionTitle: {
    color: '#f8fafc',
    fontSize: 16,
    fontWeight: '800',
  },
  sectionSub: {
    color: '#94a3b8',
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#1e293b',
  },
  noBorder: {
    borderBottomWidth: 0,
    paddingBottom: 4,
  },
  rowInfo: {
    flex: 1,
    paddingRight: 12,
  },
  rowLabel: {
    color: '#e2e8f0',
    fontSize: 14,
    fontWeight: '600',
  },
  rowDesc: {
    color: '#94a3b8',
    fontSize: 11,
    marginTop: 2,
  },
  pickerPreview: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#07111f',
    borderColor: '#1e293b',
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  pickerPreviewText: {
    color: '#f8fafc',
    fontSize: 13,
    fontWeight: '600',
  },
  pickerArrow: {
    color: '#94a3b8',
    fontSize: 10,
  },
});
