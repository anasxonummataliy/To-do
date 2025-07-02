from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from server.database.models.todo import Todo
from server.schemas.todo import CreateTodo
from server.database.session import get_db

router = APIRouter(
    prefix='/todos',
    tags=['Todo']
)


@router.post('', response_model=Todo)
async def create_todo(todo: CreateTodo, db: AsyncSession = Depends(get_db)):
    new_todo = Todo(**todo.model_dump())
    return new_todo


@router.get('/all')
async def all_todos(db: AsyncSession = Depends(get_db)):
    pass

@router.post('/change')
async def change_todo( todo : CreateTodo , db : AsyncSession = Depends(get_db)):
    pass

@router.delete('/delete')
async def delete_todo(todo: CreateTodo, db: AsyncSession = Depends(get_db)):
    pass

@router.post('/{todo_id}/complete')
async def complete_todo(todo: CreateTodo, db: AsyncSession = Depends(get_db)):
    pass

@router.post('/{todo_id}/incomplete')
async def incomplete_todo(db: AsyncSession = Depends(get_db)):
    pass

@router.patch('/{todo_id}/set-deadline')
async def deadline_todo(db : AsyncSession = Depends(get_db)):
    pass

