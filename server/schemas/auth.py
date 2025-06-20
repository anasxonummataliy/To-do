from pydantic import BaseModel, EmailStr
from typing import Optional


class RegisRequest(BaseModel):
    full_name : Optional[str] = None
    email : EmailStr
    password : str

class LoginRequest(BaseModel):
    email : EmailStr
    password : str