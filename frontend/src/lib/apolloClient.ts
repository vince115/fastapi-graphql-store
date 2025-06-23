import { ApolloClient, InMemoryCache } from "@apollo/client";

const client = new ApolloClient({
  uri: "http://localhost:8000/graphql", // 你的 FastAPI GraphQL API
  cache: new InMemoryCache(),
});

export default client;
