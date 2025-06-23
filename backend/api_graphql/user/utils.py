# backend/api_graphql/user/utils.py
from models.user import User as UserModel
from .types import User

def to_user(u: UserModel) -> User:
    return User(
        id=u.id,
        username=u.username,
        email=u.email,
        role=u.role,
        isActive=bool(u.is_active)
    )
