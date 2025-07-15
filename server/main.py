from contextlib import asynccontextmanager

from fastapi.security import HTTPBearer
from server.database.base import create_db_and_tables
from fastapi import Depends, FastAPI
from fastapi.middleware.cors import CORSMiddleware

from server.router.auth import router as auth_router
from server.router.todo import router as todo_router

auth_scheme = HTTPBearer(auto_error=False)

@asynccontextmanager
async def lifespan(app: FastAPI):
    await create_db_and_tables()
    yield

app = FastAPI(
    title="Auth API",
    description="Auth API",
    version="1.0.0",
    lifespan=lifespan,
    dependencies=[Depends(auth_scheme)]
)


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
