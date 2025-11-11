# Backend GraphQL

## 1. Descrição

O Backend GraphQL define um contrato via Apollo Server de todas as queries, mutations e tipos que ele pode fornecer ao frontend.

Possui dois tipos principais:

- **experiment**: Gerencia dados de experimentos e modais de oferta
- **lawsuit**: Gerencia processos judiciais, busca, validação de CNJ e registro de interações

O backend faz conexão com APIs externas (atualmente com a Mock API) e fornece dados mockados para desenvolvimento.

## 2. Recursos

### Queries

#### searchLawsuitsQuery
Busca processos judiciais por número CNJ e/ou tribunal.

**Argumentos:**
- number (String, opcional): Número CNJ do processo (aceita formato com ou sem máscara)
- court (String, opcional): Tribunal para filtrar (TJAL, TJCE)

**Retorna:** Lista de processos ([Lawsuit])

**Validações:**
- Valida formato do CNJ (deve conter exatamente 20 dígitos)
- Rejeita CNJs com letras
- Normaliza CNJ removendo máscara para comparação

#### experimentDataQuery
Obtém dados do experimento do usuário.

**Argumentos:**
- alternative (String, opcional): Nome da alternativa do experimento
- simulating (Boolean, opcional): Indica se está simulando o experimento

**Retorna:** Dados do experimento (ExperimentData)

#### nextPlanModalQuer
Obtém dados do modal de oferta de plano.

**Argumentos:** Nenhum

**Retorna:** Dados do modal (NextPlanModal)

### Mutations

#### registerLastInteractionMutation
Registra a última interação do usuário com uma movimentação específica.

**Argumentos:**
- lawsuitNumber (String, obrigatório): Número CNJ do processo
- movementId (String, obrigatório): ID da movimentação

**Retorna:** Resposta com status e dados da movimentação (RegisterLastInteractionResponse)

## 3. Contrato com APIs

Atualmente, o backend faz conexão com apenas uma API externa: a Mock API.

### Mock API

A Mock API fornece dados de experimentos e modais de oferta. A conexão é feita através do mockAPI.js, que utiliza o httpClient.js para realizar requisições HTTP.

**Endpoints utilizados:**
- GET /experiment/participate: Obtém dados de participação em experimentos
- GET /box-lock: Obtém dados do modal de oferta

## 4. Dados Mockados

O backend fornece dados mockados:

### Processos Judiciais (Lawsuits)

Fornece 40 processos judiciais mockados armazenados em `src/schema/types/lawsuit/lawsuitsMock.js`. Cada processo contém:

- ID único
- Número CNJ (formato com máscara)
- Tribunal (TJAL ou TJCE)
- Data de início
- Partes envolvidas (Autor e Réu)
- Movimentações do processo (com ID, data e descrição)

### Dados do Mock API

Os dados de experimentos e modais são fornecidos pela Mock API externa, que retorna:

- **Dados de experimento**: Informações sobre participação em experimentos, alternativas, grupos, etc.
- **Dados de modal**: Informações sobre ofertas de planos, preços, benefícios, etc.

## 5. Testes

Testamos somente o fluxo principal, como as queries GraphQL e conexão com APIs externas. Não testamos, por exemplo, as definições de tipos (typeDefs).

### Testado:**Queries GraphQL**,**Mutations GraphQL** e **Conexão com APIs**

### Resultados dos Testes

<img src="./test_result.png" alt="Resultados dos Testes" width="700"/>


### Como executar os testes

**Executar todos os testes:**
```bash
cd backend-graphql
pnpm test
```

**Executar testes com cobertura:**
```bash
cd backend-graphql
pnpm test:coverage
```

## 6. Observação

Utilizamos a estrutura fornecida para adicionar novos recursos, sem realizar modificações desnecessárias, como sugerido na descrição do desafio. 