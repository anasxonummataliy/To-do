from pydantic import BaseModel, EmailStr


class RegisRequest(BaseModel):
    full_name : str
    email : EmailStr
    password : str

class LogisRequest(BaseModel):
    email : EmailStr
    password : str