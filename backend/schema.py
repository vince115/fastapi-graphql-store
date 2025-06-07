# schema.py
import strawberry
from sqlalchemy.future import select
from db import AsyncSessionLocal
from models import Product as ProductModel

@strawberry.type
class Product:
    id: int
    name: str
    category: str
    price: float
    stock: int
    imageUrl: str
    active: bool # boolean 型別

@strawberry.type
class MutationResponse:
    success: bool
    message: str
    product: Product | None = None

def to_product(p: ProductModel) -> Product:
    return Product(
        id=p.id,
        name=p.name,
        category=p.category,
        price=p.price,
        stock=p.stock,
        imageUrl=p.imageUrl,
        active=bool(p.active)
    )


#查詢
@strawberry.type
class Query:
    @strawberry.field
    async def products(self) -> list[Product]:
        async with AsyncSessionLocal() as session:
            result = await session.execute(select(ProductModel))
            return [to_product(p) for p in result.scalars()]
    # 根據 id 查詢單一商品
    @strawberry.field
    async def get_product(self, id: int) -> Product | None:
        async with AsyncSessionLocal() as session:
            result = await session.execute(select(ProductModel).where(ProductModel.id == id))
            product = result.scalars().first()
            if not product:
                return None
            return to_product(product)

@strawberry.type
class Mutation:
    

    #新增
    @strawberry.mutation
    async def addProduct(
        self, 
        name: str, 
        category: str, 
        price: float, 
        stock: int,
        imageUrl: str,
        active: bool = True  # 改為 boolean
    ) -> Product:
        async with AsyncSessionLocal() as session:
            new_product = ProductModel(
                name=name,
                category=category, 
                price=price,
                stock=stock,
                imageUrl=imageUrl, 
                active=active
            )
            session.add(new_product)
            await session.commit()
            await session.refresh(new_product)
            return to_product(new_product)
    
    #修改
    @strawberry.mutation
    async def updateProduct(
            self, 
            id: int, 
            name: str | None = None, 
            category: str | None = None, 
            price: float | None = None,
            stock:int | None = None,
            imageUrl: str | None = None, 
            active: bool | None = None
        ) -> Product | None:
        async with AsyncSessionLocal() as session:
            result = await session.execute(select(ProductModel).where(ProductModel.id == id))
            product = result.scalars().first()
            if not product:
                return None
            if name:
                product.name = name
            if category:
                product.category = category    
            if price:
                product.price = price
            if stock:
                product.stock = stock
            if imageUrl:
                product.imageUrl = imageUrl     
            if active is not None:
                product.active = active
            await session.commit()
            return to_product(product)
        
    #刪除
    @strawberry.mutation
    async def deleteProduct(self, id: int) ->  MutationResponse:
        async with AsyncSessionLocal() as session:
            result = await session.execute(select(ProductModel).where(ProductModel.id == id))
            product = result.scalars().first()
            if not product:
                return MutationResponse(success=False, message="找不到此商品", product=None)
    
            await session.delete(product)
            await session.commit()
            return MutationResponse(success=True, message="商品已刪除", product=to_product(product))

schema = strawberry.Schema(query=Query, mutation=Mutation)
