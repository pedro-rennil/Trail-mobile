# Cronograma de Entregas — Projeto Trail Mobile

## Ajuste de escopo

No documento original, o frontend estava descrito como Next.js, integrado a um backend ASP.NET Core com SQL Server, autenticação JWT e skill de IA para consultar projetos por linguagem natural. 
Com a nova diretriz, o mais coerente é preservar backend, banco, autenticação, endpoint e lógica de consulta inteligente, mas adaptar as entregas do frontend para telas, navegação e consumo de API em React Native com Expo. 

## Cronograma atualizado

| Data | Milestone | Objetivo da entrega | Entregáveis esperados |
|---|---|---|---|
| **29/05/2026** | **Milestone 1 — Base mobile + backend mínimo** | Estruturar o app mobile e garantir a base do fluxo de dados.  | Projeto Expo criado e organizado; definição das telas principais; navegação inicial; configuração do serviço de API no app; modelagem das entidades principais (`Projects`, `Trails`, usuários); endpoint `GET /api/projects/{id}` criado ou validado; planejamento do fluxo com JWT.  |
| **05/06/2026** | **Milestone 2 — Fluxo principal no app** | Entregar o caso de uso central funcionando no mobile.  | Tela mobile de consulta de projeto; consumo do endpoint pelo app; autenticação JWT implementada no backend e integrada ao app; exibição de dados reais do projeto; início ou protótipo da skill `consultar-projeto`; tratamento inicial de erro como projeto inexistente e token inválido.  |
| **19/06/2026** | **Milestone 3 — Entrega final + apresentação** | Finalizar a experiência mobile, consolidar IA e preparar demonstração.  | App React Native com fluxo funcional completo; integração mobile + backend + skill demonstrável; tratamento de exceções principais (401, 403, 404, 500, timeout); documentação do projeto atualizada para arquitetura mobile; roteiro de apresentação e demo em sala.  |

## Foco por aula

Na aula de **29/05**, o aluno deve priorizar a fundação do app Expo e a organização do backend, porque sem isso ele não consegue provar a evolução nas próximas datas. 
O ideal aqui é sair da aula com navegação básica, estrutura de pastas, serviço HTTP no app e backend com endpoint inicial já acessível para testes. 

Na aula de **05/06**, a meta deve ser mostrar no celular ou emulador o fluxo principal da US01, que é a consulta de projeto com dados reais. 
Como a história de usuário central é “consultar um projeto usando linguagem natural”, esse milestone pode ser aceito com duas camadas: consulta manual pelo app funcionando obrigatoriamente e a skill de IA em versão inicial ou integrada, desde que o fluxo principal já esteja demonstrável. 

Na aula de **19/06**, o projeto precisa estar pronto para apresentação, com maior estabilidade e narrativa clara. 
Como o documento já destaca edge cases como 404, token JWT inválido, timeout e falhas de integração, o fechamento deve mostrar que o app mobile trata esses cenários de forma controlada e sem respostas inconsistentes. 

## Entregas recomendadas

- **29/05**
    - Criar app com Expo.
    - Definir telas: login, consulta de projeto, resultado.
    - Configurar navegação e cliente HTTP.
    - Subir backend mínimo com endpoint de consulta. 

- **05/06**
    - Implementar autenticação JWT.
    - Conectar app React Native ao backend.
    - Buscar e renderizar dados reais de projeto.
    - Iniciar skill `consultar-projeto` ou fluxo equivalente de consulta inteligente. 

- **19/06**
    - Refinar UI mobile.
    - Validar erros e mensagens de fallback.
    - Finalizar documentação.
    - Preparar apresentação com demonstração end-to-end. 

## Critérios de aceite adaptados

Os critérios de aceite continuam os mesmos do projeto original, mas agora observados no contexto mobile: a IA deve identificar corretamente o projeto, a skill deve consumir API autenticada, a resposta deve refletir dados reais do banco e os erros devem ser tratados sem alucinação. 
Na prática, isso significa que a avaliação do aluno deve verificar não só o backend, mas também se o app React Native com Expo consegue autenticar, consultar e exibir a resposta com boa usabilidade no dispositivo. 

## Observação pedagógica

Como há apenas três encontros restantes, o melhor caminho é trabalhar com um **MVP mobile bem fechado**, e não tentar reproduzir todo o escopo de uma plataforma completa. 
A ordem mais segura passa a ser: backend mínimo funcional, app Expo consumindo API, autenticação JWT, consulta principal funcionando e, por fim, camada de IA/skill e refinamento para apresentação. 
