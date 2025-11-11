# Mock API

## Descrição

A Mock API é um serviço mock que fornece dados simulados . Ela fornece dados mockados de:

- **Experimentos**: Dados sobre participação em experimentos, alternativas, grupos e status
- **Modal de oferta**: Informações sobre ofertas de planos, preços, benefícios e botões de ação

## Rotas Disponíveis

### GET /experiment/participate

Retorna informações do experimento que o usuário foi sorteado para participar.

**Parâmetros de query (opcionais):**
- alternative: Força uma alternativa específica (ex: variant-a, control)
- simulating: Indica se está simulando o experimento (true ou false)

### GET /box-lock

Retorna informações do modal de oferta para o usuário.

