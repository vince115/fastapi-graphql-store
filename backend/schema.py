import strawberry
from sqlalchemy.future import select
from db import AsyncSessionLocal
from models import Product as ProductModel

@strawberry.type
class Product:
    id: int
    name: str
    price: float

@strawberry.type
class Query:
    @strawberry.field
    async def products(self) -> list[Product]:
        async with AsyncSessionLocal() as session:
            result = await session.execute(select(ProductModel))
            return [
                Product(id=p.id, name=p.name, price=p.price)
                for p in result.scalars()
            ]

@strawberry.type
class Mutation:
    @strawberry.mutation
    async def add_product(self, name: str, price: float) -> Product:
        async with AsyncSessionLocal() as session:
            new_product = ProductModel(name=name, price=price)
            session.add(new_product)
            await session.commit()
            await session.refresh(new_product)
            return Product(id=new_product.id, name=new_product.name, price=new_product.price)

    @strawberry.mutation
    async def update_product(self, id: int, name: str | None = None, price: float | None = None) -> Product | None:
        async with AsyncSessionLocal() as session:
            result = await session.execute(select(ProductModel).where(ProductModel.id == id))
            product = result.scalars().first()
            if not product:
                return None
            if name:
                product.name = name
            if price:
                product.price = price
            await session.commit()
            return Product(id=product.id, name=product.name, price=product.price)

    @strawberry.mutation
    async def delete_product(self, id: int) -> Product | None:
        async with AsyncSessionLocal() as session:
            result = await session.execute(select(ProductModel).where(ProductModel.id == id))
            product = result.scalars().first()
            if not product:
                return None
            await session.delete(product)
            await session.commit()
            return Product(id=product.id, name=product.name, price=product.price)

schema = strawberry.Schema(query=Query, mutation=Mutation)
