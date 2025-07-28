import { useQuery, useMutation } from '@apollo/client';
import { GET_PRODUCTS, GET_PRODUCT } from '../graphql/queries';
import { CREATE_PRODUCT } from '../graphql/mutations';
import type { 
  GetProductsData, 
  GetProductData, 
  GetProductVariables
} from '../graphql/queries';
import type {
  CreateProductData,
  CreateProductVariables,
  CreateProductInput
} from '../graphql/mutations';

export const useProducts = () => {
  const { data, loading, error, refetch } = useQuery<GetProductsData>(GET_PRODUCTS, {
    fetchPolicy: 'cache-and-network', // Best practice: always fetch fresh data but show cached data first
    errorPolicy: 'all',
  });

  const [createProductMutation, { loading: createLoading }] = useMutation<CreateProductData, CreateProductVariables>(
    CREATE_PRODUCT,
    {
      // Update cache after creating a product
      update: (cache, { data }) => {
        if (data?.createProduct) {
          // Read existing products from cache
          const existingProducts = cache.readQuery<GetProductsData>({ query: GET_PRODUCTS });
          
          if (existingProducts) {
            // Write back to cache with new product
            cache.writeQuery<GetProductsData>({
              query: GET_PRODUCTS,
              data: {
                products: [...existingProducts.products, data.createProduct]
              }
            });
          }
        }
      },
      // Refetch products after mutation
      refetchQueries: [{ query: GET_PRODUCTS }]
    }
  );

  const createProduct = async (input: CreateProductInput) => {
    try {
      const { data } = await createProductMutation({
        variables: { input }
      });
      return data?.createProduct;
    } catch (error) {
      console.error('Error creating product:', error);
      throw error;
    }
  };

  return {
    products: data?.products || [],
    loading,
    error,
    refetch,
    createProduct,
    createLoading
  };
};

export const useProduct = (id: string) => {
  const { data, loading, error } = useQuery<GetProductData, GetProductVariables>(
    GET_PRODUCT,
    {
      variables: { id },
      fetchPolicy: 'cache-first', // Use cache first for individual product queries
      errorPolicy: 'all',
      skip: !id, // Skip query if no ID provided
    }
  );

  return {
    product: data?.product || null,
    loading,
    error
  };
}; 