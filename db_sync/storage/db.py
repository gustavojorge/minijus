import asyncpg

async def create_pool(host: str, port: int, user: str, password: str, db: str):

    return await asyncpg.create_pool(
        host=host,
        port=port,
        user=user,
        password=password,
        database=db,
        min_size=1,
        max_size=5,
    )
