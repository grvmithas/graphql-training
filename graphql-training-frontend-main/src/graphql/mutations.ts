import { gql } from '@apollo/client';

// User Mutations
export const REGISTER_USER = gql`
  mutation RegisterUser($input: RegisterUserInput!) {
    register(input: $input) {
      id
      firstName
      lastName
      email
    }
  }
`;

export const LOGIN_USER = gql`
  mutation LoginUser($input: LoginInput!) {
    login(input: $input) {
      id
      firstName
      lastName
      email
    }
  }
`;

// Product Mutations
export const CREATE_PRODUCT = gql`
  mutation CreateProduct($input: CreateProductInput!) {
    createProduct(input: $input) {
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

// Category Mutations
export const CREATE_CATEGORY = gql`
  mutation CreateCategory($input: CreateCategoryInput!) {
    createCategory(input: $input) {
      id
      name
      description
    }
  }
`;

// Cart Mutations
export const ADD_TO_CART = gql`
  mutation AddToCart($userId: String!, $input: AddToCartInput!) {
    addToCart(userId: $userId, input: $input) {
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

export const REMOVE_FROM_CART = gql`
  mutation RemoveFromCart($userId: String!, $cartItemId: String!) {
    removeFromCart(userId: $userId, cartItemId: $cartItemId) {
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

// Input types for mutations
export interface RegisterUserInput {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface CreateProductInput {
  name: string;
  description: string;
  price: number;
  stockQuantity: number;
  imageUrl?: string;
  categoryId: string;
}

export interface CreateCategoryInput {
  name: string;
  description: string;
}

export interface AddToCartInput {
  productId: string;
  quantity: number;
}

// Mutation result types
export interface RegisterUserData {
  register: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
}

export interface RegisterUserVariables {
  input: RegisterUserInput;
}

export interface LoginUserData {
  login: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  } | null;
}

export interface LoginUserVariables {
  input: LoginInput;
}

export interface CreateProductData {
  createProduct: {
    id: string;
    name: string;
    description: string;
    price: number;
    stockQuantity: number;
    imageUrl?: string;
    category: {
      id: string;
      name: string;
      description: string;
    };
  };
}

export interface CreateProductVariables {
  input: CreateProductInput;
}

export interface CreateCategoryData {
  createCategory: {
    id: string;
    name: string;
    description: string;
  };
}

export interface CreateCategoryVariables {
  input: CreateCategoryInput;
}

export interface AddToCartData {
  addToCart: {
    id: string;
    user: {
      id: string;
      firstName: string;
      lastName: string;
      email: string;
    };
    items: Array<{
      id: string;
      quantity: number;
      product: {
        id: string;
        name: string;
        description: string;
        price: number;
        stockQuantity: number;
        imageUrl?: string;
        category: {
          id: string;
          name: string;
        };
      };
    }>;
  };
}

export interface AddToCartVariables {
  userId: string;
  input: AddToCartInput;
}

export interface RemoveFromCartData {
  removeFromCart: {
    id: string;
    user: {
      id: string;
      firstName: string;
      lastName: string;
      email: string;
    };
    items: Array<{
      id: string;
      quantity: number;
      product: {
        id: string;
        name: string;
        description: string;
        price: number;
        stockQuantity: number;
        imageUrl?: string;
        category: {
          id: string;
          name: string;
        };
      };
    }>;
  };
}

export interface RemoveFromCartVariables {
  userId: string;
  cartItemId: string;
} 