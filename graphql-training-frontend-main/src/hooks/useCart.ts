import { useQuery, useMutation } from '@apollo/client';
import { GET_CART } from '../graphql/queries';
import { ADD_TO_CART, REMOVE_FROM_CART } from '../graphql/mutations';
import type { 
  GetCartData, 
  GetCartVariables
} from '../graphql/queries';
import type {
  AddToCartData,
  AddToCartVariables,
  RemoveFromCartData,
  RemoveFromCartVariables,
  AddToCartInput
} from '../graphql/mutations';

export const useCart = (userId: string) => {
  const { data, loading, error, refetch } = useQuery<GetCartData, GetCartVariables>(
    GET_CART,
    {
      variables: { userId },
      fetchPolicy: 'cache-and-network',
      errorPolicy: 'all',
      skip: !userId,
    }
  );

  const [addToCartMutation, { loading: addLoading }] = useMutation<AddToCartData, AddToCartVariables>(
    ADD_TO_CART,
    {
      update: (cache, { data }) => {
        if (data?.addToCart) {
          // Update cart in cache
          cache.writeQuery<GetCartData, GetCartVariables>({
            query: GET_CART,
            variables: { userId },
            //@ts-ignore
            data: { cart: data.addToCart }
          });
        }
      },
      onError: (error) => {
        console.error('Error adding to cart:', error);
      }
    }
  );

  const [removeFromCartMutation, { loading: removeLoading }] = useMutation<RemoveFromCartData, RemoveFromCartVariables>(
    REMOVE_FROM_CART,
    {
      update: (cache, { data }) => {
        if (data?.removeFromCart) {
          // Update cart in cache
          cache.writeQuery<GetCartData, GetCartVariables>({
            query: GET_CART,
            variables: { userId },
            //@ts-ignore
            data: { cart: data.removeFromCart }
          });
        }
      },
      onError: (error) => {
        console.error('Error removing from cart:', error);
      }
    }
  );

  const addToCart = async (input: AddToCartInput) => {
    try {
      const { data } = await addToCartMutation({
        variables: { userId, input }
      });
      return data?.addToCart;
    } catch (error) {
      console.error('Error adding to cart:', error);
      throw error;
    }
  };

  const removeFromCart = async (cartItemId: string) => {
    try {
      const { data } = await removeFromCartMutation({
        variables: { userId, cartItemId }
      });
      return data?.removeFromCart;
    } catch (error) {
      console.error('Error removing from cart:', error);
      throw error;
    }
  };

  return {
    cart: data?.cart || null,
    loading,
    error,
    refetch,
    addToCart,
    removeFromCart,
    addLoading,
    removeLoading
  };
}; 