from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    db_url: str = "sqlite+aiosqlite:///todo.db"
    jwt_secret : str = "wiqdiqdiqbidbqiwb1212beib3"

settings = Settings()