import { 
  ApolloClient, 
  InMemoryCache, 
  createHttpLink, 
  from,
  type TypePolicies
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';
import { RetryLink } from '@apollo/client/link/retry';
import { createPersistedQueryLink } from '@apollo/client/link/persisted-queries';
import { CachePersistor, LocalStorageWrapper } from 'apollo3-cache-persist';
import { relayStylePagination } from '@apollo/client/utilities';
import { sha256 } from 'crypto-hash';

interface AuthHeaders {
  headers: {
    authorization?: string;
    'Apollo-Require-Preflight'?: string;
    'x-csrf-token'?: string;
  };
}

// HTTP Link
const httpLink = createHttpLink({
  uri: import.meta.env.VITE_GRAPHQL_ENDPOINT || 'http://localhost:4000/graphql',
  //credentials: 'include',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Auth Link
const authLink = setContext((_, { headers }): AuthHeaders => {
  const token = localStorage.getItem('authToken');
  const csrfToken = localStorage.getItem('csrfToken');
  
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
      'x-csrf-token': csrfToken || '',
      'Apollo-Require-Preflight': 'true',
      
    }
  };
});

// Enhanced Error Link
const errorLink = onError(({ graphQLErrors, networkError, operation }) => {
  const { operationName } = operation;
  
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message, locations, path, extensions }) => {
      console.error(
        `[GraphQL error in ${operationName}]: ${message}`,
        { locations, path, extensions }
      );
      
      if (extensions?.code === 'UNAUTHENTICATED') {
        // Handle unauthorized errors
        localStorage.removeItem('authToken');
        window.location.href = '/login';
      }
    });
  }

  if (networkError) {
    console.error(`[Network error in ${operationName}]: ${networkError}`);
    
    if ('statusCode' in networkError && networkError.statusCode === 401) {
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
  }
});

// Enhanced Retry Link with exponential backoff
const retryLink = new RetryLink({
  delay: {
    initial: 300,
    max: 5000,
    jitter: true
  },
  
  attempts: {
    max: 5,
    retryIf: (error) => {
      // Don't retry 4xx errors except 408, 429
      if (error && 'statusCode' in error) {
        const code = error.statusCode;
        return code === 408 || code === 429 || code >= 500;
      }
      return true;
    }
  }
});

// Persisted Queries
const persistedQueriesLink = createPersistedQueryLink({
  sha256,
  useGETForHashedQueries: true,
});

// Enhanced Cache Configuration
const typePolicies: TypePolicies = {
  Query: {
    fields: {
      products: {  merge(existing = [], incoming) {
          return incoming;
        }},
      categories:{ merge(existing = [], incoming) {
          return incoming;
        }}
    }
  },
  Cart: {
    fields: {
      items: {
        merge(existing = [], incoming) {
          return incoming;
        }
      }
    }
  },
  Product: {
    fields: {
      category: {
        merge: true
      }
    }
  },
  User: {
    keyFields: ['id']
  },
  CartItem: {
    keyFields: ['id']
  }
};

const possibleTypes = {
  // Example:
  // SearchResult: ['Product', 'Category', 'User']
};

const cache = new InMemoryCache({
  typePolicies,
  possibleTypes,
});

// Link chain with proper ordering
const link = from([
  persistedQueriesLink,
  errorLink,
  retryLink,
  authLink,
  httpLink
]);

// Apollo Client instance
export const apolloClient = new ApolloClient({
  link,
  cache,
  defaultOptions: {
    watchQuery: {
      errorPolicy: 'all',
      fetchPolicy: 'cache-and-network',
      notifyOnNetworkStatusChange: true,
      returnPartialData: true
    },
    query: {
      errorPolicy: 'all',
      fetchPolicy: 'cache-first'
    },
    mutate: {
      errorPolicy: 'all'
    }
  },
  connectToDevTools: import.meta.env.MODE === 'development',
  assumeImmutableResults: true,
  name: 'graphql-training-app',
  version: import.meta.env.VITE_VERSION || '1.0.0'
});

// Enhanced Cache Persistence with proper error handling
let persistor: CachePersistor<any> | null = null;

const initializeCachePersistence = async (): Promise<void> => {
  if (typeof window === 'undefined' || import.meta.env.MODE === 'test') {
    return;
  }

  try {
    persistor = new CachePersistor({
      cache,
      storage: new LocalStorageWrapper(window.localStorage),
      maxSize: 2 * 1024 * 1024, // 2MB
      debug: import.meta.env.MODE === 'development',
      trigger: 'write', // Persist on every cache write
    });

    // Restore cache from storage
    await persistor.restore();
    console.log('Apollo Cache restored successfully');

    // Optional: Set up cache purging on app version change
    const currentVersion = import.meta.env.VITE_VERSION || '1.0.0';
    const storedVersion = localStorage.getItem('app-version');
    
    if (storedVersion && storedVersion !== currentVersion) {
      await persistor.purge();
      localStorage.setItem('app-version', currentVersion);
      console.log('Cache purged due to version change');
    } else if (!storedVersion) {
      localStorage.setItem('app-version', currentVersion);
    }

  } catch (error) {
    console.error('Error initializing Apollo Cache persistence:', error);
    
    // Clear cache and localStorage if persistence fails
    try {
      await cache.reset();
      localStorage.removeItem('apollo-cache-persist');
      console.log('Cache reset due to persistence error');
    } catch (resetError) {
      console.error('Error resetting cache:', resetError);
    }
  }
};

// Initialize cache persistence
//initializeCachePersistence();

// Export persistor for manual cache management
export { persistor };


// Utility functions for cache management
export const clearPersistedCache = async (): Promise<void> => {
  if (persistor) {
    try {
      await persistor.purge();
      await cache.reset();
      console.log('Persisted cache cleared successfully');
    } catch (error) {
      console.error('Error clearing persisted cache:', error);
    }
  }
};

export const pauseCachePersistence = (): void => {
  if (persistor) {
    persistor.pause();
    console.log('Cache persistence paused');
  }
};

export const resumeCachePersistence = (): void => {
  if (persistor) {
    persistor.resume();
    console.log('Cache persistence resumed');
  }
};
