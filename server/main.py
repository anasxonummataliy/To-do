from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from server.router.auth import router as auth_router
from server.router.todo import router as todo_router

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
@app.get("/")
async def start():
    return {"message" : "Server is working!"}

app.include_router(auth_router)
app.include_router(todo_router)
