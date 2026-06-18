# Trail — Mobile

Interface mobile do **Projeto Trail**, plataforma de gestão de trilhas de aprendizagem, desafios técnicos e fluxos de mentoria para o Programa Residência Porto Digital, com mentoria técnica da Avanade.

---

## Stack

| Camada | Tecnologia |
|--------|-----------|
| Framework | React Native + Expo 56 |
| Roteamento | Expo Router (App Router) |
| Linguagem | TypeScript |
| Estado | Custom Client Store (`useSyncExternalStore`) |
| Segurança | Expo SecureStore (Keychain/KeyStore criptografado) |
| Cliente HTTP | Axios + Interceptors (Auto-Refresh JWT) |

---

## Pré-requisitos

- [Node.js](https://nodejs.org) 20+
- npm 10+
- Aplicativo [Expo Go](https://expo.dev/go) instalado no celular **ou** emulador configurado (Android Studio / Xcode iOS Simulator)

---

## Como rodar localmente

### 1. Instalar dependências

```bash
npm install
```

### 2. Configurar o IP do Servidor/Backend

Dispositivos móveis (físicos ou emuladores) rodam em ambientes de rede isolados (sandboxes), o que impossibilita o uso de `localhost` ou `127.0.0.1` para se conectar à API rodando na sua máquina local.

1. Descubra o IP privado do seu computador na rede interna (ex: `192.168.1.10` ou `10.0.2.2` caso use o emulador padrão do Android Studio).
2. Defina essa URL no arquivo `.env.local` na raiz da pasta `trail-mobile`:
   ```env
   EXPO_PUBLIC_API_URL=http://<SEU_IP_LOCAL>:5108
   ```
3. Se necessário, ajuste a constante `baseURL` em [services/api.ts](file:///c:/Users/Pedro/Desktop/mobile%20projeto/trailmobile/trail-mobile/services/api.ts) para coincidir com a URL configurada.

> [!NOTE]
> Para testar em um aparelho físico, tanto o celular quanto a máquina de desenvolvimento devem estar conectados na **mesma rede Wi-Fi**.

### 3. Subir o servidor de desenvolvimento

```bash
npm run start
```

Após o carregamento, um QR Code será impresso no seu terminal.

- **No celular (Expo Go):** Abra a câmera (iOS) ou o app Expo Go (Android) e escaneie o QR Code.
- **No Emulador Android:** Com o emulador aberto, pressione `a` no terminal.
- **No Simulador iOS:** Com o simulador aberto, pressione `i` no terminal.

### Outros scripts

```bash
npm run android   # Inicia e abre diretamente no dispositivo/emulador Android
npm run ios       # Inicia e abre diretamente no dispositivo/simulador iOS
npm run web       # Inicia a versão web experimental no navegador
```

---

## Resiliência e Autenticação Nativa

Para garantir o funcionamento fluido e seguro do aplicativo em plataformas móveis, as seguintes soluções foram implementadas:

- **Armazenamento Seguro (Secure Session)**: Tokens JWT e informações de perfil são persistidos com criptografia nativa de hardware via `expo-secure-store` (Keychain no iOS e KeyStore no Android), prevenindo exposição de dados em texto limpo.
- **Auto-Refresh de Token (Axios Interceptor)**: Caso um token expire e a API retorne status `HTTP 401`, o interceptor do Axios solicita um novo Access Token enviando o Refresh Token salvo, atualiza o SecureStore e repete a chamada original sem interromper a navegação do usuário.
- **Tratamento de Conexão e Fallbacks**: Erros de conexão (timeout, servidor indisponível) ou restrições de permissão são capturados globalmente em `services/api.ts` e informados através de alertas nativos do sistema (`Alert.alert`), mantendo a integridade do app e evitando telas em branco ou crashes.
- **Tráfego HTTP Cleartext**: Mapeamento nativo no `AndroidManifest.xml` (gerido via `app.json`) para permitir requisições sem SSL em ambiente de testes locais contra a API HTTP do backend.

---

## Estrutura de pastas

```
trail-mobile/
├── app/                  # Telas e rotas da aplicação (Expo Router)
│   ├── (app)/            # Área autenticada (dashboard, minhas-trilhas, consulta, progresso, perfil, configuracoes)
│   │   └── resultado/    # Roteamento dinâmico e submissão de desafios ([trailId].tsx)
│   ├── (auth)/           # Fluxos de entrada e registro de usuários (signin, signup)
│   ├── +html.tsx         # Template web padrão gerado pelo Expo
│   ├── +not-found.tsx    # Tela de 404 nativa para caminhos inválidos
│   ├── _layout.tsx       # Carregamento de fontes, controle da splash screen e root provider
│   └── index.tsx         # Ponto de entrada que redireciona o usuário dependendo da sessão
├── components/           # Componentes visuais da interface
│   ├── auth/             # Componentes específicos para o fluxo de autenticação
│   ├── ui/               # Componentes gerais de UI (Layout, Buttons, inputs)
│   ├── EditScreenInfo.tsx# Componente auxiliar de debug do Expo
│   ├── ExternalLink.tsx  # Componente para manipulação de links no navegador nativo
│   ├── StyledText.tsx    # Componente de tipografia com suporte a fontes personalizadas
│   └── Themed.tsx        # Elementos estilizados adaptados para Light e Dark Mode
├── constants/            # Constantes globais do sistema (Colors.ts para temas de cor)
├── lib/                  # Adaptadores multiplataforma (authStorage.ts para SecureStore vs Web storage)
├── services/             # Mecanismo de rede (api.ts com Axios Interceptors e tratamento de erro)
├── store/                # Gerenciamento de estado global reativo (authStore.ts construído com useSyncExternalStore)
├── types/                # Definições de tipagem estática (ai.ts, auth.ts, trail.ts)
└── app.json              # Configuração geral do Expo (insets, permissões nativas e ícones)
```

---

**Mentoria técnica: Avanade | Programa: Porto Digital — Residência**
