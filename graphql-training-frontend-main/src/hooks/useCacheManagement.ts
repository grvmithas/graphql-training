import { useCallback } from 'react';
import { useApolloClient } from '@apollo/client';
import { clearPersistedCache, pauseCachePersistence, resumeCachePersistence } from '../lib/apollo-client';

export const useCacheManagement = () => {
  const client = useApolloClient();

  const clearCache = useCallback(async () => {
    try {
      await clearPersistedCache();
      await client.resetStore();
      console.log('Cache cleared and store reset');
    } catch (error) {
      console.error('Error clearing cache:', error);
    }
  }, [client]);

  const refetchAllQueries = useCallback(async () => {
    try {
      await client.refetchQueries({ include: 'active' });
      console.log('All active queries refetched');
    } catch (error) {
      console.error('Error refetching queries:', error);
    }
  }, [client]);

  const pausePersistence = useCallback(() => {
    pauseCachePersistence();
  }, []);

  const resumePersistence = useCallback(() => {
    resumeCachePersistence();
  }, []);

  const getCacheSize = useCallback(() => {
    const cacheData = client.cache.extract();
    const cacheString = JSON.stringify(cacheData);
    const sizeInBytes = new Blob([cacheString]).size;
    const sizeInKB = (sizeInBytes / 1024).toFixed(2);
    const sizeInMB = (sizeInBytes / (1024 * 1024)).toFixed(2);
    
    return {
      bytes: sizeInBytes,
      kb: sizeInKB,
      mb: sizeInMB
    };
  }, [client]);

  return {
    clearCache,
    refetchAllQueries,
    pausePersistence,
    resumePersistence,
    getCacheSize
  };
};
