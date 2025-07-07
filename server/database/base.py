from server.database.session import async_engine
from sqlalchemy import Column, DateTime, func
from sqlalchemy.orm import DeclarativeBase, declared_attr

class Base(DeclarativeBase):
    @declared_attr
    def create_at(cls):
        return Column(DateTime, default=func.now())
    
    @declared_attr
    def update_at(cls):
        return Column(DateTime, default=func.now(), onupdate=func.now())
    

async def create_db_and_tables():
    async with async_engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
