import jwt
from datetime import  datetime, timedelta
from fastapi import HTTPException
from server.utils.config import settings

SECRET_KEY = settings.jwt_secret  
ALGORITHM = "HS256"


def create_jwt_token(user_id: int) -> str:
    expire = datetime.utcnow() + timedelta(days=7)  
    to_encode = {"id": user_id, "exp": expire}
    token = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return token

def verify_jwt_token(token : str) -> dict:
    try :
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token muddati tugagan.")
    except jwt.InvalidAlgorithmError:
        raise HTTPException(status_code=401, detail="Token yaroqsiz. ")