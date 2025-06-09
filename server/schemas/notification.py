from pydantic import BaseModel


class Notification(BaseModel):
    user_id : str 
    message : str 
    