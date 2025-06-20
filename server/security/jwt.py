import jwt
from datetime import  datetime, timedelta
from utils.config import settings


SECRET_KEY = settings.secret_key  
ALGORITHM = "HS256"


def create_jwt_token(user_id: int) -> str:
    expire = datetime.utcnow() + timedelta(days=7)  
    to_encode = {"id": user_id, "exp": expire}
    token = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return token
