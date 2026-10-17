import os
from pathlib import Path
from uuid import uuid4
from dotenv import load_dotenv
from sqlalchemy.engine import make_url
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession
from sqlalchemy.pool import NullPool

load_dotenv(Path(__file__).parent / ".env")

DATABASE_URL = os.environ["DATABASE_URL"]

_url = make_url(DATABASE_URL.replace("postgres://", "postgresql://", 1))
ASYNC_DATABASE_URL = _url.set(drivername="postgresql+asyncpg").update_query_dict(
    {"prepared_statement_cache_size": "0"}
)

_is_local = _url.host in ("localhost", "127.0.0.1")

# Serverless functions are short-lived and the Supabase transaction pooler does
# the pooling, so no client-side pool. The pooler also cannot keep prepared
# statements across transactions: disable asyncpg's statement cache and give
# every prepared statement a unique name.
engine = create_async_engine(
    ASYNC_DATABASE_URL,
    poolclass=NullPool,
    echo=False,
    connect_args={
        "statement_cache_size": 0,
        "prepared_statement_name_func": lambda: f"__asyncpg_{uuid4()}__",
        "command_timeout": 30,
        **({} if _is_local else {"ssl": "require"}),
    },
)

AsyncSessionLocal = async_sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False,
    autocommit=False,
    autoflush=False,
)


async def get_db():
    async with AsyncSessionLocal() as session:
        try:
            yield session
        finally:
            await session.close()
