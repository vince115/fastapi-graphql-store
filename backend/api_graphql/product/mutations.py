# backend/api_graphql/product/mutations.py

import strawberry
from sqlalchemy.future import select
from db import AsyncSessionLocal
from models.product import Product as ProductModel
from .types import Product, ProductMutationResponse
from .utils import to_product

@strawberry.type
class ProductMutation:

    @strawberry.mutation
    async def add_product(
        self,
        name: str,
        category: str,
        price: float,
        stock: int,
        imageUrl: str,
        isActive: bool = True
    ) -> Product:
        async with AsyncSessionLocal() as session:
            new_product = ProductModel(
                name=name,
                category=category,
                price=price,
                stock=stock,
                image_url=imageUrl,
                is_active=isActive
            )
            session.add(new_product)
            await session.commit()
            await session.refresh(new_product)
            return to_product(new_product)
    
    @strawberry.mutation
    async def update_product(
    self,
    id: int,
    name: str | None = None,
    category: str | None = None,
    price: float | None = None,
    stock: int | None = None,
    imageUrl: str | None = None,
    isActive: bool | None = None
    ) -> Product | None:
        async with AsyncSessionLocal() as session:
            result = await session.execute(select(ProductModel).where(ProductModel.id == id))
            product = result.scalars().first()
            if not product:
                return None
            if name is not None:
                product.name = name
            if category is not None:
                product.category = category
            if price is not None:
                product.price = price
            if stock is not None:
                product.stock = stock
            if imageUrl is not None:
                product.image_url = imageUrl
            if isActive is not None:
                product.is_active = isActive

            await session.commit()
            return to_product(product)

    @strawberry.mutation
    async def delete_product(self, id: int) -> ProductMutationResponse:
        async with AsyncSessionLocal() as session:
            result = await session.execute(select(ProductModel).where(ProductModel.id == id))
            product = result.scalars().first()
            if not product:
                return ProductMutationResponse(success=False, message="找不到商品", product=None)

            await session.delete(product)
            await session.commit()
            return ProductMutationResponse(success=True, message="商品已刪除", product=to_product(product))

