from fastapi import FastAPI
from strawberry.fastapi import GraphQLRouter
from schema import schema
from db import engine, Base
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# ✅ CORS 設定
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001"],  # ⬅️ 允許前端來源
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

graphql_app = GraphQLRouter(schema)

app.include_router(graphql_app, prefix="/graphql")

@app.on_event("startup")
async def on_startup():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
