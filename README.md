# 📦 FastAPI + Strawberry + SQLite 商品系統

這是一個基於 **FastAPI + Strawberry GraphQL + SQLAlchemy + SQLite** 打造的後端電商商品 API，支援商品的 CRUD 操作。

---

## ✅ 功能特色

- 📡 使用 Strawberry 提供 GraphQL API
- 📄 商品查詢 / 新增 / 更新 / 刪除（CRUD）
- ⚡ 使用 SQLAlchemy + SQLite
- 🧠 可與 Next.js + Apollo Client 前端整合

---

## 🛠️ 安裝步驟

### 1. Clone 專案
```bash
git clone https://github.com/your-user/fastapi-graphql-store.git
cd fastapi-graphql-store
```

### 2. 建立虛擬環境
```bash
python3 -m venv venv
source venv/bin/activate  # Windows 請使用 venv\Scripts\activate
```

### 3. 安裝依賴套件
```bash
pip install -r requirements.txt
```

**或手動安裝：**
```bash
pip install fastapi strawberry-graphql uvicorn[standard] sqlalchemy aiosqlite greenlet
```

### 4. 啟動開發伺服器
```bash
uvicorn main:app --reload
```
瀏覽：`http://localhost:8000/graphql`

---

## 🔧 GraphQL 範例操作

### ➕ 新增商品
```graphql
mutation {
  addProduct(name: "白T", price: 299.99) {
    id
    name
    price
  }
}
```

### 🔍 查詢商品
```graphql
query {
  products {
    id
    name
    price
  }
}
```

### ✏️ 更新商品
```graphql
mutation {
  updateProduct(id: 1, price: 399.99) {
    id
    name
    price
  }
}
```

### ❌ 刪除商品
```graphql
mutation {
  deleteProduct(id: 1) {
    id
    name
  }
}
```

---

## 🚀 前端整合（Next.js + Apollo）

你可以用以下方式連接這個 GraphQL API：

### 安裝 Apollo Client
```bash
npm install @apollo/client graphql
```

### 建立 Apollo Provider
```tsx
// src/lib/apolloClient.ts
import { ApolloClient, InMemoryCache } from "@apollo/client";

const client = new ApolloClient({
  uri: "http://localhost:8000/graphql",
  cache: new InMemoryCache(),
});

export default client;
```

### 在 app/page.tsx 中查詢商品
```tsx
"use client";
import { gql, useQuery } from "@apollo/client";
import client from "../lib/apolloClient";
import { ApolloProvider } from "@apollo/client";

const GET_PRODUCTS = gql`
  query {
    products {
      id
      name
      price
    }
  }
`;

export default function HomePage() {
  const { data, loading, error } = useQuery(GET_PRODUCTS);

  if (loading) return <p>載入中...</p>;
  if (error) return <p>錯誤：{error.message}</p>;

  return (
    <ApolloProvider client={client}>
      <div className="p-8">
        <h1 className="text-xl font-bold mb-4">商品列表</h1>
        <ul>
          {data.products.map((p: any) => (
            <li key={p.id}>{p.name} - ${p.price}</li>
          ))}
        </ul>
      </div>
    </ApolloProvider>
  );
}
```

---

## 🗂️ 專案結構
```
fastapi-graphql-store/
├── main.py              # FastAPI 啟動點
├── db.py                # 資料庫初始化
├── models.py            # 商品模型
├── schema.py            # GraphQL 定義
├── requirements.txt     # 套件依賴
└── README.md
```

---

## 📌 待辦與擴充建議
- ✅ JWT 驗證保護 mutation
- ✅ 加入使用者模型與登入流程
- ✅ 支援分類、庫存欄位
- ✅ 部署上 Railway、Render、Vercel 前後端整合
