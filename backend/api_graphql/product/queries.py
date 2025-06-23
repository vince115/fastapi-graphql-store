# backend/api_graphql/product/queries.py

import strawberry
from db import AsyncSessionLocal
from sqlalchemy.future import select
from models.product import Product as ProductModel
from .types import Product

@strawberry.type
class ProductQuery:
    @strawberry.field
    async def products(self) -> list[Product]:
        async with AsyncSessionLocal() as session:
            result = await session.execute(select(ProductModel))
            return [
                Product(
                    id=p.id,
                    name=p.name,
                    price=p.price,
                    stock=p.stock,
                    category=p.category,
                    imageUrl=p.image_url,
                    isActive=bool(p.is_active),
                )
                for p in result.scalars()
            ]
