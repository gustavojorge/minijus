# Challenge 3 - Search

![Python](https://img.shields.io/badge/Python-3.11-blue)  
![FastAPI](https://img.shields.io/badge/Framework-FastAPI-lightblue)  
![Elasticsearch](https://img.shields.io/badge/Database-Elasticsearch-orange)  
![Docker](https://img.shields.io/badge/Container-Docker-blue)  

---

## 1. Descrição

Este repositório contém um sistema voltado para indexação e busca de processos judiciais.  
O sistema é composto por três microserviços principais:

1. **Indexer**: responsável por validar, enriquecer e indexa documentos no Elasticsearch.
2. **Searcher**: API de busca de processos judiciais.
3. **DB-init**: microserviço auxiliar utilizado para persistência inicial de dados, criando tabelas e populando.

Para mais detalhes sobre cada serviço, consulte o README específico dentro de cada diretório (`indexer/` ou `searcher/`).

---

## 2. Execução

Todos os microserviços estão containerizados e são geridos via Docker.  

Para subir todo o sistema, execute:

```bash
docker compose down -v
docker compose up --build -d
```

Isso irá:

- Construir as imagens dos microserviços
- Subir os containers necessários
- Inicializar Elasticsearch e demais dependências

Os endpoints dos serviços estarão acessíveis nas portas mapeadas pelo `docker-compose.yml`.

---

## 3. Agradecimentos

Gostaria de agradecer à **Indra**, que disponibilizou de bom grado um conjunto de 16 processos para facilitar depuração e teste do sistema, incluindo scripts para criar e popular o banco.  

Infelizmente, próximo à entrega, percebemos inconsistências nos dados fornecidos (campos nulos ou faltantes).  
Por isso, ao longo do desenvolvimento, foi necessário flexibilizar algumas validações e tratativas de erro ao longo de todo o sistema.  

Planejo construir um banco de dados enriquecido e consistente nas próximas semana, de modo que as validações e tratativas possam ser aplicadas integralmente no pipeline de **search** e seguir à risca aquilo que foi acordado. 

---

## 4. Testes de Integração

Apesar de ter realizado testes unitários em cada microserviço, tive dificuldades em implementar testes de integração ponta-a-ponta, mesmo depois de muita insistência. 

Para as próximas semanas, o estudo e implementação de testes de integração completos serão prioridade, garantindo que todo o fluxo entre **Indexer**, **Searcher** e **DB-init** seja validado. 

**LEIA OS README DOS MICROSERVIÇOS "SEARCHER" E "INDEXER"**