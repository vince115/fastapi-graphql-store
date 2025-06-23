# db.py
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from sqlalchemy.orm import declarative_base

# from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession # type: ignore
# from sqlalchemy.ext.declarative import declarative_base # type: ignore
# from sqlalchemy.ext.asyncio import async_sessionmaker
# from sqlalchemy.orm import sessionmaker


# ⛳️ 改為 PostgreSQL 連線字串
# DATABASE_URL = "postgresql+asyncpg://postgres:root>@localhost:5432/<your-database>"
DATABASE_URL = "postgresql+asyncpg://postgres:root@localhost:5432/FastapiGraphQLDB"

# 建立異步引擎
engine = create_async_engine(DATABASE_URL, echo=True)
# 正確使用 async_sessionmaker（SQLAlchemy 2.0+）
AsyncSessionLocal = async_sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False,
)
Base = declarative_base()



# DATABASE_URL = "sqlite+aiosqlite:///./store.db"
# engine = create_async_engine(DATABASE_URL, echo=True)
# AsyncSessionLocal = sessionmaker(bind=engine, class_=AsyncSession, expire_on_commit=False)
# Base = declarative_base()
