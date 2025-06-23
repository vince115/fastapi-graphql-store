# backend/api_graphql/user/types.py

import strawberry

@strawberry.type
class User:
    id: int
    username: str
    email: str
    role: str
    isActive: bool

@strawberry.type
class UserMutationResponse:
    success: bool
    message: str
    user: User | None = None
