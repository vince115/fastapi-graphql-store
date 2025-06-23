import { GraphQLClient } from "graphql-request";

export const graphQLClient = new GraphQLClient("http://localhost:8000/graphql");