# GraphQL Training Frontend

A comprehensive React + TypeScript + Apollo Client frontend application that demonstrates GraphQL best practices for software developers. This application serves as a training tool to understand modern GraphQL frontend development patterns.

## 🚀 Features

- **Complete E-commerce Functionality**: Products, Categories, Cart, and User Management
- **GraphQL Best Practices**: Proper query/mutation structure, caching, and error handling
- **Modern UI/UX**: Responsive design with beautiful, intuitive interface
- **Type Safety**: Full TypeScript implementation with proper type definitions
- **State Management**: Apollo Client cache management and local state
- **Authentication**: User registration, login, and protected routes
- **Real-time Updates**: Optimistic UI updates and cache synchronization

## 🛠️ Tech Stack

- **React 18** with TypeScript
- **Vite** for fast development and building
- **Apollo Client** for GraphQL state management
- **React Router** for navigation
- **Modern CSS** with responsive design

## 📁 Project Structure

```
src/
├── components/           # React components
│   ├── auth/            # Authentication components
│   ├── products/        # Product-related components
│   ├── categories/      # Category components
│   └── cart/           # Shopping cart components
├── graphql/            # GraphQL operations
│   ├── queries.ts      # GraphQL queries
│   └── mutations.ts    # GraphQL mutations
├── hooks/              # Custom React hooks
│   ├── useAuth.ts      # Authentication hook
│   ├── useProducts.ts  # Product operations hook
│   ├── useCategories.ts # Category operations hook
│   └── useCart.ts      # Cart operations hook
├── lib/                # Library configurations
│   └── apollo-client.ts # Apollo Client setup
└── App.tsx             # Main application component
```

## 🎯 GraphQL Best Practices Implemented

### 1. **Apollo Client Configuration**

```typescript
// lib/apollo-client.ts
export const apolloClient = new ApolloClient({
  link: from([errorLink, authLink, httpLink]),
  cache,
  defaultOptions: {
    watchQuery: {
      errorPolicy: 'all',
      fetchPolicy: 'cache-and-network', // Best practice
    },
    query: {
      errorPolicy: 'all',
      fetchPolicy: 'cache-first', // Best practice
    },
  },
});
```

**Best Practices:**
- **Error Policy**: Set to 'all' to handle partial data scenarios
- **Fetch Policy**: Use 'cache-and-network' for real-time data, 'cache-first' for static data
- **Type Policies**: Custom cache normalization for better performance
- **Error Handling**: Centralized error handling with custom error link

### 2. **Query Structure and Organization**

```typescript
// graphql/queries.ts
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
```

**Best Practices:**
- **Fragment-like Structure**: Organize fields logically
- **Type Safety**: Full TypeScript integration
- **Consistent Naming**: Clear, descriptive query names
- **Field Selection**: Only request needed fields

### 3. **Custom Hooks for GraphQL Operations**

```typescript
// hooks/useProducts.ts
export const useProducts = () => {
  const { data, loading, error, refetch } = useQuery<GetProductsData>(GET_PRODUCTS, {
    fetchPolicy: 'cache-and-network',
    errorPolicy: 'all',
  });

  const [createProductMutation] = useMutation(CREATE_PRODUCT, {
    update: (cache, { data }) => {
      // Cache update logic
    },
    refetchQueries: [{ query: GET_PRODUCTS }]
  });

  return { products, loading, error, createProduct };
};
```

**Best Practices:**
- **Separation of Concerns**: Each hook handles specific domain
- **Cache Management**: Automatic cache updates after mutations
- **Error Handling**: Consistent error handling across hooks
- **Loading States**: Proper loading state management

### 4. **Mutation Best Practices**

```typescript
// hooks/useCart.ts
const [addToCartMutation] = useMutation(ADD_TO_CART, {
  update: (cache, { data }) => {
    if (data?.addToCart) {
      cache.writeQuery({
        query: GET_CART,
        variables: { userId },
        data: { cart: data.addToCart }
      });
    }
  },
  onError: (error) => {
    console.error('Error adding to cart:', error);
  }
});
```

**Best Practices:**
- **Optimistic Updates**: Immediate UI feedback
- **Cache Synchronization**: Automatic cache updates
- **Error Handling**: Comprehensive error management
- **Type Safety**: Full TypeScript support

### 5. **Authentication and Authorization**

```typescript
// hooks/useAuth.ts
export const AuthProvider: React.FC = ({ children }) => {
  const [loginMutation] = useMutation(LOGIN_USER);
  const [registerMutation] = useMutation(REGISTER_USER);

  const login = async (email: string, password: string) => {
    const { data } = await loginMutation({
      variables: { input: { email, password } }
    });
    // Handle successful login
  };

  return (
    <AuthContext.Provider value={authValue}>
      {children}
    </AuthContext.Provider>
  );
};
```

**Best Practices:**
- **Context-based State**: Centralized auth state management
- **Token Management**: Automatic token handling in requests
- **Protected Routes**: Route-level authentication
- **Persistent Sessions**: Local storage integration

### 6. **Cache Management Strategies**

```typescript
// Apollo Client cache configuration
const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        products: {
          merge(existing = [], incoming) {
            return incoming; // Handle pagination
          },
        },
      },
    },
    Product: {
      fields: {
        id: {
          read(id: string) {
            return id; // Normalize by ID
          },
        },
      },
    },
  },
});
```

**Best Practices:**
- **Type Policies**: Custom cache behavior for different types
- **Normalization**: Consistent ID-based normalization
- **Merge Functions**: Handle data merging scenarios
- **Field Policies**: Custom field behavior

### 7. **Error Handling Patterns**

```typescript
// Components demonstrate consistent error handling
if (error) {
  return (
    <div className="error-message">
      Error loading products: {error.message}
    </div>
  );
}

if (loading) {
  return <div className="loading">Loading products...</div>;
}
```

**Best Practices:**
- **Consistent Error UI**: Standardized error display
- **Loading States**: Clear loading indicators
- **Graceful Degradation**: Handle partial data scenarios
- **User Feedback**: Clear error messages

### 8. **Component Architecture**

```typescript
// Example: ProductDetail component
const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { product, loading, error } = useProduct(id || '');
  const { addToCart } = useCart(user?.id || '');

  // Component logic with proper error handling
};
```

**Best Practices:**
- **Custom Hooks**: Encapsulate GraphQL logic
- **Component Composition**: Reusable, focused components
- **Props Interface**: Clear component contracts
- **Error Boundaries**: Graceful error handling

## 🚀 Getting Started

### Prerequisites

- Node.js 16+ 
- Backend GraphQL server running (see backend setup)

### Installation

1. **Clone the repository**
   ```bash
   cd graphql-training-frontend-main
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure GraphQL endpoint**
   Update the GraphQL endpoint in `src/lib/apollo-client.ts`:
   ```typescript
   const httpLink = createHttpLink({
     uri: 'http://localhost:4000/graphql', // Update to your backend URL
   });
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173`

## 📚 Learning Objectives

This frontend demonstrates the following GraphQL best practices:

### **1. Query Optimization**
- Field selection (only request needed data)
- Fragment-like query structure
- Proper error handling and loading states

### **2. Cache Management**
- Apollo Client cache configuration
- Type policies for custom cache behavior
- Cache updates after mutations
- Optimistic UI updates

### **3. State Management**
- Apollo Client as primary state manager
- Custom hooks for domain-specific logic
- Context for global state (auth)
- Local state for UI-specific data

### **4. Error Handling**
- Consistent error patterns across components
- Graceful degradation with partial data
- User-friendly error messages
- Network error handling

### **5. Type Safety**
- Full TypeScript integration
- Generated types from GraphQL schema
- Type-safe mutations and queries
- Proper interface definitions

### **6. Performance Optimization**
- Proper fetch policies
- Cache-first for static data
- Cache-and-network for real-time data
- Optimistic updates for better UX

### **7. Authentication Patterns**
- Token-based authentication
- Protected routes
- Automatic token inclusion in requests
- Persistent sessions

### **8. Component Architecture**
- Separation of concerns
- Reusable custom hooks
- Focused, single-responsibility components
- Clear data flow patterns

## 🔧 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Code Organization

- **Components**: Organized by feature/domain
- **Hooks**: Encapsulate GraphQL logic and state management
- **GraphQL**: Separated queries and mutations
- **Types**: Generated from GraphQL schema
- **Styles**: Modern CSS with responsive design

## 🎓 Training Exercises

1. **Add a new product field**: Modify the GraphQL query and update the UI
2. **Implement search functionality**: Add search queries and filtering
3. **Add pagination**: Implement cursor-based pagination
4. **Create a wishlist feature**: Add new mutations and cache updates
5. **Implement real-time updates**: Add GraphQL subscriptions
6. **Add offline support**: Implement Apollo Client offline capabilities

## 🤝 Contributing

This is a training project. Feel free to:
- Add new features
- Improve error handling
- Enhance the UI/UX
- Add more GraphQL best practices
- Create additional training exercises

## 📖 Additional Resources

- [Apollo Client Documentation](https://www.apollographql.com/docs/react/)
- [GraphQL Best Practices](https://graphql.org/learn/best-practices/)
- [React TypeScript Cheatsheet](https://react-typescript-cheatsheet.netlify.app/)
- [Apollo Client Cache](https://www.apollographql.com/docs/react/caching/overview/)

---

**Happy GraphQL Learning! 🚀**
