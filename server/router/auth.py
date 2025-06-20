from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from database.session import get_db
from schemas.auth import RegisRequest, LogisRequest
from database.models.users import Users
from security.hash import hash_password
from security.jwt import create_jwt_token, verify_jwt_token
router = APIRouter(
    prefix="/auth",
    tags=['auth']
)


@router.post('/register')
async def register(user_data: RegisRequest, db: AsyncSession = Depends(get_db)):
    try:
        smtm = select(Users).where(Users.email == user_data.email)
        result = await db.execute(smtm)
        db_user = result.scalar_one_or_none()

        if db_user is not None:
            raise HTTPException(
                detail="Bu email orqali allaqachon ro'yhatdan o'tilgan. Iltimos boshqa email orqali ro'yhatdan o'ting!", status_code=400)
        user_data.password = hash_password(user_data.password)
        new_user = Users(**user_data.model_dump())
        db.add(new_user)
        await db.commit()
        await db.refresh(new_user)

        token = create_jwt_token(new_user.id)
        return {
            'message' : "Ro'yhatdan o'tish muvaffaqiyatli yakunlandi.",
            "token" : token,
            "user_id" : new_user.id
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Server xatoligi {str(e)}")
