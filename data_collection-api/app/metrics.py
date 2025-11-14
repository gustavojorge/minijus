from prometheus_client import Counter, Gauge, Histogram

# Requisições ao endpoint /lawsuit
lawsuit_requests_total = Counter(
    "lawsuit_requests_total",
    "Total de requisições ao endpoint /lawsuit",
    labelnames=["result"]  # result: cache_hit | cache_miss | error
)

# Quantidade de casos retornados do cache por CNJ na última requisição
cache_cases_returned = Gauge(
    "cache_cases_returned",
    "Quantidade de casos retornados do cache na última requisição",
    labelnames=["cnj"]
)

# Total de tarefas enfileiradas (fire-and-forget)
queued_tasks_total = Counter(
    "queued_tasks_total",
    "Total de tarefas de coleta enfileiradas",
    labelnames=["source"]  # source: api | other
)