# Explicação: Workers e Tarefas no Celery

## 1️⃣ Onde o Worker é Definido e Como a Tarefa é Atribuída?

### O Worker NÃO é definido no código Python

O **worker** não é uma classe ou função no código. Ele é um **processo Python** que roda o Celery e fica "escutando" o Redis esperando por tarefas.

### Fluxo Completo:

```
┌─────────────────────────────────────────────────────────────┐
│ PASSO 1: Definição da Tarefa (Código Python)                │
└─────────────────────────────────────────────────────────────┘

📍 Arquivo: app/tasks/lawsuit_tasks.py
dsdsdsds
@celery_app.task(bind=True, max_retries=3, name="app.tasks.lawsuit_tasks.collect_lawsuit_task")
def collect_lawsuit_task(self, cnj: str, max_cache_age_seconds: int = 3600):
    # Esta função é REGISTRADA como uma tarefa Celery
    # O decorador @celery_app.task faz isso automaticamente
    ...
```

**O que acontece aqui:**
- O decorador `@celery_app.task` **registra** a função como uma tarefa
- O Celery cria um "contrato" dizendo: "existe uma tarefa chamada `app.tasks.lawsuit_tasks.collect_lawsuit_task`"
- Mas a função **ainda não foi executada**, apenas registrada

---

```
┌─────────────────────────────────────────────────────────────┐
│ PASSO 2: Inicialização do Worker (Comando)                  │
└─────────────────────────────────────────────────────────────┘

📍 Comando: celery -A app.workers.celery_app worker --loglevel=info

O que este comando faz:
1. Importa app.workers.celery_app (que contém celery_app)
2. Importa app.tasks.lawsuit_tasks (por causa do include)
3. Registra todas as tarefas encontradas
4. Conecta ao Redis
5. Fica ESPERANDO por mensagens na fila
```

**O worker é um processo que:**
- Roda continuamente (loop infinito)
- Fica "escutando" o Redis
- Quando vê uma mensagem, pega e executa a tarefa correspondente

---

```
┌─────────────────────────────────────────────────────────────┐
│ PASSO 3: Enfileiramento da Tarefa (API)                     │
└─────────────────────────────────────────────────────────────┘

📍 Arquivo: app/controllers/lawsuit_controller.py

task = collect_lawsuit_task.delay(normalized_cnj, max_cache_age_seconds)
```

**O que `.delay()` faz:**
1. **NÃO executa** a função `collect_lawsuit_task()`
2. Cria uma **mensagem JSON** com:
   - Nome da tarefa: `"app.tasks.lawsuit_tasks.collect_lawsuit_task"`
   - Argumentos: `["0710802-55.2018.8.02.0001", 3600]`
   - ID único da tarefa
3. Envia essa mensagem para o **Redis** (fila)
4. Retorna imediatamente (não espera execução)

---

```
┌─────────────────────────────────────────────────────────────┐
│ PASSO 4: Worker Pega e Executa (Automático)                 │
└─────────────────────────────────────────────────────────────┘

O worker (que está rodando em outro processo/container):
1. Vê a mensagem no Redis
2. Lê o nome da tarefa: "app.tasks.lawsuit_tasks.collect_lawsuit_task"
3. Procura a função registrada com esse nome
4. Executa: collect_lawsuit_task("0710802-55.2018.8.02.0001", 3600)
5. Salva o resultado no Redis (opcional)
```

---

## 📍 Resumo: Onde Cada Coisa Acontece

| Componente | Onde está | O que faz |
|------------|-----------|-----------|
| **Definição da Tarefa** | `app/tasks/lawsuit_tasks.py` | Função com `@celery_app.task` |
| **Registro da Tarefa** | Quando o worker inicia | Celery registra todas as tarefas |
| **Enfileiramento** | `app/controllers/lawsuit_controller.py` | `task.delay()` envia para Redis |
| **Worker (Processo)** | Container separado | Processo que roda `celery worker` |
| **Execução** | Dentro do worker | Worker pega mensagem e executa |

---

## 2️⃣ Por Que um Container Separado para o Worker?

### Opção 1: Container Separado (Atual) ✅

```yaml
services:
  api:
    command: uvicorn app.main:app ...
    
  worker:
    command: celery -A app.workers.celery_app worker ...
```

**Vantagens:**
1. **Separação de Responsabilidades**
   - API: apenas recebe requisições HTTP
   - Worker: apenas processa tarefas
   - Fácil de entender e debugar

2. **Escalabilidade Independente**
   ```bash
   # Pode escalar workers sem afetar a API
   docker compose up -d --scale worker=5
   ```
   - Se tiver muitas tarefas, adiciona mais workers
   - API continua respondendo rápido

3. **Isolamento de Recursos**
   - Se um worker travar, não afeta a API
   - Pode configurar limites de memória/CPU separados
   - Reiniciar worker não derruba a API

4. **Deploy Independente**
   - Pode atualizar workers sem reiniciar API
   - Útil em produção

5. **Monitoramento Separado**
   - Logs separados
   - Métricas separadas
   - Fácil identificar problemas

---

### Opção 2: Mesmo Container (Alternativa)

Você **poderia** rodar tudo no mesmo container:

```yaml
services:
  api:
    command: sh -c "uvicorn app.main:app ... & celery -A app.workers.celery_app worker ... & wait"
```

**Desvantagens:**
- ❌ Se worker travar, pode afetar API
- ❌ Não pode escalar workers independentemente
- ❌ Logs misturados
- ❌ Mais difícil de debugar
- ❌ Reiniciar worker derruba API

---

## 🎯 Quando Usar Cada Abordagem?

### Container Separado (Recomendado) ✅
- ✅ Produção
- ✅ Quando precisa escalar workers
- ✅ Quando quer isolamento
- ✅ Quando tem muitos workers

### Mesmo Container
- ⚠️ Apenas desenvolvimento/testes
- ⚠️ Quando recursos são muito limitados
- ⚠️ Quando é um projeto pequeno

---

## 🔍 Exemplo Prático: Como Funciona na Prática

### Cenário: 100 requisições simultâneas

**Com container separado:**
```
API Container: Recebe 100 requisições → Enfileira 100 tarefas → Responde em 200ms
Worker Container 1: Processa tarefa 1
Worker Container 2: Processa tarefa 2
Worker Container 3: Processa tarefa 3
...
Worker Container 10: Processa tarefa 10
```

**Com mesmo container:**
```
Container: Recebe 100 requisições → Enfileira 100 tarefas → Tenta processar tudo → Pode travar
```

---

## 📝 Resumo Final

1. **Worker não é código, é um processo** que roda `celery worker`
2. **Tarefa é definida** com `@celery_app.task` no código
3. **Tarefa é enfileirada** com `.delay()` que envia mensagem para Redis
4. **Worker pega automaticamente** a mensagem do Redis e executa
5. **Container separado** permite escalabilidade, isolamento e melhor organização

---

## 🧪 Teste Prático

Para ver o worker em ação:

```bash
# Ver tarefas registradas
docker exec data_collection_worker celery -A app.workers.celery_app inspect registered

# Ver workers ativos
docker exec data_collection_worker celery -A app.workers.celery_app inspect active

# Ver fila no Redis
docker exec data_collection_redis redis-cli
> LLEN celery
> LRANGE celery 0 -1
```

