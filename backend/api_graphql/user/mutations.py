# backend/api_graphql/user/mutations.py

import strawberry
from sqlalchemy.future import select
from db import AsyncSessionLocal
from models.user import User as UserModel
from .types import User, UserMutationResponse
from .utils import to_user

@strawberry.type
class UserMutation:

    @strawberry.mutation
    async def add_user(
        self,
        username: str,
        email: str,
        password: str,
        role: str = "user",
        isActive: bool = True
    ) -> User:
        async with AsyncSessionLocal() as session:
            new_user = UserModel(
                username=username,
                email=email,
                password=password,  # ⚠️ 注意：建議實務上加密後儲存
                role=role,
                is_active=isActive
            )
            session.add(new_user)
            await session.commit()
            await session.refresh(new_user)
            return to_user(new_user)

    @strawberry.mutation
    async def update_user (
    self,
    id: int,
    username: str | None = None,
    email: str | None = None,
    password: str | None = None,
    role: str | None = None,
    isActive: bool | None = None
    ) -> User | None:
        async with AsyncSessionLocal() as session:
            result = await session.execute(select(UserModel).where(UserModel.id == id))
            user = result.scalars().first()
            if not user:
                return None
            if username is not None:
                user.username = username
            if email is not None:
                user.email = email
            if password is not None:
                user.password = password  # 實務應加密
            if role is not None:
                user.role = role
            if isActive is not None:
                user.is_active = isActive

            await session.commit()
            return to_user(user)

    @strawberry.mutation
    async def delete_user(self, id: int) -> UserMutationResponse:
        async with AsyncSessionLocal() as session:
            result = await session.execute(select(UserModel))
            user = result.scalars().first()
            if not user:
                return UserMutationResponse(success=False, message="找不到用戶", user=None)

            await session.delete(user)
            await session.commit()
            return UserMutationResponse(success=True, message="用戶已刪除", user=to_user(user))
