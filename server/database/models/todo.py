from sqlalchemy import Column, String, Integer, Boolean

from server.database.base import Base

class Todo(Base):
    __tablename__ = "todos"

    id = Column(Integer, primary_key=True)
    title = Column(String, nullable=True)
    description = Column(String, nullable=True )
    completed = Column(Boolean, nullable=True)


