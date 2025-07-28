import { ApolloClient, InMemoryCache, createHttpLink, from } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';

// HTTP Link for GraphQL endpoint
const httpLink = createHttpLink({
  uri: 'http://localhost:4000/graphql', // Update this to match your backend URL
});

// Error handling link
const errorLink = onError(({ graphQLErrors, networkError, operation, forward }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message, locations, path }) => {
      console.error(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
      );
    });
  }

  if (networkError) {
    console.error(`[Network error]: ${networkError}`);
  }
});

// Authentication link to add auth token to headers
const authLink = setContext((_, { headers }) => {
  // Get the authentication token from local storage if it exists
  const token = localStorage.getItem('authToken');
  
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    }
  };
});

// Cache configuration with type policies for better cache management
const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        products: {
          // Merge function for products to handle pagination
          merge(existing = [], incoming) {
            return incoming;
          },
        },
        categories: {
          merge(existing = [], incoming) {
            return incoming;
          },
        },
      },
    },
    Product: {
      fields: {
        // Ensure product cache is normalized by ID
        id: {
          read(id: string) {
            return id;
          },
        },
      },
    },
    Cart: {
      fields: {
        items: {
          merge(existing = [], incoming) {
            return incoming;
          },
        },
      },
    },
  },
});

// Create Apollo Client instance
export const apolloClient = new ApolloClient({
  link: from([errorLink, authLink, httpLink]),
  cache,
  defaultOptions: {
    watchQuery: {
      errorPolicy: 'all',
      fetchPolicy: 'cache-and-network',
    },
    query: {
      errorPolicy: 'all',
      fetchPolicy: 'cache-first',
    },
    mutate: {
      errorPolicy: 'all',
    },
  },
}); 