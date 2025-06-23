# backend/api_graphql/user/queries.py

import strawberry
from db import AsyncSessionLocal
from sqlalchemy.future import select
from models.user import User as UserModel
from .types import User

@strawberry.type
class UserQuery:
    @strawberry.field
    async def users(self) -> list[User]:
        async with AsyncSessionLocal() as session:
            result = await session.execute(select(UserModel))
            return [
                User(
                    id=u.id,
                    username=u.username,
                    email=u.email,
                    role=u.role,
                    isActive=bool(u.is_active),
                )
                for u in result.scalars()
            ]
