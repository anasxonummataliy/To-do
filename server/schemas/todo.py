from datetime import datetime
from typing import Optional
from pydantic import BaseModel


class TodoCreate(BaseModel):
    title: str
    description: str
        
class TodoUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    completed: Optional[bool] = None

class TodoResponse(BaseModel):
    id : int 
    title : str
    description : Optional[str] = None
    completed : bool
    deadline : Optional[datetime] = None
    created_at : datetime

    class Config:
        orm_mode : True


class DeadlineUpdate(BaseModel):
    deadline: datetime
