from pydantic import BaseModel

class CreateTodo(BaseModel):
    title : str
    description : str | None = None
    completed : bool