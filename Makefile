.PHONY:
run-elastic:
	@docker compose up -d

.PHONY:
stop-elastic:
	@docker compose down

.PHONY:
purge-elastic:
	@docker compose down -v
