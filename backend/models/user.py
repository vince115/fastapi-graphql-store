# models/user.py
from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, func
from db import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, nullable=False)  # 登入用帳號             # 顯示名稱
    email = Column(String, unique=True, nullable=True)      # Email
    hashed_password = Column(String, nullable=False)        # 雜湊後密碼
    role = Column(String, default="user")                   # 角色: admin/user
    is_active = Column(Boolean, default=True)               # 是否啟用

    created_at = Column(DateTime(timezone=True), server_default=func.now())  # 新增時間
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())        # 更新時間

