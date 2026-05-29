# Trail Frontend (React Native + Expo)

Este frontend foi estruturado em React Native com Expo para substituir a base anterior em Next.js, mantendo os objetivos definidos no cronograma:

- fluxo mobile com telas de **login**, **consulta de projeto** e **resultado**;
- integração com backend autenticado por **JWT**;
- consumo do endpoint `GET /api/projects/{id}`;
- tratamento inicial de cenários de erro (401, 403, 404, 500 e timeout).

## Arquitetura

```text
src/
  components/
  config/
  context/
  navigation/
  screens/
  services/
  types/
```

## Configuração

1. Instale dependências:
   ```bash
   npm install
   ```
2. Defina a URL da API:
   ```bash
   EXPO_PUBLIC_API_BASE_URL=http://SEU_BACKEND:5000
   ```
3. Execute:
   ```bash
   npm run start
   ```

## Fluxo principal (US01)

1. Login no app (token JWT salvo com `expo-secure-store`)
2. Consulta de projeto por ID
3. Exibição dos dados reais retornados pela API

A consulta em linguagem natural está preparada no campo opcional da tela de busca para suportar a evolução da skill `consultar-projeto`.
