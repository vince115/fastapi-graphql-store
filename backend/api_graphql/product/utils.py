# backend/api_graphql/product/utils.py
from models.product import Product as ProductModel
from .types import Product

def to_product(p: ProductModel) -> Product:
    return Product(
        id=p.id,
        name=p.name,
        category=p.category,
        price=p.price,
        stock=p.stock,
        imageUrl=p.image_url,
        isActive=bool(p.is_active) # map DB → GraphQL
    )
