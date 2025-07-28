import { gql } from '@apollo/client';

// Product Queries
export const GET_PRODUCTS = gql`
  query GetProducts {
    products {
      id
      name
      description
      price
      stockQuantity
      imageUrl
      category {
        id
        name
        description
      }
    }
  }
`;

export const GET_PRODUCT = gql`
  query GetProduct($id: String!) {
    product(id: $id) {
      id
      name
      description
      price
      stockQuantity
      imageUrl
      category {
        id
        name
        description
      }
    }
  }
`;

// Category Queries
export const GET_CATEGORIES = gql`
  query GetCategories {
    categories {
      id
      name
      description
      products {
        id
        name
        price
        stockQuantity
        imageUrl
      }
    }
  }
`;

export const GET_CATEGORY = gql`
  query GetCategory($id: String!) {
    category(id: $id) {
      id
      name
      description
      products {
        id
        name
        description
        price
        stockQuantity
        imageUrl
      }
    }
  }
`;

// User Queries
export const GET_USERS = gql`
  query GetUsers {
    users {
      id
      firstName
      lastName
      email
    }
  }
`;

export const GET_USER = gql`
  query GetUser($id: String!) {
    user(id: $id) {
      id
      firstName
      lastName
      email
    }
  }
`;

// Cart Queries
export const GET_CART = gql`
  query GetCart($userId: String!) {
    cart(userId: $userId) {
      id
      user {
        id
        firstName
        lastName
        email
      }
      items {
        id
        quantity
        product {
          id
          name
          description
          price
          stockQuantity
          imageUrl
          category {
            id
            name
          }
        }
      }
    }
  }
`;

// TypeScript types for query results
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stockQuantity: number;
  imageUrl?: string;
  category: Category;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  products?: Product[];
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

export interface CartItem {
  id: string;
  quantity: number;
  product: Product;
}

export interface Cart {
  id: string;
  user: User;
  items: CartItem[];
}

// Query result types
export interface GetProductsData {
  products: Product[];
}

export interface GetProductData {
  product: Product | null;
}

export interface GetProductVariables {
  id: string;
}

export interface GetCategoriesData {
  categories: Category[];
}

export interface GetCategoryData {
  category: Category | null;
}

export interface GetCategoryVariables {
  id: string;
}

export interface GetUsersData {
  users: User[];
}

export interface GetUserData {
  user: User | null;
}

export interface GetUserVariables {
  id: string;
}

export interface GetCartData {
  cart: Cart | null;
}

export interface GetCartVariables {
  userId: string;
} 