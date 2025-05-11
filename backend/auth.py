# backend/auth.py
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from jose import jwt
from datetime import datetime, timedelta

SECRET_KEY = "super_secret_key"  # 請務必改成複雜且安全的金鑰
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60  # ✅ 設定過期時間：60 分鐘

router = APIRouter(prefix="/admin", tags=["Admin"])

fake_users = {"admin": "1234"}

class LoginRequest(BaseModel):
    username: str
    password: str

@router.post("/login")
def login(req: LoginRequest):
    if req.username not in fake_users or fake_users[req.username] != req.password:
        raise HTTPException(status_code=401, detail="帳號或密碼錯誤")

    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    token_data = {"sub": req.username, "exp": expire}
    token = jwt.encode(token_data, SECRET_KEY, algorithm=ALGORITHM)
    return {"access_token": token, "token_type": "bearer"}
