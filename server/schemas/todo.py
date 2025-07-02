from pydantic import BaseModel


class TodoCreate(BaseModel):
    id: int
    title: str
    description: str
    is_completed: bool

    class Config:
        orm_mode = True
