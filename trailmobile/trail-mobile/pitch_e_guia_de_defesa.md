# 🚀 Estruturação do Pitch, Transição Next.js -> React Native & Guia de Defesa
**Projeto: Trail (MVP Mobile)**  
**Tecnologias Utilizadas:** React Native (Expo Router, TypeScript), Docker (para testes locais), Axios Interceptors, Expo SecureStore e IA Generativa (Geração de trilhas e Copiloto de avaliação no front-end).

---

## 📋 1. Estrutura dos Slides do Pitch (Foco em Negócio/Produto)
*Tempo sugerido de apresentação: **7 a 8 minutos** (margem de segurança para o limite de 10 minutos).*  
*Regra de Ouro do Professor: **Zero explicação de código nos slides**. Foco visual no produto, proposta de valor e processo.*

---

### 🛝 Slide 1: Capa & Gancho (Hook)
* **Visual do Slide:**
  * Logotipo moderno do **Trail** em destaque.
  * Slogan: *"Seu mapa de aprendizado guiado por Inteligência Artificial."*
  * Nome dos integrantes do grupo e curso.
  * Foto impactante contrastando um estudante confuso com pilhas de livros vs. um profissional focado com uma trilha clara.
* **Tempo sugerido:** 1 minuto
* **Roteiro do Apresentador (Hook):**
  > "Você já tentou aprender uma nova tecnologia e se sentiu completamente sobrecarregado pela quantidade de caminhos, tutoriais e frameworks disponíveis? Segundo pesquisas recentes, mais de 70% dos estudantes de tecnologia abandonam seus planos de estudo por falta de foco e direcionamento prático. Apresentamos o **Trail**: um MVP mobile desenhado para transformar essa paralisia de escolha em progresso real, criando trilhas de estudo estruturadas via IA e conectando alunos a feedbacks ágeis de mentores."

---

### 🛝 Slide 2: O Problema
* **Visual do Slide:**
  * Diagrama de dor (infográfico simples):
    1. **Paralisia por Excesso:** Dificuldade dos estudantes em encontrar caminhos lineares de estudo.
    2. **Falta de Validação:** Alunos programam sem saber se o código atende às exigências reais de mercado.
    3. **Barreira Técnica Local:** A complexidade para desenvolvedores juniores em integrar aplicações móveis com APIs hospedadas em redes locais.
* **Tempo sugerido:** 1 minuto
* **Roteiro do Apresentador:**
  > "Identificamos dois problemas centrais no ecossistema de aprendizado de desenvolvimento. Do lado do **estudante**, a falta de um guia estruturado de desafios práticos e a ausência de um canal rápido para ter seu código validado. Do lado do **mentor**, o trabalho exaustivo de clonar repositórios do GitHub manualmente para avaliar dezenas de tarefas. Tudo isso em um ambiente mobile, onde a fluidez e o tempo de resposta rápida são essenciais, mas frequentemente travam na infraestrutura."

---

### 🛝 Slide 3: A Solução (O Trail)
* **Visual do Slide:**
  * Três colunas de valor com ícones ilustrativos:
    * **Trilhas Inteligentes (IA):** Geração instantânea de roteiros de estudo a partir de um objetivo descrito pelo aluno.
    * **Submissão Direta via GitHub:** Envio prático de links de projetos diretamente pelo aplicativo móvel.
    * **Copiloto do Mentor:** Análise automatizada baseada em IA que varre o repositório entregue, levantando cenários de borda e sugerindo o parecer técnico.
* **Tempo sugerido:** 1 minuto e meio
* **Roteiro do Apresentador:**
  > "O Trail resolve esse gargalo conectando mobile e Inteligência Artificial. O estudante descreve o que quer desenvolver usando linguagem natural, e a IA gera uma trilha com desafios sequenciais. Ao codificar, o aluno submete o link do repositório no aplicativo. O mentor, por sua vez, visualiza a entrega no painel do app e conta com o suporte de uma IA Copiloto, que analisa o código do GitHub, detecta falhas e sugere um rascunho de avaliação detalhado. Unimos direção para quem estuda e produtividade para quem ensina."

---

### 🛝 Slide 4: Roteiro da Demonstração Gravada (Vídeo)
* **Visual do Slide:**
  * Vídeo de demonstração do aplicativo rodando (gravado em emulador ou celular físico), sem áudio pré-gravado (o apresentador narra ao vivo sobre o vídeo).
* **Tempo sugerido:** 2 minutos e meio
* **Roteiro de Narração do Apresentador:**
  * **[0:00 - 0:30] Autenticação e Entrada:** 
    > *"Iniciamos com a nossa tela de Login e Cadastro. A autenticação é realizada de forma segura utilizando JWT (JSON Web Tokens). O aplicativo armazena e renova os tokens em segundo plano, garantindo uma sessão contínua para o usuário."*
  * **[0:30 - 1:00] Painel Geral (Dashboard 2x2):** 
    > *"Ao entrar, o aluno é recebido por um Dashboard com estrutura em grid 2x2, exibindo o número de Trilhas Ativas, Desafios Concluídos, Progresso Geral e Horas de Estudo acumuladas. Se o usuário for um Mentor, a interface adapta-se dinamicamente para mostrar métricas do sistema e a lista de tarefas pendentes de revisão."*
  * **[1:00 - 1:45] Consulta por IA (Geração da Trilha):** 
    > *"Na aba de Trilhas, temos o fluxo de consulta por linguagem natural. O aluno preenche os campos com seu objetivo de projeto (exemplo: 'Criar um app mobile com login e IA'), nível de conhecimento e dedicação semanal. Ao clicar em 'Gerar', a IA cria instantaneamente uma nova trilha personalizada com desafios práticos."*
  * **[1:45 - 2:30] Detalhamento e Accordions de Desafios:** 
    > *"Na visualização da trilha, utilizamos cartões expansíveis em formato de Accordion para exibir os desafios de forma limpa. O aluno expande a tarefa desejada, confere as instruções, insere a URL do seu repositório GitHub e submete para avaliação. O app consome nossa API em tempo real e fornece mensagens de feedback tratadas para qualquer edge case de conexão."*

---

### 🛝 Slide 5: Metodologia, Sprints & Git
* **Visual do Slide:**
  * Gráfico de linha do tempo com os 3 Milestones do projeto:
    * **Sprint 1 (Base Mobile):** Setup do React Native (Expo Router), definição de telas e endpoints base da API.
    * **Sprint 2 (Fluxo de Dados):** Integração com JWT Auth, cliente de API (Axios Interceptors) e carregamento de dados em tempo real.
    * **Sprint 3 (Refinamento e IA):** Implementação de tratamento de erros global, ajuste de design system e IA Copiloto.
  * Ícone do Git mostrando o fluxo de branches (`main` <- `feature/auth`, `feature/dashboard`).
* **Tempo sugerido:** 1 minuto
* **Roteiro do Apresentador:**
  > "Nossa organização baseou-se em metodologias ágeis em 3 Sprints semanais bem definidas. Para manter a estabilidade do código, adotamos um fluxo rigoroso de Git Feature Branching. Cada funcionalidade foi construída em branches específicas. Os conflitos foram resolvidos localmente pelos membros da equipe antes de qualquer fusão na branch principal (`main`), garantindo que o aplicativo estivesse sempre integrável e testável contra o backend orquestrado em Docker."

---

### 🛝 Slide 6: Conclusão & Próximos Passos
* **Visual do Slide:**
  * Lista de conquistas do MVP (React Native + API ASP.NET Core funcionando de ponta a ponta com IA).
  * Próximos Passos (Próximas Sprints):
    1. **Notificações Push:** Alertas diários para incentivar a consistência de estudos do aluno.
    2. **Integração Profunda com GitHub:** Integração direta com Webhooks para ler Pull Requests assim que criados.
    3. **Painel Web Administrativo:** Interface avançada em Next.js para gestores educacionais.
* **Tempo sugerido:** 45 segundos
* **Roteiro do Apresentador:**
  > "O Trail valida que o desenvolvimento de aplicativos mobile integrados à IA generativa pode reduzir drasticamente o tempo de resposta pedagógico e guiar estudantes com foco. Como próximos passos, mapeamos o desenvolvimento de notificações nativas para engajamento e integração com webhooks do GitHub. Agradecemos a atenção dos professores e abrimos espaço para perguntas da banca."

---
---

## 🛡️ 2. Guia de Defesa Individual (Simulador de Perguntas da Banca — Foco EXCLUSIVO em Mobile)
*Respostas diretas, técnicas e focadas apenas na aplicação e ambiente móvel.*

### 🎨 Tópico A: UI/UX (Acessibilidade, Ergonomia e Design System no Celular)

#### 1. Pergunta: *"Como vocês garantiram a acessibilidade e a ergonomia na barra de navegação inferior (Tab Bar) e no Dashboard do dispositivo móvel?"*
* **Resposta Técnica Objetiva:** 
  > "Garantimos isso adaptando a aplicação para o espaço físico e restrições de tela do celular. No arquivo `Screen.tsx`, importamos o hook `useSafeAreaInsets` de `react-native-safe-area-context` para medir os recortes (insets) do sistema. Aplicamos o resultado dinamicamente na altura e margem da barra inferior (`paddingBottom: insets.bottom || 4`). Isso impede que as abas fiquem sob a barra gestual do iOS ou os botões virtuais do Android.
  > Ergonomicamente, todos os botões e áreas clicáveis (como os cards do Dashboard e os itens da Tab Bar) respeitam a área mínima de toque de **48x48 dp** recomendada pelo Material 3 e Apple HIG, facilitando o uso do aplicativo com apenas uma mão e evitando toques acidentais."

#### 2. Pergunta: *"Por que decidiram utilizar o formato de Accordions (cartões expansíveis) na listagem de desafios da tela de trilhas?"*
* **Resposta Técnica Objetiva:**
  > "Optamos por Accordions controlados por estado (`expandedChallengeId`) em `[trailId].tsx` devido à restrição física da tela móvel e para gerenciar a carga cognitiva do aluno. Exibir todos os desafios da trilha com instruções, inputs de URL do GitHub e botões de envio abertos simultaneamente exigiria rolagem excessiva e poluição visual. 
  > Ao expandir apenas o desafio selecionado, focamos a atenção visual do estudante estritamente na atividade atual, mantendo o restante da lista limpo, estruturado e legível."

#### 3. Pergunta: *"Como foi trabalhada a legibilidade e contraste na paleta de cores escura (Dark Theme) do aplicativo móvel?"*
* **Resposta Técnica Objetiva:**
  > "O aplicativo implementa um tema escuro nativo (fundo `#07111f` e cards `#0f1c2f`). Para mitigar a fadiga ocular sob baixa iluminação (típica do uso móvel) e economizar bateria em telas AMOLED, evitamos o branco puro no texto, adotando tons suaves da paleta Slate/Gray (`#f8fafc` para títulos e `#94a3b8` para descrições). 
  > Isso garante uma relação de contraste de texto sobre fundo que respeita a especificação WCAG AA. O laranja `#f97316` é utilizado de forma controlada como cor de destaque (accent color) para indicar progresso ativo e guiar o olhar do usuário até os botões principais de ação."

---

### 🌐 Tópico B: Integração de Rede, Segurança e Resiliência no Mobile

#### 1. Pergunta: *"Como o aplicativo móvel consegue se conectar a uma API rodando localmente (localhost) na máquina de desenvolvimento durante os testes em emuladores ou aparelhos físicos?"*
* **Resposta Técnica Objetiva:**
  > "Dispositivos móveis físicos e emuladores rodam em ambientes de rede isolados (sandboxes), impossibilitando o uso de `localhost` ou `127.0.0.1` (que apontariam para o próprio celular). 
  > Resolvemos isso configurando a `baseURL` da instância do Axios no arquivo `services/api.ts` para apontar diretamente para o IP privado da máquina host na rede sem fio compartilhada (`http://192.168.1.10:5108`). Dessa forma, contanto que o dispositivo físico de teste e o computador de desenvolvimento compartilhem da mesma rede Wi-Fi, o roteamento ocorre de forma transparente."

#### 2. Pergunta: *"Como contornaram as restrições nativas de segurança do Android e iOS que proíbem conexões HTTP puras (sem SSL/HTTPS) por padrão no aplicativo?"*
* **Resposta Técnica Objetiva:**
  > "Por padrão, sistemas operacionais móveis modernos bloqueiam tráfego sem criptografia (cleartext). Para permitir homologação e testes em redes locais sem a necessidade de assinar e instalar certificados SSL locais durante o desenvolvimento:
  > - No **Android**, configuramos a propriedade `android:usesCleartextTraffic="true"` no `AndroidManifest.xml` (gerido através do arquivo de configuração do Expo, `app.json`).
  > - No **iOS**, mapeamos exceções na chave `NSAppTransportSecurity` / `NSAllowsLocalNetworking` no `Info.plist`. 
  > Essas configurações instruem o sistema operacional móvel a tolerar a ausência de HTTPS apenas no ambiente de testes local."

#### 3. Pergunta: *"Como o aplicativo mobile trata falhas de rede, timeouts de requisição e erros de servidor para evitar que o app trave (crash) ou exiba telas em branco?"*
* **Resposta Técnica Objetiva:**
  > "Nós isolamos o tratamento de rede em `services/api.ts` utilizando interceptores globais do Axios. Se o servidor cair, demorar para responder (timeout definido em 30 segundos) ou retornar erros críticos (como HTTP 500), o interceptor captura o erro antes que ele quebre o componente visual e dispara um alerta nativo de interface (`Alert.alert`) com instruções claras ao usuário. 
  > Para cenários onde a tela precisa gerenciar o erro visualmente (como na busca por IA na tela de consulta), implementamos um cabeçalho customizado na requisição (`X-Skip-Error-Handler: true`) que desvia do interceptor global, permitindo que a tela renderize uma mensagem de fallback amigável no lugar do conteúdo."

#### 4. Pergunta: *"Como o fluxo de autenticação e revalidação do token JWT (Refresh Token) foi persistido de forma segura no dispositivo, e qual a diferença de segurança para a Web?"*
* **Resposta Técnica Objetiva:**
  > "Ao contrário da Web, onde desenvolvedores costumam salvar tokens expostos no `localStorage` do navegador ou em Cookies, no ambiente nativo móvel adotamos a biblioteca `expo-secure-store`. Ela armazena os dados confidenciais de forma criptografada a nível de hardware (utilizando o KeyStore no Android e o Keychain no iOS).
  > A camada de rede em `services/api.ts` escuta requisições que retornam status `401` (Não Autorizado). O interceptor de resposta interrompe o fluxo do app, envia o Refresh Token salvo na área segura para obter um novo token de acesso, atualiza os tokens no SecureStore e refaz a chamada HTTP original em segundo plano. Caso a renovação falhe ou o token expire, o estado é limpo e redirecionamos o usuário de volta para a rota `/signin` de forma limpa."

---

### 🛠️ Tópico C: Processo Ágil, Sprints e Engenharia de Código no Mobile

#### 1. Pergunta: *"Como se deu a aplicação do framework Scrum focando estritamente no desenvolvimento da aplicação mobile em um curto espaço de tempo?"*
* **Resposta Técnica Objetiva:**
  > "Adaptamos o Scrum para ciclos semanais extremamente enxutos alinhados às datas dos Milestones. No início de cada Sprint, definíamos o backlog visual e técnico a ser implementado no app (ex: Sprint 1: Setup do Expo Router e layout de telas; Sprint 2: Integração com Axios e fluxo de autenticação; Sprint 3: Refinamento de acessibilidade e IA). 
  > Ao longo da semana, realizávamos pequenos alinhamentos diários para mapear impedimentos. O escopo foi priorizado para focar em um MVP móvel enxuto e funcional, garantindo que tivéssemos telas estruturadas, navegação estável e integração pronta para homologação."

#### 2. Pergunta: *"Como gerenciaram o desenvolvimento paralelo de código do app no Git para evitar conflitos em arquivos estruturais móveis como o app.json ou package.json?"*
* **Resposta Técnica Objetiva:**
  > "Utilizamos o fluxo de Git Feature Branching. Cada tela ou serviço do app (ex: `feature/dashboard`, `feature/auth`) foi isolado em ramificações próprias. 
  > Alterações em arquivos estruturais como o `package.json` (adição de bibliotecas) ou `app.json` (configurações nativas do Expo) foram combinadas e validadas pela equipe previamente. Antes de mesclar a branch de trabalho com a `main`, o integrante responsável era obrigado a sincronizar localmente sua branch (`git pull origin main`), rodar os testes de compilação locais do Expo e só então submeter o código unificado, garantindo que a branch estável nunca quebrasse o emulador dos demais membros."

#### 3. Pergunta: *"De que forma a adoção de TypeScript no front-end móvel garantiu a estabilidade e a prevenção de erros comuns de runtime?"*
* **Resposta Técnica Objetiva:**
  > "O TypeScript foi essencial para definir contratos de dados estáticos com a API externa. Criamos interfaces estritas na pasta `types/` (ex: `ChallengeResponse`, `TrailResponse`, `AuthSession`). 
  > Isso nos deu segurança em tempo de compilação: se o formato dos dados retornados pelo servidor mudasse ou se tentássemos acessar uma propriedade de objeto inexistente em tela (causa clássica de crash de tela em Javascript puro, como *'cannot read property of undefined'*), o editor de código apontava o erro imediatamente. Isso reduziu drasticamente erros em tempo de execução no aplicativo móvel."

---
---

## 🔀 3. Relato de Transição: Next.js para React Native (Desafios do MVP)
*Esta seção explica a justificativa de projeto e os desafios da transição do escopo original web (Next.js) para o aplicativo móvel (React Native com Expo).*

### 1. Elementos Visuais e Ausência de HTML
No Next.js, a construção de páginas e componentes utiliza tags HTML (`<div>, <section>, <h1>, <p>, <a>`) e estilos CSS globais ou Tailwind.  
* **O Desafio no Mobile:** O React Native não possui elementos HTML. Toda a UI teve de ser reconstruída usando componentes primitivos da biblioteca `react-native` (como `<View>`, `<Text>`, `<ScrollView>` e `<Pressable>`).
* **Flexbox Rígido:** A estilização passou a ser feita via JavaScript (`StyleSheet.create`), que compila os estilos para propriedades de layout nativas do iOS/Android. A tipografia e propriedades como cor e tamanho de fonte não são herdadas de pai para filho no React Native, exigindo que todo texto estivesse explicitamente encapsulado em uma tag `<Text>` estilizada.

### 2. Navegação Nativa (Expo Router) vs. Roteamento Web (Next.js)
No Next.js (com App Router), a navegação é baseada em URLs interpretadas pelo navegador web, com transições assíncronas de documentos.  
* **O Desafio no Mobile:** O React Native trabalha com pilhas (Stacks) e abas (Tabs) físicas do aparelho móvel, gerenciadas pelo **Expo Router** (baseado no `react-navigation` sob o capô).
* **Ciclo de Vida das Telas:** Diferente da web, onde trocar de página desmonta o componente anterior, no mobile as telas anteriores da pilha continuam ativas em segundo plano. Para evitar lentidão de CPU e consumo excessivo de memória, tivemos de utilizar configurações de stack como `freezeOnBlur: true` e `detachInactiveScreens: true` no layout principal (`(app)/_layout.tsx`), mantendo o app performático.

### 3. Persistência de Dados e Segurança da Sessão
No Next.js, tokens JWT de autenticação são salvos em Cookies (com flag HTTPOnly) ou no `localStorage` do navegador web.  
* **O Desafio no Mobile:** Dispositivos móveis não possuem cookies HTTP tradicionais ou um localStorage seguro por padrão.
* **Persistência Criptografada:** Adotamos a biblioteca `expo-secure-store` para persistir dados confidenciais (tokens JWT de acesso e de refresh) de forma encriptada na partição segura do celular (KeyStore no Android e Keychain no iOS). Para dar suporte de desenvolvimento híbrido, criamos um adaptador dinâmico em `lib/authStorage.ts` que detecta a plataforma e chaveia para o localStorage tradicional caso o aplicativo seja emulado via Web.

### 4. Integration Localhost e Restrições de Tráfego de Rede
No Next.js, realizar chamadas de API para o backend na mesma máquina host (ex: `localhost:5108`) é nativo.  
* **O Desafio no Mobile:** O emulador móvel ou celular físico roda dentro de uma sub-rede própria ou sandbox. Fazer requisições para `localhost` falha, pois o aparelho tenta acessar a si mesmo.
* **O IP Local no Axios:** A equipe teve de configurar a API apontando para o IP de rede interna da máquina de desenvolvimento (ex: `http://192.168.1.10:5108`) e liberar a permissão de tráfego HTTP puro (cleartext) nas propriedades do Android (`AndroidManifest.xml`) e iOS (`Info.plist`), contornando o bloqueio de segurança padrão de conexões sem SSL.

---
---

## 🔍 4. Anatomia do Código: Principais Trechos Técnicos
*Explicações detalhadas dos arquivos e linhas mais importantes da aplicação.*

### 🛠️ Snippet 1: Cliente de API com Interceptores e Auto-Refresh ([services/api.ts](file:///c:/Users/Pedro/Desktop/mobile%20projeto/trailmobile/trail-mobile/services/api.ts))
Este arquivo é o motor de comunicação do app. Ele gerencia autenticação, revalidação automática de tokens expirados e tratamento global de erros.

```typescript
// 1. IP Host para desviar do bloqueio de localhost no emulador/celular
const baseURL = 'http://192.168.1.10:5108';

export const api = axios.create({
  baseURL,
  timeout: 30000,
});

// 2. Interceptor de Requisição: Injeta automaticamente o JWT nas requisições
api.interceptors.request.use(async (config) => {
  const accessToken = getAuthState().session?.accessToken;
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

// 3. Interceptor de Resposta: Renovação transparente de tokens JWT (Silêncio de Erro 401)
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config;
    const status = error.response?.status;

    if (status === 401 && originalRequest && !originalRequest._retry) {
      const refreshToken = getAuthState().session?.refreshToken;
      if (!refreshToken) {
        await signOut();
        return Promise.reject(error);
      }
      originalRequest._retry = true;

      try {
        // Envia o Refresh Token para obter um novo par de tokens válidos
        const response = await axios.post(`${baseURL}/auth/refresh`, { refreshToken });
        const { token, refreshToken: nextRefreshToken } = response.data;

        await updateAuthTokens(token, nextRefreshToken);
        originalRequest.headers.Authorization = `Bearer ${token}`;
        return api(originalRequest); // Refaz a requisição original de forma imperceptível
      } catch (refreshError) {
        await signOut();
        return Promise.reject(refreshError);
      }
    }
    ...
```
* **Por que é importante?** Garante que o usuário nunca seja deslogado de forma abrupta caso seu token de acesso expire no meio de uma tarefa. Além disso, centraliza as requisições, eliminando a repetição de código em cada tela de componente.

---

### 🛡️ Snippet 2: Proteção de Rotas com AuthGate ([components/auth/AuthGate.tsx](file:///c:/Users/Pedro/Desktop/mobile%20projeto/trailmobile/trail-mobile/components/auth/AuthGate.tsx))
Responsável por interceptar o ciclo de vida do app durante a inicialização física (rehidratação do estado seguro) e realizar os redirecionamentos necessários.

```typescript
export function AuthGate() {
  const router = useRouter();
  const pathname = usePathname();
  const hasHydrated = useAuthStore((state) => state.hasHydrated);
  const session = useAuthStore((state) => state.session);

  useEffect(() => {
    if (!hasHydrated) return; // Bloqueia a lógica até que os tokens sejam lidos do SecureStore

    const isAuthRoute = pathname.startsWith('/signin') || pathname.startsWith('/signup');
    const isPublicRoute = pathname === '/';

    // Se o usuário não está autenticado e tenta acessar telas internas, manda para o Login
    if (!session && !isAuthRoute && !isPublicRoute) {
      router.replace('/signin');
      return;
    }

    // Se o usuário já está logado e tenta ir para telas de login, joga ele no Dashboard
    if (session && (isAuthRoute || isPublicRoute)) {
      router.replace('/dashboard');
    }
  }, [hasHydrated, pathname, router, session]);

  if (!hasHydrated) {
    // Tela de Carregamento Nativa até reidratar os dados
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#38bdf8" />
      </View>
    );
  }
  return null;
}
```
* **Por que é importante?** Evita o problema clássico de "flickering" (quando telas privadas piscam antes de o aplicativo perceber que o usuário está deslogado). O Gate congela a renderização e exibe um spinner nativo até que a leitura no `SecureStore` termine.

---

### 📱 Snippet 3: Gerenciador de Insets de Tela ([components/ui/Screen.tsx](file:///components/ui/Screen.tsx))
Garante a integridade do design em diferentes tipos de aparelhos móveis (notch, cantos arredondados, botões do sistema).

```typescript
export function TrailScreen({ children, footer, activeTab }: TrailScreenProps) {
  const insets = useSafeAreaInsets();

  // useMemo evita renderizações desnecessárias da TabBar ao rolar a tela
  const renderedTabBar = useMemo(() => {
    if (!activeTab) return null;
    return (
      <View style={[styles.tabBar, { paddingBottom: insets.bottom || 4, height: 64 + insets.bottom }]}>
        <Link href="/dashboard" asChild>
          <Pressable style={styles.tabItem}>
            <Text style={[styles.tabIcon, activeTab === 'dashboard' && styles.tabActiveIcon]}>📊</Text>
            <Text style={[styles.tabLabel, activeTab === 'dashboard' && styles.tabActiveLabel]}>Painel</Text>
          </Pressable>
        </Link>
        ...
      </View>
    );
  }, [activeTab, insets.bottom]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.mainContent}>{children}</View>
        {footer ? <View style={styles.footer}>{footer}</View> : null}
      </View>
      {renderedTabBar}
    </SafeAreaView>
  );
}
```
* **Por que é importante?** Sem a leitura dinâmica dos `insets` de rodapé, o botão de navegação ficaria colado na borda física do telefone ou por trás da barra gestual do sistema, tornando a experiência de UI/UX insustentável.

---

### 🗺️ Snippet 4: Gerenciamento do Acordeão de Desafios ([app/(app)/resultado/[trailId].tsx](file:///c:/Users/Pedro/Desktop/mobile%20projeto/trailmobile/trail-mobile/app/(app)/resultado/[trailId].tsx))
Gerencia a expansão visual de desafios para reduzir a complexidade e a carga cognitiva na tela móvel.

```typescript
// Armazena o ID do desafio atualmente aberto
const [expandedChallengeId, setExpandedChallengeId] = useState<string | null>(null);

// Função que chaveia a visibilidade
function toggleExpand(id: string) {
  setExpandedChallengeId((current) => (current === id ? null : id));
}

...
{challenges.map((challenge) => {
  const isExpanded = expandedChallengeId === challenge.id;
  return (
    <View key={challenge.id} style={styles.challengeCard}>
      <Pressable onPress={() => toggleExpand(challenge.id)} style={styles.cardHeader}>
        <Text style={styles.challengeTitle}>{challenge.title}</Text>
        <Text style={styles.chevronIcon}>{isExpanded ? '▲' : '▼'}</Text>
      </Pressable>

      {/* Renderização condicional para Accordion */}
      {isExpanded && (
        <View style={styles.cardBody}>
          <Text style={styles.descriptionText}>{challenge.description}</Text>
          
          {/* Input para submeter o repositório */}
          <TextInput
            value={submissionUrl}
            onChangeText={setSubmissionUrl}
            placeholder="Link da entrega no GitHub"
            style={styles.urlInput}
          />
          
          <TrailButton
            onPress={() => handleSubmitSubmission(challenge.id)}
            loading={submittingId === challenge.id}
            title="Submeter Solução"
          />
        </View>
      )}
    </View>
  );
})}
```
* **Por que é importante?** Mapeia de forma reativa a visibilidade dos detalhes. O usuário foca apenas no desafio que deseja resolver, evitando dispersão e otimizando a altura de rolagem do `ScrollView`.
