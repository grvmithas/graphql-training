# GraphQL Frontend Training Guide

This comprehensive guide will help you understand and learn GraphQL best practices through hands-on experience with this frontend application.

## 🎯 Learning Objectives

By the end of this training, you will understand:

1. **GraphQL Query Best Practices**
2. **Apollo Client Configuration and Caching**
3. **Mutation Patterns and Cache Updates**
4. **Error Handling and Loading States**
5. **Type Safety with TypeScript**
6. **State Management with GraphQL**
7. **Authentication and Authorization**
8. **Performance Optimization**

## 📚 Module 1: Understanding the Project Structure

### Key Files to Study:

1. **`src/lib/apollo-client.ts`** - Apollo Client configuration
2. **`src/graphql/queries.ts`** - GraphQL queries with TypeScript types
3. **`src/graphql/mutations.ts`** - GraphQL mutations with TypeScript types
4. **`src/hooks/useAuth.ts`** - Authentication state management
5. **`src/hooks/useProducts.ts`** - Product operations with caching
6. **`src/hooks/useCart.ts`** - Cart operations with optimistic updates

### Exercise 1.1: Explore the Codebase
```bash
# Navigate through the project structure
cd graphql-training-frontend-main
ls -la src/
```

**Questions to Answer:**
- Why are queries and mutations separated?
- How are TypeScript types used with GraphQL?
- What's the purpose of custom hooks?

## 📚 Module 2: Apollo Client Configuration

### Study: `src/lib/apollo-client.ts`

**Key Concepts:**

1. **Error Policy**: `errorPolicy: 'all'`
   - Allows partial data to be returned even when errors occur
   - Enables graceful degradation

2. **Fetch Policy**: 
   - `cache-and-network`: Always fetch fresh data but show cached data first
   - `cache-first`: Use cache if available, only fetch if not cached

3. **Type Policies**: Custom cache behavior for different GraphQL types

### Exercise 2.1: Modify Apollo Client Configuration
```typescript
// Try changing fetch policies and observe the behavior
defaultOptions: {
  watchQuery: {
    fetchPolicy: 'cache-first', // Try different policies
  },
}
```

**Questions:**
- What happens when you change `fetchPolicy` to `network-only`?
- How does `errorPolicy: 'all'` affect error handling?

## 📚 Module 3: GraphQL Queries

### Study: `src/graphql/queries.ts`

**Best Practices Demonstrated:**

1. **Field Selection**: Only request needed fields
2. **Consistent Naming**: Clear, descriptive query names
3. **Type Safety**: Full TypeScript integration
4. **Fragment-like Structure**: Logical field organization

### Exercise 3.1: Add a New Query
```typescript
// Add a new query for searching products
export const SEARCH_PRODUCTS = gql`
  query SearchProducts($searchTerm: String!) {
    products(where: { name_contains: $searchTerm }) {
      id
      name
      price
      category {
        name
      }
    }
  }
`;
```

### Exercise 3.2: Optimize Existing Queries
```typescript
// Modify GET_PRODUCTS to include only essential fields
export const GET_PRODUCTS_MINIMAL = gql`
  query GetProductsMinimal {
    products {
      id
      name
      price
    }
  }
`;
```

**Questions:**
- Why is field selection important for performance?
- How does TypeScript help with query safety?

## 📚 Module 4: GraphQL Mutations

### Study: `src/graphql/mutations.ts`

**Best Practices Demonstrated:**

1. **Input Types**: Proper input validation
2. **Return Types**: Complete response data
3. **Error Handling**: Comprehensive error management
4. **Cache Updates**: Automatic cache synchronization

### Exercise 4.1: Add a New Mutation
```typescript
// Add a mutation to update product stock
export const UPDATE_PRODUCT_STOCK = gql`
  mutation UpdateProductStock($id: String!, $stockQuantity: Int!) {
    updateProductStock(id: $id, stockQuantity: $stockQuantity) {
      id
      name
      stockQuantity
    }
  }
`;
```

### Exercise 4.2: Implement Optimistic Updates
```typescript
// Add optimistic response to cart mutations
const [addToCartMutation] = useMutation(ADD_TO_CART, {
  optimisticResponse: {
    addToCart: {
      id: 'temp-id',
      items: [...existingItems, newItem],
      __typename: 'Cart'
    }
  }
});
```

**Questions:**
- What are the benefits of optimistic updates?
- How do cache updates work after mutations?

## 📚 Module 5: Custom Hooks

### Study: `src/hooks/useProducts.ts`

**Best Practices Demonstrated:**

1. **Separation of Concerns**: Each hook handles specific domain
2. **Cache Management**: Automatic cache updates
3. **Error Handling**: Consistent error patterns
4. **Loading States**: Proper loading management

### Exercise 5.1: Create a New Hook
```typescript
// Create a hook for product search
export const useProductSearch = (searchTerm: string) => {
  const { data, loading, error } = useQuery(SEARCH_PRODUCTS, {
    variables: { searchTerm },
    skip: !searchTerm,
  });

  return {
    products: data?.products || [],
    loading,
    error
  };
};
```

### Exercise 5.2: Enhance Existing Hooks
```typescript
// Add pagination to useProducts
export const useProducts = (page: number = 1, limit: number = 10) => {
  const { data, loading, error, fetchMore } = useQuery(GET_PRODUCTS_PAGINATED, {
    variables: { page, limit },
  });

  const loadMore = () => {
    fetchMore({
      variables: { page: page + 1, limit },
    });
  };

  return { products, loading, error, loadMore };
};
```

**Questions:**
- Why use custom hooks instead of direct Apollo Client calls?
- How do hooks improve code reusability?

## 📚 Module 6: Cache Management

### Study: Apollo Client Cache Configuration

**Key Concepts:**

1. **Type Policies**: Custom behavior for different types
2. **Normalization**: ID-based cache normalization
3. **Merge Functions**: Handle data merging scenarios
4. **Field Policies**: Custom field behavior

### Exercise 6.1: Add Cache Policies
```typescript
// Add cache policy for categories
const cache = new InMemoryCache({
  typePolicies: {
    Category: {
      fields: {
        products: {
          merge(existing = [], incoming) {
            return [...existing, ...incoming];
          },
        },
      },
    },
  },
});
```

### Exercise 6.2: Implement Cache Persistence
```typescript
// Add cache persistence
import { persistCache, LocalStorageWrapper } from 'apollo3-cache-persist';

persistCache({
  cache,
  storage: new LocalStorageWrapper(window.localStorage),
});
```

**Questions:**
- How does cache normalization improve performance?
- When should you use custom merge functions?

## 📚 Module 7: Error Handling

### Study: Error Handling Patterns in Components

**Best Practices Demonstrated:**

1. **Consistent Error UI**: Standardized error display
2. **Loading States**: Clear loading indicators
3. **Graceful Degradation**: Handle partial data
4. **User Feedback**: Clear error messages

### Exercise 7.1: Enhance Error Handling
```typescript
// Create a reusable error boundary
class GraphQLErrorBoundary extends React.Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return <ErrorDisplay error={this.state.error} />;
    }
    return this.props.children;
  }
}
```

### Exercise 7.2: Add Retry Logic
```typescript
// Add retry functionality to queries
const { data, loading, error, refetch } = useQuery(GET_PRODUCTS, {
  errorPolicy: 'all',
  notifyOnNetworkStatusChange: true,
});

const handleRetry = () => {
  refetch();
};
```

**Questions:**
- Why is `errorPolicy: 'all'` important?
- How do you handle network errors vs GraphQL errors?

## 📚 Module 8: Performance Optimization

### Study: Performance Patterns

**Key Concepts:**

1. **Fetch Policies**: Choose appropriate fetch strategies
2. **Field Selection**: Only request needed data
3. **Cache Optimization**: Proper cache configuration
4. **Lazy Loading**: Load data on demand

### Exercise 8.1: Implement Lazy Loading
```typescript
// Implement infinite scroll for products
const { data, loading, fetchMore } = useQuery(GET_PRODUCTS_PAGINATED, {
  variables: { page: 1, limit: 10 },
});

const loadMore = () => {
  fetchMore({
    variables: { page: Math.ceil(data.products.length / 10) + 1 },
  });
};
```

### Exercise 8.2: Add Query Deduplication
```typescript
// Ensure queries are deduplicated
const { data } = useQuery(GET_PRODUCTS, {
  fetchPolicy: 'cache-and-network',
  notifyOnNetworkStatusChange: true,
});
```

**Questions:**
- When should you use `cache-first` vs `cache-and-network`?
- How does field selection impact performance?

## 📚 Module 9: Authentication

### Study: `src/hooks/useAuth.ts`

**Best Practices Demonstrated:**

1. **Context-based State**: Centralized auth management
2. **Token Management**: Automatic token handling
3. **Protected Routes**: Route-level authentication
4. **Persistent Sessions**: Local storage integration

### Exercise 9.1: Add Token Refresh
```typescript
// Implement token refresh logic
const refreshToken = async () => {
  try {
    const { data } = await refreshTokenMutation();
    localStorage.setItem('authToken', data.refreshToken.token);
    return data.refreshToken.token;
  } catch (error) {
    logout();
    throw error;
  }
};
```

### Exercise 9.2: Add Role-based Access
```typescript
// Add role-based component rendering
const ProtectedComponent = ({ roles, children }) => {
  const { user } = useAuth();
  
  if (!user || !roles.includes(user.role)) {
    return <AccessDenied />;
  }
  
  return children;
};
```

**Questions:**
- How does the auth context work?
- Why store tokens in localStorage vs sessionStorage?

## 📚 Module 10: Advanced Patterns

### Exercise 10.1: Implement Subscriptions
```typescript
// Add real-time product updates
const { data } = useSubscription(PRODUCT_UPDATED, {
  variables: { productId },
  onData: ({ data }) => {
    // Update cache with new product data
    cache.modify({
      id: cache.identify({ __typename: 'Product', id: productId }),
      fields: {
        stockQuantity: () => data.productUpdated.stockQuantity,
      },
    });
  },
});
```

### Exercise 10.2: Add Offline Support
```typescript
// Implement offline capabilities
import { ApolloOfflineClient } from 'apollo-offline-client';

const offlineClient = new ApolloOfflineClient({
  cache,
  link: httpLink,
  storage: new LocalStorageWrapper(window.localStorage),
});
```

## 🎯 Practical Exercises

### Exercise A: Add Product Reviews
1. Create a new GraphQL query for product reviews
2. Add a mutation for creating reviews
3. Implement the UI components
4. Add cache updates for the new data

### Exercise B: Implement Shopping Cart Persistence
1. Store cart data in localStorage
2. Sync cart data on app startup
3. Handle cart conflicts between devices
4. Add cart expiration logic

### Exercise C: Add Product Search and Filtering
1. Create search queries with variables
2. Implement debounced search input
3. Add filter by category, price, etc.
4. Optimize search performance

### Exercise D: Create a Wishlist Feature
1. Add wishlist mutations and queries
2. Implement wishlist UI components
3. Add wishlist to cart functionality
4. Handle wishlist synchronization

## 🔍 Code Review Checklist

When reviewing GraphQL frontend code, check for:

- [ ] Proper field selection (no over-fetching)
- [ ] Appropriate fetch policies
- [ ] Error handling and loading states
- [ ] Cache updates after mutations
- [ ] Type safety with TypeScript
- [ ] Optimistic updates where appropriate
- [ ] Consistent error patterns
- [ ] Performance optimizations
- [ ] Authentication and authorization
- [ ] Responsive design and UX

## 📖 Additional Resources

1. **Apollo Client Documentation**: https://www.apollographql.com/docs/react/
2. **GraphQL Best Practices**: https://graphql.org/learn/best-practices/
3. **React TypeScript Cheatsheet**: https://react-typescript-cheatsheet.netlify.app/
4. **Apollo Client Cache**: https://www.apollographql.com/docs/react/caching/overview/

## 🎓 Assessment Questions

1. **What are the benefits of using Apollo Client over plain fetch?**
2. **How does cache normalization improve performance?**
3. **When should you use optimistic updates?**
4. **What's the difference between `cache-first` and `cache-and-network`?**
5. **How do you handle authentication in GraphQL applications?**
6. **What are the best practices for error handling in GraphQL?**
7. **How do you implement real-time updates with GraphQL?**
8. **What are the performance considerations when designing GraphQL queries?**

---

**Happy Learning! 🚀**

This training guide provides a comprehensive path to mastering GraphQL frontend development. Take your time with each module and practice the exercises to reinforce your understanding. 