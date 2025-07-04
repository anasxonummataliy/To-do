from typing import Optional
from pydantic import BaseModel


class TodoCreate(BaseModel):
    id: int
    title: str
    description: str
    is_completed: bool

    class Config:
        orm_mode = True
        
class TodoUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    completed: Optional[bool] = None
