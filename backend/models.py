from sqlalchemy import Column, Integer, String, Float, Boolean
from db import Base

class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    category = Column(String)  
    price = Column(Float, nullable=False)
    stock = Column(Integer) 
    imageUrl = Column(String)
    active = Column(Boolean, default=True)  # ✅ 使用 Boolean 欄位