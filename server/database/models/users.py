from sqlalchemy import String, Column, Integer

from database.base import Base

class Users(Base):
    id = Column(Integer, primary_key=True)
    full_name = Column(String, nullable=True)
    email = Column(String)
    password = Column(String)
