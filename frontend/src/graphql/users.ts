// src/graphql/users.ts

export const USER_QUERY = `
  query {
    users {
      id
      username
      email
      role
      isActive
    }
  }
`;

export const USER_MUTATION = `
  mutation AddUser(
    $username: String!,
    $email: String!,
    $password: String!,
    $role: String!,
    $isActive: Boolean!
  ) {
    addUser(
      username: $username,
      email: $email,
      password: $password,
      role: $role,
      isActive: $isActive
    ) {
      id
      username
      email
      role
      isActive
    }
  }
`;

export const UPDATE_USER_MUTATION = `
  mutation UpdateUser(
    $id: Int!,
    $username: String,
    $email: String,
    $password: String,
    $role: String,
    $isActive: Boolean
  ) {
    updateUser(
      id: $id,
      username: $username,
      email: $email,
      password: $password,
      role: $role,
      isActive: $isActive
    ) {
      id
      username
      email
      role
      isActive
    }
  }
`;

export const DELETE_USER_MUTATION = `
  mutation DeleteUser($id: Int!) {
    deleteUser(id: $id) {
      success
      message
    }
  }
`;
