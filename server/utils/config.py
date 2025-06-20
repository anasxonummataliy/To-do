from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    db_url: str = "postgresql://username:password@localhost:5432/users.db"
    jwt_secret : str = "wiqdiqdiqbidbqiwb1212beib3"

settings = Settings()