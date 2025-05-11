from sqlalchemy import Column, Integer, String, Float
from db import Base
import enum

class ProductStatus(enum.IntEnum):  # ✅ 改用 IntEnum 對應資料庫中的 0/1
    INACTIVE = 0
    ACTIVE = 1

class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    price = Column(Float, nullable=False)
    status = Column(Integer, default=ProductStatus.ACTIVE.value)