# models/product.py
from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, func
from db import Base

class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    category = Column(String)  
    price = Column(Float, nullable=False)
    stock = Column(Integer) 
    image_url = Column(String)
    is_active = Column(Boolean, default=True)  # ✅ 使用 Boolean 欄位

    created_at = Column(DateTime(timezone=True), server_default=func.now())  # 新增時間
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())        # 更新時間
