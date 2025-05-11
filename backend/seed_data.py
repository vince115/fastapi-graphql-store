import asyncio
from sqlalchemy.future import select
from db import AsyncSessionLocal
from models import Product as ProductModel, ProductStatus

FAKE_PRODUCTS = [
    {"name": "經典白T", "price": 499.0, "status": ProductStatus.ACTIVE},
    {"name": "iPhone 15 Pro", "price": 45999.0, "status": ProductStatus.ACTIVE},
    {"name": "Samsung S24 Ultra", "price": 38999.0, "status": ProductStatus.ACTIVE},
    {"name": "AirPods Pro", "price": 7999.0, "status": ProductStatus.INACTIVE},
    {"name": "MacBook Air M3", "price": 35999.0, "status": ProductStatus.ACTIVE},
    {"name": "Dyson 吹風機", "price": 14999.0, "status": ProductStatus.INACTIVE},
]

async def seed_data():
    async with AsyncSessionLocal() as session:
        # 檢查是否已有資料，避免重複插入
        result = await session.execute(select(ProductModel))
        existing = result.scalars().all()
        if existing:
            print("✅ 已有資料，跳過初始化。")
            return

        # 插入假資料
        for p in FAKE_PRODUCTS:
            product = ProductModel(name=p["name"], price=p["price"], status=p["status"])
            session.add(product)

        await session.commit()
        print("✅ 假資料插入完成。")

if __name__ == "__main__":
    asyncio.run(seed_data())
