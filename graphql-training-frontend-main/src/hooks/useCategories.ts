import { useQuery, useMutation } from '@apollo/client';
import { GET_CATEGORIES, GET_CATEGORY } from '../graphql/queries';
import { CREATE_CATEGORY } from '../graphql/mutations';
import type { 
  GetCategoriesData, 
  GetCategoryData, 
  GetCategoryVariables
} from '../graphql/queries';
import type {
  CreateCategoryData,
  CreateCategoryVariables,
  CreateCategoryInput
} from '../graphql/mutations';

export const useCategories = () => {
  const { data, loading, error, refetch } = useQuery<GetCategoriesData>(GET_CATEGORIES, {
  fetchPolicy: 'network-only', // Used for first execution
  nextFetchPolicy: 'cache-first',
    errorPolicy: 'all',
  });

  const [createCategoryMutation, { loading: createLoading }] = useMutation<CreateCategoryData, CreateCategoryVariables>(
    CREATE_CATEGORY,
    {
      update: (cache, { data }) => {
        if (data?.createCategory) {
          const existingCategories = cache.readQuery<GetCategoriesData>({ query: GET_CATEGORIES });
          
          if (existingCategories) {
            cache.writeQuery<GetCategoriesData>({
              query: GET_CATEGORIES,
              data: {
                categories: [...existingCategories.categories, data.createCategory]
              }
            });
          }
        }
      },
      refetchQueries: [{ query: GET_CATEGORIES }]
    }
  );

  const createCategory = async (input: CreateCategoryInput) => {
    try {
      const { data } = await createCategoryMutation({
        variables: { input }
      });
      return data?.createCategory;
    } catch (error) {
      console.error('Error creating category:', error);
      throw error;
    }
  };

  return {
    categories: data?.categories || [],
    loading,
    error,
    refetch,
    createCategory,
    createLoading
  };
};

export const useCategory = (id: string) => {
  const { data, loading, error } = useQuery<GetCategoryData, GetCategoryVariables>(
    GET_CATEGORY,
    {
      variables: { id },
      fetchPolicy: 'cache-first',
      errorPolicy: 'all',
      skip: !id,
    }
  );

  return {
    category: data?.category || null,
    loading,
    error
  };
}; 