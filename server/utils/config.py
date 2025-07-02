from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    db_url: str = "postgresql+asyncpg://anasxonummataliy@localhost:5432/todo_db"
    jwt_secret : str = "wiqdiqdiqbidbqiwb1212beib3"

settings = Settings()