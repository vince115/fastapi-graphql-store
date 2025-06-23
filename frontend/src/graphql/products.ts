// src/graphql/products.ts
export const PRODUCT_QUERY = `
  query {
    products {
      id
      name
      category
      price
      stock
      imageUrl
      isActive
    }
  }
`;

export const PRODUCT_MUTATION = `
  mutation AddProduct(
    $name: String!,
    $category: String!,
    $price: Float!,
    $stock: Int!,
    $imageUrl: String!,
    $isActive: Boolean!
  ) {
    addProduct(
      name: $name,
      category: $category,
      price: $price,
      stock: $stock,
      imageUrl: $imageUrl,
      isActive: $isActive
    ) {
      id
      name
      category
      price
      stock
      imageUrl
      isActive
    }
  }
`;

export const UPDATE_PRODUCT_MUTATION = `
  mutation UpdateProduct(
    $id: Int!,
    $name: String,
    $category: String,
    $price: Float,
    $stock: Int,
    $imageUrl: String,
    $isActive: Boolean
  ) {
    updateProduct(
      id: $id,
      name: $name,
      category: $category,
      price: $price,
      stock: $stock,
      imageUrl: $imageUrl,
      isActive: $isActive
    ) {
      id
      name
      category
      price
      stock
      imageUrl
      isActive
    }
  }
`;

export const DELETE_PRODUCT_MUTATION = `
  mutation DeleteProduct($id: Int!) {
    deleteProduct(id: $id) {
      success
      message
    }
  }
`;