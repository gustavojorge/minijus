import asyncio
from kafka.runner import run
from migrations_runner import apply_migrations

def main():
    apply_migrations()
    asyncio.run(run())

if __name__ == "__main__":
    main()
