# backend/schema.py

import strawberry
from api_graphql.product.queries import ProductQuery # type: ignore
from api_graphql.product.mutations import ProductMutation # type: ignore
from api_graphql.user.queries import UserQuery  # type: ignore # 若你已建立 User 查詢
from api_graphql.user.mutations import UserMutation  # 若有 User CRUD 可以加上

@strawberry.type
class Query(
    ProductQuery, 
    UserQuery):
    pass

@strawberry.type
class Mutation(
    ProductMutation, 
    UserMutation):  # 可加上 UserMutation
    pass

schema = strawberry.Schema(query=Query, mutation=Mutation)