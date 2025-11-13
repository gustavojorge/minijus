import asyncio
from .consume import consume_lawsuits

async def run() -> None:
    await consume_lawsuits()

if __name__ == "__main__":
    asyncio.run(run())

