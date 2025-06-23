# backend/api_graphql/product/types.py
import strawberry

@strawberry.type
class Product:
    id: int
    name: str
    category: str
    price: float
    stock: int
    imageUrl: str
    isActive: bool

@strawberry.type
class ProductMutationResponse:
    success: bool
    message: str
    product: Product | None = None
