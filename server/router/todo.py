from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from database.models.todo import Todo
from schemas.todo import CreateTodo
from server.database.session import get_db

router = APIRouter(
    prefix='/todos',
    tags=['Todo']
)


@router.post('')
async def create_todo(todo: CreateTodo, db: AsyncSession = Depends(get_db)):
    pass


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

