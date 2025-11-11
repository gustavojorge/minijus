from elasticsearch import Elasticsearch

ES_HOSTS = ["http://elasticsearch:9200"]
INDEX_NAME = "lawsuits"

client = Elasticsearch(hosts=ES_HOSTS)
