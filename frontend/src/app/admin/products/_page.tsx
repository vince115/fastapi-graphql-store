"use client";
import { gql, useQuery, ApolloProvider } from "@apollo/client";
import client from "@/lib/apolloClient";


const GET_PRODUCTS = gql`
  query {
    products {
      id
      name
      price
    }
  }
`;

type Product = {
  id: number;
  name: string;
  price: number;
};


function ProductList() {

  const { loading, error, data } = useQuery<{ products: Product[] }>(GET_PRODUCTS);

  if (loading) return <p>載入中...</p>;
  if (error) return <p>錯誤：{error.message}</p>;
  if (!data) return <p>無資料</p>; // ✅ 防止 undefined

  return (
    <ul className="space-y-2">
      {data.products.map((p) => (
        <li key={p.id}>
          {p.name} - <span className="text-green-600">${p.price}</span>
        </li>
      ))}
    </ul>
  );
}

export default function ProductsPage() {
  return (
    <ApolloProvider client={client}>
      <main className="p-8">
        <h1 className="text-2xl font-bold mb-4">商品列表</h1>
        <ProductList />
      </main>
    </ApolloProvider>
  );
}