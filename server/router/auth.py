from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from database.session import get_db
from schemas.auth import RegisRequest, LoginRequest
from database.models.users import Users
from security.hash import hash_password, verify_password
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

@router.post("/login")
async def login(user_data : LoginRequest, db : AsyncSession = Depends(get_db)) :
    try :
        stmt = select(Users).where(Users.email == user_data.email)
        result = await db.execute(stmt)
        db_user = result.scalar_one_or_none()

        if not db_user:
            raise HTTPException(detail="Bunday foydalanuvchi mavjud emas.", status_code=400)
        
        if not verify_password(user_data.password, db_user.password):
            raise HTTPException(detail="Password xato!", status_code=401)
        
        token = create_jwt_token(db_user.id)
        return {
            "message" : "Kirish mufaqqiyatli amalga oshirildi.",
            "token" : token,
            "user_id" : db_user.id
        }
    except Exception as e:
        raise HTTPException(detail="Server xatoligi.", status_code=500)

@router.get('/me/{token}')
async def get_token(token : str , db : AsyncSession = Depends(get_db)):
    try:
        payload = verify_jwt_token(token)
        user_id = payload.get('id')

        stmt = select(Users).where(Users.id == user_id)
        result = await db.execute(stmt)
        user = result.scalar_one_or_none()

        if not user:
            raise HTTPException("Foydalanuvchi topilmadi. ", status_code=404)
        
        return {
            "user_id": user.id,
            "email": user.email,
            "full_name": user.full_name
        }
    except Exception as e:
        raise HTTPException(status_code=401, detail="Token noto‘g‘ri yoki eskirgan.")