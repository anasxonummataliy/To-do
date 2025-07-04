from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from server.database.models.todo import Todo
from server.schemas.todo import TodoCreate, TodoUpdate
from server.database.session import get_db

router = APIRouter(
    prefix='/todos',
    tags=['Todo']
)


@router.post('', response_model=TodoCreate)
async def create_todo(todo: TodoCreate, db: AsyncSession = Depends(get_db)):
    new_todo = Todo(**todo.model_dump())
    db.add(new_todo)
    await db.commit()
    await db.refresh(new_todo)
    return new_todo


@router.get('/all', response_model=List[Todo])
async def all_todos(db: AsyncSession = Depends(get_db)):
    stmt = select(Todo)
    todos = await db.execute(stmt)
    result = todos.scalars().all()
    return result

@router.patch('/{todo_id}/update', response_model=Todo)
async def update_todo(todo_id: int ,todo_data : TodoUpdate, db: AsyncSession = Depends(get_db)):
    stmt = select(Todo).where(todo_id == Todo.id)
    todo = await db.execute(stmt)
    result = todo.scalar_one_or_none()

    if not result:
        raise HTTPException(detail="Todo topilmadi", status_code=404)
    
    data = todo_data.model_dump(exclude_unset=True).items()
    for key, value in data:
        setattr(result, key, value)
    
    await db.commit()
    await db.refresh(result)

    return result

@router.delete('/delete')
async def delete_todo(db: AsyncSession = Depends(get_db)):
    pass

@router.post('/{todo_id}/complete')
async def complete_todo( db: AsyncSession = Depends(get_db)):
    pass

@router.post('/{todo_id}/incomplete')
async def incomplete_todo(db: AsyncSession = Depends(get_db)):
    pass

@router.patch('/{todo_id}/set-deadline')
async def deadline_todo(db : AsyncSession = Depends(get_db)):
    pass

